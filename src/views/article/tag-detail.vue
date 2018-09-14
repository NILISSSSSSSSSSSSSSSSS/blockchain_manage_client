<template>
  <div class="container">
      <bread title="标签信息" desc="系统的标签管理" :list="breadNav"></bread>
      <div class="recharge-box">
          <div class="recharge">
            <header class="head">标签</header>
          <div class="tab-box">
            <el-input placeholder="请输入标签名字" v-model="labelName" :disabled="id ? true : false"></el-input>
            <tab :tabArr="tabArr"
                  :tabIndex="tabIndex"
                  @selectTab="selectTab"
                  v-show="tabArr.length">
                  <!-- @deleItem="deleItem" -->
              <el-input placeholder="请输入标签内容" v-model="content" @change="inputChange"></el-input>
            </tab>
            <el-button type="success" class="btn" @click="sure">确认</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Bread from "components/bread";
import DiaLog from "components/dia-log";
import Tab from "components/tab"
import {getTagOne,editTag,getLangList,addTag} from "api/api";
import { validate } from "common/util";

export default {
  data() {
    return {
      breadNav: [
        { name: "文章管理", path: "" },
        { name: "标签管理", path: "/article/tags" },
        {name: "标签信息",path: ""}
      ],
      tabArr: [],
      tabIndex: "",
      content: '',
      labelName: '',
      id: '',
      index: 0
    };
  },
  created(){
    // this._getAnnounceList()
    this.id = this.$route.params.id
    if(this.id){
      this._getTagOne()
    }else{
      this._getLangList()
    }
  },
  methods: {
    _getTagOne(){
      getTagOne({labelName: this.id}).then((res) => {
        if(res.code == 0){
          this.labelName = res.data.tagName
          this.tabArr = res.data.lang
          if(this.tabArr.length > 0){
            this.tabIndex = this.tabArr[0].lang || ""
            this.content = this.tabArr[0].str || ""
          }
        }
      })
    },
    _getLangList(){
      getLangList().then((res) => {
        if(res.code == 0) {
          let tmpArr = []
          res.data.labels.forEach((item) => {
            let obj = {}
            obj.lang = item._id
            obj.str = ""
            tmpArr.push(obj)
          })
          if(tmpArr.length > 0){
            this.tabArr = tmpArr
            this.tabIndex = this.tabArr[0].lang || ""
          }
        }
      })
    },
    selectTab(lang) {
      let index = this.tabArr.findIndex(item => {
        return item.lang == lang;
      });
      // console.log(lang)
      if(index > -1){
        this.index = index;
        this.content = this.tabArr[index].str || "";
        this.tabIndex = this.tabArr[index].lang || ""
      }
    },
    // deleItem(lang) {
    //   if (this.tabArr.length == 1) {
    //     this.$message.error("至少有一种语言");
    //     return;
    //   } else {
    //     let index = this.tabArr.findIndex(item => {
    //       return item.lang == lang;
    //     });
    //     this.tabArr.splice(index, 1);
    //     this.tabIndex = this.tabArr[0].lang || "";
    //     this.content = this.tabArr[0].str || "";
    //   }
    // },
    inputChange(val){
      if(this.tabArr.length){
        this.tabArr[this.index].str = val 
      }
    },
    sure(){
      let postObj = {}
      postObj.context = this.tabArr
      postObj.labelName = this.labelName.trim()
      let reg = /^[-a-zA-Z0-9_]{2,20}$/ //由2-20个数字、英文字母或者下划线组成的字符串
      if(!validate(reg,postObj.labelName)){
        this.$message.error('标签名字由2-20个数字、英文字母或者下划线组成的字符串')
        return
      }
      if(!this.once){
        this.once = true
        if(this.id){
          editTag(postObj).then((res) => {
            this.once = false
            if(res.code == 0){
              this.$message.success(res.msg || '保存成功')
              this.$router.push({
                path: '/article/tags'
              })
            }else{
              this.$message.error(res.msg || '保存失败')
            }
          })
        }else{
          addTag(postObj).then((res) => {
            this.once = false
            if(res.code == 0){
              this.$message.success(res.msg || "保存成功")
              this.$router.push({
                path: '/article/tags'
              })
            }else{
              this.$message.error(res.msg || '保存失败')
            }
          })
        }
      }
    },
    // valid(name,reg){}
  },
  components: {
    Bread,
    DiaLog,
    Tab
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
    .tab-box{
      padding: 15px;
      .btn{
        margin: 20px 0 20px 0;
      }
    }
  }
}
</style>



