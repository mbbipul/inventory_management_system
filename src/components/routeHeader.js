import React from 'react';
import {Paper,Grid } from '@material-ui/core';
import IconBreadcrumbs from './Breadcrumbs';

import '../App.css';

class RouteHeader extends React.Component {

    
    render(){
        return (
            <Paper elevation={1} style={{paddingLeft : 10}}>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <Grid item xs={6}>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                            spacing={8}
                        >
                            <Grid item xs={1}>
                                <i style={{color: '#000'}}  className="material-icons md-48 md-light">dashboard</i>
                            </Grid>
                            <Grid item xs={10}>
                                <h3 style={{marginTop:-1,paddingTop:7,fontWeight:1000,fontSize:20}}>Dashboard</h3>
                                <p style={{marginTop:-20}}>Home</p>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={6}>
                        <IconBreadcrumbs />
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}

export default RouteHeader;