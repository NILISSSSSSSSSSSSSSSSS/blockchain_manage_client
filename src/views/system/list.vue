<template>
    <div class="container">
        <bread title="通用配置" desc="系统的一些通用配置" :list="breadNav"></bread>
        <div class="recharge-box">
            <div class="recharge">
                <header class="head">通用配置</header>
                <section class="content">
                    <ul class="base">
                        <li class="item">
                          <div>
                            <span class="name">期货入金地址:</span>
                            <el-input :disabled="!enableFutures" style="margin-bottom: 10px;" placeholder="期货入金地址" type="text" v-model="futuresIP"/>
                          </div>
                          <div>
                            <span class="name">期货入金端口:</span>
                            <el-input :disabled="!enableFutures" style="margin-bottom: 10px;" placeholder="期货入金端口" type="number" v-model="futuresPort"/>
                          </div>
                          <div>
                            <span class="name">交易刷新时间：</span>
                            <el-input placeholder="刷新的秒数" type="number" v-model="lampRefresh">
                                <template slot="append">
                                    秒
                                </template>
                            </el-input>
                          </div>
                        </li>
                        <li class="item">
                          <div>
                            <span class="name">广告可见时间:</span>
                            <el-input class="val" :maxlength="10" placeholder="请输入广告可见时间" v-model="advertiseVisibleTime">
                                <el-button slot="append">天</el-button>
                            </el-input>
                          </div>
                          <div>
                            <span class="name">系统举证等待时间:</span>
                            <el-input class="val" :maxlength="10" placeholder="请输入系统举证等待时间" v-model="waitAppealTime">
                                <el-button slot="append">小时</el-button>
                            </el-input>
                          </div>
                          <div>
                            <span class="name">官方币币种:</span>
                            <div class="val">
                                <el-select class="select" v-model="officialCurrency" placeholder="请选择虚拟币">
                                    <el-option v-for="item in currency" :key="item._id" :label="item.name" :value="item._id">
                                    </el-option>
                                </el-select>
                            </div>
                          </div>
                        </li>
                        <!-- <li class="item" >
                          <div>
                            <span class="name">发币手续费(ETH):</span>
                            <el-input style="margin-bottom: 10px;" placeholder="请输入ETH手续费" type="text" v-model="futuresPort"/>
                          </div>
                          <div>
                            <span class="name">发币审核者邮箱</span>
                            <el-input style="margin-bottom: 10px;" placeholder="请输入发币审核者邮箱" type="text" v-model="futuresPort"/>
                          </div>
                          <div></div>
                        </li> -->

                        <div class="btn-box">
                            <el-button @click="commit" v-if="permissions.sysconf_edit" type="success">确认提交</el-button>
                        </div>
                    </ul>

                    <div class="btn-box" style="margin-top: 12px">
                      <el-button @click="addDomian" v-if="permissions.sysconf_edit" type="success">添加域名</el-button>
                    </div>
                </section>
                

                <section class="list-table">
                  <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                      prop="_id"
                      label="域名">
                    </el-table-column>
                    <el-table-column
                      prop="siteName"
                      label="站点名">
                    </el-table-column>
                    <el-table-column
                      label="启用USDT">
                      <template slot-scope="scope">
                        {{ scope.row.enableUSDT ? '已启用' : '未启用' }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="enableFutures"
                      label="启用期货">
                      <template slot-scope="scope">
                        {{ scope.row.enableFutures ? '已启用' : '未启用' }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="smtpAddr"
                      label="期货地址">
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="futuresExRate"
                      label="期货汇率">
                    </el-table-column>
                    <el-table-column
                      width="180"
                      label="操作">
                      <template slot-scope="scope">
                        <el-button
                          type="success"
                          @click="goLink(scope.row)">编辑</el-button>
                        <el-button 
                          type="danger"
                          @click="_deleteDomain(scope.row._id)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </section>
            </div>
        </div>
    </div>

</template>
<script>
import { url } from "api/url-config"
import Bread from "components/bread";
import DiaLog from "components/dia-log";
import { getSysconfDetail, editsys, getCurrency, listdomain, deleteDomain } from "api/api";
import { communityIcon } from "common/baseData";
import { getWpermissions } from "common/util";
import { Loading } from 'element-ui';
export default {
    data() {
        return {
            loadingInstance: '',
            myHeaders: {
                Authorization: ''
            },
            logo: '',
            futuresExRate: '',
            currency: [],
            breadNav: [
                { name: "系统", path: "/system/list" },
                { name: "通用配置", path: "" }
            ],
            communityIcon: communityIcon,
            contactGroup: [],
            // 参数
            lampRefresh: 1,
            futuresIP: '',
            futuresPort: '',
            futuresloginPort:"",
            advertiseVisibleTime: 0,
            waitAppealTime: 0,
            officialCurrency: "",

            tableData: [],
            commonData: [],

            enableFutures: true,
            tmp: {
                index: 0,
                id: false
            },
            permissions: {
                sysconf_edit: false
            },
            community: {
                icon: "",
                title: "",
                url: ""
            }
        };
    },
    created() {
        this.url = url;
        this.myHeaders.Authorization = sessionStorage.getItem('token')
        this._getCurrency();
        this._getSysconf();
        getWpermissions(this.permissions);
        this._listdomain()
    },
    methods: {
      _deleteDomain(_id) {
        deleteDomain({ siteDomain: _id }).then(res => {
          if (res.code !== 0) {
            this.$message.error("删除失败");
            return
          }
          this._listdomain()
        })
      },
      goLink (obj) {
        const data = Object.assign({}, this.commonData, obj)
        this.$store.commit('setConfig', data)
        this.$router.push('/system/config')
      },
      addDomian() {
        this.$store.commit('setConfig', this.commonData)
        this.$router.push('/system/add')
      },
        uploading() {
            this.loadingInstance = Loading.service({ fullscreen: true });
        },
        uploadSuccess(response) {
            this.loadingInstance.close();
            if(response.code != 0){
                this.$message.error(response.msg)
            }else{
                this.logo = response.data.logo;
            }
            console.log(response);
        },
        toggleEye() {
            if (!this.permissions.sysconf_edit) {
                this.$message.error("无操作权限");
                return;
            }
            this.toggleEyeFlag = !this.toggleEyeFlag;
        },
        _getSysconf() {
            getSysconfDetail().then(res => {
                if (res.code == 0) {
                    let data = res.data;
                    if (res.data.advertiseVisibleTime) {
                        let time = Math.floor(
                            res.data.advertiseVisibleTime /
                                (1000 * 60 * 60 * 24)
                        );
                        this.advertiseVisibleTime = time;
                    } else {
                        this.advertiseVisibleTime = 0;
                    }
                    if (res.data.waitAppealTime) {
                        let waitAppealTime = Math.floor(
                            res.data.waitAppealTime / (1000 * 60 * 60)
                        );
                        this.waitAppealTime = waitAppealTime;
                    } else {
                        this.waitAppealTime = 0;
                    }
                  this.lampRefresh = data.lampRefresh
                  this.waitAppealTime = data.waitAppealTime / (1000 * 60 * 60)
                  this.futuresIP = data.futuresIP
                  this.futuresPort = data.futuresPort
                  this.advertiseVisibleTime = data.advertiseVisibleTime / (1000 * 60 * 60 * 24)
                  this.officialCurrency = data.officialCurrency
                  this.commonData = data;
                  console.log(this.commonData)
                }
            });
        },
        _getCurrency() {
            getCurrency().then(res => {
                if (res.code == 0) {
                    this.currency = res.data || [];
                } else {
                    this.$message.error(res.msg || "获取币种失败");
                }
            });
        },
        _listdomain() {
          listdomain().then(res => {
            if (res.code === 0) {
              this.tableData = res.data
            } else {
              this.$message.error(res.msg || "列表拉取失败");
            }
          })
        },
        add() {
            this.tmp.id = false;
            this.clear();
            this.$refs.community.show();
        },
        edit(index, item) {
            if (this.permissions.sysconf_edit) {
                this.tmp.index = index;
                this.tmp.id = true;
                this.community.icon = item.icon;
                this.community.title = item.title;
                this.community.url = item.url;
                this.$refs.community.show();
            } else {
                this.$message.error("无操作权限");
            }
        },
        addEditSure() {
            let obj = JSON.parse(JSON.stringify(this.community));
            if (this.tmp.id) {
                //编辑
                this.contactGroup.splice(this.tmp.index, 1, obj);
            } else {
                //添加
                this.contactGroup.unshift(obj);
            }
            this.clear();
            this.$refs.community.hide();
        },
        dele(index) {
            if (this.permissions.sysconf_edit) {
                this.tmp.index = index;
                this.$refs.dele.show();
            } else {
                this.$message.error("无操作权限");
            }
        },
        deleSure() {
            this.contactGroup.splice(this.tmp.index, 1);
            this.$refs.dele.hide();
        },
        commit() {
            if (!this.isPosNumber(this.advertiseVisibleTime)) {
                this.$message.error("广告可见时间为正整数");
                return;
            }
            if (!this.isPosNumber(this.waitAppealTime)) {
                this.$message.error("系统举证等待时间为正整数");
                return;
            }
            if (!this.officialCurrency) {
                this.$message.error("虚拟币种必选");
                return;
            }
            let postObj = {
                waitAppealTime: this.waitAppealTime * 1000 * 60 * 60,
                futuresIP: this.futuresIP,
                futuresPort: this.futuresPort,
                lampRefresh: this.lampRefresh,
                advertiseVisibleTime:
                    this.advertiseVisibleTime * 1000 * 60 * 60 * 24,
                officialCurrency: this.officialCurrency,
            };
            if (!this.once) {
                this.once = true;
                editsys(postObj).then(res => {
                    this.once = false;
                    if (res.code == 0) {
                        this.$message.success(res.msg || "保存成功");
                        this._getCurrency();
                        this._getSysconf();
                    } else {
                        this.$message.error(res.msg || "保存失败");
                    }
                });
            }
        },
        clear() {
            this.community.icon = "";
            this.community.title = "";
            this.community.url = "";
        },
        isPosNumber(str) {
            let reg = /^\d+$/; //  /^\+?[1-9][0-9]*$/ //判断是否为正整数
            return reg.test(str);
        }
    },
    components: {
        Bread,
        DiaLog
    }
};
</script>
<style lang="scss" scoped>
@import "~assets/style/variable";
.list-table {
  padding: 20px;
}
.avatar-uploader{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 10px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
.recharge-box {
    padding: 20px;
    .recharge {
        width: 100%;
        min-height: 600px;
        background: #fff;
        .head {
            padding: 15px;
            border-bottom: 1px solid #f3f3f3;
            font-size: $font-size-small;
        }
        .content {
            padding: 20px;
            .logo{
                display: flex;
                align-items: center;
            }
            .base {
                // display: flex;
                // flex-wrap: wrap;
                .item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    margin-right: 10px;
                    & > div {
                      width: 32%;
                    }
                    .iconfont {
                        cursor: pointer;
                    }
                    .name {
                        flex: 0 0 120px;
                        // text-align: center;
                    }
                    .val {
                        flex: 1;
                        .select {
                            width: 100%;
                        }
                    }
                    .add {
                        margin-top: 20px;
                    }
                }
            }
            .community {
                padding: 20px 0 20px 0;
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                // justify-content: space-between;
                .items {
                    width: 400px;
                    padding: 15px;
                    border: 1px dashed #ccc;
                    display: flex;
                    flex-direction: column;
                    margin-right: 20px;
                    margin-bottom: 20px;
                    position: relative;
                    cursor: pointer;
                    &:hover {
                        .close {
                            display: block;
                        }
                    }
                    .close {
                        position: absolute;
                        width: 24px;
                        height: 24px;
                        line-height: 24px;
                        top: -12px;
                        right: -12px;
                        background: #f56c6c;
                        border-radius: 50%;
                        text-align: center;
                        color: #fff;
                        display: none;
                    }
                    .item {
                        display: flex;
                        align-items: center;
                        width: 100%;
                        margin-bottom: 10px;
                        .name {
                            flex: 0 0 80px;
                        }
                        .val {
                            flex: 1;
                            color: #606266;
                            .select {
                                width: 100%;
                            }
                        }
                    }
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
.dialog {
    .content {
        .item {
            display: flex;
            margin-bottom: 10px;
            width: 100%;
            align-items: center;
            .name {
                flex: 0 0 80px;
            }
            .val {
                flex: 1;
                .select {
                    width: 100%;
                }
            }
        }
    }
}

.custom-icon-wrap {
    display: flex;
    align-items: center;
    .select-icon {
        font-size: 14px;
        margin-right: 10px;
    }
}
</style>
<style>
.recharge .date .el-range-separator {
    width: 10%;
}
</style>
