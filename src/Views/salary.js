import React, { useState, useEffect } from "react";
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import ManageTable from "../components/manageTable";
import apiUrl from "../utils/apiInfo";
import MaterialTable from "material-table";
import AddSalary from "./addSalary";

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
        { title: 'Employee Name', field: 'employeeId' },
        { title: 'Salary Amount', field: 'salaryAmount' },
        { title: 'Payment Date', field: 'salaryPaymentDate' }

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
          const res = await fetch(apiUrl+"Salaries", requestOptions);
          const json = await res.json();
          setData(json);

          // console.log("json - ", json);
        } catch (error) {
          console.log("error - ", error);
        }
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
        return(
            <div>
                <RouteHeader subTitle={headersubtitle} details={routeHeader} />
                <Switch>
                    <Route exact path="/salary">
                        <div style={{margin:20}}>
                            <MaterialTable
                                title="Salary"
                                columns={columns}
                                data={data}
                            />
                        </div>
                    </Route>
                    <Route exact path="/salary/add-salary">
                        <AddSalary />
                    </Route>
                    <Route exact path="/salary/manage-salary">
                        <div style={{margin:20}}>
                            <ManageTable 
                                title="Manage Salary" 
                                hasUnique={false}
                                uniqueKey="salaryId" 
                                uniqueName="employeeName" 
                                apiUrl="Salaries/" 
                                ondataChange={() => console.log()} 
                                data={{ columns : columns , data : data}}
                                
                            />
                        </div>
                    </Route>
                </Switch>
            </div>                        
        )
    
}

export default Salary;