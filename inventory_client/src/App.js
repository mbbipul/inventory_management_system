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
import { getCookie, parseCookie, setCookie } from './utils/apiInfo';
import { getStoreInfo, getStoreInfoByName } from './utils/storeInfo';
import AccountSetting from './Views/account-setting';

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
	const [appInfo,setAppInfo] = useState({});
	
	const getCurrentUsers = (state) => {

		const userCookies = getCookie('user-info');
		if(userCookies !== null ){
			const user = JSON.parse(decode(userCookies));
			return user;
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
		setUser(user);
		console.log({
			p : 1,
			user
		})
	}

	const fetchAppInfo = () => {
		let store = getCookie('store-info');
		if(store == null){
			setAppInfo({});
			return;
		}
		setAppInfo({
			appName : getStoreInfoByName(store)
		})
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
			setAppInfo(-1);
			getDrawerStyle(getCookie('store-info'));
		}
	}

	const getDrawerStyle = (store) => {
		var style = document.createElement('style');
		style.type = 'text/css';
		switch (store) {
			case 'store2':
				style.innerHTML = '.MuiDrawer-paper{ background-color: #E15F07!important; color: aliceblue!important;}';
				break;
			case 'store3':
				style.innerHTML = '.MuiDrawer-paper{ background-color: #065f15!important; color: aliceblue!important;}';
				break;
			case 'store1':
				style.innerHTML = '.MuiDrawer-paper{ background-color: #080c41!important; color: aliceblue!important;}';
				break;
			default:
				break;
		}
		
		document.getElementsByTagName('head')[0].appendChild(style);
	}
    useEffect(() => {
		fetchPurDueProducts();
		fetchSalDueProducts();
		fetchPurPaymentDue();
		fetchSalesPaymentDue();
		checkUserLoggedInCredentialsValid();
		fetchAppInfo(-1);
	  
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
	  appInfo : appInfo,

      setSalesDueNumber : fetchSalDueProducts,
      setProNumber : fetchPurDueProducts,
      setPurPaymentDue : fetchPurPaymentDue,
      setSalesPaymentDue : fetchSalesPaymentDue,
	  setUserLoginStatus : setUserLoginStatusContext,
	  setUser : setLoginUserInfo,
	  setAppInfo : fetchAppInfo,
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
								<Route exact path="/account-setting">
									<AccountSetting />
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
