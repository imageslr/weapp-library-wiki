import Cookies from 'js-cookie';


const TokenKey = 'Wiki-Token';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function checkLogin(vueInstance){
    if(getToken()) return true;
    else {
        vueInstance.$emit('showLogin');
        return false;
    } 
}