import React from 'react';
import MaterialTable from 'material-table';

function MaterialTableDetailsPanel() {
  return (
    <MaterialTable
      title="All Product Category"
      columns={[
        { title: 'Category Name', field: 'category',headerStyle :  {textAlign: 'center'} },
        { title: 'Total Sales(৳)', field: 'sales',type : "currency",headerStyle :  {textAlign: 'right'}  },
        { title: 'Total Earn(৳) ', field: 'earn',type : "currency",headerStyle :  {textAlign: 'right'} }
      ]}
      data={[
        { category: 'Milk', sales: 2200, earn: 1987 },
        { category: 'Rice', sales: 2500, earn: 2017},
      ]}
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