import React from 'react';
import { Box,Card, Typography } from '@material-ui/core';
import { newSalesFormFields } from '../utils/appFormsFileds';
import Form from '../components/form';


function NewSales() {

    const submitForm = (state) => {
        console.log(state);
    }
    return (
        <Box>
            <Card style={{marginTop:20,padding:20}}>
                <Typography variant='h4' style={{textAlign:'center'}} >New Sales Memo</Typography>
                <Form onSubmit={submitForm} submitButton="Add New Sales Memo" fields={newSalesFormFields}/>

            </Card>
        </Box>
    )
}
export default NewSales;