<template>
    <div class="box">
        <nav-left :isCollapse="isCollapse" ref="navLeft"></nav-left>
        <header class="header">
            <div class="logo" ref="logo">
                <img src="./logo.png" class="logo-img" ref="logoImg" width="32" height="32" alt="">
                <span v-show="!isCollapse">管理中心</span>
            </div>
            <div class="exit-box">
                <span class="icon-box" @click="toggleNav">
                    <icon name="th-list" class="icon"></icon>
                </span>
                <!-- trigger="click" -->
                <el-dropdown class="exit">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="modify">修改密码</el-dropdown-item>
                        <el-dropdown-item @click.native="exit">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </header>
        <div class="body-container" ref="bodyContainer">
            <router-view></router-view>
        </div>
        <dia-log title="修改密码" class="dia-log" ref="modify" @sure="sureModify">
            <div class="content">
                <div class="item">
                    <span class="desc">输入旧密码:</span>
                    <el-input class="input" v-model="admin.originPwd" type="password" placeholder="请输入旧密码"></el-input>
                </div>
                <div class="item">
                    <span class="desc">输入新密码:</span>
                    <el-input class="input" v-model="admin.newPwd" type="password" placeholder="请输入新密码"></el-input>
                </div>
                <div class="item">
                    <span class="desc">确认新密码:</span>
                    <el-input class="input" v-model="admin.affirmPwd" type="password" placeholder="请确认新密码"></el-input>
                </div>
            </div>
        </dia-log>
    </div>
</template>
<script>
import NavLeft from "components/nav-left";
import DiaLog from "components/dia-log";
import { loginOut ,modifySecret} from "api/api";
import { mapGetters } from "vuex";
import {validate} from "common/util"

export default {
    data() {
        return {
            isCollapse: false,
            token: "",
            username: "",
            admin: {
                originPwd: "",
                newPwd: "",
                affirmPwd: ""
            }
        };
    },
    // computed: {
    //     ...mapGetters(['username'])
    // },
    created() {
        this.username = sessionStorage.getItem("username") || "";
        this.token = sessionStorage.getItem("token") || "";
        if (!this.token) {
            this.$message.error("token已过期,请重新登录");
            this.$router.push({
                path: "/"
            });
        }
        // console.log(this.token);
    },
    methods: {
        exit() {
            loginOut().then(res => {
                if (res.code == 0) {
                    sessionStorage.setItem("token", "");
                    sessionStorage.setItem("username","");
                    this.$router.push({
                        path: "/"
                    });
                }
            });
        },
        toggleNav() {
            this.isCollapse = !this.isCollapse;
            this.$refs.bodyContainer.style.marginLeft = this.isCollapse
                ? "64px"
                : "240px";
            this.$refs.logo.style.width = this.isCollapse ? "63px" : "239px";
            if (this.isCollapse) {
                this.$refs.logoImg.style.marginLeft = "14px";
            }
        },
        modify() {
            this.$refs.modify.show();
        },
        sureModify() {
            if (!this.isPass(this.admin.originPwd.trim()) || !this.isPass(this.admin.newPwd.trim())) {
                this.$message.error(
                    "密码长度在6~18之间，只能包含字母、数字和下划线"
                );
                return;
            }
            if (
                !this.passAgain(
                    this.admin.newPwd.trim(),
                    this.admin.affirmPwd.trim()
                )
            ) {
                this.$message.error("两次密码输入不一致");
                return;
            }
            let postObj = {
                originPwd: this.sha1(this.admin.originPwd.trim()),
                newPwd: this.sha1(this.admin.newPwd.trim()),
                affirmPwd: this.sha1(this.admin.affirmPwd.trim())
            }
            modifySecret(postObj).then((res) => {
                if(res.code == 0){
                    this.$message.success(res.msg || "修改成功")
                    this.$refs.modify.hide()
                }else{
                    this.$message.error(res.msg || "修改失败")
                }
            })

        },
        isPass(str) {
            let reg = /^\w{6,18}$/; //密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)
            return validate(reg, str);
        },
        passAgain(oldpass, newpass) {
            return oldpass === newpass;
        }
    },
    components: {
        NavLeft,
        DiaLog
    }
};
</script>
<style lang="scss" scoped>
@import "~assets/style/variable";

.box {
    height: 100%;
    .body-container {
        margin-left: 240px;
        padding-top: 60px;
        box-sizing: border-box;
        background-color: #f3f3f3;
        // min-height: 886px;
        height: 100%;
        overflow: auto;
    }
    .header {
        position: fixed;
        top: 0;
        left: 0;
        height: 60px;
        width: 100%;
        background-color: #fff;
        line-height: 60px;
        display: flex;
        align-items: centr;
        z-index: 100;
        .exit-box {
            flex: 1;
            color: #ffffff;
            .icon-box {
                float: left;
                width: 60px;
                height: 60px;
                text-align: center;
                line-height: 60px;
                color: #384246;
                font-size: 24px;
                cursor: pointer;
            }
            .exit {
                float: right;
                color: #8b8b8b;
                height: 40px;
                margin-right: 40px;
            }
        }
        .logo {
            // transition: all 0.3s;
            display: flex;
            width: 239px;
            background-color: #32323a;
            // justify-content: center;
            align-items: center;
            font-size: 22px;
            color: #fff;
            border-right: solid 1px #e6e6e6;
            .logo-img {
                margin-left: 20px;
                margin-right: 10px;
            }
        }
    }
}
.dia-log {
    .content {
        display: flex;
        flex-direction: column;
        .item {
            display: flex;
            height: 36px;
            width: 100%;
            margin-bottom: 10px;
            align-items: center;
            .desc {
                flex: 0 0 100px;
            }
            .input {
                flex: 1;
            }
        }
    }
}
</style>


