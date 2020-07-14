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

function Cost () {

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
    
    const FetchData = async () => {

        try {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
    
          var requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: 'follow'
          };
          const res = await fetch(apiUrl+"Costs", requestOptions);
          const json = await res.json();
          setData(json);

          // console.log("json - ", json);
        } catch (error) {
          console.log("error - ", error);
        }
    };
    
    let routeHeader = {
        title : "Cost",
        subTitle : headersubtitle,
        icon : "payment",
        breadCrumbs : [
            {
                title : "Cost",
                icon : "payment"
            },
            {
                title : "All Cost",
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
                    <Route exact path="/cost">
                        <div style={{margin:20}}>
                            <MaterialTable
                                title="Cost Sheet"
                                columns={columns.slice(0,-1)}
                                data={data}
                                detailPanel={rowData => {
                                    return (
                                        <p>{rowData.costDescription}</p>
                                    )
                                }}
                            />
                        </div>
                    </Route>
                    <Route exact path="/cost/add-cost">
                        <AddCost />
                    </Route>
                    <Route exact path="/cost/manage-cost">
                        <div style={{margin:20}}>
                            <ManageTable 
                                title="Manage Cost" 
                                hasUnique={true}
                                uniqueKey="costId" 
                                uniqueName="companyName" 
                                apiUrl="Costs/" 
                                ondataChange={() => console.log()} 
                                data={{ columns : columns , data : data}}
                                
                            />
                        </div>
                    </Route>
                </Switch>
            </div>                        
        )
    
}

export default Cost;