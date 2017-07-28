<template>
    <div>
        <app-head></app-head>
        <transition name="fade" mode="out-in">
            <div class="main">
                <router-view ></router-view>
                <div class="clearfix"></div>
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