import Vue from 'vue';
import Router from 'vue-router';
import Layout from '../views/layout/Layout.vue';
import Index from '../views/index/index.vue';
import Search from '../views/search/index.vue';
import Edit from '../views/edit/index.vue';
import Book from '../views/book/index.vue';
import Error401 from '../views/error/401.vue';
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
        path: '/edit',
        component: Layout,
        children: [{
            path: '',
            component: Edit,
            meta: { requireAuth: true, redirectWhen404: true },
        }]
    }, {
        path: '/create',
        component: Layout,
        children: [{
            path: '',
            component: Edit,
            meta: { requireAuth: true },
        }]
    }, {
        path: '/book/:id',
        component: Layout,
        children: [{
            path: '',
            component: Book,
            name: 'book',
            meta: { redirectWhen404: true }
        }]
    }, {
        path: '/401',
        component: Layout,
        children: [{
            path: '',
            component: Error401
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
    }]
})