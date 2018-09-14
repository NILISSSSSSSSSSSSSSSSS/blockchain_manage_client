<template>
    <div class="container">
        <bread title="管理员权限管理" desc="系统的管理员权限设置" :list="breadNav"></bread>
        <div class="recharge-box">
            <div class="recharge">
                <header class="head">管理员权限</header>
                <h2 class="title">管理员账号信息</h2>
                <div class="content">
                    <div class="item">
                        <span class="name">账号</span>
                        <el-input class="val" :disabled="!isRoot ? true : adminId ? true : false" v-model="admin.username" placeholder="管理员账号" />
                    </div>
                    <div class="item">
                        <span class="name">密码</span>
                        <el-input class="val" :disabled="!isRoot ? true : false" v-model="admin.pass" type="password" placeholder="管理员密码"></el-input>
                    </div>
                    <div class="item">
                        <span class="name">确认密码</span>
                        <el-input class="val" :disabled="!isRoot ? true : false" v-model="admin.passAgain" type="password" placeholder="再次输入管理员密码"></el-input>
                    </div>
                </div>
                <!-- <h2 class="title">
                    <em>管理员权限配置</em>
                    <el-checkbox :disabled="!isRoot ? true : false" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                </h2> -->

                <div class="lists">

                    <div class="sub-title">站内交易权限配置</div>
                    <el-checkbox class="list" v-model="all.advert_GET" @change="changeOne">挂单展示</el-checkbox>
                    <el-checkbox class="list" v-model="all.advert_edit">广告强制上下架</el-checkbox>
                    <el-checkbox class="list" v-model="all.order_GET" @change="changeOne">订单展示</el-checkbox>
                    <el-checkbox class="list" v-model="all.traderecord_GET" @change="changeOne">交易记录展示</el-checkbox>
                    <el-checkbox class="list" v-model="all.transfer_GET" @change="changeOne">转账记录展示</el-checkbox>


                    <div class="sub-title">场内交易权限配置</div>
                    <el-checkbox class="list" v-model="all.qh_GET" @change="changeOne">交易记录展示</el-checkbox>

                    <div class="sub-title">申诉中心权限配置</div>
                    <el-checkbox class="list" v-model="all.appealHistory_GET" @change="changeOne">申诉历史查看</el-checkbox>
                    <el-checkbox class="list" v-model="all.appealHandle_GET">处理领取申诉</el-checkbox>

                    <!-- <el-checkbox class="list" v-model="all.appeal_mark">未领取申诉</el-checkbox>
                    <el-checkbox class="list" v-model="all.appeal_process">已领取申诉</el-checkbox> -->

                    <div class="sub-title">充值提现权限配置</div>
                    <el-checkbox class="list" v-model="all.deposits_GET" @change="changeOne">充值列表展示</el-checkbox>
                    <el-checkbox class="list" v-model="all.withdraws_GET" @change="changeOne">提现列表展示</el-checkbox>

                    <div class="sub-title">用户管理权限配置</div>
                    <el-checkbox class="list" v-model="all.user_GET" @change="changeOne">用户列表展示</el-checkbox>
                    <el-checkbox class="list" v-model="all.record_GET" @change="changeOne">登录日志展示</el-checkbox>
                    <el-checkbox class="list" v-model="all.wallet_GET" @change="changeOne">用户钱包展示</el-checkbox>

                    <div class="sub-title">钱包管理权限配置</div>
                    <el-checkbox class="list" v-model="all.addrpool_GET" @change="changeOne">钱包管理模块展示</el-checkbox>

                    <div class="sub-title">系统管理权限配置</div>
                    <el-checkbox class="list" v-model="all.sysconf_GET" @change="changeOne">系统设置展示</el-checkbox>
                    <el-checkbox class="list" v-model="all.sysconf_edit">系统设置编辑</el-checkbox>

                    <div class="sub-title">数据管理权限配置</div>
                    <el-checkbox class="list" v-model="all.currency_GET" @change="changeOne">Token模块展示</el-checkbox>
                    <el-checkbox class="list" v-model="all.currency_add">添加Token货币</el-checkbox>
                    <el-checkbox class="list" v-model="all.currency_edit">编辑Token货币</el-checkbox>
                    <el-checkbox class="list" v-model="all.fiatCurrency_GET" @change="changeOne">法币模块展示</el-checkbox>
                    <el-checkbox class="list" v-model="all.fiatCurrency_add">添加法定货币</el-checkbox>
                    <el-checkbox class="list" v-model="all.fiatCurrency_edit">编辑法定货币</el-checkbox>
                    <el-checkbox class="list" v-model="all.currencyStat_GET" @change="changeOne">币种统计</el-checkbox>

                    <div class="sub-title">文章管理权限配置</div>
                    <el-checkbox class="list" v-model="all.article_GET" @change="changeOne">文章列表展示</el-checkbox>
                    <el-checkbox class="list" v-model="all.article_add">添加文章</el-checkbox>
                    <el-checkbox class="list" v-model="all.article_del">删除文章</el-checkbox>
                    <el-checkbox class="list" v-model="all.article_edit">编辑文章</el-checkbox>
                    <el-checkbox class="list" v-model="all.label_GET" @change="changeOne">文章标签展示</el-checkbox>
                    <el-checkbox class="list" v-model="all.label_add">添加文章标签</el-checkbox>
                    <el-checkbox class="list" v-model="all.label_del">删除文章标签</el-checkbox>
                    <el-checkbox class="list" v-model="all.label_edit">编辑文章标签</el-checkbox>

                    <div class="sub-title">语言管理权限配置</div>
                    <el-checkbox class="list" v-model="all.lang_GET" @change="changeOne">语言模块展示</el-checkbox>
                    <el-checkbox class="list" v-model="all.lang_add">添加语言</el-checkbox>
                    <!-- <el-checkbox class="list" v-model="all.lang_del">删除语言</el-checkbox> -->
                    <el-checkbox class="list" v-model="all.lang_edit">编辑语言</el-checkbox>

                    <div class="sub-title">糖果发放权限配置</div>
                    <el-checkbox class="list" v-model="all.candy_GET" @change="changeOne">糖果发放模块展示</el-checkbox>
                    <el-checkbox class="list" v-model="all.candy_provide">糖果发放</el-checkbox>

                    <div class="sub-title">统计分析权限配置</div>
                    <el-checkbox class="list" v-model="all.statistics_GET" @change="changeOne">统计分析模块展示</el-checkbox>

                    <div class="sub-title">发币管理权限配置</div>
                    <el-checkbox class="list" v-model="all.issueCurrency_GET" @change="changeOne">发币管理模块展示</el-checkbox>
                </div>
                <!-- <el-checkbox-group class="lists" v-model="checked" @change="checkedChange">
                    <el-checkbox :disabled="!isRoot ? true : false" class="list" v-for="item in competenceList" :label="item.value" :key="item.value">{{item.name}}</el-checkbox>
                </el-checkbox-group> -->
                <div class="btn-box">
                    <el-button type="success" @click="save" :disabled="!isRoot ? true : false">保存</el-button>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import Bread from "components/bread";
import DiaLog from "components/dia-log";
import SelectPage from "components/select-page";
import {
    addAdmin,
    getAdminList,
    getAdminOne,
    editAdminOne,
    deleAdminOne
} from "api/api";
import { validate } from "common/util";
import { datetimeFormat } from "common/util";

export default {
    data() {
        return {
            all: {
                article_GET: true,
                article_add: false,
                article_edit: false,
                article_del: false,
                label_GET: true,
                label_add: false,
                label_edit: false,
                label_del: false,
                candy_GET: true,
                candy_provide: false,
                currency_GET: true,
                currency_add: false,
                currency_edit: false,
                currencyStat_GET: false,
                fiatCurrency_GET: true,
                fiatCurrency_add: false,
                fiatCurrency_edit: false,
                lang_GET: true,
                lang_add: false,
                lang_del: false,
                lang_edit: false,
                sysconf_GET: true,
                sysconf_edit: false,
                // appeal_GET: true,
                // appeal_mark: false,
                // appeal_process: false,
                appealHistory_GET: true,
                appealHandle_GET: false,
                deposits_GET: true,
                withdraws_GET: true,
                addrpool_GET: true,
                user_GET: true,
                advert_GET: true,
                advert_edit: false,
                order_GET: true,
                record_GET: true,
                transfer_GET: true,
                wallet_GET: true,
                traderecord_GET: true,
                statistics_GET: true,
                issueCurrency_GET: true,
                qh_GET: true
            },
            // all: {},
            admin: {
                username: "",
                pass: "",
                passAgain: "",
                enabled: false
            },
            isRoot: false,
            adminId: "", //判断是新增还是编辑
            breadNav: [
                { name: "管理员", path: "" },
                { name: "管理员列表", path: "/administrator/list" },
                { name: "管理员权限配置", path: "" }
            ]
        };
    },
    created() {
        this.isRoot = sessionStorage.getItem("isRoot");
        this.adminId = this.$route.params.id;
        if (this.adminId) {
            this._getAdminOne();
        } else {
            let all = {
                article_GET: true,
                article_add: false,
                article_edit: false,
                article_del: false,
                label_GET: true,
                label_add: false,
                label_edit: false,
                label_del: false,
                candy_GET: true,
                candy_provide: false,
                currency_GET: true,
                currency_add: false,
                currency_edit: false,
                currencyStat_GET: false,
                fiatCurrency_GET: true,
                fiatCurrency_add: false,
                fiatCurrency_edit: false,
                lang_GET: true,
                lang_add: false,
                lang_del: false,
                lang_edit: false,
                sysconf_GET: true,
                sysconf_edit: false,
                // appeal_GET: true,
                // appeal_mark: false,
                // appeal_process: false,
                appealHistory_GET: true,
                appealHandle_GET: false,
                deposits_GET: true,
                withdraws_GET: true,
                addrpool_GET: true,
                user_GET: true,
                advert_GET: true,
                advert_edit: false,
                order_GET: true,
                record_GET: true,
                transfer_GET: true,
                wallet_GET: true,
                traderecord_GET: true,
                statistics_GET: true,
                issueCurrency_GET: true,
                qh_GET: true
            };
            this.all = all;
        }
    },
    methods: {
        changeOne(val) {
            // console.log(val);
            if (!this.all.article_GET) {
                this.all.article_add = false;
                this.all.article_del = false;
                this.all.article_edit = false;
            }
            if (!this.all.label_GET) {
                this.all.label_add = false;
                this.all.label_del = false;
                this.all.label_edit = false;
            }
            if (!this.all.candy_GET) {
                this.all.candy_provide = false;
            }
            if (!this.all.currency_GET) {
                this.all.currency_add = false;
                this.all.currency_edit = false;
            }
            if (!this.all.fiatCurrency_GET) {
                this.all.fiatCurrency_add = false;
                this.all.fiatCurrency_edit = false;
            }
            if (!this.all.lang_GET) {
                this.all.lang_add = false;
                this.all.lang_del = false;
                this.all.lang_edit = false;
            }
            if (!this.all.sysconf_GET) {
                this.all.sysconf_edit = false;
            }
            if(!this.all.advert_GET){
                this.all.advert_edit = false
            }
            // if (!this.all.appeal_GET) {
            //     this.all.appeal_mark = false;
            //     this.all.appeal_process = false;
            // }
        },
        _getAdminOne() {
            getAdminOne({
                adminId: this.adminId
            }).then(res => {
                if (res.code == 0) {
                    let data = res.data;
                    this.admin.username = data.username || "";
                    let arr = data.permissions || [];

                    arr.forEach(item => {
                        if (item.action == "*") {
                            item.action = "GET";
                        }
                        let key = `${item.controller}_${item.action}`;
                        this.all[key] = item.val;
                    });
                    // console.log(this.all);
                } else {
                    this.$message.error(res.msg || "请求失败");
                }
            });
        },
        save() {
            let permissions = this.dealPostData(this.all);
            // console.log(permissions);
            if (!this.isName(this.admin.username.trim())) {
                this.$message.error(
                    "用户名由3-20位数字、英文字母或者下划线组成"
                );
                return;
            }

            if (this.adminId) {
                //判断是编辑还是新增
                //编辑
                let postObj = {
                    adminId: this.adminId,
                    nickname: this.admin.username.trim(),
                    permissions: permissions
                    // newPwd: this.sha1(this.admin.pass.trim()),
                    // affirmPwd: this.sha1(this.admin.passAgain.trim())
                };
                if (this.admin.pass.trim()) {
                    if (!this.isPass(this.admin.pass.trim())) {
                        this.$message.error(
                            "密码长度在6~18之间，只能包含字母、数字和下划线"
                        );
                        return;
                    }
                    if (
                        !this.passAgain(
                            this.admin.pass.trim(),
                            this.admin.passAgain.trim()
                        )
                    ) {
                        this.$message.error("两次密码输入不一致");
                        return;
                    }
                    (postObj.newPwd = this.sha1(this.admin.pass.trim())),
                        (postObj.affirmPwd = this.sha1(
                            this.admin.passAgain.trim()
                        ));
                }
                if (!this.editOnce) {
                    this.editOnce = true;
                    editAdminOne(postObj).then(res => {
                        this.editOnce = false;
                        if (res.code == 0) {
                            this.$message.success(res.msg || "编辑成功");
                            this.clear()
                            this.competenceList = [];
                            this.$router.push({
                                path: `/administrator/list`
                            });
                        } else {
                            this.$message.error(res.msg || "编辑失败");
                        }
                    });
                }
            } else {
                //新增
                if (!this.isPass(this.admin.pass.trim())) {
                    this.$message.error(
                        "密码长度在6~18之间，只能包含字母、数字和下划线"
                    );
                    return;
                }
                if (
                    !this.passAgain(
                        this.admin.pass.trim(),
                        this.admin.passAgain.trim()
                    )
                ) {
                    this.$message.error("两次密码输入不一致");
                    return;
                }
                let postObj = {
                    username: this.admin.username.trim(),
                    password: this.sha1(this.admin.pass.trim()),
                    affirmPwd: this.sha1(this.admin.passAgain.trim()),
                    permissions: permissions
                };
                if (!this.addOnce) {
                    this.addOnce = true;
                    addAdmin(postObj).then(res => {
                        this.addOnce = false;
                        if (res.code == 0) {
                            this.$message.success(res.msg || "添加成功");
                            this.clear();
                            this.competenceList = [];
                            this.$router.push({
                                path: `/administrator/list`
                            });
                        } else {
                            this.$message.error(res.msg || "添加失败");
                        }
                    });
                }
            }
        },
        isName(str) {
            let reg = /^\w{3,20}$/; //用户名由3-20位数字、英文字母或者下划线组成
            return validate(reg, str);
        },
        isPass(str) {
            let reg = /^\w{6,18}$/; //密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)
            return validate(reg, str);
        },
        passAgain(oldpass, newpass) {
            return oldpass === newpass;
        },
        clear() {
            this.admin.username = "";
            this.admin.pass = "";
            this.admin.passAgain = "";
        },
        dealData(arr) {},
        dealPostData(all) {
            let res = [];
            for (let key in all) {
                let tmp = key.split("_");
                let obj = {};
                obj.controller = tmp[0];
                obj.action = tmp[1] == "GET" ? "*" : tmp[1];
                obj.val = all[key];
                res.push(obj);
            }
            return res;
        }
    },
    watch: {
        all: {
            handler: function(newVal, oldVal) {
                for (let key in newVal) {
                    let controller = key.split("_")[0];
                    let action = key.split("_")[1];
                    if (controller == "article" && action !== "GET") {
                        if (newVal[key]) {
                            this.all.article_GET = true;
                            // this.all.label_GET = true;
                        }
                    }
                    if (controller == "label" && action !== "GET") {
                        if (newVal[key]) {
                            this.all.label_GET = true;
                        }
                    }
                    if (controller == "lang" && action !== "GET") {
                        if (newVal[key]) {
                            this.all.lang_GET = true;
                        }
                    }
                    if (controller == "fiatCurrency" && action !== "GET") {
                        if (newVal[key]) {
                            this.all.fiatCurrency_GET = true;
                        }
                    }
                    if (controller == "currency" && action !== "GET") {
                        if (newVal[key]) {
                            this.all.currency_GET = true;
                        }
                    }
                    if (controller == "candy" && action !== "GET") {
                        if (newVal[key]) {
                            this.all.candy_GET = true;
                        }
                    }
                    if (controller == "sysconf" && action !== "GET") {
                        if (newVal[key]) {
                            this.all.sysconf_GET = true;
                        }
                    }
                    if (controller == "advert" && action !== "GET") {
                        if (newVal[key]) {
                            this.all.advert_GET = true;
                        }
                    }
                    if (controller == "currencyStat" && action !== "GET") {
                        if (newVal[key]) {
                            this.all.currencyStat_GET = true;
                        }
                    }
                    // if (controller == "appeal" && action !== "GET") {
                    //     if (newVal[key]) {
                    //         this.all.appeal_GET = true;
                    //     }
                    // }
                }
            },
            deep: true
        }
    },
    components: {
        Bread,
        DiaLog,
        SelectPage
    }
};
</script>
<style lang="scss" scoped>
@import "~assets/style/variable";

.recharge-box {
    padding: 20px;
    .recharge {
        width: 100%;
        min-height: 700px;
        background: #fff;
        .head {
            padding: 15px;
            border-bottom: 1px solid #f3f3f3;
            font-size: 16px;
        }
        .title {
            display: block;
            padding: 15px;
            padding-bottom: 0;
            font-size: 14px;
        }
        .content {
            padding: 15px;
            display: flex;
            // flex-direction: column;
            flex-wrap: wrap;
            .item {
                display: flex;
                margin-bottom: 10px;
                margin-right: 2%;
                height: 40px;
                width: 46%;
                align-items: center;
                &:last-of-type {
                    margin-bottom: 0;
                }
                @media (max-width: 1200px) {
                    width: 95%;
                }
                .name {
                    flex: 0 0 80px;
                    display: flex;
                    justify-content: space-between;
                }
                .val {
                    flex: 1;
                }
            }
        }
        .lists {
            padding: 15px;
            .sub-title {
                font-size: 14px;
                color: rgba(0, 0, 0, 0.85);
                font-weight: 700;
            }
            .list {
                // margin-right: 10px;
                // margin-bottom: 10px;
                margin: 10px;
                margin-left: 0;
            }
        }
        .btn-box {
            padding: 15px;
            padding-bottom: 20px;
        }
    }
}
</style>

