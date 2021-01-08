import apiUrl from './apiInfo';
import { authHeader, getBarrier } from './authHeader';

const submitForm = (path,method,data,onSuccess) => {
    var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Access-Control-Allow-Origin",'http://localhost:3000');
        myHeaders.append("Authorization",'Bearer '+getBarrier());
        var raw = JSON.stringify(data);

        var requestOptions = {
            method: method,
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        };


        if (method==="GET"){
            requestOptions = {
                method: method,
                headers: myHeaders,
                redirect: 'follow'
            };
        }
        fetch(apiUrl+path, requestOptions)
        .then(response => response.text())
        .then(result => onSuccess(result))
        .catch(error => {
            console.log("FETCHERROR");
            console.log(error);
            // alert('Something Went Wrong! Please Try again')
        });
}

export const submitFormWithAddress = (path,method,data,onSuccess) => {
    var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Access-Control-Allow-Origin",'http://localhost:3000');
        myHeaders.append("Authorization",'Bearer '+getBarrier());
        var raw = JSON.stringify(data);

        var requestOptions = {
            method: method,
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        };


        if (method==="GET"){
            requestOptions = {
                method: method,
                headers: myHeaders,
                redirect: 'follow'
            };
        }
        fetch(path, requestOptions)
        .then(response => response.text())
        .then(result => onSuccess(result))
        .catch(error => console.log('error', error));
}

export default submitForm;