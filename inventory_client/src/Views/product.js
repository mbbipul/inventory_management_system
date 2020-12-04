import React ,{ useState, useEffect } from "react";
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import AddProduct from "./addProduct";
import Category from "./category";
import apiUrl from "../utils/apiInfo";
import ManageTable from "../components/manageTable";
import DetailsTable from "../components/collapseTable";
import { Chip } from "@material-ui/core";

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
                        {   
                            title: 'Product Quantity (In stock)', 
                            field: 'totalProductInStock' ,
                            render : rowData => rowData.totalProductInStock === 0 ?  <Chip 
                                                    color="secondary"
                                                    label="Product Out Of Stock"
                                                    clickable /> :
                                                <Chip 
                                                    color="primary"
                                                    label={rowData.totalProductInStock}
                                                    clickable /> 
                        },
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
          const res = await fetch(apiUrl+"Products", requestOptions);
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
    
    useEffect(() => {
        FetchData();
    },[headersubtitle])

    const detailsPane = rowData => {
        let totalPurchasePrice = rowData.purchases.map(s=>s.salesPrice).reduce((a,c)=>a+c);
        let totalSalesPrice = 0;
        if( rowData.saleses.length > 0){
            totalSalesPrice = rowData.saleses.map(s=>s.salesPrice).reduce((a,c)=>a+c)
        }

        let profit = 0;

        if (totalSalesPrice === 0) {
            profit = "Not sale yet";
        }else{
            profit = totalSalesPrice - totalPurchasePrice;
            if(profit<0){
                profit = "Loss Amount : " + Math.abs(profit) + " tk";
            }
        }
        let  overViewItems  = [{
            name : "Total Products",
            count : rowData.totalProducts,
            icon : "storefront"
        }
        ,{
          name : "Total Purchase Price",
          count : totalPurchasePrice +" tk" ,
          icon : "shop_two"
        },
        {
            name : "Total Sales Price",
            count : totalSalesPrice,
            icon : "shopping_basket"
        },
        {
            name : "Total Profit",
            count : profit,
            icon : "money"
        }];
        return overViewItems;
    }
    return(
        <div>
            <RouteHeader subTitle={headersubtitle} details={routeHeader} />
            <Switch>

                <Route exact path="/product">
                        <div style={{margin:20}}>
                            <DetailsTable 
                                apiUrl="Products/"  
                                detailsPane={detailsPane}
                                data={data} 
                                columns={columns}/>
                        </div>
                </Route>
                <Route exact path="/product/manage-product">
                <div style={{margin:20}}>
                            <ManageTable 
                                title="Manage Product" 
                                hasUnique={true}
                                apiInfo="Product"
                                uniqueKey="productId" 
                                uniqueName="productName" 
                                apiUrl="Products/" 
                                editable={false}
                                onChangeData={FetchData} 
                                data={data}
                                columns={columns}
                                
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