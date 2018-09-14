<template>
    <div class="container">
        <bread title="用户转账记录" desc="管理用户的转账记录" :list="breadNav"></bread>

        <div class="record-box">
            <div class="record">
                <header class="head">用户转账记录列表</header>
                <div class="search">
                    <el-select class="item" v-model="search.currency" style="width:180px;" clearable placeholder="请选择虚拟币">
                        <el-option v-for="item in currency" :key="item._id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>

                    <el-date-picker v-model="search.startDate" value-format="timestamp" type="date" placeholder="选择开始日期">
                    </el-date-picker>
                    <el-date-picker v-model="search.endDate" value-format="timestamp" type="date" placeholder="选择结束日期">
                    </el-date-picker>
                    <el-button type="success" @click="searchBtn">搜索</el-button>
                </div>
                <div class="table">
                    <el-table ref="table" :data="tableData" :header-cell-style="{color: 'rgba(0,0,0,.85)','text-align': 'center'}" :cell-style="{'text-align': 'center'}" style="width: 100%">
                        <el-table-column prop="srcUserName" label="转账人昵称">
                            <template slot-scope="scope">
                                <router-link  class="user" target="_blank" :to=" '/user/detail/' + scope.row.srcUserId " >{{scope.row.srcUserName}}</router-link>
                                <!-- <span class="user" @click="toUser(scope.row.srcUserId)">{{scope.row.srcUserName}}</span> -->
                            </template>
                        </el-table-column>
                        <el-table-column prop="destUserName" label="接收人昵称">
                            <template slot-scope="scope">
                                <router-link  class="user" target="_blank" :to=" '/user/detail/' + scope.row.destUserId " >{{scope.row.destUserName}}</router-link>
                                <!-- <span class="user" @click="toUser(scope.row.destUserId)">{{scope.row.destUserName}}</span> -->
                            </template>
                        </el-table-column>
                        <el-table-column prop="currency" label="币种">
                        </el-table-column>
                        <el-table-column prop="amount" label="数量">
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间">
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
import { getTransferRecord } from "api/api";
import { datetimeFormat, daterange } from "common/util";
import { getCurrencyList } from "common/mixin";

export default {
    mixins: [getCurrencyList],
    data() {
        return {
            breadNav: [
                { name: "站内交易", path: "" },
                { name: "用户转账记录", path: "/deal/transfer" }
            ],
            search: {
                currency: "",
                startDate: "",
                endDate: ""
                // sort: ""
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
        this._getTransferRecord();
    },
    methods: {
        // sortChange({ column, prop, order }) {
        //     if (order == "ascending") {
        //         this.search.sort = `${prop}.asc`;
        //     } else if (order == "descending") {
        //         this.search.sort = `${prop}.desc`;
        //     } else {
        //         this.search.sort = "";
        //     }
        //     this._getTransferRecord();
        // },
        _getTransferRecord() {
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
                startTime: this.search.startDate,
                endTime: this.search.endDate
            };

            getTransferRecord(searchObj).then(res => {
                if (res.code == 0) {
                    this.tableData = res.data.list;
                    this.page.total = res.data.count;
                }
            });
        },
        searchBtn() {
            // this.$refs.table.clearSort()
            // this.search.sort = "";
            this.page.page = 1;
            // console.log(this.page.page)
            this._getTransferRecord();
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this._getTransferRecord();
        },
        changeSize(pageSize) {
            this.page.pageSize = Number(pageSize);
            this.page.page = 1;
            this._getTransferRecord();
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


