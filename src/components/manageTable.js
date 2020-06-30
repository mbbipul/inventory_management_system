import React from 'react';
import { useState , useEffect } from "react";
import apiUrl from "../utils/apiInfo";
import submitForm from '../utils/fetchApi';
import Alert from '@material-ui/lab/Alert';
import MaterialTable from 'material-table';


function ManageTable(props){

    let [url,setUrl] = useState(apiUrl);
    let [showALert,setAlert] = useState(false);
    let [errorAlert,setErrorALert] = useState(false);

    let [alertText,setAlertText] = useState("");
    
    const [state, setState] = React.useState(props.data);

    console.log(state.data);
   
    const FetchData = async (url,setState) => {

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
    
          setState((prevState) => {
              const data = json;
              return { ...prevState, data };
            });
          // console.log("json - ", json);
        } catch (error) {
          console.log("error - ", error);
        }
      };
      
    useEffect(() => {
        // Update the document title using the browser API
        if(state.data.length === 0){
            FetchData(url,setState);
        }
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setAlert(false);
            setErrorALert(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [showALert]);
    
    useEffect(() => {
        props.ondataChange(state);
    },[state]);

    const updateData = (oldData,newData) => {
        let isCategoryExists = (result ) => {   
            if(result === "true"){
                setAlertText(" \""+newData[props.uniqueName]+"\" already exists!");
                setAlert(true);
                setErrorALert(true);
            }else{
                submitForm(props.apiUrl+newData[props.uniqueKey],"PUT",newData,() => {
                    setState((prevState) => {
                        const data = [...prevState.data];
                        data[data.indexOf(oldData)] = newData;
                        return { ...prevState, data };
                    });
                    setAlertText("Successfully Update Category !")
                    setAlert(true);
                });

            }
        }
        if(props.hasUnique){
            submitForm(props.apiUrl+"find/"+newData[props.uniqueName],"GET","",isCategoryExists);
        }else{
            submitForm(props.apiUrl+newData[props.uniqueKey],"PUT",newData,() => {
                setState((prevState) => {
                    const data = [...prevState.data];
                    data[data.indexOf(oldData)] = newData;
                    return { ...prevState, data };
                });
                setAlertText("Successfully Update Category !")
                setAlert(true);
            });
        }

    }

    const deleteData = (data) => {
        console.log(props.apiUrl+data[props.uniqueKey]);
        submitForm(props.apiUrl+data[props.uniqueKey],"DELETE",data,() => {
            setAlertText("Successfully deleted \""+data[props.uniqueName]+"\" Category!")
            setAlert(true);
        });

    }

    const deleteSelectedData = (datas) => {
        submitForm(props.apiUrl+"delete-multiple","DELETE",datas,(result) => {
            setAlertText(result);
            setAlert(true);
            FetchData(url,setState);
        });
        
    }
    return (
        <div>
            { showALert && <Alert elevation={3} variant="filled" severity={ errorAlert ? "error" : "success"}>{alertText}</Alert>}
            <MaterialTable
                title={props.title}
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
                            deleteSelectedData(data);
                        }
                    }
            ]}
            editable={{
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
                    resolve();
                    setState((prevState) => {
                        const data = [...prevState.data];
                        data.splice(data.indexOf(oldData), 1);
                        deleteData(oldData);
                        return { ...prevState, data };
                    });
                    }, 600);
                }),
            }}
            />
        </div>
    );
}

export default ManageTable;