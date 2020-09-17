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
import submitForm from "../utils/fetchApi";
import AddDamage from "./addDamage";

function Damage () {

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
        title : "Damage",
        subTitle : headersubtitle,
        icon : "remove_shopping_cart",
        breadCrumbs : [
            {
                title : "Damage",
                icon : "remove_shopping_cart"
            },
            {
                title : "All Damage",
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
                    <Route exact path="/damage">
                        <div style={{margin:20}}>
                            <ProductTable 
                                title="All Damages"
                                apiUrl="Costs/" 
                                data={{ columns : columns , data : data}}/>
                        </div>
                    </Route>
                    <Route exact path="/damage/add-damage">
                        <AddDamage />
                    </Route>
                    <Route exact path="/damage/manage-damage">
                        <div style={{margin:20}}>
                            <ManageTable 
                                title="Manage damage" 
                                hasUnique={true}
                                apiInfo="Costs" 
                                uniqueKey="costId" 
                                uniqueName="costId" 
                                apiUrl="Costs/" 
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

export default Damage;