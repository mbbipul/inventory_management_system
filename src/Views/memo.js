import { Box, Button, Card, Grid, makeStyles, Paper, TextField, Typography, withStyles } from "@material-ui/core";
import { green, grey, purple, yellow } from "@material-ui/core/colors";
import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import AsyncAutoComplete from "../components/asyncAutoComplete";
import Form from "../components/form";
import apiUrl from "../utils/apiInfo";
import { memoFormFields } from "../utils/appFormsFileds";
import submitForm from "../utils/fetchApi";

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
        paddingLeft : 300
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
    const [salesId,setSalesId] = useState(null);
    const [sales,setSales] = useState({});
    const [showCashMemo,setShowMemo] = useState(false);
    const memoComponentRef = useRef();

    const submitForms = (state) => { 

    }

    const salesIdField =  {
        label : "Sales Id",
        placeholder : "মিঃ রয় ",
        type : 3,
        dialogFormContent : null,
        fetchUrl : apiUrl+"Sales/salesIds",
        selectName : "salesId",
        selectKey : "salesId",
        required : true,
        disabled : false,
        validation : [9999]
    };

    const handleSalesAutoComplete = (value) => {
        setSalesId(value !== null ? value.salesId : null);
    };

    useEffect(() => {
        if(salesId !== null ){
            submitForm("sales/sales-product-info/"+salesId,"GET","", (res) => {
                setSales(JSON.parse(res));
                setShowMemo(true);
            });
        }
    },[salesId]);

    return (
        <Card className={classes.root}>
            <Paper className={classes.header}>Print Sales Memo</Paper>
            
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={3}
            >
                <Grid item xs>
                    <h1 style={{padding : 20}}>Please Select SalesId for Sales Memo.</h1>
                </Grid>
                <Grid item xs>
                    <AsyncAutoComplete
                        label={salesIdField.label}
                        name={salesIdField.label}
                        placeholder={salesIdField.placeholder}
                        margin="normal"
                        dialogContent={salesIdField.dialogFormContent}
                        required={salesIdField.required}
                        fetchUrl={salesIdField.fetchUrl}
                        validation={salesIdField.validation}
                        selectKey={salesIdField.selectKey}
                        selectName={salesIdField.selectName}
                        onDataChange={(fieldName,value)=>handleSalesAutoComplete(value)}

                    />
                </Grid>
            </Grid>
            {
                salesId !== null && showCashMemo && (
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
                                        <Grid item >পণ্যের নাম  ঃ </Grid>
                                        <Grid item >{sales.productName}</Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item>পণ্যের পরিমাণ  ঃ</Grid>
                                        <Grid item>{sales.productQuantity}</Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item>ক্রয়মূল্য প্রতি পণ্যের  ঃ </Grid>
                                        <Grid item>{(sales.salesPrice / sales.productQuantity).toPrecision(3)}</Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        direction="column"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item>total</Grid>
                                        <Grid item>{sales.salesPrice}</Grid>
                                    </Grid>
                                </Grid>
                            </Box>

                            <h2 className={classes.memoSignature} > 
                                ইস্যু কারীর নাম ঃ 
                                <strong style={{fontFamily : 'Snell Roundhand, cursive',paddingLeft: 5,fontSize:15}}> Bipul Mandol </strong>- <span style={{fontSize : 8,fontWeight : 100}}>Matrivandar</span>
                                <br /><span style={{fontSize : 10,fontWeight : 50}}>{ new Date().toLocaleDateString()}</span>
                            </h2>
                        </Box>
                        <ReactToPrint
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