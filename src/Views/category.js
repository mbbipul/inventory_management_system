import React ,{ useState,useEffect } from "react";

import FullWidthTabs from "../components/tab";
import { Fab, Button, TextField, Snackbar, Popover } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import submitForm from "../utils/fetchApi";
import Alert from '@material-ui/lab/Alert';
import MaterialTableDetailsPanel from "../components/collapseTable";
import MaterialTable from "material-table";
import M from 'materialize-css';

import apiUrl from "../utils/apiInfo";

const FetchData = async (url,setState) => {

    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: 'follow'
      };
      const res = await fetch(url+"ProductCategory", requestOptions);
      const json = await res.json();

      setState((prevState) => {
          const data = json;
          return { ...prevState, data };
        });
      // console.log("json - ", json);
    } catch (error) {
      console.log("error - ", error);
    }
  };

function PaperComponent(props) {
    return (
      <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
      </Draggable>
    );
}

function ManageCategory(props){

    let [url,setUrl] = useState(apiUrl);
    let [showALert,setAlert] = useState(false);
    let [alertText,setAlertText] = useState("");
    
    const [state, setState] = React.useState(props.data);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAlert(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [showALert]);
    
    useEffect(() => {
        props.ondataChange(state);
    },[state]);

    const updateProductCategory = (oldData,productCategory) => {
        let isCategoryExists = (result ) => {
            if(result === "true"){
                setAlertText("Category \""+productCategory.productCategoryName+"\" already exists!")
                setAlert(true);
            }else{
                submitForm("ProductCategory/"+productCategory.productCategoryId,"PUT",productCategory,() => {
                    setState((prevState) => {
                        const data = [...prevState.data];
                        data[data.indexOf(oldData)] = productCategory;
                        return { ...prevState, data };
                    });
                    setAlertText("Successfully Update Category !")
                    setAlert(true);
                });

            }
        }
        submitForm("ProductCategory/find/"+productCategory.productCategoryName,"GET","",isCategoryExists);

    }

    const deleteProductCategory = (productCategory) => {
        submitForm("ProductCategory/"+productCategory.productCategoryId,"DELETE",productCategory,() => {
            setAlertText("Successfully deleted \""+productCategory.productCategoryName+"\" Category!")
            setAlert(true);
        });

    }

    const deleteSelectedProductCategory = (productCategories) => {
        submitForm("ProductCategory/delete-categories","DELETE",productCategories,(result) => {
            setAlertText(result);
            setAlert(true);
            FetchData(url,setState);
        });
        
    }
    return (
        <div>
            { showALert && <Alert elevation={3} variant="filled" severity="success">{alertText}</Alert>}
            <MaterialTable
            title="Category"
            columns={state.columns}
            data={state.data}
            options={{
                selection: true
                }}
                actions={[
                    {
                        tooltip: 'Remove All Selected Users',
                        icon: 'delete',
                        onClick: (evt, data) => {
                            deleteSelectedProductCategory(data);
                        }
                    }
            ]}
            editable={{
                onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                    setTimeout(() => {
                    resolve();
                    if (oldData) {
                        updateProductCategory(oldData,newData);
                    }
                    }, 600);
                }),
                onRowDelete: (oldData) =>
                new Promise((resolve) => {
                    setTimeout(() => {
                    resolve();
                    setState((prevState) => {
                        const data = [...prevState.data];
                        data.splice(data.indexOf(oldData), 1);
                        deleteProductCategory(oldData);
                        return { ...prevState, data };
                    });
                    }, 600);
                }),
            }}
            />
        </div>
    );
}
  
function Category(){

    const [open, setOpen] = useState(false);
    let [url,setUrl] = useState(apiUrl);

    let [category,setCategory] = useState(" ");
    let [showError,setShowError] = useState(false);
    let [errorText, setErrorText] = useState(" ");
    let [showSnackbar, setShowSnackbar] = useState(false);
    let [snackbarText, setSnackbarText] = useState("");
  
    const [categories, setCategories] = React.useState({
        columns: [
          { title: 'Category Name', field: 'productCategoryName' },
        ],
        data: [],
    });

    useEffect(() => {  
        FetchData(url,setCategories);
    },[url]);
    
      
    const handleSnackbar = () => setShowSnackbar(false);

    const handleCategoryNameInput = (e) =>{
        setCategory(e.target.value);
    }

    const onSuccessAddCategory = (result) => {
        let resObj = JSON.parse(result);
        setSnackbarText("Successfully new Category \""+resObj.productCategoryName + "\" added.");

        setCategories((prevState) => {
            const data = [...prevState.data];
            data.push(resObj);
            return { ...prevState, data };
        });
        setShowSnackbar(true);
    }

    const isCategoryExists = (result) => {
        if(result === "true"){
            setErrorText(category+" already exists!");
            setShowError(true);
        }else{
            setErrorText("");
            setSnackbarText("");
            setShowError(false);
        }
    }

    useEffect(() => {
        if(category !== " " ){
            submitForm("ProductCategory/find/"+category,"GET","",isCategoryExists);
        }
     }, [category]);

    const submitNewCategory = () => {
        if ( category === " " || category ==="" ){
            setErrorText("Please insert a Product Category Name!");
            setShowError(true);
        }else{
            let cate = {
                "productCategoryName" : category
            };
            
            submitForm("ProductCategory","POST",cate,onSuccessAddCategory);
            setOpen(false);
            setShowError(false);
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const ondataChange = (data) => setCategories(data);

    let tabs = [
        {
            tab : "All Categories",
            tabPanel : <MaterialTableDetailsPanel  data={categories} />
        },
        {
            tab : "Manage Category",
            tabPanel :  <div style={{width:550,marginLeft:"25%"}}>
                <ManageCategory ondataChange={ondataChange} data={categories} />
            </div>
        }
    ];

    return(
        <div>
            <FullWidthTabs  tabs={tabs}/>
            <Fab onClick={() => setOpen(true)} style={{position : "fixed" , bottom :50,right:50}} color="primary" aria-label="add">
                <AddIcon />
            </Fab>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                Add New Category
                </DialogTitle>
                <DialogContent>
                <DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Category Name"
                        type="text"
                        onChange={handleCategoryNameInput}
                        fullWidth
                    />
                   { showError && <Alert open={false} severity="error">
                        {errorText}
                    </Alert>
                    }
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button autoFocus onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={submitNewCategory} color="primary">
                    Add
                </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={showSnackbar} autoHideDuration={6000} onClose={handleSnackbar}>
                <Alert variant="filled" onClose={handleSnackbar} severity="success">
                    {snackbarText}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Category;