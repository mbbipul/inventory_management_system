import React ,{ useState, useEffect} from "react";
import {
  Switch,
  Route,
  useLocation
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import ProductTable from '../components/productTable';
import ManageTable from "../components/manageTable";
import submitForm from "../utils/fetchApi";
import AddOrder from "./addOrder";
import { Button, Chip, Grid } from "@material-ui/core";
import MaterialUIPickers from "../components/datePicker";
import HistoryVisual from "../components/historyWithVisualization";
import MaterialTable from "material-table";
import CustomizedDialogs from "../components/formDialog";
import OrderSales from "./orderSales";

function Order() {
    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    const [data,setData] = useState([]);
    const [reportTabs,setReportTabs] = useState(0);
    const [fromDate,setFromDate] = useState("");
    const [toDate,setToDate] = useState("");
    const [order,setOrder] = useState({});
    const [openOrderDialog,setOrderDialog] = useState(false);

    const completeOrder = (rowData) => {
        setOrder(rowData);
        setOrderDialog(true);
    }

    const onOrderSalesSuccess = (result) => {
        let orderObj = {
            "orderId": order.orderId,
            "customerId": result.customerId,
            "productId": result.productId,
            "salesId": result.salesId,
            "orderDate": order.orderDate,
            "orderStaus": "orderComplete",
            "orderProductQuantity": order.orderProductQuantity,
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

    const columns = [
        { title: 'Order ID', field: 'orderId' },
        { title: 'Order Customer Name', field: 'customerName' },
        { title: 'Product Name', field: 'productName' },
        { title: 'Recieve Product Quantity', field: 'orderProductQuantity' },
        { 
            title: 'Order Date', 
            field: 'orderDate' ,
            render: rowData =>  new Date(parseInt(rowData.orderDate)).toDateString()
        },
        {
            title : 'Order Status',
            field : 'orderStaus',
            render : rowData =>  rowData.orderStaus === 'orderComplete' ?
                                    <Chip 
                                        color="primary"
                                        label={'Order Completed'}
                                        clickable /> :

                                    <Button 
                                        variant='filled' 
                                        style={{backgroundColor : '#000',color: '#fff',marginRight:10}}
                                        onClick={() => completeOrder(rowData)}
                                    >
                                        Complete Order Now
                                    </Button>
                                    
        }
    ];

    const FetchOrders = () => {
        submitForm('Orders/all-orders','GET','',(res) => setData(JSON.parse(res)));
    }
    const FetchDataByDate = (date) => {
        submitForm("Orders/by-date/"+date,"GET","",(res) => setData(JSON.parse(res)));
    }
    const FetchDataByDays = (days) => {
        submitForm("Orders/by-days/"+days,"GET","",(res) => setData(JSON.parse(res)));
    }

    useEffect(() => {
        setHeaderSubtitile(location[2]);
        if(location.length <= 2){
            setHeaderSubtitile(location[1]);
        }
    }, [location]);

    useEffect(() => {
        FetchOrders();
    },[]);


    let routeHeader = {
        title : "Order",
        subTitle : headersubtitle,
        icon : "local_grocery_store",
        breadCrumbs : [
            {
                title : "Order",
                icon : "local_grocery_store"
            },
            {
                title : "All Orders",
                icon : "category"
            }
        ]
    }

    useEffect(() => {
        switch (reportTabs) {
            case 0:
                FetchOrders();
                break;
            case 1 :
                FetchDataByDate(Date.now());
                break;
            case 2 :
                FetchDataByDate(Date.now()-86400000 );
                break;
            case 3 :
                FetchDataByDays(3);
                break;
            case 4 :
                FetchDataByDays(7);
                break;
            case 5:
                FetchDataByDays(30);
                break;
            case 6:
                if(fromDate > toDate){
                    alert("Starting date cannot larger than Last Date");
                }

                break;
            default:
                break;
        }
    },[reportTabs]);

    useEffect(() => {
        if (reportTabs === 6){
            if(fromDate > toDate){
                alert("Starting date cannot larger than Last Date");
            }else{
                submitForm("Orders/by-date-range/"+fromDate+"-"+toDate,"GET","",(res) => setData(JSON.parse(res)));
            }    
        }
    },[fromDate]);

    useEffect(() => {
        if( reportTabs === 6){
            if(fromDate > toDate){
                alert("Starting date cannot larger than Last Date");
            }else{
                submitForm("Orders/by-date-range/"+fromDate+"-"+toDate,"GET","",(res) => setData(JSON.parse(res)));
            }    
        }
    },[toDate]);

    let hisTabs = [
        {
            tab : "All",
            tabPanel : ""
        },
        {
            tab : "Todays Report",
            tabPanel : ""
        },
        {
            tab : "Yesterdays Report",
            tabPanel :  <div style={{width:550,marginLeft:"25%"}}>
                fddffd
            </div>
        },
        {
            tab : "Last 3 Days",
            tabPanel :  <div style={{width:550,marginLeft:"25%"}}>
                fddffd
            </div>
        },
        {
            tab : "This week",
            tabPanel : "gffg" 
        },
        {
            tab : "This Month",
            tabPanel :  <div style={{width:550,marginLeft:"25%"}}>
                fddffd
            </div>
        },
        {
            tab : "Jump To",    
            tabPanel :  <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center">

                            <Grid item xs >
                                <strong>From</strong>
                                <MaterialUIPickers onChange={(date) => setFromDate(date)} />
                            </Grid>
                            <Grid style={{marginLeft:100}} item xs >
                                <strong>To</strong>
                                <MaterialUIPickers onChange={(date) => setToDate(date)} />
                            </Grid>
                        </Grid>
        },

    ];
    
    return(
        <div>
            <RouteHeader subTitle={headersubtitle} details={routeHeader} />
            
            <HistoryVisual 
                hasTabPanel={false}
                handleTabs={setReportTabs} 
                tabs={hisTabs}/>

            <Switch>
                <Route exact path="/order">
                    <div style={{margin:20}}>
                        <MaterialTable
                            title="All Orders"
                            columns={columns}
                            data={data} />
                    </div>
                </Route>
                <Route exact path="/order/add-order">
                    <AddOrder />
                </Route>
                <Route exact path="/order/manage-order">
                        <div style={{margin:20}}>
                            <ManageTable 
                                title="Manage Order" 
                                hasUnique={false}
                                apiInfo="Order"
                                uniqueKey="orderId" 
                                uniqueName="customerName" 
                                apiUrl="Orders/" 
                                editable={false}
                                onChangeData={FetchOrders} 
                                data={data}
                                columns={columns}
                                
                            />
                        </div>
                    </Route>
            </Switch>

            <CustomizedDialogs 
                title="Complete Order"
                dialogContent={
                    <OrderSales order={order} onSubmitSuccess={onOrderSalesSuccess}/>
                }
                
                changOpenProps={()=> setOrderDialog(false)}
                open={openOrderDialog} 
            />
        </div>                        
    )
}

export default Order;