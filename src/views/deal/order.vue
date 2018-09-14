<template>
    <div class="container">
        <bread title="站内交易" desc="管理订单与记录等" :list="breadList"></bread>
        <div class="order-box">
            <div class="order">
                <header class="head">订单列表</header>
                <div class="search">
                    <el-input placeholder="掌柜昵称" v-model="search.owner" class="item"></el-input>
                    <el-input placeholder="消费者昵称" v-model="search.customer" class="item"></el-input>
                    <el-input placeholder="交易订单号" v-model="search.orderCode" class="item"></el-input>
                    <el-select v-model="search.tradeType" class="item" clearable placeholder="交易类型">
                        <el-option v-for="(item,index) in tradeType" :key="index" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                    <el-select v-model="search.status" class="item" clearable placeholder="状态">
                        <el-option v-for="item in orderStatus" :key="item.value" :label="item.name" :value="item.value">
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
                    <el-date-picker v-model="search.startDate" value-format="timestamp" type="date" placeholder="选择开始日期">
                    </el-date-picker>
                    <el-date-picker v-model="search.endDate" value-format="timestamp" type="date" placeholder="选择结束日期">
                    </el-date-picker>
                    <!-- <el-date-picker class="date" v-model="search.time" value-format="timestamp" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker> -->
                    <el-button type="success" @click="searchBtn">搜索</el-button>
                </div>
                <div class="table">
                    <el-table ref="table" :data="tableData"  @sort-change="sortChange" :header-cell-style="{color: 'rgba(0,0,0,.85)','text-align': 'center'}" :cell-style="{'text-align': 'center'}" style="width: 100%">
                        <!-- <el-table-column prop="advertise" label="关联广告">
            </el-table-column> -->
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    <el-form-item label="订单编号">
                                        <span>{{ props.row.orderCode }}</span>
                                    </el-form-item>
                                    <el-form-item label="订单是否延期">
                                        <span>{{ props.row.hasExpire ? "是" : "否" }}</span>
                                    </el-form-item>
                                    <el-form-item label="成交单价">
                                        <span>{{ props.row.unitPrice }}</span>
                                    </el-form-item>
                                    <el-form-item label="成交数量">
                                        <span>{{ props.row.amount }}</span>
                                    </el-form-item>
                                    <el-form-item label="成交的法币金额">
                                        <span>{{ props.row.fiatCurrencyAmount }}</span>
                                    </el-form-item>
                                    <!-- <el-form-item label="手续费虚拟币代码">
                                        <span>{{ props.row.feeCurrency }}</span>
                                    </el-form-item> -->
                                    <el-form-item label="预支付手续费数量">
                                        <span>{{ props.row.frozenFeeAmount }}</span>
                                    </el-form-item>
                                    <el-form-item label="应交手续费数量">
                                        <span>{{ props.row.realFeeAmount }}</span>
                                    </el-form-item>

                                </el-form>
                            </template>
                        </el-table-column>
                        <el-table-column prop="tradeType" label="交易方式" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{tradeTypeName(scope.row.tradeType)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="owner" label="掌柜" sortable="custom">
                            <template slot-scope="scope">
                                <span class="user" @click="toUser(scope.row.owner)">{{parseName(scope.row.owner)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="customer" label="消费者" sortable="custom">
                            <template slot-scope="scope">
                                <span class="user" @click="toUser(scope.row.customer)">{{parseName(scope.row.customer)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="currency" label="虚拟币代码" sortable="custom" >
                        </el-table-column>
                        <el-table-column prop="fiatCurrency" label="法币代码" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="feeCurrency" label="手续费虚拟币代码" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="payType" label="支付类型" sortable="custom">
                            <template slot-scope="scope">
                                <span><img :src="payTypeImg(scope.row.payType)" class="deal-img" v-if="payTypeImg(scope.row.payType)" alt=""></span>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="appealStatus" label="申诉状态">
            </el-table-column> -->
                        <el-table-column prop="status" label="状态" sortable="custom">
                            <template slot-scope="scope">
                                <span class="status" :style="{background: backColor(scope.row.status)}">{{statusText(scope.row.status)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{_datetimeFormat(scope.row.createTime)}}</span>
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
    </div>

</template>
<script>
import Bread from "components/bread";
import SelectPage from "components/select-page";
import { getOrderList } from "api/api";
import { datetimeFormat ,daterange} from "common/util";
import { orderStatus, paywayImg } from "common/baseData";
import { getCurrencyList, getFiatCurrencyList, parseUser } from "common/mixin";

export default {
    mixins: [getCurrencyList, getFiatCurrencyList, parseUser],
    data() {
        return {
            breadList: [
                { name: "站内交易", path: "" },
                { name: "订单管理", path: "/deal/order" }
            ],
            search: {
                owner: "",
                customer: "",
                tradeType: "",
                status: "",
                currency: "",
                fiatCurrency: "",
                time: [],
                startDate: "",
                endDate: "",
                sort: "",
                orderCode: ""
            },
            tradeType: [
                { value: "buy", name: "购买" },
                { value: "sell", name: "出售" }
            ],
            orderStatus: orderStatus,
            tableData: [],
            page: {
                page: 1,
                pageSize: 10,
                total: 0
            }
        };
    },
    created() {
        this._getOrderList();
    },
    methods: {
        sortChange({ column, prop, order }) {
            if (order == "ascending") {
                this.search.sort = `${prop}.asc`;
            } else if (order == "descending") {
                this.search.sort = `${prop}.desc`;
            } else {
                this.search.sort = "";
            }
            this._getOrderList();
        },
        _getOrderList() {
            let startDate = this.search.startDate, endDate = this.search.endDate
            let flag =  daterange(startDate,endDate)
            if(!flag){
                return 
            }

            let searchObj = {
                page: this.page.page,
                pageSize: this.page.pageSize,
                owner: this.search.owner,
                customer: this.search.customer,
                status: this.search.status,
                tradeType: this.search.tradeType,
                currency: this.search.currency,
                fiatCurrency: this.search.fiatCurrency,
                startDate: this.search.startDate,
                endDate: this.search.endDate,
                sort: this.search.sort,
                orderCode: this.search.orderCode
            };
            // let time = this.search.time;
            // if (!time && typeof time != "undefined" && time != 0) {
            //     time = [];
            // }
            // if (time.length) {
            //     searchObj.startDate = this.search.time[0];
            //     searchObj.endDate = this.search.time[1];
            // }
            getOrderList(searchObj).then(res => {
                if (res.code == 0) {
                    this.tableData = res.data.list;
                    this.page.total = res.data.count;
                }
            });
        },
        searchBtn() {
            this.$refs.table.clearSort()
            this.page.page = 1;
            this.search.sort = "";
            this._getOrderList();
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
            let index = orderStatus.findIndex(item => {
                return status == item.value;
            });
            if (index > -1) {
                return orderStatus[index].name;
            }
            return "";
        },
        backColor(status) {
            let index = orderStatus.findIndex(item => {
                return status == item.value;
            });
            if (index > -1) {
                return orderStatus[index].color;
            }
            return "";
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this._getOrderList();
        },
        changeSize(pageSize) {
            this.page.pageSize = Number(pageSize);
            this.page.page = 1;
            this._getOrderList();
        },
        _datetimeFormat(time) {
            return datetimeFormat(time);
        },
        payTypeImg(img) {
            let index = paywayImg.findIndex(item => {
                return img == item.value;
            });
            if (index > -1) {
                return paywayImg[index].url;
            }
            return "";
        }
    },
    components: {
        Bread,
        SelectPage
    }
};
</script>
<style lang="scss" scoped>
@import "~assets/style/variable";

.order-box {
    padding: 20px;
}
.order {
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
    }
    .table {
        padding: 20px 15px;
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
        .status {
            display: inline-block;
            padding: 1px 4px;
            color: #fff;
            border-radius: 4px;
            font-size: 12px;
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
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 150px;
    // color: #99a9bf;
    color: rgba(0, 0, 0, 0.85);
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>
<style>
.search .date .el-range-separator {
    width: 10%;
}
</style>



