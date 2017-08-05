import fetch from './fetch';


export function register(params) {
    return fetch.post('/api/wiki/users', params);
}

export function login(username, password, type) {
    return fetch.post('/api/wiki/users/login', {
        username,
        password,
        type
    });
}

export function getUserInfo(token) {
    return fetch.get('/api/wiki/users/info', {
        params: { token }
    });
}

export function changePassword(id, originPassword, newPassword) {
    return fetch.post('/api/wiki/users/password', {
        id,
        originPassword,
        newPassword
    });
}

export function search(params) {
    return fetch.get('/api/wiki/search', {
        params: params
    })
}

export function getBookById(id, version = undefined) {
    let url = version ? '/api/wiki/books/' + id + '/versions/' + version : '/api/wiki/books/' + id;
    return fetch.get(url)
}

export function addBookItem(params, id = null) {
    let url = id ? '/api/wiki/books/' + id : '/api/wiki/books';
    return fetch.post(url, params);
}