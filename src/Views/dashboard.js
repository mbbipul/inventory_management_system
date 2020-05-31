import React from 'react';
import ColumnLineAreaChart from '../components/columnLineAreaChart';
import PieChart from '../components/pieChart';
import SimpleTable from '../components/table';
import {Grid} from '@material-ui/core';
import {Paper} from '@material-ui/core';
import IconCard from '../components/iconCard';
import RouteHeader from '../components/routeHeader';


class DashBoard extends React.Component {

    overViewItems = [
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
    
    monthlyChartOptions = {
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
            labelFormatter: this.addSymbols
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: this.toggleDataSeries,
            verticalAlign: "top"
        },
        data: [{
            type: "column",
            name: "Actual Sales",
            showInLegend: true,
            xValueFormatString: "MMMM YYYY",
            yValueFormatString: "$#,##0",
            dataPoints: [
                { x: new Date(2017, 0,1), y: 27500 },
                { x: new Date(2017, 0,2), y: 29000 },
                { x: new Date(2017, 0,3), y: 22000 },
                { x: new Date(2017, 0,4), y: 26500 },
                { x: new Date(2017, 0,5), y: 33000 },
                { x: new Date(2017, 0,6), y: 37000 },
                { x: new Date(2017, 0,7), y: 32000 },
                { x: new Date(2017, 0,8), y: 27500 },
                { x: new Date(2017, 0,9), y: 29500 },
                { x: new Date(2017, 0,10),y: 43000 },
                { x: new Date(2017, 0,11), y: 55000, indexLabel: "High Renewals" },
                { x: new Date(2017, 0,11), y: 39500 }
            ]
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

    routeHeader = {
        title : "Dashboard",
        subTitle : "Home",
        icon : "dashboard",
        breadCrumbs : [{
            title : "Dashboard",
            icon : "dashboard"
        }]
    }

	render() {
		return (
            <div>
                <RouteHeader details={this.routeHeader} />
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                >
                    <Grid item xs={8}>
                        <ColumnLineAreaChart options={this.monthlyChartOptions}/>
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
                        this.overViewItems.map((item)=>(
                            <Grid item xs={3}>
                                <IconCard item={item}/>
                            </Grid>
                        ))
                    }
                </Grid>
            </div>
		);
	}
}

export default DashBoard;