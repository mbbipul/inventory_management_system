import React from 'react';
import { Box, Button, Card , CardHeader, Divider, Paper, Snackbar} from '@material-ui/core';
import Form from '../components/form';
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';
import {   addOrderFormFields } from '../utils/appFormsFileds';
import OrderSales from './orderSales';

class AddOrder extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            order : {},
            snackText : '',
            snackSeverity : 'success',
            openSnackbar : false,
            toggleForm : 0,
        }
    }

    onOrderAddSuccess = (result) => {
        let orderTmp = JSON.parse(result);
        console.log(orderTmp);
        this.setState({
            order : orderTmp,
            snackSeverity : 'success',
            snackText : "Successfully new Order " + orderTmp.orderId+" Added !", 
            openSnackbar : true,
        });

    }

    handleSnackbar = () => {
        this.setState({
            openSnackbar : false
        });
    }

    completeOrder = ( ) => {
        this.setState({
            toggleForm : 2
        });
    }
    submitForms = (state) => {
        this.setState({toggleForm : 1})
        let order = {
            customerId : state.CustomerName.customerId,
            productId : state.ProductName.productId,
            orderDate : new Date().getTime().toString(),
            orderStaus : 'orderPlace',
            orderProductQuantity : parseInt(state.ReceiveOrderProductQuantity)
        }
        submitForm("Orders","POST",order,this.onOrderAddSuccess);
    }

    onOrderSalesSuccess = (result) => {
        let orderObj = {
            "orderId": this.state.order.orderId,
            "customerId": result.customerId,
            "productId": result.productId,
            "salesId": result.salesId,
            "orderDate": this.state.order.orderDate,
            "orderStaus": "orderComplete",
            "orderProductQuantity": this.state.order.orderProductQuantity,
            "miscellaneousCost": result.miscellaneousCost,
        }
        submitForm('Orders/'+orderObj.orderId,'PUT',orderObj,(res) => {
            this.setState({
                snackSeverity : 'success',
                snackText : "Successfully  Order " + orderObj.orderId+" Updated !", 
                openSnackbar : true,
                toggleForm : 3
            });
            console.log(JSON.parse(result));
        })
        
    }

    orderSalesSuccess = () => {
        this.setState({
            toggleForm : 0
        });
    }
    renderToggleform = () => {
        switch (this.state.toggleForm) {
            case 0:
                return <Form onSubmit={this.submitForms} submitButton="Add Order" fields={addOrderFormFields}/>;
                break;
            case 1 :
                return <Paper style={{padding:100}}>
                            <Box style={{padding:50,backgroundColor :'#66bb6a',color: '#fff',textAlign: 'center'}}>
                                <h1>Succesfully New Order Place</h1>
                                <Button 
                                    variant='filled' 
                                    style={{backgroundColor : '#000',color: '#fff',marginRight:10}}
                                    onClick={this.completeOrder}
                                >
                                    Complete Order Now
                                </Button>
                                Or
                                <Button 
                                    variant='filled' 
                                    style={{backgroundColor : '#000',color: '#fff',marginLeft:10}}
                                >
                                    Complete Order Later
                                </Button>
                            </Box>
                        </Paper>
                break;
            case 2 :
                return <OrderSales order={this.state.order} onSubmitSuccess={this.onOrderSalesSuccess}/>
                break;
            case 3 :
                return <Paper style={{padding:100}}>
                            <Box style={{padding:50,backgroundColor :'#66bb6a',color: '#fff',textAlign: 'center'}}>
                                <h1>Succesfully Order Complete with Sales</h1>
                                <Button 
                                    variant='filled' 
                                    style={{backgroundColor : '#000',color: '#fff',marginRight:10}}
                                    onClick={this.orderSalesSuccess}
                                >
                                    ReOrder Now
                                </Button>
                            
                            </Box>
                        </Paper>
                break;
            default:
                break;
        }
    }
    render(){
        return (
            <Card style={{margin:40}}>
                <CardHeader
                    title="Add New Order"
                />
                <Divider />
                {
                    this.renderToggleform()
                }
                <Snackbar 
                    open={this.state.openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={this.handleSnackbar}
                >
                    <Alert onClose={this.handleSnackbar} variant="filled" severity={this.state.snackSeverity}>
                        {this.state.snackText}
                    </Alert>
                </Snackbar>
            </Card>
        )
    }
}

export default AddOrder;