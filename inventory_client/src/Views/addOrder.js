import React, { useEffect, useState } from 'react';
import submitForm from '../utils/fetchApi';
import { Box, Button, Card, Divider, Grid, Snackbar, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ToggleButtons from '../components/toggleButtonGroup';
import Alert from '@material-ui/lab/Alert';

function TabPanel(props) {
    
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      height: 510,
    },
    tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
      width : 300,
    },
  }));
  
export default function AddOrder(){
    const classes = useStyles();
    const [dsrEmployee,setDsrEmployee] = useState([]);
    const [products,setProducts] = useState([]);
    const [tabValue, setTabValue] = React.useState(0);
    const [dsrOrderProducts,setDsrOrderProducts] = useState({});

    const [totalOrderSalesPrice,setTotalOrderPrice] = useState(0);
    const [paymentAmount,setPaymentAmount] = useState(0);
    const [commisionAmount,setCommisionAMount] = useState(0);
    const [costAmount,setCostAmount] = useState(0);

    const [openSnackbar,setOpenSnackbar] = useState(false);
    const [loading,setLoading] = useState(true);

    const columns = [
        'Product Name','Select Product Purchase Price','Receive','Return','Sells','Damage','Rate','Total Sells (taka)'
    ];
    const handleTabChange = (event, newValue) => {
        const tmp = {...dsrOrderProducts};
        if(tmp[tabValue]){
            Object.values(tmp[tabValue]).map((v,i) => {
                if(tmp[tabValue][i]){
                    delete tmp[tabValue][i];
                }
            });
        }
        setDsrOrderProducts(tmp);
        
        setTotalOrderPrice(0);
        setPaymentAmount(0);
        setCommisionAMount(0);
        setCostAmount(0);

        setTabValue(newValue);
    };

    const saveOrder = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(dsrOrderProducts);
        let salesObj = dsrOrderProducts[tabValue];
        let orderSales = {
            employeeId : dsrEmployee[tabValue].employeeId,
            orderDate : new Date().getTime().toString(),
            orderTotalPrice : totalOrderSalesPrice,
            orderPaymentAmount : paymentAmount,
            orderPaidStatus : totalOrderSalesPrice === paymentAmount ? true : false,
            commission : commisionAmount,
            cost : costAmount
        }

        const orderProducts = [];
        Object.values(salesObj).map((v,i) => {
            let orderProduct = {
                productPurchaseHistoryId : v.productPurchaseHistory.productPurchaseHistoryId,
                productQuantityProductQuantity : v.receive,
                returnQuantityProductQuantity : v.returnQ,
                damageQuantityProductQuantity : v.damage,
                productRatePrice : v.rate
            }
            orderProducts.push(orderProduct);
        });
        
        submitForm('orders','POST',{orderSales,orderProducts},(res) => {
            console.log(res);
            setOpenSnackbar(true);
            setInterval(function (){
                window.location.href = "/order/add-order";
            },2000);
        });

    }
    const parseIntR = (str) => {
        if(isNaN(parseInt(str))){
            return 0;
        }
        return parseInt(str);
    }

    const parseFloatR = (str) => {
        if(isNaN(parseFloat(str))){
            return parseFloat(0);
        }
        return parseFloat(str);
    }

    useEffect(() => {
        console.log(dsrOrderProducts);
        if(dsrOrderProducts[tabValue]){
            setTotalOrderPrice(Object.values(dsrOrderProducts[tabValue]).reduce(function(tot, arr) { 
                return tot + arr.totalSells;
            },0));
        }
    },[dsrOrderProducts]);

    const handlePaymentAmount = (e) => {
        let amount = parseFloatR(e.target.value);
        if(amount > totalOrderSalesPrice){
            amount = 0;
            alert('Payment amount cannot larger than Sales Price');
        }
        setPaymentAmount(amount);
    }
    const handleCommision = (e) => {
        setCommisionAMount(parseFloatR(e.target.value));
    }
    const handleCost = (e) => {
        setCostAmount(parseFloatR(e.target.value));
    }
    const handlePurchaseHis = (value,i) => {

        const tmp = {...dsrOrderProducts};
        let tmpSingleObj = {};
        if(tmp[tabValue] && tmp[tabValue][i]){
            tmpSingleObj = tmp[tabValue][i];
            tmp[tabValue][i] = {
                receive : tmpSingleObj.receive,
                returnQ : tmpSingleObj.returnQ ,
                damage : tmpSingleObj.damage ,
                rate : tmpSingleObj.rate,
                sells : tmpSingleObj.sells,
                totalSells : tmpSingleObj.totalSells,
                productPurchaseHistory : value 
            };
        }else{
            let sells = 0;
            tmp[tabValue][i] = {
                receive : 0,
                returnQ : 0 ,
                damage : 0 ,
                rate : parseFloatR(0),
                sells : sells,
                totalSells: 0,
                productPurchaseHistory : value
            };
        }
        setDsrOrderProducts(tmp);
        
    }

    const handleReceive = (e,i,ini,inj) => {
        
        const tmp = {...dsrOrderProducts};
        let tmpSingleObj = {};
        if(tmp[tabValue] && tmp[tabValue][i]){
            tmpSingleObj = tmp[tabValue][i];
            let rQ = parseIntR(e.target.value);
            let sells = rQ - parseIntR(tmpSingleObj.returnQ);
            if(rQ > products[ini].purHis[inj].productQuantity){
                rQ = 0;
                sells = rQ - parseIntR(tmpSingleObj.returnQ);
                alert('This amount of product are not in stock');
            }
            tmp[tabValue][i] = {
                receive : rQ,
                returnQ : parseIntR(tmpSingleObj.returnQ) ,
                damage : tmpSingleObj.damage ,
                rate : tmpSingleObj.rate,
                sells : sells,
                totalSells : sells*parseFloatR(tmpSingleObj.rate),
                productPurchaseHistory : tmpSingleObj.productPurchaseHistory
            };
        }else{
            let sells = parseIntR(e.target.value);
            tmp[tabValue][i] = {
                receive : sells,
                returnQ : 0 ,
                damage : 0 ,
                rate : parseFloatR(0),
                sells : sells,
                totalSells: 0
            };
        }
        setDsrOrderProducts(tmp);
        
    };
    const handleReturn = (e,i) => {
        const tmp = {...dsrOrderProducts};
        let tmpSingleObj = {};
        if(tmp[tabValue] && tmp[tabValue][i]){
            tmpSingleObj = tmp[tabValue][i];
            let sells = tmpSingleObj.receive - parseIntR(e.target.value);
            tmp[tabValue][i] = {
                receive : tmpSingleObj.receive,
                returnQ :  parseIntR(e.target.value) ,
                damage :tmpSingleObj.damage ,
                rate : tmpSingleObj.rate,
                sells : sells,
                totalSells : sells*parseFloatR(tmpSingleObj.rate),
                productPurchaseHistory : tmpSingleObj.productPurchaseHistory
            };
        }else{
            tmp[tabValue][i] = {
                receive : 0,
                returnQ : parseIntR(e.target.value) ,
                damage : 0 ,
                rate : 0,
                sells : parseFloatR(0),
                totalSells : 0
            };
        }
        if(tmp[tabValue][i].returnQ > tmp[tabValue][i].receive){
            alert('Product Return Quantity Cannot be larger than Product Recieve Quantity');
            tmp[tabValue][i].returnQ = '';
        }
        setDsrOrderProducts(tmp);
    };
    const handleRate = (e,i) => {
        const tmp = {...dsrOrderProducts};
        let tmpSingleObj = {};
        if(tmp[tabValue] && tmp[tabValue][i]){
            tmpSingleObj = tmp[tabValue][i];
            let sells = tmpSingleObj.receive - tmpSingleObj.returnQ;
            tmp[tabValue][i] = {
                receive : tmpSingleObj.receive,
                returnQ :  tmpSingleObj.returnQ ,
                damage :tmpSingleObj.damage ,
                rate : parseFloatR(e.target.value),
                sells : sells,
                totalSells : sells*parseFloatR(e.target.value),
                productPurchaseHistory : tmpSingleObj.productPurchaseHistory
            };
        }else{
            tmp[tabValue][i] = {
                receive : 0,
                returnQ :  0,
                damage : 0 ,
                rate : parseFloatR(e.target.value),
                sells: 0,
                totalSells: 0
            };
        }
        setDsrOrderProducts(tmp);
    };
    const handleDamage = (e,i) => {
        const tmp = {...dsrOrderProducts};
        let tmpSingleObj = {};
        if(tmp[tabValue] && tmp[tabValue][i]){
            tmpSingleObj = tmp[tabValue][i];
            let sells = tmpSingleObj.receive - tmpSingleObj.returnQ;
            tmp[tabValue][i] = {
                receive : tmpSingleObj.receive,
                returnQ :  tmpSingleObj.returnQ ,
                damage : parseIntR(e.target.value) ,
                rate : tmpSingleObj.rate,
                sells : sells,
                totalSells : sells*parseFloatR(tmpSingleObj.rate),
                productPurchaseHistory : tmpSingleObj.productPurchaseHistory
            };
        }else{
            tmp[tabValue][i] = {
                receive : 0,
                returnQ : 0 ,
                damage : parseIntR(e.target.value) ,
                rate : parseFloatR(0),
                sells : 0,
                totalSells : 0
            };
        }
        setDsrOrderProducts(tmp);
    };
    
    useEffect(() => {
        submitForm('employees','GET','', (res) => {
            const data = JSON.parse(res);
            data.map((v,i) => dsrOrderProducts[i] = {});
            setDsrEmployee(data);
            setLoading(false);
        });
        submitForm('products/with-pur-his','GET','',(res) => setProducts(JSON.parse(res)));
    },[]);

    return(
        <div className={classes.root}>
            {
                loading && <Card style={{padding:100}}>
                    Loading ...........
                </Card>

            }
            {
                dsrEmployee.length === 0 && !loading && <Card style={{padding:100}}>
                    No Dsr (Employee) found . Please add Employee First!
                </Card>
            }
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Vertical tabs example"
                className={classes.tabs}
            >
            {
                dsrEmployee.map((item,i) => (
                    <Tab key={i} label={item.employeeName} {...a11yProps(i)} />
                ))
            }
            </Tabs>
            {
                dsrEmployee.map((item,i) => (
                    
                    <TabPanel value={tabValue} index={i}>
                    
                        <form onSubmit={saveOrder} >
                        <Card style={{overflowX : 'scroll!important'}}>
                            <Grid
                                container
                                direction='row'>
                                <Grid item xs={12}>
                                    <h3 style={{textAlign : 'center'}}>Order Product Info</h3>
                                </Grid>
                            </Grid>
                            <table className='form-table' >
                                <thead>
                                    <tr>
                                        {
                                            columns.map((item,i) => (
                                                <th key={i} className="form-table-th-td-fixed-width">
                                                    {item}
                                                </th>
                                            ))
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        products.map((item,i) => (
                                            <tr key={i}>
                                                
                                                <td className="form-table-th-td-center-fixed-width">
                                                    <Typography>{item.productName}</Typography> 
                                                </td>
                                                <td className="form-table-th-td-center-width-300">
                                                    {
                                                        item.purHis.map((ph,j) => (
                                                            <div>
                                                                <Typography>Purchase Price - per : {ph.perProductPurchasePrice}</Typography>
                                                                <Typography>Pre Sales Price -per : {ph.perProductSalesPrice}</Typography>
                                                                <Typography style={{borderBottom : '1px solid black',marginBottom: 5}}>Product Quantity  in Stock : {ph.productQuantity}</Typography>
                                                            </div>
                                                        ))
                                                    }
                                                </td>
                                                <td className="form-table-th-td-center-fixed-width">
                                                    {
                                                        item.purHis.map((ph,j) => (
                                                            <TextField 
                                                                style={{marginBottom: 5}}
                                                                key={i}
                                                                variant="outlined" 
                                                                value={dsrOrderProducts[tabValue] && dsrOrderProducts[tabValue][i+''+j] && dsrOrderProducts[tabValue][i+''+j].receive} 
                                                                onChange={(e) => {handlePurchaseHis(ph,i+''+j);handleReceive(e,[i+''+j],i,j);}}/>
                                                        ))
                                                    }
                                                    
                                                </td>
                                                <td className="form-table-th-td-center-fixed-width">
                                                    {
                                                        item.purHis.map((ph,j) => (
                                                            <TextField 
                                                                style={{marginBottom: 5}}
                                                                variant="outlined"
                                                                value={dsrOrderProducts[tabValue] && dsrOrderProducts[tabValue][i+''+j] && dsrOrderProducts[tabValue][i+''+j].returnQ}
                                                                onChange={(e) => handleReturn(e,i+''+j)} />
                                                        ))
                                                    }
                                                </td>
                                                <td className="form-table-th-td-center-fixed-width">
                                                    {
                                                        item.purHis.map((ph,j) => (
                                                            <Typography>{dsrOrderProducts[tabValue] && dsrOrderProducts[tabValue][i+''+j] &&dsrOrderProducts[tabValue][i+''+j].sells}</Typography>
                                                        ))

                                                    }
                                                </td>
                                                <td className="form-table-th-td-center-fixed-width">
                                                {
                                                        item.purHis.map((ph,j) => (
                                                            <TextField 
                                                                style={{marginBottom: 5}}
                                                                variant="outlined"
                                                                value={dsrOrderProducts[tabValue] && dsrOrderProducts[tabValue][i+''+j] && dsrOrderProducts[tabValue][i+''+j].damage}
                                                                onChange={(e) => handleDamage(e,i+''+j)} />
                                                        ))
                                                    }
                                                </td>
                                                <td className="form-table-th-td-center-fixed-width">
                                                {
                                                        item.purHis.map((ph,j) => (
                                                            <TextField 
                                                                style={{marginBottom: 5}}
                                                                variant="outlined"
                                                                value={dsrOrderProducts[tabValue] && dsrOrderProducts[tabValue][i+''+j] && dsrOrderProducts[tabValue][i+''+j].rate}
                                                                onChange={(e) => handleRate(e,i+''+j)} />
                                                        ))
                                                    }
                                                </td>
                                                <td className="form-table-th-td-center-fixed-width">
                                                    {
                                                        item.purHis.map((ph,j) => (
                                                            <Typography>{dsrOrderProducts[tabValue] && dsrOrderProducts[tabValue][i+''+j] && dsrOrderProducts[tabValue][i+''+j].totalSells}</Typography>
                                                        ))
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td className='form-table-th-td-center'>
                                            Total
                                        </td>
                                        <td className='form-table-th-td-center'></td>
                                        <td className='form-table-th-td-center'>
                                            {
                                                Object.values(dsrOrderProducts[tabValue]).reduce(function(tot, arr) { 
                                                    return tot + arr.receive;
                                                },0)
                                            }
                                        </td>
                                        <td className='form-table-th-td-center'>
                                            {
                                                Object.values(dsrOrderProducts[tabValue]).reduce(function(tot, arr) { 
                                                    return tot + arr.returnQ;
                                                },0)
                                            }
                                        </td>
                                        <td className='form-table-th-td-center'>
                                            {
                                                Object.values(dsrOrderProducts[tabValue]).reduce(function(tot, arr) { 
                                                    return tot + arr.sells;
                                                },0)
                                            }
                                        </td>
                                        <td className='form-table-th-td-center'>
                                            {
                                                Object.values(dsrOrderProducts[tabValue]).reduce(function(tot, arr) { 
                                                    return tot + arr.damage;
                                                },0)
                                            }
                                        </td>
                                        <td className='form-table-th-td-center'>
                                            
                                        </td>
                                        <td className='form-table-th-td-center'>
                                            {
                                                totalOrderSalesPrice
                                            }
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>  
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                                style={{padding:20}}
                                >
                                <Grid item xs={6} style={{marginBottom : 10}}>
                                    <TextField 
                                        value={paymentAmount}
                                        required={true}
                                        onChange={handlePaymentAmount}
                                        label="Sales Payment Amount(tk)"
                                        placeholder="344.55"
                                    />
                                </Grid>
                                <Grid item xs={6} style={{marginBottom : 10}}>
                                    <Typography >Total Damage Product Amount : {
                                        dsrOrderProducts[tabValue] && Object.values(dsrOrderProducts[tabValue]).reduce(function(tot, arr) { 
                                                                return tot + (arr.damage*arr.rate);
                                        },0)
                                    }</Typography>
                                </Grid>
                                <Grid item xs={6} style={{marginBottom : 10}}>
                                    <TextField 
                                        onChange={handleCommision}
                                        required={true}
                                        label="Commision(tk)"
                                        placeholder="344.55"
                                    />
                                </Grid>
                                <Grid item xs={6} style={{marginBottom : 10}}>
                                    <TextField 
                                        onChange={handleCost}
                                        required={true}
                                        label="Cost(tk)"
                                        placeholder="344.55"
                                    />
                                </Grid>
                                <Grid item xs={12} style={{marginBottom : 10}}>
                                    <Divider />
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography style={{textAlign : 'center'}} variant={'h4'}>Ground Total : {totalOrderSalesPrice} Taka</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button type='submit' variant='contained' color='primary'>Save Order</Button>
                                </Grid>

                            </Grid> 
                        </Card>
                        </form>
                    </TabPanel>
                ))
            }
            <Snackbar 
                    open={openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={() => setOpenSnackbar(false)}
                >
                    <Alert onClose={() => setOpenSnackbar(false)} variant="filled" severity="success">
                        Succesfully new Order placed !
                    </Alert>
            </Snackbar>
        </div>
    )
}

