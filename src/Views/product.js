import React ,{ useState, useEffect } from "react";
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import ProductTable from '../components/productTable';
import AddProduct from "./addProduct";
import Category from "./category";
import apiUrl from "../utils/apiInfo";

function Product() {
    let location = useLocation().pathname.split("/");
   
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    
    useEffect(() => {
        setHeaderSubtitile(location[2]);
        if(location.length <= 2){
            setHeaderSubtitile(location[1]);

        }
    }, [location]);

    const [columns,setColumns] = useState([
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

                <Route exact path="/product">
                    <ProductTable />
                </Route>
                <Route exact path="/product/category">
                    <Category />
                </Route>
                <Route exact path="/product/add-product">
                    <AddProduct />
                </Route>
            </Switch>
        </div>                        
    )
    
}

export default Product;