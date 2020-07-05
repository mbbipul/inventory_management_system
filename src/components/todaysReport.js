import React from 'react';
import IconCard from './iconCard';
import { Grid } from '@material-ui/core';
import CanvasJSReact from '../assets/canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function TodaysReport (){

    const items = [
        {
            name : "Total Product Purchase",
            count : 120,
            icon : "supervisor_account"
        },
        {
            name : "Total Purchase Price",
            count : 234,
            icon : "storefront"
        },
        {
            name : "Total Purchase Product Due",
            count : 12,
            icon : "supervisor_account"
        },{
            name : "Total Purchase Payment Due",
            count : 189,
            icon : "shopping_basket"
        }
    ];

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "dark2", //"light1", "dark1", "dark2"
        title:{
            text: "Product Purchasing Rate"
        },
        data: [{
            type: "column", //change type to bar, line, area, pie, etc
            //indexLabel: "{y}", //Shows y value on all Data Points
            indexLabelFontColor: "#5A5757",
            indexLabelPlacement: "outside",
            dataPoints: [
                { label: "Yesterdays Total Product Purchase",  y: 10  },
                { label: "Todays Total Product Purchase",  y: 20  }
            ]
        }]
    }
    return(
        <div>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={4}
                style={{padding:20}}
                >
                {
                    items.map((item)=>(
                        <Grid item xs={4}>
                            <IconCard item={item}/>
                        </Grid>
                    ))
                }
            </Grid>

            <CanvasJSChart options = {options} 
				/* onRef={ref => this.chart = ref} */
			/>
        </div>
       
    )
}

export default TodaysReport;