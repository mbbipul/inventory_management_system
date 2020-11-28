import React from 'react';
import { Card , CardHeader, Divider,Snackbar } from '@material-ui/core';
import Form from '../components/form';
import {  salesOrderFormFileds } from '../utils/appFormsFileds';
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';
import AppContext from '../context/appContext';

class OrderSales extends React.Component {
    static contextType = AppContext;
    constructor(props){
        super(props);
        this.state = {
            sales : {},
            salesOrder : {},
            snackText : '',
            snackSeverity : 'success',
            openSnackbar : false,
        }
    }

    onSalesAddSucces = (result) => {
        let salesTmp = JSON.parse(result);
        this.setState({
            sales : salesTmp,
            snackSeverity : 'success',
            snackText : "Succesfully new Sales "+salesTmp.salesId+" Added !",
            openSnackbar : true,
        });
        salesTmp['miscellaneousCost'] = parseFloat(this.state.salesOrder.Miscellaneouscost);
        this.props.onSubmitSuccess(salesTmp);

        this.context.setSalesDueNumber();
        this.context.setSalesPaymentDue();
    }
    handleSnackbar = () => {
        this.setState({
            openSnackbar : false
        })
    }

    submitPurchaseForm = (state) => {


        let exactSalesPrice = parseFloat(state.SalesPrice)*parseInt(state.ReceiveOrderProductQuantity)-parseFloat(state.SalesDiscount)+parseFloat(state.Miscellaneouscost);

        let paid = exactSalesPrice - parseFloat(state.SalesPaymentAmount) ;
        let paidStatus = paid > 0 ? false : true ;

        let sales = {
            "customerId" : state.CustomerName.customerId,
            "productId" : state.ProductName.productId,
            "productPurchaseHistoryId" : state.purchaseHistory.productPurchaseHistoryId,
            "productQuantity" : parseInt(state.ReceiveOrderProductQuantity),
            "salesDate" : Date.now().toString(),
            "salesPrice" : parseFloat(exactSalesPrice),
            "salesPaymentAmount" : parseFloat(state.SalesPaymentAmount),
            "salesPaidStatus" : paidStatus,
            "salesDuePaymentDate" : state.SalesDuePaymentDate.toString(),
            "salesDiscount" : parseFloat(state.SalesDiscount)

        }
        console.log(sales);
        submitForm("Sales","POST",sales,(res) => {
            let product = {
               "productId" : state.ProductName.productId,
               "productName" : state.ProductName.productName,
               "productCode" : state.ProductName.productCode,
               "productCategoryId" : state.ProductName.productCategoryId,
               "totalProducts" : 0,
               "totalProductInStock" : parseInt(state.ReceiveOrderProductQuantity),
               "productPrice" : 0,
               "salestPrice" : 0,
               "productDetails" : "s",
           }
           this.setState({
               salesOrder : state
           })
           submitForm("Products/bySales/"+product.productId,"PUT",product,this.onSalesAddSucces(res));

       });
        
    }
    render(){
        return (
            <Card style={{margin:40}}>
                <Divider />
                <Form onSubmit={this.submitPurchaseForm} submitButton="Add Orders" fields={salesOrderFormFileds}/>

                <Snackbar 
                    open={this.state.openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={this.handleSnackbar}
                >
                    <Alert onClose={this.handleSnackbar} variant="filled" severity={this.state.snackSeverity}>
                        {this.state.snackText}
                    </Alert>
                </Snackbar>
            </Card>
        )
    }
}

export default OrderSales;