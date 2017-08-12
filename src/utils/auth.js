import Cookies from 'js-cookie';


const TokenKey = 'Wiki-Token';

export function getToken() {
  return Cookies.get(TokenKey, {path: 'wiki'});
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, {path: 'wiki'});
}

export function removeToken() {
  return Cookies.remove(TokenKey, {path: 'wiki'});
}

export function checkLogin(){
    if(getToken()) return true;
    else {
        this.$emit('showLogin');
        return false;
    } 
}