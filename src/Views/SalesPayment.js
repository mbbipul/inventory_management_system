import React, { useEffect, useState } from 'react';
import AccordionsTable from '../components/accordionTable';
import submitForm from '../utils/fetchApi';

export default function SalesPayment(){

    const [data,setData] = useState([]);

    const columns = [
        { title: 'Product Name', field: 'productName' },
        { title: 'Customer Name', field: 'customerName' },
        { title: 'Purchase Payment Amount', field: 'paymentAmount' },
        { 
            title: 'Purchase Payment Date', 
            field: 'paymentSalesDate',
            render : rowData => new Date(parseInt(rowData.paymentSalesDate)).toDateString() 
        },

    ];

    const FetchData = () => {
        submitForm("Paymentsales/regarding-customer","GET","",(res) => setData(JSON.parse(res)));
    }

    const accordionsHeaders = ["Customer Name","Total Sales Payment","Total Sales Payment Amount"];

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