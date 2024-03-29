import React, { useEffect, useState } from 'react';
import AccordionsTable from '../components/accordionTable';
import submitForm from '../utils/fetchApi';

export default function PurchasePayment(){

    const [data,setData] = useState([]);

    const columns = [
        { title: 'Product Name', field: 'productName' },
        { title: 'Company Name', field: 'companyName' },
        { title: 'Purchase Payment Amount', field: 'paymentAmount' },
        { 
            title: 'Purchase Payment Date', 
            field: 'paymentPurchaseDate',
            render : rowData => {
                if(/^\d+$/.test(rowData.paymentPurchaseDate)){
                    return new Date(parseInt(rowData.paymentPurchaseDate)).toDateString() 
                }
                return new Date(rowData.paymentPurchaseDate).toDateString() ;
            }
        },

    ];

    const FetchData = () => {
        submitForm("paymentpurchase/regarding-supplier","GET","",(res) => {
            let tmp = JSON.parse(res);
            setData(tmp);
        });
    }

    const accordionsHeaders = ["Supplier Name","Total Purchase Payment","Total Purchase Payment Amount","Paid Purchase Amount"];

    useEffect(() => {
        FetchData();
    },[]);

    return (
        <div>
            <AccordionsTable 
                theme={'dark'}
                title={"All Purchase Payments Of "}
                headers={accordionsHeaders}
                accordions={data}
                columns={columns}
            />
        </div>
    )
}