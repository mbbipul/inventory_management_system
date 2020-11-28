import React from 'react';
import { Card , CardHeader, Divider, Snackbar} from '@material-ui/core';
import Form from '../components/form';
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';
import { addCompanyFormFields } from '../utils/appFormsFileds';

class AddCompany extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            company : {},
            openSnackbar : false,
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
                <Form onSubmit={this.submitForm} submitButton="Add Company" fields={addCompanyFormFields}/>
                
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