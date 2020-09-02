import React, { useState, useEffect } from 'react';
import submitForm from '../utils/fetchApi';
import MaterialTable from 'material-table';
import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AppContext from '../context/appContext';
import MaterialUIPickers from '../components/datePicker';


  
export default function SalesPaymentDue(props) {

    const [data,setData] = useState([]);
    const [open,setOpen] = useState(false);

    const [fieldValue,setFieldValue] = useState("");
    const [nextPaymentDueDate,setNextPaymentDueDate] = useState(new Date().getTime());

    const [columns,] =  useState([
        { title: 'Sales Id   ', field: 'salesId' },
        { title: 'Customer Name', field: 'customerName' },
        { title: 'Product Name', field: 'productName' },
        { title: 'Sales Payment Due Amount', field: 'salesPaymentDue' },
        { title: 'Sales Date', field: 'salesDate' },
        { title: 'Sales Due Payment Date', field: 'salesDuePaymentDate' },


    ]);

    const [salesWithDue,setSalesWithDue] = useState({});

    const {  setSalesPaymentDue } = React.useContext(AppContext);

    const FetchData = async () => {

        submitForm("sales/sales-payment-due","GET","",(res) => setData(JSON.parse(res)))
        setSalesPaymentDue();
        
    };

    useEffect(() => {
        FetchData();
    },[]);

    const handleDialog = (data) => {
        
        setOpen(true);
        setSalesWithDue(data);
    }
    const handleUpdate = () => {
        if(parseFloat(fieldValue) > salesWithDue.salesPaymentDue){
            alert("Your Sales due amount is more than "+salesWithDue.salesPaymentDue);
        }else{
            submitForm("sales/sales-payment-due/"+ 
                    salesWithDue.salesId+"-"+parseFloat(fieldValue)+"-"+nextPaymentDueDate,"PUT","",(res) => {FetchData();});
            setOpen(false);     

        }
    }

    const markDOne = (data) => {
        submitForm("sales/sales-payment-due/"+ 
            data.salesId+"-"+data.salesPaymentDue+"-"+nextPaymentDueDate,"PUT","",(res) => {FetchData();});
    }

    return(
        <div>
            <Dialog open={open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Sales Payment Due</DialogTitle>
                <DialogContent>
                   
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        onChange={(event) => setFieldValue(event.target.value)}
                        label="Pay Sales Due Amount"
                        type="text"
                        fullWidth
                    />

                    <br/>
                    <label>Next Sales Payment Due Date</label>
                    <br/>
                    <MaterialUIPickers onChange={(date) => setNextPaymentDueDate(date)} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
            <MaterialTable
                title="Manage Sales Payment Due"
                columns={columns}
                data={data}
                actions={[
                    {
                    icon: 'edit',
                    tooltip: 'Pay Sales Payment Due ',
                    onClick: (event, rowData) => handleDialog(rowData)
                    },
                    rowData => ({
                    icon: () =>  <DoneOutlineOutlinedIcon style={{ color: green[500] }}/>,
                    tooltip: 'Mark Sales payment due paid',
                    onClick: (event, rowData) => markDOne(rowData),
                    disabled: rowData.birthYear < 2000
                    })
                ]}
             
                options={{
                    actionsColumnIndex: -1
                }}
            />
        </div>
        
    )
}