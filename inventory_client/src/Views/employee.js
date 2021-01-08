import React, { useState, useEffect } from "react";
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import ProductTable from '../components/productTable';
import ManageTable from "../components/manageTable";
import AddEmployee from "./addEmployee";
import submitForm from "../utils/fetchApi";
import { Chip } from "@material-ui/core";
import MaterialTable from "material-table";

function Employee () {

    const [data,setData] = useState([]);
    const [creditEmployee,setCreditEMployee] = useState([]);
    const [paidEmployee,setPaidEMployee] = useState([]);

    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    
    const FetchCreditCustomer = (path) => {
        submitForm(path,"GET","",(result) => setCreditEMployee(JSON.parse(result)));
    }
    const FetchPaidCustomer = (path) => {
        submitForm(path,"GET","",(result) => setPaidEMployee(JSON.parse(result)));
    }

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
        { 
            title: 'Join Date', field: 'date' ,
            render : rowData => new Date(parseFloat(rowData.date)).toDateString()
        }

    ]);    

    const creditEmployeeColumns = [
        { title: 'Dsr (EMployee) Name', field: 'employeeName' },
        { title: 'Address', field: 'employeeAddress' },
        { title: 'Contact Number', field: 'employeeContact' },
        { 
            title : 'Total Sales Amount' ,
            field : 'salesPrice' ,
            render : rowData => <Chip 
                                    color="primary"
                                    label={rowData.orderSalesPrice}
                                    clickable /> 
        },
        { 
            title: 'Total Due Amount', 
            field: 'employeeDueAmount' ,
            render : rowData => <Chip 
                                    color="primary"
                                    label={rowData.employeeDueAmount}
                                    clickable /> 
        },
        { 
            title: 'Sales Ids ', 
            field: 'orderSalesIds' ,
            render : rowData => rowData.orderSalesIds.map((item,i) => (
                <Chip 
                    style={{marginRight : 2,marginBottom : 2}}
                    color="primary"
                    label={item}
                    clickable /> 
            ))
        },

    ];
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

    useEffect(() => {
        if(headersubtitle === "credit-employee"){
            FetchCreditCustomer("employees/credit-employees");
        }
        if(headersubtitle === "paid-employee"){
            FetchPaidCustomer("employees/paid-employees");
        }
        FetchData();

    },[headersubtitle]);

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
                            onChangeData={FetchData}
                            data={data} 
                            columns={columns}
                            
                        />
                    </div>
                </Route>
                <Route exact path="/employee/credit-employee">
                 <div style={{margin:20}}>
                    <MaterialTable
                        title="All Credit Employees"
                        columns={creditEmployeeColumns}
                        data={creditEmployee}/>
                </div>
                </Route>

                <Route exact path="/employee/paid-employee">
                 <div style={{margin:20}}>
                        <MaterialTable 
                            title="All Paid Employees"
                            columns={creditEmployeeColumns.slice(0,-1)}
                            data={paidEmployee}/>
                    </div>
                </Route>
            </Switch>
        </div>                        
    )
    
}

export default Employee;