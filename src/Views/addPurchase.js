import React from 'react';
import { Card , CardHeader, Divider,Snackbar } from '@material-ui/core';
import Form from '../components/form';
import { addPurchaseFormFields } from '../utils/appFormsFileds';
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';

class AddPurchase extends React.Component {


    constructor(props){
        super(props);
        this.state = {
            purchase : {},
            openSnackbar : false,
        }
    }

    onPurchaseAddSucces = (result) => {
        this.setState({
            purchase : JSON.parse(result),
            openSnackbar : true,
        });

    }
    handleSnackbar = () => {
        this.setState({
            openSnackbar : false
        })
    }

    submitPurchaseForm = (state) => {
        let exactPurchasePrice = parseFloat(state.PurchasePrice)-parseFloat(state.PurchaseDiscount);

        let paid = exactPurchasePrice - parseFloat(state.PurchasePaymentAmount) ;
        let paidStatus = paid > 0 ? false : true ;

        let purchase = {
            "supplierId" : state.SupplierName.supplierId,
            "productId" : state.ProductName.productId,
            "productQuantity" : parseInt(state.ProductQuantity),
            "purchaseDate" : Date.now().toString(),
            "purchasePrice" : parseFloat(state.PurchasePrice),
            "salesPrice" : parseFloat(state.SalesPrice),
            "purchasePaymentAmount" : parseFloat(state.PurchasePaymentAmount),
            "purchasePaidStatus" : paidStatus,
            "purchaseDuePaymentDate" : state.PurchaseDuePaymentDate.toString(),
            "purchaseDiscount" : parseFloat(state.PurchaseDiscount)

        }
        console.log(purchase);
        submitForm("Purchases","POST",purchase,this.onPurchaseAddSucces);
        
    }
    render(){
        return (
            <Card style={{margin:40}}>
                <CardHeader
                    title="Add New Product"
                />
                <Divider />
                <Form onSubmit={this.submitPurchaseForm} submitButton="Add Product" fields={addPurchaseFormFields}/>

                <Snackbar 
                    open={this.state.openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={this.handleSnackbar}
                >
                    <Alert onClose={this.handleSnackbar} variant="filled" severity="success">
                        Succesfully new Purchase "{this.state.purchase.purchaseId}" added !
                    </Alert>
                </Snackbar>
            </Card>
        )
    }
}

export default AddPurchase;