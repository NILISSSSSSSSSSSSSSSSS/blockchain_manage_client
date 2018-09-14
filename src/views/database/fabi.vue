<template>
    <div class="container">
        <bread title="法币" desc="系统管理法币" :list="breadNav"></bread>
        <div class="recharge-box">
            <div class="recharge">
                <header class="head">法币列表</header>
                <div class="search">
                    <el-select class="item" v-model="search.name" style="width:180px;" clearable placeholder="请选择法币">
                        <el-option v-for="item in fiatCurrency" :key="item._id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                    <el-button type="success" @click="searchBtn">搜索</el-button>
                    <el-button type="success" class="add" @click="add" v-show="permissions.fiatCurrency_add">新增法币</el-button>
                </div>
                <div class="table">
                    <el-table ref="table" :data="tableData" @sort-change="sortChange" :header-cell-style="{color: 'rgba(0,0,0,.85)','text-align': 'center'}" :cell-style="{'text-align': 'center'}" style="width: 100%">
                        <!-- <el-table-column type="index" label="编号">
            </el-table-column> -->
                        <el-table-column prop="name" label="法币代码" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="allowPay" label="交易方式" sortable="custom">
                            <template slot-scope="scope">
                                <span>
                                    <img :src="showPayImg(item)" v-if="showPayImg(item)" class="deal-img" alt="#" v-for="(item,index) in scope.row.allowPay" :key="index">
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="exchangeRateMode" label="采集模式" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{exchangeRateMode(scope.row.exchangeRateMode)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="USD" label="兑换成美元的汇率" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="enabled" label="是否启用" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{scope.row.enabled ? "是" : "否"}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" v-if="permissions.fiatCurrency_edit">
                            <template slot-scope="scope">
                                <el-button size="mini" type="success" class="operate"  @click="handleEdit(scope.$index, scope.row._id)">
                                    编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="pagenation">
                        <select-page @changeSize="changeSize" :total="page.total" />
                        <el-pagination background layout="prev, pager, next,jumper" :current-page="page.page" :page-size="page.size" :total="page.total" @current-change="handleCurrentChange">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <dia-log title="新增法币" class="dia-log" ref="fiat" @sure="save">
            <div class="content">
                <div class="item">
                    <span class="name">法币名称</span>
                    <el-input class="val" placeholder="请输入法币名称" v-model="fiat.name"></el-input>
                </div>
                <div class="item">
                    <span class="name">交易方式</span>
                    <div class="val">
                        <el-select v-model="fiat.allowPay" multiple class="acquisition" placeholder="请选择交易方式">
                            <el-option v-for="item in payway" :key="item.value" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <span class="name">采集模式</span>
                    <div class="val">
                        <el-select v-model="fiat.exchangeRateMode" class="acquisition" placeholder="请选择采集模式">
                            <el-option v-for="item in acquisitionMode" :key="item.value" :label="item.name" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <span class="name">兑换成美元的汇率</span>
                    <el-input class="val" placeholder="请输入兑换汇率" v-model="fiat.USD"></el-input>
                </div>
                <div class="item">
                    <span class="name">是否启用</span>
                    <div class="val">
                        <el-switch v-model="fiat.enabled" active-color="#13ce66" inactive-color="#dcdfe6">
                        </el-switch>
                    </div>
                </div>
            </div>
        </dia-log>
    </div>

</template>
<script>
import Bread from "components/bread";
import DiaLog from "components/dia-log";
import SelectPage from "components/select-page";
import { getFiatList, editFiatSave, getFiatDetail, addFiatSave } from "api/api";
import { fabiAcquisitionMode, payway, paywayImg } from "common/baseData";
import { getFiatCurrencyList } from "common/mixin";
import {getWpermissions} from "common/util"


export default {
    mixins: [getFiatCurrencyList],
    data() {
        return {
            acquisitionMode: fabiAcquisitionMode,
            payway: payway,
            fiat: {
                name: "",
                allowPay: [],
                exchangeRateMode: "",
                USD: "",
                enabled: false
            },
            fiatCurrencyId: "",
            breadNav: [
                { name: "数据管理", path: "/database/fabi" },
                { name: "法币", path: "" }
            ],
            permissions: {
                fiatCurrency_add: false,
                fiatCurrency_edit: false
            },
            search: {
                name: "",
                sort: ""
            },
            tableData: [],
            page: {
                pageSize: 10,
                total: 0,
                page: 1
            }
        };
    },
    created() {
        this._getFiatList();
        getWpermissions(this.permissions)
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
            this._getFiatList();
        },
        _getFiatList() {
            let searchObj = {
                page: this.page.page,
                pageSize: this.page.pageSize,
                name: this.search.name,
                sort: this.search.sort
            };

            getFiatList(searchObj).then(res => {
                if (res.code == 0) {
                    this.tableData = res.data.list || [];
                    this.page.total = res.data.count || 0;
                }
            });
        },
        searchBtn() {
            this.$refs.table.clearSort();
            this.page.page = 1;
            this.search.sort = "";
            this._getFiatList();
        },
        add() {
            this.clear();
            this.$refs.fiat.show();
        },
        handleEdit(index, id) {
            getFiatDetail({
                fiatCurrencyId: id
            }).then(res => {
                if (res.code == 0) {
                    let data = res.data;
                    this.fiatCurrencyId = data._id;
                    this.fiat.name = data.name || "";
                    this.fiat.allowPay = data.allowPay || [];
                    this.fiat.exchangeRateMode = data.exchangeRateMode || "";
                    this.fiat.USD = data.USD || "";
                    this.fiat.enabled = data.enabled;
                    this.$refs.fiat.show();
                } else {
                    this.$message.error(res.msg || "获取信息失败");
                }
            });
        },
        save() {
            if (!this.fiat.name) {
                this.$message.error("法币名称必填");
                return;
            }
            if (!this.fiat.allowPay.length) {
                this.$message.error("交易方式必选");
                return;
            }
            if (!this.fiat.exchangeRateMode) {
                this.$message.error("汇率采集方式必选");
                return;
            }
            if (!this.fiat.USD) {
                this.$message.error("兑换成美元汇率必填");
                return;
            }
            let postObj = {
                name: this.fiat.name,
                allowPay: this.fiat.allowPay,
                exchangeRateMode: this.fiat.exchangeRateMode,
                USD: this.fiat.USD,
                enabled: this.fiat.enabled
            };
            if (this.fiatCurrencyId) {
                postObj.fiatCurrencyId = this.fiatCurrencyId;
                editFiatSave(postObj).then(res => {
                    if (res.code == 0) {
                        this.$message.success(res.msg || "保存成功");
                        this.$refs.fiat.hide();
                        this._getFiatList();
                    } else {
                        this.$message.error(res.msg || "保存失败");
                    }
                });
            } else {
                addFiatSave(postObj).then(res => {
                    if (res.code == 0) {
                        this.$message.success(res.msg || "保存成功");
                        this.$refs.fiat.hide();
                        this.clearSearch();
                        this._getFiatList();
                    } else {
                        this.$message.error(res.msg || "保存失败");
                    }
                });
            }
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
        clear() {
            this.fiat.name = "";
            this.fiat.allowPay = [];
            this.fiat.exchangeRateMode = "";
            this.fiat.USD = "";
            this.fiat.enabled = false;
            this.fiatCurrencyId = "";
        },
        clearSearch(){
            this.page.page = 1
            this.search.name = ""
            this.search.sort = ""
            this.$refs.table.clearSort()
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this._getFiatList();
        },
        changeSize(pageSize) {
            this.page.pageSize = Number(pageSize);
            this.page.page = 1;
            this._getFiatList();
        },
        showPayImg(value) {
            let index = paywayImg.findIndex(item => {
                return item.value == value;
            });
            if (index > -1) {
                return paywayImg[index].url;
            }
            return "";
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
            overflow: hidden;
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
            .deal-img {
                width: 30px;
                height: 30px;
                display: inline-block;
                margin-right: 3px;
                margin-bottom: 3px;
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
    .content {
        .item {
            display: flex;
            align-items: center;
            height: 40px;
            line-height: 40px;
            margin-bottom: 10px;
            .name {
                flex: 0 0 120px;
                margin-right: 10px;
            }
            .val {
                flex: 1;
                .acquisition {
                    width: 100%;
                }
            }
        }
    }
}
</style>
<style>
.recharge .date .el-range-separator {
    width: 10%;
}
</style>


