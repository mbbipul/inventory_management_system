import apiUrl, { clientApi } from "../utils/apiInfo";
import { authHeader } from "../utils/authHeader";
import { getStoreApiPath, getStoreInfo } from "../utils/storeInfo";

const userControllerAPi = clientApi + 'store1/api/users/';
export const userService = {
    login,
    logout,
    registerUser,
    getAll,
    getById,
    update,
    delete: _delete
};

const getDrawerStyle = (store) => {
    var style = document.createElement('style');
    style.type = 'text/css';
    switch (store) {
        case 'store2':
            style.innerHTML = '.MuiDrawer-paper{ background-color: #E15F07!important; color: aliceblue!important;}';
            break;
        case 'store3':
            style.innerHTML = '.MuiDrawer-paper{ background-color: #065f15!important; color: aliceblue!important;}';
            break;
        case 'store1':
            style.innerHTML = '.MuiDrawer-paper{ background-color: #080c41!important; color: aliceblue!important;}';
            break;
        default:
            break;
    }
    
    document.getElementsByTagName('head')[0].appendChild(style);
}

function login(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
        credentials: 'include'
    };
 
    return fetch(userControllerAPi+'authenticate', requestOptions)
        .then(handleResponse, handleError)
        .then(userInfo => {
            // login successful if there's a jwt token in the response
            if (userInfo && userInfo.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                getDrawerStyle(getStoreApiPath(userInfo.adminRole));
            }
 
            return user;
        });
}
 
function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}
 
function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
 
    return fetch(userControllerAPi, requestOptions).then(handleResponse, handleError);
}
 
function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
 
    return fetch(userControllerAPi + id, requestOptions).then(handleResponse, handleError);
}
 
function registerUser(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };
 
    return fetch(userControllerAPi+'register', requestOptions).then(handleResponse, handleError);
}
 
function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };
 
    return fetch(userControllerAPi + user.id, requestOptions).then(handleResponse, handleError);
}
 
// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };
 
    return fetch(userControllerAPi + id, requestOptions).then(handleResponse, handleError);
}
 
function handleResponse(response) {
    return new Promise((resolve, reject) => {
        if (response.ok) {
            response.text().then(text => resolve(text));
        } else {
            // return error message from response body
            response.text().then(text => reject(text));
        }
    });
}
 
function handleError(error) {
    return Promise.reject(error && error.message);
}