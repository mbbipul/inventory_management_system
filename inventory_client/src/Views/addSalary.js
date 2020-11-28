import React from 'react';
import { Card , CardHeader, Divider, Snackbar} from '@material-ui/core';
import Form from '../components/form';
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';
import {  addSalaryFormFields } from '../utils/appFormsFileds';

class AddSalary extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            salary : {},
            openSnackbar : false,
        }
    }

    onSalaryAddSuccess = (result) => {
        this.setState({
            salary : JSON.parse(result),
            openSnackbar : true,
        });

    }

    handleSnackbar = () => {
        this.setState({
            openSnackbar : false
        })
    }

    submitForm = (state) => {
        let salary = {
            "employeeId" : state.EmployeeName.employeeId,
            "salaryAmount" : parseFloat(state.SalaryAmount),
            "SalaryPaymentDate" : Date.now(),
        }
        submitForm("Salaries","POST",salary,this.onSalaryAddSuccess);
    }
    render(){
        return (
            <Card style={{margin:40}}>
                <CardHeader
                    title="Add Salary"
                />
                <Divider />
                <Form onSubmit={this.submitForm} submitButton="Add Salary" fields={addSalaryFormFields}/>
                
                <Snackbar 
                    open={this.state.openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={this.handleSnackbar}
                >
                    <Alert onClose={this.handleSnackbar} variant="filled" severity="success">
                        Succesfully Salary "{this.state.salary.salaryId}" added !
                    </Alert>
                </Snackbar>
            </Card>
        )
    }
}

export default AddSalary;