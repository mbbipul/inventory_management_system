import React from 'react';
import { Box, Chip, Snackbar } from "@material-ui/core";
import { useEffect, useState } from "react";
import { clientApi } from "../utils/apiInfo";
import { submitFormWithAddress } from "../utils/fetchApi";
import MaterialTable from 'material-table';
import { getStoreInfo } from '../utils/storeInfo';
import { userService } from '../services/userServices';
import Alert from '@material-ui/lab/Alert';
import { AppContextConsumer } from '../context/appContext';

export default function AccountSetting(props) {
    const [users,setUsers] = useState([]);
    const [openSnackbar,setOpenSnackbar] = useState(false);
    const [snackText,setSnackText] = useState("");
    const [snackSeverity,setSnackSeverity] = useState('success');

    const userColumn = [
        {
            title : 'First Name',
            field : 'firstName'
        },
        {
            title : 'Last Name',
            field : 'lastName'
        },
        {
            title : 'Email',
            field : 'userEmail'
        },
        {
            title : 'Password',
            field : 'password',
            render : rowData => "***********"
        },
        {
            title : 'Account store Name',
            field : 'adminRole',
            lookup: { 0: getStoreInfo(0), 1: getStoreInfo(1), 2: getStoreInfo(2) },
            render : rowData => {
                rowData.adminRoleu = rowData.adminRole;
                if(rowData && rowData.hasSuperAdminRole){
                    return  <Chip 
                                color='secondary'
                                label='Admin'
                                clickable
                            />
                }
                return getStoreInfo(rowData.adminRoleu);
            } 
        }
    ]
    useEffect(() => {
		submitFormWithAddress(clientApi+"store1/api/users","GET","", (res) => {
			setUsers(JSON.parse(res));
		});
    },[]);
    
    return (
        <AppContextConsumer >
            {({user}) =>  {
              if (user === null || user.HasSuperAdminRole === false)
                return <Box style={{margin:20,textAlign : "center"}}>To Edit Account Setting You have to logged in as Admin!</Box>;
              if (user.AdminRole !== 999)
                return <Box style={{margin:20,textAlign : "center"}}>To Edit Account Setting You have to logged in as Admin!</Box>;
              return  <Box style={{margin:20}}>
                            <MaterialTable 
                                title="All Users"
                                columns={userColumn}
                                data={users}
                                editable={{
                                    onRowAdd: newData =>
                                        new Promise((resolve, reject) => {
                                            setTimeout(() => {
                                                newData.adminRole = parseInt(newData.adminRole);
                                                userService.registerUser(newData).then(
                                                    success => { 
                                                        setSnackSeverity('success');
                                                        setSnackText('Successfully Added New User !');
                                                        setUsers([...users, newData]);
                                                        setOpenSnackbar(true);
                                                    },
                                                    error => {
                                                        setSnackSeverity('error');
                                                        setSnackText('Something wrong!');
                                                        setOpenSnackbar(true);
                                                    }
                                                ); 
                                                resolve();
                                            }, 1000)
                                    }),
                                    onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                        const dataUpdate = [...users];
                                        const index = oldData.tableData.id;
                                        dataUpdate[index] = newData;
                                        newData.adminRole = parseInt(newData.adminRole);
                                        userService.update(newData).then(
                                            success => { 
                                                setSnackSeverity('success');
                                                setSnackText('Successfully updated !');
                                                setUsers([...dataUpdate]);
                                                setOpenSnackbar(true);
                                            },
                                            error => {
                                                setSnackSeverity('error');
                                                setSnackText('Something wrong!');
                                                setOpenSnackbar(true);
                                            }
                                        ); 
                                        resolve();
                                        }, 1000)
                                    }),
                                    onRowDelete: oldData =>
                                    new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                        const dataDelete = [...users];
                                        const index = oldData.tableData.id;
                                        dataDelete.splice(index, 1);
                                        userService.delete(oldData.id).then(
                                            success => { 
                                                setSnackSeverity('success');
                                                setSnackText('Successfully deleted !');
                                                setUsers([...dataDelete]);
                                                setOpenSnackbar(true);
                                            },
                                            error => {
                                                setSnackSeverity('error');
                                                setSnackText('Something wrong!');
                                                setOpenSnackbar(true);
                                            }
                                        ); 
                                        resolve();
                                        }, 1000)
                                    }),
                                }}
                            />
                            <Snackbar 
                                    open={openSnackbar} 
                                    autoHideDuration={6000} 
                                    onClose={() => setOpenSnackbar(false)}
                                >
                                    <Alert onClose={() => setOpenSnackbar(false)} variant="filled" severity={snackSeverity}>
                                        {snackText}
                                    </Alert>
                            </Snackbar>
                        </Box>
            }}
        </AppContextConsumer>
        
    )
}