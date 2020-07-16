import React, { useState } from 'react';
import MaterialTable from 'material-table';
import { Grid } from '@material-ui/core';
import IconCard from './iconCard';

function DetailsTable(props) {


  return (
    <MaterialTable
      title={props.title}
      columns={props.columns}
      data={props.data}
      detailPanel={rowData => {
        let overViewItems = props.detailsPane(rowData);
        
        return (
          <div
            style={{backgroundColor:"#b4c9cc"}}>
            <p style={{padding:10}}>{rowData.productDetails}</p>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
              spacing={4}
              style={{padding:20,backgroundColor:"#b4c9cc"}}
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
        )
      }}
    />
  )
}

export default DetailsTable;