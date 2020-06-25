import React from 'react';
import { Card , CardHeader, Divider } from '@material-ui/core';
import Form from '../components/form';
import apiUrl from '../utils/apiInfo';

class AddCompany extends React.Component {

    fields = [
        {
            label : "Company Name",
            placeholder : "Amrita",
            type : 0,
            required : true,
            disabled : false,
            validation : [9999]
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
            label : "Company Contact",
            placeholder : "74634878476",
            type : 0,
            required : true,
            disabled : false,
            validation : [9999]

        },
        
    ]

    submitForm = (state) => {
        let product = {
            "companyName" : state.CompanyName,
            "companyAddress" : state.CompanyAddress,
            "companyContact" : state.CompanyContact,
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

        fetch(apiUrl+"Companies", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }
    render(){
        return (
            <Card style={{margin:40}}>
                <CardHeader
                    title="Add New Company"
                />
                <Divider />
                <Form onSubmit={this.submitForm} submitButton="Add Company" fields={this.fields}/>
            </Card>
        )
    }
}

export default AddCompany;