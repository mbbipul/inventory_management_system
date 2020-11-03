import React, { useEffect, useState } from 'react';
import './App.css';
import AppDrawer from './layouts/MainLayout/AppDrawer';

import {BrowserRouter as Router,Switch,Route, Redirect } from 'react-router-dom';

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
import Damage from './Views/damage';
import Order from './Views/order';
import Payment from './Views/payment';
import SignInSide from './layouts/MainLayout/signin';
import { decode } from 'js-base64';

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
    const [isUserLoggedIn,setUserLoginStatus] = useState(false);
	const [user,setUser] = useState({});

	function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
		  var c = ca[i];
		  while (c.charAt(0) == ' ') {
			c = c.substring(1);
		  }
		  if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		  }
		}
		return null;
	}

	const getCurrentUsers = (state) => {

		if (!isUserLoggedIn || !state ){
			const userCookies = getCookie('user-info');
			if(userCookies !== null ){
				const user = JSON.parse(decode(userCookies));
				return user;
			}
		}
		
		return null;
	}

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
	
	const setUserLoginStatusContext = (state) => {
		setUserLoginStatus(state);
	}

	const setLoginUserInfo = (state) => {
		let user = getCurrentUsers(state);
		console.log(user);
		setUser(user);
	}

    const checkUserLoggedInCredentialsValid = () => {
		const userCookies = getCookie('user-info');
		let user = null;
		if(userCookies !== null ){
			user = JSON.parse(decode(userCookies));
		}
		if(user !== null ){
			setUserLoginStatus(true);
			setUser(user);
		}
	}

    useEffect(() => {
      fetchPurDueProducts();
      fetchSalDueProducts();
      fetchPurPaymentDue();
	  fetchSalesPaymentDue();
	  checkUserLoggedInCredentialsValid();

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

    const appContextValue = {
      purDueNumber : purDueProd,
      salesDueNumber : salesDueProd,
      purPaymentDue : purPaymentDue,
      salesPaymentDue : salesPaymentDue,
      isUserLoggedIn : isUserLoggedIn,
      user : user,

      setSalesDueNumber : fetchSalDueProducts,
      setProNumber : fetchPurDueProducts,
      setPurPaymentDue : fetchPurPaymentDue,
      setSalesPaymentDue : fetchSalesPaymentDue,
	  setUserLoginStatus : setUserLoginStatusContext,
	  setUser : setLoginUserInfo,
    }

    return (
      	<AppContextProvider value={appContextValue}>
			{
				isUserLoggedIn ? (
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
								<Route path="/payment">
									<Payment />
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
								<Route path="/damage">
									<Damage />
								</Route>
								<Route path="/order">
									<Order />
								</Route>
							</Switch>
						</main>
					</Router>
				) : (
					<Router>
						<Switch>
							<Route path="/">
									<SignInSide />
								</Route>
							<Route exact path="/">
								<SignInSide />
							</Route>
							<Redirect from="/" to="/" />
						</Switch>
					</Router>
				)
			}
			
		</AppContextProvider>
    );
}

export default App;
