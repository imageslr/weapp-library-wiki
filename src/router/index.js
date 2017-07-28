import Vue from 'vue';
import Router from 'vue-router';
import Index from '../views/index/index.vue';
import Search from '../views/search/index.vue';
import Book from '../views/book/index.vue';
import Layout from '../views/layout/Layout.vue';

Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        component: Layout,
        children: [{ path: '', component: Index }]
    }, {
        path: '/search',
        component: Layout,
        children: [{ path: '', component: Search }]
    }, {
        path: '/book/:id',
        name: 'book',
        component: Layout,
        children: [{ path: '', component: Book }]
    }]
})