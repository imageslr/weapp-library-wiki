<template>
    <div></div>
</template>
<script>
export default {
    created() {
        console.log(this.$route.query);
    },
    watch: {
        '$route': function() {
            console.log(this.$route.query);
        }
    },
}
</script>
<style>
</style>