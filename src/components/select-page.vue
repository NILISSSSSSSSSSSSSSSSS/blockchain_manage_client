<template>
  <div class="select-page">
      <div class="content">
          <em>每页显示</em>
          <el-select v-model="value" placeholder="" size="mini" class="page-num" @change="changePage"> 
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select><em>条,共</em><i>{{total}}</i><em>条</em>
      </div>
  </div>
</template>
<script>
export default {
  props: {
      total: {
          type: Number,
          default: 0
      }
  },
  data() {
    return {
      options: [
        {
          value: "10",
          label: "10"
        },
        {
          value: "20",
          label: "20"
        },
        {
          value: "50",
          label: "50"
        },
        {
          value: "100",
          label: "100"
        }
      ],
      value: 10
    };
  },
  methods: {
    changePage(val) {
      // console.log('page',val)
      this.$emit("changeSize", val);
    }
  }
};
</script>
<style lang="scss" scoped>
.select-page {
  display: inline-block;
  // margin: 10px;
  .content {
    display: inline-block;
    .page-num {
      width: 70px;
      margin: 0 5px;
    }
    i {
      margin: 0 2px;
    }
  }
}
</style>

