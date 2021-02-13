import React, { useState, useEffect } from "react";
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import ManageTable from "../components/manageTable";
import apiUrl from "../utils/apiInfo";
import AddPurchase from "./addPurchase";
import DetailsTable from "../components/collapseTable";
import HistoryVisual from "../components/historyWithVisualization";
import TodaysReport from "../components/todaysReport";
import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined';
import { green } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import submitForm from "../utils/fetchApi";
import { Grid } from "@material-ui/core";
import MaterialUIPickers from "../components/datePicker";

function Purchase () {
    const [reportTabs,setReportTabs] = useState(0);
    const [data,setData] = useState([]);
    const [unchangeData,setUnchangeData] = useState([]);

    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    const [fromDate,setFromDate] = useState("");
    const [toDate,setToDate] = useState("");

    const [purchaseReport,setPurchaseReport] = useState({});
    const [reportItems,setReportItems] = useState([]);
    const [reportOptions,setReportOptions] = useState({});
    const [tableData,setTableData] = useState([]);

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
                FetchReportByDate("");
                break;
            case 1 :
                filterValue = unchangeData.filter(purchase => 
                    new Date(parseInt(purchase.purchaseDate)).getDate() === new Date().getDate() && 
                    new Date(parseInt(purchase.purchaseDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(purchase.purchaseDate)).getFullYear() === new Date().getFullYear() 

                );
                FetchReportByDate(new Date().getTime());
                break;
            case 2 :
                filterValue = unchangeData.filter(purchase => 
                    new Date(parseInt(purchase.purchaseDate)).getDate() === new Date().getDate() -1 && 
                    new Date(parseInt(purchase.purchaseDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(purchase.purchaseDate)).getFullYear() === new Date().getFullYear() 
                );
                FetchReportByDate(new Date().getTime()-86400000);
                break;

            case 3:
                filterValue = unchangeData.filter(purchase => 
                    new Date(parseInt(purchase.purchaseDate)).getDate() >= new Date().getDate()-2 &&
                    new Date(parseInt(purchase.purchaseDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(purchase.purchaseDate)).getFullYear() === new Date().getFullYear() 
                );
                FetchReport(2);
                break;
            case 4:
                filterValue = unchangeData.filter(purchase => 
                    new Date(parseInt(purchase.purchaseDate)).getDate() >= new Date().getDate()-6 &&
                    new Date(parseInt(purchase.purchaseDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(purchase.purchaseDate)).getFullYear() === new Date().getFullYear() 
                );
                FetchReport(6);
                break;
                
            case 5:
                filterValue = unchangeData.filter(purchase => 
                    new Date(parseInt(purchase.purchaseDate)).getDate() >= new Date().getDate()-29 &&
                    new Date(parseInt(purchase.purchaseDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(purchase.purchaseDate)).getFullYear() === new Date().getFullYear() 
                );
                FetchReport(29);
                break;
            case 6:
                if(fromDate > toDate){
                    alert("Starting date cannot larger than Last Date");
                }

                break;
            default:
                break;
            
        }
        // console.log(filterValue);
        var dateFormatData = JSON.parse(JSON.stringify(filterValue)) ;
        setData(dateFormatData);
       
    },[reportTabs])

    useEffect(() => {
        setHeaderSubtitile(location[2]);
        if(location.length <= 2){
            setHeaderSubtitile(location[1]);
        }
       
    }, [location]); 

    const FetchPurchaseByDateRange = () => {
        submitForm(`Purchases/purchases-by-range/${fromDate}-${toDate}`,'GET','',res => setData(JSON.parse(res)));
    }
    useEffect(() => {
        if (reportTabs === 6){
            if(fromDate > toDate){
                alert("Starting date cannot larger than Last Date");
            }else{
                FetchPurchaseByDateRange();
                FetchReportByDateRange(fromDate,toDate);
            }    
        }
    },[fromDate]);

    useEffect(() => {
        if( reportTabs === 6){
            if(fromDate > toDate){
                alert("Starting date cannot larger than Last Date");
            }else{
                FetchPurchaseByDateRange();
                FetchReportByDateRange(fromDate,toDate);
            }    
        }
    },[toDate]);

    const [columns,] =  useState([
                            { title: 'Purchase ID', field: 'purchaseId' },
                            { title: 'Supplier Name', field: 'supplierName' },
                            { title: 'Product Name', field: 'productName' },
                            { title: 'Product Quantity', field: 'productQuantity' },
                            { title: 'Purchase Price', field: 'purchasePrice' },
                            { 
                                title: 'Purchase Date', 
                                field: 'purchaseDate',
                                render : rowData => new Date(parseInt(rowData.purchaseDate)).toDateString()
                            },
                            { 
                                title: 'Purchase Payment Amount', 
                                field: 'purchasePaymentAmount' 
                            },
                            { 
                                title: 'Purchase Product Due Status', 
                                field: 'productDueStatus' ,
                                render : rowData => <CustomPaidStatus status={rowData.productDueStatus===0 ? true : false}/>
                            },
                            { 
                                title: 'Purchase Paid Status', 
                                field: 'purchasePaidStatus',
                                render : rowData => <CustomPaidStatus status={rowData.purchasePaidStatus}/>
                            },
                            // { title: 'Purchase Due Payment Date', field: 'purchaseDuePaymentDate' },

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
            setData(json);
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
    
    const FetchReport = (days) => {
        let valDays = [];
        for (let i = 1; i <= days;i++ ){
            valDays.push(new Date(new Date().getTime() - 86400000*i ).toLocaleDateString());
        }
        console.log(valDays);
        submitForm("Report/purchase-report-all/","GET","",(res) =>{
            let allRes = JSON.parse(res);
            let data = allRes.purchaseRate.filter(p => valDays.includes(p.date));
            let purDueData = allRes.totalPurchaseProductDue.filter(p => valDays.includes(p.purchase.purchaseDate));

            let totalPurchaseProduct ;
            let totalPurchasePrice ;
            let totalPurchasePaymentDue ;
            data.purchaseRate.map(d => {
                const unique = [...new Set(d.data.map(item => item.productId))]; // [ 'A', 'B']
                totalPurchaseProduct += unique.length;
                totalPurchasePrice += d.purchasePrice;

                if(!d.purchasePaidStatus){
                    totalPurchasePaymentDue += 1;               
                }
            });

            let report = {
                "totalProductPurchase": totalPurchaseProduct,
                "totalPurchasePrice": totalPurchasePrice,
                "totalPurchaseProductDue": purDueData,
                "totalPurchasePaymentDue": totalPurchasePaymentDue,
                purchaseRate : data.purchaseRate
            }
            setPurchaseReport(report);
        });
    }

    const FetchReportByDate = (date) => {
        submitForm("Report/purchase-report/"+date,"GET","",(res) => setPurchaseReport(JSON.parse(res)));
    }

    const FetchReportByDateRange = (date1,date2) => {
        submitForm("Report/purchase-report-range/"+date1+"-"+date2,"GET",'',(res) => setPurchaseReport(JSON.parse(res)));
    }

    const FetchAlls = () => {
        FetchData();
        FetchReportByDate("");
    }

    useEffect(() => {
        FetchAlls();
    },[headersubtitle])

    useEffect(() => {
        setReportItems([
            {
                name : "Total Product Purchase",
                count : purchaseReport.totalProductPurchase,
                icon : "supervisor_account"
            },
            {
                name : "Total Purchase Price",
                count : purchaseReport.totalPurchasePrice,
                icon : "storefront"
            },
            {
                name : "Total Purchase Product Due",
                count : purchaseReport.totalPurchaseProductDue,
                icon : "shop_two"
            },{
                name : "Total Purchase Payment Due",
                count : purchaseReport.totalPurchasePaymentDue,
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

        if(purchaseReport.purchaseRate){
            purchaseReport.purchaseRate.map( p => {
                let label = "";
                if (new Date().toLocaleDateString() === p.date){
                    label = "Today's Purchase"
                }
                dataPoints.push({ label: p.date,  y: p.count  ,indexLabel : label});
            })
        }
        
        setReportOptions({
            animationEnabled: true,
            exportEnabled: true,
            theme: "dark2", //"light1", "dark1", "dark2"
            title:{
                text: "Product Purchasing Rate"
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
                    name: "Purchase Rate",
                    showInLegend: true,
                    yValueFormatString: "$#,##0",
                    dataPoints: dataPoints 
    
                },
            ]
        });

    },[purchaseReport]);

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
        {
            tab : "Jump To",    
            tabPanel :  
                        <div>
                            <Grid
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
                            <TodaysReport items={reportItems} options={reportOptions}  />
                        </div>
        },

    ];

    const detailsPane = rowData => {
        let  overViewItems  = [
        {
          name : "Per Purchase Price",
          count : (rowData.purchasePrice / rowData.productQuantity).toPrecision(6) + " tk",
          icon : "money"
        },
        {
            name : "Total Purchase Discount",
            count : rowData.purchaseDiscount + " tk",
            icon : "money"
        },
        {
            name : "Expected Profit",
            count : ((rowData.salesPrice*rowData.productQuantity) - rowData.purchasePrice) + " tk",
            icon : "money"
        }];

        
        return overViewItems;
    }

    useEffect(() => {
        const tmp = [...data];
        tmp.map(d => d.purchaseDate = new Date(parseInt(d.purchaseDate)).toDateString())
        setTableData(tmp);
    },[data]);
        return(
            <div>
                <RouteHeader subTitle={headersubtitle} details={routeHeader} />
                <HistoryVisual hasTabPanel={true} handleTabs={setReportTabs} tabs={tabs}/>
                <Switch>
                    <Route exact path="/purchase">
                        <div style={{margin:20}}>
                            <DetailsTable 
                                detailsPane={detailsPane}
                                title="Purchase"
                                columns={columns} 
                                data={tableData} />
                        </div>
                    </Route>
                    <Route exact path="/purchase/add-purchase">
                        <AddPurchase />
                    </Route>
                    <Route exact path="/purchase/manage-purchase">
                        <div style={{margin:20}}>
                            <ManageTable 
                                title="Manage Purchases" 
                                hasUnique={true}
                                apiInfo="Purchase"
                                uniqueKey="purchaseId" 
                                uniqueName="purchaseId" 
                                apiUrl={"Purchases/"}
                                editable={false}
                                onChangeData={FetchAlls} 
                                columns={columns} 
                                data={data} />
                        </div>
                    </Route>
                </Switch>
            </div>                        
        )
    
}

export default Purchase;