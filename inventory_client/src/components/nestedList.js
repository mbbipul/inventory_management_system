import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {List,Popover} from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { useSelector } from 'react-redux';
import isAppDrawerSideExtend from '../reducers/appDrawer';


import {
  Link,
  useRouteMatch
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    color: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function NestedList(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  let {  url } = useRouteMatch();


  const handleClick = () => {
    if (isAppDrawerSideBarExtends){
      setOpen(!open);
    }
  };

  
  const popover = (event) => {
    if(!isAppDrawerSideExtend){
      setAnchorEl(null);
    }
    else if(isAppDrawerSideExtend){
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const id = Boolean(anchorEl) ? 'simple-popover' : undefined;
  const isAppDrawerSideBarExtends = useSelector(state => state.isSideBarExtend);

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
    //   subheader={
    //     <ListSubheader component="div" id="nested-list-subheader">
    //       Nested List Items
    //     </ListSubheader>
    //   }
      className={classes.root}
    >
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
            <i onClick={popover}  class="material-icons md-24 md-light">{props.item.icon}</i>
        </ListItemIcon>
        <Link style={{textDecoration: "none",color:"#fff"}} to={props.item.ref}  >
          <ListItemText primary={props.item.name} />
        </Link>
        {
           props.item.hasItems ? ( open ? <ExpandLess /> : <ExpandMore />) : ("")
        }
      </ListItem>
     
      {
          props.item.hasItems && isAppDrawerSideBarExtends ? (
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                {
                    props.item.subItems.map((sub,index) =>(
                      <Link style={{textDecoration: "none",color:"#fff"}} to={url+sub.ref} >
                        <ListItem key={index} button className={classes.nested}>
                              <ListItemText primary={sub.name} />
                        </ListItem>
                      </Link>

                    ))
                }
                </List>
            </Collapse>
          ) : ("")
      }
        {!isAppDrawerSideBarExtends && props.item.hasItems ? (
      <Popover

        style={{marginLeft:"2.5vh"}}
        id={id}
        open={(Boolean(anchorEl) && isAppDrawerSideExtend)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <List style={{backgroundColor: "#0c0c4b",color:"#fff"}}>
          { props.item.subItems.map( (sub,index) => (
            <Link style={{textDecoration: "none",color:"#fff"}} to={url+sub.ref} >
              <ListItem key={index} button className={classes.nested}>
                    <ListItemText primary={sub.name} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Popover>
       ) : null}
    </List>
  );
}