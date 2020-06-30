import React from 'react';
import { Card , CardHeader, Divider } from '@material-ui/core';
import Form from '../components/form';
import apiUrl from '../utils/apiInfo';

class AddPurchase extends React.Component {

    fields = [
        
        {
            label : "Supplier Name",
            placeholder : "BB Roy",
            type : 3,
            fetchUrl : apiUrl+"Suppliers",
            selectName : "supplierName",
            selectKey : "supplierId",
            required : true,
            disabled : false,
            validation : [9999]

        },
        {
            label : "Product Name",
            placeholder : "Ice Cream",
            type : 3,
            fetchUrl : apiUrl+"Products",
            selectName : "productName",
            selectKey : "productId",
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
            label : "Purchase Price",
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
            label : "Purchase Price",
            labelExtra : " ( Per Product )",
            placeholder : "000.00 tk",
            type : 5,
            required : true,
            disabled : true,
            validation : [0]
        },
        {
            label : "Sales Price",
            labelExtra : " ( Per Product )",
            placeholder : "700.00 tk",
            type : 5,
            required : true,
            disabled : false,
            validation : [0]
        },
        {
            label : "Purchase Payment Amount",
            placeholder : "500.00 tk",
            type : 0,
            required : true,
            disabled : false,
            validation : [999]
        },
        {
            label : "Purchase Due Payment Date",
            placeholder : "12-12-2021",
            type : 6,
            required : true,
            disabled : false,
            validation : [999]
        }
    ]

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
                <Form onSubmit={this.submitForm} submitButton="Add Product" fields={this.fields}/>
            </Card>
        )
    }
}

export default AddPurchase;