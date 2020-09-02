import React, { useEffect, useState } from 'react';
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
import Cost from './Views/cost';
import Employee from './Views/employee';
import Salary from './Views/salary';
import PurchaseProductDue from './Views/purchaseProductDue';
import { AppContextProvider } from './context/appContext';
import submitForm from './utils/fetchApi';
import SalesProductDue from './Views/salesProductDue';
import PurchasePaymentDue from './Views/purchasePaymentDue';
import SalesPaymentDue from './Views/salesPaymentDue';

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

  const [purDueProd,setPurDueProd] = useState(0);
  const [purPaymentDue,setPurPaymentDue] = useState(0);
  const [salesDueProd,setSalesDueProd] = useState(0);
  const [salesPaymentDue,setSalesPaymentDue] = useState(0);

  const fetchPurDueProducts = () => {
    submitForm("purchases/total-purchase-due-products","GET","",(res) => setPurDueProd(res));
  }

  const fetchSalDueProducts = () => {
    submitForm("sales/total-sales-due-products","GET","",(res) => setSalesDueProd(res));

  }

  const fetchPurPaymentDue = () => {
    submitForm("purchases/total-purchase-payment-due","GET","",(res) => setPurPaymentDue(res));
  }

  const fetchSalesPaymentDue = () => {
    submitForm("sales/total-sales-payment-due","GET","",(res) => setSalesPaymentDue(res));
  }

  useEffect(() => {
    fetchPurDueProducts();
    fetchSalDueProducts();
    fetchPurPaymentDue();
    fetchSalesPaymentDue();
  },[])

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

  const dueProducts = {
    purDueNumber : purDueProd,
    salesDueNumber : salesDueProd,
    purPaymentDue : purPaymentDue,
    salesPaymentDue : salesPaymentDue,
    setSalesDueNumber : fetchSalDueProducts,
    setProNumber : fetchPurDueProducts,
    setPurPaymentDue : fetchPurPaymentDue,
    setSalesPaymentDue : fetchSalesPaymentDue,
  }
  
  return (
    <AppContextProvider value={dueProducts}>
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
            <Route exact path="/sales/sales-due-products">
              <SalesProductDue />
            </Route>
            <Route exact path="/sales/sales-payment-due">
              <SalesPaymentDue />
            </Route>
            <Route path="/sales">
              <Sales />
            </Route>
            <Route exact path="/purchase/purchase-due-products">
              <PurchaseProductDue />
            </Route>
            <Route exact path="/purchase/purchase-payment-due">
              <PurchasePaymentDue />
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
            <Route path="/cost">
              <Cost />
            </Route>
            <Route path="/employee">
              <Employee />
            </Route>
            <Route path="/salary">
              <Salary />
            </Route>

          </Switch>
          </main>
      </Router>
    </AppContextProvider>
  );
}

export default App;
