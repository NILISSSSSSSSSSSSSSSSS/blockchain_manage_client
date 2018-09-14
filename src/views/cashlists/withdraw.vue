<template>
    <div class="container">
        <bread title="提现列表" desc="管理所有会员的申请提现" :list="breadNav"></bread>
        <div class="withdraw-box">
            <div class="withdraw">
                <header class="head">提现列表</header>
                <div class="search">
                    <el-input placeholder="用户昵称" v-model="search.nickName" class="item"></el-input>
                    <el-select class="item" v-model="search.currency" style="width:180px;" clearable placeholder="请选择虚拟币">
                        <el-option v-for="item in currency" :key="item._id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                    <el-select v-model="search.status" class="item" style="width:180px;" clearable placeholder="请选择状态">
                        <el-option v-for="item in dealStatus" :key="item.value" :label="item.name" :value="item.value">
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
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-form label-position="left" inline class="demo-table-expand">
                                    <!-- <el-form-item label="提币的区块地址">
                                        <span>{{ props.row.from }}</span>
                                    </el-form-item> -->
                                    <el-form-item label="提币地址" >
                                        <span>{{ props.row.to }}</span>
                                    </el-form-item>
                                    <el-form-item label="提币的地址备注" >
                                        <span>{{ props.row.toRemark }}</span>
                                    </el-form-item>
                                    <el-form-item label="玩家提币时的留言">
                                        <el-popover trigger="hover" placement="top" v-show="props.row.userMessage">
                                            <p>{{ props.row.userMessage }}</p>
                                            <div slot="reference" class="name-wrapper">
                                                <span  class="msg">{{ props.row.userMessage}}</span>
                                            </div>
                                        </el-popover>
                                    </el-form-item>
                                    <el-form-item label="拒绝的备注">
                                        <el-popover trigger="hover" placement="top" v-show="props.row.refuseMsg">
                                            <p>{{ props.row.refuseMsg }}</p>
                                            <div slot="reference" class="name-wrapper">
                                                <span  class="msg">{{ props.row.refuseMsg}}</span>
                                            </div>
                                        </el-popover>
                                        <!-- <span>{{ props.row.refuseMsg }}</span> -->
                                    </el-form-item>
                                </el-form>
                            </template>
                        </el-table-column>
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
                        <el-table-column prop="currency" label="虚拟币币种" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="amount" label="提币数量" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="feeCurrency" label="手续费币种" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="feeAmount" label="手续费数量" sortable="custom">
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
import { getWithdrawList } from "api/api";
import { datetimeFormat,daterange } from "common/util";
import { dealStatus } from "common/baseData";
import { getCurrencyList, parseUser } from "common/mixin";

export default {
    mixins: [getCurrencyList, parseUser],
    data() {
        return {
            breadNav: [
                { name: "充值提现", path: "" },
                { name: "提现列表", path: "/cashlists/withdraw" }
            ],
            search: {
                // time: [],
                currency: "",
                status: "",
                nickName: "",
                startDate:"",
                endDate: "",
                sort: ""
            },
            dealStatus: dealStatus,
            tableData: [],
            page: {
                page: 1,
                pageSize: 10,
                total: 0
            }
        };
    },
    created() {
        this._getWithdrawList();
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
            this._getWithdrawList();
        },
        _getWithdrawList() {
            let startDate = this.search.startDate,
                endDate = this.search.endDate;
            let flag = daterange(startDate, endDate);
            if (!flag) {
                return;
            }


            let searchObj = {
                page: this.page.page,
                pageSize: this.page.pageSize,
                status: this.search.status,
                currency: this.search.currency,
                nickName: this.search.nickName,
                startDate: this.search.startDate,
                endDate: this.search.endDate,
                sort: this.search.sort
            };
            
            getWithdrawList(searchObj).then(res => {
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
            this._getWithdrawList();
        },
        statusText(status) {
            let index = dealStatus.findIndex(item => {
                return status == item.value;
            });
            if (index > -1) {
                return dealStatus[index].name;
            }
            return "";
        },
        backColor(status) {
            let index = dealStatus.findIndex(item => {
                return status == item.value;
            });
            if (index > -1) {
                return dealStatus[index].color;
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
            this._getWithdrawList();
        },
        changeSize(pageSize) {
            this.page.pageSize = Number(pageSize);
            this.page.page = 1;
            this._getWithdrawList();
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

.withdraw-box {
    padding: 20px;
    .withdraw {
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
            .msg{
                display: inline-block;
                width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .name-wrapper{
                height: 40px;
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
.withdraw .date .el-range-separator {
    width: 10%;
}
</style>


