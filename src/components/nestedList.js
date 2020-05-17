import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function NestedList(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

 
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
            <i class="material-icons md-24">{props.item.icon}</i>
        </ListItemIcon>
        <ListItemText primary={props.item.name} />
        {
           props.item.hasItems ? ( open ? <ExpandLess /> : <ExpandMore />) : ("")
        }
      </ListItem>
      {
          props.item.hasItems ? (
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                {
                    props.item.subItems.map((sub,index) =>(
                    
                        <ListItem key={index} button className={classes.nested}>
                            <ListItemText primary={sub.name} />
                        </ListItem>
                    
                    ))
                }
                </List>
            </Collapse>
          ) : ("")
      }
    </List>
  );
}