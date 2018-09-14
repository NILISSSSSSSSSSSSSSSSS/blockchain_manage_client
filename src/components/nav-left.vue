<template>
    <el-menu :default-active="currentRoute" class="side-left" background-color="#32323a" text-color="#fff" :router="router" :unique-opened=true :collapse="isCollapse" ref="elMenu">
        <el-menu-item index="/dashboard">
            <icon name="tachometer" class="icon"></icon>
            <span>dashboard</span>
        </el-menu-item>
        <el-submenu index="deal" v-show="permissions.advert || permissions.order || permissions.traderecord">
            <template slot="title">
                <icon name="exchange" class="icon"></icon>
                <span slot="title">站内交易</span>
            </template>
            <el-menu-item index="/deal/pending" v-show="permissions.advert">
                挂单
            </el-menu-item>
            <el-menu-item index="/deal/order" v-show="permissions.order">
                订单
            </el-menu-item>
            <el-menu-item index="/deal/record" v-show="permissions.traderecord">
                交易记录
            </el-menu-item>
            <el-menu-item index="/deal/transfer" v-show="permissions.transfer">
                用户转账记录
            </el-menu-item>
            <el-menu-item index="/deal/transfer/record" v-show="permissions.transfer">
                接口转账记录
            </el-menu-item>
        </el-submenu>
            <el-submenu index="cangNei" v-show="permissions.qh">
            <template slot="title">
                <icon name="exchange" class="icon"></icon>
                <span slot="title">场内交易</span>
            </template>
            <el-menu-item index="/cangNei/index" v-show="permissions.qh">
                交易记录
            </el-menu-item>
        </el-submenu>
        <el-submenu index="complaint" v-show="permissions.appealHistory || permissions.appealHandle">
            <template slot="title">
                <!-- <icon name="credit-card" class="icon"></icon> -->
                <i class="iconfont icon-shensu" style="color: #fff;"></i>
                <span slot="title">申诉中心</span>
            </template>
            <el-menu-item index="/complaint/record" v-show="permissions.appealHistory">
                已处理申诉
            </el-menu-item>
            <el-menu-item index="/complaint/noreceive" v-show="permissions.appealHandle">
                未领取申诉
            </el-menu-item>
            <el-menu-item index="/complaint/receive" v-show="permissions.appealHandle">
                我已领取的申诉
            </el-menu-item>
        </el-submenu>
        <el-submenu index="cashlists" v-show="permissions.deposits || permissions.withdraws">
            <template slot="title">
                <icon name="credit-card" class="icon"></icon>
                <!-- <i class="el-icon-document"></i> -->
                <span slot="title">充值提现</span>
            </template>
            <el-menu-item index="/cashlists/withdraw" v-show="permissions.withdraws">
                提现列表
            </el-menu-item>
            <el-menu-item index="/cashlists/recharge" v-show="permissions.deposits">
                充值列表
            </el-menu-item>
        </el-submenu>
        <el-submenu index="user" v-show="permissions.user || permissions.record || permissions.wallet">
            <template slot="title">
                <icon class="icon" name="users"></icon>
                <span slot="title">用户管理</span>
            </template>
            <el-menu-item index="/user/userlist" v-show="permissions.user">
                用户列表
            </el-menu-item>
            <el-menu-item index="/user/loginlog" v-show="permissions.record">
                登录日志
            </el-menu-item>
            <el-menu-item index="/user/wallet" v-show="permissions.wallet">
                用户钱包
            </el-menu-item>
        </el-submenu>
        <el-submenu index="wallet" v-show="permissions.addrpool">
            <template slot="title">
                <icon class="icon" name="money"></icon>
                <span>钱包管理</span>
            </template>
            <el-menu-item index="/wallet/pool">
                钱包池
            </el-menu-item>
        </el-submenu>
        <el-submenu index="system" v-show="permissions.sysconf">
            <template slot="title">
                <icon class="icon" name="wrench"></icon>
                <span>系统</span>
            </template>
            <el-menu-item index="/system/list">
                系统配置
            </el-menu-item>
        </el-submenu>
        <el-submenu index="database" v-show="permissions.currency || permissions.fiatCurrency">
            <template slot="title">
                <icon class="icon" name="database"></icon>
                <span>数据管理</span>
            </template>
            <el-menu-item index="/database/fabi" v-show="permissions.fiatCurrency">
                法币
            </el-menu-item>
            <el-menu-item index="/database/tokenlist" v-show="permissions.currency">
                token列表
            </el-menu-item>
            <el-menu-item index="/database/rollin" v-show="permissions.currencyStat">
                币种统计
            </el-menu-item>
        </el-submenu>
        <el-submenu index="article" v-show="permissions.article || permissions.label">
            <template slot="title">
                <icon class="icon" name="envelope"></icon>
                <span>文章管理</span>
            </template>
            <el-menu-item index="/article/list" v-show="permissions.article">
                文章列表
            </el-menu-item>
            <el-menu-item index="/article/tags" v-show="permissions.label">
                标签管理
            </el-menu-item>
        </el-submenu>
        <el-submenu index="language" v-show="permissions.lang">
            <template slot="title">
                <icon class="icon" name="language"></icon>
                <span>语言管理</span>
            </template>
            <el-menu-item index="/language/list">
                语言列表
            </el-menu-item>
        </el-submenu>
        <el-submenu index="administrator" ref="administrator" v-if="isRoot">
            <template slot="title">
                <icon class="icon" name="user"></icon>
                <span>管理员</span>
            </template>
            <el-menu-item index="/administrator/list">
                管理员列表
            </el-menu-item>
        </el-submenu>
        <el-submenu index="candy" v-show="permissions.candy">
            <template slot="title">
                <icon class="icon" name="gift"></icon>
                <span>糖果发放</span>
            </template>
            <el-menu-item index="/candy/send">
                糖果发放
            </el-menu-item>
        </el-submenu>
        <el-submenu index="statistics" v-show="permissions.statistics">
            <template slot="title">
                <icon class="icon" name="table"></icon>
                <span>统计分析</span>
            </template>
            <el-menu-item index="/statistics/analysis">
                统计分析
            </el-menu-item>
        </el-submenu>
        <el-submenu index="manager" v-show="permissions.issueCurrency">
            <template slot="title">
                <!-- <icon class="icon" name="table"></icon> -->
                <em class="iconfont icon-currency"></em>
                <span>发币管理</span>
            </template>
            <el-menu-item index="/manager/sendcoin">
                发币管理
            </el-menu-item>
        </el-submenu>
    </el-menu>
</template>
<script>
import { getAdminPermissions } from "api/api";

export default {
    data() {
        return {
            router: true,
            currentRoute: "/index",
            isRoot: false,
            permissions: {
                article: true,
                label: false,
                lang: true,
                fiatCurrency: true,
                currency: true,
                currencyStat:true,
                candy: true,
                sysconf: true,
                addrpool: true,
                user: true,
                record: true,
                wallet: true,
                deposits: true,
                withdraws: true,
                appeal: true,
                advert: true,
                order: true,
                traderecord: true,
                appealHistory: true,
                appealHandle: true,
                statistics: true,
                transfer: true,
                issueCurrency: true,
                qh:true
            }
        };
    },
    props: {
        isCollapse: {
            type: Boolean,
            default: false
        }
    },
    created() {
        this.currentRoute = this.$route.path;
        this.isRoot = sessionStorage.getItem("isRoot") || false;

        let permissions = sessionStorage.getItem("permissions") || "";
        if (permissions) {
            permissions = JSON.parse(permissions);
        } else {
            permissions = [];
        }
        permissions.forEach(item => {
            let key = item.controller;
            this.permissions[key] = item.val;
        });
        // this._getAdminPermissions()
    },
    // computed: {},
    mounted() {
        setTimeout(() => {
            this.collapseItem();
            if (!this.isRoot) {
                // this.$refs.administrator.$el.style.display = "none";
            }
        }, 20);
    },
    methods: {
        collapseItem() {
            const path = this.currentRoute.split("/")[1];
            if (path == "dashboard") {
                return;
            }
            this.$refs.elMenu.open(path);
        }
    },
    watch: {
        currentRoute(newVal, oldVal) {
            if (newVal != oldVal) {
                if (this.$refs.elMenu) {
                    this.collapseItem();
                }
            }
        }
    }
};
</script>
<style lang="scss" scoped>
@import "~assets/style/variable";

.side-left {
    width: 240px;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    padding-top: 60px;
    z-index: 100;
    overflow-y: auto;
    // transition: all 0.3s !important;
    .icon {
        display: inline-block;
        width: 16px;
        margin-right: 2px;
    }
    &::-webkit-scrollbar-button {
        display: none;
    }
    &::-webkit-scrollbar {
        width: 6px;
        height: 100%;
        border-radius: 4px;
        // background-color: #f00;
    }
    &::-webkit-scrollbar-thumb {
        // height: 40px;
        background-color: #a5a5a5;
        border-radius: 4px;
    }
    &::-webkit-scrollbar-track-piece {
        background: #eee;
    }
    &::-webkit-scrollbar-corner{
        border-radius: 4px;
    }
    &::-webkit-scrollbar-track{
        border-radius: 4px;
    }
}
</style>
<style>
.side-left .is-active {
    background-color: rgb(40, 40, 46) !important;
}
.el-menu--collapse {
    width: 64px !important;
}
.el-menu {
    transition: all 0s !important;
}
</style>


