import React from 'react';

import { Card , CardHeader, Divider, Snackbar } from '@material-ui/core';
import Form from '../components/form';
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';
import {  addCustomerFormFields } from '../utils/appFormsFileds';

class AddCustomer extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            customer : {},
            openSnackbar : false,
        }
    }

    onCustomerAddSucces = (result) => {
        this.setState({
            customer : JSON.parse(result),
            openSnackbar : true,
        });

    }
    handleSnackbar = () => {
        this.setState({
            openSnackbar : false
        })
    }

    submitForms = (state) => {
        let customer = {
            "customerName" : state.CustomerName,
            "customerEmail" : state.CustomerEmail,
            "customerAddress" : state.CustomerAddress,
            "customerContact" : state.CustomerContact,
            "customerJoinDate" : Date.now().toString(),
            "customerNid" : state.CustomerNID
        }
        console.log(customer);
        submitForm("Customers","POST",customer,this.onCustomerAddSucces);

    }
    render(){
        return (
            <Card style={{margin:40}}>
                <CardHeader
                    title="Add New Customer"
                />
                <Divider />
                <Form onSubmit={this.submitForms}  submitButton="Add Customer" fields={addCustomerFormFields}/>
                <Snackbar 
                    open={this.state.openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={this.handleSnackbar}
                >
                    <Alert onClose={this.handleSnackbar} variant="filled" severity="success">
                        Succesfully new Customer "{this.state.customer.customerName}" added !
                    </Alert>
                </Snackbar>
            </Card>
        )
    }
}

export default AddCustomer;