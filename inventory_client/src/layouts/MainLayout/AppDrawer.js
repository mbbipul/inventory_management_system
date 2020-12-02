import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {Collapse, Drawer, ListItem, ListItemText, Menu, MenuItem, Select} from '@material-ui/core';
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
import { Link, Redirect } from 'react-router-dom';
import AppContext, { AppContextConsumer } from '../../context/appContext';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import CreditCardOutlinedIcon from '@material-ui/icons/CreditCardOutlined';
import { AccountCircle, ExpandLess, ExpandMore } from '@material-ui/icons';
import { useCookies } from 'react-cookie';
import { allStores, getStoreInfo,getStoreApiPath } from '../../utils/storeInfo';
import { clientApi, getCookie, parseCookie, removeCookie, setCookie } from '../../utils/apiInfo';


const drawerWidth = 200;

const appComfigs = {
  appBarBackground : "#000",
}
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: appComfigs.appBarBackground,
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
  menu: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function AppDrawer() {

  const classes = useStyles();
  const theme = useTheme();
  const open = useSelector(state => state.isSideBarExtend);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const [switchStore, setSwitchStore] = React.useState(false);
  const [redirect,setRedirect] = useState(false);

  const {  setUserLoginStatus , setUser ,setAppInfo} = React.useContext(AppContext);
  
  const handleSwitchStore = () => {
    setSwitchStore(!switchStore);
  };

  const handleLogout = () => {
    let user = parseCookie(getCookie("user-info"));
    if (user === null ){
      window.location.replace('/');
    }
    if(user.AdminRole === 999){
      removeCookie(getStoreInfo(0));
      removeCookie(getStoreInfo(1));
      removeCookie(getStoreInfo(2));
    }else{
      removeCookie(getStoreInfo(user.AdminRole));
    }
    removeCookie("user-info");
    setUserLoginStatus(false);
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const dispatch = useDispatch();

  const handleDrawerOpen = () => {
    dispatch(extendAppDrawerSideBar());
  };

  const handleDrawerClose = () => {
    dispatch(collapseAppDrawerSideBar());
  };


  const switchStoreClientApp = (id) => {
    let c_user = parseCookie(getCookie('user-info'));
    let switch_user = parseCookie(getCookie(getStoreInfo(id)));
    console.log({
      c_user,
      switch_user
    });
    if (switch_user !== null){
      if(c_user.UserEmail == switch_user.UserEmail ){
        setCookie('user-info',getCookie(getStoreInfo(id)),3);
        setCookie('api-path',getStoreApiPath(id),3);
        setUser(true);
        setAppInfo(id);
      }else{
        removeCookie('user-info');
        window.location.replace('/');
      }
    }else{
      removeCookie('user-info');
    }
    setRedirect(true);
  }

  useEffect(() => {
    setRedirect(false);
  },[redirect]);
  return (
    <div className={classes.root}>
      {
        redirect && <Redirect push to="/" />
      }
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
                         <AppContextConsumer >
                            {({appInfo}) => (
                              <b>{appInfo.appName}</b>
                            )}
                          </AppContextConsumer>
                    </Typography>

                    <section className={classes.rightToolbar}>
                      <Link style={{textDecoration: "none",color:"#fff"}} to={"/purchase/purchase-due-products"}  >
                        <IconButton  aria-label="purchase due" color="inherit">
                          <AppContextConsumer >
                            {({purDueNumber}) => (
                              <Badge badgeContent={purDueNumber} color="secondary">
                                <ShopTwoOutlinedIcon />
                              </Badge>
                            )}
                          </AppContextConsumer>
                        </IconButton>
                      </Link>
                      <Link style={{textDecoration: "none",color:"#fff"}} to={"/purchase/purchase-payment-due"}  >
                        <IconButton  aria-label="purchase payment due" color="inherit">
                          <AppContextConsumer >
                            {({purPaymentDue}) => (
                              <Badge badgeContent={purPaymentDue} color="secondary">
                                <AccountBalanceWalletOutlinedIcon />
                              </Badge>
                            )}
                          </AppContextConsumer>
                        </IconButton>
                      </Link>
                      <Link style={{textDecoration: "none",color:"#fff"}} to={"/sales/sales-due-products"}  >
                        <IconButton  aria-label="sales due" color="inherit">
                          <AppContextConsumer >
                            {({salesDueNumber}) => (
                              <Badge badgeContent={salesDueNumber} color="secondary">
                                <ShoppingBasketOutlinedIcon />
                              </Badge>
                            )}
                          </AppContextConsumer>
                        </IconButton>
                      </Link>
                      <Link style={{textDecoration: "none",color:"#fff"}} to={"/sales/sales-payment-due"}  >
                        <IconButton  aria-label="sales payment due" color="inherit">
                          <AppContextConsumer >
                            {({salesPaymentDue}) => (
                              <Badge badgeContent={salesPaymentDue} color="secondary">
                                <CreditCardOutlinedIcon />
                              </Badge>
                            )}
                          </AppContextConsumer>
                        </IconButton>
                      </Link>
                      <Link style={{textDecoration: "none",color:"#fff"}}   >
                        <IconButton
                          aria-label="account of current user"
                          aria-controls="menu-appbar"
                          aria-haspopup="true"
                          onClick={handleMenu}
                          color="inherit"
                        >
                          <AccountCircle />
                        </IconButton>
                        <Menu
                          id="menu-appbar"
                          anchorEl={anchorEl}
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          keepMounted
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          open={openMenu}
                          onClose={handleMenuClose}
                        >
                          <MenuItem>
                            <List
                              component="nav"
                              aria-labelledby="nested-list-subheader"

                              className={classes.menu}
                            >
                              <ListItem button>
                                <AppContextConsumer >
                                  {({user,appInfo}) =>  {
                                    if (user === null )
                                      return '';
                                    return <ListItemText primary={<span>{user.FirstName+" "+user.LastName} - <span style={{fontSize : 10}}>{appInfo.appName}</span> </span>} />
                                  }}
                                </AppContextConsumer>
                              </ListItem>
                              <ListItem button onClick={handleSwitchStore}>
                                  <AppContextConsumer >
                                  {({appInfo}) => (
                                    <ListItemText primary={appInfo.appName} />
                                  )}
                                </AppContextConsumer>
                                
                                {switchStore ? <ExpandLess /> : <ExpandMore />}
                              </ListItem>
                              <Collapse in={switchStore} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                  {
                                    allStores.slice(0,-1).map((store,i) => (
                                      <ListItem key={i} onClick={() => switchStoreClientApp(i)} button className={classes.nested}>
                                        <ListItemText  primary={store} />
                                      </ListItem>
                                    ))
                                  }
                                </List>
                              </Collapse>
                              <ListItem button onClick={handleLogout}>
                                <ListItemText primary="Logout" />
                              </ListItem>
                            </List>
                          </MenuItem>
                        </Menu>
                      </Link>
                    </section>

                </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
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

