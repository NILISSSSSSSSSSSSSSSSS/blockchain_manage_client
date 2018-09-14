<template>
    <div class="container">
        <bread title="token详情" desc="token的详细信息" :list="breadNav"></bread>
        <div class="detail-box">
            <div class="detail">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <div class="infos">
                            <header class="head">基本信息</header>
                            <div class="content">
                                <div class="item">
                                    <div class="name">虚拟币代码</div>
                                    <div class="val">{{token.name || ""}}</div>
                                </div>
                                <div class="item">
                                    <div class="name">合约地址(基于ETH)</div>
                                    <div class="val">{{token.contactAddress || ""}}</div>
                                </div>
                                <div class="item">
                                    <div class="name">合约地址(基于BTC)</div>
                                    <div class="val">{{token.btcOmniId || ""}}</div>
                                </div>
                                <div class="item">
                                    <div class="name">初始单价</div>
                                    <div class="val">{{token.initPrice ? `${token.initPrice} $` : ""}}</div>
                                    <!-- <div class="val">
                                        <el-input placeholder="初始单价" v-model="token.initPrice">
                                        </el-input>
                                    </div> -->
                                </div>

                                <div class="item">
                                    <div class="name">手续费比例</div>
                                    <div class="val">
                                        <el-input placeholder="请输入手续费比例" v-model="token.orderFeePercent">
                                            <el-button slot="append">%</el-button>
                                        </el-input>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="name">挂单溢价上限限制</div>
                                    <div class="val">
                                        <el-input placeholder="请输入挂单溢价上限" v-model="token.overPercentCeil">
                                            <el-button slot="append">%</el-button>
                                        </el-input>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="name">挂单溢价下限限制</div>
                                    <div class="val">
                                        <el-input placeholder="请输入挂单溢价下限" v-model="token.overPercentfloor">
                                            <el-button slot="append">%</el-button>
                                        </el-input>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="name">广告可展示最少数量</div>
                                    <div class="val">
                                        <el-input placeholder="请输入广告可展示最少数量" v-model="token.minAvailableAmountOfSell" />
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="name">广告费</div>
                                    <div class="val">
                                        <el-input placeholder="请输入广告费" v-model="token.advertiseCostAmount" />
                                    </div>
                                </div>
                                <!-- <div class="item">
                                <div class="name">单笔充值最少数量</div>
                                <div class="val"><el-input placeholder="请输入单笔充值最少数量" v-model="token.depositsAffirmMinAmount" /></div>
                            </div> -->
                                <div class="item">
                                    <div class="name">充值确认数</div>
                                    <div class="val">
                                        <el-input placeholder="请输入充值确认数" v-model="token.depositsAffirmCount" />
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="name">提币所需矿工费</div>
                                    <div class="val">
                                        <el-input placeholder="请输入提币所需矿工费" v-model="token.withdrawsFee" />
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="name">最小提币数量</div>
                                    <div class="val">
                                        <el-input placeholder="请输入最小提币数量(值必须大于提币矿工费)" v-model="token.withdrawsMin" />
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="name">汇率采集模式</div>
                                    <div class="val">
                                        <el-select v-model="token.exchangeRateMode" @change="selectMode" class="acquisition" placeholder="请选择">
                                            <el-option v-for="item in acquisitionMode" :key="item.value" :label="item.name" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="name">广告费用支付方式</div>
                                    <div class="val">
                                        <el-select v-model="token.advertiseFeeSetting" @change="selectMode" class="acquisition" placeholder="请选择">
                                            <el-option v-for="item in feePayWay" :key="item.value" :label="item.name" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="name">订单交易费用支付方式</div>
                                    <div class="val">
                                        <el-select v-model="token.orderFeeSetting" @change="selectMode" class="acquisition" placeholder="请选择">
                                            <el-option v-for="item in feePayWay" :key="item.value" :label="item.name" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="name">官方币手续费折扣</div>
                                    <div class="val">
                                        <el-input placeholder="请输入折扣" v-model="token.officialFeePercent">
                                            <el-button slot="append">%</el-button>
                                        </el-input>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="name">提现费用支付方式</div>
                                    <div class="val">
                                        <el-select v-model="token.withdrawsFeeSetting" @change="selectMode" class="acquisition" placeholder="请选择">
                                            <el-option v-for="item in feePayWay" :key="item.value" :label="item.name" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="name">POS机支付状态</div>
                                    <div class="val">
                                        <el-select v-model="token.posPayStatus" @change="selectMode" class="acquisition" placeholder="请选择">
                                            <el-option v-for="item in posPayStatusLists" :key="item.value" :label="item.name" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="name">POS机满减赠送比例</div>
                                    <div class="val">
                                        <el-input placeholder="POS机满减赠送比例" v-model="token.presentRate">
                                            <el-button slot="append">%</el-button>
                                        </el-input>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="name">是否允许订单交易</div>
                                    <div class="val">
                                        <el-switch class="enable" v-model="token.enableTrade" active-color="#13ce66" inactive-color="#dcdfe6">
                                        </el-switch>
                                    </div>
                                </div>
                                <div class="item">
                                    <div class="name">是否启用</div>
                                    <div class="val">
                                        <el-switch class="enable" v-model="token.enabled" active-color="#13ce66" inactive-color="#dcdfe6">
                                        </el-switch>
                                    </div>
                                </div>
                            </div>
                            <div class="btn-box">
                                <el-button class="btn" type="success" @click="sure">确认</el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script>
import Bread from "components/bread";
import { getTokenDetail, editToken } from "api/api";
import {acquisitionMode,feePayWay} from "common/baseData";

export default {
    data() {
        return {
            breadNav: [
                { name: "数据管理", path: "" },
                {name: "token列表", path: "/database/tokenlist"},
                { name: "token信息", path: "" }
            ],
            acquisitionMode: acquisitionMode,
            feePayWay: feePayWay,
            token: {
                enabled: false,
                advertiseCostAmount: 0,
                contactAddress: "",
                btcOmniId: "",
                decimals: 0,
                depositsAffirmCount: 0,
                depositsAffirmMinAmount: 0,
                exchangeRateFrom: [],
                exchangeRateMode: 0,
                minAvailableAmountOfSell: 0,
                name: "",
                officialFeePercent: 0,
                orderFeePercent: 0,
                overPercentCeil: 0,
                overPercentfloor: 0,
                withdrawsFee: 0,
                withdrawsMin: 0,
                advertiseFeeSetting: '',
                orderFeeSetting: '',
                withdrawsFeeSetting: '',
                enableTrade: false,
                initPrice: 0,
                posPayStatus: "",
                presentRate:"",
            },
            currencyId: "",
            posPayStatusLists: [
                {value: 'closePay',name: '关闭支付'},
                {value: 'payByCode',name: '允许支付，需要验证码'},
                {value: 'openPay',name: '允许支付，无需验证码'},
            ]
        };
    },
    created() {
        this.currencyId = this.$route.params.id || "";
        // console.log(this.currencyId);
        if (this.currencyId) {
            this._getTokenDetail();
        } else {
            //   this.$message.error("查询失败")
            this.$router.push({
                path: "/database/tokenlist"
            });
        }
    },
    methods: {
        _getTokenDetail() {
            if (this.currencyId) {
                getTokenDetail({
                    currencyId: this.currencyId
                }).then(res => {
                    if (res.code == 0) {
                        let data = res.data;
                        // this.token = data
                        this.token.enabled = data.enabled || false;
                        if (data.officialFeePercent) {
                            this.token.officialFeePercent =
                                data.officialFeePercent * 100;
                        }
                        if (data.presentRate) {
                            this.token.presentRate =
                                data.presentRate * 100;
                        }
                        if (data.orderFeePercent) {
                            this.token.orderFeePercent =
                                data.orderFeePercent * 100;
                        }
                        if (data.overPercentCeil) {
                            this.token.overPercentCeil =
                                data.overPercentCeil * 100;
                        }
                        if (data.overPercentfloor) {
                            let tmpStr = Number(data.overPercentfloor) + "";
                            data.overPercentfloor = tmpStr.slice(1);
                            this.token.overPercentfloor =
                                data.overPercentfloor * 100;
                        }
                        this.token.advertiseCostAmount =
                            data.advertiseCostAmount || 0;
                        this.token.contactAddress = data.contactAddress || "";
                        this.token.btcOmniId = data.btcOmniId || "";
                        this.token.decimals = data.decimals || 0;
                        this.token.depositsAffirmCount =
                            data.depositsAffirmCount || 0;
                        this.token.depositsAffirmMinAmount =
                            data.depositsAffirmMinAmount || 0;
                        this.token.exchangeRateFrom =
                            data.exchangeRateFrom || [];
                        this.token.exchangeRateMode =
                            data.exchangeRateMode || 0;
                        this.token.minAvailableAmountOfSell = data.minAvailableAmountOfSell || 0;
                        this.token.name = data.name || "";
                        this.token.withdrawsFee = data.withdrawsFee || 0;
                        this.token.withdrawsMin = data.withdrawsMin || 0;
                        this.token.advertiseFeeSetting = data.advertiseFeeSetting || ""
                        this.token.orderFeeSetting = data.orderFeeSetting || ""
                        this.token.withdrawsFeeSetting = data.withdrawsFeeSetting || ""
                        this.token.enableTrade = data.enableTrade || false
                        this.token.initPrice = data.initPrice || 0
                        this.token.posPayStatus = data.posPayStatus || ""
                        // console.log(this.token)
                    }
                });
            }
        },
        selectMode(mode) {
            //   this.token.
        },
        sure() {
            //   console.log(this.token)
            if (!this.isNumber(this.token.officialFeePercent)) {
                this.$message.error("官方币手续费折扣必须为数字");
                return;
            }
            if (!this.token.presentRate) {
                // console.log(this.token.orderFeePercent,typeof this.token.orderFeePercent)
                this.$message.error("POS机满减赠送比例不能为空");
                return;
            }
            if (!this.isNumber(this.token.presentRate)) {
                // console.log(this.token.orderFeePercent,typeof this.token.orderFeePercent)
                this.$message.error("POS机满减赠送比例必须为数字");
                return;
            }
           
            if (!this.isNumber(this.token.orderFeePercent)) {
                // console.log(this.token.orderFeePercent,typeof this.token.orderFeePercent)
                this.$message.error("官方币手续费比例必须为数字");
                return;
            }
            if (!this.isNumber(this.token.overPercentCeil)) {
                this.$message.error("挂单溢价上限限制必须为数字");
                return;
            }
            if (!this.isNumber(this.token.overPercentfloor)) {
                this.$message.error("挂单溢价下限限制必须为数字");
                return;
            }
            if (!this.isNumber(this.token.minAvailableAmountOfSell)) {
                this.$message.error("广告可展示数量必须为数字");
                return;
            }
            if (!this.isNumber(this.token.advertiseCostAmount)) {
                this.$message.error("广告费必须为数字");
                return;
            }
            // if(!this.isNumber(this.token.depositsAffirmMinAmount)){
            //     this.$message.error("单笔充值最少数量必须为数字")
            //     return
            // }
            if (!this.isNumber(this.token.depositsAffirmCount)) {
                this.$message.error("充值确认数必须为数字");
                return;
            }
            if (!this.isNumber(this.token.withdrawsFee)) {
                this.$message.error("提币所需矿工费必须为数字");
                return;
            }
            if(!this.isNumber(this.token.withdrawsMin)){
                this.$message.error("最小提币数量必须为数字,且值必须大于提币旷工费")
                return
            }
            if( this.token.withdrawsMin - this.token.withdrawsFee <= 0 ){
                this.$message.error("最小提币数量必须大于提币旷工费")
                return
            }
            if (!this.token.exchangeRateMode) {
                this.$message.error("汇率采集模式必选");
                return;
            }
            if (!this.token.advertiseFeeSetting) {
                this.$message.error("广告费用支付方式必选");
                return;
            }
            if (!this.token.orderFeeSetting) {
                this.$message.error("订单交易费用支付方式必选");
                return;
            }
            if (!this.token.withdrawsFeeSetting) {
                this.$message.error("提现费用支付方式必选");
                return;
            }
            if (!this.token.posPayStatus) {
                this.$message.error("POS机支付状态必选");
                return;
            }
            let postObj = {
                presentRate:this.token.presentRate / 100,
                officialFeePercent: this.token.officialFeePercent / 100,
                orderFeePercent: this.token.orderFeePercent / 100,
                overPercentCeil: this.token.overPercentCeil / 100,
                //   overPercentfloor: "-" + this.token.overPercentfloor / 100,
                minAvailableAmountOfSell: this.token.minAvailableAmountOfSell,
                advertiseCostAmount: this.token.advertiseCostAmount,
                depositsAffirmMinAmount: this.token.depositsAffirmMinAmount,
                depositsAffirmCount: this.token.depositsAffirmCount,
                withdrawsFee: this.token.withdrawsFee,
                withdrawsMin: this.token.withdrawsMin,
                exchangeRateMode: this.token.exchangeRateMode,
                advertiseFeeSetting: this.token.advertiseFeeSetting,
                orderFeeSetting: this.token.orderFeeSetting,
                withdrawsFeeSetting: this.token.withdrawsFeeSetting,
                enabled: this.token.enabled,
                enableTrade: this.token.enableTrade,
                posPayStatus: this.token.posPayStatus
            };
            let tmpNumber = this.token.overPercentfloor;
            if (tmpNumber < 0) {
                tmpNumber = (tmpNumber + "").slice(1);
            }
            postObj.overPercentfloor = Number(`-${tmpNumber / 100}`);
            //   console.log(postObj)
            if (this.currencyId) {
                postObj.currencyId = this.currencyId;
                if (!this.editOnce) {
                    this.editOnce = true;
                    editToken(postObj).then(res => {
                        this.editOnce = false;
                        if (res.code == 0) {
                            this.$message.success(res.msg || "编辑成功");
                            this.$router.push({
                                path: "/database/tokenlist"
                            });
                        } else {
                            this.$message.error(res.msg || "编辑失败");
                        }
                    });
                }
            }
        },
        isFloat(str) {
            let reg = /^0[.]\d{1,8}$/; //0-1之间
            return reg.test(str);
        },
        isNumber(str) {
            let reg = /^(-?\d+)(\.\d+)?$/; //浮点数
            return reg.test(str);
        }
    },
    components: {
        Bread
    }
};
</script>
<style lang="scss" scoped>
@import "~assets/style/variable";

.detail-box {
    padding: 20px;
}
.detail {
    width: 100%;

    .infos {
        background: #fff;
        margin-bottom: 20px;
        padding-bottom: 20px;
        min-height: 700px;
        .head {
            padding: 15px 20px;
            border-bottom: 1px solid #f3f3f3;
        }
        .content {
            padding: 20px;
            display: flex;
            overflow: hidden;
            flex-wrap: wrap;
            .item {
                display: flex;
                width: 40%;
                // width: 70%;
                // height: 38px;
                // line-height: 38px;
                padding: 5px 0;
                align-items: center;
                margin-bottom: 10px;
                margin-right: 40px;
                // border-bottom: 1px solid #ddd;
                &:nth-of-type(2n) {
                    margin-right: 0;
                }
                .name {
                    width: 140px;
                    overflow: hidden;
                    margin-right: 10px;
                    font-size: $font-size-small;
                    color: rgb(50, 50, 50);
                    font-weight: 700;
                }
                .val {
                    flex: 1;
                    // overflow: hidden;
                    .acquisition {
                        width: 100%;
                    }
                    .enable {
                        // margin-left: 20px;
                    }
                }
            }
        }
        .btn-box {
            padding: 10px 20px;
        }
    }
}
@media screen and (max-width: 1190px) {
    .detail .item {
        width: 80% !important;
    }
}
</style>


