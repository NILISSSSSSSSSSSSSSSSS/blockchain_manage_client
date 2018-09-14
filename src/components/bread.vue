<template>
<div class="bread">
    <div class="bread-head">
        <h3 class="title">{{title}}</h3>
        <p class="desc">{{desc}}</p>
    </div>
  <el-breadcrumb separator="/" class="bread-nav">
    <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in list" :key="index" :to="{ path: item.path}" >{{item.name}}</el-breadcrumb-item>
  </el-breadcrumb>
</div>
</template>
<script>
export default {
  props: {
    title:{
        type: String,
        default: 'dashboard'
    },
    desc: {
        type: String,
        default: '欢迎访问后台'
    },
    list: {
      type: Array,
      default: null
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~assets/style/variable";

.bread {
    display: flex;
    height: 90px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    background: #e8e8e8;
    .bread-head{
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .title{
            font-size: $font-size-large;
            color: $color-text;
            margin-bottom: 10px;
        }
        .desc{
            font-size: $font-size-small-s;
            color: #a3a3a3;
        }
    }
    .bread-nav{
        margin-right: 40px;
        margin-top: -30px;
    }
}
</style>


