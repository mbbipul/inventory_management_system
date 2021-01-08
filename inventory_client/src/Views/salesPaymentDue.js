import React, { useState, useEffect } from 'react';
import submitForm from '../utils/fetchApi';
import MaterialTable from 'material-table';
import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AppContext from '../context/appContext';
import MaterialUIPickers from '../components/datePicker';
import DeleteALert from '../components/deleteALert';
import FullWidthTabs from '../components/tab';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';


  
export default function SalesPaymentDue(props) {

    const [data,setData] = useState([]);
    const [orderSales,setOrderSales] = useState([]);

    const [open,setOpen] = useState(false);

    const [fieldValue,setFieldValue] = useState("");
    const [openDeleteAlert,setOpenDeleteAlert] = useState(false);
    const [tmpData,setTmpData] = useState({});
    const [salesTab,setSalesTab] = useState(0);
    const [openSnackbar,setOpenSnackbar] = useState(false);

    const [columns,] =  useState([
        { title: 'Sales Id   ', field: 'salesId' },
        { title: 'Customer Name', field: 'customerName' },
        { title: 'Sales Payment Due Amount', field: 'salesPaymentDue' },
        { 
            title: 'Sales Date', 
            field: 'salesDate' ,
            render : rowData => new Date(parseInt(rowData.salesDate)).toDateString() 

        },

    ]);

    const [OrderSalesColumns,] =  useState([
        { title: 'Order Sales Id   ', field: 'orderSalesId' },
        { title: 'DSR (Employee) Name', field: 'employeeName' },
        { title: 'Order Payment Due Amount', field: 'orderPaymentDue' },
        { 
            title: 'Sales Date', 
            field: 'salesDate' ,
            render : rowData => new Date(parseInt(rowData.orderDate)).toDateString() 

        },

    ]);

    const [salesWithDue,setSalesWithDue] = useState({});

    const {  setSalesPaymentDue } = React.useContext(AppContext);

    const FetchData = async () => {
        submitForm("sales/sales-payment-due","GET","",(res) => setData(JSON.parse(res)))
        setSalesPaymentDue();
    };

    const FetchOrderData = () =>{
        submitForm("orders/order-sales-payment-due","GET","",(res) => setOrderSales(JSON.parse(res)))
        setSalesPaymentDue();
    }

    useEffect(() => {
        FetchData();
        FetchOrderData();
    },[]);

    const handleDialog = (data) => {
        
        setOpen(true);
        setSalesWithDue(data);
    }
    const handleUpdate = () => {
        if(parseFloat(fieldValue) > salesWithDue.salesPaymentDue){
            alert("Your Sales due amount is more than "+salesWithDue.salesPaymentDue);
        }else{

            let paymentSaleseHis = {
                salesId : salesWithDue.salesId,
                paymentSalesDate : new Date().getTime().toString(),
                paymentAmount : parseFloat(fieldValue),
            }
           
            submitForm("sales/sales-payment-due/"+ 
                    salesWithDue.salesId+"-"+parseFloat(fieldValue),"PUT","",(res) => {
                        submitForm("Paymentsales","POST",paymentSaleseHis, (res) => {
                            setOpenSnackbar(true);
                            FetchData();
                        });
                    });
            setOpen(false);     

        }
    }

    const markDOne = (data) => {
        setOpenDeleteAlert(true);
        setTmpData(data);
        
    }

    const handleDeleteALertDisAgree = () => {
        setOpenDeleteAlert(false);
        setTmpData(null);
    }

    const handleDeleteALertAgree = () => {
        if(salesTab===0){
            if (tmpData === null) {
                alert('Something Went wrong');
                return ;
            }
    
            let paymentSaleseHis = {
                salesId : tmpData.salesId,
                paymentSalesDate : new Date().getTime().toString(),
                paymentAmount : tmpData.salesPaymentDue,
            }
            submitForm("sales/sales-payment-due/"+ 
                tmpData.salesId+"-"+tmpData.salesPaymentDue,"PUT","",(res) => {
                    submitForm("Paymentsales","POST",paymentSaleseHis, (res) => {
                        setOpenSnackbar(true);
                        FetchData();
                    });
                });
    
            setOpenDeleteAlert(false);
        }else{
            if (tmpData === null) {
                alert('Something Went wrong');
                return ;
            }
    
            let paymentOrderSaleseHis = {
                orderSalesId : tmpData.orderSalesId,
                paymentOrderSalesDate : new Date().getTime().toString(),
                paymentAmount : tmpData.orderPaymentDue,
            }
            submitForm("orders/order-sales-payment-due/"+ 
                tmpData.orderSalesId+"-"+tmpData.orderPaymentDue,"PUT",paymentOrderSaleseHis,(res) => {
                   // submitForm("Paymentsales","POST",paymentSaleseHis, (res) => {
                    setOpenSnackbar(true);
                    FetchOrderData();
                    //});
                });
    
            setOpenDeleteAlert(false);
        }

        setTmpData(null);
    }
    const handleSalesTab = (v) => {
        setSalesTab(v);
    }

    const tabsSales = [
        {
            tab : "Manage Sales Payment Due",
            tabPanel :  ''
        },
        {
            tab : "Manage Order Payment Due",
            tabPanel :  ''
        }];

    return(
        <div style={{margin : 20}}>
            <DeleteALert 
                message="Make sure that you Recieve all payment of this Sales . "
                title=" Are you sure to Mark this Sales as Mark Sales payment Paid ?" 
                open={openDeleteAlert}
                handleDisagree={handleDeleteALertDisAgree}
                handleAgree={handleDeleteALertAgree}/>

            <Dialog open={open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Sales Payment Due</DialogTitle>
                <DialogContent>
                   
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        onChange={(event) => setFieldValue(event.target.value)}
                        label="Pay Sales Due Amount"
                        type="text"
                        fullWidth
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
            <FullWidthTabs onChangeTab={handleSalesTab} tabs={tabsSales}/>

            {
                salesTab === 0 ? (
                    <MaterialTable
                        title="Manage Sales Payment Due"
                        columns={columns}
                        data={data}
                        actions={[
                            {
                            icon: 'edit',
                            tooltip: 'Pay Sales Payment Due ',
                            onClick: (event, rowData) => handleDialog(rowData)
                            },
                            rowData => ({
                            icon: () =>  <DoneOutlineOutlinedIcon style={{ color: green[500] }}/>,
                            tooltip: 'Mark Sales payment due paid',
                            onClick: (event, rowData) => markDOne(rowData),
                            })
                        ]}
                    
                        options={{
                            actionsColumnIndex: -1
                        }}
                    />
                ) : (
                    <MaterialTable
                        title="Manage Order Sales Payment Due"
                        columns={OrderSalesColumns}
                        data={orderSales}
                        actions={[
                            {
                            icon: 'edit',
                            tooltip: 'Pay Sales Payment Due ',
                            onClick: (event, rowData) => handleDialog(rowData)
                            },
                            rowData => ({
                            icon: () =>  <DoneOutlineOutlinedIcon style={{ color: green[500] }}/>,
                            tooltip: 'Mark Sales payment due paid',
                            onClick: (event, rowData) => markDOne(rowData),
                            })
                        ]}
                    
                        options={{
                            actionsColumnIndex: -1
                        }}
                    />
                )
            }
            <Snackbar 
                    open={openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={() => setOpenSnackbar(false)}
                >
                    <Alert onClose={() => setOpenSnackbar(false)} variant="filled" severity="success">
                        Succesfully Update Sales Due Payment !
                    </Alert>
            </Snackbar>
        </div>
        
    )
}