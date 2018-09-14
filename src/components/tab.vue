<template>
  <div class="cust-tab">
    <el-tabs  v-model="index" type="card" value="value" @tab-remove="removeTab" @tab-click="selectTab">
        <el-tab-pane
            v-for="item in tabArr"
            :key="item.lang"
            :label="item.lang"
            :name="item.lang"
        >
        </el-tab-pane>
    </el-tabs>
    <div class="slot-cont">
        <slot></slot>
    </div>
    <!-- <dia-log title="删除语言" types="danger" ref="lang" @sure="deleLang">
      <div style="font-size: 18px;">确认删除此选项</div>
    </dia-log> -->
  </div>
</template>
<script>
import DiaLog from "components/dia-log";

export default {
  props: {
    tabArr: {
      type: Array,
      default: null
    },
    tabIndex: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      index: "",
      tabTmp: null
    };
  },
  methods: {
    selectTab(item) {
      this.$emit("selectTab", item.name);
    },
    removeTab(name) {
      this.tabTmp = name;
      this.$refs.lang.show();
    },
    deleLang() {
      let val = this.tabTmp;
      this.$emit("deleItem", val); //后面的操作在主页面操作,因为删除操作的请求在每个地方不一样;
      // let lens = this.tabArr.length
      // if (lens > 1) {
      //   let index = this.tabArr.findIndex((item) => {
      //     return item.name == val;
      //   });
      //   console.log(index)
      //   if (index > -1 && index != lens-1) {
      //     // console.log(index)
      //     this.tabDefault = this.tabArr[index+1].name
      //     this.tabArr.splice(index, 1);
      //   } else if(index == lens-1){
      //     this.tabArr.splice(index, 1);
      //     this.tabDefault = this.tabArr[0].name
      //   }
      // }else{
      //   this.tabArr = []
      //   this.tabDefault = ''
      // }
    }
  },
  watch: {
    tabIndex(newIndex) {
      this.index = newIndex;
    }
  },
  components: {
    DiaLog
  }
};
</script>
<style lang="scss" scoped>
.cust-tab {
  margin: 20px 0;
  margin-bottom: 0;
  .input {
    width: 70%;
    margin-left: 10px;
  }
  .slot-cont {
    // padding: 20px 0;
  }
}
</style>


