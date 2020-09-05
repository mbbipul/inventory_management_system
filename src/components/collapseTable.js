import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { Grid } from '@material-ui/core';
import IconCard from './iconCard';
import submitForm from '../utils/fetchApi';

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
const [data,setData] = useState(props.data);

useEffect(() => {
  if(props.data.length == 0){
    submitForm(props.apiUrl,"GET","", (res) => setData(JSON.parse(res)));
  }else{
    setData(props.data);
  }
},[props.data]);

useEffect(() => {
  submitForm(props.apiUrl,"GET","", (res) => setData(JSON.parse(res)));
},[]);
  return (
    <MaterialTable
      title={props.title}
      columns={props.columns}
      data={data}
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