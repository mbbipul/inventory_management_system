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
import AddCost from "./addCost";
import MaterialTable from "material-table";
import AddEmployee from "./addEmployee";
import submitForm from "../utils/fetchApi";

function Employee () {

    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    
   useEffect(() => {
        setHeaderSubtitile(location[2]);
        if(location.length <= 2){
            setHeaderSubtitile(location[1]);

        }
    }, [location]);

    const [columns,] = useState([
        { title: 'Employee Name', field: 'employeeName' },
        { title: 'Address', field: 'employeeAddress' },
        { title: 'Contact Number', field: 'employeeContact' },
        { title: 'Employee Email', field: 'employeeEmail' },
        { title: 'Employee NID', field: 'employeeNID' },
        { title: 'Join Date', field: 'date' }

    ]);

    const [data,setData] = useState([]);
    
    const FetchData =  () => {
        submitForm("Employees/","GET","",(res) => setData(JSON.parse(res)));
    };
    
    let routeHeader = {
        title : "Employee",
        subTitle : headersubtitle,
        icon : "account_box",
        breadCrumbs : [
            {
                title : "Employee",
                icon : "account_box"
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
        return(
            <div>
                <RouteHeader subTitle={headersubtitle} details={routeHeader} />
                <Switch>
                    <Route exact path="/employee">
                        <div style={{margin:20}}>
                        <ProductTable 
                            title="All Employees"
                            apiUrl="Employees/" 
                            data={{ columns : columns , data : data}}/>
                        </div>
                    </Route>
                    <Route exact path="/employee/add-employee">
                        <AddEmployee />
                    </Route>
                    <Route exact path="/employee/manage-employee">
                        <div style={{margin:20}}>
                            <ManageTable 
                                title="Manage Employee" 
                                hasUnique={true}
                                apiInfo="Employee"
                                uniqueKey="employeeId" 
                                uniqueName="employeeName" 
                                apiUrl="Employees/" 
                                editable={true}
                                ondataChange={() => console.log()}
                                data={data} 
                                columns={columns}
                                
                            />
                        </div>
                    </Route>
                </Switch>
            </div>                        
        )
    
}

export default Employee;