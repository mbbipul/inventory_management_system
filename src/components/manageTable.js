import React from 'react';
import { useState , useEffect } from "react";
import apiUrl from "../utils/apiInfo";
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';
import MaterialTable from 'material-table';
import { data } from 'jquery';


function ManageTable(props){

    let [url,] = useState(apiUrl);
    let [showALert,setAlert] = useState(false);
    let [errorAlert,setErrorALert] = useState(false);

    let [alertText,setAlertText] = useState("");
    
    const [datas, setData] = React.useState([]);

   
    const FetchData = async (url,setData) => {

        try {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
    
          var requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: 'follow'
          };
          const res = await fetch(url+props.apiUrl, requestOptions);
          const json = await res.json();
    
          setData(json);
          // console.log("json - ", json);
        } catch (error) {
          console.log("error - ", error);
        }
      };
      
    useEffect(() => {
        setData(props.data);
    },[props.data]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAlert(false);
            setErrorALert(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [showALert]);
    
    useEffect(() => {
        props.ondataChange(datas);
    },[datas]);

    const updateData = (oldData,newData) => {
        let isCategoryExists = (result ) => {   
            if(result === "true"){
                setAlertText(" \""+newData[props.uniqueName]+"\" already exists!");
                setAlert(true);
                setErrorALert(true);
            }else{
                submitForm(props.apiUrl+newData[props.uniqueKey],"PUT",newData,() => {
                    datas[datas.indexOf(oldData)] = newData;

                    setData(datas);
                    setAlertText("Successfully Update !")
                    setAlert(true);
                });

            }
        }
        if(props.hasUnique){
            submitForm(props.apiUrl+"find/"+newData[props.uniqueName],"GET","",isCategoryExists);
        }else{
            submitForm(props.apiUrl+newData[props.uniqueKey],"PUT",newData,() => {
                datas[datas.indexOf(oldData)] = newData;
                setData(datas);
                setAlertText("Successfully Update "+props.apiInfo+ " !")
                setAlert(true);
            });
        }

    }

    const deleteData = (rowData) => {
        
       
        submitForm(props.apiUrl+rowData[props.uniqueKey],"DELETE",rowData,(res) => {
            setAlertText("Successfully deleted \""+JSON.parse(res)[props.uniqueKey]+"\" "+props.apiInfo)
            setAlert(true);
        });
    }

    const deleteSelectedData = (datas) => {
        submitForm(props.apiUrl+"delete-multiple","DELETE",datas,(result) => {
            setAlertText(result);
            setAlert(true);
            FetchData(url,setData);
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
                    resolve();
                    if (oldData) {
                        updateData(oldData,newData);
                    }
                    }, 600);
                }),
                onRowDelete: (oldData) =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        const dataDelete = [...datas];
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        deleteData(oldData);
                        setData([...dataDelete]);

                        resolve();

                    }, 600);
                }),
            } : 
            
            {
                onRowDelete: (oldData) =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        const dataDelete = [...datas];
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        deleteData(oldData);
                        setData([...dataDelete]);

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