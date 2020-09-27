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
import { Delete } from '@material-ui/icons';
import DeleteALert from '../components/deleteALert';

  
export default function PurchaseProductDue(props) {

    const [data,setData] = useState([]);
    const [open,setOpen] = useState(false);

    const [fieldValue,setFieldValue] = useState("");
    const [purchaseDueProduct,setPurchaseDueProduct] = useState("");
    const [openDeleteAlert,setOpenDeleteAlert] = useState(false);
    const [tmpData,setTmpData] = useState({});

    const [columns,] =  useState([
        { title: 'Purchase Due Product Id   ', field: 'purchaseId' },
        { title: 'Supplier Name', field: 'supplierName' },
        { title: 'Product Name', field: 'productName' },
        { title: 'Purchase Due Product Quantity', field: 'purchaseDueProductsQuantity' },
        { title: 'Purchase Date', field: 'purchaseDate' },

    ]);

    const {  setProNumber } = React.useContext(AppContext);

    const FetchData = async () => {

        submitForm("purchases/purchase/product-dues","GET","",(res) => setData(JSON.parse(res)))
        setProNumber();
        
    };

    useEffect(() => {
        FetchData();
    },[]);

    const handleDialog = (data) => {
        console.log(data);
        var purchaseDue = {
            purchaseDueProductId : data.purchaseDueProductId,
            purchaseId : data.purchaseId,
            productQuantity : parseInt(fieldValue),
            purchaseDueProductsQuantity : data.purchaseDueProductsQuantity
        }
       
        setOpen(true);
        setPurchaseDueProduct(purchaseDue);
    }
    const handleUpdate = () => {
      var purchaseDue = {
        purchaseDueProductId : purchaseDueProduct.purchaseDueProductId,
        purchaseId : purchaseDueProduct.purchaseId,
        productQuantity : parseInt(fieldValue)
      }
      if(parseInt(fieldValue) > purchaseDueProduct.purchaseDueProductsQuantity){
        alert("Your purchase product quantity is less than "+fieldValue);
      }else{
        submitForm("purchases/purchase/update-purchase-due/"+purchaseDueProduct.purchaseDueProductId,"POST",purchaseDue,() => FetchData());
        setOpen(false);

      }
    }

    const markDOne = (data) => {
        setOpenDeleteAlert(true);
        setTmpData(data);
        
    }

    const handleDeleteALertDisAgree = () => {
        setOpenDeleteAlert(false);
        setTmpData(null);
    }

    const handleDeleteALertAgree = () => {
        if (tmpData === null) {
            alert('Something Went wrong');
            return ;
        }
        var purchaseDue = {
            purchaseDueProductId : tmpData.purchaseDueProductId,
            purchaseId : tmpData.purchaseId,
            productQuantity : tmpData.purchaseDueProductsQuantity
        }
        submitForm("purchases/purchase/update-purchase-due/"+purchaseDue.purchaseDueProductId,"POST",purchaseDue,() => FetchData());
        setOpenDeleteAlert(false);
        setTmpData(null);
    }

    return(
        <div>
            <DeleteALert 
                message="Make sure that you recieve all products of this Purchase . "
                title=" Are you sure to Mark this purchase as Mark Purchase Product Recieved ?" 
                open={openDeleteAlert}
                handleDisagree={handleDeleteALertDisAgree}
                handleAgree={handleDeleteALertAgree}
                />
            <Dialog open={open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Purchase Due Products</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Update Recieve Information Of Purchase Due Products
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        onChange={(event) => setFieldValue(event.target.value)}
                        label="Recieve Product Quantity"
                        type="text"
                        fullWidth
                    />
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
                title="Manage Purchase Due Products"
                columns={columns}
                data={data}
                actions={[
                    {
                    icon: 'edit',
                    tooltip: 'Update Product Due Information',
                    onClick: (event, rowData) => handleDialog(rowData)
                    },
                    rowData => ({
                        icon: () =>  <DoneOutlineOutlinedIcon style={{ color: green[500] }}/>,
                        tooltip: 'Mark Purchase Product Recieved',
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