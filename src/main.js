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

    // 如果已经登录
    if (store.getters.token) {
        // 如果没有获取用户信息，则获取用户信息
        if (store.getters.id == '') {
            store.dispatch('GET_INFO').then(() => {
                next();
            }).catch(() => {
                ElementUI.Message.error("获取用户信息失败，请刷新重试");
                NProgress.done();
            });
        } else {
            NProgress.done();
            next();
        }
    } else {
        if (to.matched.some(record => record.meta.requireAuth)) {
            next({ path: '/401' });
            NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题
        } else next();
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