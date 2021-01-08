import React ,{ useState, useEffect} from "react";
import {
  Switch,
  Route,
  useLocation
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import ProductTable from '../components/productTable';
import AddSupplier from "./addSupplier";
import ManageTable from "../components/manageTable";
import submitForm from "../utils/fetchApi";

function Supplier() {
    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    const [columns,] = useState([
        { title: 'Supplier Name', field: 'supplierName' },
        { title: 'Address', field: 'supplierAddress' },
        { title: 'Contact Number', field: 'supplierContact' },
        { title: 'Company Name', field: 'supplierContact' },

    ]);
    const [data,setData] = useState([]);

    useEffect(() => {
        setHeaderSubtitile(location[2]);
        if(location.length <= 2){
            setHeaderSubtitile(location[1]);

        }
    }, [location]);

    let routeHeader = {
        title : "Supplier",
        subTitle : headersubtitle,
        icon : "local_shipping",
        breadCrumbs : [
            {
                title : "Supplier",
                icon : "local_shipping"
            },
            {
                title : "All Product",
                icon : "category"
            }
        ]
    }


    const FetchData = () => {
        submitForm("Suppliers","GET","",(result) => setData(JSON.parse(result)));
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
                <Route exact path="/supplier">
                    <div style={{margin:20}}>
                        <ProductTable 
                            title="All Suppliers"
                            apiUrl="Suppliers/"
                            data={{ columns : columns , data : data}}/>
                    </div>
                </Route>
                <Route exact path="/supplier/add-supplier">
                    <AddSupplier />
                </Route>
                <Route exact path="/supplier/manage-supplier">
                        <div style={{margin:20}}>
                            <ManageTable 
                                title="Manage Supplier" 
                                hasUnique={true}
                                apiInfo="Suppliers"
                                uniqueKey="supplierId" 
                                uniqueName="supplierName" 
                                apiUrl="Suppliers/" 
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

export default Supplier;