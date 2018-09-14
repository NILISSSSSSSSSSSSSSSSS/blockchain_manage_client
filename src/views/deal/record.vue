<template>
    <div class="container">
        <bread title="交易记录" desc="管理所有交易记录" :list="breadNav"></bread>
        
        <div class="record-box">
            <div class="record">
                <header class="head">交易记录列表</header>
                <div class="search">
                    <el-input placeholder="虚拟币来源用户昵称" v-model="search.userFrom" class="item"></el-input>
                    <el-input placeholder="虚拟币目标用户昵称" v-model="search.userTo" class="item"></el-input>
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
                        <!-- <el-table-column type="index" label="编号" width="50">
                        </el-table-column> -->
                        <!-- <el-table-column prop="orderId" label="订单ID">
                             </el-table-column> -->
                        <el-table-column prop="userFrom" label="虚拟币来源用户" sortable="custom" >
                            <template slot-scope="scope">
                                <span class="user" @click="toUser(scope.row.userFrom)">{{parseName(scope.row.userFrom)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="userTo" label="虚拟币目标用户" sortable="custom">
                            <template slot-scope="scope">
                                <span class="user" @click="toUser(scope.row.userTo)">{{parseName(scope.row.userTo)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="currency" label="虚拟币代码" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="currencyAmount" label="虚拟币数量" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="fiatCurrency" label="法币代码" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="fiatCurrencyAmount" label="法币金额" sortable="custom">
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
import { getTraderecord, getCurrency } from "api/api";
import { datetimeFormat, daterange } from "common/util";
import { getCurrencyList, getFiatCurrencyList, parseUser } from "common/mixin";

export default {
    mixins: [getCurrencyList, getFiatCurrencyList, parseUser],
    data() {
        return {
            breadNav: [
                { name: "站内交易", path: "" },
                { name: "交易记录", path: "/deal/record" }
            ],
            currency: [],
            search: {
                currency: "",
                fiatCurrency: "",
                // time: [],
                userFrom: "",
                userTo: "",
                startDate: "",
                endDate: "",
                sort: ""
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
        this._getTraderecord();
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
            this._getTraderecord();
        },
        _getTraderecord() {
            let startDate = this.search.startDate,
                endDate = this.search.endDate;
            let flag = daterange(startDate, endDate);
            if (!flag) {
                return;
            }

            let searchObj = {
                page: this.page.page,
                pageSize: this.page.pageSize,
                currency: this.search.currency,
                fiatCurrency: this.search.fiatCurrency,
                userFrom: this.search.userFrom,
                userTo: this.search.userTo,
                startDate: this.search.startDate,
                endDate: this.search.endDate,
                sort: this.search.sort
            };
            
            getTraderecord(searchObj).then(res => {
                if (res.code == 0) {
                    this.tableData = res.data.list;
                    this.page.total = res.data.count;
                }
            });
        },
        searchBtn() {
            this.$refs.table.clearSort()
            this.page.page = 1;
            this.search.sort = ""
            this._getTraderecord();
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this._getTraderecord();
        },
        changeSize(pageSize) {
            this.page.pageSize = Number(pageSize);
            this.page.page = 1;
            this._getTraderecord();
        },
        _datetimeFormat(time) {
            return datetimeFormat(time);
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

.record-box {
    padding: 20px;
}
.record {
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
</style>
<style>
.search .date .el-range-separator {
    width: 10%;
}
</style>


