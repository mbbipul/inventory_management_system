import { getCookie, parseCookie } from "./apiInfo";

export function authHeader() {
    // return authorization header with jwt token
    let user = parseCookie(getCookie('user-info'));
    if (user && user.Token) {
        
        return { 'Authorization': 'Bearer ' + user.Token };
    } else {
        return {};
    }
}

export function getBarrier() {
    // return authorization header with jwt token
    let user = parseCookie(getCookie('user-info'));
    if (user && user.Token) {
        return user.Token
    } else {
        return {};
    }
}