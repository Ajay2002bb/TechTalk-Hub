import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_TAGS, GET_TOP_USERS } from '../graphql/queries';
import { Link as RouterLink } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { useStateContext } from '../context/state';
import { getErrorMsg } from '../utils/helperFuncs';

import { 
  Typography, Chip, Avatar, Grid, Button, useMediaQuery 
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useRightSidePanelStyles } from '../styles/muiStyles';

const RANK_ICONS = ['🥇', '🥈', '🥉']; // Icons for top 3 users
const MAX_VISIBLE_ITEMS = 3; // Limit for tags & users

const RightSidePanel = () => {
  const classes = useRightSidePanelStyles();
  const { notify } = useStateContext();
  const theme = useTheme();
  const isNotDesktop = useMediaQuery(theme.breakpoints.down('sm'));

  const [showAllTags, setShowAllTags] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);

  const { data: tagsData, loading: tagsLoading } = useQuery(GET_ALL_TAGS, {
    onError: (err) => notify(getErrorMsg(err), 'error'),
  });

  const { data: usersData, loading: usersLoading } = useQuery(GET_TOP_USERS, {
    variables: { limit: 10 },
    onError: (err) => notify(getErrorMsg(err), 'error'),
  });

  if (isNotDesktop) return null;

  return (
    <Grid item>
      <div className={classes.rootPanel}>
        <div className={classes.content}>
          <br />
          {/* Top Tags Section */}
          <TagsSection 
            tags={tagsData?.getAllTags || []} 
            loading={tagsLoading} 
            showAll={showAllTags} 
            toggleShowAll={() => setShowAllTags(!showAllTags)} 
          /><br />

          {/* Top Users Section */}
          <UsersSection 
            users={usersData?.topUsers || []} 
            loading={usersLoading} 
            showAll={showAllUsers} 
            toggleShowAll={() => setShowAllUsers(!showAllUsers)} 
          />
        </div>
      </div>
    </Grid>
  );
};

/* ✅ Tags Section Component */
const TagsSection = ({ tags, loading, showAll, toggleShowAll }) => {
  const classes = useRightSidePanelStyles();

  return (
  
    <div className={classes.section}>
      <Typography variant="h6" color="secondary" className={classes.sectionTitle}>
        🔖 Top Tags
      </Typography>

      {loading ? (
        <LoadingSpinner size={40} />
      ) : (
        <div className={classes.tagsGrid}>
          {(showAll ? tags : tags.slice(0, MAX_VISIBLE_ITEMS)).map((tag) => (
            <div key={tag.tagName} className={classes.tagContainer}>
              <Chip
                label={tag.tagName.length > 13 ? `${tag.tagName.slice(0, 13)}...` : tag.tagName}
                variant="outlined"
                color="primary"
                size="small"
                component={RouterLink}
                to={`/tags/${tag.tagName}`}
                className={classes.tag}
                clickable
              />
              <Typography color="secondary" variant="caption" className={classes.tagCount}>
                {` × ${tag.count}`}
              </Typography>
            </div>
          ))}
        </div>
      )}

      {tags.length > MAX_VISIBLE_ITEMS && (
        <Button size="small" onClick={toggleShowAll} className={classes.showMoreBtn}>
          {showAll ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </div>
  );
};


/* ✅ Users Section Component */
/* ✅ Users Section - Dream11 Style */
const UsersSection = ({ users, loading, showAll, toggleShowAll }) => {
  const classes = useRightSidePanelStyles();

  return (
    <div className={classes.section}>
      <Typography variant="h6" color="secondary">🏆 Leaderboard</Typography>
      
      {loading ? (
        <LoadingSpinner size={40} />
      ) : (
        <div className={classes.leaderboard}>
          {(showAll ? users : users.slice(0, MAX_VISIBLE_ITEMS)).map((user, index) => (
            <div key={user.id} className={`${classes.userItem} ${index < 3 ? classes.topUser : ''}`}>
              
              {/* Rank Badge (🏅 Gold, Silver, Bronze for Top 3) */}
              <div className={classes.rankBadge}>
                {RANK_ICONS[index] || `#${index + 1}`}
              </div>

              {/* Avatar & User Info */}
              <Avatar 
                alt={user.username} 
                src={user.avatarUrl || '/default-avatar.png'} 
                className={classes.avatar}
              />

              <div className={classes.userDetails}>
                <RouterLink to={`/user/${user.username}`} className={classes.userLink}>
                  {user.username}
                </RouterLink>
                <div className={classes.userStats}>
                  ⭐ {user.reputation} | ❓ {user.totalQuestions} | 💬 {user.totalAnswers}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show More / Show Less Button */}
      {users.length > MAX_VISIBLE_ITEMS && (
        <Button size="small" onClick={toggleShowAll} className={classes.showMoreBtn}>
          {showAll ? 'Show Less' : 'Show More'}
        </Button>
      )}
    </div>
  );
};


export default RightSidePanel;
