import React, { useState, useEffect } from "react";
import {
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import RouteHeader from '../components/routeHeader';
import apiUrl from "../utils/apiInfo";
import NewSales from "./newSales";
import TodaysReport from "../components/todaysReport";
import HistoryVisual from "../components/historyWithVisualization";
import submitForm from "../utils/fetchApi";
import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined';
import { green } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import { Box, Button, Chip, Grid, Snackbar, TextField, Typography } from "@material-ui/core";
import MaterialUIPickers from "../components/datePicker";
import MaterialTable from "material-table";
import { updateSalesFormFields } from "../utils/appFormsFileds";
import Form from "../components/form";
import Alert from "@material-ui/lab/Alert";
import FullWidthTabs from "../components/tab";
import { useReactToPrint } from 'react-to-print';
import { useRef } from "react";
import { exportCsv } from '../utils/apiInfo.js';

function CustomPaidStatus (props) {
    return (
        <div>
            {
                props.status ? 
                    <DoneOutlineOutlinedIcon style={{ color: green[500] }}/> :
                    <CloseIcon color='error' />
            }
        </div>
    )
}

function Sales () {

    const [reportTabs,setReportTabs] = useState(0);
    const [showHistoryVisual,setShowHistoryVisual] = useState(true);
    const [data,setData] = useState([]);
    const [unchangeData,setUnchangeData] = useState([]);

    let location = useLocation().pathname.split("/");
    const [ headersubtitle , setHeaderSubtitile] = useState(location[1]);
    const [fromDate,setFromDate] = useState("");
    const [toDate,setToDate] = useState("");

    const [salesReport,setSalesReport] = useState({});
    const [reportItems,setReportItems] = useState([]);
    const [reportOptions,setReportOptions] = useState({});
    const [salesTab,setSalesTab] = useState(0);
    const [openSnackbar,setOpenSnackbar] = useState(false);

    const printComponent = useRef();

    useEffect(() => {
        let filterValue = [];
        switch (reportTabs) {
            case 0:
                filterValue = unchangeData;
                FetchReportByDate("");
                break;
            case 1 :
                filterValue = unchangeData.filter(sales => 
                    new Date(parseInt(sales.salesDate)).getDate() === new Date().getDate() && 
                    new Date(parseInt(sales.salesDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(sales.salesDate)).getFullYear() === new Date().getFullYear() 

                );
                FetchReportByDate(new Date().getTime());
                break;
            case 2 :
                filterValue = unchangeData.filter(sales => 
                    new Date(parseInt(sales.salesDate)).getDate() === new Date().getDate() -1 && 
                    new Date(parseInt(sales.salesDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(sales.salesDate)).getFullYear() === new Date().getFullYear() 
                );
                FetchReportByDate(new Date().getTime()-86400000);
                break;
            case 3:
                filterValue = unchangeData.filter(sales => 
                    new Date(parseInt(sales.salesDate)).getDate() >= new Date().getDate()-2 &&
                    new Date(parseInt(sales.salesDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(sales.salesDate)).getFullYear() === new Date().getFullYear() 
                );
                FetchReport(2);
                break;
            case 4:
                filterValue = unchangeData.filter(sales => 
                    new Date(parseInt(sales.salesDate)).getDate() >= new Date().getDate()-6 &&
                    new Date(parseInt(sales.salesDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(sales.salesDate)).getFullYear() === new Date().getFullYear() 
                );
                FetchReport(6);
                break;
                
            case 5:
                filterValue = unchangeData.filter(sales => 
                    new Date(parseInt(sales.salesDate)).getDate() >= new Date().getDate()-29 &&
                    new Date(parseInt(sales.salesDate)).getMonth() === new Date().getMonth() && 
                    new Date(parseInt(sales.salesDate)).getFullYear() === new Date().getFullYear() 
                );
                FetchReport(29);
                break;
            case 6:
                if(fromDate > toDate){
                    alert("Starting date cannot larger than Last Date");
                }
                break;
            default:
                break;
        }
        var dateFormatData = JSON.parse(JSON.stringify(filterValue)) ; 
   
        setData(dateFormatData);
    },[reportTabs])

    const FetchReportByDateRange = (date1,date2) => {
        submitForm("Report/sales-report-range/"+date1+"-"+date2,"GET",'',(res) => setSalesReport(JSON.parse(res)));
    }

    useEffect(() => {
        if (reportTabs === 6){
            if(fromDate > toDate){
                alert("Starting date cannot larger than Last Date");
            }else{
                FetchSalesByDateRange();
                FetchReportByDateRange(fromDate,toDate);
            }    
        }
    },[fromDate]);

    useEffect(() => {
        if( reportTabs === 6){
            if(fromDate > toDate){
                alert("Starting date cannot larger than Last Date");
            }else{
                FetchSalesByDateRange();
                FetchReportByDateRange(fromDate,toDate);
            }    
        }
    },[toDate]);
    
    useEffect(() => {
        setHeaderSubtitile(location[2]);
        if(location.length <= 2){
            setHeaderSubtitile(location[1]);
        }
        if(location[2] === "sales-memo" || location[2] === "new-sales"){
            setShowHistoryVisual(false);
        }else{
            setShowHistoryVisual(true);
        }
    }, [location]);

    const [columns,] = useState([
                        { title: 'Sales ID', field: 'salesId', },
                        { title: 'Customer Name', field: 'customerName', },
                        { title: 'Total Sales Price', field: 'salesPrice' ,type : 'numeric'},
                        { title: 'Total Payment Amount', field: 'salesPaymentAmount' ,type : 'numeric'},
                        { 
                            title: 'Sales Date', 
                            field: 'salesDate',
                            render : rowData => new Date(parseInt(rowData.salesDate)).toDateString()
                        },
                        // { title: 'Sales Payment Amount', field: 'salesPaymentAmount' },
                        // { 
                        //     title: 'Sales Product Due Status', 
                        //     field: 'productDueStatus' , 
                        //     render : rowData =>  <CustomPaidStatus status={rowData.productDueStatus===0 ? true : false}/>
                        // },
                        { 
                            title: 'Due Payment Amount', 
                            field: 'salesPaidStatusCustom' ,
                            render : rowData => rowData.salesPaidStatus ?   <Alert severity='success'>
                                                                                <Chip 
                                                                                    color="primary"
                                                                                    label={"Paid"}
                                                                                    clickable />
                                                                            </Alert>
                                                                        :   <Chip 
                                                                                color='secondary'
                                                                                label={rowData.salesPrice-rowData.salesPaymentAmount}
                                                                                clickable />
                        },
                        
                    ]);
    
    const FetchSalesByDateRange = () => {
        submitForm(`Sales/sales-by-range/${fromDate}-${toDate}`,'GET','',res => setData(JSON.parse(res)));
    }
    const FetchData = async () => {

        try {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
    
          var requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: 'follow'
          };
          const res = await fetch(apiUrl+"Sales", requestOptions);
          const json = await res.json();
          setUnchangeData(json);
          var dateFormatData = JSON.parse(JSON.stringify(json)) ; 
          dateFormatData.map(sales => sales.salesDateCustom = new Date(parseInt(sales.salesDate)).toDateString());
          dateFormatData.map(sales => sales.salesDuePaymentDateCustom = new Date(parseInt(sales.salesDuePaymentDate)).toDateString());
          
          setData(dateFormatData);
        } catch (error) {
          console.log("error - ", error);
        }
    };
    
    let routeHeader = {
        title : "Sales",
        subTitle : headersubtitle,
        icon : "storefront",
        breadCrumbs : [
            {
                title : "Sales",
                icon : "storefront"
            },
            {
                title : "All Sales",
                icon : "category"
            }
        ]
    }
    

    const FetchReport = (days) => {
        let valDays = [];
        for (let i = 1; i <= days;i++ ){
            valDays.push(new Date(new Date().getTime() - 86400000*i ).toLocaleDateString());
        }
        submitForm("Report/sales-report-all","GET","",(res) =>{
            let allRes = JSON.parse(data);
            let data = allRes.salesRate.filter(p => valDays.includes(p.date));
            let salesDueData = allRes.totalSalesProductDue.filter(p => valDays.includes(p.sales.salesDate));

            let totalSalesProduct ;
            let totalSalesPrice ;
            let totalSalesPaymentDue ;
            data.salesRate.map(d => {
                const unique = [...new Set(d.data.map(item => item.productId))]; // [ 'A', 'B']
                totalSalesProduct += unique.length;
                totalSalesPrice += d.salesPrice;

                if(!d.salesPaidStatus){
                    totalSalesPaymentDue += 1;               
                }
            });

            let report = {
                "totalProductSales": totalSalesProduct,
                "totalSalesPrice": totalSalesPrice,
                "totalSalesProductDue": salesDueData,
                "totalSalesPaymentDue": totalSalesPaymentDue,
                salesRate : data.salesRate
            }
            setSalesReport(report);
        });
    }

    const FetchReportByDate = (date) => {
        submitForm("Report/sales-report/"+date,"GET","",(res) => setSalesReport(JSON.parse(res)));
    }

    const FetchAlls = () => {
        FetchData();
        FetchReportByDate("");
    }

    useEffect(() => {
        FetchAlls();
    },[headersubtitle])

    let tabs = [
        {
            tab : "All",
            tabPanel : <TodaysReport items={reportItems} options={reportOptions}  />
        },
        {
            tab : "Todays Report",
            tabPanel : <TodaysReport items={reportItems} options={reportOptions}  />
        },
        {
            tab : "Yesterdays Report",
            tabPanel : <TodaysReport items={reportItems} options={reportOptions}  />
        },
        {
            tab : "Last 3 Days",
            tabPanel : <TodaysReport items={reportItems} options={reportOptions}  />
        },
        {
            tab : "This week",
            tabPanel : <TodaysReport items={reportItems} options={reportOptions}  /> 
        },
        {
            tab : "This Month",
            tabPanel : <TodaysReport items={reportItems} options={reportOptions}  />
        },
        {
            tab : "Jump To",    
            tabPanel :  
                        <div>
                            <Grid
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
                            <TodaysReport items={reportItems} options={reportOptions}  />
                        </div>
        },

    ];



    useEffect(() => {
        setReportItems([
            {
                name : "Total Product Sales",
                count : salesReport.totalProductSales,
                icon : "supervisor_account"
            },
            {
                name : "Total Sales Price",
                count : salesReport.totalSalesPrice,
                icon : "storefront"
            },
            {
                name : "Total Sales Product Due",
                count : salesReport.totalSalesProductDue,
                icon : "shop_two"
            },{
                name : "Total Sales Payment Due",
                count : salesReport.totalSalesPaymentDue,
                icon : "account_balance_wallet"
            },
            // {
            //     name : "Total Sales Product Due",
            //     count : 12,
            //     icon : "shopping_basket"
            // },{
            //     name : "Total Sales Payment Due",
            //     count : 189,
            //     icon : "credit_card"
            // }
        ]);
        let dataPoints = [];

        if(salesReport.salesRate){
            salesReport.salesRate.map( p => {
                let label = "";
                if (new Date().toLocaleDateString() === p.date){
                    label = "Today's Sales"
                }
                dataPoints.push({ label: p.date,  y: p.count  ,indexLabel : label});
            })
        }
        
        setReportOptions({
            animationEnabled: true,
            exportEnabled: true,
            theme: "dark2", //"light1", "dark1", "dark2"
            title:{
                text: "Product Sales Rate"
            },
            data: [
                {
                    type: "column", //change type to bar, line, area, pie, etc
                    //indexLabel: "{y}", //Shows y value on all Data Points
                    indexLabelFontColor: "#5A5757",
                    indexLabelPlacement: "outside",
                    dataPoints: dataPoints
                },
                {
                    type: "line",
                    name: "Sales Rate",
                    showInLegend: true,
                    yValueFormatString: "$#,##0",
                    dataPoints: dataPoints 
    
                },
            ]
        });

    },[salesReport]);
    const detailsPane = rowData => {
        let  overViewItems  = [
            ,{
                name : "Purchase Price - per",
                count : rowData.perProductPurchasePrice + " tk",
                icon : "money"
            },
            {
                name : "Pre Sales Price - per",
                count : rowData.salestPrice + " tk",
                icon : "money"
            }
            ,{
                name : "Sales Price - per",
                count : rowData.salesPrice/rowData.productQuantity + " tk",
                icon : "money"
            },
            {
                name : "Sales Discount - total",
                count : rowData.salesDiscount + " tk",
                icon : "money"
            },
            {
                name : "Total Sales Price",
                count : rowData.perProductPurchasePrice * rowData.productQuantity+" tk",
                icon : "money"
            },
            {
                name : "Total Sales Price",
                count : rowData.salesPrice+" tk",
                icon : "money"
            }
            ,
            {
                name : "Total Profit",
                count : (rowData.perProductSalesPrice - rowData.perProductPurchasePrice)*rowData.productQuantity + " tk",
                icon : "money"
            }
        ];
        return overViewItems;
    }
    const handlePrint = useReactToPrint({
        content: () => printComponent.current,
    });

    const tabsSales = [
        {
            tab : "All Customer Sales ",
            tabPanel :  ''
        },
        // {
        //     tab : "All Order Sales ",
        //     tabPanel :  ''
        // }
    ];

    const handleSalesTab = (v) => {
        setSalesTab(v);
    }

    return(
            <div>
                <RouteHeader subTitle={headersubtitle} details={routeHeader} />
                {
                    showHistoryVisual && 
                        <HistoryVisual hasTabPanel={true} handleTabs={setReportTabs} tabs={tabs}/>
                }
                <Switch>

                    <Route exact path="/sales/new-sales">
                        <NewSales />
                    </Route>
                    <Route path="/sales">
                        <FullWidthTabs onChangeTab={handleSalesTab} tabs={tabsSales}/>
                        <div style={{margin:20}}>
                            {
                                salesTab === 0 ? <MaterialTable
                                                    title="Manage Customer Sales"
                                                    columns={columns}
                                                    data={data}
                                                    options={{exportButton:true,exportCsv}}
                                                    detailPanel={rowData => {

                                                        let payment = 0;
                                                        let dueAmount = rowData.salesPrice - rowData.salesPaymentAmount;
                                                        const handlePayment = (e) => {
                                                            let value = parseFloat(e.target.value);
                                                            if(value>dueAmount){
                                                                payment = value;
                                                                alert('Payment amount cannot larger than due amount');
                                                                return;
                                                            }
                                                            payment = value;
                                                        }
                                                        const updatePayment = () => {
                                                            if(parseFloat(payment)>dueAmount){
                                                                payment = 0
                                                                alert('Payment amount cannot larger than due amount');
                                                                return;
                                                            }
                                                            let paymentSaleseHis = {
                                                                salesId : rowData.salesId,
                                                                paymentSalesDate : new Date().getTime().toString(),
                                                                paymentAmount : parseFloat(payment),
                                                            }
                                                        
                                                            submitForm("sales/sales-payment-due/"+ 
                                                                rowData.salesId+"-"+payment,"PUT","",(res) => {
                                                                    submitForm("Paymentsales","POST",paymentSaleseHis, (res) => {
                                                                        setOpenSnackbar(true);
                                                                        FetchData();
                                                                    });
                                                                }
                                                            );
                                                        }
                                                        return (
                                                            <Box ref={printComponent} style={{padding: 20}}>
                                                                <Form salesData={rowData} onSubmit={() => console.log(3)}  fields={updateSalesFormFields}/>
                                                                {
                                                                    rowData.salesPaidStatus ? (
                                                                        <Box style={{padding:20,marginLeft: 320,marginRight: 350}}>
                                                                            <Alert severity="success">
                                                                                <Typography variant={"h4"} style={{textAlign : 'center',color : green['A700']}}>Paid Customer</Typography>
                                                                            </Alert>
                                                                        </Box>
                                                                    ) : (
                                                                        <Grid
                                                                            style={{margin:20,marginBottom : 20}}
                                                                            container
                                                                            direction='row'
                                                                            justify='center'
                                                                            >
                                                                            <Grid item xs={6} spacing={3}>
                                                                                <TextField
                                                                                    onChange={handlePayment} 
                                                                                    label="Due Sales Payment Amount"

                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={6} style={{padding: 5}}>
                                                                                <Typography>Payment Due : {dueAmount}</Typography>
                                                        
                                                                            </Grid>
                                                                            <Grid item xs={10}>

                                                                            </Grid>
                                                                            <Grid item xs={2}>
                                                                                <Button 
                                                                                    onClick={updatePayment}
                                                                                    variant='contained' 
                                                                                    color='primary'>Make Payment</Button>
                                                                            </Grid>
                                                                        </Grid>
                                                                       
                                                                    )
                                                                }
                                                                <Button variant='contained' onClick={handlePrint}  color='primary'>Print Sales</Button>
                                                            </Box>
                                                        )
                                                    }}
                                                /> : (
                                                    <MaterialTable
                                                        title="Manage Order Sales"
                                                        columns={columns}
                                                        data={data}
                                                        options={{exportButton:true,exportCsv}}
                                                        detailPanel={rowData => {
                                                            let payment = 0;
                                                            let dueAmount = rowData.salesPrice - rowData.salesPaymentAmount;
                                                            const handlePayment = (e) => {
                                                                let value = parseFloat(e.target.value);
                                                                if(value>dueAmount){
                                                                    payment = 0
                                                                    alert('Payment amount cannot larger than due amount');
                                                                    return;
                                                                }
                                                                payment = value;
                                                            }
                                                            const updatePayment = () => {
                                                                let paymentSaleseHis = {
                                                                    salesId : rowData.salesId,
                                                                    paymentSalesDate : new Date().getTime().toString(),
                                                                    paymentAmount : parseFloat(payment),
                                                                }
                                                            
                                                                submitForm("sales/sales-payment-due/"+ 
                                                                    rowData.salesId+"-"+payment,"PUT","",(res) => {
                                                                        submitForm("Paymentsales","POST",paymentSaleseHis, (res) => {
                                                                            alert('Update');
                                                                            FetchData();
                                                                        });
                                                                    }
                                                                );
                                                            }
                                                            return (
                                                                <Box style={{padding: 20}}>
                                                                    <Form salesData={rowData} onSubmit={() => console.log(3)}  fields={updateSalesFormFields}/>
                                                                    {
                                                                        rowData.salesPaidStatus ? (
                                                                            <Box style={{padding:20,marginLeft: 320,marginRight: 350}}>
                                                                                <Alert severity="success">
                                                                                    <Typography variant={"h4"} style={{textAlign : 'center',color : green['A700']}}>Paid Customer</Typography>
                                                                                </Alert>
                                                                            </Box>
                                                                        ) : (
                                                                            <Grid
                                                                                style={{margin:20,marginBottom : 20}}
                                                                                container
                                                                                direction='row'
                                                                                justify='center'
                                                                                >
                                                                                <Grid item xs={6} spacing={3}>
                                                                                    <TextField
                                                                                        onChange={handlePayment} 
                                                                                        label="Sales Payment Amount"

                                                                                    />
                                                                                </Grid>
                                                                                <Grid item xs={6} style={{padding: 5}}>
                                                                                    <Typography>Payment Due : {dueAmount}</Typography>
                                                            
                                                                                </Grid>
                                                                                <Grid item xs={10}>

                                                                                </Grid>
                                                                                <Grid item xs={2}>
                                                                                    <Button 
                                                                                        onClick={updatePayment}
                                                                                        variant='contained' 
                                                                                        color='primary'>Make Payment</Button>
                                                                                </Grid>
                                                                            </Grid>
                                                                        )
                                                                    }
                                                                    <Button variant='contained' onClick={handlePrint}  color='primary'>Print Sales</Button>
                                                                </Box>
                                                            )
                                                        }}
                                                        />
                                                )
                            }
                            
                        </div>
                    </Route>
                </Switch>

                <Snackbar 
                    open={openSnackbar} 
                    autoHideDuration={6000} 
                    onClose={() => setOpenSnackbar(false)}
                >
                    <Alert onClose={() => setOpenSnackbar(false)} variant="filled" severity="success">
                        Succesfully Update Sales Payment !
                    </Alert>
                </Snackbar>
            </div>                        
        )
    
}

export default Sales;