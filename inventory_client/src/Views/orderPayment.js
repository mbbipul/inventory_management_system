import React, { useEffect, useState } from 'react';
import AccordionsTable from '../components/accordionTable';
import submitForm from '../utils/fetchApi';

export default function OrderPayment(){

    const [data,setData] = useState([]);

    const columns = [
        { title: 'Order Sales Id', field: 'orderSalesId' },
        { title: 'DSR (Employee) Name', field: 'employeeName' },
        { title: 'Order Sales Payment Amount', field: 'paymentAmount' },
        { 
            title: 'Order Payment Date', 
            field: 'paymentOrderSalesDate',
            render : rowData => new Date(parseInt(rowData.paymentOrderSalesDate)).toDateString() 
        },

    ];

    const FetchData = () => {
        submitForm("OrderPayments/regarding-customer","GET","",(res) => setData(JSON.parse(res)));
    }

    const accordionsHeaders = ["DSR (Employee) Name","Total Sales Payment","Total Sales Payment Amount","Recieved Payment Amount"];

    useEffect(() => {
        FetchData();
    },[]);

    return (
        <div>
            <AccordionsTable 
                theme={'dark'}
                title={"All Order sales Payments Of "}
                headers={accordionsHeaders}
                accordions={data}
                columns={columns}
            />
        </div>
    )
}