import React from 'react';
import IconCard from './iconCard';
import { Grid } from '@material-ui/core';
import CanvasJSReact from '../assets/canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function TodaysReport (props){

  
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
                    props.items.map((item)=>(
                        <Grid item xs={4}>
                            <IconCard item={item}/>
                        </Grid>
                    ))
                }
            </Grid>

            <CanvasJSChart options = {props.options} 
				/* onRef={ref => this.chart = ref} */
			/>
        </div>
       
    )
}

export default TodaysReport;