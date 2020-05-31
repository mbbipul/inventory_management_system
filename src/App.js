import React from 'react';
import './App.css';
import AppDrawer from './layouts/MainLayout/AppDrawer';

import {BrowserRouter as Router,Switch,Route } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import DashBoard from './Views/dashboard';
import Product from './Views/product';

const useStyles = makeStyles((theme) => ({
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
}));
function App() {
  const classes = useStyles();
  const isDrawerExtend = useSelector(state => state.isSideBarExtend);

  var content = {
    flexGrow: 1,
    marginLeft : 55,
    transition : ".8s ",
   
  }
  if(isDrawerExtend){
    content = {
      marginLeft: 200,
      transition : ".8s",
    }
  }
  return (
    <Router>
      <AppDrawer />
      <main style={content}  >
        <div className={classes.toolbar} />
      <Switch>
          <Route exact path="/">
            <DashBoard />
          </Route>
          <Route exact path="/dashboard">
            <DashBoard />
          </Route>
          <Route path="/sells">
            <DashBoard />
          </Route>
          <Route path="/product">
            <Product />
          </Route>
        </Switch>
        </main>
    </Router>
  );
}

export default App;
