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
import AddCustomer from "./addCustomer";
import { Chip, Grid } from "@material-ui/core";
import MaterialTable from "material-table";
import MaterialUIPickers from "../components/datePicker";
import HistoryVisual from "../components/historyWithVisualization";

function Customer() {
    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    const [columns,] = useState([
        { title: 'Customer Name', field: 'customerName' },
        { title: 'Address', field: 'customerAddress' },
        { title: 'Contact Number', field: 'customerContact' },
        { title: 'Customer Email', field: 'customerEmail' },
        { title: 'Customer NID', field: 'customerNID' },
        { 
            title: 'Join Date', 
            field: 'customerJoinDate',
            render : rowData => new Date(parseInt(rowData.customerJoinDate)).toDateString()

        }

    ]);

    const creditCustomerColumns = [
        { title: 'Customer Name', field: 'customerName' },
        { title: 'Address', field: 'customerAddress' },
        { title: 'Contact Number', field: 'customerContact' },
        { 
            title : 'Total Sales Amount' ,
            field : 'salesPrice' ,
            render : rowData => <Chip 
                                    color="primary"
                                    label={rowData.salesPrice}
                                    clickable /> 
        },
        { 
            title: 'Total Due Amount', 
            field: 'customerDueAmount' ,
            render : rowData => <Chip 
                                    color="primary"
                                    label={rowData.customerDueAmount}
                                    clickable /> 
        },

    ]
    const [data,setData] = useState([]);
    const [creditCustomer,setCreditCustomer] = useState([]);
    const [paidCustomer,setPaidCustomer] = useState([]);
    const [showHistoryVisual,setShowHisVisual] = useState(false);
    const [reportTabs,setReportTabs] = useState(0);

    const [fromDate,setFromDate] = useState("");
    const [toDate,setToDate] = useState("");

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
    useEffect(() => {
        setHeaderSubtitile(location[2]);
        if(location.length <= 2){
            setHeaderSubtitile(location[1]);

        }
    }, [location]);

    useEffect(() => {
        if(headersubtitle === "credit-customer" ){
            setShowHisVisual(true);
            fetchCustomerCrePaid();
        }else{
            setShowHisVisual(false);
        }
    },[headersubtitle]);

    let routeHeader = {
        title : "Customer",
        subTitle : headersubtitle,
        icon : "supervisor_account",
        breadCrumbs : [
            {
                title : "Customer",
                icon : "supervisor_account"
            },
            {
                title : "All Customers",
                icon : "category"
            }
        ]
    }

    const FetchData = () => {
        submitForm("Customers","GET","",(result) => setData(JSON.parse(result)));
    }

    const FetchCreditCustomer = (path) => {
        submitForm(path,"GET","",(result) => setCreditCustomer(JSON.parse(result)));
    }
    const FetchPaidCustomer = (path) => {
        submitForm(path,"GET","",(result) => setPaidCustomer(JSON.parse(result)));
    }

    const fetchCustomerCrePaid = () => {
        FetchCreditCustomer("Customers/credit-customer");
        FetchPaidCustomer("Customers/paid-customer");
    }
    const FetchDataByDate = (date) => {
        FetchCreditCustomer("Customers/credit-customer/by-date/"+date);
    }
    
    const FetchDataByDays = (days) => {
        FetchCreditCustomer("Customers/credit-customer/by-days/"+days);
    }

    const FetchDataByDateRange = () => {
        FetchCreditCustomer("Customers/credit-customer/by-date-range/"+fromDate+"-"+toDate);
    }

    useEffect(() => {
        FetchData();
    },[]);

    useEffect(() => {
        FetchData();
    },[headersubtitle]);
    
    useEffect(() => {
        if (reportTabs === 6){
            if(fromDate > toDate){
                alert("Starting date cannot larger than Last Date");
            }else{
                FetchDataByDateRange();
            }    
        }
    },[fromDate]);

    useEffect(() => {
        if( reportTabs === 6){
            if(fromDate > toDate){
                alert("Starting date cannot larger than Last Date");
            }else{
                FetchDataByDateRange()
            }    
        }
    },[toDate]);

    useEffect(() => {
        switch (reportTabs) {
            case 0:
                fetchCustomerCrePaid();
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


    return(
        <div>
            <RouteHeader subTitle={headersubtitle} details={routeHeader} />
            {
                    showHistoryVisual && 
                        <HistoryVisual hasTabPanel={false} handleTabs={setReportTabs} tabs={hisTabs}/>
            }
            <Switch>
                <Route exact path="/customer">
                    <div style={{margin:20}}>
                        <ProductTable 
                            title="All Customers"
                            apiUrl="Customers/" 
                            data={{ columns : columns , data : data}}/>
                    </div>
                </Route>
                <Route exact path="/customer/add-customer">
                    <AddCustomer />
                </Route>
                <Route exact path="/customer/manage-customer">
                        <div style={{margin:20}}>
                            <ManageTable 
                                title="Manage Customer" 
                                hasUnique={true}
                                apiInfo="Customer"
                                uniqueKey="customerId" 
                                uniqueName="customerName" 
                                apiUrl="Customers/" 
                                editable={true}
                                onChangeData={FetchData} 
                                data={data}
                                columns={columns}
                                
                            />
                        </div>
                </Route>

                <Route exact path="/customer/credit-customer">
                 <div style={{margin:20}}>
                    <MaterialTable
                        title="All Credit Customer"
                        columns={creditCustomerColumns}
                        data={creditCustomer}/>
                </div>
                </Route>

                <Route exact path="/customer/paid-customer">
                 <div style={{margin:20}}>
                        <MaterialTable 
                            title="All Paid Customers"
                            columns={creditCustomerColumns.slice(0,-1)}
                            data={paidCustomer}/>
                    </div>
                </Route>
            </Switch>
        </div>                        
    )
}

export default Customer;