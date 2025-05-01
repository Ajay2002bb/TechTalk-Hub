# TechTalk-Hub | SOF Clone | MERN-GraphQL

Fullstack [Stack Overflow](https://stackoverflow.com/) clone (QnA site) made with MERN + GraphQL

## Built using

#### Front-end

- [ReactJS](https://reactjs.org/) - Frontend framework
- [Apollo Client](https://www.apollographql.com/docs/react/) - State management library to manage both local and remote data with GraphQL
- [Context API w/ hooks](https://reactjs.org/docs/context.html) - For state of user, toast notifs, theme etc.
- [React Router](https://reactrouter.com/) - For general routing & navigation
- [React Hook Form](https://react-hook-form.com/) - For flexible forms
- [Material-UI w/ lots of CSS customisations](https://material-ui.com/) - UI library
- [Yup](https://github.com/jquense/yup) - For form validation
- [date-fns](https://date-fns.org/) - For manipulating & formatting of dates

#### Back-end

- [Node.js](https://nodejs.org/en/) - Runtime environment for JS
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/) - To build a self-documenting GraphQL API server
- [MongoDB](https://www.mongodb.com/) - Database to store document-based data
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node.js
- [JSON Web Token](https://jwt.io/) - A standard to secure/authenticate HTTP requests
- [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) - For hashing passwords
- [Mongoose Unique Validator](https://www.npmjs.com/package/mongoose-unique-validator) - Plugin for better error handling of unique fields within Mongoose schema
- [Dotenv](https://www.npmjs.com/package/dotenv) - To load environment variables from a .env file

## Features

- **Authentication**: Login and register with a username and password using JWT-based authentication.
- **CRUD Operations**: Users can create, read, update, and delete questions, answers, and comments.
- **Upvote/Downvote**: Ability to upvote or downvote both questions and answers to manage content quality.
- **Tagging**: Organize questions using tags for better categorization and navigation.
- **Page Views**: Each question page registers a page view when opened, helping track content engagement.
- **Sorting**: Sort questions based on:
  - Hot (most upvoted and active questions)
  - Votes (questions with the most votes)
  - Views (questions with the most views)
  - Newest (most recently asked questions)
  - Oldest (questions listed by creation date)
- **Search Functionality**: Search questions over the server based on question title and body text.
- **Pagination**: Questions are paginated with a "Load More" button to load more posts dynamically.
- **Error Handling**: Graceful error management to prevent app crashes and provide helpful feedback.
- **Toast Notifications**: Real-time toast notifications for actions like adding questions, deleting comments, etc.
- **Loading Spinners**: Visible spinners during data fetching processes for better user experience.
- **Formatted Dates**: Display questions, answers, and comments with human-readable formatted dates (e.g., "2 hours ago").
- **Dark Mode**: Toggle dark mode with settings saved in local storage for persistent user preferences.
- **Responsive UI**: A fully responsive design ensuring smooth usability across all screen sizes.
- **Leaderboard**: A leaderboard section showcasing top users based on their activity and reputation.

## Sample 

!(https://github.com/Ajay2002bb/TechTalk-Hub/blob/main/Screenshot/Screenshot%20(12).png)

## Usage

#### Env variable:

Create a .env file in server directory and add the following:

```
MONGODB_URI = "Your Mongo URI"
PORT = 4000
SECRET = "Your JWT secret"

```

#### Client:

Open client/src/backendUrl.js & change "backend" variable to `"http://localhost:4000"`

```
cd client
npm install
npm start
```

#### Server:

Note: Make sure that you have installed 'nodemon' as global package.

```
cd server
npm install
npm run dev
```
