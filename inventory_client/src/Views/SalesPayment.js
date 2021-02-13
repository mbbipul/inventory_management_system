import React, { useEffect, useState } from 'react';
import AccordionsTable from '../components/accordionTable';
import submitForm from '../utils/fetchApi';

export default function SalesPayment(){

    const [data,setData] = useState([]);

    const columns = [
        { title: 'Sales Id', field: 'salesId' },
        { title: 'Customer Name', field: 'customerName' },
        { title: 'Sales Payment Amount', field: 'paymentAmount' },
        { 
            title: 'Sales Payment Date', 
            field: 'paymentSalesDate',
            render : rowData => new Date(parseInt(rowData.paymentSalesDate)).toDateString() 
        },

    ];

    const FetchData = () => {
        submitForm("Paymentsales/regarding-customer","GET","",(res) => {
            let tmp = JSON.parse(res);
            tmp.map(d => d.paymentSalesDate = new Date(parseInt(d.paymentSalesDate)).toDateString());
            setData(tmp);
        });
    }

    const accordionsHeaders = ["Customer Name","Total Sales Payment","Total Sales Payment Amount","Recieved Payment Amount"];

    useEffect(() => {
        FetchData();
    },[]);

    return (
        <div>
            <AccordionsTable 
                theme={'dark'}
                title={"All Sales Payments Of "}
                headers={accordionsHeaders}
                accordions={data}
                columns={columns}
            />
        </div>
    )
}