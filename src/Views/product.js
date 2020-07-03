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
import ManageTable from "../components/manageTable";
import DetailsTable from "../components/collapseTable";

function Product() {
    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    
   useEffect(() => {
        setHeaderSubtitile(location[2]);
        if(location.length <= 2){
            setHeaderSubtitile(location[1]);

        }
    }, [location]);

    const [columns,] = useState([
                        { title: 'Product Name', field: 'productName' },
                        { title: 'Product Code', field: 'productCode' },
                        { title: 'Product Type', field: 'productCategoryName' },
                        { title: 'Product Quantity', field: 'productQuantity' },
                        { title: 'Total Purchase Price', field: 'productPrice' },
                        { title: 'Sales Price (per product)', field: 'salestPrice' },
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
          const res = await fetch(apiUrl+"Products/productWithCategories", requestOptions);
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


    useEffect(() => {
        FetchData();
    },[]);

    return(
        <div>
            <RouteHeader subTitle={headersubtitle} details={routeHeader} />
            <Switch>

                <Route exact path="/product">
                        <div style={{margin:20}}>
                            <DetailsTable 
                                fetchDetails={"Purchases/by-productId/"}
                                data={data} columns={columns}/>
                        </div>
                </Route>
                <Route exact path="/product/manage-product">
                <div style={{margin:20}}>
                            <ManageTable 
                                title="Manage Company" 
                                hasUnique={true}
                                uniqueKey="companyId" 
                                uniqueName="companyName" 
                                apiUrl="Products/productWithCategories" 
                                ondataChange={() => console.log()} 
                                data={{ columns : columns , data : data}}
                                
                            />
                        </div>
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