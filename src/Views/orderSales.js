import React from 'react';
import { Card , CardHeader, Divider,Snackbar } from '@material-ui/core';
import Form from '../components/form';
import {  newSalesFormFields } from '../utils/appFormsFileds';
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';

newSalesFormFields.push({
    label : "Miscellaneous cost",
    placeholder : "200.00 tk",
    type : 0,
    required : true,
    disabled : false,
    validation : [0]
});

class OrderSales extends React.Component {


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

    }
    handleSnackbar = () => {
        this.setState({
            openSnackbar : false
        })
    }

    submitPurchaseForm = (state) => {

        if (this.props.order.productId !== state.ProductName.productId){
            this.setState({
                snackSeverity : 'error',
                snackText : 'Order Product and Sales Product are not same . Please choose order Product .',
                openSnackbar : true
            });
            return ;
        }

        if (this.props.order.productId !== state.ProductName.productId){
            this.setState({
                snackSeverity : 'error',
                snackText : 'Order Customer and Sales Customer are not same . Please choose order Customer .',
                openSnackbar : true
            });
            return ;
        }

        let exactSalesPrice = parseFloat(state.SalesPrice)*parseInt(state.ProductQuantity)-parseFloat(state.SalesDiscount)+parseFloat(state.Miscellaneouscost);

        let paid = exactSalesPrice - parseFloat(state.SalesPaymentAmount) ;
        let paidStatus = paid > 0 ? false : true ;

        let sales = {
            "customerId" : state.CustomerName.customerId,
            "productId" : state.ProductName.productId,
            "productPurchaseHistoryId" : state.purchaseHistory.productPurchaseHistoryId,
            "productQuantity" : parseInt(state.ProductQuantity),
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
               "totalProductInStock" : parseInt(state.ProductQuantity),
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

                <CardHeader
                    title="Add New Sales"
                />
                <Divider />
                <Form onSubmit={this.submitPurchaseForm} submitButton="Add Sales" fields={newSalesFormFields}/>

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