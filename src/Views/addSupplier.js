import React from 'react';

import { Card , CardHeader, Divider } from '@material-ui/core';
import Form from '../components/form';

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