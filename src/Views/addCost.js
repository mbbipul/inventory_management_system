import React from 'react';
import { Card , CardHeader, Divider, Snackbar} from '@material-ui/core';
import Form from '../components/form';
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';
import {  addCostFormFields } from '../utils/appFormsFileds';

class AddCost extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            cost : {},
            openSnackbar : false,
        }
    }

    onCostAddSucces = (result) => {
        this.setState({
            cost : JSON.parse(result),
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
            "costType" : state.CostType,
            "date" : Date.now().toString(),
            "costAmount" : parseFloat(state.CostAmount),
            "costDescription" : state.CostDescription,

        }
        submitForm("Costs","POST",product,this.onCostAddSucces);
    }
    render(){
        return (
            <Card style={{margin:40}}>
                <CardHeader
                    title="Add Cost"
                />
                <Divider />
                <Form onSubmit={this.submitForm} submitButton="Add Cost" fields={addCostFormFields}/>
                
                <Snackbar 
                    open={this.state.openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={this.handleSnackbar}
                >
                    <Alert onClose={this.handleSnackbar} variant="filled" severity="success">
                        Succesfully new Cost "{this.state.cost.costId}" added !
                    </Alert>
                </Snackbar>
            </Card>
        )
    }
}

export default AddCost;