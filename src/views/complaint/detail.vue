<template>
    <div class="container">
        <bread title="申诉中心" desc="管理交易的申诉情况" :list="breadList"></bread>
        <div class="order-box">
            <div class="order">
                <!-- <header class="head">申诉详情</header> -->
                <div class="infos">

                    <section class="right">
                        
                        <header class="title">申诉基本信息</header>
                        <section class="base-info">
                            <ul class="items">
                                <li class="item">
                                    <span class="name">申诉处理结果</span>
                                    <div class="val">{{ appeal.processResult == 'success' ? '释放货币' : '取消订单'  }}</div>
                                </li>
                                <li class="item">
                                    <span class="name">申诉处理时间</span>
                                    <div class="val">{{ _datetimeFormat(appeal.processTime) }}</div>
                                </li>
                                <li class="item">
                                    <span class="name">申诉处理人</span>
                                    <div class="val">{{ appeal.processor ? appeal.processor.username : ''  }}</div>
                                </li>
                                <li class="item">
                                    <span class="name">申诉发起人</span>
                                    <div class="val">{{ getAppealUsername(appeal.appealUser) }}</div>
                                </li>
                                <li class="item">
                                    <span class="name">申诉人紧急电话</span>
                                    <div class="val">{{ appeal.tempPhone ? appeal.tempPhone : "" }}</div>
                                </li>
                                <li class="item">
                                    <span class="name">申诉人紧急邮箱</span>
                                    <div class="val">{{ appeal.tempEmail ? appeal.tempEmail : "" }}</div>
                                </li>
                                <li class="item">
                                    <span class="name">申诉理由</span>
                                    <div class="val">
                                        <el-popover trigger="hover" placement="top" v-show="appeal.appealMsg">
                                            <p>{{ appeal.appealMsg }}</p>
                                            <div slot="reference" class="name-wrapper">
                                                <span  class="ellipsis">{{ appeal.appealMsg || ""}}</span>
                                            </div>
                                        </el-popover>
                                        <!-- <span class="ellipsis">{{appeal.appealMsg}}</span> -->
                                    </div>
                                </li>
                                <li class="item">
                                    <span class="name">申诉类型</span>
                                    <div class="val">
                                        <span class="">{{dealAppealType(appeal.appealType)}}</span>
                                    </div>
                                </li>
                                <li class="item">
                                    <span class="name">申诉时间</span>
                                    <div class="val">{{_datetimeFormat(appeal.createTime)}}</div>
                                </li>
                                <!-- <li class="item">
                                    <span class="name">顾客昵称</span>
                                    <div class="val">somours</div>
                                </li> -->
                                <li class="item">
                                    <span class="name">广告主昵称</span>
                                    <div class="val">{{ parseName(order.owner) }}</div>
                                </li>
                                <li class="item">
                                    <span class="name">广告主邮箱</span>
                                    <div class="val">{{ order.owner.email ? order.owner.email : ""}}</div>
                                </li>
                                <li class="item">
                                    <span class="name">广告主电话</span>
                                    <div class="val">{{ order.owner.phone ? order.owner.phone : "" }}</div>
                                </li>
                                <li class="item">
                                    <span class="name">顾客昵称</span>
                                    <div class="val">{{ parseName(order.customer) }}</div>
                                </li>
                                <li class="item">
                                    <span class="name">顾客邮箱</span>
                                    <div class="val">{{ order.customer.email ? order.customer.email : ""}}</div>
                                </li>
                                <li class="item">
                                    <span class="name">顾客电话</span>
                                    <div class="val">{{ order.customer.phone ? order.customer.phone : "" }}</div>
                                </li>
                                <li class="item">
                                    <span class="name">交易方式</span>
                                    <div class="val">{{order.tradeType == 'buy' ? '购买' : '出售'}}</div>
                                </li>
                                <li class="item">
                                    <span class="name">虚拟币代码</span>
                                    <div class="val">{{order.currency || ""}}</div>
                                </li>
                                <li class="item">
                                    <span class="name">法币代码</span>
                                    <div class="val">{{order.fiatCurrency || ""}}</div>
                                </li>
                                <li class="item">
                                    <span class="name">手续费虚拟币</span>
                                    <div class="val">{{order.feeCurrency || ""}}</div>
                                </li>
                                <li class="item">
                                    <span class="name">支付类型</span>
                                    <div class="val">
                                        <!-- {{order.payType || ""}} -->
                                        <span><img :src="payTypeImg(order.payType)" class="deal-img" v-if="payTypeImg(order.payType)" alt=""></span>
                                    </div>
                                </li>
                                <li class="item">
                                    <span class="name">状态</span>
                                    <div class="val">{{statusText(order.status)}}</div>
                                </li>
                                <li class="item">
                                    <span class="name">创建时间</span>
                                    <div class="val">{{_datetimeFormat(order.createTime)}}</div>
                                </li>
                                <!-- <li class="item">
                                    <span class="name">交易方式</span>
                                    <div class="val">{{order.tradeType || ""}}</div>
                                </li> -->
                                <li class="item">
                                    <span class="name">订单编号</span>
                                    <div class="val">{{order.orderCode || ""}}</div>
                                </li>
                                <li class="item">
                                    <span class="name">订单是否延期</span>
                                    <div class="val">{{order.hasExpire ? "是" : "否"}}</div>
                                </li>
                                <li class="item">
                                    <span class="name">成交单价</span>
                                    <div class="val">{{order.unitPrice || ""}}</div>
                                </li>
                                <li class="item">
                                    <span class="name">成交数量</span>
                                    <div class="val">{{order.amount || ""}}</div>
                                </li>
                                <li class="item">
                                    <span class="name">成交的法币金额</span>
                                    <div class="val">{{order.fiatCurrencyAmount || ""}}</div>
                                </li>
                                <!-- <li class="item">
                                    <span class="name">预支付手续费数量</span>
                                    <div class="val">{{order.frozenFeeAmount || ""}}</div>
                                </li> -->
                                <li class="item">
                                    <span class="name">应交手续费数量</span>
                                    <div class="val">{{order.realFeeAmount || 0}}</div>
                                </li>

                            </ul>
                        </section>

                        <header class="title" style="border-top: 1px solid #f3f3f3;">聊天信息记录</header>
                        <section class="chat-msg" v-if="chatRecord.length">
                            <ul class="message" v-if="chatRecord" v-for="(item,index) in chatRecord" :key="index">
                                <li v-if="item.msgType == 'text'">
                                    <p class="time">
                                        <span>{{ _datetimeFormat(item.time) }}</span>
                                    </p>
                                    <div class="main" :class="{ self: item.userId !== userId }">
                                        <span class="nickname">({{item.userId == userId ? '广告主' : '顾客'}})</span>
                                        <img class="avatar" width="30" height="30" :src="item.avatar?item.avatar:defaultAvatar" />
                                        <div class="text">{{ item.context }}</div>
                                    </div>

                                </li>
                                <li v-if="item.msgType == 'img'">
                                    <p class="time">
                                        <span>{{ _datetimeFormat(item.time) }}</span>
                                    </p>
                                    <div class="main" :class="{ self: item.userId !== userId }">
                                        <span class="nickname">({{item.userId == userId ? '广告主' : '顾客'}})</span>
                                        <img class="avatar" width="30" height="30" :src="item.avatar?item.avatar:defaultAvatar" />
                                        <div class="text"><img style="max-width:100%" :src="item.context" alt=""> </div>
                                    </div>

                                </li>
                                <li v-if="item.msgType == 'system'">
                                    <p class="time">
                                        <span>{{ _datetimeFormat(item.time) }}</span>
                                    </p>
                                    <div class="system" v-if="item.context !== 'appeal_cancel'">
                                        {{ item.context | text }}
                                    </div>
                                    <div class="system" v-if="item.context == 'appeal_cancel'">
                                        用户{{item.nickName || "" }} 取消了申诉
                                    </div>
                                </li>
                            </ul>
                        </section>



                    </section>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Bread from "components/bread";
import {
    getAppealProcessedDetail
} from "api/api";
import { datetimeFormat, daterange } from "common/util";
import { paywayImg, appealType, orderStatus } from "common/baseData";
import { parseUser } from "common/mixin";

export default {
    mixins: [parseUser],
    data() {
        return {
            order: {},
            appeal: {},
            chatRecord: [],
            userId: 1,
            breadList: [
                { name: "申诉中心", path: "" },
                { name: "已处理的申诉", path: "/complaint/record"},
                { name: "申诉的详情", path: "" }
            ],
            defaultAvatar: require("assets/image/user_default_pic.png")
        };
    },
    created() {
        let appealId = this.$route.params.id;
        // console.log(appealId);
        if (appealId) {
            this._getAppealProcessedDetail(appealId);
        } else {
            this.$router.push({
                path: `/complaint/record`
            });
        }
    },
    methods: {
        _getAppealProcessedDetail(appealId) {
            getAppealProcessedDetail({
                appealId: appealId
            }).then(res => {
                if (res.code == 0) {
                    this.appeal = res.data || {};
                    this.order = this.appeal.order || {};
                    this.userId = this.order.owner ? this.order.owner._id : ""
                    this.appealId = appealId;
                    this.chatRecord = this.order.chat || [];
                    // if (this.chatRecord.length > 0) {
                    //     for (
                    //         let i = 0, len = this.chatRecord.length;
                    //         i < len;
                    //         i++
                    //     ) {
                    //         let item = this.chatRecord[i];
                    //         if (item.msgType != "system") {
                    //             this.userId = item.userId;
                    //             break;
                    //         }
                    //     }
                    // }
                } else {
                    this.appealId = "";
                    this.mark = false;
                }
            });
        },
        getAppealUsername(id){
            let customer = this.order.customer ? this.order.customer : {}
            let owner = this.order.owner ? this.order.owner : {}
            if(customer._id == id){
                return customer.nickName || ""
            }
            if(owner._id == id){
                return owner.nickName || ""
            }
            return ""
        },
        payTypeImg(img) {
            let index = paywayImg.findIndex(item => {
                return img == item.value;
            });
            if (index > -1) {
                return paywayImg[index].url;
            }
            return "";
        },
        dealAppealType(val) {
            // console.log(val,appealType)
            let index = appealType.findIndex(item => {
                return item.value == val;
            });
            if (index > -1) {
                return appealType[index].name;
            }
            return "";
        },
        statusText(status) {
            let index = orderStatus.findIndex(item => {
                return status == item.value;
            });
            if (index > -1) {
                return orderStatus[index].name;
            }
            return "";
        },
        _datetimeFormat(time) {
            return datetimeFormat(time);
        }
    },
    filters: {
        // 将日期过滤为 hour:minutes
        time(date) {
            if (typeof date === "string") {
                date = new Date(date);
            }
            return date.getHours() + ":" + date.getMinutes();
        },
        text: context => {
            if (context == "pay_ok") {
                return "买家已付款";
            } else if (context == "cancel_order") {
                return "订单取消";
            } else if (context == "coin_ok") {
                return "交易完成";
            } else if (context == "delay") {
                return "订单延期15分钟";
            } else if(context == "appeal"){
                return "订单已经进入申诉流程，请交易双方尽快将相关证据发送到聊天框内，客服人员将在证据齐备后，介入处理";
            }else{
                return ""
            }
        }
    },
    components: {
        Bread
    }
};
</script>
<style lang="scss" scoped>
// @import "~assets/style/variable";

.order-box {
    padding: 20px;
}
.order {
    width: 100%;
    min-height: 100px;
    background: #fff;
    // .head {
    //     padding: 15px;
    //     border-bottom: 1px solid #f3f3f3;
    //     font-size: 16px;
    // }
}

.infos {
    display: flex;
    min-height: 700px;
    padding-bottom: 120px;
    // height: 750px;
    .right {
        flex: 1;
        min-height: 200px;
        .mark {
            padding: 15px;
            padding-bottom: 0;
            .tip {
                color: #f56c6c;
            }
        }
        .title {
            padding: 15px;
            border-bottom: 1px solid #f3f3f3;
        }
        .base-info {
            width: 100%;
            min-height: 170px;
            .items {
                padding: 15px;
                width: 100%;
                border-bottom: 1px solid #f3f3f3;
                display: flex;
                flex-wrap: wrap;
            }
            .item {
                margin-bottom: 10px;
                display: flex;
                height: 30px;
                width: 50%;
                .name {
                    flex: 0 0 120px;
                }
                .val {
                    flex: 1;
                    color: #a3a3a3;
                    .deal-img {
                        width: 30px;
                        height: 30px;
                        display: inline-block;
                        margin-right: 3px;
                        margin-bottom: 3px;
                    }
                    .ellipsis {
                        display: inline-block;
                        width: 200px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
        .chat-msg {
            padding: 0px 15px;
            overflow-y: auto;
            min-height: 450px;
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
            .main {
                position: relative;
                .nickname {
                    position: absolute;
                    z-index: 2;
                    left: -4px;
                    top: -24px;
                    font-size: 12px;
                }
            }
            .system {
                max-width: 60%;
                text-align: center;
                margin: 0 auto;
                padding: 3px 10px;
                font-size: 13px;
                color: #e6a23c;
                border-radius: 4px;
                background-color: #fdf6ec;
            }
            li {
                margin-bottom: 15px;
            }
            .time {
                margin: 7px 0;
                text-align: center;

                > span {
                    display: inline-block;
                    padding: 0 18px;
                    font-size: 12px;
                    color: #fff;
                    border-radius: 2px;
                    background-color: #dcdcdc;
                }
            }
            .avatar {
                float: left;
                margin: 0 10px 0 0;
                border-radius: 3px;
            }
            .text {
                display: inline-block;
                position: relative;
                padding: 0 10px;
                min-height: 30px;
                line-height: 2.5;
                font-size: 12px;
                text-align: left;
                word-break: break-all;
                background-color: #fafafa;
                border-radius: 4px;
                max-width: 50%;
                &:before {
                    content: " ";
                    position: absolute;
                    top: 9px;
                    right: 100%;
                    border: 6px solid transparent;
                    border-right-color: #fafafa;
                }
            }

            .self {
                text-align: right;
                .nickname{
                    right: 0;
                }
                .avatar {
                    float: right;
                    margin: 0 0 0 10px;
                }
                .text {
                    background-color: #b2e281;

                    &:before {
                        right: inherit;
                        left: 100%;
                        border-right-color: transparent;
                        border-left-color: #b2e281;
                    }
                }
            }
        }
        .oprate {
            padding: 15px;
            text-align: right;
        }
    }
}
</style>



