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
      height: 'auto',
    },
    tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
      width : 200,
    },
  }));
  
export default function ManageOrder(props){
    const classes = useStyles();
    const [dsrEmployee,setDsrEmployee] = useState([]);
    const [products,setProducts] = useState([]);
    const [tabValue, setTabValue] = React.useState(0);
    const [dsrOrderProducts,setDsrOrderProducts] = useState({});

    const [empOrderProducts,setEmpOrderProducts] = useState([]);

    const [totalOrderSalesPrice,setTotalOrderPrice] = useState(0);
    const [paymentAmount,setPaymentAmount] = useState(0);
    const [commisionAmount,setCommisionAMount] = useState(0);
    const [costAmount,setCostAmount] = useState(0);

    const [openSnackbar,setOpenSnackbar] = useState(false);

    const [preOr,setPreOrdProQ] = useState([]);

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

    const saveOrder = (e,i) => {
        e.preventDefault();
        e.stopPropagation();
        const totalPrice = empOrderProducts[i].orderProductInfos.reduce(function(tot, arr) { 
            return tot + (arr.orderProduct.productQuantityProductQuantity-arr.orderProduct.returnQuantityProductQuantity)*arr.orderProduct.productRatePrice;
        },0);
        let orderSales = {
            orderSalesId : empOrderProducts[i].orderSales.orderSalesId,
            employeeId : empOrderProducts[i].employee.employeeId,
            orderDate : new Date().getTime().toString(),
            orderTotalPrice : totalPrice,
            orderPaymentAmount : paymentAmount,
            orderPaidStatus : totalPrice === paymentAmount ? true : false,
            commission : commisionAmount,
            cost : costAmount
        }

        const orderProducts = [];
        empOrderProducts[i].orderProductInfos.map((v,j) => {
            orderProducts.push(v.orderProduct);
        });


        
        submitForm('orders','PUT',{orderSales,orderProducts},(res) => {

            setOpenSnackbar(true);
            setInterval(function (){
            //    window.location.href = "/order/manage-order";
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


    const handlePaymentAmount = (e,i) => {
        let amount = parseFloatR(e.target.value);
        let dueAmount = empOrderProducts[i].orderProductInfos.reduce(function(tot, arr) { 
            return tot + (arr.orderProduct.productQuantityProductQuantity-arr.orderProduct.returnQuantityProductQuantity)*arr.orderProduct.productRatePrice;
            },0) - empOrderProducts[i].orderSales.orderPaymentAmount;

        if(amount > dueAmount){
            amount = 0;
            alert('Payment amount cannot larger than Sales Price');
        }
        if(dueAmount < 0){
            amount = dueAmount;
        }
        setPaymentAmount(amount);
    }
    const handleCommision = (e) => {
        setCommisionAMount(parseFloatR(e.target.value));
    }
    const handleCost = (e) => {
        setCostAmount(parseFloatR(e.target.value));
    }
    const handleReceive = (e,i,opi) => {
        const tmp = [...empOrderProducts];
        const value = parseIntR(e.target.value);
        let rQ = value;
        let totalSalesAblePro = parseIntR(tmp[i].orderProductInfos[opi].pph.productQuantity+preOr[i].orderProductInfos[opi].pph.productQuantity);
        if(value > totalSalesAblePro){
            rQ = tmp[i].orderProductInfos[opi].orderProduct.productQuantityProductQuantity;
            alert('This amount of product are not in stock ' );
            return;
        }
       console.log("gg",preOr);

        if(tmp[i]){
            tmp[i].orderProductInfos[opi].orderProduct.productQuantityProductQuantity = rQ;
        }
        setEmpOrderProducts(tmp);
    };
    const handleReturn = (e,i,opi) => {
        const tmp = [...empOrderProducts];
        const value = parseIntR(e.target.value);
        if(tmp[i]){
            tmp[i].orderProductInfos[opi].orderProduct.returnQuantityProductQuantity = value;
        }
        setEmpOrderProducts(tmp);
    };
    const handleRate = (e,i,opi) => {
        const tmp = [...empOrderProducts];
        const value = parseFloatR(e.target.value);
        if(tmp[i]){
            tmp[i].orderProductInfos[opi].orderProduct.productRatePrice = value;
        }
        setEmpOrderProducts(tmp);
    };
    const handleDamage = (e,i,opi) => {
        const tmp = [...empOrderProducts];
        const value = parseIntR(e.target.value);
        if(tmp[i]){
            tmp[i].orderProductInfos[opi].orderProduct.damageQuantityProductQuantity = value;
        }
        setEmpOrderProducts(tmp);
    };
    
    useEffect(() => {
        const orderSales = props.orderSaleses;
        const orderSalesEmIds = [];
        orderSales.data.forEach(os => {
            orderSalesEmIds.push({employeeId : os.employeeId,orderSales : os.data[0]})
        });
        
        submitForm("Orders/order-sales-by-ids","POST",orderSalesEmIds,(res) => {
            const tmp =JSON.parse(res);
            setPreOrdProQ([...tmp]);
            setEmpOrderProducts(tmp);
        });

    },[]);

    return(
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Vertical tabs example"
                className={classes.tabs}
            >
            {
                empOrderProducts.map((item,i) => (
                    <Tab key={i} label={item.employee.employeeName} {...a11yProps(i)} />
                ))
            }
            </Tabs>
            {
                empOrderProducts.map((emP,i) => (
                    
                    <TabPanel value={tabValue} key={i} index={i}>
                    
                        <form onSubmit={(e) => saveOrder(e,i)} >
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
                                            emP.orderProductInfos.map((opInfo,opi) => (
                                                <tr key={opi}>
                                                    <td className="form-table-th-td-center-fixed-width">
                                                        <Typography>{opInfo.product.productName}</Typography> 
                                                    </td>
                                                    <td className="form-table-th-td-center-width-300">
                                                    {
                                                        
                                                        opInfo.pph && <div>
                                                            <Typography>Purchase Price - per : {opInfo.pph.perProductPurchasePrice}</Typography>
                                                            <Typography>Pre Sales Price -per : {opInfo.pph.perProductSalesPrice}</Typography>
                                                            <Typography>Product Quantity  in Stock : {opInfo.pph.productQuantity}</Typography>
                                                        </div>
                                                    }
                                                    </td>
                                                    <td className="form-table-th-td-center-fixed-width">
                                                        <TextField 
                                                            style={{marginBottom: 5}}
                                                            key={opi}
                                                            variant="outlined" 
                                                            value={opInfo.orderProduct.productQuantityProductQuantity} 
                                                            onChange={(e) => handleReceive(e,i,opi)}

                                                        />                                                       
                                                    </td>
                                                    <td className="form-table-th-td-center-fixed-width">
                                                        <TextField 
                                                            style={{marginBottom: 5}}
                                                            variant="outlined"
                                                            value={opInfo.orderProduct.returnQuantityProductQuantity}
                                                            onChange={(e) => handleReturn(e,i,opi)} 
                                                            />
                                                    </td>
                                                    <td className="form-table-th-td-center-fixed-width">
                                                        <Typography>
                                                            {
                                                                opInfo.orderProduct.productQuantityProductQuantity - opInfo.orderProduct.returnQuantityProductQuantity
                                                            }
                                                        </Typography>

                                                    </td>
                                                    <td className="form-table-th-td-center-fixed-width">
                                                        <TextField 
                                                            style={{marginBottom: 5}}
                                                            variant="outlined"
                                                            value={opInfo.orderProduct.damageQuantityProductQuantity}
                                                            onChange={(e) => handleDamage(e,i,opi)} 
                                                            />
                                                    </td>
                                                    <td className="form-table-th-td-center-fixed-width">
                                                        <TextField 
                                                            style={{marginBottom: 5}}
                                                            variant="outlined"
                                                            value={opInfo.orderProduct.productRatePrice}
                                                            onChange={(e) => handleRate(e,i,opi)}
                                                        />
                                                    </td>
                                                    <td className="form-table-th-td-center-fixed-width">
                                                        <Typography>
                                                        {
                                                            (opInfo.orderProduct.productQuantityProductQuantity - opInfo.orderProduct.returnQuantityProductQuantity)*opInfo.orderProduct.productRatePrice
                                                        }
                                                        </Typography>
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
                                                {empOrderProducts[i].orderProductInfos.reduce(function(tot, arr) { 
                                                    return tot + arr.orderProduct.productQuantityProductQuantity;
                                                },0)}
                                            </td>
                                            <td className='form-table-th-td-center'>
                                                {empOrderProducts[i].orderProductInfos.reduce(function(tot, arr) { 
                                                    return tot + arr.orderProduct.returnQuantityProductQuantity;
                                                },0)}
                                            </td>
                                            <td className='form-table-th-td-center'>
                                            {empOrderProducts[i].orderProductInfos.reduce(function(tot, arr) { 
                                                    return tot + (arr.orderProduct.productQuantityProductQuantity-arr.orderProduct.returnQuantityProductQuantity);
                                                },0)}
                                            </td>
                                            <td className='form-table-th-td-center'>
                                            {empOrderProducts[i].orderProductInfos.reduce(function(tot, arr) { 
                                                    return tot + arr.orderProduct.damageQuantityProductQuantity;
                                                },0)}
                                            </td>
                                            <td className='form-table-th-td-center'>
                                                
                                            </td>
                                            <td className='form-table-th-td-center'>
                                                {empOrderProducts[i].orderProductInfos.reduce(function(tot, arr) { 
                                                    return tot + (arr.orderProduct.productQuantityProductQuantity-arr.orderProduct.returnQuantityProductQuantity)*arr.orderProduct.productRatePrice;
                                                },0)}
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
                                    <Grid item xs={8} style={{marginBottom : 10}}>
                                        <TextField 
                                            value={paymentAmount}
                                            required={true}
                                            onChange={(e) => handlePaymentAmount(e,i)}
                                            label={"New Payment Amount(tk)"}
                                            placeholder="344.55"
                                        />
                                    </Grid>
                                    <Grid item xs={4} style={{marginBottom : 10}}>
                                        <Typography >Previous Payment Amount : {empOrderProducts[i].orderSales.orderPaymentAmount}</Typography>
                                        <Typography >Due Payment Amount : {
                                            empOrderProducts[i].orderProductInfos.reduce(function(tot, arr) { 
                                                    return tot + (arr.orderProduct.productQuantityProductQuantity-arr.orderProduct.returnQuantityProductQuantity)*arr.orderProduct.productRatePrice;
                                            },0) - empOrderProducts[i].orderSales.orderPaymentAmount
                                        }</Typography>

                                    </Grid>
                                    <Grid item xs={6} style={{marginBottom : 10}}>
                                        <Typography >Total Damage Product Amount : {empOrderProducts[i].orderProductInfos.reduce(function(tot, arr) { 
                                                    return tot + arr.orderProduct.damageQuantityProductQuantity*arr.orderProduct.productRatePrice;
                                                },0)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} style={{marginBottom : 10}}>
                                        <TextField 
                                            placeholder={"Previous Commision : " + emP.orderSales.commission}
                                            onChange={handleCommision}
                                            label="Commision(tk)"
                                        />
                                    </Grid>
                                    <Grid item xs={6} style={{marginBottom : 10}}>
                                        <TextField 
                                            placeholder={"Previous Cost : " + emP.orderSales.cost}
                                            onChange={handleCost}
                                            label="Cost(tk)"
                                        />
                                    </Grid>
                                    <Grid item xs={12} style={{marginBottom : 10}}>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={10}>
                                        <Typography style={{textAlign : 'center'}} variant={'h4'}>Ground Total : {empOrderProducts[i].orderProductInfos.reduce(function(tot, arr) { 
                                                    return tot + (arr.orderProduct.productQuantityProductQuantity-arr.orderProduct.returnQuantityProductQuantity)*arr.orderProduct.productRatePrice;
                                                },0)} Taka</Typography>
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
                        Succesfully Order updated !
                    </Alert>
            </Snackbar>
        </div>
    )
}

