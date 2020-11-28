import React from 'react';
import { Card , CardHeader, Divider,Snackbar } from '@material-ui/core';
import Form from '../components/form';
import {  newSalesFormFields } from '../utils/appFormsFileds';
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';
import AppContext from '../context/appContext';

class NewSales extends React.Component {
    static contextType = AppContext;

    constructor(props){
        super(props);
        this.state = {
            sales : {},
            openSnackbar : false,
        }
    }

    onSalesAddSucces = (result) => {

        this.setState({
            sales : JSON.parse(result),
            openSnackbar : true,
        });
        this.context.setSalesDueNumber();
        this.context.setSalesPaymentDue();

    }
    handleSnackbar = () => {
        this.setState({
            openSnackbar : false
        })
    }

    submitPurchaseForm = (state) => {
        let exactSalesPrice = parseFloat(state.SalesPrice)*parseInt(state.ProductQuantity)-parseFloat(state.SalesDiscount);

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
                    <Alert onClose={this.handleSnackbar} variant="filled" severity="success">
                        Succesfully new Sales "{this.state.sales.salesId}" Added !
                    </Alert>
                </Snackbar>
            </Card>
        )
    }
}

export default NewSales;