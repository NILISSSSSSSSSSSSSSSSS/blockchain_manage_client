<template>
  <el-dialog :title="title" 
    class="dialog"
    :visible.sync="dialogVisible" 
    :close-on-click-modal="closeModel" 
    :close-on-press-escape="closeModel"
    @close="close"
  >
    <!-- <div class="content">确定该提现申请已经处理完成了吗?</div> -->
    <slot></slot>
    <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button :type="types" @click="sure" :disabled="sureBtnAble">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
      title: {
          type: String,
          default: '操作确认'
      },
      types: {
          type: String,
          default: 'primary'
      },
      sureBtnAble: {
          type: Boolean,
          default: false
      }
  },
  data(){
      return {
          dialogVisible: false,
          closeModel: false
      }
  },
  methods: {
      cancel(){
          this.$emit("cancel")
          this.hide()
      },
      sure(){
          this.$emit("sure")
        //   this.hide()
      },
      show(){
          this.dialogVisible = true
      },
      hide(){
          this.dialogVisible = false
      },
      close(){
          this.cancel()
      }
  }
}
</script>
<style>
.dialog .el-dialog__header{
  background: #5cc691;
  border-bottom: 5px solid #55b786;
}
.dialog .el-dialog__body{
    padding-bottom: 10px;
}
</style>


