<template>
    <div class="container">
        <bread title="登录日志" desc="管理所有用户的登录日志" :list="breadNav"></bread>
        <div class="user-box">
            <div class="user">
                <header class="head">登录日志</header>
                <div class="search">
                    <!-- <el-input placeholder="编号" v-model="order.id"  class="item"></el-input> -->
                    <!-- <el-input placeholder="用户Id" v-model="order.username" class="item"></el-input> -->
                    <el-input placeholder="Ip" v-model="search.ip" class="item"></el-input>
                    <el-date-picker v-model="search.startDate" value-format="timestamp" type="date" placeholder="选择开始日期">
                    </el-date-picker>
                    <el-date-picker v-model="search.endDate" value-format="timestamp" type="date" placeholder="选择结束日期">
                    </el-date-picker>
                    <!-- <el-date-picker value-format="timestamp" class="date" v-model="search.time" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker> -->
                    <el-button type="success" @click="searchBtn">搜索</el-button>
                </div>
                <div class="table">
                    <el-table ref="table" :data="tableData"  @sort-change="sortChange" :header-cell-style="{color: 'rgba(0,0,0,.85)','text-align': 'center'}" :cell-style="{'text-align': 'center'}" style="width: 100%">
                        <!-- <el-table-column type="index" label="编号" width="50">
                        </el-table-column> -->
                        <el-table-column prop="userId" label="用户昵称" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{parseName(scope.row.userId)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ip" label="Ip地址" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="device" label="设备" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="time" label="创建时间" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{_datetimeFormat(scope.row.time)}}</span>
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
import { getUserRecord } from "api/api";
import { datetimeFormat ,daterange } from "common/util";

export default {
    data() {
        return {
            breadNav: [
                { name: "用户管理", path: "" },
                { name: "登录日志", path: "/user/loginlog" }
            ],
            search: {
                ip: "",
                // time: [],
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
        this._getUserRecord();
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
            this._getUserRecord();
        },
        _getUserRecord() { 
            let startDate = this.search.startDate,
                endDate = this.search.endDate;
            let flag = daterange(startDate, endDate);
            if (!flag) {
                return;
            }


            let searchObj = {
                page: this.page.page,
                pageSize: this.page.pageSize,
                ip: this.search.ip,
                sort: this.search.sort,
                startDate: startDate,
                endDate: endDate
            };
            getUserRecord(searchObj).then(res => {
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
            this._getUserRecord();
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this._getUserRecord();
        },
        changeSize(pageSize) {
            this.page.pageSize = Number(pageSize);
            this.page.page = 1;
            this._getUserRecord();
        },
        _datetimeFormat(time) {
            return datetimeFormat(time);
        },
        parseName(owner) {
            if (!owner && typeof owner != "undefined" && owner != 0) {
                return "";
            }
            return owner.nickName;
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

.user-box {
    padding: 20px;
    .user {
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
.user .date .el-range-separator {
    width: 10%;
}
</style>


