<template>
    <div class="container">
        <app-head></app-head>
        <transition name="fade" mode="out-in">
            <div class="main">
                <router-view :key="$route.fullPath"></router-view>
            </div>
        </transition>
    </div>
</template>
<script>
import AppHead from './Header.vue';
export default {
    components: {
        AppHead
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