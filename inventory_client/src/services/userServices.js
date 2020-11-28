import apiUrl from "../utils/apiInfo";
import { authHeader } from "../utils/authHeader";

export const userService = {
    login,
    logout,
    registerUser,
    getAll,
    getById,
    update,
    delete: _delete
};
 
function login(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
        credentials: 'include'
    };
 
    return fetch(apiUrl + 'users/authenticate', requestOptions)
        .then(handleResponse, handleError)
        .then(userInfo => {
            // login successful if there's a jwt token in the response
            if (userInfo && userInfo.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
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
 
    return fetch(apiUrl + 'users', requestOptions).then(handleResponse, handleError);
}
 
function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
 
    return fetch(apiUrl + 'users/' + id, requestOptions).then(handleResponse, handleError);
}
 
function registerUser(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };
 
    return fetch(apiUrl + 'users/register', requestOptions).then(handleResponse, handleError);
}
 
function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };
 
    return fetch(apiUrl + 'users/' + user.id, requestOptions).then(handleResponse, handleError);
}
 
// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };
 
    return fetch(apiUrl + 'users/' + id, requestOptions).then(handleResponse, handleError);
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