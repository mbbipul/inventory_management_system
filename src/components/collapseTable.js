import React, { useState } from 'react';
import MaterialTable from 'material-table';
import { Grid } from '@material-ui/core';
import IconCard from './iconCard';

function DetailsTable(props) {

  let  overViewItems = [
    {
        name : "Total Products",
        count : "120",
        icon : "storefront"
    }
    ,{
      name : "Total Purchase Price",
      count : "189.00 tk",
      icon : "shop_two"
    },
    {
        name : "Total Sales Price",
        count : "234.00 tk",
        icon : "shopping_basket"
    },
    {
        name : "Total Profit",
        count : "1200.00 tk",
        icon : "money"
    }
]
  return (
    <MaterialTable
      title="All Product Category"
      columns={props.columns}
      data={props.data}
      detailPanel={rowData => {

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