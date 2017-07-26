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
    NProgress.start(); // 开启Progress
    next();
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