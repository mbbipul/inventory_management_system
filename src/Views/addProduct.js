import React from 'react';
import { Card , CardHeader, Divider, Snackbar } from '@material-ui/core';
import Form from '../components/form';
import { addProductFormFileds } from '../utils/appFormsFileds';
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';

class AddProduct extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            product : {},
            openSnackbar : false,
        }
    }

    onProductAddSucces = (result) => {
        this.setState({
            openSnackbar : true,
        });

    }
    handleSnackbar = () => {
        this.setState({
            openSnackbar : false
        })
    }

    submitAddProductForm = (state) => {
     
        let exactPurchasePrice = parseFloat(state.PurchasePrice)-parseFloat(state.PurchaseDiscount);

        let product = {
            "productName" : state.ProductName,
            "productCode" : state.ProductCode,
            "productCategoryId" : state.ProductType.productCategoryId,
            "totalProducts" : parseInt(state.ProductQuantity),
            "totalProductInStock" : parseInt(state.ProductQuantity),
            "productPrice" : exactPurchasePrice,
            "salestPrice" : parseFloat(state.SalesPrice),
            "productDetails" : state.Details,
        }


        let paid = exactPurchasePrice - parseFloat(state.PurchasePaymentAmount) ;
        let paidStatus = paid > 0 ? false : true ;

      
        submitForm("Products","POST",product,(result) => {
            let product = JSON.parse(result);
            this.setState({product : product});
            let purchase = {
                "supplierId" : state.SupplierName.supplierId,
                "productQuantity" : parseInt(state.ProductQuantity),
                "purchaseDate" : Date.now().toString(),
                "purchasePrice" : exactPurchasePrice,
                "salesPrice" : parseFloat(state.SalesPrice),
                "purchasePaymentAmount" : parseFloat(state.PurchasePaymentAmount),
                "purchasePaidStatus" : paidStatus,
                "purchaseDuePaymentDate" : state.PurchaseDuePaymentDate.toString(),
                "purchaseDiscount" : parseFloat(state.PurchaseDiscount),
                "productId" : product.productId
    
            }
            console.log(product);
            console.log(purchase)
            submitForm("Purchases","POST",purchase,this.onProductAddSucces);

        });
        
    }

    render(){
        return (
            <Card style={{margin:40}}>
                <CardHeader
                    title="Add New Product"
                />
                <Divider />
                <Form onSubmit={this.submitAddProductForm} submitButton="Add Product" fields={addProductFormFileds}/>
            
                <Snackbar 
                    open={this.state.openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={this.handleSnackbar}
                >
                    <Alert onClose={this.handleSnackbar} variant="filled" severity="success">
                        Succesfully new Product "{this.state.product.productName}" added !
                    </Alert>
                </Snackbar>
            </Card>
        )
    }
}

export default AddProduct;