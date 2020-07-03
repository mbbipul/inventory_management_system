import React, { useState } from 'react';
import MaterialTable from 'material-table';
import submitForm from '../utils/fetchApi';

function DetailsTable(props) {
  const [detailsPane,setDetailsPane] = useState({});

  return (
    <MaterialTable
      title="All Product Category"
      columns={props.columns}
      data={props.data}
      detailPanel={rowData => {

        submitForm(props.fetchDetails+rowData.productId,"GET","",(result) =>{
          let data = {
            [rowData.productId] : JSON.parse(result)
          };
          setDetailsPane(data);
        });
        return (
         <p>{detailsPane[rowData.productId]}</p>
        )
      }}
    />
  )
}

export default DetailsTable;