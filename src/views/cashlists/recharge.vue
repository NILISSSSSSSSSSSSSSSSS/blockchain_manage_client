<template>
    <div class="container">
        <bread title="充值记录" desc="管理所有会员的充值记录" :list="breadNav"></bread>
        <div class="recharge-box">
            <div class="recharge">
                <header class="head">充值记录</header>
                <div class="search">
                    <el-input placeholder="用户昵称" v-model="search.nickName" class="item"></el-input>
                    <el-select class="item" v-model="search.currency" style="width:180px;" clearable placeholder="请选择虚拟币">
                        <el-option v-for="item in currency" :key="item._id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                    <el-select v-model="search.status" class="item" style="width:200px;" clearable placeholder="请选择状态">
                        <el-option v-for="item in depositsStatus" :key="item.value" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-date-picker v-model="search.startDate" value-format="timestamp" type="date"  placeholder="选择开始日期">
                    </el-date-picker>
                    <el-date-picker v-model="search.endDate" value-format="timestamp" type="date" placeholder="选择结束日期">
                    </el-date-picker>
                    <!-- <el-date-picker class="date" v-model="search.time" value-format="timestamp" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker> -->
                    <el-button type="success" @click="searchBtn">搜索</el-button>
                </div>
                <div class="table">
                    <el-table ref="table" :data="tableData"  @sort-change="sortChange" :header-cell-style="{color: 'rgba(0,0,0,.85)','text-align': 'center'}" :cell-style="{'text-align': 'center'}" style="width: 100%">
                        <el-table-column prop="userDoc" label="用户昵称" sortable="custom">
                            <template slot-scope="scope">
                                <span class="user" @click="toUser(scope.row.userDoc)">{{parseName(scope.row.userDoc)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="tradeHash" label="交易哈希" sortable="custom">
                            <template slot-scope="scope">
                                <a class="user" :href="toOut(scope.row.currency,scope.row.tradeHash)" target="_blank" >{{scope.row.tradeHash}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="address" label="钱包地址" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="currency" label="虚拟币币种" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="amount" label="虚拟币数量" sortable="custom">
                        </el-table-column>
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
import { getDepositsList } from "api/api";
import { depositsStatus } from "common/baseData";
import { datetimeFormat ,daterange } from "common/util";
import { getCurrencyList ,parseUser} from "common/mixin";

export default {
    mixins: [getCurrencyList ,parseUser],
    data() {
        return {
            depositsStatus: depositsStatus,
            breadNav: [
                { name: "充值提现", path: "" },
                { name: "充值记录", path: "/cashlists/recharge" }
            ],
            search: {
                status: "",
                currency: "",
                // time: [],
                nickName: "",
                startDate:"",
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
        this._getDepositsList();
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
            this._getDepositsList();
        },
        _getDepositsList() {
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
                status: this.search.status,
                nickName: this.search.nickName,
                sort: this.search.sort,
                startDate: startDate,
                endDate: endDate
            };
            
            getDepositsList(searchObj).then(res => {
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
            this._getDepositsList();
        },
        statusText(status) {
            let index = depositsStatus.findIndex(item => {
                return status == item.value;
            });
            if (index > -1) {
                return depositsStatus[index].name;
            }
            return "";
        },
        backColor(status) {
            let index = depositsStatus.findIndex(item => {
                return status == item.value;
            });
            if (index > -1) {
                return depositsStatus[index].color;
            }
            return "";
        },
        toOut(currency,hash){
            let url = ""
            if(!hash){
                url = ""
            }else{
                if(currency == "BTC"){
                    url = `https://btc.com/${hash}`
                }else{
                    url = `https://etherscan.io/tx/${hash}`
                }
            }
            return url
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this._getDepositsList();
        },
        changeSize(pageSize) {
            this.page.pageSize = Number(pageSize);
            this.page.page = 1;
            this._getDepositsList();
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
        }
        .table {
            padding: 20px 15px;
            .operate {
                margin: 2px;
            }
            .tag {
                color: #fff;
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
</style>
<style>
.recharge .date .el-range-separator {
    width: 10%;
}
</style>


