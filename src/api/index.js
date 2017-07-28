import fetch from './fetch';

export function search(params) {
    return fetch.get('/api/wiki/search', {
        params: params
    })
}

export function getBookById(id){
    return fetch.get('/api/wiki/books/' + id)
}