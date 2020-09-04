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
import submitForm from "../utils/fetchApi";
import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined';
import { green } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';

function Sales () {

    const [reportTabs,setReportTabs] = useState(0);
    const [data,setData] = useState([]);
    const [unchangeData,setUnchangeData] = useState([]);

    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    
    const [salesReport,setSalesReport] = useState({});
    const [reportItems,setReportItems] = useState([]);
    const [reportOptions,setReportOptions] = useState({});

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
                FetchReportByDate(new Date().getTime());
                break;
            case 2 :
                filterValue = unchangeData.filter(sales => 
                    new Date(parseInt(sales.salesDate)).getDate() === new Date().getDate() -1 && 
                    new Date(parseInt(sales.salesDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(sales.salesDate)).getFullYear() === new Date().getFullYear() 
                );
                FetchReportByDate(new Date().getTime()-86400000);
                break;
            case 3:
                filterValue = unchangeData.filter(sales => 
                    new Date(parseInt(sales.salesDate)).getDate() >= new Date().getDate()-2 &&
                    new Date(parseInt(sales.salesDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(sales.salesDate)).getFullYear() === new Date().getFullYear() 
                );
                FetchReport(2);
                break;
            case 4:
                filterValue = unchangeData.filter(sales => 
                    new Date(parseInt(sales.salesDate)).getDate() >= new Date().getDate()-6 &&
                    new Date(parseInt(sales.salesDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(sales.salesDate)).getFullYear() === new Date().getFullYear() 
                );
                FetchReport(6);
                break;
                
            case 5:
                filterValue = unchangeData.filter(sales => 
                    new Date(parseInt(sales.salesDate)).getDate() >= new Date().getDate()-29 &&
                    new Date(parseInt(sales.salesDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(sales.salesDate)).getFullYear() === new Date().getFullYear() 
                );
                FetchReport(29);
                break;
            default:
                break;
        }
        var dateFormatData = JSON.parse(JSON.stringify(filterValue)) ; 
        dateFormatData.map(sales => sales.salesDate = new Date(parseInt(sales.salesDate)).toDateString());
        dateFormatData.map(sales => sales.salesDuePaymentDate = new Date(parseInt(sales.salesDuePaymentDate)).toDateString());
        
        dateFormatData.map((d) => {
            d.productDueStatus = <CustomPaidStatus status={d.productDueStatus===0 ? true : false}/>
            d.salesPaidStatus = <CustomPaidStatus status={d.salesPaidStatus}/>
            return d;
        });

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
                        // { title: 'Sales Payment Amount', field: 'salesPaymentAmount' },
                        { title: 'Sales Product Due Status', field: 'productDueStatus' },
                        { title: 'Sales Paid Status', field: 'salesPaidStatus' },
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
          
          dateFormatData.map((d) => {
            d.productDueStatus = <CustomPaidStatus status={d.productDueStatus===0 ? true : false}/>
            d.salesPaidStatus = <CustomPaidStatus status={d.salesPaidStatus}/>
            return d;
        });
          
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


    const FetchReport = (days) => {
        let valDays = [];
        for (let i = 1; i <= days;i++ ){
            valDays.push(new Date(new Date().getTime() - 86400000*i ).toLocaleDateString());
        }
        submitForm("Report/sales-report-all/"+new Date().getTime(),"GET","",(res) =>{
            let allRes = JSON.parse(data);
            let data = allRes.salesRate.filter(p => valDays.includes(p.date));
            let salesDueData = allRes.totalSalesProductDue.filter(p => valDays.includes(p.sales.salesDate));

            let totalSalesProduct ;
            let totalSalesPrice ;
            let totalSalesPaymentDue ;
            data.salesRate.map(d => {
                const unique = [...new Set(d.data.map(item => item.productId))]; // [ 'A', 'B']
                totalSalesProduct += unique.length;
                totalSalesPrice += d.salesPrice;

                if(!d.salesPaidStatus){
                    totalSalesPaymentDue += 1;               
                }
            });

            let report = {
                "totalProductSales": totalSalesProduct,
                "totalSalesPrice": totalSalesPrice,
                "totalSalesProductDue": salesDueData,
                "totalSalesPaymentDue": totalSalesPaymentDue,
                salesRate : data.salesRate
            }
            setSalesReport(report);
        });
    }

    const FetchReportByDate = (date) => {
        submitForm("Report/sales-report/"+date,"GET","",(res) => setSalesReport(JSON.parse(res)));
    }
    useEffect(() => {
        FetchData();
        FetchReportByDate("");
    },[]);

    let tabs = [
        {
            tab : "All",
            tabPanel : <TodaysReport items={reportItems} options={reportOptions}  />
        },
        {
            tab : "Todays Report",
            tabPanel : <TodaysReport items={reportItems} options={reportOptions}  />
        },
        {
            tab : "Yesterdays Report",
            tabPanel : <TodaysReport items={reportItems} options={reportOptions}  />
        },
        {
            tab : "Last 3 Days",
            tabPanel : <TodaysReport items={reportItems} options={reportOptions}  />
        },
        {
            tab : "This week",
            tabPanel : <TodaysReport items={reportItems} options={reportOptions}  /> 
        },
        {
            tab : "This Month",
            tabPanel : <TodaysReport items={reportItems} options={reportOptions}  />
        },

    ];



    useEffect(() => {
        setReportItems([
            {
                name : "Total Product Sales",
                count : salesReport.totalProductSales,
                icon : "supervisor_account"
            },
            {
                name : "Total Sales Price",
                count : salesReport.totalSalesPrice,
                icon : "storefront"
            },
            {
                name : "Total Sales Product Due",
                count : salesReport.totalSalesProductDue,
                icon : "shop_two"
            },{
                name : "Total Sales Payment Due",
                count : salesReport.totalSalesPaymentDue,
                icon : "account_balance_wallet"
            },
            // {
            //     name : "Total Sales Product Due",
            //     count : 12,
            //     icon : "shopping_basket"
            // },{
            //     name : "Total Sales Payment Due",
            //     count : 189,
            //     icon : "credit_card"
            // }
        ]);
        let dataPoints = [];

        if(salesReport.salesRate){
            salesReport.salesRate.map( p => {
                let label = "";
                if (new Date().toLocaleDateString() == p.date){
                    label = "Today's Sales"
                }
                dataPoints.push({ label: p.date,  y: p.count  ,indexLabel : label});
            })
        }
        
        setReportOptions({
            animationEnabled: true,
            exportEnabled: true,
            theme: "dark2", //"light1", "dark1", "dark2"
            title:{
                text: "Product Sales Rate"
            },
            data: [
                {
                    type: "column", //change type to bar, line, area, pie, etc
                    //indexLabel: "{y}", //Shows y value on all Data Points
                    indexLabelFontColor: "#5A5757",
                    indexLabelPlacement: "outside",
                    dataPoints: dataPoints
                },
                {
                    type: "line",
                    name: "Sales Rate",
                    showInLegend: true,
                    yValueFormatString: "$#,##0",
                    dataPoints: dataPoints 
    
                },
            ]
        });

    },[salesReport]);
    const detailsPane = rowData => {
        let  overViewItems  = [
            ,{
                name : "Purchase Price - per",
                count : rowData.perProductPurchasePrice + " tk",
                icon : "money"
            },
            {
                name : "Pre Sales Price - per",
                count : rowData.salestPrice + " tk",
                icon : "money"
            }
            ,{
                name : "Sales Price - per",
                count : rowData.salesPrice/rowData.productQuantity + " tk",
                icon : "money"
            },
            {
                name : "Sales Discount - total",
                count : rowData.salesDiscount + " tk",
                icon : "money"
            },
            {
                name : "Total Sales Price",
                count : rowData.perProductPurchasePrice * rowData.productQuantity+" tk",
                icon : "money"
            },
            {
                name : "Total Sales Price",
                count : rowData.salesPrice+" tk",
                icon : "money"
            }
            ,
            {
                name : "Total Profit",
                count : (rowData.perProductSalesPrice - rowData.perProductPurchasePrice)*rowData.productQuantity + " tk",
                icon : "money"
            }
        ];
        return overViewItems;
    }
        return(
            <div>
                <RouteHeader subTitle={headersubtitle} details={routeHeader} />
                <HistoryVisual hasTabPanel={true} handleTabs={setReportTabs} tabs={tabs}/>
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