import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { Grid } from '@material-ui/core';
import IconCard from './iconCard';
import submitForm from '../utils/fetchApi';
import DataTableExtensions from "react-data-table-component-extensions";
const _filefy = require("filefy");

function DetailsTable(props) {

//   let detailsTable = <table class="custom-table">
//   <tr>
//     {props.expandTable.header.map((r) => (
//       <th>r</th>
//     ))}
//   </tr>
//   {props.expandTable.data.map((d) => (
//     <tr>
//       <td>{d[0]}</td>
//       <td>{d[1]}</td>
//       <td>{d[2]}</td>

//     </tr>
//   ))}
// </table>;
  const tableData = {
    columns : props.columns,
    data : props.data
  };

  const exportCsv = (allColumns, allData) => {
    const columns = allColumns.filter(columnDef => columnDef["export"] !== false);
    const exportedData = allData.map(rowData => columns.map(columnDef => rowData[columnDef.field]));
    new _filefy.CsvBuilder('filename5.csv' )
      .setDelimeter(',')
      .setColumns(columns.map(columnDef => columnDef.title))
      .addRows(exportedData)
      .exportFile();
  }

  return (
    <MaterialTable
      title={props.title}
      columns={props.columns}
      data={props.data}
      options={{exportButton:true,exportCsv}}
      detailPanel={rowData => {
        let overViewItems = props.detailsPane(rowData);
        
        return (
          <div
            style={{backgroundColor:"#b4c9cc"}}>
            <p style={{padding:10}}>{rowData.productDetails}</p>
            <div style={{padding:20}}> 
              {/* {detailsTable} */}
            </div>
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