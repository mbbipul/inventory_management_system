import { Avatar, Box, Button, Card, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, makeStyles, Paper, TextField, Typography, withStyles } from "@material-ui/core";
import { green, grey, purple, yellow } from "@material-ui/core/colors";
import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import AsyncAutoComplete from "../components/asyncAutoComplete";
import apiUrl, { supportAPiUrl } from "../utils/apiInfo";
import submitForm, { submitFormWithAddress } from "../utils/fetchApi";
import DeleteALert from '../components/deleteALert';
import MaterialTable from "material-table";
import CustomizedDialogs from "../components/formDialog";

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



function SalesMemoHistory(){
    const classes = useStyles();
    const [salesMemoHistories,setSalesMemoryHis] = useState([]);
    const [rowData,setRowData] = useState(null);
    const [open, setOpen] = useState(false);

    const ShowMemo = (props) => {
        const [salesIds,setSalesIds] = useState([]);
        const [rowData,setRowData] = useState(props.rowData);
        useEffect(() => {
            setSalesIds(rowData.salesIds.split(',').map(d => parseInt(d)));
        },[rowData])
        
        return (
            <Memo salesIds={salesIds} classes={classes} />
        )
    }

    const handleClose = () => {
        setOpen(false);
    };

    const columns = [
        { title: 'Memo Id', field: '_id' },
        { title: 'Customer Name', field: 'customerName' },
        { 
            title: 'Memo Issued Date', 
            field: 'memoIssueDate' ,
            render : rowData => new Date(parseInt(rowData.memoIssueDate)).toDateString()
    
        },
        { title: 'Memo Issued By', field: 'issuedBy' },
        { 
            title: 'Memo Issued By', 
            field: 'issuedBy' ,
        },
        // {
        //     title : 'View Memo',
        //     field : 'memos',
        //     render : rowData => <Chip 
        //                                         color="primary"
        //                                         label={"View Memo"}
        //                                         onClick={() => {setRowData(rowData);setOpen(true)}}
        //                                         clickable /> 
        // }

    ]
    useEffect(() => {
        
        submitFormWithAddress(supportAPiUrl+"/memos","GET","", (res) => {
            setSalesMemoryHis(JSON.parse(res));
        });
        
    },[]);

    function Memo(props){
        const classes = props.classes;
        const [sales,setSales] = useState([]);

        const memoComponentRef = useRef();

        useEffect(() => {
            submitForm("sales/sales-product-info","POST",props.salesIds, (res) => {
                setSales(JSON.parse(res));
            });
        },[]);
    
        return (
            <Paper className={classes.memoBox}>
                {
                    sales.data === 'undefined' && (
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
                
                    )
                }
            </Paper>
        )
    }
    
    return (
        <Box style={{marginLeft:20}}>
            <h1 style={{textAlign:"center"}}>Sales Memo History</h1>
            {

                rowData !==null && (
                    <CustomizedDialogs 
                        dialogContent={<ShowMemo rowData={rowData}/>}
                        changOpenProps={()=> setOpen(false)} open={open} />
                )
            }
            <MaterialTable 
                title="Memos"
                apiUrl="SalesMemo/"  
                columns={columns} 
                data={salesMemoHistories} />
        </Box>
    );
}

export default SalesMemoHistory;