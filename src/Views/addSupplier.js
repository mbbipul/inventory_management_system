import React from 'react';

import { Card , CardHeader, Divider } from '@material-ui/core';
import Form from '../components/form';
import apiUrl from '../utils/apiInfo';

class AddSupplier extends React.Component {

    fields = [
        {
            label : "Supplier Name",
            placeholder : "BB Roy",
            type : 0,
            required : true,
            disabled : false,
            validation : [9999]
        },
        {
            label : "Supplier Address",
            placeholder : "Barishal Sador",
            type : 0,
            required : true,
            disabled : false,
            validation : [9999]
        },
        {
            label : "Supplier Contact",
            placeholder : " +8801xxxxxxxxx",
            type : 0,
            required : true,
            disabled : false,
            validation : [9999]
        },
        {
            label : "Supplier Email",
            placeholder : "bb@gmail.com",
            type : 0,
            required : false,
            disabled : false,
            validation : [9999]
        },
        {
            label : "Supplier Company Name",
            placeholder : "Amrita",
            type : 0,
            required : false,
            disabled : false,
            validation : [9999]
        },
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
                    title="Add New Supplier"
                />
                <Divider />
                <Form submitButton="Add Supplier" fields={this.fields}/>
            </Card>
        )
    }
}

export default AddSupplier;