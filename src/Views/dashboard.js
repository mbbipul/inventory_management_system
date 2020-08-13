import React, { useState, useEffect } from 'react';
import ColumnLineAreaChart from '../components/columnLineAreaChart';
import PieChart from '../components/pieChart';
import SimpleTable from '../components/table';
import {Grid, Card} from '@material-ui/core';
import {Paper} from '@material-ui/core';
import IconCard from '../components/iconCard';
import RouteHeader from '../components/routeHeader';
import HistoryVisual from '../components/historyWithVisualization';
import submitForm from '../utils/fetchApi';
import MaterialUIPickers from '../components/datePicker';


const DashBoard = () =>{

    const [reportTabs,setReportTabs] = useState(0);

    const [data,setData] = useState([]);

    const [reportDetails,setReportDetails] = useState({});

    const [categoriesData,setCategory] = useState([]);

    const [fromDate,setFromDate] = useState("");
    const [toDate,setToDate] = useState("");

    const [reportCardTitle,setreportCardTitle] = useState("All");
    useEffect(() => {
        switch (reportTabs) {
            case 0:
                FetchData(0,"all");
                break;
            case 1 :
                FetchData(2,Date.now());
                setreportCardTitle("Today's");
                break;
            case 2 :
                FetchData(2,Date.now()-8640000);
                setreportCardTitle("Yesterday's");
                break;
            case 3 :
                FetchData(1,Date.now()-(8640000*2));
                setreportCardTitle("Last 3 Day's");
                break;
            case 4 :
                FetchData(1,Date.now()-(8640000*6));
                setreportCardTitle("This week's");
                break;
            case 5:
                FetchData(1,Date.now()-(8640000*29));
                setreportCardTitle("This Month's");
                break;
            case 6:
                if(fromDate > toDate){
                    alert("Starting date cannot larger than Last Date");
                }
                setreportCardTitle(new Date(fromDate).toDateString()+" - "+new Date(toDate).toDateString());

                break;
            default:
                break;
        }
    },[reportTabs]);

    useEffect(() => {
        submitForm("profit/report-details_range/"+fromDate+"-"+toDate,"GET","",(res) => setReportDetails(JSON.parse(res)));
        submitForm("profit/profit-details_range/"+fromDate+"-"+toDate,"GET","",(res) => setData(JSON.parse(res)));
    },[fromDate]);

    useEffect(() => {
        submitForm("profit/report-details_range/"+fromDate+"-"+toDate,"GET","",(res) => setReportDetails(JSON.parse(res)));
        submitForm("profit/profit-details_range/"+fromDate+"-"+toDate,"GET","",(res) => setData(JSON.parse(res)));
    },[toDate]);
    const FetchData = (filter,date) => {
        submitForm("profit/profit-details/"+filter+"-"+date,"GET","",(res) => setData(JSON.parse(res)));
        submitForm("profit/report-details/"+filter+"-"+date,"GET","",(res) => setReportDetails(JSON.parse(res)));

    }

    useEffect(() => {
        let cates = [];
        if(reportDetails.categories){
            reportDetails.categories.map((c) => {
                cates.push({ y: ((c.count*100)/reportDetails.totalProduct).toPrecision(4), label: c.name});
            })
        }
        setCategory(cates);

    },[reportDetails]);

    const overViewItems = [
        {
            name : "Total Customer",
            count : reportDetails.customer,
            icon : "supervisor_account"
        },
        {
            name : "Total Product",
            count : reportDetails.totalProduct,
            icon : "storefront"
        },
        {
            name : "Total Supplier",
            count : reportDetails.totalSupplier,
            icon : "supervisor_account"
        },{
            name : "Total Invoice",
            count : 189,
            icon : "shopping_basket"
        }
    ]
    
    const getDataPoints = (rowData,key) => {
        
        let data = [];

        rowData.map((d) => {

            let date = d.date.split('/');
            let value = 0;
            if(key===3){
                value = d["totalSalesAmount"] - d["totalPurchaseAmount"];
            }else{
                value = d[key];
            }
            data.push({ x: new Date(date[2],date[0],date[1]), y:  value})
            
        });

        return data;
    }
    const monthlyChartOptions = {
        // theme: "dark2",
        animationEnabled: true,
        colorSet: "colorSet2",
        title: {
            text: ""
        },
        axisX: {
            valueFormatString: "MMM-DD"
        },
        axisY: {
            prefix: "$",
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top"
        },
        data: [
            {
                type: "column",
                name: "Sales Price",
                showInLegend: true,
                xValueFormatString: "MMMM YYYY",
                yValueFormatString: "$#,##0",
                dataPoints: getDataPoints(data,"totalSalesAmount") 
            },
            {
                type: "line",
                name: "Purchase Price",
                showInLegend: true,
                yValueFormatString: "$#,##0",
                dataPoints: getDataPoints(data,"totalPurchaseAmount") 

            },
            {
                type: "area",
                name: "Profit",
                markerBorderColor: "white",
                markerBorderThickness: 2,
                showInLegend: true,
                yValueFormatString: "$#,##0",
                dataPoints : getDataPoints(data,3)
            }
        ]
    }

    const routeHeader = {
        title : "Dashboard",
        subTitle : "Home",
        icon : "dashboard",
        breadCrumbs : [{
            title : "Dashboard",
            icon : "dashboard"
        }]
    }

    

    let tabs = [
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

                            <grid item xs >
                                <strong>From</strong>
                                <MaterialUIPickers onChange={(date) => setFromDate(date)} />
                            </grid>
                            <grid style={{marginLeft:100}} item xs >
                                <strong>To</strong>
                                <MaterialUIPickers onChange={(date) => setToDate(date)} />
                            </grid>
                        </Grid>
        },

    ];
      
	return (
            <div>
                <RouteHeader details={routeHeader} />

                <HistoryVisual 
                    hasTabPanel={false}
                    handleTabs={setReportTabs} 
                    tabs={tabs}/>

                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                >
                    <Grid item xs={8}>
                        {
                            data.length === 0 ? (
                                <Card style={{marginLeft:20,padding:200}} className={"light-pink-blue-gradient"}>
                                    <h1>No Data To Show</h1>
                                </Card>
                            ) :
                            <ColumnLineAreaChart options={monthlyChartOptions}/>
                        }
                    </Grid>
                    <Grid item xs={4}>
                        <Paper  style={{paddingLeft:20,paddingRight:20}}>
                            <h1>{reportCardTitle} Report</h1>
                            <SimpleTable title={reportCardTitle} rows={[reportDetails.todaysSales,reportDetails.todaysPurchase]}/>
                            <br />
                            <PieChart 
                                title="Product Categories Overview"
                                data={categoriesData}
                            />
                        </Paper>
                    </Grid>
                </Grid>
                <br />
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={4}
                    style={{padding:20}}
                >
                    {
                        overViewItems.map((item)=>(
                            <Grid item xs={3}>
                                <IconCard item={item}/>
                            </Grid>
                        ))
                    }
                </Grid>
            </div>
		);
}

export default DashBoard;