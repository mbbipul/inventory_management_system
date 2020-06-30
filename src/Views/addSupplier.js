import React from 'react';

import { Card , CardHeader, Divider, Snackbar } from '@material-ui/core';
import Form from '../components/form';
import apiUrl from '../utils/apiInfo';
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';

class AddSupplier extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            supplier : {},
            openSnackbar : false,
        }
    }

    onSupplierAddSucces = (result) => {
        this.setState({
            supplier : JSON.parse(result),
            openSnackbar : true,
        });

    }
    handleSnackbar = () => {
        this.setState({
            openSnackbar : false
        })
    }

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
            validation : [0]
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
            placeholder : "Matrivandar store",
            type : 3,
            fetchUrl : apiUrl+"Companies",
            selectName : "companyName",
            selectKey : "companyId",
            required : false,
            disabled : false,
            validation : [9999]
        },
    ]

    submitForms = (state) => {
        let supplier = {
            "companyId" : state.SupplierCompanyName.companyId,
            "supplierName" : state.SupplierName,
            "supplierAddress" : state.SupplierAddress,
            "supplierContact" : state.SupplierContact,
            "supplierEmail" : state.SupplierEmail,
        }
        console.log(supplier);
        submitForm("Suppliers","POST",supplier,this.onSupplierAddSucces);

    }
    render(){
        return (
            <Card style={{margin:40}}>
                <CardHeader
                    title="Add New Supplier"
                />
                <Divider />
                <Form onSubmit={this.submitForms}  submitButton="Add Supplier" fields={this.fields}/>
                <Snackbar 
                    open={this.state.openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={this.handleSnackbar}
                >
                    <Alert onClose={this.handleSnackbar} variant="filled" severity="success">
                        Succesfully new supplier "{this.state.supplier.supplierName}" added !
                    </Alert>
                </Snackbar>
            </Card>
        )
    }
}

export default AddSupplier;