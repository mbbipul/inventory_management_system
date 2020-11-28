import React from 'react';
import { Card , CardHeader, Divider, Snackbar} from '@material-ui/core';
import Form from '../components/form';
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';
import {  addEmployeeFormFields } from '../utils/appFormsFileds';

class AddEmployee extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            employee : {},
            openSnackbar : false,
        }
    }

    onEmployeeAddSuccess = (result) => {
        this.setState({
            employee : JSON.parse(result),
            openSnackbar : true,
        });

    }

    handleSnackbar = () => {
        this.setState({
            openSnackbar : false
        })
    }

    submitForm = (state) => {
        let employee = {
            "employeeName" : state.EmployeeName,
            "employeeEmail" : state.EmployeeEmail,
            "employeeAddress" : state.EmployeeAddress,
            "employeeContact" : state.EmployeeContact,
            "date" : Date.now().toString(),
            "employeeNID" : state.EmployeeNID

        }
        submitForm("Employees","POST",employee,this.onEmployeeAddSuccess);
    }
    render(){
        return (
            <Card style={{margin:40}}>
                <CardHeader
                    title="Add New Employee"
                />
                <Divider />
                <Form onSubmit={this.submitForm} submitButton="Add Employee" fields={addEmployeeFormFields}/>
                
                <Snackbar 
                    open={this.state.openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={this.handleSnackbar}
                >
                    <Alert onClose={this.handleSnackbar} variant="filled" severity="success">
                        Succesfully new Employee "{this.state.employee.employeeName}" added !
                    </Alert>
                </Snackbar>
            </Card>
        )
    }
}

export default AddEmployee;