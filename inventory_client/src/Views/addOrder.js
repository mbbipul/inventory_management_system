import React, { useEffect, useRef, useState } from 'react';
import submitForm from '../utils/fetchApi';
import { Box, Button, Card, Chip, Divider, Grid, Snackbar, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ToggleButtons from '../components/toggleButtonGroup';
import Alert from '@material-ui/lab/Alert';
import { useReactToPrint } from 'react-to-print';

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
  
export default function AddOrder(props){
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

    const [orderSales,setOrderSales] = useState(null);
    const [orderRoute,setOrderRoute] = useState(null);
    const printRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    const columns = [
        'Product Name','Select Product Purchase Price','Receive','Return','Sells','Damage','Rate','Total Sells (taka)'
    ];
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const saveOrder = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.target.reset();

        console.log(products);

        let orderSalesObj = {
            orderSalesId : orderSales !== null ? orderSales.orderSalesId : -244 ,
            employeeId : dsrEmployee[tabValue].employeeId,
            orderDate : new Date().getTime().toString(),
            orderTotalPrice : totalOrderSalesPrice,
            orderPaymentAmount : paymentAmount,
            orderPaidStatus : totalOrderSalesPrice === paymentAmount ? true : false,
            commission : commisionAmount,
            cost : costAmount,
            routeName : orderRoute
        }

        const orderProducts = [];
        products.map((product,i) => {
            product.purHis.map( (pph,j ) => {
                let orderProduct = {
                    orderProductId : pph.orderProductId,
                    productPurchaseHistoryId : pph.productPurchaseHistoryId,
                    productQuantityProductQuantity : pph.productQuantityProductQuantity,
                    returnQuantityProductQuantity : pph.returnQuantityProductQuantity,
                    damageQuantityProductQuantity : pph.damageQuantityProductQuantity,
                    productRatePrice : pph.productRatePrice
                }
                orderProducts.push(orderProduct);
            });
        });
        
        if(orderSales && orderSales.orderSalesId && orderSales.orderSalesId > 0){
            submitForm('orders','PUT',{orderSales : orderSalesObj,orderProducts},(res) => {
                console.log(res);
                setOpenSnackbar(true);
                FetchProducts();
            });
        }else{
            submitForm('orders','POST',{orderSales : orderSalesObj,orderProducts},(res) => {
                console.log(res);
                setOpenSnackbar(true);
                FetchProducts();
            });
        }
       

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


    const handlePaymentAmount = (e) => {
        let amount = parseFloatR(e.target.value);
        console.log(products);
        if(orderSales){
            if(amount > totalOrderSalesPrice - orderSales.orderPaymentAmount ){
                amount = 0;
                alert('Payment amount cannot larger than Due payment amount');
            }
        }else{
            if(amount > totalOrderSalesPrice ){
                amount = 0;
                alert('Payment amount cannot larger than Due payment amount');
            }
        }
        setPaymentAmount(amount);
    }
    const handleCommision = (e) => {
        setCommisionAMount(parseFloatR(e.target.value));
    }
    const handleCost = (e) => {
        setCostAmount(parseFloatR(e.target.value));
    }
    
    const handleReceive = (e,i,j) => {
        let value = parseIntR(e.target.value);
        let tmp = [...products];
        let tmpValue = 0;
        if(tmp[i]){
            if ( value > dsrOrderProducts[i].purHis[j].productQuantity + dsrOrderProducts[i].purHis[j].productQuantityProductQuantity){
                alert('This amount of product are not in stock');
                tmpValue = dsrOrderProducts[i].purHis[j].productQuantityProductQuantity;
            }else {
                tmpValue = value;
            }
            tmp[i].purHis[j].productQuantityProductQuantity = tmpValue;
        }
        setProducts(tmp);
        
    };
    const handleReturn = (e,i,j) => {
        let value = parseIntR(e.target.value);
        let tmp = [...products];
        let tmpValue = 0;
        if(tmp[i]){
            if ( value > tmp[i].purHis[j].productQuantityProductQuantity){
                alert('Product Return Quantity Cannot be larger than Product Recieve Quantity');
                tmpValue = 0;
            }else {
                tmpValue = value;
            }
            tmp[i].purHis[j].returnQuantityProductQuantity = tmpValue;
        }
        setProducts(tmp);
        
    };
    const handleRate = (e,i,j) => {
        let value = e.target.value;
        let tmp = [...products];
        if(tmp[i]){
            
            tmp[i].purHis[j].productRatePrice = parseFloatR(value);
        }
        setProducts(tmp);
    };
    const handleDamage = (e,i,j) => {
        let value = e.target.value;
        let tmp = [...products];
        if(tmp[i]){
            
            tmp[i].purHis[j].damageQuantityProductQuantity = parseIntR(value);
        }
        setProducts(tmp);
    };
    
    useEffect(() => {
        submitForm('employees','GET','', (res) => {
            const data = JSON.parse(res);
            setDsrEmployee(data);
            setLoading(false);
        });
    },[]);

    const FetchProducts = () => {
        if(dsrEmployee[tabValue]){
            if(props.orderDate){
                submitForm('orders/order-sales-by-date-employeeid/'+dsrEmployee[tabValue].employeeId+"-"+props.orderDate,'GET','',(res) => {
                    let ordersSales = JSON.parse(res);
                    setOrderSales(ordersSales.orderSalesInfo);
                    setProducts(ordersSales.products);
                    setDsrOrderProducts(JSON.parse(res).products);
                });
            }else{
                submitForm('orders/order-sales-by-employeeid/'+dsrEmployee[tabValue].employeeId,'GET','',(res) => {
                    let ordersSales = JSON.parse(res);
                    setOrderSales(ordersSales.orderSalesInfo);
                    setProducts(ordersSales.products);
                    setDsrOrderProducts(JSON.parse(res).products);
                });
            }
        }
    }

    useEffect(() => {
        FetchProducts();
    },[tabValue,dsrEmployee]);

    useEffect(() => {
        setTotalOrderPrice(products.reduce(function(tot, arr) { 
            let sum = 0;
            arr.purHis.map(v =>  { 
                sum += (v.productQuantityProductQuantity - v.returnQuantityProductQuantity) * v.productRatePrice;
            });
            return tot + sum;
        },0));
        setCommisionAMount(orderSales !== null ? orderSales.commission : 0);
        setCostAmount(orderSales !== null ? orderSales.cost : 0);
        setOrderRoute(orderSales !== null ? orderSales.routeName : "");
    },[products]);

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
                    
                        <form ref={printRef} onSubmit={saveOrder} >
                        <Card style={{overflowX : 'scroll!important'}}>
                            <Grid
                                container
                                direction='row'>
                                <Grid item xs={3}>
                                    <h3 style={{textAlign : 'center'}}>{item.employeeName}</h3>
                                </Grid>
                                <Grid item xs={3}>
                                    <h3 style={{textAlign : 'center'}}>Order Product Info</h3>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        label="Order Route name"
                                        placeholder="notullabas"
                                        value={orderRoute}
                                        onChange={(e) => setOrderRoute(e.target.value)}
                                        />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        style={{marginBottom: 20}} color='primary' variant='contained' onClick={handlePrint}>
                                        Print 
                                    </Button>
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
                                        products.length > 0 && products.map((item,i) => (
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
                                                                value={ph.productQuantityProductQuantity} 
                                                                onChange={(e) => {handleReceive(e,i,j);}}/>
                                                        ))
                                                    }
                                                    
                                                </td>
                                                <td className="form-table-th-td-center-fixed-width">
                                                    {
                                                        item.purHis.map((ph,j) => (
                                                            <TextField 
                                                                style={{marginBottom: 5}}
                                                                variant="outlined"
                                                                value={ph.returnQuantityProductQuantity}
                                                                onChange={(e) => handleReturn(e,i,j)} />
                                                        ))
                                                    }
                                                </td>
                                                <td className="form-table-th-td-center-fixed-width">
                                                    {
                                                        item.purHis.map((ph,j) => (
                                                            <Typography>{ph.productQuantityProductQuantity-ph.returnQuantityProductQuantity}</Typography>
                                                        ))

                                                    }
                                                </td>
                                                <td className="form-table-th-td-center-fixed-width">
                                                {
                                                        item.purHis.map((ph,j) => (
                                                            <TextField 
                                                                style={{marginBottom: 5}}
                                                                variant="outlined"
                                                                value={ph.damageQuantityProductQuantity}
                                                                onChange={(e) => handleDamage(e,i,j)} />
                                                        ))
                                                    }
                                                </td>
                                                <td className="form-table-th-td-center-fixed-width">
                                                {
                                                        item.purHis.map((ph,j) => (
                                                            <TextField 
                                                                style={{marginBottom: 5}}
                                                                variant="outlined"
                                                                value={ph.productRatePrice}
                                                                onChange={(e) => handleRate(e,i,j)} />
                                                        ))
                                                    }
                                                </td>
                                                <td className="form-table-th-td-center-fixed-width">
                                                    {
                                                        item.purHis.map((ph,j) => (
                                                            <Typography>{(ph.productQuantityProductQuantity-ph.returnQuantityProductQuantity)*ph.productRatePrice}</Typography>
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
                                                products !== null && products.reduce(function(tot, arr) { 
                                                    let sum = 0;
                                                    arr.purHis.map(v =>  { 
                                                        sum += v.productQuantityProductQuantity
                                                    })
                                                    return tot + sum;
                                                },0)
                                            }
                                        </td>
                                        <td className='form-table-th-td-center'>
                                            {
                                                products.reduce(function(tot, arr) { 
                                                    let sum = 0;
                                                    arr.purHis.map(v =>  { 
                                                        sum += v.returnQuantityProductQuantity
                                                    })
                                                    return tot + sum;
                                                },0)
                                            }
                                        </td>
                                        <td className='form-table-th-td-center'>
                                            {
                                                products.reduce(function(tot, arr) { 
                                                    let sum = 0;
                                                    arr.purHis.map(v =>  { 
                                                        sum += v.productQuantityProductQuantity - v.returnQuantityProductQuantity
                                                    })
                                                    return tot + sum;
                                                },0)
                                            }
                                        </td>
                                        <td className='form-table-th-td-center'>
                                            {
                                                products.reduce(function(tot, arr) { 
                                                    let sum = 0;
                                                    arr.purHis.map(v =>  { 
                                                        sum += v.damageQuantityProductQuantity
                                                    })
                                                    return tot + sum;
                                                },0)
                                            }
                                        </td>
                                        <td className='form-table-th-td-center'>
                                            
                                        </td>
                                        <td className='form-table-th-td-center'>
                                            {
                                                products.reduce(function(tot, arr) { 
                                                    let sum = 0;
                                                    arr.purHis.map(v =>  { 
                                                        sum += (v.productQuantityProductQuantity - v.returnQuantityProductQuantity) * v.productRatePrice;
                                                    })
                                                    return tot + sum;
                                                },0)
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
                                    {
                                        orderSales && totalOrderSalesPrice - orderSales.orderPaymentAmount === 0  ? 
                                        (<Alert severity='success'>
                                            <Chip
                                                color="primary"
                                                label={"Paid"}
                                                clickable />
                                        </Alert>) :
                                        (
                                            <TextField 
                                                value={paymentAmount}
                                                required={true}
                                                onChange={handlePaymentAmount}
                                                label="Sales Payment Amount(tk)"
                                                placeholder="344.55"
                                            />
                                        )
                                    }
                                   
                                </Grid>
                                {
                                    orderSales && totalOrderSalesPrice - orderSales.orderPaymentAmount !== 0 && (
                                        <Grid item xs={6} style={{marginBottom : 10}}>
                                            <Typography >Total Sales Payment Due Amount : {
                                                orderSales && totalOrderSalesPrice - orderSales.orderPaymentAmount
                                            }</Typography>
                                        </Grid>
                                    )
                                }
                                <Grid item xs={6} style={{marginBottom : 10}}>
                                    <Typography >Total Damage Product Amount : {
                                        products.reduce(function(tot, arr) { 
                                            let sum = 0;
                                                    arr.purHis.map(v =>  { 
                                                        sum += (v.damageQuantityProductQuantity) * v.productRatePrice;
                                                    })
                                                    return tot + sum;
                                        },0)
                                    }</Typography>
                                </Grid>
                                <Grid item xs={6} style={{marginBottom : 10}}>
                                    <TextField   
                                        onChange={handleCommision}
                                        value={commisionAmount}
                                        required={true}
                                        label="Commision(tk)"
                                        placeholder="344.55"
                                    />
                                </Grid>
                                <Grid item xs={6} style={{marginBottom : 10}}>
                                    <TextField 
                                        onChange={handleCost}
                                        value={costAmount}
                                        required={true}
                                        label="Cost(tk)"
                                        placeholder="344.55"
                                    />
                                </Grid>
                                <Grid item xs={12} style={{marginBottom : 10}}>
                                    <Divider />
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography style={{textAlign : 'center'}} variant={'h4'}>Ground Total : {totalOrderSalesPrice -  products.reduce(function(tot, arr) { 
                                            let sum = 0;
                                                    arr.purHis.map(v =>  { 
                                                        sum += (v.damageQuantityProductQuantity) * v.productRatePrice;
                                                    })
                                                    return tot + sum;
                                        },0) - commisionAmount - costAmount} Taka</Typography>
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
                        Succesfully Save Order  !
                    </Alert>
            </Snackbar>
        </div>
    )
}

