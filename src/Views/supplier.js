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
    const [columns,setColumns] = useState([
        { title: 'Supplier Name', field: 'supplierName' },
        { title: 'Address', field: 'supplierAddress' },
        { title: 'Contact Number', field: 'supplierContact' },
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

    useEffect(() => {
        submitForm("Suppliers","GET","",(result) => setData(JSON.parse(result)));
    },[]);

    return(
        <div>
            <RouteHeader subTitle={headersubtitle} details={routeHeader} />
            <Switch>
                <Route exact path="/supplier">
                    <div style={{margin:20}}>
                        <ProductTable data={{ columns : columns , data : data}}/>
                    </div>
                </Route>
                <Route exact path="/supplier/add-supplier">
                    <AddSupplier />
                </Route>
                <Route exact path="/supplier/manage-supplier">
                        <div style={{margin:20}}>
                            <ManageTable 
                                title="Manage Supplier" 
                                hasUnique={false}
                                uniqueKey="supplierId" 
                                uniqueName="supplierName" 
                                apiUrl="Suppliers/" 
                                ondataChange={() => console.log()} 
                                data={{ columns : columns , data : data}}
                                
                            />
                        </div>
                    </Route>
            </Switch>
        </div>                        
    )
}

export default Supplier;