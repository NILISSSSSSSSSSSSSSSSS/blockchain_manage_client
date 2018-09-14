<template>
    <div class="container">
        <bread title="添加域名" desc="添加域名配置" :list="breadNav"></bread>
        <div class="recharge-box" v-if="config">
            <div class="recharge">
                <section class="content">

                    <ul class="base">
                        <li class="item">
                            <span class="name">设置网站LOGO：</span>
                            <el-upload
                                class="avatar-uploader"
                                name="logo"
                                :headers="myHeaders"
                                :on-progress="uploading"
                                :on-success="uploadSuccess"
                                :on-error="uploadError"
                                :action="url+'/sysconf/upload/'"
                                :show-file-list="false"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="logo" :src="logo" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </li>
                        <li class="item">
                            <div class="name">
                                <p >期货市场：</p>
                                <p style="font-size: 12px; color: red;padding-right: 5px;">（谨慎改动！可能会出现数据不一致）</p>
                            </div>
                            <div style="display: flex;flex-direction:column;" class="val" >
                            <el-switch
                                style="margin-bottom: 10px;"
                                v-model="enableFutures"
                                active-text="打开"
                                inactive-text="关闭">
                            </el-switch>
                            <el-input :disabled="!enableFutures" style="margin-bottom: 10px;" placeholder="期货首页地址" type="text" v-model="futuresAddr"/>
                            <el-input disabled style="margin-bottom: 10px;" placeholder="期货入金地址" type="text" v-model="futuresIP"/>
                            <el-input disabled style="margin-bottom: 10px;" placeholder="期货入金端口" type="number" v-model="futuresPort"/>

                            <el-input  :disabled="!enableFutures" style="margin-bottom: 10px;" placeholder="期货会员端口" type="number" v-model="futuresloginPort"/>
                            <el-input :disabled="!enableFutures"  placeholder="期货代币汇率" type="text" v-model="futuresExRate"/>
                            <p style="font-size: 12px; color: red;padding-right: 5px;">(1个USDT转换为期货代币的固定汇率)</p>
                            </div>
                        </li>
                        <li class="item">
                            <span class="name">USDT交易区：</span>
                            <el-switch
                                v-model="enableUSDT"
                                active-text="打开"
                                inactive-text="关闭">
                            </el-switch>
                        </li>
                        <li class="item">
                            <span class="name">交易刷新时间：</span>
                            <el-input
                              disabled
                              placeholder="刷新的秒数" type="number" v-model="lampRefresh">
                                <template slot="append">
                                    秒
                                </template>
                            </el-input>
                        </li>


                        <li class="item">
                            <span class="name">广告可见时间:</span>
                            <el-input
                              disabled
                              class="val"
                              :maxlength="10"
                              placeholder="请输入广告可见时间" v-model="advertiseVisibleTime">
                                <el-button slot="append">天</el-button>
                            </el-input>
                        </li>
                        <li class="item">
                            <span class="name">系统举证等待时间:</span>
                            <el-input
                              disabled
                              class="val"
                              :maxlength="10"
                              placeholder="请输入系统举证等待时间" v-model="waitAppealTime">
                                <el-button slot="append">小时</el-button>
                            </el-input>
                        </li>
                        <li class="item">
                            <span class="name">官方币币种:</span>
                            <div class="val">
                                <el-select
                                  disabled
                                  class="select"
                                  v-model="officialCurrency"
                                  placeholder="请选择虚拟币">
                                    <el-option v-for="item in currency" :key="item._id" :label="item.name" :value="item._id">
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li class="item">
                            <span class="name">主站名称:</span>
                            <el-input class="val" :maxlength="30" placeholder="请输入主站名称" v-model="siteName">
                            </el-input>
                        </li>
                        <li class="item">
                            <span class="name">主站域名:</span>
                            <el-input
                              class="val"
                              :maxlength="30"
                              placeholder="请输入主站域名"
                              v-model="siteDomain">
                            </el-input>
                        </li>
                        <li class="item">
                            <span class="name">服务邮箱:</span>
                            <el-input class="val" :maxlength="30" placeholder="请输入服务邮箱" v-model="siteEmail">
                            </el-input>
                        </li>
                        <li class="item">
                            <span class="name">邮箱SMTP地址:</span>
                            <el-input class="val" :maxlength="30" placeholder="请输入邮箱SMTP地址" v-model="smtpAddr">
                            </el-input>
                        </li>
                        <li class="item">
                            <span class="name">邮箱SMTP端口:</span>
                            <el-input class="val" :maxlength="5" placeholder="请输入邮箱SMTP端口" v-model="smtpPort">
                            </el-input>
                        </li>
                        <li class="item">
                            <span class="name">邮箱用户名:</span>
                            <el-input class="val" :maxlength="30" placeholder="请输入邮箱用户名" v-model="emailUser">
                            </el-input>
                        </li>
                        <li class="item">
                            <span class="name">邮箱密码:</span>
                            <el-input class="val" :maxlength="30" placeholder="请输入邮箱密码" v-model="emailPasswd" :type="toggleEyeFlag ? 'text' : 'password'" @click="toggleEye">
                                <el-button slot="append" @click="toggleEye">
                                    <i class="iconfont icon-yanjing" v-if="toggleEyeFlag"></i>
                                    <i class="iconfont icon-yanjing1" v-else></i>
                                </el-button>
                            </el-input>
                        </li>
                        <li class="item">
                            <span class="name">跑马灯刷新时间:</span>
                            <el-input class="val" :maxlength="10" placeholder="请输入跑马灯刷新时间" v-model="lampRefresh">
                            </el-input>
                        </li>
                        <li class="item">
                          <span class="name">场内识别号:</span>
                          <el-input class="val" :maxlength="10" placeholder="请输入场内识别号" v-model="futuresSymbol">
                          </el-input>
                        </li>
                        <li class="item">
                          <span class="name">发币手续费(ETH):</span>
                          <el-input class="val" :maxlength="10" placeholder="请输入发币手续费" v-model="issueCurrencyFee">
                          </el-input>
                        </li>
                        <li class="item">
                          <span class="name">发币审核者邮箱:</span>
                          <el-input class="val" :maxlength="30" placeholder="请输入发币审核者邮箱" v-model="issueCurrencyEmail">
                          </el-input>
                        </li>
                        <!-- <li class="item">
                            <span class="name">期货展示:</span>
                            <el-switch class="enable" v-model="futuresFlag" active-color="#13ce66" inactive-color="#dcdfe6">
                            </el-switch>
                        </li>
                        <li class="item">
                            <span class="name">USDT快速交易:</span>
                            <el-switch class="enable" v-model="usdtFlag" active-color="#13ce66" inactive-color="#dcdfe6">
                            </el-switch>
                        </li>

                        <li class="item">
                            <span class="name">上传logo: </span>
                            <el-upload class="avatar-uploader"  :show-file-list="false"  :before-upload="beforeAvatarUpload">
                                <img v-if="logoUrl" :src="logoUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </li> -->

                        <li class="" style="margin-bottom: 10px;"> 
                            <el-button type="primary" class="add" v-if="permissions.sysconf_edit" @click="add">添加官方社群</el-button>
                        </li>
                    </ul>
                    <div class="community" v-show="contactGroup.length">
                        <div class="items" @click="edit(index,item)" v-for="(item,index) in contactGroup" :key="index">
                            <div class="close" @click.stop="dele(index)">
                                <i class="icon el-icon-close"></i>
                            </div>
                            <div class="item">
                                <span class="name">社群icon</span>
                                <div class="val">
                                    <span>{{item.icon}}</span>
                                </div>
                            </div>
                            <div class="item">
                                <span class="name">社群标题</span>
                                <div class="val">
                                    <span>{{item.title}}</span>
                                </div>
                            </div>
                            <div class="item">
                                <span class="name">社群url</span>
                                <div class="val">
                                    <span>{{item.url}}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="btn-box">
                        <el-button @click="commit" v-if="permissions.sysconf_edit" type="success">确认提交</el-button>
                    </div>
                </section>
            </div>
        </div>
        <dia-log class="dialog" ref="community" :title="this.tmp.id ? '编辑社群' : '新增社群' " @sure="addEditSure">
            <section class="content">
                <div class="item">
                    <span class="name">社群icon</span>
                    <div class="val">
                        <el-select class="select" v-model="community.icon" placeholder="请选择社群icon">
                            <el-option v-for="item in communityIcon" :key="item.icon" :label="item.name" :value="item.icon">
                                <span class="custom-icon-wrap">
                                    <icon class="select-icon" :name="item.icon"></icon>
                                    <span class="icon-name">{{item.name}}</span>
                                </span>
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <span class="name">社群标题</span>
                    <div class="val">
                        <el-input class="select" v-model="community.title" placeholder="请输入社群标题"></el-input>
                    </div>
                </div>
                <div class="item">
                    <span class="name">社群url</span>
                    <div class="val">
                        <el-input class="select" v-model="community.url" placeholder="请输入社群url"></el-input>
                    </div>
                </div>
            </section>
        </dia-log>
        <dia-log class="dia-log" ref="dele" title="删除社群" @sure="deleSure">
            <div class="content">
                <span>确认删除此社群</span>
            </div>
        </dia-log>
    </div>

</template>
<script>
import { url } from "api/url-config"
import Bread from "components/bread";
import DiaLog from "components/dia-log";
import { getSysconf, editdomain, getCurrency } from "api/api";
import { communityIcon } from "common/baseData";
import { getWpermissions } from "common/util";
import { Loading } from 'element-ui';
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            loadingInstance: '',
            myHeaders: {
                Authorization: ''
            },
            logo: '',
            lampRefresh: 1,
            enableUSDT: false,
            enableFutures: false,
            futuresAddr: '',
            futuresIP: '',
            futuresPort: '',
            futuresExRate: '',
            currency: [],
            breadNav: [
                { name: "系统", path: "/system/list" },
                { name: "添加域名", path: "" }
            ],
            communityIcon: communityIcon,
            contactGroup: [],
            advertiseVisibleTime: 0,
            waitAppealTime: 0,
            officialCurrency: "",
            siteName: "",
            siteDomain: "",
            siteEmail: "",
            smtpAddr: "",
            smtpPort: "",
            emailUser: "",
            emailPasswd: "",
            lampRefresh: "",
            futuresSymbol: "",
            issueCurrencyFee: "",
            issueCurrencyEmail: "", 
            futuresloginPort:"",
            toggleEyeFlag: false,
            futuresFlag: false,
            usdtFlag: false,
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
    computed: {
      ...mapGetters(['config'])
    },
    created() {
      if (!this.config) {
        return this.$router.push('/system/list')
      }
        this.url = url;
        this.myHeaders.Authorization = sessionStorage.getItem('token')
        this._getCurrency();
        getWpermissions(this.permissions);
    },
    mounted() {
      this._getSysconf();
    },
    methods: {
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
        uploadError(err) {
            this.loadingInstance.close();
            this.$message.error('上传发生错误，请重试')
        },
        beforeAvatarUpload(file) {
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isPNG) {
            this.$message.error('上传头像图片只能是 PNG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isPNG && isLt2M;
        },
        toggleEye() {
            if (!this.permissions.sysconf_edit) {
                this.$message.error("无操作权限");
                return;
            }
            this.toggleEyeFlag = !this.toggleEyeFlag;
        },
        _getSysconf() {
          if (!this.config) {
            return this.$router.push('/system/list')
          }
          let data = this.config
          console.log(data);
          if (data.advertiseVisibleTime) {
              let time = Math.floor(
                  data.advertiseVisibleTime /
                      (1000 * 60 * 60 * 24)
              );
              this.advertiseVisibleTime = time;
          } else {
              this.advertiseVisibleTime = 0;
          }
          if (data.waitAppealTime) {
              let waitAppealTime = Math.floor(
                  data.waitAppealTime / (1000 * 60 * 60)
              );
              this.waitAppealTime = waitAppealTime;
          } else {
              this.waitAppealTime = 0;
          }

          this.futuresIP = data.futuresIP != undefined? data.futuresIP: '';
          this.futuresPort = data.futuresPort != undefined? data.futuresPort: '';
          this.futuresloginPort = data.futuresloginPort != undefined? data.futuresloginPort: '';
           this.lampRefresh = data.lampRefresh != undefined? data.lampRefresh: 1;
          this.officialCurrency = data.officialCurrency || "";

          this.enableUSDT = data.enableUSDT != undefined? data.enableUSDT: false;
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
            if (!this.officialCurrency) {
                this.$message.error("虚拟币种必选");
                return;
            }
            if (!this.siteName.trim()) {
                this.$message.error("主站名称必填");
                return;
            }
            if (!this.siteDomain.trim()) {
                this.$message.error("主站域名必填");
                return;
            }
            if (!this.siteEmail.trim()) {
                this.$message.error("服务邮箱必填");
                return;
            }
            if (!this.smtpAddr.trim()) {
                this.$message.error("邮箱SMTP地址必填");
                return;
            }
            if (!this.smtpPort.trim()) {
                this.$message.error("邮箱SMTP端口必填");
                return;
            }
            if (!this.emailUser.trim()) {
                this.$message.error("邮箱用户名必填");
                return;
            }
            if (!this.emailPasswd.trim()) {
                this.$message.error("邮箱密码必填");
                return;
            }
            if (!this.futuresSymbol.trim()) {
                this.$message.error("场内识别号必填");
                return;
            }
            if(!this.issueCurrencyFee.trim() && this.issueCurrencyFee.trim()!= 0) {
                this.$message.error("发币手续费必填且为数字");
                return
            }else if(!Number(this.issueCurrencyFee.trim())  && this.issueCurrencyFee.trim()!= 0){
                this.$message.error("发币手续费必填且为数字");
                return
            }
            if(!this.issueCurrencyEmail.trim()) {
                this.$message.error("发币审核者邮箱必填")
                return 
            }
            let postObj = {
                contactGroup: this.contactGroup,
                siteName: this.siteName.trim(),
                siteDomain: this.siteDomain.trim(),
                siteEmail: this.siteEmail.trim(),
                smtpAddr: this.smtpAddr.trim(),
                smtpPort: this.smtpPort.trim(),
                emailUser: this.emailUser.trim(),
                emailPasswd: this.emailPasswd.trim(),
                enableUSDT: this.enableUSDT,
                enableFutures: this.enableFutures,
                futuresAddr: this.futuresAddr,
                futuresExRate: this.futuresExRate,
                logo: this.logo,
                futuresSymbol: this.futuresSymbol,
                issueCurrencyFee: Number(this.issueCurrencyFee.trim()),
                issueCurrencyEmail: this.issueCurrencyEmail.trim(),
                futuresloginPort:this.futuresloginPort
                
            };
            if (!this.once) {
                this.once = true;
                editdomain(postObj).then(res => {
                    this.once = false;
                    if (res.code == 0) {
                        this.$message.success(res.msg || "保存成功");
                        this.$router.push('/system/list')
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
                    display: inline-flex;
                    width: 400px;
                    align-items: center;
                    margin-bottom: 10px;
                    margin-right: 10px;
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


