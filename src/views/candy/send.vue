<template>
    <div class="container">
        <bread title="糖果发放" desc="系统的一些奖励" :list="breadNav"></bread>
        <div class="recharge-box">
            <div class="recharge">
                <header class="head">糖果</header>
                <section class="content" v-if="permissions.candy_provide">
                    <div class="candy-send">
                        <div class="tips">Tips: Excel文件第一列为官方币地址,第二列为币种,第三列为充值个数</div>
                        <el-upload class="upload" name="file" accept=".*" :headers="headers" :action="postUrl" :show-file-list="false" :on-success="success" :before-upload="beforeFileUpload">
                            <el-button type="success" size="small">点击上传excel文件</el-button>
                        </el-upload>
                        <div class="result" v-if="result.infolist.length">
                            <header class="title">输出信息</header>
                            <div class="total">
                                <span class="name">总成功数
                                    <em class="num">{{result.successCount}}</em>
                                </span>
                                <span class="name">总失败数
                                    <em class="num">{{result.failCount}}</em>
                                </span>
                            </div>
                            <div class="item" v-for="(item,index) in result.infolist" :key="index">
                                <span class="name">第{{item.line}}行</span>
                                <span class="name">{{item.desc || ""}}</span>
                                <span class="name">币种: {{item.currency || ""}}</span>
                                <span class="name">数量: {{item.amount || ""}}</span>
                            </div>
                        </div>
                    </div>
                </section>
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
                <div class="total-box">
                    <header class="title">已成功发放的糖果总量</header>
                    <ul>
                        <li class="list" v-for="item in currencyTotal" :key="item._id">
                            <span class="name">币种: {{item._id}}</span>
                            <span>数量:{{item.amount}}</span>
                        </li>
                    </ul>
                </div>
                <div class="table">
                    <el-table ref="table" :data="tableData" @sort-change="sortChange" :header-cell-style="{color: 'rgba(0,0,0,.85)','text-align': 'center'}" :cell-style="{'text-align': 'center'}" style="width: 100%">
                        <el-table-column prop="owner" label="用户昵称" sortable="custom">
                            <template slot-scope="scope">
                                <span class="user" @click="toUser(scope.row.userId)">{{parseName(scope.row.userId)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="poolId.address" label="虚拟币地址" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="currency" label="虚拟币币种" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="currencyAmount" label="充值个数" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="createTime" label="充值时间" sortable="custom">
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
import { getCandyList } from "api/api";
import { url } from "api/url-config";
import { datetimeFormat, daterange ,getWpermissions} from "common/util";
import { getCurrencyList, parseUser } from "common/mixin";

export default {
    mixins: [getCurrencyList, parseUser],
    data() {
        return {
            breadNav: [
                { name: "糖果发放", path: "/candy/send" },
                { name: "发放奖励", path: "" }
            ],
            postUrl: `${url}/candy/provide`,
            headers: {},
            result: {
                infolist: []
            },
            permissions: {
                candy_provide: false,
            },
            search: {
                currency: "",
                startDate: "",
                endDate: "",
                sort: ""
            },
            currencyTotal: [],
            tableData: [],
            page: {
                page: 1,
                pageSize: 10,
                total: 0
            }
        };
    },
    created() {
        const token = sessionStorage.getItem("token");
        this.headers = {
            Authorization: token
        };
        this._getCandyList();
        getWpermissions(this.permissions)
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
            this._getCandyList();
        },
        _getCandyList() {
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
                sort: this.search.sort,
                startDate: startDate,
                endDate: endDate
            };
            getCandyList(searchObj).then(res => {
                if (res.code == 0) {
                    this.tableData = res.data.list;
                    this.currencyTotal = res.data.stat;
                    this.page.total = res.data.count;
                    this.clearResult();
                } else {
                    this.$message.error(res.msg || "获取记录失败");
                }
            });
        },
        success(res, file) {
            if (res.code == 0) {
                this.$message.success(res.msg || "操作成功");
                this.result = res.data || { infolist: [] };
                // this.clearSearch();
                // this._getCandyList()
            } else {
                this.$message.error(res.msg || "操作失败");
            }
        },
        beforeFileUpload() {
            this.clearResult();
        },
        searchBtn() {
            this.$refs.table.clearSort();
            this.page.page = 1;
            this.search.sort = "";
            this._getCandyList();
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this._getCandyList();
        },
        changeSize(pageSize) {
            this.page.pageSize = Number(pageSize);
            this.page.page = 1;
            this._getCandyList();
        },
        clearResult() {
            this.result = { infolist: [] };
        },
        clearSearch() {
            this.page.page = 1;
            this.search.sort = "";
            this.search.currency = "";
            this.search.startDate = "";
            this.search.endDate = "";
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
        .total-box {
            padding: 10px;
            // padding-bottom: 0;
            border-bottom: 1px solid #ccc;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 700;
            .title {
                padding: 10px 0;
                font-size: 16px;
            }
            .list {
                display: inline-block;
                margin-right: 20px;
                margin-bottom: 10px;
                font-size: 14px;
                .name {
                    margin-right: 10px;
                }
            }
        }

        .table {
            padding: 20px 15px;
            padding-top: 0;
            .operate {
                margin: 2px;
            }
            .tag {
                color: #fff;
            }
        }
        .pagenation {
            padding: 20px 0;
            display: flex;
            justify-content: space-between;
        }
        .content {
            // min-height: 700px;
            padding: 15px;
            padding-bottom: 0px;
            .tips {
                // color: #f56c6c;
                margin-bottom: 10px;
            }
            .upload {
                margin-bottom: 20px;
            }
            .result {
                .title {
                    font-size: 16px;
                    margin-bottom: 10px;
                }
                .total {
                    height: 40px;
                    line-height: 40px;
                    .name {
                        margin-right: 20px;
                    }
                    .num {
                        color: #f56c6c;
                    }
                }
                .item {
                    align-items: flex-start;
                    margin-bottom: 5px;
                    .name {
                        padding-right: 20px;
                        color: #f56c6c;
                    }
                }
            }
        }
    }
}
</style>
<style>
.search .date .el-range-separator {
    width: 10%;
}
</style>

