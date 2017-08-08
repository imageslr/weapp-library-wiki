import Vue from 'vue';
import Router from 'vue-router';


Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        component: resolve => require(['../views/layout/Layout.vue'], resolve),
        children: [{ path: '', component: resolve => require(['../views/index/index.vue'], resolve) }]
    }, {
        path: '/search',
        component: resolve => require(['../views/layout/Layout.vue'], resolve),
        children: [{ path: '', component: resolve => require(['../views/search/index.vue'], resolve) }]
    }, {
        path: '/edit',
        component: resolve => require(['../views/layout/Layout.vue'], resolve),
        children: [{
            path: '',
            component: resolve => require(['../views/edit/index.vue'], resolve),
            meta: { requireAuth: true, redirectWhen404: true },
        }]
    }, {
        path: '/create',
        component: resolve => require(['../views/layout/Layout.vue'], resolve),
        children: [{
            path: '',
            component: resolve => require(['../views/edit/index.vue'], resolve),
            meta: { requireAuth: true },
        }]
    }, {
        path: '/book/:id',
        component: resolve => require(['../views/layout/Layout.vue'], resolve),
        children: [{
            path: '',
            component: resolve => require(['../views/book/index.vue'], resolve),
            name: 'book',
            meta: { redirectWhen404: true }
        }]
    }, {
        path: '/401',
        component: resolve => require(['../views/layout/Layout.vue'], resolve),
        children: [{
            path: '',
            component: resolve => require(['../views/error/401.vue'], resolve)
        }]
    }, {
        path: '/404',
        component: resolve => require(['../views/layout/Layout.vue'], resolve),
        children: [{
            path: '',
            component: resolve => require(['../views/error/404.vue'], resolve)
        }]
    }, {
        path: '*',
        redirect: '/404'
    }]
})