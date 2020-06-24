import React from 'react';
import { Card , CardHeader, Divider } from '@material-ui/core';
import Form from '../components/form';
import apiUrl from '../utils/apiInfo';

class AddProduct extends React.Component {

    fields = [
        {
            label : "Product Name",
            placeholder : "Fresh oil",
            type : 0,
            required : true,
            disabled : false,
            validation : [9999]
        },
        {
            label : "Product Code",
            placeholder : "QT604T",
            type : 0,
            required : true,
            disabled : false,
            validation : [9999]

        },
        {
            label : "Product Type",
            placeholder : "Please Select product Type",
            type : 1,
            required : true,
            disabled : false,
            validation : [9999]

        },
        {
            label : "Product Quantity",
            placeholder : "5",
            type : 0,
            required : true,
            disabled : false,
            validation : [0]
        },
        {
            label : "Product Price",
            placeholder : "450.00 tk",
            type : 0,
            required : true,
            disabled : false,
            validation : [0]

        },
        {
            label : "Purchase Discount",
            placeholder : "200.00 tk",
            type : 0,
            required : true,
            disabled : false,
            validation : [0]
        },

        {
            label : "",
            disabled : false,
            type : 999,
        },
        {
            label : "Purchase Price ( Per Product )",
            placeholder : "000.00 tk",
            type : 0,
            required : true,
            disabled : true,
            validation : [0]
        },
        {
            label : "Sales Price ( Per Product )",
            placeholder : "700.00 tk",
            type : 0,
            required : true,
            disabled : false,
            validation : [0]
        },
        {
            label : "Supplier Name",
            placeholder : "Please Select Supplier Name",
            type : 1,
            required : true,
            disabled : false,
            validation : [0]
        },
        {
            label : "Details",
            placeholder : "product details",
            type : 2,
            required : true,
            disabled : false,
            validation : [0]
        }
    ]

    submitForm = (state) => {
        let product = {
            "productName" : state.ProductName,
            "productCode" : state.ProductCode,
            "productType" : state.ProductType,
            "productQuantity" : parseInt(state.ProductQuantity),
            "productPrice" : parseInt(state.ProductPrice),
            "productDetails" : state.Details,
        }
        console.log(product);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(product);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(apiUrl+"Products", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }
    render(){
        return (
            <Card style={{margin:40}}>
                <CardHeader
                    title="Add New Product"
                />
                <Divider />
                <Form onSubmit={this.submitForm} submitButton="Add Product" fields={this.fields}/>
            </Card>
        )
    }
}

export default AddProduct;