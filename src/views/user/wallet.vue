<template>
    <div class="container">
        <bread title="用户钱包" desc="管理所有用户的用户钱包" :list="breadNav"></bread>
        <div class="user-box">
            <div class="user">
                <header class="head">用户钱包</header>
                <div class="search">
                    <el-select v-model="search.status" clearable placeholder="是否可用" class="item">
                        <el-option v-for="item in status" :key="item.value" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-date-picker v-model="search.uStartDate" value-format="timestamp" type="date" placeholder="选择更新时间开始日期">
                    </el-date-picker>
                    <el-date-picker v-model="search.uEndDate" value-format="timestamp" type="date" placeholder="选择更新时间结束日期">
                    </el-date-picker>
                    <el-button type="success" @click="searchBtn">搜索</el-button>
                </div>
                <div class="table">
                    <el-table ref="table" :data="tableData"  @sort-change="sortChange" :header-cell-style="{color: 'rgba(0,0,0,.85)','text-align': 'center'}" :cell-style="{'text-align': 'center'}" style="width: 100%">
                        <el-table-column prop="nickName" label="用户昵称" sortable="custom">
                            <template slot-scope="scope">
                                <span class="user" @click="toUser(scope.row.userId)">{{scope.row.nickName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="address" label="钱包地址" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="lockAmount" label="锁仓数量" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="orderFrozenAmount" label="订单冻结数量" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="currencyAmount" label="币总量" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="currency" label="币种" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="status" label="状态" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{scope.row.status ? "可用" : "不可用"}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="updateTime" label="更新时间" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{_datetimeFormat(scope.row.updateTime)}}</span>
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
import { getUserWallet } from "api/api";
import { datetimeFormat ,daterange } from "common/util";


export default {
    data() {
        return {
            breadNav: [
                { name: "用户管理", path: "" },
                { name: "用户钱包", path: "/user/wallet" }
            ],
            search: {
                status: "",
                uStartDate: "",
                uEndDate: "",
                sort: ""
            },
            status: [
                {name: '可用',value: 'enable'},
                {name: '不可用',value: 'disable'}
            ],
            tableData: [],
            page: {
                page: 1,
                pageSize: 10,
                total: 0
            }
        };
    },
    created() {
        this._getUserWallet();
    },
    methods: {
        _datetimeFormat(time) {
            return datetimeFormat(time);
        },
        sortChange({ column, prop, order }) {
            if (order == "ascending") {
                this.search.sort = `${prop}.asc`;
            } else if (order == "descending") {
                this.search.sort = `${prop}.desc`;
            } else {
                this.search.sort = "";   
            }
            this._getUserWallet();
        },
        _getUserWallet(obj) {
            let startDate = this.search.uStartDate,
                endDate = this.search.uEndDate;
            let flag = daterange(startDate, endDate);
            if (!flag) {
                return;
            }

            let searchObj = {
                page: this.page.page,
                pageSize: this.page.pageSize,
                status: this.search.status,
                sort: this.search.sort,
                uStartDate: startDate,
                uEndDate: endDate
            };
            
            getUserWallet(searchObj).then(res => {
                if (res.code == 0) {
                    this.tableData = res.data.data;
                    this.page.total = res.data.count;
                }
            });
        },
        searchBtn() {
            this.$refs.table.clearSort() 
            this.page.page = 1;
            this.search.sort = ""
            this._getUserWallet();
        },
        toUser(id){
            if (id) {
                const { href } = this.$router.resolve({
                    path: `/user/detail/${id}`
                });
                window.open(href, "_blank");
            } else {
                // this.$message.error("此用户没有id.....")
            }
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this._getUserWallet();
        },
        changeSize(pageSize) {
            // console.log(2343)
            this.page.pageSize = Number(pageSize);
            this.page.page = 1;
            this._getUserWallet();
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
.user .date .el-range-separator {
    width: 10%;
}
</style>


