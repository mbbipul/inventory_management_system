import React, { useState, useEffect } from 'react';
import ColumnLineAreaChart from '../components/columnLineAreaChart';
import PieChart from '../components/pieChart';
import SimpleTable from '../components/table';
import {Grid} from '@material-ui/core';
import {Paper} from '@material-ui/core';
import IconCard from '../components/iconCard';
import RouteHeader from '../components/routeHeader';
import HistoryVisual from '../components/historyWithVisualization';
import TodaysReport from '../components/todaysReport';
import submitForm from '../utils/fetchApi';


const DashBoard = () =>{

    const [reportTabs,setReportTabs] = useState(0);

    const [data,setData] = useState([]);

    useEffect(() => {
        alert(reportTabs);
    },[reportTabs]);

    const FetchData = () => {
        submitForm("profit/profit-details","GET","",(res) => setData(JSON.parse(res)));
    }

    useEffect(() => {
        FetchData();
    },[]);

    const overViewItems = [
        {
            name : "Total Customer",
            count : 120,
            icon : "supervisor_account"
        },
        {
            name : "Total Product",
            count : 234,
            icon : "storefront"
        },
        {
            name : "Total Supplier",
            count : 12,
            icon : "supervisor_account"
        },{
            name : "Total Invoice",
            count : 189,
            icon : "shopping_basket"
        }
    ]
    
    const getDataPoints = (rowData) => {
        
        let data = [];

        rowData.map((d) => data.push({ x: new Date(d.year, d.month,d.day), y: d.salesPrice }));

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
        data: [{
            type: "column",
            name: "Actual Sales",
            showInLegend: true,
            xValueFormatString: "MMMM YYYY",
            yValueFormatString: "$#,##0",
            dataPoints: [ getDataPoints(data) ]
        },{
            type: "line",
            name: "Expected Sales",
            showInLegend: true,
            yValueFormatString: "$#,##0",
            dataPoints: [
                { x: new Date(2017, 0,1), y: 38000 },
                { x: new Date(2017, 0,2), y: 39000 },
                { x: new Date(2017, 0,3), y: 35000 },
                { x: new Date(2017, 0,4), y: 37000 },
                { x: new Date(2017, 0,5), y: 42000 },
                { x: new Date(2017, 0,6), y: 48000 },
                { x: new Date(2017, 0,7), y: 41000 },
                { x: new Date(2017, 0,8), y: 38000 },
                { x: new Date(2017, 0,9), y: 42000 },
                { x: new Date(2017, 0,10),y: 45000 },
                { x: new Date(2017, 0,11), y: 48000 },
                { x: new Date(2017, 0,11), y: 47000 }
            ]
        },{
            type: "area",
            name: "Profit",
            markerBorderColor: "white",
            markerBorderThickness: 2,
            showInLegend: true,
            yValueFormatString: "$#,##0",
            dataPoints: [
                { x: new Date(2017, 0,1), y: 11500 },
                { x: new Date(2017, 0,2), y: 10500 },
                { x: new Date(2017, 0,3), y: 9000 },
                { x: new Date(2017, 0,4), y: 13500 },
                { x: new Date(2017, 0,5), y: 13890 },
                { x: new Date(2017, 0,6), y: 18500 },
                { x: new Date(2017, 0,7), y: 16000 },
                { x: new Date(2017, 0,8), y: 14500 },
                { x: new Date(2017, 0,9), y: 15880 },
                { x: new Date(2017, 0,10),y: 24000 },
                { x: new Date(2017, 0,11), y: 31000 },
                { x: new Date(2017, 0,11), y: 19000 }
            ]
        }]
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
            tabPanel :  <div style={{width:550,marginLeft:"25%"}}>
                fddffd
            </div>
        }
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
                        <ColumnLineAreaChart options={monthlyChartOptions}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper  style={{paddingLeft:20,paddingRight:20}}>
                            <h1>Todays Report</h1>
                            <SimpleTable />
                            <br />
                            <PieChart />
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