import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FullWidthTabs from '../components/tab';
import OrderPayment from './orderPayment';
import PurchasePayment from './purchasePayment';
import SalesPayment from './SalesPayment';

export default function Payment() {
    const location = useLocation().pathname.split("/");
    const [defaultTab,setDefaultTab] = useState(0);

    useEffect(() => {
        if ( location[2] === "sales-payment"){
            setDefaultTab(1);
        }else if(location[2] === "order-sales-payment"){
            setDefaultTab(2);
        }
        else{
            setDefaultTab(0);
        }
    },[location]);
    const tabs = [
        {
            tab : "Purchase Payments",
            tabPanel :  <div>
               <PurchasePayment />
            </div>
        },
        {
            tab : "Sales Payments",
            tabPanel :  <div>
               <SalesPayment />
            </div>
        },
        {
            tab : "Order Sales Payments",
            tabPanel :  <div>
               <OrderPayment />
            </div>
        }
    ];
    return (
        <div>
            <FullWidthTabs default={defaultTab} tabs={tabs}/>
        </div>
    )
}