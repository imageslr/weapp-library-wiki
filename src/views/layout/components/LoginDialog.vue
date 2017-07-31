<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" @open="resetAll()">
        <div class="container">
            <el-form v-show="dialogType=='login'" :model="loginForm" :rules="loginRules" ref="loginForm" label-width="0px" label-position="left">
                <el-form-item prop="username">
                    <el-input class="login-input" v-model="loginForm.username" :placeholder="'用户名: ' + tips.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input class="login-input" type="password" :placeholder="'密码: '+ tips.password" v-model="loginForm.password" @keyup.enter.native="login"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-radio-group v-model="type" @change="reset">
                        <el-radio-button label="1">Wiki系统用户</el-radio-button>
                        <el-radio-button label="2">图书馆管理员</el-radio-button>
                        <el-radio-button label="3">小程序用户</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-button type="primary" :loading="loginLoading" @click="login">登录</el-button>
                <el-button type="text" @click="toggleDialog('register')">注册</el-button>
            </el-form>
            <el-form v-show="dialogType=='register'" :model="registerForm" :rules="registerRules" ref="registerForm" label-width="0px" label-position="left">
                <el-form-item prop="email">
                    <el-input class="login-input" v-model="registerForm.email" placeholder="邮箱"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input class="login-input" type="password" placeholder="密码" v-model="registerForm.password"></el-input>
                </el-form-item>
                <el-form-item prop="confirmPassword">
                    <el-input class="login-input" type="password" placeholder="确认密码" v-model="registerForm.confirmPassword"></el-input>
                </el-form-item>
                <el-form-item prop="nickname">
                    <el-input class="login-input" placeholder="昵称" v-model="registerForm.nickname"></el-input>
                </el-form-item>
                <el-button type="primary" :loading="registerLoading" @click="register">注册</el-button>
                <el-button type="text" @click="toggleDialog('login')">登录</el-button>
            </el-form>
        </div>
    </el-dialog>
</template>
<script>
import { phoneTest, emailTest, emailValidator, passwordValidator } from '../../../utils/validate.js';
export default {
    data() {
        return {
            loginForm: {
                username: undefined,
                password: undefined
            },
            type: 1, // 登录账号类型
            loginRules: {
                username: [{
                    required: true,
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (this.type == 1 && !emailTest(value)) {
                            callback(new Error('请输入正确的邮箱'));
                        } else if ((this.type == 2 || this.type == 3) && !phoneTest(value)) {
                            callback(new Error('请输入正确的手机号'));
                        } else {
                            callback();
                        }
                    }
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur',
                    /* validator: passwordValidator */
                }]
            },
            loginLoading: false,

            registerForm: {
                email: undefined,
                password: undefined,
                confirmPassword: undefined,
                nickname: undefined
            },
            registerRules: {
                email: [{ required: true, trigger: 'blur', validator: emailValidator }],
                password: [{
                    required: true,
                    trigger: 'blur',
                    mmessage: '请输入密码，长度6~25位'
                }, {
                    min: 6,
                    max: 25,
                    trigger: 'blur',
                    message: '密码长度6~25位'
                }, {
                    validator: (rule, value, callback) => {
                        if (this.registerForm.confirmPassword) {
                            this.$refs.registerForm.validateField('confirmPassword');
                        }
                        callback();
                    }
                }],
                confirmPassword: [{
                    required: true,
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (!value) {
                            callback(new Error('请再次输入密码'));
                        } else if (value != this.registerForm.password) {
                            callback(new Error('两次输入密码不一致'));
                        } else {
                            callback();
                        }
                    }
                }],
                nickname: [{
                    required: true,
                    trigger: 'blur',
                    validator: (rule, value, callback) => {
                        if (!value) {
                            callback(new Error('请输入昵称'));
                        } else if (value.length > 25) {
                            callback(new Error('昵称不得超过25个字符'));
                        } else {
                            callback();
                        }
                    }
                }]
            },
            registerLoading: false,

            dialogVisible: false,
            dialogType: 'login',
        }
    },
    computed: {
        title: function() {
            if (this.dialogType == 'login') return '登录';
            else return '注册';
        },
        tips: function() {
            if (this.type == 1) {
                return {
                    type: "Wiki系统用户",
                    username: "您注册此系统时所设置的邮箱号",
                    password: "您注册此系统时所设置的密码"
                }
            } else if (this.type == 2) {
                return {
                    type: "图书馆管理员",
                    username: "您登录图书馆后台管理系统的手机号",
                    password: "您登录图书馆后台管理系统的密码"
                }
            } else if (this.type == 3) {
                return {
                    type: "小程序用户",
                    username: "您登录小程序“附近的图书馆”的手机号",
                    password: "您在小程序内设置的身份证号"
                }
            }
        }
    },
    methods: {
        show() {
            this.dialogVisible = true;
        },
        toggleDialog(type) {
            this.dialogType = type;
            this.$refs[type + 'Form'].resetFields();
        },
        reset() {
            if (this.loginForm.username || this.loginForm.password) {
                if (this.loginForm.username) this.$refs['loginForm'].validateField('username');
                if (this.loginForm.password) this.$refs['loginForm'].validateField('password');
            } else {
                this.$refs['loginForm'].resetFields();
            }
        },
        resetAll() {
            this.$refs['loginForm'].resetFields();
            this.$refs['registerForm'].resetFields();
            this.type = 1;
            this.dialogType = 'login';
        },
        login() {
            this.$refs.loginForm.validate((valid) => {
                if (!valid) return;

                this.loginLoading = true;

                let params = Object.assign({}, this.loginForm);
                params.type = this.type;
                this.$store.dispatch('LOGIN', params).then(() => {
                    this.dialogVisible = false;
                    this.$message.success('登录成功');
                }).catch((res) => {
                    if (res.code == 400) {
                        this.$message.error('账号或密码错误');
                    }
                }).finally(() => {
                    this.loginLoading = false;
                });
            });
        },
        register() {
            this.$refs.registerForm.validate((valid) => {
                if (!valid) return;
            });
        },
    }
}
</script>
<style scoped>
.container {
    margin: 0 auto;
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
    margin: 0 0 10px 0;
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