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
import { Grid } from "@material-ui/core";
import MaterialUIPickers from "../components/datePicker";
import HistoryVisual from "../components/historyWithVisualization";

function Order() {
    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    const [data,setData] = useState([]);
    const [reportTabs,setReportTabs] = useState(0);
    const [fromDate,setFromDate] = useState("");
    const [toDate,setToDate] = useState("");

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

    ]

    const FetchOrders = () => {
        submitForm('Orders','GET','',(res) => setData(JSON.parse(res)));
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

    useEffect(() => {
        FetchOrders();
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
                        <ProductTable 
                            title="All Orders"
                            apiUrl="Orders/" 
                            data={{ columns : columns , data : data}}/>
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
                    </Route>x
            </Switch>
        </div>                        
    )
}

export default Order;