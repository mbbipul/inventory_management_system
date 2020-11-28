import React ,{ useState, useEffect} from "react";
import {
  Switch,
  Route,
  useLocation
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import ManageTable from "../components/manageTable";
import submitForm from "../utils/fetchApi";
import AddOrder from "./addOrder";
import { Button, ButtonGroup, Chip, Grid, Paper } from "@material-ui/core";
import MaterialUIPickers from "../components/datePicker";
import HistoryVisual from "../components/historyWithVisualization";
import MaterialTable from "material-table";
import CustomizedDialogs from "../components/formDialog";
import OrderSales from "./orderSales";
import DeleteALert from '../components/deleteALert';

function Order() {
    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    const [data,setData] = useState([]);
    const [reportTabs,setReportTabs] = useState(0);
    const [fromDate,setFromDate] = useState("");
    const [toDate,setToDate] = useState("");
    const [order,setOrder] = useState({});
    const [openDeleteAlert,setOpenDeleteAlert] = useState(false);
    const [showHisVis,setHisVis] = useState(true);


    const completeOrder = (rowData) => {
        setOrder(rowData);
        setOpenDeleteAlert(true);
    }

    const handleDeleteALertDisAgree = () => {
        setOpenDeleteAlert(false);
        setOrder(null);
    }

    const handleDeleteALertAgree = () => {
        if (order === null) {
            alert('Something Went wrong');
            return ;
        }
        order.orderStaus = 'orderComplete';
        submitForm('Orders/'+order.orderId,'PUT',order,(res) => {
            this.setState({
                snackSeverity : 'success',
                snackText : "Successfully  Order " + order.orderId+" Updated !", 
                openSnackbar : true,
                toggleForm : 3
            });
            console.log(JSON.parse(res));
        });
        setOpenDeleteAlert(false);
        setOrder(null);
    }

    const columns = [
        { title: 'Order ID', field: 'orderId' },
        { title: 'Order Customer Name', field: 'customerName' },
        { title: 'Product Name', field: 'productName' },
        { title: 'Order Product Quantity', field: 'orderProductQuantity' },
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
                                    <Chip 
                                        color="secondary"
                                        label={'Complete Order Now'}
                                        clickable
                                        onClick={() => completeOrder(rowData)}
                                    />

                                    
        }
    ];


    const FetchOrders = () => {
        submitForm('Orders','GET','',(res) => {
            setData(JSON.parse(res));
        });
        
    }
    const FetchDataByDate = (date) => {
        
        submitForm("Orders/by-date/"+date,"GET","",(res) => {
            submitForm('Orders/place-order-by-date/'+date,'GET','',(res2) => {
                let resArr1 = JSON.parse(res);
                let resArray2 = JSON.parse(res2);
                let result = resArr1.concat(resArray2);
                console.log(result);
                setData(result);
            });
        });
    }
    const FetchOrdersByDateRange = (fromDate,toDate) => {
        submitForm("Orders/by-date-range/"+fromDate+"-"+toDate,"GET","",(res) => {
            submitForm('Orders/place-order-by-date-range'+fromDate+"-"+toDate,'GET','',(res2) => {
                let resArr1 = JSON.parse(res);
                let resArray2 = JSON.parse(res2);
                let result = resArr1.concat(resArray2);
                console.log(result);
                setData(result);
            });
        });
    }
    const FetchDataByDays = (days) => {
        submitForm("Orders/by-days/"+days,"GET","",(res) => {
            submitForm('Orders/place-orders-by-days/'+days,'GET','',(res2) => {
                let resArr1 = JSON.parse(res);
                let resArray2 = JSON.parse(res2);
                let result = resArr1.concat(resArray2);
                console.log(result);
                setData(result);
            });
        });
    }

    useEffect(() => {
        setHeaderSubtitile(location[2]);
        if(location.length <= 2){
            setHeaderSubtitile(location[1]);
        }
    }, [location]);

    useEffect(() => {
        if(headersubtitle==='manage-order'){
            setHisVis(false);
        }else if(headersubtitle==='add-order'){
            setHisVis(false);
        }
        else{
            FetchOrders();
            setHisVis(true);
        }
    },[headersubtitle]);


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
                FetchOrdersByDateRange(fromDate,toDate);
            }    
        }
    },[fromDate]);

    useEffect(() => {
        if( reportTabs === 6){
            if(fromDate > toDate){
                alert("Starting date cannot larger than Last Date");
            }else{
                FetchOrdersByDateRange(fromDate,toDate);
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
            {
                showHisVis && 
                <HistoryVisual 
                    hasTabPanel={false}
                    handleTabs={setReportTabs} 
                    tabs={hisTabs}/>
            }

            <Switch>
                <Route exact path="/order">
                    <div style={{margin:20}}>
                        <MaterialTable
                            title="All Orders"
                            columns={columns}
                            data={data} 
                            detailPanel={rowData => {
                                return (
                                    <div>
                                        {
                                            rowData.orderStaus === 'orderComplete' && 
                                            <Grid
                                                container
                                                direction="row"
                                                justify="center"
                                                alignItems="center"
                                                style={{padding : 50}}
                                                >
                                                <Grid item xs >
                                                    <Chip 
                                                    color="primary"
                                                    label={'Order Sales Product Quantity : '+rowData.productQuantity}
                                                    clickable /> 
                                                </Grid>
                                                <Grid item xs >
                                                    <Chip 
                                                    color="primary"
                                                    label={'Sales Rate : '+ (rowData.salesPrice/rowData.productQuantity).toFixed(2)+' tk'}
                                                    clickable /> 
                                                </Grid>
                                                <Grid item xs >
                                                    <Chip 
                                                    color="primary"
                                                    label={'Total Sales Amount : '+rowData.salesPrice+' tk'}
                                                    clickable /> 
                                                </Grid>
                                                <Grid item xs >
                                                    <Chip 
                                                    color="primary"
                                                    label={'Discount : '+rowData.salesDiscount+' tk'}
                                                    clickable /> 
                                                </Grid>
                                                <Grid item xs >
                                                    <Chip 
                                                    color="primary"
                                                    label={'Miscellaneous cost : '+rowData.miscellaneousCost+' tk'}
                                                    clickable />
                                                </Grid>
                                            </Grid>
                                        }
                                    </div>
                                   
                                )
                            }}
                            />
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
            
            <DeleteALert 
                message="Make sure that you ship all product to customer "
                title=" Are you sure to complete this order?" 
                open={openDeleteAlert}
                handleDisagree={handleDeleteALertDisAgree}
                handleAgree={handleDeleteALertAgree}
            />
        </div>                        
    )
}

export default Order;