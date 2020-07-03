import React from 'react';
import MaterialTable from 'material-table';

function DetailsTable(props) {
  return (
    <MaterialTable
      title="All Product Category"
      columns={props.columns}
      data={props.data}
      detailPanel={rowData => {
        return (
         <p>Hello</p>
        )
      }}
    />
  )
}

export default DetailsTable;