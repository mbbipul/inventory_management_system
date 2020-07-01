import React from 'react';
import MaterialTable from 'material-table';

function MaterialTableDetailsPanel(props) {
  return (
    <MaterialTable
      title="All Product Category"
      columns={[
        { title: 'Category Name', field: 'productCategoryName',headerStyle :  {textAlign: 'center'} },
        { title: 'Total Sales(৳)', field: 'sales',type : "currency",headerStyle :  {textAlign: 'right'}  },
        { title: 'Total Earn(৳) ', field: 'earn',type : "currency",headerStyle :  {textAlign: 'right'} }
      ]}
      data={props.data.data}
      detailPanel={rowData => {
        return (
         <p>Hello</p>
        )
      }}
    />
  )
}

export default MaterialTableDetailsPanel;