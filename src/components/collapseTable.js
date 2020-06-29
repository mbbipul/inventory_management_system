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
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/C0DPdy98e4c"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        )
      }}
    />
  )
}

export default MaterialTableDetailsPanel;