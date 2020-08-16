import React, { useState, useEffect } from 'react';
import apiUrl from '../utils/apiInfo';
import ManageTable from '../components/manageTable';
import submitForm from '../utils/fetchApi';
import MaterialTable from 'material-table';
import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined';
import { green } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function FormDialog() {
    const [open, setOpen] = React.useState(true);

  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>

        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address here. We will send updates
              occasionally.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
              Subscribe
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  
export default function PurchaseProductDue(props) {

    const [data,setData] = useState([]);
    const [open,setOpen] = useState(false);

    const [fieldValue,setFieldValue] = useState("");
    const [purchaseDueProduct,setPurchaseDueProduct] = useState("");

    const [columns,] =  useState([
        { title: 'Purchase Due Product Id   ', field: 'purchaseId' },
        { title: 'Supplier Name', field: 'supplierName' },
        { title: 'Product Name', field: 'productName' },
        { title: 'Purchase Due Product Quantity', field: 'productQuantity' },
        { title: 'Purchase Date', field: 'purchaseDate' },

    ]);

    const FetchData = async () => {

        submitForm("purchases/purchase/product-dues","GET","",(res) => setData(JSON.parse(res)))
      
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
      var purchaseDue = {
        purchaseDueProductId : data.purchaseDueProductId,
        purchaseId : data.purchaseId,
        productQuantity : data.purchaseDueProductsQuantity
      }
      submitForm("purchases/purchase/update-purchase-due/"+data.purchaseDueProductId,"POST",purchaseDue,() => FetchData());
    }

    return(
        <div>
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
                title="Positioning Actions Column Preview"
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