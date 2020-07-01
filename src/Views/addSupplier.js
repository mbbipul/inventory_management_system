import React from 'react';

import { Card , CardHeader, Divider, Snackbar } from '@material-ui/core';
import Form from '../components/form';
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';
import { addSupplierFormFileds } from '../utils/appFormsFileds';

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
                <Form onSubmit={this.submitForms}  submitButton="Add Supplier" fields={addSupplierFormFileds}/>
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