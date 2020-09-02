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


  
export default function PurchasePaymentDue(props) {

    const [data,setData] = useState([]);
    const [open,setOpen] = useState(false);

    const [fieldValue,setFieldValue] = useState("");
    const [nextPaymentDueDate,setNextPaymentDueDate] = useState(new Date().getTime());

    const [columns,] =  useState([
        { title: 'Purchase Id   ', field: 'purchaseId' },
        { title: 'Supplier Name', field: 'supplierName' },
        { title: 'Product Name', field: 'productName' },
        { title: 'Purchase Payment Due Amount', field: 'purchasePaymentDue' },
        { title: 'Purchase Date', field: 'purchaseDate' },
        { title: 'Purchase Due Payment Date', field: 'purchaseDuePaymentDate' },


    ]);

    const [purchaseWithDue,setPurchaseWithDue] = useState({});

    const {  setPurPaymentDue } = React.useContext(AppContext);

    const FetchData = async () => {

        submitForm("purchases/purchase-payment-due","GET","",(res) => setData(JSON.parse(res)))
        setPurPaymentDue();
        
    };

    useEffect(() => {
        FetchData();
    },[]);

    const handleDialog = (data) => {
        
        setOpen(true);
        setPurchaseWithDue(data);
    }
    const handleUpdate = () => {
        if(parseFloat(fieldValue) > purchaseWithDue.purchasePaymentDue){
            alert("Your purchase due amount is more than "+purchaseWithDue.purchasePaymentDue);
        }else{
            submitForm("purchases/purchase-payment-due/"+ 
                    purchaseWithDue.purchaseId+"-"+parseFloat(fieldValue)+"-"+nextPaymentDueDate,"PUT","",(res) => {FetchData();});
            setOpen(false);     

        }
    }

    const markDOne = (data) => {
        submitForm("purchases/purchase-payment-due/"+ 
            data.purchaseId+"-"+data.purchasePaymentDue+"-"+nextPaymentDueDate,"PUT","",(res) => {FetchData();});
    }

    return(
        <div>
            <Dialog open={open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Purchase Payment Due</DialogTitle>
                <DialogContent>
                   
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        onChange={(event) => setFieldValue(event.target.value)}
                        label="Pay Purchase Due Amount"
                        type="text"
                        fullWidth
                    />
 }
                    <br/>
                    <label>Next Purchase Payment Due Date</label>
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
                title="Manage Purchase Payment Due"
                columns={columns}
                data={data}
                actions={[
                    {
                    icon: 'edit',
                    tooltip: 'Pay Purchase Payment Due ',
                    onClick: (event, rowData) => handleDialog(rowData)
                    },
                    rowData => ({
                    icon: () =>  <DoneOutlineOutlinedIcon style={{ color: green[500] }}/>,
                    tooltip: 'Mark Purchase payment due paid',
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