import React from 'react';
import { Card , CardHeader, Divider, Snackbar } from '@material-ui/core';
import Form from '../components/form';
import { addDamageFormFields } from '../utils/appFormsFileds';
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';

class AddDamage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            damage : {},
            openSnackbar : false,
        }
    }

    onDamageAddSucces = (result) => {
        this.setState({
            damage : JSON.parse(result),
            openSnackbar : true,
        });

    }
    handleSnackbar = () => {
        this.setState({
            openSnackbar : false
        })
    }

    submitDamageForm = (state) => {
     
       let damage = {
           productId : state.ProductName.productId,
           customerId : state.CustomerName.customerId,
           employeeId : state.EmployeeName.employeeId,
           supplierId : state.SupplierName.supplierId,
           productQuantity : parseInt(state.ProductQuantity),
           damageProductAmount : parseFloat(state.DamageProductAmount) ,
           damageRetDate : new Date().getTime().toString(),
           damageSentToCompanyStatus : 'added'
       };
    
       submitForm("Damages","POST",damage,this.onDamageAddSucces);

    }

    render(){
        return (
            <Card style={{margin:40}}>
                <CardHeader
                    title="Add New Damage"
                />
                <Divider />
                <Form onSubmit={this.submitDamageForm} submitButton="Add Damage" fields={addDamageFormFields}/>
            
                <Snackbar 
                    open={this.state.openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={this.handleSnackbar}
                >
                    <Alert onClose={this.handleSnackbar} variant="filled" severity="success">
                        Succesfully new Damage of "{this.state.damage.productId}" added !
                    </Alert>
                </Snackbar>
            </Card>
        )
    }
}

export default AddDamage;