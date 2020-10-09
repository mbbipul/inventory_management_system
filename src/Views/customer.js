import React ,{ useState, useEffect} from "react";
import {
  Switch,
  Route,
  useLocation
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import ProductTable from '../components/productTable';
import ManageTable from "../components/manageTable";
import submitForm from "../utils/fetchApi";
import AddCustomer from "./addCustomer";

function Customer() {
    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    const [columns,] = useState([
        { title: 'Customer Name', field: 'customerName' },
        { title: 'Address', field: 'customerAddress' },
        { title: 'Contact Number', field: 'customerContact' },
        { title: 'Customer Email', field: 'customerEmail' },
        { title: 'Customer NID', field: 'customerNID' },
        { 
            title: 'Join Date', 
            field: 'customerJoinDate',
            render : rowData => new Date(parseInt(rowData.customerJoinDate)).toDateString()

        }

    ]);
    const [data,setData] = useState([]);

    useEffect(() => {
        setHeaderSubtitile(location[2]);
        if(location.length <= 2){
            setHeaderSubtitile(location[1]);

        }
    }, [location]);

    let routeHeader = {
        title : "Customer",
        subTitle : headersubtitle,
        icon : "supervisor_account",
        breadCrumbs : [
            {
                title : "Customer",
                icon : "supervisor_account"
            },
            {
                title : "All Customers",
                icon : "category"
            }
        ]
    }

    const FetchData = () => {
        submitForm("Customers","GET","",(result) => setData(JSON.parse(result)));
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
                <Route exact path="/customer">
                    <div style={{margin:20}}>
                        <ProductTable 
                            title="All Customers"
                            apiUrl="Customers/" 
                            data={{ columns : columns , data : data}}/>
                    </div>
                </Route>
                <Route exact path="/customer/add-customer">
                    <AddCustomer />
                </Route>
                <Route exact path="/customer/manage-customer">
                        <div style={{margin:20}}>
                            <ManageTable 
                                title="Manage Customer" 
                                hasUnique={true}
                                apiInfo="Customer"
                                uniqueKey="customerId" 
                                uniqueName="customerName" 
                                apiUrl="Customers/" 
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

export default Customer;