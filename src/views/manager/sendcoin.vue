<template>
    <div class="container">
        <bread title="发币" desc="系统发币管理" :list="breadNav"></bread>
        <div class="recharge-box">
            <div class="recharge">
                <header class="head">发币列表</header>
                <div class="search">
                    <!-- <el-select class="item" v-model="search.currency" style="width:280px;" clearable placeholder="请选择虚拟币" >
                        <el-option v-for="item in currency" :key="item._id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select> -->
                    <el-input v-model="search.currency" placeholder="请输入发币币种" style="width:280px;" class="item"></el-input>
                    <el-select class="item" v-model="search.status" style="width:280px;" clearable placeholder="请选择发币状态" >
                        <el-option v-for="item in coinStatus" :key="item.value" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                    <div class="search-time">
                        <span class="name">创建时间</span>
                        <el-date-picker v-model="search.cStartDate" value-format="timestamp" type="date" placeholder="选择开始日期">
                        </el-date-picker>
                        <el-date-picker v-model="search.cEndDate" value-format="timestamp" type="date" placeholder="选择结束日期">
                        </el-date-picker>
                    </div>
                    <div class="search-time">
                        <span class="name">更新时间</span>
                        <el-date-picker v-model="search.uStartDate" value-format="timestamp" type="date" placeholder="选择开始日期">
                        </el-date-picker>
                        <el-date-picker v-model="search.uEndDate" value-format="timestamp" type="date" placeholder="选择结束日期">
                        </el-date-picker>
                    </div>
                    <el-button type="success" @click="searchBtn">搜索</el-button>
                    <!-- <el-button type="success" class="add" @click="add" v-show="permissions.fiatCurrency_add">新增法币</el-button> -->
                </div>
                <div class="table">
                    <el-table ref="table" :data="tableData" @sort-change="sortChange" :header-cell-style="{color: 'rgba(0,0,0,.85)','text-align': 'center'}" :cell-style="{'text-align': 'center'}" style="width: 100%">
                        <el-table-column prop="currency" label="发币币种" >
                        </el-table-column>
                        <el-table-column prop="amount" label="发币个数" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="ethAddr" label="钱包地址" >
                        </el-table-column>
                        <el-table-column prop="userId" label="用户昵称" >
                        </el-table-column>
                        <el-table-column prop="createTime" label="发币时间" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="updateTime" label="更新时间" sortable="custom">
                        </el-table-column>
                        <el-table-column label="状态" >
                            <template slot-scope="scope">
                                <!-- {{showStatus(scope.row.status)}} -->
                                <el-popover
                                    ref="popover1"
                                    placement="top-end"
                                    trigger="hover"
                                    content="点击更改为下一状态"
                                    :disabled="showStatus(scope.row.status,'pop')"
                                >
                                </el-popover>
                                <el-button size="mini" :type="showStatus(scope.row.status, 'type')" class="operate"  v-popover:popover1  @click="handleEdit(scope.$index, scope.row.issueId, scope.row.status)">
                                    {{showStatus(scope.row.status,'button')}}
                                </el-button>
                                <!-- type="info success" -->
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
        <DiaLog class="dialog" title="编辑发币状态" ref="sendCoin" @sure="editsendCoin" :sureBtnAble="sureBtnAble">
          <!-- <el-select v-model="operate.status" placeholder="请选择转态" style="width: 100%;margin-bottom: 20px;"   >
            <el-option
              v-for="item in coinStatus"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select> -->
          <div style="margin-bottom: 10px;">
              <span>更改发币状态为: </span>
              <em style="color: #f44;">{{showStatus(operate.status,'button')}}</em>
          </div>
          <div class="finished" v-show="operate.status === 'finished'" >
            <!-- <el-input v-model="operate.prePrice" placeholder="请输入初始价格" ></el-input> -->
            <!-- <el-input v-model="operate.address" placeholder="请输入合约地址" style="margin-bottom: 10px;" ></el-input> -->
            <el-input v-model="operate.address" placeholder="请输入合约地址(基于ETH)" style="margin-bottom: 10px;" ></el-input>
            <div class="loading" v-show="loading">
                <i class="el-icon-loading"></i>
            </div>
            <!-- <el-input v-model="operate.btcOmniId" placeholder="请输入合约地址(基于BTC)"></el-input> -->
          </div>
          <!-- <div class="cenceled" v-show="operate.status === 'cancelled'">
              <el-input v-model="operate.remark" placeholder="请输入取消原因"></el-input>
          </div> -->
        </DiaLog>
    </div>

</template>
<script>
import Bread from "components/bread";
import DiaLog from "components/dia-log";
import SelectPage from "components/select-page";
import {
  getIssueCurrencyList,
  issueCurrencyInprogress,
  issueCurrencyCancel,
  issueCurrencyApprove
} from "api/api";
import { fabiAcquisitionMode, payway, paywayImg } from "common/baseData";
import { getCurrencyList } from "common/mixin";
import { getWpermissions, daterange } from "common/util";

export default {
  mixins: [getCurrencyList],
  data() {
    return {
      coinStatus: [
        { name: "已申请", value: "putin" },
        { name: "进行中", value: "inprogress" },
        { name: "已完成", value: "finished" },
        { name: "已取消", value: "cancelled" }
      ],
      issueId: "",
      breadNav: [
        { name: "管理发币", path: "" },
        { name: "发币列表", path: "" }
      ],
      operate: {
        status: "",
        address: "",
        remark: "",
        prePrice: 0
        // btcOmniId: ""
      },
      permissions: {
        issueCurrency_GET: false
      },
      search: {
        currency: "",
        status: "",
        sort: "",
        cStartDate: "",
        cEndDate: "",
        uStartDate: "",
        uEndDate: ""
      },
      loading: false,
      sureBtnAble: false,
      tableData: [],
      page: {
        pageSize: 10,
        total: 0,
        page: 1
      }
    };
  },
  created() {
    this._getIssueCurrencyList();
    getWpermissions(this.permissions);
    // console.log(this.permissions)
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
      this._getIssueCurrencyList();
    },
    _getIssueCurrencyList() {
      let cStartDate = this.search.cStartDate,
        cEndDate = this.search.cEndDate,
        uStartDate = this.search.uStartDate,
        uEndDate = this.search.uEndDate;
      let flag = daterange(cStartDate, cEndDate, "创建时间");
      let dFlag = daterange(uStartDate, uEndDate, "更新时间");
      if (!flag) {
        return;
      }
      if (!dFlag) {
        return;
      }
      let searchObj = {
        page: this.page.page,
        pageSize: this.page.pageSize,
        currency: this.search.currency,
        status: this.search.status.toUpperCase(),
        cStartDate: cStartDate,
        cEndDate: cEndDate,
        uStartDate: uStartDate,
        uEndDate: uEndDate,
        sort: this.search.sort
      };

      getIssueCurrencyList(searchObj).then(res => {
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
      this._getIssueCurrencyList();
    },
    handleEdit(index, id, status) {
      status = status.toLowerCase();
      let nextStatus;
      if (status === "putin") {
        nextStatus = "inprogress";
      } else if (status === "inprogress") {
        nextStatus = "finished";
      } else {
        return;
      }
      this.issueId = id;
      this.operate.status = nextStatus;
      this.operate.address = "";
      //   this.operate.remark = "";
      this.$refs.sendCoin.show();
    },
    showStatus(status, flag) {
      if (flag == "button") {
        let index = this.coinStatus.findIndex(item => {
          return item.value === status.toLowerCase();
        });
        if (index > -1) {
          return this.coinStatus[index].name;
        } else {
          return "";
        }
      }
      if (flag == "type") {
        status = status.toLowerCase();
        if (status == "cancelled" || status == "finished") {
          return "info";
        } else {
          return "success";
        }
      }
      if (flag == "pop") {
        status = status.toLowerCase();
        if (status == "cancelled" || status == "finished") {
          return true;
        } else {
          return false;
        }
      }
    },
    editsendCoin() {
      let status = this.operate.status;
      let postObj = {
        issueId: this.issueId
      };
      this.sureBtnAble = true
      if (status === "inprogress") {
        issueCurrencyInprogress(postObj).then(res => {
          this.sureBtnAble = false
          if (res.code == 0) {
            this.$refs.sendCoin.hide();
            this.$message.success(res.msg || "修改成功");
            this.clearSearch();
            this._getIssueCurrencyList();
          } else {
            this.$message.error(res.msg || "");
          }
        }).catch((err) => {
          this.sureBtnAble = false
        });
      } else if (status === "finished") {
        let contactAddr = this.operate.address.trim();
        if (!contactAddr) {
          this.$message.error("合约地址必填");
          this.sureBtnAble = false
          return;
        }
        postObj = Object.assign(postObj, {
          contactAddr: contactAddr,
          prePrice: this.operate.prePrice
          // btcOmniId: this.operate.btcOmniId.trim()
        });
        this.loading = true;
        issueCurrencyApprove(postObj).then(res => {
          this.loading = false;
          this.sureBtnAble = false
          if (res.code == 0) {
            this.$refs.sendCoin.hide();
            this.$message.success(res.msg || "修改成功");
            this.clearSearch();
            this._getIssueCurrencyList();
          } else {
            this.$message.error(res.msg || "");
          }
        }).catch((err) => {
          this.sureBtnAble = false
        });
      }
      //   else if (status === "cancelled") {
      //     postObj = Object.assign(postObj, {
      //       remark: this.operate.remark
      //     });
      //     issueCurrencyCancel(postObj).then(res => {
      //       if (res.code == 0) {
      //         this.$refs.sendCoin.hide();
      //         this.clearSearch();
      //         this._getIssueCurrencyList();
      //       } else {
      //         this.$message.error(res.msg || "");
      //       }
      //     });
      //   }
    },
    clear() {},
    clearSearch() {
      this.page.page = 1;
      this.search.currency = "";
      this.search.status = "";
      this.search.sort = "";
      this.$refs.table.clearSort();
    },
    handleCurrentChange(page) {
      this.page.page = page;
      this._getIssueCurrencyList();
    },
    changeSize(pageSize) {
      this.page.pageSize = Number(pageSize);
      this.page.page = 1;
      this._getIssueCurrencyList();
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
      .search-time {
        // width: 180px;
        margin: 0 20px 10px 0;
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
.container .loading {
  width: 100%;
  text-align: center;
  font-size: 32px;
  padding-top: 10px;
}
</style>
<style>
.recharge .date .el-range-separator {
  width: 10%;
}
</style>


