const User = require('../../models/user');
const Question = require('../../models/question');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerValidator, loginValidator } = require('../../utils/validators');
const { UserInputError } = require('apollo-server');
const { SECRET } = require('../../utils/config');

// A helper function to compute reputation for a user.
// This example assumes that each question and answer in the user document contains a "rep" property.
const computeReputation = (user) => {
  const questionRep = user.questions && user.questions.length > 0
    ? user.questions.reduce((sum, q) => sum + (q.rep || 0), 0)
    : 0;
  const answerRep = user.answers && user.answers.length > 0
    ? user.answers.reduce((sum, a) => sum + (a.rep || 0), 0)
    : 0;
  return 1 + questionRep + answerRep;
};

module.exports = {
  Query: {
    getUser: async (_, args) => {
      const { username } = args;

      if (username.trim() === '') {
        throw new UserInputError('Username must be provided.');
      }

      const user = await User.findOne({
        username: { $regex: new RegExp('^' + username + '$', 'i') },
      });

      if (!user) {
        throw new UserInputError(`User '${username}' does not exist.`);
      }

      const recentQuestions = await Question.find({ author: user._id })
        .sort({ createdAt: -1 })
        .select('id title points createdAt')
        .limit(5);

      const recentAnswers = await Question.find({
        answers: { $elemMatch: { author: user._id } },
      })
        .sort({ createdAt: -1 })
        .select('id title points createdAt')
        .limit(5);

      return {
        id: user._id,
        username: user.username,
        role: user.role,
        questions: user.questions,
        answers: user.answers,
        createdAt: user.createdAt,
        recentQuestions,
        recentAnswers,
      };
    },
    getAllUsers: async () => {
      const allUsers = await User.find({}).select('username createdAt');
      return allUsers;
    },
    // <<-- ADD THE NEW TOP USERS QUERY HERE -->>  
    topUsers: async (_, { limit = 5 }) => {
      try {
        // Fetch all users from the database
        const users = await User.find({});
        // Compute reputation for each user and sort in descending order
        const sortedUsers = users.sort((a, b) => computeReputation(b) - computeReputation(a));
        // Return only the top 'limit' users
        return sortedUsers.slice(0, limit);
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      const { username, password } = args;
      const { errors, valid } = registerValidator(username, password);

      if (!valid) {
        throw new UserInputError(Object.values(errors)[0], { errors });
      }

      const existingUser = await User.findOne({
        username: { $regex: new RegExp('^' + username + '$', 'i') },
      });

      if (existingUser) {
        throw new UserInputError(`Username '${username}' is already taken.`);
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = new User({
        username,
        passwordHash,
      });

      const savedUser = await user.save();
      const token = jwt.sign(
        {
          id: savedUser._id,
        },
        SECRET
      );

      return {
        id: savedUser._id,
        username: savedUser.username,
        role: savedUser.role,
        token,
      };
    },

    login: async (_, args) => {
      const { username, password } = args;
      const { errors, valid } = loginValidator(username, password);

      if (!valid) {
        throw new UserInputError(Object.values(errors)[0], { errors });
      }

      const user = await User.findOne({
        username: { $regex: new RegExp('^' + username + '$', 'i') },
      });

      if (!user) {
        throw new UserInputError(`User: '${username}' not found.`);
      }

      const credentialsValid = await bcrypt.compare(
        password,
        user.passwordHash
      );

      if (!credentialsValid) {
        throw new UserInputError('Invalid credentials.');
      }

      const token = jwt.sign(
        {
          id: user._id,
        },
        SECRET
      );

      return {
        id: user._id,
        username: user.username,
        role: user.role,
        token,
      };
    },
  },
};
