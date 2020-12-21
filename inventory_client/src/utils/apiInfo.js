import { decode } from "js-base64";
import { useContext } from "react";
import AppContext from "../context/appContext";
import { getStoreApiPath } from "./storeInfo";

let app_nameV = "store1";
export const app_name = app_nameV;

// const apiUrl = window.__SECRET_API_URL;
// const apiUrl = "http://40.119.2.157/"+app_name+"/api/";
export function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
}

export const parseCookie = (cookie) => {
    if(cookie !== null ){
        const user = JSON.parse(decode(cookie));
        return user;
    }
    return null;
}
export const getFullName = (user) => {
    if (user === null ){
        return "";
    }
    return user.FirstName + " " + user.LastName;
}

export function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export function removeCookie(name){
    document.cookie = name+"= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
}

const getApiUrl = () => {
    return "";
    const userCookies = getCookie('store-info');
	if(userCookies !== null ){
        return userCookies;
    }
    return "store1";
}

export const clientApi = "https://localhost:5001";
export const supportAPiUrl = clientApi+getApiUrl();
const apiUrl = clientApi+getApiUrl()+"/api/";
export default apiUrl;