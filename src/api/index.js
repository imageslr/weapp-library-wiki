import fetch from './fetch';

export function search(params) {
    return fetch.get('/api/wiki/search', {
        params: params
    })
}

export function getBookById(id) {
    return fetch.get('/api/wiki/books/' + id)
}

export function login(username, password, type) {
    return fetch.post('/api/wiki/users/login', {
        username,
        password,
        type
    });
}

export function getUserInfo(token){
    return fetch.get('/api/wiki/users/info', {
        params: {token}
    });
}