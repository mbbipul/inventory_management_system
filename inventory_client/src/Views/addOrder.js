import React, { useEffect, useState } from 'react';
import submitForm from '../utils/fetchApi';
import { Box, Card, Divider, Grid, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 2,
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      height: 510,
    },
    tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
    },
  }));
  
export default function AddOrder(){
    const classes = useStyles();
    const [dsrEmployee,setDsrEmployee] = useState([]);
    const [products,setProducts] = useState([]);
    const [tabValue, setTabValue] = React.useState(0);
    const [dsrOrderProducts,setDsrOrderProducts] = useState({});

    const columns = [
        'Product Name','Receive','Return','Sells','Damage','Rate','Total Sells (taka)'
    ];
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const parseIntR = (str) => {
        if(isNaN(parseInt(str))){
            return 0;
        }
        return parseInt(str);
    }

    const parseFloatR = (str) => {
        if(isNaN(parseFloat(str))){
            return parseFloat(0);
        }
        return parseFloat(str);
    }

    useEffect(() => {
        console.log(dsrOrderProducts);
    },[dsrOrderProducts]);

    const handleReceive = (e,i) => {
        const tmp = {...dsrOrderProducts};
        let tmpSingleObj = {};
        if(tmp[tabValue] && tmp[tabValue][i]){
            let sells = parseIntR(e.target.value) - parseIntR(tmpSingleObj.returnQ);
            tmpSingleObj = tmp[tabValue][i];
            tmp[tabValue][i] = {
                receive : parseIntR(e.target.value),
                returnQ : parseIntR(tmpSingleObj.returnQ) ,
                damage : tmpSingleObj.damage ,
                rate : tmpSingleObj.rate,
                sells : sells,
                totalSells : sells*parseFloatR(tmpSingleObj.rate)
            };
        }else{
            let sells = parseIntR(e.target.value);
            tmp[tabValue][i] = {
                receive : parseIntR(e.target.value),
                returnQ : 0 ,
                damage : 0 ,
                rate : parseFloatR(0),
                sells : sells,
                totalSells: 0
            };
        }
        setDsrOrderProducts(tmp);
        
    };
    const handleReturn = (e,i) => {
        const tmp = {...dsrOrderProducts};
        let tmpSingleObj = {};
        if(tmp[tabValue] && tmp[tabValue][i]){
            tmpSingleObj = tmp[tabValue][i];
            let sells = tmpSingleObj.receive - parseIntR(e.target.value);
            tmp[tabValue][i] = {
                receive : tmpSingleObj.receive,
                returnQ :  parseIntR(e.target.value) ,
                damage :tmpSingleObj.damage ,
                rate : tmpSingleObj.rate,
                sells : sells,
                totalSells : sells*parseFloatR(tmpSingleObj.rate)
            };
        }else{
            tmp[tabValue][i] = {
                receive : 0,
                returnQ : parseIntR(e.target.value) ,
                damage : 0 ,
                rate : 0,
                sells : parseFloatR(0),
                totalSells : 0
            };
        }
        if(tmp[tabValue][i].returnQ > tmp[tabValue][i].receive){
            alert('Product Return Quantity Cannot be larger than Product Recieve Quantity');
            tmp[tabValue][i].returnQ = '';
        }
        setDsrOrderProducts(tmp);
    };
    const handleRate = (e,i) => {
        const tmp = {...dsrOrderProducts};
        let tmpSingleObj = {};
        if(tmp[tabValue] && tmp[tabValue][i]){
            tmpSingleObj = tmp[tabValue][i];
            let sells = tmpSingleObj.receive - tmpSingleObj.returnQ;
            tmp[tabValue][i] = {
                receive : tmpSingleObj.receive,
                returnQ :  tmpSingleObj.returnQ ,
                damage :tmpSingleObj.damage ,
                rate : e.target.value,
                sells : sells,
                totalSells : sells*parseFloatR(e.target.value)
            };
        }else{
            tmp[tabValue][i] = {
                receive : 0,
                returnQ :  0,
                damage : 0 ,
                rate :e. target.value,
                sells: 0,
                totalSells: 0
            };
        }
        setDsrOrderProducts(tmp);
    };
    const handleDamage = (e,i) => {
        const tmp = {...dsrOrderProducts};
        let tmpSingleObj = {};
        if(tmp[tabValue] && tmp[tabValue][i]){
            tmpSingleObj = tmp[tabValue][i];
            let sells = tmpSingleObj.receive - tmpSingleObj.returnQ;
            tmp[tabValue][i] = {
                receive : tmpSingleObj.receive,
                returnQ :  tmpSingleObj.returnQ ,
                damage : parseIntR(e.target.value) ,
                rate : tmpSingleObj.rate,
                sells : sells,
                totalSells : sells*parseFloatR(tmpSingleObj.rate)
            };
        }else{
            tmp[tabValue][i] = {
                receive : 0,
                returnQ : 0 ,
                damage : parseIntR(e.target.value) ,
                rate : parseFloatR(0),
                sells : 0,
                totalSells : 0
            };
        }
        setDsrOrderProducts(tmp);
    };
    
    useEffect(() => {
        submitForm('employees','GET','', (res) => {
            const data = JSON.parse(res);
            data.map((v,i) => dsrOrderProducts[i] = {});
            setDsrEmployee(data);
        });
        submitForm('products','GET','',(res) => setProducts(JSON.parse(res)));
    },[]);

    return(
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Vertical tabs example"
                className={classes.tabs}
            >
            {
                dsrEmployee.map((item,i) => (
                    <Tab key={i} label={item.employeeName} {...a11yProps(i)} />
                ))
            }
            </Tabs>
            {
                dsrEmployee.map((item,i) => (
                    
                    <TabPanel value={tabValue} index={i}>
                        <Card>
                            <h3 style={{textAlign : 'center'}}>Order Product Info</h3>
                            <table className='form-table'>
                                <thead>
                                    <tr>
                                        {
                                            columns.map((item,i) => (
                                                <th key={i} className="form-table-th-td">
                                                    {item}
                                                </th>
                                            ))
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        products.map((item,i) => (
                                            <tr key={i}>
                                                
                                                <td className="form-table-th-td-center">
                                                    <Typography>{item.productName}</Typography> 
                                                </td>
                                                <td className="form-table-th-td-center">
                                                    <TextField 
                                                        key={i}
                                                        variant="outlined" 
                                                        value={dsrOrderProducts[tabValue] && dsrOrderProducts[tabValue][i] && dsrOrderProducts[tabValue][i].receive} 
                                                        onChange={(e) => handleReceive(e,i)}/>
                                                </td>
                                                <td className="form-table-th-td-center">
                                                    <TextField 
                                                        variant="outlined"
                                                        value={dsrOrderProducts[tabValue] && dsrOrderProducts[tabValue][i] && dsrOrderProducts[tabValue][i].returnQ}
                                                        onChange={(e) => handleReturn(e,i)} />
                                                </td>
                                                <td className="form-table-th-td-center">
                                                    <Typography>{dsrOrderProducts[tabValue] && dsrOrderProducts[tabValue][i] &&dsrOrderProducts[tabValue][i].sells}</Typography>
                                                </td>
                                                <td className="form-table-th-td-center">
                                                    <TextField 
                                                        variant="outlined"
                                                        value={dsrOrderProducts[tabValue] && dsrOrderProducts[tabValue][i] && dsrOrderProducts[tabValue][i].damage}
                                                        onChange={(e) => handleDamage(e,i)} />
                                                </td>
                                                <td className="form-table-th-td-center">
                                                    <TextField
                                                        variant="outlined" 
                                                        value={dsrOrderProducts[tabValue] && dsrOrderProducts[tabValue][i] && dsrOrderProducts[tabValue][i].rate}
                                                        onChange={(e) => handleRate(e,i)} />
                                                </td>
                                                <td className="form-table-th-td-center">
                                                    <Typography>{dsrOrderProducts[tabValue] && dsrOrderProducts[tabValue][i] && dsrOrderProducts[tabValue][i].totalSells}</Typography>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td className='form-table-th-td-center'>
                                            Total
                                        </td>
                                        <td className='form-table-th-td-center'>
                                            {
                                                Object.values(dsrOrderProducts[tabValue]).reduce(function(tot, arr) { 
                                                    return tot + arr.receive;
                                                },0)
                                            }
                                        </td>
                                        <td className='form-table-th-td-center'>
                                            {
                                                Object.values(dsrOrderProducts[tabValue]).reduce(function(tot, arr) { 
                                                    return tot + arr.returnQ;
                                                },0)
                                            }
                                        </td>
                                        <td className='form-table-th-td-center'>
                                            {
                                                Object.values(dsrOrderProducts[tabValue]).reduce(function(tot, arr) { 
                                                    return tot + arr.sells;
                                                },0)
                                            }
                                        </td>
                                        <td className='form-table-th-td-center'>
                                            {
                                                Object.values(dsrOrderProducts[tabValue]).reduce(function(tot, arr) { 
                                                    return tot + arr.damage;
                                                },0)
                                            }
                                        </td>
                                        <td className='form-table-th-td-center'>
                                            
                                        </td>
                                        <td className='form-table-th-td-center'>
                                            {
                                                Object.values(dsrOrderProducts[tabValue]).reduce(function(tot, arr) { 
                                                    return tot + arr.totalSells;
                                                },0)
                                            }
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>  
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                                style={{padding:20}}
                                >
                                <Grid item xs={6} style={{marginBottom : 10}}>
                                    <TextField 
                                        label="Recieve Sales Amount(tk)"
                                        placeholder="344.55"
                                    />
                                </Grid>
                                <Grid item xs={6} style={{marginBottom : 10}}>
                                    <Typography >Total Damage Product Amount : {
                                        dsrOrderProducts[tabValue] && Object.values(dsrOrderProducts[tabValue]).reduce(function(tot, arr) { 
                                                                return tot + (arr.damage*arr.rate);
                                        },0)
                                    }</Typography>
                                </Grid>
                                <Grid item xs={6} style={{marginBottom : 10}}>
                                    <TextField 
                                        label="Commision(tk)"
                                        placeholder="344.55"
                                    />
                                </Grid>
                                <Grid item xs={6} style={{marginBottom : 10}}>
                                    <TextField 
                                        label="Cost(tk)"
                                        placeholder="344.55"
                                    />
                                </Grid>
                                <Grid item xs={12} style={{marginBottom : 10}}>
                                    <Divider />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography style={{textAlign : 'center'}} variant={'h3'}>Ground Total : {13443} Taka</Typography>
                                </Grid>
                            </Grid> 
                        </Card>
                    </TabPanel>
                ))
            }
        </div>
    )
}

