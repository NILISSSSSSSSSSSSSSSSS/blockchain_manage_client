<template>
  <div>
    <bread title="标签管理" desc="系统的标签管理" :list="breadNav"></bread>
    <div class="tag-box">
      <div class="tag">
        <header class="head">标签管理</header>
        <div class="content">
          <el-button type="success" size="small" @click="addTag" class="add-tag" v-if="permissions.label_add">新增标签</el-button>
          <el-tag v-for="tag in tags" :key="tag.id" :closable="permissions.label_del" class="item" @click.native="editTag(tag)" @close.stop="deleTag(tag)" type="success">
            {{tag.tagName}}
          </el-tag>

        </div>
      </div>
    </div>

    <dia-log title="新增标签" class="dia-log" ref="diaLog">
      <div class="dia-log-cont">
        <span class="desc">标签内容: </span>
        <el-input placeholder="请输入" class="input" v-model="content"></el-input>
      </div>
    </dia-log>
    <dia-log title="删除标签" class="dia-log" ref="deleTag" @sure="dele">
      <div>确认删除此标签</div>
    </dia-log>
  </div>
</template>
<script>
import Bread from "components/bread";
import Tab from "components/tab";
import DiaLog from "components/dia-log";
import { getTagList, deleTag } from "api/api";
import { getWpermissions } from "common/util";


export default {
    data() {
        return {
            breadNav: [
                { name: "文章管理", path: "/article/tags" },
                { name: "标签管理", path: "" }
            ],
            permissions: {
                label_add: false,
                label_edit: false,
                label_del: false
            },
            tags: [],
            content: "",
            tabArr: [],
            tabIndex: "",
            id: ""
        };
    },
    created() {
        this._getTagList();
        getWpermissions(this.permissions)
    },
    methods: {
        _getTagList() {
            getTagList().then(res => {
                if (res.code == 0) {
                    // console.log(res)
                    this.tags = res.data.labels;
                }
            });
        },
        addTag() {
            this.$router.push({
                path: `/article/tag`
            });
        },
        deleTag(item) {
            if (item.isDefault) {
                this.$message.error("此标签为默认标签,不可删除");
                return;
            }
            this.id = item.id;
            this.$refs.deleTag.show();
        },
        dele() {
            let obj = {
                labelNames: [this.id]
            };
            if (!this.once) {
                this.once = true;
                deleTag(obj).then(res => {
                    this.once = false;
                    if (res.code == 0) {
                        this.$message.success(res.msg || "删除成功");
                        this.$refs.deleTag.hide();
                        this._getTagList();
                    } else {
                        this.$message.error(res.msg || "删除失败");
                    }
                });
            }
        },
        editTag(item) {
            if(this.permissions.label_add){
                this.$router.push({
                    path: `/article/tag/${item.id}`
                });
            }else{
                this.$message.error("没有操作权限")
            }
        }
    },
    components: {
        Bread,
        Tab,
        DiaLog
    }
};
</script>
<style lang="scss" scoped>
@import "~assets/style/variable";

.tag-box {
    padding: 20px;
    .tag {
        width: 100%;
        min-height: 100px;
        background: #fff;
        .head {
            padding: 15px;
            border-bottom: 1px solid #f3f3f3;
            font-size: $font-size-small;
        }
        .content {
            padding: 20px;
            min-height: 650px;
            .add-tag {
                display: block;
                margin-bottom: 20px;
            }
            .item {
                margin-right: 20px;
                margin-bottom: 10px;
                cursor: pointer;
            }
        }
    }
}
.dia-log {
    .dia-log-cont {
        display: flex;
        align-items: center;
        height: 30px;
        .desc {
            width: 80px;
        }
        .input {
            flex: 1;
        }
    }
}
</style>
<style>
.tag .date .el-range-separator {
    width: 10%;
}
.tag .rowClass {
    color: rgba(0, 0, 0, 0.85);
    text-align: center;
}
</style>

