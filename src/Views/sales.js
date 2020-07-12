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
import NewSales from "./newSales";

function Sales () {

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
    
    const FetchData = async () => {

        try {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
    
          var requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: 'follow'
          };
          const res = await fetch(apiUrl+"Companies", requestOptions);
          const json = await res.json();
          setData(json);

          // console.log("json - ", json);
        } catch (error) {
          console.log("error - ", error);
        }
    };
    
    let routeHeader = {
        title : "Sales",
        subTitle : headersubtitle,
        icon : "shopping_basket",
        breadCrumbs : [
            {
                title : "Sales",
                icon : "shopping_basket"
            },
            {
                title : "All Sales",
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
                    <Route exact path="/sales">
                        <div style={{margin:20}}>
                        sales
                        </div>
                    </Route>
                    <Route exact path="/sales/new-sales">
                        <NewSales />
                    </Route>
                    <Route exact path="sales/manage-sales">
                        <div style={{margin:20}}>
                            
                        </div>
                    </Route>
                </Switch>
            </div>                        
        )
    
}

export default Sales;