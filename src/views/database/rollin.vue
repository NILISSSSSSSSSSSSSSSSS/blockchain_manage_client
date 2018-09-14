<template>
    <div class="container">
        <bread title="币种统计" desc="资金概况" :list="breadNav"></bread>
        <div class="recharge-box">
            <div class="recharge">
                <header class="head">虚拟币列表</header>
                <div class="table">
                    <el-table ref="table" :data="tableData" :header-cell-style="{color: 'rgba(0,0,0,.85)','text-align': 'center'}" :cell-style="{'text-align': 'center'}" style="width: 100%">
                        <el-table-column prop="currency" label="币种">
                            <template slot-scope="scope">
                                <span>{{scope.row.currency}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="depositsCount" label="充值总次数">
                            <template slot-scope="scope">
                                <span>{{scope.row.depositsCount}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="depositsAmount" label="充值总金额">
                            <template slot-scope="scope">
                                <span>{{scope.row.depositsAmount}} {{scope.row.currency}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="rollinCount" label="回笼总数">
                            <template slot-scope="scope">
                                <span>{{scope.row.rollinCount}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="rollinAmount" label="回笼总金额">
                            <template slot-scope="scope">
                                <span>{{scope.row.rollinAmount}} {{scope.row.currency}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="rollinFee" label="回笼燃油费">
                            <template slot-scope="scope">
                                <span>{{scope.row.rollinFee}} {{scope.row.currency!='BTC'?'ETH':scope.row.currency}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="rollinOverFee" label="回笼额外燃油费">
                            <template slot-scope="scope">
                                <span>{{scope.row.rollinOverFee}} {{scope.row.currency!='BTC'?'ETH':scope.row.currency}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="addressAmount" label="剩余未回笼数额">
                            <template slot-scope="scope">
                                <span>{{scope.row.addressAmount}} {{scope.row.currency}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import Bread from "components/bread";
import { getCurrencyStat } from "api/api";
import { datetimeFormat ,daterange } from "common/util";
import { parseUser} from "common/mixin";


export default {
    mixins: [parseUser],
    data() {
        return {
            breadNav: [
                { name: "数据管理", path: "" },
                { name: "币种统计", path: "/database/rollin" }
            ],
            currency:"",
            usedArr:[1,2,3,4],
            tableData: [1,2,3,4,5],
        };
    },
    created() {
        this._getCurrencyStat();
    },
    methods: {
        sortChange(){ },
        
        _getCurrencyStat() {
            getCurrencyStat().then(resp=>{
                // console.log(resp)
                if(resp.code==0){
                    this.tableData=resp.data;
                }
            })
        },
    },
    components: {
        Bread
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


