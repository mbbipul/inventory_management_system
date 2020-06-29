import React from 'react';
import { Card , CardHeader, Divider, Snackbar} from '@material-ui/core';
import Form from '../components/form';
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';

class AddCompany extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            company : {},
            openSnackbar : false,
            redirect : false
        }
    }

    onCompanyAddSucces = (result) => {
        this.setState({
            company : JSON.parse(result),
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
            label : "Company Name",
            placeholder : "Amrita",
            type : 4,
            fetchUrl : "Companies/find/",
            required : true,
            disabled : false,
            validation : [1] 
        },
        {
            label : "Company Address",
            placeholder : "Barishal",
            type : 0,
            required : true,
            disabled : false,
            validation : [9999]

        },
        {
            label : "Company Contact Number",
            placeholder : "74634878476",
            type : 0,
            required : true,
            disabled : false,
            validation : [0] 

        },
        
    ]

    submitForm = (state) => {
        let product = {
            "companyName" : state.CompanyName,
            "companyAddress" : state.CompanyAddress,
            "companyContact" : state.CompanyContactNumber,
        }
        submitForm("Companies","POST",product,this.onCompanyAddSucces);
    }
    render(){
        return (
            <Card style={{margin:40}}>
                <CardHeader
                    title="Add New Company"
                />
                <Divider />
                <Form onSubmit={this.submitForm} submitButton="Add Company" fields={this.fields}/>
                
                <Snackbar 
                    open={this.state.openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={this.handleSnackbar}
                >
                    <Alert onClose={this.handleSnackbar} variant="filled" severity="success">
                        Succesfully new company "{this.state.company.companyName}" added !
                    </Alert>
                </Snackbar>
            </Card>
        )
    }
}

export default AddCompany;