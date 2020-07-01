import React from 'react';
import { Card , CardHeader, Divider } from '@material-ui/core';
import Form from '../components/form';
import { addPurchaseFormFields } from '../utils/appFormsFileds';

class AddPurchase extends React.Component {


    submitForm = (state) => {
        let product = {
            "productName" : state.ProductName,
            "productCode" : state.ProductCode,
            "productCategoryId" : state.ProductType.productCategoryId,
            "productQuantity" : parseInt(state.ProductQuantity),
            "productPrice" : parseInt(state.ProductPrice),
            "productDetails" : state.Details,
        }
        console.log(product);
        
    }
    render(){
        return (
            <Card style={{margin:40}}>
                <CardHeader
                    title="Add New Product"
                />
                <Divider />
                <Form onSubmit={this.submitForm} submitButton="Add Product" fields={addPurchaseFormFields}/>
            </Card>
        )
    }
}

export default AddPurchase;