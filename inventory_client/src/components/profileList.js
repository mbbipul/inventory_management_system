import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import { Badge, Paper } from '@material-ui/core';
import { getStoreInfo } from '../utils/storeInfo';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    maxHeight : 300,
    backgroundColor: 'transparent',
    color : '#fff',
    overflowY : 'scroll',
    scrollbarWidth: 'none', /* Firefox */
    '-ms-overflow-style': 'none',  /* Internet Explorer 10+ */
  },
  profileText : {
    fontSize : 20,
    fontWeight : 900,
    color : '#fff'
  },
  profileSubText : {
    fontSize : 10,
    fontWeight : 100,
    color : '#fff'
  },
  paper : {
    backgroundColor: '#000000',
    opacity : 0.7,
    marginBottom : 10,
    borderRadius : 10,
    cursor : 'pointer',
    "&:hover": {
      backgroundColor: "green",
    }, 
    
    animation: `$enter 550ms ${theme.transitions.easing.easeInOut}` 
  },
  "@keyframes enter": {
    "0%": {
      transform: "scale(0)",
      opacity: 0.1
    },
    "100%": {
      transform: "scale(1)",
      opacity: 0.5
    }
  }
}));

export default function ProfileList(props) {
  const classes = useStyles();

  return (
    <List className={classes.root+" hidden-scrollbar"}>
        
            {
                props.users.map((user,i) => (
                    <Badge color="secondary" badgeContent={user.hasSuperAdminRole ? 'Admin' : null} key={i}>
                        <Paper  className={classes.paper} onClick={() => props.onProfileClick(user)}>
                            <ListItem>
                                <ListItemAvatar>
                                <Avatar>
                                    <ImageIcon />
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={
                                        <span className={classes.profileText}>
                                          {user.firstName +" "+user.lastName}{<span className={classes.profileSubText}>-{getStoreInfo(user.adminRole)}</span>}</span>
                                    } 
                                    secondary={
                                        <span className={classes.profileText}>Jan 9, 2014</span>
                                    } 
                                />
                            </ListItem>
                        </Paper>
                    </Badge>
                ))
            }
    </List>
  );
}
