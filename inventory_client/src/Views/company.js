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
import apiUrl from "../utils/apiInfo";
import submitForm from "../utils/fetchApi";

function Company () {

    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    
   useEffect(() => {
        setHeaderSubtitile(location[2]);
        if(location.length <= 2){
            setHeaderSubtitile(location[1]);

        }
    }, [location]);

    const [columns,] = useState([
                                        { title: 'Company Name', field: 'companyName' },
                                        { title: 'Address', field: 'companyAddress' },
                                        { title: 'Contact Number', field: 'companyContact' },
                                    ]);
    const [data,setData] = useState([]);
    
    const FetchData =  () => {
        submitForm("Companies/","GET","",(res) => setData(JSON.parse(res)));
    };
    
    let routeHeader = {
        title : "Company",
        subTitle : headersubtitle,
        icon : "storefront",
        breadCrumbs : [
            {
                title : "Company",
                icon : "storefront"
            },
            {
                title : "All Company",
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
                <Route exact path="/company">
                    <div style={{margin:20}}>
                    <ProductTable 
                        title="All Companies"
                        apiUrl="Companies/" 
                        data={{ columns : columns , data : data}}/>
                    </div>
                </Route>
                <Route exact path="/company/add-company">
                    <AddCompany />
                </Route>
                <Route exact path="/company/manage-company">
                    <div style={{margin:20}}>
                        <ManageTable 
                            title="Manage Company" 
                            hasUnique={true}
                            apiInfo="Company"
                            uniqueKey="companyId" 
                            uniqueName="companyName" 
                            apiUrl="Companies/" 
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

export default Company;