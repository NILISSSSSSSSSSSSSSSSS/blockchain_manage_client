<template>
    <div class="container">
        <bread title="钱包管理" desc="管理钱包池记录" :list="breadNav"></bread>
        <div class="recharge-box">
            <div class="recharge">
                <header class="head">钱包池</header>
                <div class="search">
                    <el-select v-model="search.used" clearable placeholder="是否已分配给玩家" class="item">
                        <el-option v-for="item in usedArr" :key="item.value" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select class="item" v-model="search.currency" style="width:180px;" clearable placeholder="请选择虚拟币">
                        <el-option v-for="item in currency" :key="item._id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                    <el-input placeholder="钱包地址查询(可模糊搜索)" v-model="search.address" style="width:350px;" class="item"></el-input>
                    <el-date-picker v-model="search.startDate" value-format="timestamp" type="date"  placeholder="选择开始日期时间">
                    </el-date-picker>
                    <el-date-picker v-model="search.endDate" value-format="timestamp" type="date" placeholder="选择结束日期时间">
                    </el-date-picker>
                    <!-- <el-date-picker class="date" v-model="search.time" value-format="timestamp" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker> -->
                    <el-button type="success" @click="searchBtn">搜索</el-button>
                </div>
                <div class="table">
                    <el-table ref="table" :data="tableData"  @sort-change="sortChange" :header-cell-style="{color: 'rgba(0,0,0,.85)','text-align': 'center'}" :cell-style="{'text-align': 'center'}" style="width: 100%">
                        <el-table-column prop="owner" label="分配用户" sortable="custom">
                            <template slot-scope="scope">
                                <span class="user" @click="toUser(scope.row.owner)">{{parseName(scope.row.owner)}}</span>
                            </template>
                            
                        </el-table-column>
                        <el-table-column prop="address" label="生成地址" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{scope.row.address}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="currency" label="虚拟币代码" sortable="custom">
                        </el-table-column>
                        <!-- <el-table-column prop="lastScanBlockId" label="块ID">
                        </el-table-column> -->
                        <el-table-column prop="used" label="是否已分配给玩家" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{scope.row.used ? '是' : '否'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="创建时间" sortable="custom">
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
import { getAddrPoolList, getCurrency } from "api/api";
import { datetimeFormat ,daterange } from "common/util";
import { parseUser} from "common/mixin";


export default {
    mixins: [parseUser],
    data() {
        return {
            breadNav: [
                { name: "钱包管理", path: "" },
                { name: "钱包池", path: "/wallet/pool" }
            ],
            currency: [
                {_id:1,name: 'BTC'},
                {_id:2,name: 'ETH'}
            ],
            search: {
                used: "",
                currency: "",
                // time: [],
                address: "",
                startDate: "",
                endDate: "",
                sort: ""
            },
            usedArr: [
                {
                    value: 1,
                    name: "是"
                },
                {
                    value: 0,
                    name: "否"
                }
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
        this._getAddrPoolList();
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
            this._getAddrPoolList();
        },
        _getAddrPoolList() {
            let startDate = this.search.startDate,
                endDate = this.search.endDate;
            let flag = daterange(startDate, endDate);
            if (!flag) {
                return;
            }

            let searchObj = {
                page: this.page.page,
                pageSize: this.page.pageSize,
                used: this.search.used,
                address: this.search.address,
                currency: this.search.currency,
                sort: this.search.sort,
                startDate: startDate,
                endDate: endDate
            };
            
            getAddrPoolList(searchObj).then(res => {
                if (res.code == 0) {
                    this.tableData = res.data.list;
                    this.page.total = res.data.count;
                } else {
                    this.$message.error(res.msg || "查询失败");
                }
            });
        },
        searchBtn() {
            this.$refs.table.clearSort()
            this.page.page = 1;
            this.search.sort = ""
            this._getAddrPoolList();
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this._getAddrPoolList();
        },
        changeSize(pageSize) {
            this.page.pageSize = Number(pageSize);
            this.page.page = 1;
            this._getAddrPoolList();
        },
        _datetimeFormat(time) {
            return datetimeFormat(time);
        },
        // parseName(owner) {
        //     if (!owner && typeof owner != "undefined" && owner != 0) {
        //         return "";
        //     }
        //     if (!owner) {
        //         return "";
        //     }
        //     return owner.nickName || "";
        // },
        // toUser(owner) {
        //     let id = "";
        //     if (!owner && typeof owner != "undefined" && owner != 0) {
        //         id = "";
        //     } else {
        //         id = owner._id || "";
        //     }
        //     if (id) {
        //         this.$router.push({
        //             path: `/user/detail/${id}`
        //         });
        //     } else {
        //         // this.$message.error("此用户没有id.....")
        //     }
        // }
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
            .link {
                text-decoration: underline;
                color: #409eff;
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
.recharge .rowClass {
    color: rgba(0, 0, 0, 0.85);
    text-align: center;
}
</style>


