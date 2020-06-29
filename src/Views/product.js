import React ,{ useState } from "react";
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import ProductTable from '../components/productTable';
import AddProduct from "./addProduct";
import Category from "./category";

function Product() {
    let location = useLocation().pathname.split("/");
   
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    React.useEffect(() => {
        setHeaderSubtitile(location[2])
     }, [location]);
    
    let routeHeader = {
        title : "Product",
        subTitle : headersubtitle,
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

    return(
        <div>
            <RouteHeader subTitle={headersubtitle} details={routeHeader} />
            <Switch>
                <Route exact path="/product/category">
                    <Category />
                </Route>
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

export default Product;