import React, { useState, useEffect } from "react";
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import ProductTable from '../components/productTable';
import AddCompany from "./addCompany";
import ManageTable from "../components/manageTable";
import AddCost from "./addCost";
import submitForm from "../utils/fetchApi";

function Cost () {

    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    
   useEffect(() => {
        setHeaderSubtitile(location[2]);
        if(location.length <= 2){
            setHeaderSubtitile(location[1]);

        }
    }, [location]);

    const [columns,] = useState([
                        { title: 'Cost Id', field: 'costId' },
                        { title: 'Cost Type', field: 'costType' },
                        { title: 'Cost Amount', field: 'costAmount' },
                        { title: 'Date', field: 'date' },
                        { title: 'Cost Description' , field: 'costDescription'}

                    ]);
    const [data,setData] = useState([]);
    
    const FetchData =  () => {
        submitForm("Costs/","GET","",(res) => setData(JSON.parse(res)));
    };
    
    let routeHeader = {
        title : "Cost",
        subTitle : headersubtitle,
        icon : "payment",
        breadCrumbs : [
            {
                title : "Cost",
                icon : "payment"
            },
            {
                title : "All Cost",
                icon : "category"
            }
        ]
    }
    
    useEffect(() => {
        FetchData();
    },[]);

    useEffect(() => {
        FetchData();
    },[headersubtitle]);
    
    return(
        <div>
            <RouteHeader subTitle={headersubtitle} details={routeHeader} />
            <Switch>
                <Route exact path="/cost">
                    <div style={{margin:20}}>
                        <ProductTable 
                            title="Costs Sheet"
                            apiUrl="Costs/" 
                            data={{ columns : columns , data : data}}/>
                    </div>
                </Route>
                <Route exact path="/cost/add-cost">
                    <AddCost />
                </Route>
                <Route exact path="/cost/manage-cost">
                    <div style={{margin:20}}>
                        <ManageTable 
                            title="Manage Cost" 
                            hasUnique={true}
                            apiInfo="Costs" 
                            uniqueKey="costId" 
                            uniqueName="costId" 
                            apiUrl="Costs/" 
                            editable={true}
                            onChangeData={FetchData} 
                            data={data} 
                            columns={columns}
                            
                        />
                    </div>
                </Route>
            </Switch>
        </div>                        
    )
    
}

export default Cost;