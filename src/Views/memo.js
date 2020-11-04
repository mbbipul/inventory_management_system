import { Box, Button, Card, Chip, Grid, makeStyles, Paper, TextField, Typography, withStyles } from "@material-ui/core";
import { green, grey, purple, yellow } from "@material-ui/core/colors";
import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import AsyncAutoComplete from "../components/asyncAutoComplete";
import apiUrl from "../utils/apiInfo";
import submitForm from "../utils/fetchApi";
import DeleteALert from '../components/deleteALert';

const useStyles = makeStyles((theme) => ({
    root : {
        margin : 20,
        padding : 20
    },
    header : {
        padding : 30,
        marginBottom : 20,
        fontSize : 30,
        fontWeight : 900,
        backgroundColor : grey[300],
        color : green[500],
        textAlign : 'center',
    },
    memoBox : {
        padding : 20,
        border : '2px solid black',
        paddingLeft : 250
    },
    memo : {
        maxWidth : 600,
        marginTop : 30,
        border : '2px dotted black',
        padding : 30,
        '& h1 > span' : {
            fontSize : 20,
            marginLeft : 20,
            fontWeight : 100,
        }
    },
    memoSignature : {
        marginTop : 30,
        textAlign : 'right'
    },
    dotBorderTop : {
        borderTop : '2px dotted black',
        marginTop : 5,
    }
}));

const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(purple[500]),
      backgroundColor: purple[500],
      '&:hover': {
        backgroundColor: purple[700],
      },
    },
}))(Button);

function SalesMemo(){
    const classes = useStyles();
    const [salesIds,setSalesIds] = useState([]);
    const [salesIdsForMemo,setMemoSalesIds] = useState([]);
    const [sales,setSales] = useState([]);
    const [customerId,setCustomerId] = useState(null);
    const [showCashMemo,setShowMemo] = useState(false);
    const memoComponentRef = useRef();
    const [openMemoSave,setMemoSave] = useState(false);

    const addSalesIdForMemo = (value) => { 
        let tmp = [...salesIdsForMemo];
        if(checkSalesIdForMemo(value)){
            tmp = tmp.filter(item => item !== value)
        }else{
            tmp.push(value);
        }
        setMemoSalesIds(tmp);
    }

    const checkSalesIdForMemo = (id) => {
        if (salesIdsForMemo.includes(id)){
            return true;
        }
        return false;
    }
    const salesIdField =  {
        label : "Sales Id",
        placeholder : "XXXX ",
        type : 3,
        dialogFormContent : null,
        fetchUrl : apiUrl+"Sales/salesIds",
        selectName : "salesId",
        selectKey : "salesId",
        required : true,
        disabled : false,
        validation : [9999]
    };

    const customerIdField =  {
        label : "Customer Name",
        placeholder : "মিঃ রয় ",
        type : 3,
        dialogFormContent : null,
        fetchUrl : apiUrl+"customers/",
        selectName : "customerName",
        selectKey : "customerId",
        required : true,
        disabled : false,
        validation : [9999]
    };


    const handleSalesAutoComplete = (value) => {
        // setSalesId(value !== null ? value.salesId : null);
    };

    const handleCustomerAutoComplete = (value) => {
        setCustomerId(value !== null ? value.customerId : null);
    };

    useEffect(() => {
        if(salesIdsForMemo.length > 0 ){
            submitForm("sales/sales-product-info","POST",salesIdsForMemo, (res) => {
                setSales(JSON.parse(res));
                setShowMemo(true);
            });
        }else{
            setShowMemo(false);
        }
    },[salesIdsForMemo]);

    useEffect(() => {
        if(customerId !== null ){
            submitForm("Sales/salesIds","GET","", (res) => {
                setSalesIds(JSON.parse(res));
            });
        }
    },[customerId]);

    return (
        <Card className={classes.root}>
        
        <DeleteALert 
                message="Make sure that you Paid all amount of this Purchase . "
                title=" Are you sure to Mark this purchase as Mark Purchase payment Paid ?" 
                open={openMemoSave}
                handleDisagree={() => setMemoSave(false)}
                handleAgree={() => alert('save')}/>
            <Paper className={classes.header}>Print Sales Memo</Paper>
            
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={3}
            >
                <Grid item xs>
                    <h1 style={{padding : 20}}>Please Select Customer for Sales Memo.</h1>
                </Grid>
                <Grid item xs>
                    <AsyncAutoComplete
                        label={customerIdField.label}
                        name={customerIdField.label}
                        placeholder={customerIdField.placeholder}
                        margin="normal"
                        dialogContent={customerIdField.dialogFormContent}
                        required={customerIdField.required}
                        fetchUrl={customerIdField.fetchUrl}
                        validation={customerIdField.validation}
                        selectKey={customerIdField.selectKey}
                        selectName={customerIdField.selectName}
                        onDataChange={(fieldName,value)=>handleCustomerAutoComplete(value)}

                    />
                </Grid>
            </Grid>
            {
                salesIds.length > 0 && <h1 style={{padding : 20}}>Click Sales Id for adding to Memo.</h1>
            }

            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={2}
                style={{paddingLeft : 10}}
            >
                {
                    salesIds.map((v,i) => (
                        <Grid item>
                            <Chip  
                                color={checkSalesIdForMemo(v) ? "secondary" : "primary"} 
                                clickable
                                onClick={() => addSalesIdForMemo(v)}
                                label={v} />
                        </Grid>
                    ))
                }

            </Grid>
            {
                sales.data !== null &&  showCashMemo && (
                    <Paper className={classes.memoBox}>
                        <Box className={classes.memo} ref={memoComponentRef}>
                            <h1 style={{marginTop : -55,marginLeft: 180,fontStyle : 'italic'}}>Matrivander</h1>
                            <h1 style={{marginTop : 30}}>ক্রেতার নাম  ঃ  <span>{sales.customerName}</span></h1>
                            <h1>মোবাইল নম্বর  ঃ <span>{sales.customerContact}</span></h1>
                            <h1>ঠিকানা  ঃ <span>{sales.customerAddress}</span></h1>
                            <Box style={{borderTop : '2px dotted black',marginTop : 40,paddingTop: 20}}>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                    spacing={4}
                                >   
                                    <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item >পণ্যের নাম </Grid>
                                        {
                                            sales.data.map(v => (
                                                <Grid item >{v.productName}</Grid>
                                            ))
                                        }
                                    </Grid>
                                    <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item>পণ্যের পরিমাণ </Grid>
                                        {
                                            sales.data.map(v => (
                                                <Grid item >{v.productQuantity}</Grid>
                                            ))
                                        }
                                    </Grid>
                                    <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item>ক্রয়মূল্য প্রতি পণ্যের </Grid>
                                        {
                                            sales.data.map(v => (
                                                <Grid item>{(v.salesPrice / v.productQuantity).toPrecision(3)}</Grid>
                                            ))
                                        }
                                    </Grid>
                                    <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item>পণ্যের মূল্য </Grid>
                                        {
                                            sales.data.map(v => (
                                                <Grid item>{v.salesPrice}</Grid>
                                            ))
                                        }
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                    spacing={4}
                                    className = {classes.dotBorderTop}
                                >   
                                    <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item>প্রদত্ত পণ্যের পরিমাণ </Grid>
                                        {
                                            sales.data.map(v => (
                                                <Grid item>{v.productQuantity-v.dueProductQuantity}</Grid>
                                            ))
                                        }
                                    </Grid>
                                    <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item>বকেয়া পণ্যের পরিমাণ </Grid>
                                        {
                                            sales.data.map(v => (
                                                <Grid item>{v.dueProductQuantity}</Grid>
                                            ))
                                        }
                                    </Grid>
                                    <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item> পণ্যের প্রদত্ত অর্থের পরিমাণ</Grid>
                                        {
                                            sales.data.map(v => (
                                                <Grid item>{v.salesPaymentAmount}</Grid>
                                            ))
                                        }
                                    </Grid>
                                   
                                </Grid>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                    spacing={4}
                                    className = {classes.dotBorderTop}
                                >   
                                   <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item>পণ্যের বকেয়া অর্থের পরিমাণ</Grid>
                                        {
                                            sales.data.map(v => (
                                                <Grid item>{v.salesPrice-v.salesPaymentAmount}</Grid>
                                            ))
                                        }
                                    </Grid>

                                    <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item>পণ্য ক্রয়ের তারিখ </Grid>
                                        {
                                            sales.data.map(v => (
                                                <Grid item>{new Date(parseFloat(v.salesDate)).toLocaleString("bn-BD")}</Grid>
                                            ))
                                        }
                                    </Grid>

                                </Grid>
                                
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                    spacing={4}
                                    style={{borderTop : '5px solid black',marginTop: 20,paddingTop : 20}}
                                >   
                                    <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item >মোট পণ্যে </Grid>
                                        <Grid item >{sales.toTalProduct}</Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item>মোট পণ্যের পরিমাণ </Grid>
                                        <Grid item >{sales.totalProductQuantity}</Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item>ক্রয়মূল্য প্রতি পণ্যের - গড়  </Grid>
                                        <Grid item >{(sales.totalSalesPrice / sales.totalProductQuantity).toPrecision(3)}</Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item>পণ্যের মূল্য </Grid>
                                        <Grid item >{sales.totalSalesPrice}</Grid>
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                    spacing={4}
                                    className = {classes.dotBorderTop}
                                >   
                                    <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item>প্রদত্ত পণ্যের পরিমাণ </Grid>
                                        <Grid item>{sales.totalProductQuantity-sales.totalDueProductQuantity}</Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item>বকেয়া পণ্যের পরিমাণ </Grid>
                                        <Grid item>{sales.totalDueProductQuantity}</Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item> পণ্যের প্রদত্ত অর্থের পরিমাণ</Grid>
                                        <Grid item>{sales.totalSalesPaymentAmount}</Grid>
                                    </Grid>
                                   
                                </Grid>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                    spacing={4}
                                    className = {classes.dotBorderTop}
                                >   
                                   <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item>পণ্যের বকেয়া অর্থের পরিমাণ</Grid>
                                        <Grid item>{sales.totalSalesPrice-sales.totalSalesPaymentAmount}</Grid>
                                    </Grid>

                                </Grid>
                            </Box>

                            <h2 className={classes.memoSignature} > 
                                ইস্যু কারীর নাম ঃ 
                                <strong style={{fontFamily : 'Snell Roundhand, cursive',paddingLeft: 5,fontSize:15}}> Bipul Mandol </strong>- <span style={{fontSize : 8,fontWeight : 100}}>Matrivandar</span>
                                <br /><span style={{fontSize : 10,fontWeight : 50}}>{ new Date().toLocaleString("bn-BD")}</span>
                            </h2>
                        </Box>
                        <ReactToPrint
                            onAfterPrint={(res) => setMemoSave(true) }
                            trigger={() => <ColorButton style={{float : 'right',marginTop: 30}}>Print Sales memo</ColorButton>}
                            content={() => memoComponentRef.current}
                        />
                        
                    </Paper>
                )
            }
        </Card>
    );
}

export default SalesMemo;