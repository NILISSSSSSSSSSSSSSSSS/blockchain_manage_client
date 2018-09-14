<template>
    <div class="container">
        <bread title="统计分析" desc="平台数据的统计分析" :list="breadList"></bread>
        <div class="order-box">
            <div class="order">
                <header class="head">统计分析</header>
                <div class="search">
                    <div class="item">
                        <em class="name">币种类型:</em>
                        <div class="val">
                            <el-checkbox v-model="search.currencyAll" @change="changeAll" style="margin-right   : 20px;">全部</el-checkbox>
                            <el-checkbox-group v-model="search.currency" size="small" @change="changeItem" style="display: inline-block;">
                                <el-checkbox :label="item.name" v-for="item in currency" :key="item._id">{{item.name}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <div class="item">
                        <em class="name">广告类型:</em>
                        <div class="val">
                            <el-radio-group v-model="search.tradeType" size="small">
                                <el-radio v-for="item in tradeType" :key="item.value" :label="item.value">{{item.name}}</el-radio>
                                <!-- <el-radio label="2" border>备选项2</el-radio> -->
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="item">
                        <em class="name">用户类型:</em>
                        <div class="val">
                            <el-radio-group v-model="search.userType">
                                <el-radio label="owner">广告主</el-radio>
                                <el-radio label="customer">顾客</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="item">
                        <em class="name">只统计下线:</em>
                        <div class="val">
                            <el-checkbox v-model="search.agent">只统计下线</el-checkbox>
                            <!-- <el-checkbox-group v-model="search.checkList">
                                <el-checkbox label="复选框 A"></el-checkbox>
                                <el-checkbox label="复选框 B"></el-checkbox>
                                <el-checkbox label="复选框 C"></el-checkbox>
                            </el-checkbox-group> -->
                        </div>
                    </div>
                    <div class="item">
                        <em class="name">用户昵称:</em>
                        <div class="val">
                            <el-input v-model="search.userName" placeholder="请输入用户昵称(若填写多个用','隔开)" style="width:70%" size="normal"></el-input>
                        </div>
                    </div>

                    <div class="item">
                        <em class="name">登录IP:</em>
                        <div class="val">
                            <el-input v-model="search.ip" placeholder="请输入登录Ip(若填写多个用','隔开)" style="width:70%" size="normal"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <em class="name">钱包池地址:</em>
                        <div class="val">
                            <el-input v-model="search.address" placeholder="请输入地址(若填写多个用','隔开)" style="width:70%" size="normal"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <em class="name">时间范围:</em>
                        <div class="val">
                            <el-date-picker v-model="search.startDate" value-format="timestamp" type="date" size="normal" placeholder="选择开始日期">
                            </el-date-picker>
                            <el-date-picker v-model="search.endDate" value-format="timestamp" type="date" size="normal" placeholder="选择结束日期">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="tab-card">
                        <ul class="cards">
                            <li class="card" :class="{'selected' : currentTab == index + 1}" v-for="(item,index) in tabCards" @click="selectType(item,index+1)" :key="item.value">{{item.name}}</li>
                        </ul>
                        <!-- <el-tabs type="card" class="tab-card">
                            <el-tab-pane label="按天"></el-tab-pane>
                            <el-tab-pane label="按月"></el-tab-pane>
                            <el-tab-pane label="按年"></el-tab-pane>
                            <el-tab-pane label="按币种"></el-tab-pane>
                            <el-tab-pane label="按用户"></el-tab-pane>
                            <el-tab-pane label="按Ip"></el-tab-pane>
                        </el-tabs> -->
                        <el-button type="success" size="small" @click="searchBtn">搜索</el-button>
                    </div>

                    <!-- <div class="result">
                        <div class="item">
                            <em class="name">搜索条件</em>
                            <div class="val">
                                <span class="val-item">用户类型: {{search.userType == 'owner' ? '广告主' : '顾客'}}</span>
                                <span class="val-item" v-show="search.currency.length">交易币种:
                                    <em v-for="item in search.currency" :key="item._id">{{item}},</em>
                                </span>
                                <span class="val-item">时间段: {{ _datetimeFormat(search.startDate) }}至{{_datetimeFormat(search.endDate)}}</span>
                            </div>
                        </div>
                    </div> -->

                </div>
                <div class="table">

                    <el-table id="tableId" ref="table" :data="tableData" border :header-cell-style="{color: 'rgba(0,0,0,.85)','text-align': 'center','border-top': '1px solid #e4e7ed'}" :cell-style="{'text-align': 'center'}" style="width: 100%">
                        <el-table-column prop="dataType" :label="tableName"></el-table-column>
                        <el-table-column v-for="col in cols" :prop="col.prop" :label="col.label" :key="col.prop">
                        </el-table-column>
                    </el-table>

                    <div class="result" v-show="tableData.length">
                        <div class="item">
                            <em class="name">搜索条件</em>
                            <div class="val">
                                <span class="val-item">用户类型: {{search.userType == 'owner' ? '广告主' : '顾客'}}</span>
                                <span class="val-item" v-show="search.currency.length">交易币种:
                                    <em v-for="item in search.currency" :key="item._id">{{item}},</em>
                                </span>
                                <span class="val-item">时间段: {{_datetimeFormat(search.startDate)}}至{{_datetimeFormat(search.endDate)}}</span>
                            </div>
                        </div>
                        <div class="item">
                            <em class="name">订单总计</em>
                            <div class="val">{{result.orderCount || 0}}</div>
                        </div>
                        <div class="item">
                            <em class="name">交易量总计</em>
                            <div class="val">
                                <span class="val-item" v-for="(item,index) in result.tradeAmount" :key="index">{{item.name}}: {{item.value}}</span>
                            </div>
                        </div>
                        <div class="item">
                            <em class="name">手续费总计</em>
                            <div class="val">
                                <span class="val-item" v-for="(item,index) in result.tradeFeeAmount" :key="index">{{item.name}}: {{item.value}}</span>
                            </div>
                        </div>
                        <!-- <div class="item">
                            <em class="name">佣金总计</em>
                            <div class="val">12306</div>
                        </div> -->
                    </div>
                    <!-- <div class="pagenation">
                        <select-page @changeSize="changeSize" :total="page.total" />
                        <el-pagination background layout="prev, pager, next,jumper,total" :current-page="page.page" :page-size="page.pageSize" :total="page.total" @current-change="handleCurrentChange">
                        </el-pagination>
                    </div> -->
                    <div class="btn-box" v-show="tableData.length">
                        <el-button type="success" @click="downloadExl">导出</el-button>
                    </div>

                </div>
            </div>
        </div>
    </div>

</template>
<script>
import Bread from "components/bread";
import SelectPage from "components/select-page";
import { getStatisticsList } from "api/api";
import { datetimeFormat, daterange } from "common/util";
import { getCurrencyList } from "common/mixin";
import XLSX from "xlsx";
import FileSaver from "file-saver";
// import 'xlsx-style';
// import { writeFileSync } from "fs";

export default {
    mixins: [getCurrencyList],
    data() {
        return {
            breadList: [
                { name: "统计分析", path: "" },
                { name: "统计分析", path: "/statistics/analysis" }
            ],
            search: {
                startDate: "",
                endDate: "",
                tradeType: "all",
                agent: false,
                userType: "owner",
                dataType: "day",
                currency: [],
                currencyAll: false,
                userName: "",
                ip: "",
                address: ""
            },
            tradeType: [
                { value: "all", name: "全部" },
                { value: "buy", name: "买入" },
                { value: "sell", name: "卖出" }
            ],
            tabCards: [
                { value: "day", name: "按天" },
                { value: "month", name: "按月" },
                { value: "year", name: "按年" },
                { value: "currency", name: "按币种" },
                { value: "user", name: "按用户" },
                { value: "ip", name: "按ip" }
            ],
            currentTab: 1,
            tableName: "按天",
            tmpTableName: "按天",
            tableData: [],
            result: {
                showFlag: false,
                tradeAmount: [],
                tradeFeeAmount: [],
                orderCount: 0
            },
            cols: [
                // { prop: "date", label: "日期" },
                // { prop: "name", label: "姓名" }
            ],
            page: {
                page: 1,
                pageSize: 30,
                total: 0
            }
        };
    },
    created() {
        // this._getStatisticsList();
    },
    methods: {
        selectType(item, index) {
            this.currentTab = index;
            this.search.dataType = item.value;
            this.tmpTableName = item.name;
            // this.tableName = item.name;
            // this._getStatisticsList();
        },
        changeAll(checkAll) {
            if (checkAll) {
                this.search.currency = [];
                this.currency.forEach(item => {
                    this.search.currency.push(item.name);
                });
            } else {
                this.search.currency = [];
            }
        },
        changeItem(checkItem) {
            // console.log(checkItem);
            if (checkItem.length == this.currency.length) {
                this.search.currencyAll = true;
            } else {
                this.search.currencyAll = false;
            }
        },
        _getStatisticsList() {
            this.result.showFlag = false;
            let searchObj = {
                userType: this.search.userType,
                agent: this.search.agent,
                dataType: this.search.dataType
            };

            let startDate = this.search.startDate,
                endDate = this.search.endDate;
            let flag = daterange(startDate, endDate);
            if (!flag) {
                return;
            }
            if (startDate && endDate) {
                searchObj.timeRage = {
                    min: startDate,
                    max: endDate
                };
            } else {
                this.$message.error("开始日期和结束日期必选");
                return;
            }

            if (this.search.currency.length && !this.search.currencyAll) {
                searchObj.currency = this.search.currency;
            }

            if (
                this.search.tradeType == "buy" ||
                this.search.tradeType == "sell"
            ) {
                searchObj.tradeType = this.search.tradeType;
            }

            if (this.search.userName) {
                let userName = this.search.userName.split(",");
                searchObj.userName = userName;
            }
            if (this.search.ip) {
                let ip = this.search.ip.split(",");
                searchObj.ip = ip;
            }
            if (this.search.address) {
                let address = this.search.address.split(",");
                searchObj.address = address;
            }

            getStatisticsList(searchObj).then(res => {
                if (res.code == 0) {
                    this.tableName = this.tmpTableName;
                    let data = res.data;
                    let column = data.column;
                    let rows = data.rows;
                    let cols = [];
                    let tableData = [];

                    if (column.length) {
                        column.forEach((item, index) => {
                            let obj = {};
                            obj.prop = `customProp${index + 1}`;
                            obj.label = item;
                            cols.push(obj);
                        });
                        for (let key in rows) {
                            let obj = {
                                dataType: key
                            };
                            cols.forEach((item, index) => {
                                obj[item.prop] = rows[key][index];
                            });
                            tableData.push(obj);
                        }
                        if (
                            data.dataType == "day" ||
                            data.dataType == "month" ||
                            data.dataType == "year"
                        ) {
                            tableData = tableData.sort((a, b) => {
                                return (
                                    new Date(a.dataType).getTime() -
                                    new Date(b.dataType).getTime()
                                );
                            });
                        }
                    }
                    this.cols = cols;
                    this.tableData = tableData;
                    // console.log(this.cols);
                    // console.log(this.tableData);

                    let tmptradeAmount = data.tradeAmount || {};
                    let tmptradeFeeAmount = data.tradeFeeAmount || {};
                    let tradeAmount = [],
                        tradeFeeAmount = [];
                    for (let key in tmptradeAmount) {
                        let obj = {};
                        obj.name = key;
                        obj.value = tmptradeAmount[key];
                        tradeAmount.push(obj);
                    }
                    for (let key in tmptradeFeeAmount) {
                        let obj = {};
                        obj.name = key;
                        obj.value = tmptradeFeeAmount[key];
                        tradeFeeAmount.push(obj);
                    }
                    this.result.showFlag = true;
                    this.result.orderCount = data.orderCount;
                    this.result.tradeAmount = tradeAmount;
                    this.result.tradeFeeAmount = tradeFeeAmount;
                } else {
                    this.$message.error(res.msg || "查询失败");
                }
            });
        },
        searchBtn() {
            let currency = this.search.currency;
            this.$set(this.search, "currency", currency);
            this._getStatisticsList();
        },
        handleCurrentChange(page) {
            this.page.page = page;
            // this._getOrderList();
        },
        changeSize(pageSize) {
            this.page.pageSize = Number(pageSize);
            this.page.page = 1;
            // this._getOrderList();
        },
        _datetimeFormat(time) {
            return datetimeFormat(time);
        },
        downloadExl() {
            let wb = XLSX.utils.table_to_book(
                    // document.getElementById("tableId")
                    this.$refs.table.$el,
                    {
                        raw: true,
                        alignment: 'center'
                        // dateNF: 17
                        // cellDates: true
                    }
                ),
                wopts = {
                    bookType: "csv",
                    bookSST: false,
                    type: "binary",
                    cellDates: true,
                    // alignment: 'center'
                },
                wbout = XLSX.write(wb, wopts);
                // console.log("wbout",wbout)

            // let ws = XLSX.utils.table_to_book
            // let wb0 = XLSX.utils.table_to_book(
            //     document.getElementById("tableId")
            // );
            // // console.log('wb0',wb0)
            // let ws = XLSX.utils.json_to_sheet(this.tableData,{header: ["Abc", "Bb", "Cbb", "Dfff", "Err"], skipHeader: true,origin: -1});
            // // console.log(ws);
            // let header = ["按天"];
            // this.cols.forEach(item => {
            //     header.push(item.prop);
            // });
            // console.log(header);
            // const wb = { SheetNames: ["Sheet1"], Sheets: {}, Props: {} };
            // wb.Sheets["Sheet1"] = XLSX.utils.sheet_to_csv(ws);
            // let wbout = XLSX.utils.sheet_to_csv(ws);
            // writeFileSync('test.svc', wb)
            // console.log("wb", wb);
            // return
            // let wopts = {
            //         bookType: "csv",
            //         bookSST: false,
            //         type: "binary"
            //     },
            //     wbout = XLSX.write(wb, wopts);
            FileSaver.saveAs(
                new Blob([this.s2ab(wbout)], {
                    type: "application/octet-stream;charset=utf-8"
                }),
                "file.csv"
            );
        },
        s2ab(s) {
            if (typeof ArrayBuffer !== "undefind") {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i != s.length; ++i)
                    view[i] = s.charCodeAt(i) & 0xff;
                return buf;
            } else {
                var buf = new Array(s.length);
                for (var i = 0; i != s.length; ++i)
                    buf[i] = s.charCodeAt(i) & 0xff;
                return buf;
            }
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

.order-box {
    padding: 20px;
}
.order {
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
        // border-bottom: 1px solid #ccc;
        .item {
            width: 100%;
            // height: 36px;
            line-height: 36px;
            display: flex;
            margin-bottom: 10px;
            .name {
                flex: 0 0 80px;
            }
            .val {
                flex: 1;
            }
        }
        .date {
            width: 230px;
            margin-bottom: 10px;
        }
        .tab-card {
            margin: 10px 0;
            // margin-top: 10px;
            // width: 440px;
            display: flex;
        }
        .cards {
            // border: 1px solid #e4e7ed;
            margin-right: 20px;
            .card {
                display: inline-block;
                padding: 8px 20px;
                border: 1px solid #e4e7ed;
                border-right: none;
                &:last-of-type {
                    border-right: 1px solid #e4e7ed;
                }
                &:hover {
                    color: #409eff;
                    border: 1px solid #409eff;
                }
            }
            .selected {
                color: #409eff;
                border: 1px solid #409eff;
                &:last-of-type {
                    border-right: 1px solid #409eff;
                }
            }
        }
    }
    .table {
        padding: 20px 15px;
        padding-top: 0px;
    }
    .result {
        padding-top: 10px;
        .item {
            height: 30px;
            line-height: 30px;
            display: flex;
            .name {
                flex: 0 0 100px;
            }
            .val {
                flex: 1;
                color: #409eff;
                .val-item {
                    margin-right: 20px;
                }
            }
        }
    }
    .btn-box{
        padding: 15px 0;
    }
    .pagenation {
        padding: 20px 0;
        display: flex;
        justify-content: flex-end;
    }
}
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 150px;
    // color: #99a9bf;
    color: rgba(0, 0, 0, 0.85);
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>
<style>
.tab-card .el-tabs__content {
    display: none;
}
</style>



