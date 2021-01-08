import React, { useState } from 'react';
import { Box,Card, Snackbar, Typography } from '@material-ui/core';
import { newSalesFormFields } from '../utils/appFormsFileds';
import Form from '../components/form';
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';
import AppContext from '../context/appContext';


function NewSales() {
    const [openSnackbar,setOpenSnackbar] = useState(false);
    const {  setSalesDueNumber,setSalesPaymentDue } = React.useContext(AppContext);
    const submitForms = (state) => {
        let salesPaidStatus = false;
        if(parseFloat(state.SalesPaymentAmount) === state.totalProductsPrice){
            salesPaidStatus = true;
        }
        const sales = {
            customerId : state.CustomerName.customerId,
            salesDate : new Date().getTime().toString(),
            salesPrice : state.totalProductsPrice,
            salesPaymentAmount : parseFloat(state.SalesPaymentAmount),
            salesPaidStatus : salesPaidStatus,
        }
        submitForm('sales','POST',sales,(res) => {
            let data = JSON.parse(res);
            const salesProducts = [];

            state.ProductInfo.map((item,i) => {
                const salesProduct = {
                    salesId : data.salesId,
                    productPurchaseHistoryId : item.productPurchaseHistoryId,
                    productQuantity : item.productQuantity,
                    PerProductPrice : item.salesPrice 
                };
                salesProducts.push(salesProduct);
            })
            submitForm('sales/sales-product','POST',salesProducts,(res) => {
                console.log(res);
                setOpenSnackbar(true);
                setSalesDueNumber();
                setSalesPaymentDue();
                setInterval(function (){
                    window.location.href = "/sales/new-sales";

                },2000);

            })
        });
    }
    return (
        <Box>
            <Card style={{marginTop:20,padding:20}}>
                <Typography variant='h4' style={{textAlign:'center'}} >New Sales Memo</Typography>
                <Form onSubmit={submitForms} submitButton="Add New Sales " fields={newSalesFormFields}/>

            </Card>
            <Snackbar 
                    open={openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={() => setOpenSnackbar(false)}
                >
                    <Alert onClose={() => setOpenSnackbar(false)} variant="filled" severity="success">
                        Succesfully new Sales added !
                    </Alert>
            </Snackbar>
        </Box>
    )
}
export default NewSales;