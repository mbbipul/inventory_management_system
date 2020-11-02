import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import { Badge, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'transparent',
    color : '#fff'
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
    borderRadius : 10
    
  }
}));

export default function ProfileList() {
  const classes = useStyles();

  return (
    <List className={classes.root}>
        
            {
                [1,2,3].map(v => (
                    <Badge color="secondary" badgeContent="super">
                        <Paper className={classes.paper}>
                            <ListItem>
                                <ListItemAvatar>
                                <Avatar>
                                    <ImageIcon />
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={
                                        <span className={classes.profileText}>Bipul Mandol{<span className={classes.profileSubText}>-Matrivander store</span>}</span>
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
