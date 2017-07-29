import Vue from 'vue';
import Router from 'vue-router';
import Index from '../views/index/index.vue';
import Search from '../views/search/index.vue';
import Book from '../views/book/index.vue';
import Layout from '../views/layout/Layout.vue';
import Login from '../views/login/login.vue';
import Register from '../views/login/register.vue';
import Error404 from '../views/error/404.vue';

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
        }, {
            path: '/login',
            component: Layout,
            children: [{
                path: '',
                component: Login
            }, {
                path: '/register',
                component: Register
            }]
        }, {
            path: '/404',
            component: Layout,
            children: [{
                path: '',
                component: Error404
            }]
        }, {
            path: '*',
            redirect: '/404'
        }
    ]
})