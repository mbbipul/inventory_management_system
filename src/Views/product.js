import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';

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
                    <h3>Please select a topic.</h3>
                    </Route>
                    <Route path={'${this.props.match}/topicId'}>
                        Hello world
                    </Route>
                </Switch>
            </div>                        
        )
    }
}

export default Product;