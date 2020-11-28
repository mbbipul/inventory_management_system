import apiUrl from './apiInfo';

const submitForm = (path,method,data,onSuccess) => {
    var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(data);

        var requestOptions = {
            method: method,
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };


        if (method==="GET"){
            requestOptions = {
                method: method,
                headers: myHeaders,
                redirect: 'follow'
            };
        }
        console.log(apiUrl+path);
        fetch(apiUrl+path, requestOptions)
        .then(response => response.text())
        .then(result => onSuccess(result))
        .catch(error => console.log('error', error));
}

export default submitForm;