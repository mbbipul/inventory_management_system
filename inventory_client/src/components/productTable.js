import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import submitForm from '../utils/fetchApi';

export default function Table(props) {
  const [data,setData] = useState(props.data.data);

  useEffect(() => {
    if(props.data.data.length === 0){
      submitForm(props.apiUrl,"GET","", (res) => setData(JSON.parse(res)));
    }else{
      setData(props.data.data);
    }
  },[props.data.data]);

  useEffect(() => {
    submitForm(props.apiUrl,"GET","", (res) => setData(JSON.parse(res)));
  },[props.apiUrl]);
  return (
    <MaterialTable
      title={props.title}
      columns={props.data.columns}
      data={data}
      
    />
  );
}
