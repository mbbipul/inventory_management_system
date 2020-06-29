import React from 'react';
import MaterialTable from 'material-table';

export default function Table(props) {

  return (
    <MaterialTable
      title="Editable Example"
      columns={props.data.columns}
      data={props.data.data}
      
    />
  );
}
