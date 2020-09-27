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
import DeleteALert from '../components/deleteALert';

  
export default function SalesProductDue(props) {

    const [data,setData] = useState([]);
    const [open,setOpen] = useState(false);

    const [fieldValue,setFieldValue] = useState("");
    const [salesDueProduct,setSalesDueProduct] = useState("");
    const [openDeleteAlert,setOpenDeleteAlert] = useState(false);
    const [tmpData,setTmpData] = useState({});

    const [columns,] =  useState([
        { title: 'Sales Due Product Id   ', field: 'salesDueProductId' },
        { title: 'Customer Name', field: 'customerName' },
        { title: 'Product Name', field: 'productName' },
        { title: 'Sales Due Product Quantity', field: 'salesDueProductsQuantity' },
        { title: 'Sales Date', field: 'salesDate' },

    ]);

    const {  setSalesDueNumber } = React.useContext(AppContext);

    const FetchData = async () => {

        submitForm("sales/sales/product-dues","GET","",(res) => setData(JSON.parse(res)))
        setSalesDueNumber();
        
    };

    useEffect(() => {
        FetchData();
    },[]);

    const handleDialog = (data) => {
        console.log(data);
        var salesDue = {
            salesDueProductId : data.salesDueProductId,
            salesId : data.salesId,
            productQuantity : parseInt(fieldValue),
            salesDueProductsQuantity : data.salesDueProductsQuantity
        }
       
        setOpen(true);
        setSalesDueProduct(salesDue);
    }
    const handleUpdate = () => {
      var salesDue = {
        salesDueProductId : salesDueProduct.salesDueProductId,
        salesId : salesDueProduct.salesId,
        productQuantity : parseInt(fieldValue)
      }
      if(parseInt(fieldValue) > salesDueProduct.salesDueProductsQuantity){
        alert("Your sales product quantity is less than "+fieldValue);
      }else{
        submitForm("sales/sales/update-sales-due/"+salesDueProduct.salesDueProductId,"POST",salesDue,() => FetchData());
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
        var salesDue = {
            salesDueProductId : tmpData.salesDueProductId,
            salesId : tmpData.salesId,
            productQuantity : tmpData.salesDueProductsQuantity
        }
        submitForm("sales/sales/update-sales-due/"+salesDue.salesDueProductId,"POST",salesDue,() => FetchData());
        
        setOpenDeleteAlert(false);
        setTmpData(null);
    }
    return(
        <div>
            <DeleteALert 
                message="Make sure that you return all products of this Sales to Customer . "
                title=" Are you sure to Mark this Sales as Mark Sales Product Returned ?" 
                open={openDeleteAlert}
                handleDisagree={handleDeleteALertDisAgree}
                handleAgree={handleDeleteALertAgree}/>

            <Dialog open={open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Sales Due Products</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Update Recieve Information Of sales Due Products
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
                title="Manage Sales Due Products"
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
                        tooltip: 'Mark Sales Product Returned',
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