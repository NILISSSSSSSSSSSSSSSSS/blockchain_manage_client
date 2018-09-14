<template>
    <div class="container">
        <bread title="token" desc="美元兑各个货币的汇率信息，数据来源于雅虎。" :list="breadNav"></bread>
        <div class="recharge-box">
            <div class="recharge">
                <header class="head">token列表</header>
                <div class="search">
                    <el-select class="item" v-model="search.name" style="width:180px;" clearable placeholder="请选择token">
                        <el-option v-for="item in currency" :key="item._id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                    <el-button type="success" @click="searchBtn">搜索</el-button>
                    <el-button type="success" class="add" @click="add" v-if="permissions.currency_add">新增token</el-button>
                </div>
                <div class="table">
                    <el-table ref="table" :data="tableData" @sort-change="sortChange" :header-cell-style="{color: 'rgba(0,0,0,.85)','text-align': 'center'}" :cell-style="{'text-align': 'center'}" style="width: 100%">
                        <el-table-column prop="name" label="token代码" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="officialFeePercent" label="官方币手续费折扣" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{toPercent(scope.row.officialFeePercent)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderFeePercent" label="手续费比例" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{toPercent(scope.row.orderFeePercent)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="overPercentCeil" label="挂单溢价上限" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{toPercent(scope.row.overPercentCeil)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="overPercentfloor" label="挂单溢价下限" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{toPercent(scope.row.overPercentfloor)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="minAvailableAmountOfSell" label="广告可展示数量" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="advertiseCostAmount" label="广告费" sortable="custom">
                        </el-table-column>
                        <!-- <el-table-column
                      prop="depositsAffirmMinAmount"
                      label="单笔充值最少数量">
                  </el-table-column> -->
                        <el-table-column prop="depositsAffirmCount" label="充值确认数" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="withdrawsFee" label="提币矿工费" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="withdrawsMin" label="最小提币数量" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="exchangeRateMode" label="汇率采集模式" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{exchangeRateMode(scope.row.exchangeRateMode)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="enabled" label="是否启用" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{scope.row.enabled ? "是" : "否"}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" v-if="permissions.currency_edit">
                            <template slot-scope="scope">
                                <el-button size="mini" type="success" class="operate" @click="handleEdit(scope.$index, scope.row._id)">
                                    <!-- <i class="el-icon-check"></i> -->
                                    编辑详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagenation">
                        <select-page @changeSize="changeSize" :total="page.total" />
                        <el-pagination background layout="prev, pager, next,jumper" :page-size="page.pageSize" :total="page.total" :current-page="page.page" @size-change="handleSizeChange" @current-change="handleCurrentChange">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <dia-log title="新增token" ref="add" class="dia-log" @sure="addSure">
            <div class="item">
                <el-input placeholder="请输入币种名称" :maxlength="20" v-model="token.name"></el-input>
            </div>
            <div class="item">
                <el-input placeholder="请输入初始单价" v-model="token.prePrice">
                    <el-button slot="append">$</el-button>
                </el-input>
            </div>
            <!-- <div class="item">
                <el-input placeholder="请输入合约地址" v-model="token.contactAddr"></el-input>
            </div> -->
            <div class="item">
                <el-input placeholder="请输入合约地址(基于ETH)" v-model="token.contactAddr"></el-input>
            </div>
            <div class="item">
                <el-input placeholder="请输入合约地址(基于BTC)" v-model="token.btcOmniId"></el-input>
            </div>
            <div class="loading" v-show="loading">
                <i class="el-icon-loading"></i>
            </div>
        </dia-log>
    </div>
</template>
<script>
import Bread from "components/bread";
import SelectPage from "components/select-page";
import DiaLog from "components/dia-log";
import { getTokenList, addToken } from "api/api";
import { acquisitionMode } from "common/baseData";
import { getCurrencyList } from "common/mixin";
import {getWpermissions} from "common/util"



export default {
    mixins: [getCurrencyList],
    data() {
        return {
            page: {
                page: 1,
                pageSize: 10,
                total: 0
            },
            acquisitionMode: acquisitionMode,
            breadNav: [
                { name: "数据管理", path: "/database/tokenlist" },
                { name: "token列表", path: "" }
            ],
            search: {
                name: "",
                sort: ""
            },
            permissions: {
                currency_add: false,
                currency_edit: false
            },
            tableData: [],
            token: {
                prePrice: "",
                contactAddr: "",
                name: "",
                btcOmniId: ""
            },
            loading: false
        };
    },
    created() {
        this._getTokenList();
        getWpermissions(this.permissions)
    },
    methods: {
        sortChange({column, prop, order}){
            if(order == 'ascending'){
                this.search.sort = `${prop}.asc`
            }else if(order == 'descending'){
                this.search.sort = `${prop}.desc`
            }else{
                this.search.sort = ""
            }
            this._getTokenList()
        },
        _getTokenList() {
            let searchObj = {
                page: this.page.page,
                pageSize: this.page.pageSize,
                name: this.search.name,
                sort: this.search.sort
            }

            getTokenList(searchObj).then(res => {
                if (res.code == 0) {
                    this.tableData = res.data.list || [];
                    this.page.total = res.data.count;
                }
            });
        },
        searchBtn() {
            this.$refs.table.clearSort()
            this.page.page = 1;
            this.search.sort = ""
            this._getTokenList();
        },
        exchangeRateMode(mode) {
            let index = this.acquisitionMode.findIndex(item => {
                return item.value == mode;
            });
            if (index > -1) {
                return this.acquisitionMode[index].name || "";
            }
            return "";
        },
        toPercent(point) {
            let result = point && Number(point);
            if (result) {
                var str = (Number(point) * 100).toFixed(2);
                str += "%";
                return str;
            }
            return 0;
        },
        handleEdit(index, id) {
            this.$router.push({
                path: `/database/tokenlist/${id}`
            });
        },
        add() {
            this.clear();
            this.loading = false;
            this.$refs.add.show();
        },
        addSure() {
            if (!this.token.name.trim()) {
                this.$message.error("币种名称必填");
                return;
            }
            if (!this.token.prePrice.trim()) {
                this.$message.error("初始价格必填");
                return;
            }
            // if (!this.token.contactAddr.trim()) {
            //     this.$message.error("合约地址必填");
            //     return
            // }
            if (!this.token.contactAddr.trim() && !this.token.btcOmniId.trim()) {
                this.$message.error("合约地址必填一个");
                return;
            }
            this.loading = true;
            //新增token的请求
            let postObj = {
                tokenName: this.token.name.trim(),
                prePrice: this.token.prePrice.trim(),
                contactAddr: this.token.contactAddr.trim(),
                btcOmniId: this.token.btcOmniId.trim()
            };
            if (!this.once) {
                this.once = true;
                addToken(postObj)
                    .then(res => {
                        this.once = false;
                        if (res.code == 0) {
                            this.$message.success(res.msg || "新增成功");
                            this.clear();
                            this.$refs.add.hide();
                            let id = res.data._id;
                            this.loading = false;
                            this.$router.push({
                                path: `/database/tokenlist/${id}`
                            });
                        } else {
                            this.loading = false;
                            this.$message.error(res.msg || "新增失败");
                        }
                    })
                    .catch(error => {
                        this.once = false;
                        console.log(error);
                        // this.$message.error(error)
                    });
            }
        },
        handleSizeChange(val) {
            // console.log(val);
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this._getTokenList();
        },
        changeSize(pageSize) {
            this.page.pageSize = Number(pageSize);
            this.page.page = 1;
            this._getTokenList();
        },
        clear() {
            this.token.prePrice = "";
            this.token.contactAddr = "";
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
            .add {
                float: right;
                margin-right: 20px;
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
.dia-log {
    .item {
        margin-bottom: 10px;
    }
    .loading {
        width: 100%;
        text-align: center;
        font-size: 32px;
        padding-top: 10px;
    }
}
</style>
<style>
.recharge .date .el-range-separator {
    width: 10%;
}
</style>


