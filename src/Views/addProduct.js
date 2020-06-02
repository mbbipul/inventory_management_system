import React from 'react';
import { Card , CardHeader, Divider } from '@material-ui/core';
import Form from '../components/form';

class AddProduct extends React.Component {

    fields = [
        {
            label : "Product Name",
            placeholder : "Fresh oil",
            type : 0,
        },
        {
            label : "Product Code",
            placeholder : "QT604T",
            type : 0,
        },
        {
            label : "Product Category",
            placeholder : "Please Select product Category",
            type : 1,
        },
        {
            label : "Product Quantity",
            placeholder : "5",
            type : 0,
        },
        {
            label : "Product Price",
            placeholder : "450.00 tk",
            type : 0,
        },
        {
            type : 999,
        },
        {
            label : "Purchase Price",
            placeholder : "500.00 tk",
            type : 0,
        },
        {
            label : "Sell Price",
            placeholder : "700.00 tk",
            type : 0,
        },
        {
            label : "Supplier Name",
            placeholder : "Please Select Supplier Name",
            type : 1,
        },
        {
            label : "Details",
            placeholder : "product details",
            type : 2,
        }
    ]
    render(){
        return (
            <Card style={{margin:40}}>
                <CardHeader
                    title="Add New Product"
                />
                <Divider />
                <Form fields={this.fields}/>
            </Card>
        )
    }
}

export default AddProduct;