<template>
  <div class="login" >
    <!-- <header class="head">OTCEX</header> -->
    <div class="title">管理员登陆</div>
    <el-form class="form" :model="form" label-width="80px" >
      <el-input class="input-item input-name" ref="name" autofocus v-model="form.name" placeholder="用户名" @keyup.enter.native="login"></el-input>
      <el-input class="input-item input-pass" placeholder="用户密码" type="password" v-model="form.password" @keyup.enter.native="login"></el-input>
      <el-button class="input-item login-btn" type="primary" @click="login"  >登录</el-button>
      <el-checkbox class="input-item checked" v-model="form.memory">
        <i>记住我</i>
      </el-checkbox>
    </el-form>
  </div>
</template>
<script>
import { validate } from "common/util";
import { login } from "api/api";
import { mapMutations } from "vuex";

export default {
    data() {
        return {
            form: {
                name: "",
                password: "",
                memory: false
            }
        };
    },
    created() {
        let loginMsg = localStorage.getItem("loginMsg") || "";
        if (!!loginMsg) {
            loginMsg = JSON.parse(loginMsg);
            this.form = loginMsg;
        }
    },
    mounted(){
        setTimeout(() => {
            this.$refs.name.focus()
        },20)
    },
    methods: {
        login() {
            // this.$router.push({
            //               path: "index"
            //           });
            let postObj = {
                username: this.form.name.trim(),
                // password: this.form.password.trim()
                password: this.sha1(this.form.password.trim())
            };
            if (!this.isName()) {
                this.$message.error(
                    "用户名由3-20位数字、英文字母或者下划线组成"
                );
                return;
            }
            if (!this.isPass()) {
                this.$message.error(
                    "密码长度在6~18之间，只能包含字母、数字和下划线"
                );
                return;
            }
            if (!this.once) {
                this.once = true;
                login(postObj).then(res => {
                    this.once = false;
                    if (res.code == 0) {
                        // this.setIsRoot(res.data.isRoot)
                        sessionStorage.setItem("token", res.data.token);
                        if (res.data.isRoot) {
                            sessionStorage.setItem("isRoot", res.data.isRoot);
                        } else {
                            sessionStorage.setItem("isRoot", "");
                        }
                        this.$message.success(res.msg || "登录成功");
                        if (this.form.memory) {
                            localStorage.setItem(
                                "loginMsg",
                                JSON.stringify(this.form)
                            );
                        } else {
                            localStorage.setItem("loginMsg", "");
                        }
                        // this.setUsername(res.data.username)
                        sessionStorage.setItem("username",res.data.username || "")
                        sessionStorage.setItem("permissions",JSON.stringify(res.data.permissions) || "")  //读权限
                        sessionStorage.setItem("wPermissions",JSON.stringify(res.data.wPermissions) || "")  //写权限
                        
                        this.$router.push({
                            path: "index"
                        });
                    } else {
                        this.$message.error(res.msg || "登录失败");
                    }
                }).catch((error) => {
                    this.once = false
                    // console.log(error)
                })
            }
        },
        isName() {
            let reg = /^\w{3,20}$/; //用户名由3-20位数字、英文字母或者下划线组成
            return validate(reg, this.form.name.trim());
        },
        isPass() {
            let reg = /^\w{6,18}$/; //密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)
            return validate(reg, this.form.password.trim());
        },
        ...mapMutations({
            setUsername: "setUsername"
        })
    }
};
</script>
<style lang="scss" scoped>
@import "~assets/style/variable";

.login {
    width: 100%;
    height: 100%;
    background: #323232;
    color: $color-text-white;
    text-align: center;
    .head {
        padding: 30px 0;
        background: #000;
        font-size: 22px;
    }
    .title {
        padding: 30px 0;
        background: #222224;
        font-size: 22px;
    }
    .form {
        // width: 1190px;
        margin: 0 auto;
        padding-top: 50px;
        .checked {
            text-align: left;
        }
    }
    .input-item {
        height: 42px;
        width: 330px;
        margin: 0 auto;
        margin-bottom: 10px;
        display: block;
    }
}
</style>
<style>
.input-name .el-input__inner {
    background: #222224;
    color: #fff;
}
.input-item .el-input__inner {
    border: none;
}
.input-pass .el-input__inner {
    background: rgb(250, 255, 189);
}
.login-btn {
    background-color: #5cc691;
    border-color: #5cc691;
}
</style>



