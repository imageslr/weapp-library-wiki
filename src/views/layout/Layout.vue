<template>
    <div class="container">
        <app-head ref="header"></app-head>
        <transition name="fade" mode="out-in">
            <div class="main">
                <router-view :key="$route.fullPath" v-on:showLogin="$refs.header.showLogin()"></router-view>
            </div>
        </transition>
        <feedback v-on:showLogin="$refs.header.showLogin()"></feedback>
    </div>
</template>
<script>
import AppHead from './Header.vue';
import feedback from '../../components/Feedback.vue';
export default {
    components: {
        AppHead, feedback
    }
}
</script>
<style scoped>

.container {
    display: flex;
    flex-direction: column;
    min-height: 100%;
}

.main {
    flex: 1;
    width: 950px;
    margin: 0 auto;
    padding: 40px 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .3s
}

.fade-enter,
.fade-leave-to
/* .fade-leave-active in <2.1.8 */

{
    opacity: 0
}
</style>