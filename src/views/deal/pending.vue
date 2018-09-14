<template>
    <div class="container">
        <bread title="挂单交易" desc="管理所有挂单记录" :list="breadNav"></bread>
        <div class="recharge-box">
            <div class="recharge">
                <header class="head">挂单</header>
                <div class="search">
                    <el-input placeholder="用户昵称" v-model="search.nickName" class="item"></el-input>
                    <el-select v-model="search.tradeType" class="item" clearable placeholder="交易类型">
                        <el-option v-for="(item,index) in tradeType" :key="index" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                    <el-select v-model="search.status" class="item" style="width:180px;" clearable placeholder="状态">
                        <el-option v-for="item in advertStatus" :key="item.value" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select class="item" v-model="search.currency" style="width:180px;" clearable placeholder="请选择虚拟币">
                        <el-option v-for="item in currency" :key="item._id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                    <el-select class="item" v-model="search.fiatCurrency" style="width:180px;" clearable placeholder="请选择法币">
                        <el-option v-for="item in fiatCurrency" :key="item._id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                    <div class="search-time">
                        <span class="name">创建时间</span>
                        <el-date-picker v-model="search.startDate" value-format="timestamp" type="date" placeholder="选择开始日期">
                        </el-date-picker>
                        <el-date-picker v-model="search.endDate" value-format="timestamp" type="date" placeholder="选择结束日期">
                        </el-date-picker>
                        <!-- <span v-show="search.createTime">{{search.createTime}}</span> -->
                    </div>
                    <div class="search-time">
                        <span class="name">过期时间</span>
                        <el-date-picker v-model="search.dStartDate" value-format="timestamp" type="date" placeholder="选择开始日期">
                        </el-date-picker>
                        <el-date-picker v-model="search.dEndDate" value-format="timestamp" type="date" placeholder="选择结束日期">
                        </el-date-picker>
                        <!-- <span v-show="search.expireTime">{{search.expireTime}}</span> -->
                    </div>
                    <!-- <el-date-picker class="date" v-model="search.time" value-format="timestamp" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker> -->
                    <el-button type="success" @click="searchBtn">搜索</el-button>
                </div>
                <div class="table">
                    <el-table ref="table" :data="tableData" @sort-change="sortChange" :header-cell-style="{color: 'rgba(0,0,0,.85)','text-align': 'center'}" :cell-style="{'text-align': 'center'}" style="width: 100%">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    <el-form-item label="对标交易所">
                                        <span>{{ props.row.exchange }}</span>
                                    </el-form-item>
                                    <el-form-item label="溢价点数">
                                        <span>{{ props.row.overPercent }}</span>
                                    </el-form-item>
                                    <el-form-item label="官方币单价限制价格">
                                        <span>{{ props.row.limitPrice }}</span>
                                    </el-form-item>
                                    <el-form-item label="单笔交易上限金额">
                                        <span>{{ props.row.orderCeilPrice }}</span>
                                    </el-form-item>
                                    <el-form-item label="单笔交易下限金额">
                                        <span>{{ props.row.orderFloorPrice }}</span>
                                    </el-form-item>
                                    <el-form-item label="最大订单数限制">
                                        <span>{{ props.row.maxOrderLimit }}</span>
                                    </el-form-item>
                                    <el-form-item label="成交次数">
                                        <span>{{ props.row.tradeCount }}</span>
                                    </el-form-item>
                                    <el-form-item label="成交次数限制">
                                        <span>{{ props.row.tradeCountLimit }}</span>
                                    </el-form-item>
                                    <el-form-item label="广告类型">
                                        <span>{{ props.row.adType }}</span>
                                    </el-form-item>
                                    <el-form-item label="是否需要手机验证">
                                        <span>{{props.row.isIdentityVerify ? "是" : "否"}}</span>
                                    </el-form-item>
                                    <el-form-item label="是否需要谷歌验证">
                                        <span>{{props.row.isadvancedVerify ? "是" : "否"}}</span>
                                    </el-form-item>
                                    <el-form-item label="系统锁定虚拟币时间">
                                        <span>{{Math.floor(props.row.LockMinute / 1000 /60)}}分钟</span>
                                    </el-form-item>
                                    <el-form-item label="更新时间">
                                        <span>{{ _datetimeFormat(props.row.updateTime) }}</span>
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column prop="tradeType" label="交易类型" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{tradeTypeName(scope.row.tradeType)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="owner" label="分配用户昵称" sortable="custom">
                            <template slot-scope="scope">
                                <span class="user" @click="toUser(scope.row.owner)">{{parseName(scope.row.owner)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="currency" label="token代码" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="fiatCurrency" label="法币代码" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="allowPay" label="交易方式" sortable="custom">
                            <template slot-scope="scope">
                                <span>
                                    <img :src="showPayImg(item)" v-if="showPayImg(item)" class="deal-img" alt="#" v-for="(item,index) in scope.row.allowPay" :key="index">
                                </span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="remark" label="交易备注">
                        </el-table-column> -->
                        <el-table-column prop="status" label="状态" sortable="custom">
                            <template slot-scope="scope">
                                <el-tag size="small" class="tag" :color="backColor(scope.row.status)" close-transition>{{statusText(scope.row.status)}}</el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column prop="createTime" label="创建时间" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{_datetimeFormat(scope.row.createTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="deadline" label="过期时间" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{_datetimeFormat(scope.row.deadline)}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column prop="" label="操作" v-if="permissions.advert_edit">
                            <template slot-scope="scope">
                                <!-- <span>{{_datetimeFormat(scope.row.deadline)}}</span> -->
                                <el-button @click="editAdvert(scope.row._id,scope.row.status)" type="primary" size="mini" :disabled="scope.row.status == 'delete' ? true : false">{{scope.row.status == 'online' ? '强制下架' : '强制上架'}}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="pagenation">
                        <select-page @changeSize="changeSize" :total="page.total" />
                        <el-pagination background layout="prev, pager, next,jumper" :current-page="page.page" :page-size="page.pageSize" :total="page.total" @current-change="handleCurrentChange">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <dia-log title="修改广告状态" ref="dialog" @sure="editAdvertSure">
            <div class="banner">确认{{selectAdvertStatus == 'online' ? '下架' : '上架'}}此广告</div>
        </dia-log>
    </div>

</template>
<script>
import Bread from "components/bread";
import SelectPage from "components/select-page";
import DiaLog from "components/dia-log";
import { getAdvertList ,editAdvertOne } from "api/api";
import { datetimeFormat, daterange ,getWpermissions } from "common/util";
import { advertStatus, paywayImg } from "common/baseData";
import { getCurrencyList, getFiatCurrencyList, parseUser } from "common/mixin";


export default {
    mixins: [getCurrencyList, getFiatCurrencyList, parseUser],
    data() {
        return {
            breadNav: [
                { name: "站内交易", path: "" },
                { name: "挂单", path: "/deal/pending" }
            ],
            search: {
                nickName: "",
                tradeType: "",
                status: "",
                currency: "",
                fiatCurrency: "",
                startDate: "",
                endDate: "",
                time: [],
                dStartDate: "",
                dEndDate: "",
                sort: ""
            },
            tradeType: [
                { value: "buy", name: "购买" },
                { value: "sell", name: "出售" }
            ],
            advertStatus: advertStatus,
            selectAdvertStatus: "",
            selectAdvertId: "",
            permissions: {
                advert_edit: false
            },
            tableData: [],
            page: {
                page: 1,
                pageSize: 10,
                total: 0
            }
        };
    },
    created() {
        getWpermissions(this.permissions)
        this._getAdvertList();
    },
    methods: {
        editAdvertSure(){
            if(this.selectAdvertId && this.selectAdvertStatus){
                let postObj = {
                    advertId: this.selectAdvertId,
                    status: ""
                }
                if(this.selectAdvertStatus == 'delete'){
                    this.$message.error("已删除的广告无上架下架操作")
                    return 
                }else if(this.selectAdvertStatus == 'online'){
                    postObj.status = 'offline'
                }else if (this.selectAdvertStatus == 'offline'){
                    postObj.status = 'online'
                }
                editAdvertOne(postObj).then((res) => {
                    if(res.code == 0){
                        this.$message.success(res.msg || "修改成功")
                        this.$refs.dialog.hide()
                        this._getAdvertList()
                    }else{
                        this.$message.error(res.msg || "修改失败")
                    }
                })
            }
        },
        editAdvert(id,status){
            this.selectAdvertId = id
            this.selectAdvertStatus = status
            this.$refs.dialog.show()
        },
        sortChange({ column, prop, order }) {
            if (order == "ascending") {
                this.search.sort = `${prop}.asc`;
            } else if (order == "descending") {
                this.search.sort = `${prop}.desc`;
            } else {
                this.search.sort = "";
            }
            this._getAdvertList();
        },
        _getAdvertList() {
            let startDate = this.search.startDate,
                endDate = this.search.endDate,
                dStartDate = this.search.dStartDate,
                dEndDate = this.search.dEndDate;
            let flag = daterange(startDate, endDate, "创建时间");
            let dFlag = daterange(dStartDate, dEndDate, "过期时间");
            if (!flag) {
                return;
            }
            if (!dFlag) {
                return;
            }
            // if(startDate && endDate){
            //     this.search.createTime = datetimeFormat(startDate) + "至" + datetimeFormat(endDate)
            // }
            // if(dStartDate && dEndDate){
            //     this.search.expireTime = datetimeFormat(dStartDate) + '至' + datetimeFormat(dEndDate)
            // }

            let searchObj = {
                page: this.page.page,
                pageSize: this.page.pageSize,
                nickName: this.search.nickName,
                status: this.search.status,
                tradeType: this.search.tradeType,
                currency: this.search.currency,
                fiatCurrency: this.search.fiatCurrency,
                sort: this.search.sort,
                startDate: startDate,
                endDate: endDate,
                dStartDate: dStartDate,
                dEndDate: dEndDate
            };

            getAdvertList(searchObj).then(res => {
                if (res.code == 0) {
                    this.tableData = res.data.list;
                    this.page.total = res.data.count;
                } else {
                    this.$message.error(res.msg || "获取失败");
                }
            });
        },
        searchBtn() {
            this.$refs.table.clearSort();
            this.page.page = 1;
            this.search.sort = "";
            this._getAdvertList();
        },
        tradeTypeName(type) {
            let index = this.tradeType.findIndex(item => {
                return item.value == type;
            });
            if (index > -1) {
                return this.tradeType[index].name || "";
            }
            return "";
        },
        statusText(status) {
            let index = advertStatus.findIndex(item => {
                return status == item.value;
            });
            if (index > -1) {
                return advertStatus[index].name;
            }
            return "";
        },
        backColor(status) {
            let index = advertStatus.findIndex(item => {
                return status == item.value;
            });
            if (index > -1) {
                return advertStatus[index].color;
            }
            return "";
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this._getAdvertList();
        },
        changeSize(pageSize) {
            this.page.pageSize = Number(pageSize);
            this.page.page = 1;
            this._getAdvertList();
        },
        _datetimeFormat(time) {
            return datetimeFormat(time);
        },
        showPayImg(value) {
            let index = paywayImg.findIndex(item => {
                return item.value == value;
            });
            if (index > -1) {
                return paywayImg[index].url;
            }
            return "";
        }
    },
    components: {
        Bread,
        SelectPage,
        DiaLog
    }
};
</script>
<style lang="scss" scoped>
@import "~assets/style/variable";

.recharge-box {
    padding: 20px;
    .recharge {
        width: 100%;
        min-height: 100px;
        background: #fff;
        .head {
            padding: 15px;
            border-bottom: 1px solid #f3f3f3;
            font-size: $font-size-small;
        }
        .search {
            padding: 15px;
            border-bottom: 1px solid #ccc;
            .item {
                width: 180px;
                margin-bottom: 10px;
            }
            .date {
                width: 230px;
                margin-bottom: 10px;
            }
            .search-time {
                // display: inline-block;
                margin-bottom: 10px;
                margin-right: 10px;
                .name {
                    margin: 0 10px;
                    color: #606266;
                }
            }
        }
        .table {
            padding: 20px 15px;
            .operate {
                margin: 2px;
            }
            .tag {
                color: #fff;
            }
            .deal-img {
                width: 30px;
                height: 30px;
                display: inline-block;
                margin-right: 3px;
                margin-bottom: 3px;
            }
            .user {
                text-decoration: underline;
                cursor: pointer;
                color: #409eff;
                &:hover {
                    color: #67c23a;
                }
            }
        }
        .pagenation {
            padding: 20px 0;
            display: flex;
            justify-content: space-between;
        }
    }
}
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 150px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>
<style>
.recharge .date .el-range-separator {
    width: 10%;
}
</style>


