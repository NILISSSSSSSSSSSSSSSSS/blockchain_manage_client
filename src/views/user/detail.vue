<template>
    <div class="container">
        <bread title="用户详情" desc="注册用户的详细信息" :list="breadNav"></bread>
        <div class="detail-box">
            <div class="detail">
                <div class="infos">
                    <header class="head">基本信息</header>
                    <div class="content">
                        <div class="item">
                            <div class="name">用户Id</div>
                            <div class="val">{{info.id || ""}}</div>
                        </div>
                        <div class="item">
                            <div class="name">用户昵称</div>
                            <div class="val">{{info.nickName || ""}}</div>
                        </div>
                        <div class="item">
                            <div class="name">推荐人昵称</div>
                            <div class="val">{{info.parentUser ? info.parentUser.nickName : ""}}</div>
                        </div>
                        <div class="item">
                            <div class="name">状态</div>
                            <div class="val">
                                <el-tag size="mini" class="tag" :color="info.isOnline ? '#67c23a' : '#909399' ">
                                    {{info.isOnline ? "在线" : "离线"}}
                                </el-tag>
                            </div>
                        </div>
                        <!-- <div class="item">
                            <div class="name">国家</div>
                            <div class="val">{{info.nation || ""}}</div>
                        </div> -->
                        <div class="item">
                            <div class="name">手机</div>
                            <div class="val">
                                <span class="phone">{{info.phone || ""}}</span>
                                <el-tag type="success" size="mini" v-if="info.phone" class="phone-sta">已验证</el-tag>
                                <el-tag type="success" size="mini" v-if="!info.phone" class="phone-sta">未验证</el-tag>
                            </div>
                        </div>
                        <!-- <div class="item">
                            <div class="name">提币地址</div>
                            <div class="val">{{info.withdrawsAddress || ""}}</div>
                        </div> -->
                        <div class="item">
                            <div class="name">用官方币抵扣手续费</div>
                            <div class="val">{{info.isOfficialFee ? "是" : "否"}}</div>
                        </div>
                        <div class="item">
                            <div class="name">电子邮箱</div>
                            <div class="val">{{info.email || ""}}</div>
                        </div>
                        <div class="item">
                            <div class="name">谷歌二次验证</div>
                            <div class="val">
                                <el-tag size="mini" type="success" >{{info.twoPhase ? "已验证" : "未验证"}}</el-tag>
                            </div>
                        </div>
                        <div class="item">
                            <div class="name">注册Ip</div>
                            <div class="val">{{info.registerIP || ""}}</div>
                        </div>
                        <div class="item">
                            <div class="name">登录时间</div>
                            <div class="val">{{_datetimeFormat(info.signinTime)}}</div>
                        </div>
                        <div class="item">
                            <div class="name">入账最后查询时间</div>
                            <div class="val">{{_datetimeFormat(info.lastQueryTime)}}</div>
                        </div>
                        <div class="item">
                            <div class="name">注册时间</div>
                            <div class="val">{{_datetimeFormat(info.registerTime)}}</div>
                        </div>
                        <div class="item">
                            <div class="name">交易次数</div>
                            <div class="val">{{info.tradeCount || 0}}</div>
                        </div>
                        <div class="item">
                            <div class="name">好评数</div>
                            <div class="val">{{info.positiveComment || 0}}</div>
                        </div>
                        <div class="item">
                            <div class="name">中评数</div>
                            <div class="val">{{info.middleComment || 0}}</div>
                        </div>
                        <div class="item">
                            <div class="name">差评数</div>
                            <div class="val">{{info.negativeComment || 0}}</div>
                        </div>
                    </div>
                    <div class="wallet" v-show="info.wallet && info.wallet.length">
                        <header class="head">用户钱包信息</header>

                        <el-card class="box-card items" v-for="(item ,index) in info.wallet" :key="index" >
                            <ul >
                                <li class="item">
                                    <span class="name">官方币</span>
                                    <span class="val">{{item.currency}}</span>
                                </li>
                                <li class="item">
                                    <span class="name">官方币数量</span>
                                    <span class="val">{{item.currencyAmount}}</span>
                                </li>
                                <li class="item">
                                    <span class="name">锁仓数量</span>
                                    <span class="val">{{item.lockAmount}}</span>
                                </li>
                                <li class="item">
                                    <span class="name">订单冻结数量</span>
                                    <span class="val">{{item.orderFrozenAmount}}</span>
                                </li>
                                <li class="item">
                                    <span class="name">是否可用</span>
                                    <span class="val">{{item.status == 'enable' ? "是" : "否"}}</span>
                                </li>
                            </ul>
                        </el-card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Bread from "components/bread";
import { getUserInfo } from "api/api";
import { datetimeFormat } from "common/util";

export default {
    data() {
        return {
            breadNav: [
                { name: "用户管理", path: "" },
                { name: "用户列表", path: "/user/userlist"},
                { name: "用户详情", path: "" }
            ],
            userId: "",
            info: {}
        };
    },
    created() {
        this.userId = this.$route.params.id;
        this._getUserInfo();
    },
    methods: {
        _getUserInfo() {
            if (!this.userId) {
                return this.$router.push({
                    path: "/user/userlist"
                });
            }
            getUserInfo({
                userId: this.userId
            }).then(res => {
                if (res.code == 0) {
                    this.info = res.data;
                }
            });
        },
        _datetimeFormat(time) {
            return datetimeFormat(time);
        }
    },
    components: {
        Bread
    }
};
</script>
<style lang="scss" scoped>
// @import "~assets/style/variable";

.detail-box {
    padding: 20px;
}
.detail {
    width: 100%;
    .infos {
        background: #fff;
        margin-bottom: 20px;
        padding-bottom: 20px;
        .head {
            padding: 15px 20px;
            border-bottom: 1px solid #f3f3f3;
        }
        .content {
            padding: 20px;
            display: flex;
            flex-wrap: wrap;
            .item {
                display: flex;
                width: 48%;
                height: 38px;
                line-height: 38px;
                // padding: 10px 0;
                align-items: center;
                border-bottom: 1px solid #ddd;
                margin-right: 2%;
                @media (max-width: 1200px) {
                    width: 100%;
                    margin-right: 0;
                }
                .name {
                    width: 150px;
                    overflow: hidden;
                    margin-right: 10px;
                    font-size: 14px;
                    color: rgb(50, 50, 50);
                    font-weight: 700;
                }
                .val {
                    flex: 1;
                    .tag {
                        color: #fff;
                    }
                }
            }
        }
        .wallet {
            .head {
                padding-top: 0;
                color: rgb(50, 50, 50);
                margin-bottom: 10px;
                font-weight: 700;
            }
            .items {
                display: inline-block;
                width: 30%;
                margin-right: 2%;
                box-sizing: border-box;
                padding: 15px;
                // &:nth-of-type(3n){
                //     margin-right: 0;
                // }
                @media (max-width: 1200px) {
                    width: 48%;
                    margin-right: 2%;
                }
                .item {
                    display: flex;
                    width: 100%;
                    height: 38px;
                    line-height: 38px;
                    font-size: 14px;
                    border-bottom: 1px solid #ddd;
                    .name {
                        flex: 0 0 150px;
                        color: rgb(50, 50, 50);
                        font-weight: 700;
                    }
                    .val {
                        flex: 1;
                    }
                }
            }
        }
    }
}
</style>
<style>
.box-card .el-card__body{
    padding: 10px;
}
</style>



