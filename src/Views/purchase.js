import React, { useState, useEffect } from "react";
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import ProductTable from '../components/productTable';
import ManageTable from "../components/manageTable";
import apiUrl from "../utils/apiInfo";
import AddPurchase from "./addPurchase";
import DetailsTable from "../components/collapseTable";
import HistoryVisual from "../components/historyWithVisualization";
import TodaysReport from "../components/todaysReport";

function Purchase () {
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
                filterValue = unchangeData.filter(purchase => 
                    new Date(parseInt(purchase.purchaseDate)).getDate() === new Date().getDate() && 
                    new Date(parseInt(purchase.purchaseDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(purchase.purchaseDate)).getFullYear() === new Date().getFullYear() 

                );
                break;
            case 2 :
                filterValue = unchangeData.filter(purchase => 
                    new Date(parseInt(purchase.purchaseDate)).getDate() === new Date().getDate() -1 && 
                    new Date(parseInt(purchase.purchaseDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(purchase.purchaseDate)).getFullYear() === new Date().getFullYear() 
                );
                break;

            case 3:
                filterValue = unchangeData.filter(purchase => 
                    new Date(parseInt(purchase.purchaseDate)).getDate() >= new Date().getDate()-2 &&
                    new Date(parseInt(purchase.purchaseDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(purchase.purchaseDate)).getFullYear() === new Date().getFullYear() 
                );
                break;
            case 3:
                filterValue = unchangeData.filter(purchase => 
                    new Date(parseInt(purchase.purchaseDate)).getDate() >= new Date().getDate()-2 &&
                    new Date(parseInt(purchase.purchaseDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(purchase.purchaseDate)).getFullYear() === new Date().getFullYear() 
                );
                break;
            case 4:
                filterValue = unchangeData.filter(purchase => 
                    new Date(parseInt(purchase.purchaseDate)).getDate() >= new Date().getDate()-6 &&
                    new Date(parseInt(purchase.purchaseDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(purchase.purchaseDate)).getFullYear() === new Date().getFullYear() 
                );
                break;
                
            case 5:
                filterValue = unchangeData.filter(purchase => 
                    new Date(parseInt(purchase.purchaseDate)).getDate() >= new Date().getDate()-29 &&
                    new Date(parseInt(purchase.purchaseDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(purchase.purchaseDate)).getFullYear() === new Date().getFullYear() 
                );
                break;
            default:
                break;
            
        }
        // console.log(filterValue);
        var dateFormatData = JSON.parse(JSON.stringify(filterValue)) ; 
        dateFormatData.map(purchase => purchase.purchaseDate = new Date(parseInt(purchase.purchaseDate)).toDateString());
        dateFormatData.map(purchase => purchase.purchaseDuePaymentDate = new Date(parseInt(purchase.purchaseDuePaymentDate)).toDateString());
        setData(dateFormatData);
       
    },[reportTabs])

    useEffect(() => {
        setHeaderSubtitile(location[2]);
        if(location.length <= 2){
            setHeaderSubtitile(location[1]);

        }
    }, [location]);

    const [columns,] = useState([
                                        { title: 'Purchase ID', field: 'purchaseId' },
                                        { title: 'Product Name', field: 'productId' },
                                        { title: 'Product Quantity', field: 'productQuantity' },
                                        { title: 'Purchase Price', field: 'purchasePrice' },
                                        { title: 'Purchase Date', field: 'purchaseDate' },
                                        { title: 'Sales Price', field: 'salesPrice' },
                                        { title: 'Purchase Payment Amount', field: 'purchasePaymentAmount' },
                                        { title: 'Purchase Paid Status', field: 'purchasePaidStatus' },
                                        { title: 'Purchase Due Payment Date', field: 'purchaseDuePaymentDate' },

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
          const res = await fetch(apiUrl+"Purchases", requestOptions);
          const json = await res.json();
          setUnchangeData(json);
          var dateFormatData = JSON.parse(JSON.stringify(json)) ; 
          dateFormatData.map(purchase => purchase.purchaseDate = new Date(parseInt(purchase.purchaseDate)).toDateString());
          dateFormatData.map(purchase => purchase.purchaseDuePaymentDate = new Date(parseInt(purchase.purchaseDuePaymentDate)).toDateString());
          setData(dateFormatData);
        } catch (error) {
          console.log("error - ", error);
        }
    };
    
    let routeHeader = {
        title : "Company",
        subTitle : headersubtitle,
        icon : "storefront",
        breadCrumbs : [
            {
                title : "Company",
                icon : "storefront"
            },
            {
                title : "All Company",
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
                    <Route exact path="/purchase">
                        <div style={{margin:20}}>
                            <DetailsTable 
                                detailsPane={detailsPane}
                                title="Purchase"
                                columns={columns} 
                                data={data} />
                        </div>
                    </Route>
                    <Route exact path="/purchase/add-purchase">
                        <AddPurchase />
                    </Route>
                    <Route exact path="/purchase/manage-purchase">
                        <div style={{margin:20}}>
                            <ManageTable 
                                title="Manage Company" 
                                hasUnique={true}
                                uniqueKey="companyId" 
                                uniqueName="companyName" 
                                apiUrl="Purchases/" 
                                ondataChange={() => console.log()} 
                                data={{ columns : columns , data : data}}
                                
                            />
                        </div>
                    </Route>
                </Switch>
            </div>                        
        )
    
}

export default Purchase;