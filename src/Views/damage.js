import React, { useState, useEffect } from "react";
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import ProductTable from '../components/productTable';
import ManageTable from "../components/manageTable";
import submitForm from "../utils/fetchApi";
import AddDamage from "./addDamage";
import FullWidthTabs from "../components/tab";
import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined';
import { green } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import { Button } from "@material-ui/core";

function Damage () {

    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    const [damageManageTab,setTab] = useState(0);

    useEffect(() => {
        setHeaderSubtitile(location[2]);
        if(location.length <= 2){
            setHeaderSubtitile(location[1]);

        }
    }, [location]);

    const markAsSentToCom = (rowData) => {
        rowData['damageSentToCompanyStatus'] = 'sentToCompany';
        submitForm('Damages/'+rowData.damageId,"PUT",rowData,() => FetchData('added'));
    }

    const columns = [
                        { title: 'Damage Id', field: 'damageId' },
                        { title: 'Customer Name', field: 'customerName' },
                        { title: 'Product Name', field: 'productName' },
                        { title: 'Supplier Name', field: 'supplierName' },
                        { title: 'Employee Name' , field: 'employeeName'},
                        { title: 'Damage Product Quantity' , field: 'productQuantity'},
                        { title: 'Damage Product Amount' , field: 'damageProductAmount'},
                        { 
                            title: 'Mark As Damage Product Sent To Company' , 
                            field: 'markAsDamage',
                            render: rowData => <Button onClick={() => markAsSentToCom(rowData)}>
                                {rowData.markAsDamage}
                            </Button>

                        }
                    ];
    const [data,setData] = useState([]);
    
    const FetchData =  (path) => {
        submitForm("Damages/filter/"+path+"/","GET","",(res) => setData(JSON.parse(res)));
    };
    
    let routeHeader = {
        title : "Damage",
        subTitle : headersubtitle,
        icon : "remove_shopping_cart",
        breadCrumbs : [
            {
                title : "Damage",
                icon : "remove_shopping_cart"
            },
            {
                title : "All Damage",
                icon : "category"
            }
        ]
    }
    

    const FetchDataByKeys = () => {
        
    }

    useEffect(() => {
        switch (damageManageTab) {
            case 0:
                FetchData('added');
                break;
            case 1:
                FetchData('sentToCompany');
                break;
            default:
                break;
        }
    },[damageManageTab]);

    useEffect(() => {
        FetchData('added');
    },[headersubtitle]);
  


    const CustomTableColoumn = (props) => {

        return (
            <DoneOutlineOutlinedIcon style={{ color: green[500] }}/> 
        )
    }

    useEffect(() => {
        data.map((d) => {
            d.markAsDamage = <CustomTableColoumn/>
            return d;
        });
    },[data]);

    const tabs = [
        {
            tab : "New Damages",
            tabPanel : <div style={{margin:20}}>
                            <ManageTable 
                                title="Manage damage" 
                                hasUnique={true}
                                apiInfo="Damages" 
                                uniqueKey="damageId" 
                                uniqueName="damageId" 
                                apiUrl="Damages/filter/added/" 
                                editable={true}
                                onChangeData={() => FetchData('added')} 
                                data={data} 
                                columns={columns}
                                
                            />
                        </div>
        },
        {
            tab : "Damages Sent To Company",
            tabPanel : <div style={{margin:20}}>
                            <ManageTable 
                                title="Manage damage" 
                                hasUnique={true}
                                apiInfo="Damages" 
                                uniqueKey="damageId" 
                                uniqueName="damageId" 
                                apiUrl="Damages/filter/sentToCompany/" 
                                editable={true}
                                onChangeData={() => FetchData('sentToCompany')} 
                                data={data} 
                                columns={columns}
                                
                            />
                        </div>
        },
        {
            tab : "Damages Return From Company",
            tabPanel : "tab1"
        },
    
    ];

    return(
        <div>
            <RouteHeader subTitle={headersubtitle} details={routeHeader} />
            <Switch>
                <Route exact path="/damage">
                    <div style={{margin:20}}>
                        <ProductTable 
                            title="All Damages"
                            apiUrl="Damages/filter/added" 
                            data={{ columns : columns , data : data}}/>
                    </div>
                </Route>
                <Route exact path="/damage/add-damage">
                    <AddDamage />
                </Route>
                <Route exact path="/damage/manage-damage">
                    <FullWidthTabs tabs={tabs} onChangeTab={(value) => setTab(value)}/>
                   
                </Route>
            </Switch>
        </div>                        
    )
    
}

export default Damage;