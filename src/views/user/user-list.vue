<template>
    <div class="container">
        <bread title="用户列表" desc="管理所有注册的用户账号" :list="breadNav"></bread>
        <div class="user-box">
            <div class="user">
                <header class="head">用户列表</header>
                <div class="search">
                    <el-input placeholder="用户昵称" v-model="search.name" class="item"></el-input>
                    <el-input placeholder="手机" v-model="search.phone" class="item"></el-input>
                    
                    <div class="search-time">
                        <span class="name">注册时间</span>
                        <el-date-picker v-model="search.startDate" value-format="timestamp"  type="date" placeholder="选择开始日期">
                        </el-date-picker>
                        <el-date-picker v-model="search.endDate" value-format="timestamp"  type="date" placeholder="选择结束日期">
                        </el-date-picker>
                        <!-- <span v-show="search.createTime">{{search.createTime}}</span> -->
                    </div>
                    <div class="search-time">
                        <span class="name">最后登录时间</span>
                        <el-date-picker v-model="search.sStartDate" value-format="timestamp"  type="date" placeholder="选择开始日期">
                        </el-date-picker>
                        <el-date-picker v-model="search.sEndDate" value-format="timestamp"  type="date" placeholder="选择结束日期">
                        </el-date-picker>
                        <!-- <span v-show="search.expireTime">{{search.expireTime}}</span> -->
                    </div>
                    <div class="search-time">
                        <!-- <span class="name">是否下线统计</span> -->
                        <el-checkbox v-model="search.isDownlineStats">是否下线统计</el-checkbox>
                    </div>
                    <!-- <el-checkbox class="item" style="width: 100px;padding-left: 5px;" v-model="search.isDownlineStats">下线统计</el-checkbox> -->
                    
                    <el-button type="success" @click="searchBtn">搜索</el-button>
                     <el-button type="success" @click="add()">批量新增账户</el-button>
                </div>
                <div class="table">
                    <el-table ref="table" :data="tableData"  @sort-change="sortChange" :header-cell-style="{color: 'rgba(0,0,0,.85)','text-align': 'center'}" :cell-style="{'text-align': 'center'}" style="width: 100%">
                        <el-table-column prop="email" label="用户邮箱" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="nickName" label="用户昵称" sortable="custom">
                        </el-table-column>
                        
                        <el-table-column prop="phone" label="手机号" sortable="custom">
                        </el-table-column>
                        <el-table-column prop="registerTime" label="注册时间" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{_datetimeFormat(scope.row.registerTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="signinTime" label="最后登录时间" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{_datetimeFormat(scope.row.signinTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="推荐人昵称" >
                            <template slot-scope="scope">
                                <span>{{scope.row.parentUser ? scope.row.parentUser.nickName : "" }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="success" class="operate" @click="handleEdit(scope.$index, scope.row._id)">
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
        <!-- 批量新增用户 -->
         <dia-log title="批量新增账户"  class="dia-log" ref="accountBox" @sure="save">
            <div class="content">
                      <el-tabs v-model="activeName" @tab-click="clear()">
                            <!-- 手机号码验证 -->
                            <el-tab-pane label="手机" name="phone" >
                                 <div class="item">
                                    <span class="name">新增账号数范围</span>
                                    <el-input class="val"  type="number"  min="0" v-model="accountForm.start" style="width:130px"></el-input>
                                    <span class="wave">~</span>
                                    <el-input class="val" type="number"  min="0" v-model="accountForm.end"></el-input>
                                </div>
                                <div class="item">
                                    <span class="name">手机前缀7位数</span>
                                    <el-input class="val"   type="number"  min="0" v-model="accountForm.phoneQianZui"></el-input>
                                </div>
                                <div class="item">
                                    <span class="name">账号密码</span>
                                    <el-input class="val"  v-model="accountForm.passwd"></el-input>
                                </div>
                                 <!-- <div class="item">
                                    <span class="name">是否为账户创建钱包</span>
                                    <el-switch
                                        v-model="accountForm.iswallet"
                                        active-color="#13ce66" inactive-color="#dcdfe6">
                                    </el-switch>
                                </div> -->
                                <!-- <div v-if="accountForm.iswallet">
                                     <div class="item">
                                         <span class="name">创建钱包币种</span>
                                        <div class="val">
                                            <el-select v-model="accountForm.currency" class="acquisition" placeholder="请选择">
                                                <el-option v-for="item in currencyList" :key="item._id" :label="item.name" :value="item._id">
                                               </el-option>
                                            </el-select>
                                        </div>
                                     </div>
                                     <div class="item">
                                         <span class="name">创建币种数额</span>
                                         <el-input class="val"  v-model="accountForm.amount" type="number"  min="0"></el-input>
                                     </div>
                                </div> -->
                            </el-tab-pane>
                                    <!-- 邮箱验证 -->
                                <el-tab-pane label="邮箱" name="email" >
                                    <div class="item">
                                        <span class="name">新增账号数范围</span>
                                        <el-input class="val"  v-model="accountForm.start" style="width:130px" type="number"  min="0"></el-input>
                                        <span class="wave">~</span>
                                        <el-input class="val"  v-model="accountForm.end" type="number"  min="0"></el-input>
                                    </div>
                                    <div class="item" >
                                        <span class="name">邮箱前缀及后缀</span>
                                        <el-input class="val"  placeholder="请输入邮箱前缀" v-model="accountForm.emailQianZui"></el-input>
                                        
                                        <el-input class="val" placeholder="请输入邮箱后缀" v-model="accountForm.emailHouZui">
                                          <template slot="prepend">@</template>
                                        </el-input>
                                    </div>
                                    <div class="item">
                                        <span class="name">账号密码</span>
                                        <el-input class="val"  v-model="accountForm.passwd"></el-input>
                                    </div>
                                    <!-- <div class="item">
                                        <span class="name">是否为账户创建钱包</span>
                                        <el-switch
                                            v-model="accountForm.iswallet"
                                            active-color="#13ce66" inactive-color="#dcdfe6">
                                        </el-switch>
                                    </div> -->
                                    <!-- <div v-if="accountForm.iswallet">
                                        <div class="item">
                                            <span class="name">创建钱包币种</span>
                                            <div class="val">
                                                <el-select v-model="accountForm.currency" class="acquisition" placeholder="请选择">
                                                    <el-option v-for="item in currencyList" :key="item._id" :label="item.name" :value="item._id">
                                                </el-option>
                                                </el-select>
                                            </div>
                                        </div>
                                        <div class="item">
                                            <span class="name">创建币种数额</span>
                                            <el-input class="val" type="number"  min="0" v-model="accountForm.amount"></el-input>
                                        </div>
                                    </div> -->
                            </el-tab-pane>
                        </el-tabs>
            
            </div>
        </dia-log>
    </div>

</template>
<script>
import Bread from "components/bread";
import SelectPage from "components/select-page";
import { getUserList,addManyAcount,getCurrency } from "api/api";
import { datetimeFormat ,daterange } from "common/util";
import DiaLog from "components/dia-log";

export default {
    data() {
        return {
            breadNav: [
                { name: "用户管理", path: "" },
                { name: "用户列表", path: "/user/userlist" }
            ],
            search: {
                name: "",
                phone: "",
                // time: [],
                startDate:"",
                endDate: "",
                sStartDate:"",
                sEndDate: "",
                sort: "",
                isDownlineStats: false
            },
            tableData: [],
            page: {
                page: 1,
                pageSize: 10,
                total: 0
            },

         activeName:"phone",
         currencyList:[
             {name:"abc",id:"0"}
         ],
          accountForm:{
            start:0,
            end:1,
            phoneQianZui:"",
            emailQianZui:"",
            emailHouZui:"",
            passwd:"",
            iswallet:false,
          }
        };
    },
    created() {
        this._getUserList();
      
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
            this._getUserList();
        },
        _getUserList(obj) {
            let startDate = this.search.startDate, endDate = this.search.endDate, sStartDate = this.search.sStartDate,sEndDate = this.search.sEndDate
            let flag =  daterange(startDate,endDate,'注册时间')
            let sFlag = daterange(sStartDate,sEndDate,'最后登录时间')
            if(!flag){
                return 
            }
            if(!sFlag){
                return
            }

            let searchObj = {
                page: this.page.page,
                pageSize: this.page.pageSize,
                phone: this.search.phone,
                name: this.search.name,
                sort: this.search.sort,
                isDownlineStats: this.search.isDownlineStats,
                startDate: startDate,
                endDate: endDate,
                sStartDate: sStartDate,
                sEndDate: sEndDate
            }
            getUserList(searchObj).then(res => {
                if (res.code == 0) {
                    this.tableData = res.data.list;
                    this.page.total = res.data.count;
                }
            });
        },
        handleEdit(index, id) {
            this.$router.push({
                path: `/user/detail/${id}`
            });
        },
        searchBtn() {
            this.$refs.table.clearSort()
            this.page.page = 1;
            this.search.sort = ""
            this._getUserList();
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this._getUserList();
        },
        changeSize(pageSize) {
            // console.log(2343)
            this.page.pageSize = Number(pageSize);
            this.page.page = 1;
            this._getUserList();
        },
        _datetimeFormat(time) {
            return datetimeFormat(time);
        },
        addAcounts(){

        },
        // 新增账户
         add() {
            this.clear();
            this.$refs.accountBox.show();
         },
          clear() {
              this.accountForm.phoneQianZui=this.accountForm.emailQianZui=
              this.accountForm.emailHouZui=this.accountForm.passwd=
              this.accountForm.start=this.accountForm.end="";
        },
        accountFormYanZheng(){
              if (!this.accountForm.start || !this.accountForm.end) {
                this.$message.error("账户范围必须填写完整");
                return;
              }
              if(this.accountForm.start>=this.accountForm.end){
                  this.$message.error("账户后面的范围值必须大于账户前面的范围值");
                  return;
              }
              if(this.accountForm.start<0 || this.accountForm.end<0){
                  this.$message.error("账户范围值必须为大于0的数字");
                  return;
              }

            if(this.activeName=="phone"){
                if(this.accountForm.phoneQianZui==""){
                    this.$message.error("手机前缀必填");
                    return;
                }
                if(this.accountForm.phoneQianZui<0){
                    this.$message.error("手机前缀不能为负数");
                    return;
                }
                if(this.accountForm.phoneQianZui.trim().length!==7){
                    this.$message.error("手机前缀必须为7位数");
                    return;
                }
            }

            if(this.activeName=="email"){
                if(this.accountForm.emailQianZui=="" || this.accountForm.emailHouZui==""){
                    this.$message.error("邮箱前缀和后缀必须填写");
                    return;
                }
                if(this.accountForm.emailHouZui.includes("@")){
                     this.$message.error("邮箱后缀不能有重复的 @ ");
                    return;
                }
            }
             if(this.accountForm.passwd==""){
                    this.$message.error("密码必填");
                    return;
                }
               if(!/^\w{6,18}$/.test(this.accountForm.passwd)){
                    this.$message.error("密码必须是以字母、下划线或数字组成的6-18位字符串！");
                    return;
                }
        
            return true;

        },
          save() {
           if(this.accountFormYanZheng()){
               var fixstr=[];
               this.activeName=="phone" ? fixstr=[parseInt(this.accountForm.phoneQianZui)] : 
               fixstr=[this.accountForm.emailQianZui,`@${this.accountForm.emailHouZui}`]
            
              let postObj = {
                type: this.activeName,
                range: [parseInt(this.accountForm.start),parseInt(this.accountForm.end)],
                fixstr: fixstr,
                passwd: this.accountForm.passwd,
                iswallet: false,
            };
           
            addManyAcount(postObj).then(res => {
                    if (res.code == 0) {
                        this.$message.success(`当前批量新增账号成功,账号范围：${res.data.startAccount}~${res.data.endAccount}`);
                        this.$refs.accountBox.hide();
                        this._getUserList();
                    } else {
                        this.$message.error(res.msg || "批量新增账号失败");
                    }
                    })

           
           }
           
           
        },
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
            .search-time{
                display: inline-block;
                margin-bottom: 10px;
                margin-right: 10px;
                .name{
                    margin: 0 10px;
                    color: #606266;
                }
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
             .wave{
                 width: 50px;
                text-align: center;
                font-size: 19px;
                color: #b2b3b5;
            }
            .name {
                flex: 0 0 130px;
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
.user .date .el-range-separator {
    width: 10%;
}
</style>


