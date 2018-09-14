<template>
  <div class="container">
    <bread title="语言信息" desc="系统所支持的语言信息管理" :list="breadNav"></bread>
    <div class="recharge-box">
      <div class="recharge">
        <header class="head">语言列表</header>
        <div class="content">
          <el-button type="success" size="small" @click="add" class="add-tag" v-if="permissions.lang_add" >新增语言</el-button>
          <el-tag v-for="tag in tags" :key="tag._id" size="medium" class="item" @click.native="editTag(tag)" type="success">
            {{tag._id}}
          </el-tag>
        </div>
      </div>
    </div>
    <dia-log :title="this.id ? '编辑语言' : '新增语言' " ref="dialog" @sure="addLangSure">
      <el-input class="item" placeholder="请输入语言的描述 如(中文)" v-model="desc"></el-input>
      <el-input class="item" :disabled="id ? true : false" placeholder="请输入语言的名称 如(CN)" v-model="content"></el-input>
      <el-upload class="upload" accept=".json" :auto-upload="false" action="" :show-file-list="false" :on-change="selectFile" :before-upload="beforeFileUpload">
        <el-button type="success" size="small" v-if="!filePath">点击上传JSON文件</el-button>
        <!-- <em v-if="filePath" class="item-name">pc端语言文件:</em> -->
        <span class="file-path" v-if="filePath">{{filePath}}</span>
      </el-upload>
      <!-- <el-upload class="upload" accept=".json" :auto-upload="false" action="" :show-file-list="false" :on-change="selectMobileFile" :before-upload="beforeFileUpload">
        <el-button type="success" size="small" v-if="!moblieFilePath">点击上传移动端语言JSON文件</el-button>
        <em v-if="moblieFilePath" class="item-name">移动端语言文件:</em>
        <span class="file-path" v-if="moblieFilePath">{{filePath}}</span>
      </el-upload> -->
    </dia-log>
  </div>

</template>
<script>
import Bread from "components/bread";
import DiaLog from "components/dia-log";
import { addLang, deleLang, getLangList, editLang } from "api/api";
import { getWpermissions } from "common/util";


export default {
    data() {
        return {
            desc: "",
            content: "",
            filePath: "",
            moblieFilePath: "",
            mobileFile: "",
            file: "",
            tags: [],
            permissions: {
                lang_add: false,
                lang_edit: false
            },
            breadNav: [
                { name: "语言管理", path: "" },
                { name: "语言列表", path: "/language/list" }
            ],
            id: ""
        };
    },
    created() {
        this._getLangList();
        getWpermissions(this.permissions)
    },
    methods: {
        selectFile(file) {
            this.file = file;
            this.filePath = file.name;
        },
        selectMobileFile(mobileFile){
            this.mobileFile = mobileFile
            this.moblieFilePath = mobileFile.name
        },
        beforeFileUpload() {},
        _getLangList() {
            getLangList().then(res => {
                if (res.code == 0) {
                    this.tags = res.data.labels;
                }
            });
        },
        add() {
            this.desc = "";
            this.content = "";
            this.filePath = "";
            this.moblieFilePath = "";
            this.mobileFile = "";
            this.file = "";
            this.id = "";
            this.$refs.dialog.show();
        },
        addLangSure() {
            if (!this.content) {
                this.$message.error("语言名称必填");
                return;
            }
            let formData = new FormData();
            formData.append("displayText", this.desc);
            formData.append("langId", this.content);
            if(this.file){
              formData.append("jsonFilePath", this.file.raw);
            }
            if(this.mobileFile){
                formData.append('moblieFilePath',this.mobileFile.raw)
            }
            let config = {
                "Content-Type": "multipart/form-data"
            };
            if (this.id) {
                //编辑
                if(!this.editOnce){
                  this.editOnce = true
                  editLang(formData, config).then(res => {
                    this.editOnce = false
                      if (res.code == 0) {
                          this.$message.success(res.msg || "编辑成功");
                          this.$refs.dialog.hide();
                          this._getLangList();
                      } else {
                          this.$message.error(res.msg || "编辑失败");
                      }
                  });
                }
            } else {
                //新增
                if (!this.addOnce) {
                    this.addOnce = true;
                    addLang(formData,config).then(res => {
                        this.addOnce = false;
                        if (res.code == 0) {
                            this.$message.success(res.msg || "新增成功");
                            this.$refs.dialog.hide();
                            this._getLangList();
                        } else {
                            this.$message.error(res.msg || "新增失败");
                        }
                    });
                }
            }
        },
        editTag(item) {
            if(this.permissions.lang_edit){
                this.id = item._id;
                this.desc = item.displayText;
                this.content = item._id;
                this.filePath = item.jsonFilePath;
                this.moblieFilePath = item.moblieFilePath || "";
                this.file = "";
                this.mobileFile = "";
                this.$refs.dialog.show();
            }else{
                this.$message.error("没有操作权限")
            }
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
.dialog {
    .item {
        margin-bottom: 10px;
    }
    .upload {
        text-align: left;
        margin-top: 5px;
        margin-bottom: 10px;
        .file-path {
          text-decoration: underline;
        }
        .item-name{
            margin-right: 8px;
        }
    }
}
</style>
<style>
.recharge .date .el-range-separator {
    width: 10%;
}
.upload .el-upload {
    text-align: left;
}
</style>


