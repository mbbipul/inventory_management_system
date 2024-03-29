import React, { useState, useEffect } from "react";
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import ManageTable from "../components/manageTable";
import submitForm from "../utils/fetchApi";
import AddDamage from "./addDamage";
import FullWidthTabs from "../components/tab";
import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined';
import { green } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import { Button, Chip, Grid, Snackbar } from "@material-ui/core";
import { addReturnDamageFormFileds } from "../utils/appFormsFileds";
import CustomizedDialogs from "../components/formDialog";
import Form from "../components/form";
import Alert from "@material-ui/lab/Alert";
import HistoryVisual from "../components/historyWithVisualization";
import MaterialUIPickers from "../components/datePicker";
import MaterialTable from "material-table";

function Damage () {

    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    const [damageManageTab,setTab] = useState(0);
    const [openDialog,setOpenDialog] = useState(false);
    const [damage,setDamage] = useState({});
    const [openSnackbar,setOpenSnackbar] = useState(false);
    const [snackText,setSnackText] = useState('');
    const [snackSeverity,setSnackSeverity] = useState('success');
    const [,setUpdateQuanDialog] = useState(false);
    const [openUpdateProductAmount,setUpdateAmoDialog] = useState(false);

    const [openUpdateDamageProductDelivery,setDamageDeliveryUpdate] = useState(false);
    const [damageDeliveryProduct,setDamageDeliveryProduct] = useState(null);

    const [reportTabs,setReportTabs] = useState(0);
    const [fromDate,setFromDate] = useState("");
    const [toDate,setToDate] = useState("");
    const [data,setData] = useState([]);
    const [showHisVis,setHisVis] = useState(true);

    useEffect(() => {
        setHeaderSubtitile(location[2]);
        if(location.length <= 2){
            setHeaderSubtitile(location[1]);

        }
    }, [location]);

    const markAsSentToCom = (rowData) => {
        setDamageDeliveryProduct(rowData);
        setDamageDeliveryUpdate(true);
    }

    const markAsRetrunFromCom = (rowData) => {
        setDamage(rowData);
        setOpenDialog(true);
        // submitForm('Damages/'+rowData.damageId,"PUT",rowData,() => FetchData('returnFromCompany'));
    }

    
    const columns = [
                        { title: 'Damage Id', field: 'damageId' },
                        { title: 'Customer Name', field: 'customerName' },
                        { title: 'Product Name', field: 'productName' },
                        { title: 'Supplier Name', field: 'supplierName' },
                        { title: 'Employee Name' , field: 'employeeName'},
                        { title: 'Damage Product Quantity' , field: 'productQuantity'},
                        { title: 'Damage Product Amount' , field: 'damageProductAmount'},
                       
                    ];

    const renderDSentComStatus = (status) => {
        switch (status) {
            case 'added':
                return 'New Damage ';
            case 'sendingToCompany':
                return 'Sending To Company...';
            case 'sentToCompany':
                return 'Damage Sent To company';
            case 'returnFromCompany':
                return 'Damage Return From company';
            case 'recievingFromCompany':
                return '...Damage Returning From company';
            case 'recievingFromCompanyWithSendings' :
                return '...Damage Sending and Returning - company ...';
            default:
                return ;
        }
    }
    const damagesCol = [...columns];
    damagesCol.push(
      
        {
            title: 'Damage Return Date' , 
            field: 'damageRetDate',
            render: rowData =>  new Date(parseInt(rowData.damageRetDate)).toDateString()
        },
        { 
            title: 'Damage Status' , 
            field: 'damageSentToCompanyStatus',
            render: rowData =>  <Chip 
                                    color="primary"
                                    label={renderDSentComStatus(rowData.damageSentToCompanyStatus)}
                                    clickable />
        },
        {
            title: 'Damage Sent To Company Date' , 
            field: 'damageSentToCompanyDate',
            render: rowData =>rowData.damageSentToCompanyDate !== null &&  new Date(parseInt(rowData.damageSentToCompanyDate)).toDateString()
        },
        {
            title: 'Damage Return From Company Date' , 
            field: 'damageRetFromCompanyDate',
            render: rowData => rowData.damageRetFromCompanyDate !== null && new Date(parseInt(rowData.damageRetFromCompanyDate)).toDateString()
        },
        {
            title: 'Damage Return From Company Product Quantity ' , 
            field: 'damageRetComProQuantity',
            render: rowData =>  <Chip 
                                    color="primary"
                                    label={rowData.damageRetComProQuantity}
                                    clickable />
        },
        {
            title: 'Damage Return From Company Amount ' , 
            field: 'damageRetFromComAmount',
            render: rowData =>  <Chip 
                                    color="primary"
                                    label={rowData.damageRetFromComAmount}
                                    clickable />
        },
        {
            title: ' Damage Return From Company Due Date' , 
            field: 'damgeReturnCompanyDueDate',
            render: rowData => rowData.damgeReturnCompanyDueDate !== null &&  new Date(parseInt(rowData.damgeReturnCompanyDueDate)).toDateString()
           

        },
        {
            title: 'Damage Return From Company Product Due Status' , 
            field: 'damageRetComProQuantityDueStatus',
            render: rowData => rowData.damageRetComProQuantityDueStatus ? 
                                    <DoneOutlineOutlinedIcon style={{ color: green[500] }}/> :
                                    <CloseIcon color='error' />
        },
        {
            title: 'Damage Return From Company Product Payment Due Status' , 
            field: 'damgeReturnCompanyDuePaymentStatus',
            render: rowData => rowData.damgeReturnCompanyDuePaymentStatus ? 
                                    <DoneOutlineOutlinedIcon style={{ color: green[500] }}/> :
                                    <CloseIcon color='error' />
           
        }


    )
    const newDamages = [...columns];

    newDamages.push( 
        { 
            title: 'Deliverd Damage Product Quantity' , 
            field: 'delDamProQuantity',
            render : rowData => <Chip 
                                    color="primary"
                                    label={rowData.delDamProQuantity}
                                    clickable />
        },
        { 
            title: 'Recieved Damage Product Quantity' , 
            field: 'recepDamProQuantity',
            render : rowData => <Chip 
                                    color="primary"
                                    label={rowData.recepDamProQuantity}
                                    clickable />
        },
        { 
            title: 'Damage Status' , 
            field: 'damageSentToCompanyStatus',
            render : rowData => <Chip 
                                    color="primary"
                                    label={renderDSentComStatus(rowData.damageSentToCompanyStatus)}
                                    clickable />
        },
        { 
            title: 'Mark As Damage Product Sent To Company' , 
            field: 'markAsDamage',
            render: rowData => <Button onClick={() => markAsSentToCom(rowData)}>
                {rowData.markAsDamage}
            </Button>
        }
    );

    const damagesSentToCom = [...columns];
    damagesSentToCom.push( 
        { 
            title: 'Deliverd Damage Product Quantity' , 
            field: 'delDamProQuantity',
            render : rowData => <Chip 
                                    color="primary"
                                    label={rowData.delDamProQuantity}
                                    clickable />
        },
        { 
            title: 'Recieved Damage Product Quantity' , 
            field: 'recepDamProQuantity',
            render : rowData => <Chip 
                                    color="primary"
                                    label={rowData.recepDamProQuantity}
                                    clickable />
        },
        { 
            title: 'Damage Status' , 
            field: 'damageSentToCompanyStatus',
            render : rowData => <Chip 
                                    color="primary"
                                    label={renderDSentComStatus(rowData.damageSentToCompanyStatus)}
                                    clickable />
        },
        { 
            title: 'Mark As Damage Product Return From Company' , 
            field: 'markAsReturn',
            render: rowData => <Button onClick={() => markAsRetrunFromCom(rowData)}>
                {rowData.markAsReturn}
            </Button>
        }
    );

    const damageReturnFromComCol = [...columns];
    damageReturnFromComCol.push(
        { 
            title: 'Deliverd Damage Product Quantity' , 
            field: 'delDamProQuantity',
            render : rowData => <Chip 
                                    color="primary"
                                    label={rowData.delDamProQuantity}
                                    clickable />
        },
        { 
            title: 'Recieved Damage Product Quantity' , 
            field: 'recepDamProQuantity',
            render : rowData => <Chip 
                                    color="primary"
                                    label={rowData.recepDamProQuantity}
                                    clickable />
        },
        {
            title: 'Damage Return From Company Product Due Quantity' , 
            field: 'damageRetComProQuantity',
            render: rowData => rowData.damageRetComProQuantityDueStatus ? 
                                    0 : rowData.productQuantity - rowData.damageRetComProQuantity
                                    
        },
        {
            title: 'Damage Return From Company Product Payment Due Amount' , 
            field: 'damgeReturnCompanyDuePaymentStatus',
            render: rowData => rowData.damgeReturnCompanyDuePaymentStatus ? 
                                    0 : rowData.damageProductAmount - parseFloat(rowData.damageRetFromComAmount)
           
        },
        {
            title: 'Damage Return From Company Product Due Status' , 
            field: 'damageRetComProQuantityDueStatus',
            render: rowData => rowData.damageRetComProQuantityDueStatus ? 
                                    <DoneOutlineOutlinedIcon style={{ color: green[500] }}/> :
                                    <CloseIcon color='error' />
        },
        {
            title: 'Damage Return From Company Product Payment Due Status' , 
            field: 'damgeReturnCompanyDuePaymentStatus',
            render: rowData => rowData.damgeReturnCompanyDuePaymentStatus ? 
                                    <DoneOutlineOutlinedIcon style={{ color: green[500] }}/> :
                                    <CloseIcon color='error' />
           
        }
    );
    
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
    

    useEffect(() => {
        switch (damageManageTab) {
            case 0:
                FetchData('damageNewTab');
                break;
            case 1:
                FetchData('damageSendToCompanyTab');
                break;
            case 2:
                FetchData('damageReturnFromCompanyTab');
                break;
            default:
                break;
        }
    },[damageManageTab]);

    const FetchDataByDate = (date) => {
        submitForm("Damages/by-date/"+date,"GET","",(res) => setData(JSON.parse(res)));
    }
    const FetchDataByDays = (days) => {
        submitForm("Damages/by-days/"+days,"GET","",(res) => setData(JSON.parse(res)));
    }
    const FetchDataAll = () => {
        submitForm("Damages","GET","",(res) => setData(JSON.parse(res)));
    }

    useEffect(() => {
        if(headersubtitle==='manage-damage'){
            FetchData('damageNewTab');
            setHisVis(false);
        }else if(headersubtitle==='add-damage'){
            setHisVis(false);
        }
        else{
            FetchDataAll();
            setHisVis(true);
        }
    },[headersubtitle]);
  
    useEffect(() => {
        switch (reportTabs) {
            case 0:
                FetchDataAll();
                break;
            case 1 :
                FetchDataByDate(Date.now());
                break;
            case 2 :
                FetchDataByDate(Date.now()-86400000 );
                break;
            case 3 :
                FetchDataByDays(3);
                break;
            case 4 :
                FetchDataByDays(7);
                break;
            case 5:
                FetchDataByDays(30);
                break;
            case 6:

                break;
            default:
                break;
        }
    },[reportTabs]);

    useEffect(() => {
        if (reportTabs === 6){
            if(fromDate > toDate){
                alert("Starting date cannot larger than Last Date");
            }else{
                submitForm("Damages/by-date-range/"+fromDate+"-"+toDate,"GET","",(res) => setData(JSON.parse(res)));
            }    
        }
    },[fromDate,toDate]);

    // useEffect(() => {
    //     if( reportTabs === 6){
    //         if(fromDate > toDate){
    //             alert("Starting date cannot larger than Last Date");
    //         }else{
    //             submitForm("Damages/by-date-range/"+fromDate+"-"+toDate,"GET","",(res) => setData(JSON.parse(res)));
    //         }    
    //     }
    // },[toDate]);

    const CustomTableColoumn = () => {

        return (
            <DoneOutlineOutlinedIcon style={{ color: green[500] }}/> 
        )
    }

    useEffect(() => {
        data.map((d) => {
            d.markAsDamage = <CustomTableColoumn/>
            d.markAsReturn = <CustomTableColoumn/>
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
                                apiUrl="Damages/filter/damageNewTab/" 
                                editable={false}
                                hideDelete={true}
                                onChangeData={() => FetchData('damageNewTab')} 
                                data={data} 
                                columns={newDamages}
                                
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
                                apiUrl="Damages/filter/damageSendToCompanyTab/" 
                                editable={false}
                                hideDelete={true}
                                onChangeData={() => FetchData('damageSendToCompanyTab')} 
                                data={data} 
                                columns={damagesSentToCom}
                                
                            />
                        </div>
        },
        {
            tab : "Damages Return From Company",
            tabPanel : <div style={{margin:20}}>
                            <MaterialTable 
                                title="Manage damage" 
                                hasUnique={true}
                                hideDelete={true}
                                apiInfo="Damages" 
                                uniqueKey="damageId" 
                                uniqueName="damageId" 
                                apiUrl="Damages/filter/damageReturnFromCompanyTab/" 
                                editable={false}
                                onChangeData={() => FetchData('damageReturnFromCompanyTab')} 
                                data={data} 
                                columns={damageReturnFromComCol}
                                
                            />
                        </div>
        },
    
    ];

    const updateDamageProductDelivery = (state) => {
        if(parseInt(state.DamageDelivertoCompanyProductQuantity) > damageDeliveryProduct.productQuantity - damageDeliveryProduct.delDamProQuantity  ){
            setSnackText("Damage Delivery Product Quantity cannot larger than Actual Damage Product Quantity");
            setSnackSeverity('error');
            setOpenSnackbar(true);
            return ;
        }
        let damageDeliver = {
            damageId : damageDeliveryProduct.damageId,
            deliveryDate : new Date().getTime().toString(),
            deliverProductQuantity : parseInt(state.DamageDelivertoCompanyProductQuantity)
        }

        submitForm('DamageDeliveryHistories',"POST",damageDeliver,(res) => {

            // let dmageDelPro = JSON.parse(res);
            let damage = JSON.parse(JSON.stringify(damageDeliveryProduct));

            damage['damageSentToCompanyStatus'] = 'sendingToCompany';
            damage['damageSentToCompanyDate'] = new Date().getTime().toString();
            
            submitForm('Damages/sentToCompany/'+damage.damageId,"PUT",damage,() => {
                setSnackText("Successfully Damage Delivery Product Quantity Updated!");
                setSnackSeverity('success');
                setOpenSnackbar(true);
                setDamageDeliveryUpdate(false);
                FetchData('damageNewTab');
            });
        });
    }
   
    const updateDamageProAmount = (state) => {
        if(parseInt(state.DamageReturnFromCompanyAmount) > damage.damageProductAmount - parseFloat(damage.damageRetFromComAmount)  ){
            setSnackText("Damage Return From Company Product Due Amount cannot larger than Actual Damage Product Amount");
            setSnackSeverity('error');
            setOpenSnackbar(true);
            return ;
        }

        let damgeReturnCompanyDuePaymentStatus = false;
        let amount = parseFloat(damage.damageRetFromComAmount) + parseFloat(state.DamageReturnFromCompanyAmount);

        if(damage.damageProductAmount === amount ){
            damgeReturnCompanyDuePaymentStatus = true;
        }


        damage.damgeReturnCompanyDuePaymentStatus = damgeReturnCompanyDuePaymentStatus;
        damage['damageRetFromComAmount'] = amount;

        submitForm('Damages/'+damage.damageId,"PUT",damage,() => {
            setSnackText('Successfully Update Return Damage Product Amount');
            setSnackSeverity('success');
            setOpenSnackbar(true);
            FetchData('damageReturnFromCompanyTab');
        });
    }

    const markAsDamageReturnFromCompany = (state) => {
        let checkProductQuan = damage.delDamProQuantity;

        if(damage.damageSentToCompanyStatus === "recievingFromCompanyWithSendings" || damage.damageSentToCompanyStatus === "recievingFromCompany" || damage.damageSentToCompanyStatus === "sentToCompany" ){
            checkProductQuan = damage.delDamProQuantity-damage.recepDamProQuantity;
        }
        
        if(parseInt(state.DamageReturnFromCompanyProductQuantity) > checkProductQuan  ){
            setSnackText("Damage Return From Company Product Quantity cannot larger than Delivered Damage Product Quantity");
            setSnackSeverity('error');
            setOpenSnackbar(true);
            return ;
        }
        
        if(parseInt(state.DamageReturnFromCompanyAmount) > damage.damageProductAmount  ){
            setSnackText("Damage Return From Company Product Amount cannot larger than Actual Damage Product Amount");
            setSnackSeverity('error');
            setOpenSnackbar(true);
            return ;
        }

        let damageRetComProQuantityDueStatus = false;
        let damgeReturnCompanyDuePaymentStatus = false;

        if (parseInt(state.DamageReturnFromCompanyProductQuantity) === damage.productQuantity){
            damageRetComProQuantityDueStatus = true;
        }

        if(parseInt(state.DamageReturnFromCompanyAmount) === damage.damageProductAmount  ){
            damgeReturnCompanyDuePaymentStatus = true;
        }

        damage['damageRetFromCompanyDate'] = new Date().getTime().toString();
        damage['damageRetFromComAmount'] = parseFloat(state.DamageReturnFromCompanyAmount);
        damage['damgeReturnCompanyDueDate'] = state.DamageReturnFromCompanyDueDate.toString();
        damage.damageRetComProQuantityDueStatus = damageRetComProQuantityDueStatus;
        damage.damgeReturnCompanyDuePaymentStatus = damgeReturnCompanyDuePaymentStatus;
        damage.damageRetFromComAmount = 0;

        let damgeRecieveHis = {
            damageId : damage.damageId,
            receptionDate : damage.damageRetFromCompanyDate,
            recievedProductQuantity : parseInt(state.DamageReturnFromCompanyProductQuantity)
        };

        submitForm('DamageReceptionHistories',"POST",damgeRecieveHis,(res) => {

            // let dmageDelPro = JSON.parse(res);
            // let damageAfterRec = JSON.parse(JSON.stringify(damage));

            damage['damageSentToCompanyStatus'] = 'recievingFromCompanyWithSendings';
            damage.damageRetComProQuantity += damgeRecieveHis.recievedProductQuantity
            console.log(damage);
            submitForm('Damages/receiveFromCompany/'+damage.damageId,"PUT",damage,() => {
                setSnackText('Successfully Damage Mark As Damage Return From Company');
                setSnackSeverity('success');
                setOpenSnackbar(true);
                setOpenDialog(false);
                FetchData('damageSendToCompanyTab');
            });
        });


    };

    const getFilterDataByDays = (days) => {

    }

    let hisTabs = [
        {
            tab : "All",
            tabPanel : ""
        },
        {
            tab : "Todays Report",
            tabPanel : ""
        },
        {
            tab : "Yesterdays Report",
            tabPanel :  <div style={{width:550,marginLeft:"25%"}}>
                fddffd
            </div>
        },
        {
            tab : "Last 3 Days",
            tabPanel :  <div style={{width:550,marginLeft:"25%"}}>
                fddffd
            </div>
        },
        {
            tab : "This week",
            tabPanel : "gffg" 
        },
        {
            tab : "This Month",
            tabPanel :  <div style={{width:550,marginLeft:"25%"}}>
                fddffd
            </div>
        },
        {
            tab : "Jump To",    
            tabPanel :  <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center">

                            <Grid item xs >
                                <strong>From</strong>
                                <MaterialUIPickers onChange={(date) => setFromDate(date)} />
                            </Grid>
                            <Grid style={{marginLeft:100}} item xs >
                                <strong>To</strong>
                                <MaterialUIPickers onChange={(date) => setToDate(date)} />
                            </Grid>
                        </Grid>
        },

    ];

    return(
        <div>
            <RouteHeader subTitle={headersubtitle} details={routeHeader} />
            
            {
                showHisVis &&  <HistoryVisual 
                                    hasTabPanel={false}
                                    handleTabs={setReportTabs} 
                                    tabs={hisTabs}/>
            }

            <CustomizedDialogs 
                title="Recieve Damage Return From Company"
                dialogContent={
                    <Form 
                        onSubmit={markAsDamageReturnFromCompany} 
                        submitButton="Mark Damage Retrun From Company" 
                        fields={addReturnDamageFormFileds}/>
                }
                changOpenProps={()=> setOpenDialog(false)}
                open={openDialog} 
            />

            <CustomizedDialogs 
                style={{width : 300}}
                title="Update Damage Product Send To Company"
                dialogContent={
                    <Form 
                        onSubmit={updateDamageProductDelivery} 
                        submitButton="Delivery Product Quantity" 
                        fields={[{
                            label : "Damage Deliver to Company Product Quantity",
                            placeholder : "1",
                            type : 0,
                            required : true,
                            disabled : false,
                            validation : [0]
                    }]}/>
                }
                changOpenProps={()=> setDamageDeliveryUpdate(false)}
                open={openUpdateDamageProductDelivery} 
            />

            <CustomizedDialogs 
                            title="Update Return Damage Product Amount"
                            dialogContent={
                                <Form 
                                    onSubmit={updateDamageProAmount} 
                                    submitButton="Update Product Amount" 
                                    fields={[ {
                                    label : "Damage Return From Company Amount",
                                    placeholder : "500.00 tk",
                                    type : 0,
                                    required : true,
                                    disabled : false,
                                    validation : [999]
                                }]}/>
                            }
                            changOpenProps={()=> setUpdateAmoDialog(false)}
                            open={openUpdateProductAmount} 
                        />

            <Snackbar 
                    open={openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={() => setOpenSnackbar(false)}
                >
                    <Alert onClose={() => setOpenSnackbar(false)} variant="filled" severity={snackSeverity}>
                        {snackText}
                    </Alert>
            </Snackbar>
            <Switch>
                <Route exact path="/damage">
                    <div style={{margin:20}}>
                        <MaterialTable
                            title="All Damages"
                            options={{exportButton: true}}
                            columns={damagesCol}
                            data={data} />
                    </div>
                </Route>
                <Route exact path="/damage/add-damage">
                    <AddDamage />
                </Route>
                <Route exact path="/damage/manage-damage">
                    <FullWidthTabs default={0} tabs={tabs} onChangeTab={(value) => setTab(value)}/>
                   
                </Route>
            </Switch>

          
        </div>                        
    )
    
}

export default Damage;