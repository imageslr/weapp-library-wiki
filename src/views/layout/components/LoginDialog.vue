<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" @close="resetAll()">
    <el-form v-show="dialogType=='login'" class="container" :model="loginForm" :rules="loginRules" ref="loginForm" label-width="80px" label-position="left">
      <el-form-item label="账号类型">
        <el-radio-group v-model="type" @change="reset">
          <el-radio-button label="1">Wiki系统用户</el-radio-button>
          <el-radio-button label="2">图书馆管理员</el-radio-button>
          <el-radio-button label="3">小程序用户</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="username" label="用户名">
        <el-input v-model="loginForm.username" :placeholder="'用户名: ' + tips.username"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" :placeholder="'密码: '+ tips.password" v-model="loginForm.password" @keyup.enter.native="login"></el-input>
      </el-form-item>
    </el-form>
    <div v-show="dialogType=='login'" slot="footer">
      <el-button style="float: left" type="text" @click="toggleDialog('forgotPassword')">忘记密码</el-button>
      <el-button style="float: left" type="text" @click="toggleDialog('register')">注册</el-button>
      <el-button type="primary" :loading="loginLoading" @click="login">登录</el-button>
    </div>
    <el-form v-show="dialogType=='register'" class="container" :model="registerForm" :rules="registerRules" ref="registerForm" label-width="80px" label-position="left">
      <el-form-item prop="email" label="邮箱">
        <el-input placeholder="请输入邮箱" v-model="registerForm.email"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" placeholder="请输入密码" v-model="registerForm.password"></el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword" label="确认密码">
        <el-input type="password" placeholder="请再次输入密码" v-model="registerForm.confirmPassword"></el-input>
      </el-form-item>
      <el-form-item prop="nickname" label="昵称">
        <el-input placeholder="请输入昵称" v-model="registerForm.nickname"></el-input>
      </el-form-item>
    </el-form>
    <div v-show="dialogType=='register'" slot="footer">
      <el-button style="float: left" type="text" @click="toggleDialog('login')">登录</el-button>
      <el-button type="primary" :loading="registerLoading" @click="register">注册</el-button>
    </div>
    <el-form v-show="dialogType=='forgotPassword'" class="container" label-position="top">
      <el-form-item label="请输入您的邮箱">
        <el-input v-model="tmpEmail"></el-input>
      </el-form-item>
    </el-form>
    <div v-show="dialogType=='forgotPassword'" slot="footer">
      <el-button style="float: left" type="text" @click="toggleDialog('register')">注册</el-button>
      <el-button style="float: left" type="text" @click="toggleDialog('login')">登录</el-button>
      <el-button type="primary" :loading="tmpLoading" @click="sendEmail" :disabled="!tmpEmail">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { phoneTest, emailTest, emailValidator, passwordValidator } from '../../../utils/validate.js';
import { register, sendEmail } from '../../../api/index.js';
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
              // callback(new Error('请输入正确的手机号'));
              callback(); // -> 图书馆账号中有的不是手机号，所以暂时不检测
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
        password1: undefined,
        password: undefined,
        confirmPassword: undefined,
        nickname: undefined
      },
      registerRules: {
        email: [{
          required: true,
          trigger: 'blur',
          validator: emailValidator
        }],
        password: [{
          required: true,
          trigger: 'blur',
          message: '请输入密码，长度6~25位'
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
          message: '请再次输入新密码',
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (value !== this.registerForm.password) {
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

      tmpEmail: undefined, // 忘记密码
      tmpLoading: false,

      dialogVisible: false,
      dialogType: 'login',
    }
  },
  computed: {
    title: function() {
      if (this.dialogType == 'login') return '登录';
      else if (this.dialogType == 'register') return '注册';
      else return '忘记密码';
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
    },
    // 切换登录的账号类型时，已填写的字段不重置
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
      this.tmpEmail = undefined;
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
          if (this.$route.path == '/401') {
            this.$router.replace({ path: '/' });
          }
        }).finally(() => {
          this.loginLoading = false;
        });
      });
    },
    register() {
      this.$refs.registerForm.validate((valid) => {
        if (!valid) return;
        this.registerLoading = true;
        register(this.registerForm).then(() => {
          this.$message.success('注册成功');
          this.dialogType = 'login';
        }).finally(() => {
          this.registerLoading = false;
        })
      });
    },
    sendEmail() {
        if(!emailTest(this.tmpEmail)) {
            return this.$message.error("请输入正确的邮箱");
        }
        this.tmpLoading = true;
        sendEmail(this.tmpEmail).then(() => {
          this.$message.success('系统已向您的邮箱发送了一封邮件，请您及时查看');
        }).finally(() => {
          this.tmpLoading = false;
        })
    }
  }
}

</script>
<style scoped>
.container {
  margin: 0 auto;
  width: 412px;
}

.title {
  font-size: 28px;
  color: #353535;
  margin: 0 auto 30px;
  text-align: center;
  font-weight: 700;
}

.tips {
  font-size: 14px;
  color: #5e6d82;
  margin-bottom: 5px;
}

</style>
