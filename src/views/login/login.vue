<template>
    <div class="login-container">
        <h3 class="title">登录</h3>
        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="0px" label-position="left">
            <el-form-item prop="username">
                <el-input class="login-input" v-model="loginForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input class="login-input" type="password" placeholder="密码" v-model="loginForm.password" @keyup.enter.native="login"></el-input>
            </el-form-item>
            <el-form-item>
                <el-radio-group v-model="loginForm.type">
                    <el-radio-button label="1">Wiki系统用户</el-radio-button>
                    <el-radio-button label="2">图书馆管理员</el-radio-button>
                    <el-radio-button label="3">小程序用户</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-button type="primary" :loading="loginLoading" @click="login">登录</el-button>
        </el-form>
        <div class="tips">当前账号类型：{{tips.type}}</div>
        <div class="tips">用户名：{{tips.username}}</div>
        <div class="tips">密码：{{tips.password}}</div>
    </div>
</template>
<script>
import { phoneValidator, emailValidator, passwordValidator } from '../../utils/validate.js';
export default {
    data() {
        return {
            loginForm: {
                type: 1,
                username: undefined,
                password: undefined
            },

            loginLoading: false
        }
    },
    computed: {
        loginRules: function() {
            return {
                username: [
                    { required: true, trigger: 'blur', validator: emailValidator }
                ],
                password: [
                    { required: true, trigger: 'blur', validator: passwordValidator }
                ]
            }

        },
        tips: function() {
            if (this.loginForm.type == 1) {
                return {
                    type: "Wiki系统用户",
                    username: "您注册此系统时所设置的邮箱号",
                    password: "您注册此系统时所设置的密码"
                }
            } else if (this.loginForm.type == 2) {
                return {
                    type: "图书馆管理员",
                    username: "您登录图书馆后台管理系统的手机号",
                    password: "您登录图书馆后台管理系统的密码"
                }
            } else if (this.loginForm.type == 3) {
                return {
                    type: "小程序用户",
                    username: "您登录小程序“附近的图书馆”的手机号",
                    password: "您在小程序“附近的图书馆”内设置的身份证的后6位"
                }
            }
        }
    },
    methods: {
        login() {

        }
    }
}
</script>
<style scoped>
.login-container {
    margin: 50px auto;
    width: 332px;
}

.title {
    font-size: 28px;
    color: #353535;
    margin: 0 auto 30px;
    text-align: center;
    font-weight: 700;
}

.el-button {
    width: 100%;
    /* height: 47px; */
    margin-bottom: 20px;
}

.tips {
    font-size: 14px;
    color: #5e6d82;
    margin-bottom: 5px;
}
</style>
<style>
.login-input input {
    height: 47px;
    padding: 12px 5px 12px 15px;
}
</style>