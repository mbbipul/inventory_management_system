import React from 'react';
import { useState , useEffect } from "react";
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';
import MaterialTable from 'material-table';


function ManageTable(props){

    let [showALert,setAlert] = useState(false);
    let [errorAlert,setErrorALert] = useState(false);

    let [alertText,setAlertText] = useState("");
    
    const [datas, setData] = React.useState();

   
    const FetchData =  () => {
        submitForm(props.apiUrl,"GET","",(res) => setData(JSON.parse(res)));
    };
   
    useEffect(() => {
        FetchData();
    },[]);
    useEffect(() => {
        const timer = setTimeout(() => {
            setAlert(false);
            setErrorALert(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [showALert]);
    

    const updateData = (oldData,newData) => {
        let isCategoryExists = (result ) => {   
            if(result === "true"){
                setAlertText(" \""+newData[props.uniqueName]+"\" already exists!");
                setAlert(true);
                setErrorALert(true);
            }else{
                submitForm(props.apiUrl+newData[props.uniqueKey],"PUT",newData,() => {
                    setAlertText("Successfully Update !")
                    setAlert(true);
                    FetchData();
                });

            }
        }
        if(props.hasUnique){
            submitForm(props.apiUrl+"find/"+newData[props.uniqueName],"GET","",isCategoryExists);
        }else{
            submitForm(props.apiUrl+newData[props.uniqueKey],"PUT",newData,() => {
                setAlertText("Successfully Update "+props.apiInfo+ " !")
                setAlert(true);
                FetchData();
            });
        }

    }

    const deleteData = (rowData) => {
        
       
        submitForm(props.apiUrl+rowData[props.uniqueKey],"DELETE",rowData,(res) => {
            setAlertText("Successfully deleted \""+JSON.parse(res)[props.uniqueKey]+"\" "+props.apiInfo)
            setAlert(true);
            FetchData();

        });
    }

    const deleteSelectedData = (datas) => {
        submitForm(props.apiUrl+"delete-multiple","DELETE",datas,(result) => {
            setAlertText(result);
            setAlert(true);
            FetchData();
        });
        
    }
    return (
        <div>
            { showALert && <Alert elevation={3} variant="filled" severity={ errorAlert ? "error" : "success"}>{alertText}</Alert>}
            <MaterialTable
                title={props.title}
                columns={props.columns}
                data={datas}
                options={{
                    selection: true
                }}
                actions={[
                    {
                        tooltip: 'Remove All Selected Users',
                        icon: 'delete',
                        onClick: (evt, data) => {
                            deleteSelectedData(data);

                        }
                    }
            ]}
            editable={props.editable ? {
                onRowUpdate: (newData, oldData) =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        if (oldData) {
                            updateData(oldData,newData);
                        }
                       
                        resolve();
                    }, 600);
                }),
                onRowDelete: (oldData) =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        deleteData(oldData);
                        resolve();
                    }, 600);
                }),
            } : 
            
            {
                onRowDelete: (oldData) =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        deleteData(oldData);
                        resolve();

                    }, 600);
                }),
            }
                
            }
            />
        </div>
    );
}

export default ManageTable;