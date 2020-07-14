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
    
    const FetchData = async () => {

        try {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
    
          var requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: 'follow'
          };
          const res = await fetch(apiUrl+"Employees", requestOptions);
          const json = await res.json();
          setData(json);

          // console.log("json - ", json);
        } catch (error) {
          console.log("error - ", error);
        }
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
                            <MaterialTable
                                title="Cost Sheet"
                                columns={columns.slice(0,-1)}
                                data={data}
                            />
                        </div>
                    </Route>
                    <Route exact path="/employee/add-employee">
                        <AddEmployee />
                    </Route>
                    <Route exact path="/employee/manage-employee">
                        <div style={{margin:20}}>
                            <ManageTable 
                                title="Manage Employee" 
                                hasUnique={false}
                                uniqueKey="employeeId" 
                                uniqueName="employeeName" 
                                apiUrl="Employees/" 
                                ondataChange={() => console.log()} 
                                data={{ columns : columns , data : data}}
                                
                            />
                        </div>
                    </Route>
                </Switch>
            </div>                        
        )
    
}

export default Employee;