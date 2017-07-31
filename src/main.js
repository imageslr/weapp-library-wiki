import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import App from './App.vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // NProgress样式
import router from './router';
import store from './store';
require('promise.prototype.finally').shim();

Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
    NProgress.start();

    // 如果已经登录且没有获取用户信息，则获取用户信息
    if (store.getters.token && store.getters.id == '') {
        store.dispatch('GET_INFO').finally(() => {
            next(); // hack方法 确保addRoutes已完成
        });
    } else {
        next();
    }
});

router.afterEach(() => {
    NProgress.done(); // 结束Progress
});


new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
});