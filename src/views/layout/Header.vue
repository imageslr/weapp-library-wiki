<template>
    <el-menu class="wrap" theme="dark">
        <div class="header">
            <router-link to="/" class="header-logo">图书WIKI系统</router-link>
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
                    欢迎你，{{nickname}} 
                    <i class="el-icon-setting" style="margin-left: 5px"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="type == 1" command="changepassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout" :divided="type == 1">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <div v-else class="header-action__link" @click="showLogin">登录 / 注册</div>
            </div>
            <login-dialog ref="loginDialog"></login-dialog>
            <change-password-dialog ref="changePasswordDialog"></change-password-dialog>
        </div>
    </el-menu>
</template>
<script>
import screenfull from '../../components/Screenfull.vue';
import loginDialog from './components/LoginDialog.vue';
import changePasswordDialog from './components/ChangePasswordDialog.vue';
import { mapGetters } from 'vuex';
export default {
    components: {
        screenfull,
        loginDialog,
        changePasswordDialog
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
            inputValue: '',

            loginDialogVisible: false
        }
    },
    computed: {
        token() {
            return this.$store.getters.token;
        },
        nickname() {
            return this.$store.getters.nickname;
        },
        type() {
            return this.$store.getters.type;
        },
    },
    watch: {
        '$route': function() {
            // 切换页面时清空输入框
            if (this.$route.path != '/search' || this.$route.query.keyword != this.inputValue)
                this.inputValue = '';
        }
    },
    methods: {
        showLogin: function() {
            this.$refs.loginDialog.show();
        },
        onSubmit: function() {
            this.$router.push({
                path: '/search',
                query: {
                    type: this.selectedType,
                    keyword: this.inputValue,
                    p: 1,
                    t: Date.now() // 添加此参数使得每次按下回车时，都会触发route的变化
                }
            });
        },
        handleCommand: function(command) {
            if (command == 'logout') {
                this.$store.dispatch('LOGOUT').then(() => {
                    // 如果在需要授权的页面，则返回到主页
                    if (this.$route.meta.requireAuth) {
                        this.$router.replace({ path: '/401' });
                    }
                });
            }
            if (command == 'changepassword') {
                this.$refs.changePasswordDialog.show();
            }
        }
    }
}
</script>
<style scoped>
.wrap {
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

.el-dropdown,
.header-action__link {
    display: inline-block;
    vertical-align: top;
    color: #fff;
    cursor: pointer;
    font-size: 14px;
}
</style>
<style>
.header-search__input .el-input-group__prepend,
.header-search__input .el-input__inner {
    background-color: #fff;
    border: 0;
}

.header-search__input .el-input__inner {
    border-left: 1px solid #bfcbd9;
    padding-right: 0;
    transition: width 0.15s ease;
    -webkit-transition: width 0.15s ease;
    -moz-transition: width 0.15s ease;
}

.header-search__input .el-input__inner:focus {
    width: 300px;
}

.header-search__input .el-select .el-input {
    width: 70px;
}
</style>