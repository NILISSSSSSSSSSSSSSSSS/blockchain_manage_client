<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import NavLeft from "components/nav-left"

export default {
  name: 'App',
  components: {
    NavLeft
  },
  created(){
    // console.log("app.vue")
  },
  mounted(){
    var hostname = window.location.hostname
    var title = "运营系统"
    if(hostname){
      let hostArr = hostname.split(".")
      if(hostArr.length > 1){
        title = hostArr[hostArr.length - 2]  
      }
      let ipReg = /((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))/
      let res = ipReg.test(hostname)
      if(res){
        title = "运营系统"
      }
    }
    document.title = title
  }
}
</script>

<style lang="scss">
@import "./src/assets/style/index.scss";

#app {
  width: 100%;
  height: 100%;
  .el-breadcrumb__inner, .el-breadcrumb__inner{ //更改全局面包屑样式
    color: #606266;
    font-weight: normal;
  }
}

</style>
