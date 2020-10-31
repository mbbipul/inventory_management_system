import React, { useEffect, useState } from 'react';
import AccordionsTable from '../components/accordionTable';
import submitForm from '../utils/fetchApi';

export default function SalesDelivery(){

    const [data,setData] = useState([]);

    const columns = [
        { title: 'Product Name', field: 'productName' },
        { title: 'Customer Name', field: 'customerName' },
        { title: 'Deliver product quantity', field: 'productQuantity' },
        { 
            title: 'Delivery Date', 
            field: 'deliveryDate',
            render : rowData => new Date(parseInt(rowData.deliveryDate)).toDateString() 
        },

    ];

    const FetchData = () => {
        submitForm("ProductDelivery/regarding-salesId","GET","",(res) => setData(JSON.parse(res)));
    }

    const accordionsHeaders = ["Sales Id","Product Name","Total Sales Product Quantity","Delivered Product Quantity"];

    useEffect(() => {
        FetchData();
    },[]);

    return (
        <div>
            <AccordionsTable 
                theme={'dark'}
                title={"All Sales Product Delivery History Of "}
                headers={accordionsHeaders}
                accordions={data}
                columns={columns}
            />
        </div>
    )
}