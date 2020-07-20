import React, { useState, useEffect } from "react";
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import ManageTable from "../components/manageTable";
import apiUrl from "../utils/apiInfo";
import NewSales from "./newSales";
import TodaysReport from "../components/todaysReport";
import HistoryVisual from "../components/historyWithVisualization";
import DetailsTable from "../components/collapseTable";

function Sales () {

    const [reportTabs,setReportTabs] = useState(0);
    const [data,setData] = useState([]);
    const [unchangeData,setUnchangeData] = useState([]);

    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    
    useEffect(() => {
        let filterValue = [];
        switch (reportTabs) {
            case 0:
                filterValue = unchangeData;
                break;
            case 1 :
                filterValue = unchangeData.filter(sales => 
                    new Date(parseInt(sales.salesDate)).getDate() === new Date().getDate() && 
                    new Date(parseInt(sales.salesDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(sales.salesDate)).getFullYear() === new Date().getFullYear() 

                );
                break;
            case 2 :
                filterValue = unchangeData.filter(sales => 
                    new Date(parseInt(sales.salesDate)).getDate() === new Date().getDate() -1 && 
                    new Date(parseInt(sales.salesDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(sales.salesDate)).getFullYear() === new Date().getFullYear() 
                );
                break;

            case 3:
                filterValue = unchangeData.filter(sales => 
                    new Date(parseInt(sales.salesDate)).getDate() >= new Date().getDate()-2 &&
                    new Date(parseInt(sales.salesDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(sales.salesDate)).getFullYear() === new Date().getFullYear() 
                );
                break;
            case 3:
                filterValue = unchangeData.filter(sales => 
                    new Date(parseInt(sales.salesDate)).getDate() >= new Date().getDate()-2 &&
                    new Date(parseInt(sales.salesDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(sales.salesDate)).getFullYear() === new Date().getFullYear() 
                );
                break;
            case 4:
                filterValue = unchangeData.filter(sales => 
                    new Date(parseInt(sales.salesDate)).getDate() >= new Date().getDate()-6 &&
                    new Date(parseInt(sales.salesDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(sales.salesDate)).getFullYear() === new Date().getFullYear() 
                );
                break;
                
            case 5:
                filterValue = unchangeData.filter(sales => 
                    new Date(parseInt(sales.salesDate)).getDate() >= new Date().getDate()-29 &&
                    new Date(parseInt(sales.salesDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(sales.salesDate)).getFullYear() === new Date().getFullYear() 
                );
                break;
            default:
                break;
        }
        var dateFormatData = JSON.parse(JSON.stringify(filterValue)) ; 
        dateFormatData.map(sales => sales.salesDate = new Date(parseInt(sales.salesDate)).toDateString());
        dateFormatData.map(sales => sales.salesDuePaymentDate = new Date(parseInt(sales.salesDuePaymentDate)).toDateString());
        setData(dateFormatData);
        console.log(dateFormatData);
    },[reportTabs])

    useEffect(() => {
        setHeaderSubtitile(location[2]);
        if(location.length <= 2){
            setHeaderSubtitile(location[1]);

        }
    }, [location]);

    const [columns,] = useState([
                        { title: 'Sales ID', field: 'salesId', },
                        { title: 'Customer Name', field: 'customerName', },
                        { title: 'Product Name', field: 'productName' },
                        { title: 'Product Quantity', field: 'productQuantity' },
                        { title: 'Sales Price', field: 'salesPrice' ,type : 'numeric'},
                        { title: 'Sales Date', field: 'salesDate' },
                        { title: 'Sales Payment Amount', field: 'salesPaymentAmount' },
                        { title: 'Sales Paid Status', field: 'salesPaidStatus' },
                        { title: 'Sales Due Payment Date', field: 'salesDuePaymentDate' },
                    ]);
    
    const FetchData = async () => {

        try {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
    
          var requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: 'follow'
          };
          const res = await fetch(apiUrl+"Sales/sales-product-customer", requestOptions);
          const json = await res.json();
          setUnchangeData(json);
          var dateFormatData = JSON.parse(JSON.stringify(json)) ; 
          dateFormatData.map(sales => sales.salesDate = new Date(parseInt(sales.salesDate)).toDateString());
          dateFormatData.map(sales => sales.salesDuePaymentDate = new Date(parseInt(sales.salesDuePaymentDate)).toDateString());
          setData(dateFormatData);
        } catch (error) {
          console.log("error - ", error);
        }
    };
    
    let routeHeader = {
        title : "Sales",
        subTitle : headersubtitle,
        icon : "storefront",
        breadCrumbs : [
            {
                title : "Sales",
                icon : "storefront"
            },
            {
                title : "All Sales",
                icon : "category"
            }
        ]
    }
    
    useEffect(() => {
        FetchData();
    },[]);

    let tabs = [
        {
            tab : "All",
            tabPanel : <TodaysReport />
        },
        {
            tab : "Todays Report",
            tabPanel : <TodaysReport />
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
            tabPanel :  <div style={{width:550,marginLeft:"25%"}}>
                fddffd
            </div>
        }
    ];


    const detailsPane = rowData => {
        let  overViewItems  = [{
            name : "Total Products",
            count : 56,
            icon : "storefront"
        }
        ,{
          name : "Total Purchase Price",
          count : 23,
          icon : "shop_two"
        },
        {
            name : "Total Sales Price",
            count : 45,
            icon : "shopping_basket"
        },
        {
            name : "Total Profit",
            count : "1200.00 tk",
            icon : "money"
        }];
        return overViewItems;
    }
        return(
            <div>
                <RouteHeader subTitle={headersubtitle} details={routeHeader} />
                <HistoryVisual handleTabs={setReportTabs} tabs={tabs}/>
                <Switch>
                    <Route exact path="/sales">
                        <div style={{margin:20}}>
                            <DetailsTable 
                                detailsPane={detailsPane}
                                columns={columns} 
                                data={data} />
                        </div>
                    </Route>
                    <Route exact path="/sales/new-sales">
                        <NewSales />
                    </Route>
                    <Route exact path="/sales/manage-sales">
                        <div style={{margin:20}}>
                            <ManageTable 
                                title="Manage Sales" 
                                hasUnique={false}
                                uniqueKey="salesId" 
                                uniqueName="salesName" 
                                apiUrl="Sales/" 
                                ondataChange={() => console.log()} 
                                data={{ columns : columns , data : data}}
                                
                            />
                        </div>
                    </Route>
                </Switch>
            </div>                        
        )
    
}

export default Sales;