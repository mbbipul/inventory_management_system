import React from "react";
import {
  Switch,
  Route,
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import ProductTable from '../components/productTable';
import AddProduct from "./addProduct";

class Product extends React.Component {

    routeHeader = {
        title : "Product",
        subTitle : "All Products",
        icon : "storefront",
        breadCrumbs : [
            {
                title : "Product",
                icon : "storefront"
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
                    <Route exact path="/product">
                        <ProductTable />
                    </Route>
                    <Route exact path="/product/add-product">
                        <AddProduct />
                    </Route>
                </Switch>
            </div>                        
        )
    }
}

export default Product;