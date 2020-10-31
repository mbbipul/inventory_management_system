import React, { useEffect, useState } from 'react';
import AccordionsTable from '../components/accordionTable';
import submitForm from '../utils/fetchApi';

export default function ProductReception(){

    const [data,setData] = useState([]);
   
    const columns = [
        { title: 'Product Name', field: 'productName' },
        { title: 'Supplier Name', field: 'supplierName' },
        { title: 'Company Name', field: 'companyName' },
        { title: 'Recieve product quantity', field: 'productQuantity' },
        { 
            title: 'Reception Date', 
            field: 'receptionDate',
            render : rowData => new Date(parseInt(rowData.receptionDate)).toDateString() 
        },

    ];

    const FetchData = () => {
        submitForm("ProductReception/regarding-purchaseId","GET","",(res) => setData(JSON.parse(res)));
    }

    const accordionsHeaders = ["Purchase Id","Product Name","Total Purchase Product Quantity","Received Product Quantity"];

    useEffect(() => {
        FetchData();
    },[]);

    return (
        <div>
            <AccordionsTable 
                theme={'dark'}
                title={"All Purchase Product Reception History Of "}
                headers={accordionsHeaders}
                accordions={data}
                columns={columns}
            />
        </div>
    )
}