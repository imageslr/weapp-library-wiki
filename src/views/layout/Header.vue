<template>
    <el-menu class="wrap" theme="dark">
        <div class="header">
            <router-link to="/" class="header-logo">图书Wiki系统</router-link>
            <div class="header-search">
                <el-input @keyup.native.enter="onSubmit" class="header-search__input" size="small" placeholder="搜索" v-model="inputValue">
                    <el-select v-model="selectedType" slot="prepend" placeholder="请选择">
                        <el-option v-for="item in searchTypes" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-input>
            </div>
            <div class="header-action">
                <screenfull class='header-action__screenfull'></screenfull>
                <el-dropdown v-if="token" trigger="click" @command="handleCommand">
                    <span class="header-action__link">
                    欢迎你，{{username}} 
                    <i class="el-icon-setting" style="margin-left: 5px"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="changepassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="loginout" divided>退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span v-else class="header-action__link">登录 / 注册</span>
            </div>
        </div>
    </el-menu>
</template>
<script>
import screenfull from '../../components/Screenfull.vue';
export default {
    components: {
        screenfull
    },
    data() {
        return {
            searchTypes: [{
                label: '书名',
                value: 'title'
            }, {
                label: '作者',
                value: 'author'
            }, {
                label: 'ISBN',
                value: 'isbn'
            }],
            selectedType: 'title',
            inputValue: ''
        }
    },
    watch: {
        '$route': function() {
            // 切换页面时清空输入框
            if(this.$route.path != '/search' || this.$route.query.keyword != this.inputValue)
                this.inputValue = '';  
        }
    },
    computed: {
        token() {
            return false;
        },
        username() {
            return "管理员";
        },
        path() {
            return this.$route.path.replace('/', '');
        }
    },
    methods: {
        onSubmit: function() {
            this.$router.push({
                path: 'search',
                query: {
                    type: this.selectedType,
                    keyword: this.inputValue
                }
            });
        }
    }
}
</script>
<style scoped>
.wrap {
    z-index: 999;
    position: relative;
    width: 100%;
    height: 60px;
}

.header {
    position: relative;
    box-sizing: border-box;
    margin: 0 35px;
    height: 100%;
    font-size: 22px;
    color: #fff;
}

.header-logo {
    float: left;
    margin-right: 50px;
    line-height: 60px;
    color: #fff;
    text-decoration-line: none;
}

.header-search {
    position: relative;
    display: table-cell;
    width: 220px;
    height: 60px;
    vertical-align: middle;
}

.header-action {
    position: absolute;
    top: 0;
    right: 0;
    line-height: 60px;
}

.header-action__screenfull {
    margin-right: 10px;
}

.header-action__link {
    display: inline-block;
    vertical-align: top;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
}
</style>