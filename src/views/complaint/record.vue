<template>
    <div class="container">
        <bread title="申诉中心" desc="管理交易的申诉情况" :list="breadList"></bread>
        <div class="order-box">
            <div class="order">
                <header class="head">申诉列表</header>
                <div class="search">
                    <el-input placeholder="申诉人昵称" v-model="search.appealName" class="item"></el-input>
                    <el-select class="item" v-model="search.processResult" style="width:180px;" clearable placeholder="申诉处理结果">
                        <el-option v-for="item in processResult" :key="item.id" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                        <div class="search-time" style="margin-bottom:10px">
                        <span class="name">申诉时间</span>
                        <el-date-picker v-model="search.cStartDate"   value-format="timestamp" type="date" placeholder="选择开始日期">
                        </el-date-picker>
                        <el-date-picker v-model="search.cEndDate"  value-format="timestamp" type="date" placeholder="选择结束日期" >
                        </el-date-picker>
                    </div>
                    <div class="search-time" style="margin-bottom:10px">
                        <span class="name">处理时间</span>
                        <el-date-picker v-model="search.pStartDate" value-format="timestamp" type="date" placeholder="选择开始日期">
                        </el-date-picker>
                        <el-date-picker v-model="search.pEndDate" value-format="timestamp" type="date" placeholder="选择结束日期">
                        </el-date-picker>
                    </div>

                    <el-button type="success" @click="searchBtn">搜索</el-button>
                </div>
                <div class="table">
                    <el-table ref="table" :data="tableData"  :header-cell-style="{color: 'rgba(0,0,0,.85)','text-align': 'center'}" :cell-style="{'text-align': 'center'}" style="width: 100%">
                        <!-- <el-table-column type="index" width="50"  >
                        </el-table-column> -->
                        <el-table-column prop="appealUser" label="申诉人昵称" >
                        </el-table-column>
                        
                        <el-table-column prop="processorName" label="申诉处理人昵称"  >
                        </el-table-column>
                        <el-table-column prop="processorName" label="申诉处理结果"  >
                            <template slot-scope="scope">
                                <span>{{scope.row.processResult == 'success' ? '释放货币' : '取消订单'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="申诉时间" >
                            <template slot-scope="scope">
                                <span>{{_datetimeFormat(scope.row.createTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="申诉处理时间" >
                            <template slot-scope="scope">
                                <span>{{_datetimeFormat(scope.row.processTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column  label="操作"  >
                            <template slot-scope="scope">
                                <el-button size="mini" type="success" class="operate" @click="handleEdit(scope.$index, scope.row.appealId)">
                                    <i class="el-icon-check"></i>
                                    详情</el-button>
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
import { getAppealProcessedList } from "api/api";
import { datetimeFormat ,daterange} from "common/util";
// import { orderStatus, paywayImg } from "common/baseData";
// import { getCurrencyList, getFiatCurrencyList, parseUser } from "common/mixin";

export default {
    // mixins: [getCurrencyList, getFiatCurrencyList, parseUser],
    data() {
        return {
            breadList: [
                { name: "申诉中心", path: "" },
                { name: "已处理申诉", path: "/appeal/record" }
            ],
            search: {
                processorName: "",
                appealName:"",
                processResult:"",
                cStartDate:"",
                cEndDate:"",

                pStartDate: "",
                pEndDate: "",
            },
            tableData: [],
              processResult: [
                { value: "fail", name: "取消订单" },
                { value: "success", name: "释放货币" }
            ],
            page: {
                page: 1,
                pageSize: 10,
                total: 0
            }
        };
    },
    created() {
        this._getAppealProcessedList();
    },
    methods: {
        _getAppealProcessedList() {
              let cStartDate = this.search.cStartDate,
                cEndDate = this.search.cEndDate,
                pStartDate = this.search.pStartDate,
                pEndDate = this.search.pEndDate;
                let flag = daterange(cStartDate, cEndDate, "创建时间");
                let dFlag = daterange(pStartDate, pEndDate, "过期时间");
                if (!flag) {
                    return;
                }
                if (!dFlag) {
                    return;
                }
            let searchObj = {
                page: this.page.page,
                pageSize: this.page.pageSize,

                appealName: this.search.appealName,
                processResult  : this.search.processResult  ,
                cStartDate: cStartDate,
                cEndDate: cEndDate,
                pStartDate: pStartDate,
                pEndDate: pEndDate
            };
            getAppealProcessedList(searchObj).then(res => {
                if (res.code == 0) {
                    this.tableData = res.data.list;
                    this.page.total = res.data.count;
                }
            });
        },
        handleEdit(index,appealId){
            // console.log(appealId)
          this.$router.push({
            path: `/complaint/detail/${appealId}`
          })
        },
        searchBtn() {
            // this.$refs.table.clearSort()
            this.page.page = 1;
            // this.search.sort = "";
            this._getAppealProcessedList();
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this._getAppealProcessedList();
        },
        changeSize(pageSize) {
            this.page.pageSize = Number(pageSize);
            this.page.page = 1;
            this._getAppealProcessedList();
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
        .tag {
            color: #fff;
        }
        .deal-img {
            width: 30px;
            height: 30px;
            display: inline-block;
            margin-right: 3px;
            margin-bottom: 3px;
        }
        .status {
            display: inline-block;
            padding: 1px 4px;
            color: #fff;
            border-radius: 4px;
            font-size: 12px;
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
.search .date .el-range-separator {
    width: 10%;
}
</style>



