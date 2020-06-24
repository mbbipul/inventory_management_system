import React from "react";
import {
  Switch,
  Route,
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import ProductTable from '../components/productTable';
import AddSupplier from "./addSupplier";

class Supplier extends React.Component {

    routeHeader = {
        title : "Supplier",
        subTitle : "All Suppliers",
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
    render(){
        return(
            <div>
                <RouteHeader details={this.routeHeader} />
                <Switch>
                    <Route exact path="/supplier">
                        <ProductTable />
                    </Route>
                    <Route exact path="/supplier/add-supplier">
                        <AddSupplier />
                    </Route>
                </Switch>
            </div>                        
        )
    }
}

export default Supplier;