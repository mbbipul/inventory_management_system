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

    
    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    
    useEffect(() => {
        console.log(reportTabs);
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
    const [data,setData] = useState([]);
    
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
          setData(json);

          // console.log("json - ", json);
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

        return(
            <div>
                <RouteHeader subTitle={headersubtitle} details={routeHeader} />
                <HistoryVisual handleTabs={setReportTabs} tabs={tabs}/>
                <Switch>
                    <Route exact path="/purchase">
                        <div style={{margin:20}}>
                            <DetailsTable columns={columns} data={data} />
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