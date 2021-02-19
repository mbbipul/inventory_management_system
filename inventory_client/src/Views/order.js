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
import {hip, Grid, Paper, Chip, Button } from "@material-ui/core";
import MaterialUIPickers from "../components/datePicker";
import HistoryVisual from "../components/historyWithVisualization";
import MaterialTable from "material-table";
import DeleteALert from '../components/deleteALert';
import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined';
import { green } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import Alert from "@material-ui/lab/Alert";
import ManageOrder from "./manage-order";


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

    function CustomPaidStatus (props) {
        return (
            <div>
                {
                    props.status ? 
                        <DoneOutlineOutlinedIcon style={{ color: green[500] }}/> :
                        <CloseIcon color='error' />
                }
            </div>
        )
    }

    const level1NestedSum = (obj,targetKey) => {
        let total = 0;
        obj.data.map((d,i) => {
            total += d.data.reduce(function(tot, arr) { 
                        return tot + arr[targetKey];
                    },0)
        });
        return total;
    }
    const columns = [
        { 
            title: 'Order Serial ', 
            field: 'orderSalesId' ,
            render: rowData => rowData.tableData.id + 1
        },
        // { title: 'DSR Name', field: 'employeeName' },
        { 
            title: 'Order Date', 
            field: 'orderDate',
            render : rowData => new Date(rowData.date).toDateString()
        },
        { 
            title: 'Total Sales Price', 
            field: 'totalSalesPrice' ,
            type : 'numeric',
            render : rowData => level1NestedSum(rowData,"orderTotalPrice")

        },
        { 
            title: 'Total Payment Amount', field: 'totalOrderPaymentAmount' ,type : 'numeric',
            render : rowData => level1NestedSum(rowData,"orderPaymentAmount")
        },
        { 
            title: 'Due Payment Amount', 
            field: 'orderPaidStatus' ,
            render : rowData => level1NestedSum(rowData,"orderTotalPrice") - level1NestedSum(rowData,"orderPaymentAmount") === 0 ?   (<Alert severity='success'>
                                                                <Chip
                                                                    color="primary"
                                                                    label={"Paid"}
                                                                    clickable />
                                                            </Alert>)
                                                        :   (<Chip 
                                                                color='secondary'
                                                                label={level1NestedSum(rowData,"orderTotalPrice")-level1NestedSum(rowData,"orderPaymentAmount")}
                                                                clickable />)
        },
    
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
            {/* {
                showHisVis && 
                <HistoryVisual 
                    hasTabPanel={false}
                    handleTabs={setReportTabs} 
                    tabs={hisTabs}/>
            } */}

            <Switch>
            <Route exact path="/order">
                    <AddOrder />
                </Route>
                <Route exact path="/order/manage-order">
                    <div style={{margin:20}}>
                        <Button variant='contained' color="secondary" onClick={() => FetchOrders()}>Refresh</Button>
                        <MaterialTable
                            title="All Orders"
                            columns={columns}
                            data={data} 
                            // options={{
                            //     selection: true
                            // }}
                            // actions={[
                            //     {
                            //     tooltip: 'Remove All Selected Users',
                            //     icon: 'delete',
                            //     onClick: (evt, data) => alert('You want to delete ' + data.length + ' rows')
                            //     }
                            // ]}
                            // editable={{
                            //     onRowDelete: oldData =>
                            //     new Promise((resolve, reject) => {
                            //         setTimeout(() => {
                            //         const dataDelete = [...data];
                            //         const index = oldData.tableData.id;
                            //         dataDelete.splice(index, 1);
                            //         setData([...dataDelete]);
                                    
                            //         resolve()
                            //         }, 1000)
                            //     }),
                            // }}
                            detailPanel={rowData => {
                                return (
                                    <AddOrder orderDate={new Date(rowData.date).getTime()} />
                                )
                            }}
                        />
                    </div>
                </Route>
                <Route exact path="/order/add-order">
                    <AddOrder />
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