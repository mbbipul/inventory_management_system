import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {Drawer} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import {sideBarItems} from './appbarItems';
import '../../App.css';

import NestedList from '../../components/nestedList';
import { useSelector , useDispatch} from 'react-redux';
import {extendAppDrawerSideBar,collapseAppDrawerSideBar} from '../../actions';

import Badge from '@material-ui/core/Badge';
import ShopTwoOutlinedIcon from '@material-ui/icons/ShopTwoOutlined';
import ShoppingBasketOutlinedIcon from '@material-ui/icons/ShoppingBasketOutlined';

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "#060620",
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
   
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  rightToolbar: {
    marginLeft: "auto",
    marginRight: 30
  },
}));

export default function AppDrawer() {

   
  const classes = useStyles();
  const theme = useTheme();
  const open = useSelector(state => state.isSideBarExtend);
  const dispatch = useDispatch();

  const handleDrawerOpen = () => {
    dispatch(extendAppDrawerSideBar());
  };

  const handleDrawerClose = () => {
    dispatch(collapseAppDrawerSideBar());
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                        [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.flexGrow }>
                        Inventory Mangement System
                    </Typography>

                    <section className={classes.rightToolbar}>
                      <IconButton  aria-label="show 4 new mails" color="inherit">
                        <Badge badgeContent={4} color="secondary">
                          <ShopTwoOutlinedIcon />
                        </Badge>
                      </IconButton>
                      <IconButton  aria-label="show 4 new mails" color="inherit">
                        <Badge badgeContent={300} color="secondary">
                          <ShoppingBasketOutlinedIcon />
                        </Badge>
                      </IconButton>
                    </section>

                </Toolbar>
            </AppBar>
      <Drawer
        variant="permanent"
        style={{backgroundColor: "#000!important"}}
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon style={{color:"#fff"}}/> : <ChevronLeftIcon style={{color:"#fff"}}/>}
          </IconButton>
        </div>
        <Divider />
        <List>
          {sideBarItems.map((item, index) => (
            <NestedList key={item.name} hasSubItems={true} item={item}/>
          ))}
        </List>
      </Drawer>
    </div>
  );
}

