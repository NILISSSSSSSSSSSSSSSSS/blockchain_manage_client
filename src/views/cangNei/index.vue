<template>
    <div class="container">
        <bread title="交易记录" desc="管理所有交易记录" :list="breadNav"></bread>
        
        <div class="record-box">
            <div class="record">
                <header class="head">交易记录列表</header>
                <div class="search">
                    <el-select class="item" v-model="search.tradeType" style="width:180px;" clearable placeholder="请选择交易类型">
                        <el-option v-for="item in tradeType" :key="item.value" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-date-picker v-model="search.startDate" value-format="timestamp" type="date" placeholder="选择开始日期">
                    </el-date-picker>
                    <el-date-picker v-model="search.endDate" value-format="timestamp" type="date" placeholder="选择结束日期">
                    </el-date-picker>
                    <!-- <el-date-picker class="date" v-model="search.time" value-format="timestamp" type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker> -->
                    <el-button type="success" @click="searchBtn">搜索</el-button>
                    <el-button type="success" @click="exportData()">导出</el-button>
                    
                </div>
                <div class="table">
                    <el-table ref="table" :data="tableData"  @sort-change="sortChange" :header-cell-style="{color: 'rgba(0,0,0,.85)','text-align': 'center'}" :cell-style="{'text-align': 'center'}" style="width: 100%">
                        
                        <el-table-column prop="_id" label="记录ID" sortable="custom" > </el-table-column>

                         <el-table-column prop="userId" label="用户ID" sortable="custom" > </el-table-column>

                          <el-table-column prop="nickName" label="用户名称" sortable="custom" > </el-table-column>

                        <el-table-column prop="txType" label="类型" sortable="custom">
                            <template slot-scope="scope">
                                <span class="user" >{{scope.row.txType | formatType}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column prop="txAmount" label="交易金额" sortable="custom">
                            <template slot-scope="scope">
                                <span class="user" >{{scope.row.txAmount}}</span>
                            </template>
                        </el-table-column>

                           <el-table-column prop="txTime" label="交易时间" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{_datetimeFormat(scope.row.txTime)}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column prop="outFlowNo" label="出金情况流水号" sortable="custom" >
                            <template slot-scope="scope">
                                <span v-if="scope.row.txType=='D'">{{scope.row.outFlowNo}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column prop="txLogNo" label="交易流水号" sortable="custom">
                        </el-table-column>
                        
                        <el-table-column prop="remark" label="备注" sortable="custom">
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
import { getCangNeiRecord,cangNeiExport } from "api/api";
import { datetimeFormat, daterange } from "common/util";

export default {
    data() {
        return {
            breadNav: [
                { name: "场内交易", path: "" },
                { name: "交易记录", path: "/cangNei/index" }
            ],
            search: {
                tradeType: "",
                startDate: "",
                endDate: "",
                sort: ""
            },
            tableData: [],
             tradeType: [
                { value: "D", name: "出金" },
                { value: "C", name: "入金" }
            ],
            ziJinIsShow:true,
            page: {
                page: 1,
                pageSize: 10,
                total: 0
            }
        };
    },
    created() {
        this._getTraderecord();
    },
    filters:{
        formatType(val){
          if(val=="D") return "出金";
          else if(val=="C") return "入金";
          else return "undefined"
        }
    },
    methods: {
        exportData(){
            let startDate = this.search.startDate,
                endDate = this.search.endDate;
            let flag = daterange(startDate, endDate);
            if (!flag) {
                return;
            }

            let searchObj = {
                txType: this.search.tradeType,
                startDate: this.search.startDate,
                endDate: this.search.endDate,
            };
            cangNeiExport(searchObj).then(res => {
                if (res.code == 0) {
                     var downloadUrl=this.getUrl()+res.data.url;
                     console.log(downloadUrl)
                     location.href=downloadUrl
                }
                else{
                    this.$message.error(res.msg || "导出失败");
                }
            });
        },
        sortChange({ column, prop, order }) {
            if (order == "ascending") {
                this.search.sort = `${prop}.asc`;
            } else if (order == "descending") {
                this.search.sort = `${prop}.desc`;
            } else {
                this.search.sort = "";
            }
            this._getTraderecord();
        },
        _getTraderecord() {
            let startDate = this.search.startDate,
                endDate = this.search.endDate;
            let flag = daterange(startDate, endDate);
            if (!flag) {
                return;
            }

            let searchObj = {
                page: this.page.page,
                pageSize: this.page.pageSize,
                txType: this.search.tradeType,
                startDate: this.search.startDate,
                endDate: this.search.endDate,
                sort: this.search.sort
            };
            
            getCangNeiRecord(searchObj).then(res => {
                if (res.code == 0) {
                    this.tableData = res.data.list;
                //     for(let i=0;i<res.data.list.length;i++){
                //         if(res.data.list[i].outFlowNo){
                //             res.data.list[i].ziJinIsShow=true;
                //         }
                //         else{
                //              res.data.list[i].ziJinIsShow=false;
                //         }
                //     }
                //   this.tableData = res.data.list;
                    console.log(this.tableData)
                    this.page.total = res.data.count;
                }
            });
        },
        searchBtn() {
            this.$refs.table.clearSort()
            this.page.page = 1;
            this.search.sort = ""
            this._getTraderecord();
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this._getTraderecord();
        },
        changeSize(pageSize) {
            this.page.pageSize = Number(pageSize);
            this.page.page = 1;
            this._getTraderecord();
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


