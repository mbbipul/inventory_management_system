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
            toggleForm : 2,
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
            toggleForm : 1,
        });

    }

    handleSnackbar = () => {
        this.setState({
            openSnackbar : false
        });
    }

    completeOrder = ( ) => {
        let order = this.state.order;
        order.orderStaus = 'orderComplete';
        submitForm('Orders/'+order.orderId,'PUT',order,(res) => {
            this.setState({
                snackSeverity : 'success',
                snackText : "Successfully  Order " + order.orderId+" completed !", 
                openSnackbar : true,
                toggleForm : 2
            });
            console.log(JSON.parse(res));
        });
    }

    completeOrderLater = ( ) => {
        this.setState({
            toggleForm : 1
        });
    }


    onOrderSalesSuccess = (result) => {
        let orderObj = {
            customerId: result.customerId,
            productId: result.productId,
            salesId: result.salesId,
            orderDate: new Date().getTime().toString(),
            orderStaus : 'orderPlace',
            orderProductQuantity: result.productQuantity,
            miscellaneousCost: result.miscellaneousCost,
        }
        submitForm('Orders','POST',orderObj,this.onOrderAddSuccess)
        
    }

    orderSalesSuccess = () => {
        this.setState({
            toggleForm : 0
        });
    }
    renderToggleform = () => {
        switch (this.state.toggleForm) {

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
                                    onClick={this.completeOrderLater}
                                >
                                    Complete Order Later
                                </Button>
                            </Box>
                        </Paper>
                break;
            case 2 :
                return <OrderSales order={this.state.order} onSubmitSuccess={this.onOrderSalesSuccess}/>
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