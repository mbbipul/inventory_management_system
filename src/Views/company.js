import React from "react";
import {
  Switch,
  Route,
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import ProductTable from '../components/productTable';
import AddCompany from "./addCompany";

class Company extends React.Component {

    routeHeader = {
        title : "Company",
        subTitle : "All Companies",
        icon : "storefront",
        breadCrumbs : [
            {
                title : "Company",
                icon : "storefront"
            },
            {
                title : "All Company",
                icon : "category"
            }
        ]
    }
    render(){
        return(
            <div>
                <RouteHeader details={this.routeHeader} />
                <Switch>
                    <Route exact path="/company">
                        <ProductTable />
                    </Route>
                    <Route exact path="/company/add-company">
                        <AddCompany />
                    </Route>
                </Switch>
            </div>                        
        )
    }
}

export default Company;