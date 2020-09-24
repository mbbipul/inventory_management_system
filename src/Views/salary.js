import React, { useState, useEffect } from "react";
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import ManageTable from "../components/manageTable";
import ProductTable from '../components/productTable';

import AddSalary from "./addSalary";
import submitForm from "../utils/fetchApi";

function Salary () {

    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    
   useEffect(() => {
        setHeaderSubtitile(location[2]);
        if(location.length <= 2){
            setHeaderSubtitile(location[1]);

        }
    }, [location]);

    const [columns,] = useState([
        { title: 'Salary Id', field: 'salaryId' },
        { title: 'Employee Name', field: 'employeeName' },
        { title: 'Salary Amount', field: 'salaryAmount' },
        { title: 'Payment Date', field: 'salaryPaymentDate' }

    ]);

    const [data,setData] = useState([]);
    
    const FetchData =  () => {
        submitForm("Salaries/","GET","",(res) => setData(JSON.parse(res)));
    };
    
    let routeHeader = {
        title : "Salary",
        subTitle : headersubtitle,
        icon : "monetization_on",
        breadCrumbs : [
            {
                title : "Salary",
                icon : "monetization_on"
            },
            {
                title : "All Employees",
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
                <Route exact path="/salary">
                    <div style={{margin:20}}>
                        <ProductTable 
                            title="Salary Sheet"
                            apiUrl="Salaries/" 
                            data={{ columns : columns , data : data}}/>
                    </div>
                </Route>
                <Route exact path="/salary/add-salary">
                    <AddSalary />
                </Route>
                <Route exact path="/salary/manage-salary">
                    <div style={{margin:20}}>
                        <ManageTable 
                            title="Manage Salary" 
                            hasUnique={true}
                            apiInfo="Salary" 
                            uniqueKey="salaryId" 
                            uniqueName="salaryId" 
                            apiUrl="Salaries/" 
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

export default Salary;