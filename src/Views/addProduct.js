import React from 'react';
import { Card , CardHeader, Divider } from '@material-ui/core';
import Form from '../components/form';
import { addProductFormFileds } from '../utils/appFormsFileds';
import submitForm from '../utils/fetchApi';

class AddProduct extends React.Component {

    submitForm = (state) => {
        let product = {
            "productName" : state.ProductName,
            "productCode" : state.ProductCode,
            "productCategoryId" : state.ProductType.productCategoryId,
            "productQuantity" : parseInt(state.ProductQuantity),
            "productPrice" : parseInt(state.PurchasePrice),
            "productDetails" : state.Details,
        }

        submitForm("Products","POST",product,() => alert("suucess"));
        console.log(product);
        
    }

    render(){
        return (
            <Card style={{margin:40}}>
                <CardHeader
                    title="Add New Product"
                />
                <Divider />
                <Form onSubmit={this.submitForm} submitButton="Add Product" fields={addProductFormFileds}/>
            </Card>
        )
    }
}

export default AddProduct;