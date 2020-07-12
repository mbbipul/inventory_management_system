import React from 'react';
import './App.css';
import AppDrawer from './layouts/MainLayout/AppDrawer';

import {BrowserRouter as Router,Switch,Route } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import DashBoard from './Views/dashboard';
import Product from './Views/product';
import Supplier from './Views/supplier';
import Customer from './Views/customer';
import Company from './Views/company';
import Purchase from './Views/purchase';
import Sales from './Views/sales';

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
          <Route path="/sales">
            <Sales />
          </Route>
          <Route path="/purchase">
            <Purchase />
          </Route>
          <Route path="/product">
            <Product />
          </Route>
          <Route path="/supplier">
            <Supplier />
          </Route>
          <Route path="/company">
            <Company />
          </Route>
          <Route path="/customer">
            <Customer />
          </Route>
        </Switch>
        </main>
    </Router>
  );
}

export default App;
