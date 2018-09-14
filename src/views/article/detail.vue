<template>
  <div class="container">
    <bread title="文章信息" desc="系统所以文章信息的管理" :list="breadNav"></bread>
    <div class="recharge-box">
      <div class="recharge">
        <header class="head">文章</header>
        <div class="tab-box">
          <el-select v-model="domain" placeholder="请选择">
            <el-option
              v-for="item in domainList"
              :key="item"
              :value="item"
              :label="item"
              >
            </el-option>
          </el-select>

          <el-checkbox v-model="checkedIndex" class="check">是否在首页展示</el-checkbox>
          <el-checkbox v-model="checkedDeal" class="check">是否在场外交易展示</el-checkbox>
          <el-button type="success" @click="addTag" size="small" class="add-tag">新增标签</el-button>
          <el-tag v-for="tag in tags" :key="tag" closable class="tag-item" @close="deleTag(tag)" type="success">
            {{tag}}
          </el-tag>
          <tab :tabArr="tabArr" :tabIndex="tabIndex" @selectTab="selectTab" v-show="tabArr.length">
            <el-input placeholder="请输入文章标题" v-model="title" class="title" @change="titleChange"></el-input>

            <!-- <rich-text-editor :text="content" @editorChange="editorChange" /> -->

            <Ueditor v-model="content" id="editor" @editorChange="editorChange" ref="editor" style="width:100%;"></Ueditor>


          </tab>

          <el-button type="success" class="btn" @click="submit">确认</el-button>
        </div>
      </div>
    </div>
    <dia-log title="新增标签" class="dia-log" ref="diaLog" @sure="addTagSure">
      <div class="content">
        <div class="item">
          <span class="desc">选择标签: </span>
          <el-select multiple v-model="addLabel" @change="addLabelChange" placeholder="请选择" class="input" width="100%">
            <el-option v-for="item in labels" :key="item.id" :label="item.tagName" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
    </dia-log>
    <dia-log title="删除标签" types="danger" ref="deleTag" @sure="deleTagSure">
      <div style="font-size: 18px">确认删除此标签</div>
    </dia-log>
  </div>

</template>
<script>
import Bread from "components/bread";
import Tab from "components/tab";
import DiaLog from "components/dia-log";
// import richTextEditor from "components/richTextEditor";
import Ueditor from "components/ueditor";

import {
    getArticleOne,
    getCommonLangList,
    getCommonTagList,
    editArticle,
    addArticle,
    listdomain
} from "api/api";

export default {
    data() {
        return {
            content: "",
            id: "",
            checkedDeal: false,
            checkedIndex: false,
            title: "",
            tags: [],
            tabArr: [],
            tabIndex: "",
            index: 0,
            breadNav: [
                { name: "文章管理" ,path: ""},
                { name: "文章列表", path: "/article/list" },
                { name: "文章信息", path: "" }
            ],
            deleTagId: "",
            labels: [],
            addLabel: [],

            domainList: ['*'],
            domain: '*'
        };
    },
    created() {
        this.id = this.$route.params.id;
        // console.log(this.$router,this.$route)
        if (this.id) {
            this._getArticleOne();
        } else {
            //获取语言列表
            this._getCommonLangList();
        }
        this._listdomain()
    },
    methods: {
      _listdomain() {
        listdomain().then(res => {
          if (res.code !== 0) return
          let data = res.data
          for (let obj of data) {
            this.domainList.push(obj._id)
          }
        })
      },
        _getArticleOne() {
            getArticleOne({
                articleId: this.id
            }).then(res => {
                if (res.code == 0) {
                    let data = res.data;
                    this.tags = data.tags;
                    this.checkedIndex = data.showInHome;
                    this.checkedDeal = data.showInOutside;
                    this.domain = data.site || '*'
                    let tmpArr = data.context;
                    tmpArr.forEach((item, index) => {
                        item.title = data.title[index].str;
                    });
                    this.tabArr = tmpArr;
                    if (this.tabArr.length > 0) {
                        this.tabIndex = this.tabArr[0].lang || "";
                        this.title = this.tabArr[0].title || "";
                        this.content = this.tabArr[0].str || "";
                    }
                }
            });
        },
        _getCommonLangList() {
            getCommonLangList().then(res => {
                if (res.code == 0) {
                    let tmpArr = [];
                    res.data.labels.forEach(item => {
                        let obj = {};
                        obj.lang = item._id;
                        obj.str = "";
                        tmpArr.push(obj);
                    });
                    this.tabArr = tmpArr;
                    if (tmpArr.length) {
                        this.tabIndex = this.tabArr[0].lang || "";
                    }
                }
            });
        },
        editorChange(html) {
            this.content = html;
            if (this.tabArr.length) {
                this.tabArr[this.index].str = html;
            }
        },
        titleChange(title) {
            if (this.tabArr.length) {
                this.tabArr[this.index].title = title;
            }
        },
        selectTab(lang) {
            let index = this.tabArr.findIndex(item => {
                return item.lang == lang;
            });
            if(index > -1){
                this.index = index;
                this.title = this.tabArr[index].title || "";
                this.content = this.tabArr[index].str || "";
                this.tabIndex = this.tabArr[index].lang || "";
            }
        },
        addTag() {
            this.$refs.diaLog.show();
            getCommonTagList().then(res => {
                if (res.code == 0) {
                    this.labels = res.data.labels;
                } else {
                    this.$message.error(res.msg || "获取标签失败");
                }
            });
        },
        deleTag(tag) {
            this.deleTagId = tag;
            this.$refs.deleTag.show();
        },
        deleTagSure() {
            let index = this.tags.findIndex(item => {
                return item == this.deleTagId;
            });
            if(index > -1){
                this.tags.splice(index, 1);
            }
            this.$refs.deleTag.hide();
        },
        addTagSure() {
            // this.tags = this.tags.concat(this.addLabel);
            this.addLabel.forEach(item => {
                let index = this.tags.indexOf(item);
                if (index == -1) {
                    this.tags.push(item);
                }
            });
            this.$refs.diaLog.hide();
        },
        addLabelChange(labels) {
            this.addLabel = labels;
        },
        submit() {
            let postObj = {};
            let flag = true;
            postObj.showInHome = this.checkedIndex ? 1 : 0;
            postObj.showInOutside = this.checkedDeal ? 1 : 0;
            postObj.tags = this.tags;
            postObj.site = this.domain
            let title = [],
                context = [];
            this.tabArr.forEach(item => {
                let objTitle = {},
                    objCont = {};
                if (item.title && item.str) {
                    objTitle.lang = item.lang;
                    objTitle.str = item.title;
                    objCont.lang = item.lang;
                    objCont.str = item.str;
                } else if (!item.title && !item.str) {
                    objTitle.lang = item.lang;
                    objCont.lang = item.lang;
                } else {
                    flag = false;
                }
                title.push(objTitle);
                context.push(objCont);
            });
            postObj.title = title;
            postObj.context = context;
            if (!flag) {
                this.$message.error(
                    "每种语言文章的标题和内容要么不填,要么都填"
                );
                return;
            }
            // console.log(postObj)
            if (!this.once) {
                this.once = true;
                if (this.id) {
                    postObj.articleId = this.id;
                    console.log(postObj);
                    editArticle(postObj).then(res => {
                        this.once = false;
                        if (res.code == 0) {
                            this.$message.success(res.msg || "保存成功");
                            this.$router.push({
                                path: "/article/list"
                            });
                        } else {
                            this.$message.error(res.msg || "保存失败");
                        }
                    });
                } else {
                    addArticle(postObj).then(res => {
                        this.once = false;
                        if (res.code == 0) {
                            this.$message.success(res.msg || "保存成功");
                            this.$router.push({
                                path: "/article/list"
                            });
                        } else {
                            this.$message.error(res.msg || "保存失败");
                        }
                    });
                }
            }
        }
    },
    components: {
        Bread,
        Tab,
        DiaLog,
        Ueditor,
        // richTextEditor,
    }
};
</script>
<style lang="scss" scoped>
@import "~assets/style/variable";

.recharge-box {
    padding: 20px;
    .recharge {
        width: 100%;
        min-height: 700px;
        background: #fff;
        .head {
            padding: 15px;
            border-bottom: 1px solid #f3f3f3;
            font-size: $font-size-small;
        }
        .tab-box {
            padding: 15px;
            .check {
                display: block;
                margin: 10px;
                margin-left: 0;
                max-width: 200px;
            }
            .btn {
                // margin-bottom: 20px;
                // margin-right: 20px;
                margin: 20px 0 ;
            }
            .title {
                margin-bottom: 10px;
            }
            .add-lang {
                display: block;
                margin-bottom: 10px;
            }
            .tag-item {
                margin-right: 20px;
                margin-bottom: 10px;
            }
            .add-tag {
                display: block;
                margin-bottom: 10px;
                margin-top: 30px;
            }
        }
    }
}
.dia-log .content {
    width: 100%;
    .item {
        display: flex;
        width: 100%;
        height: 40px;
        line-height: 40px;
        margin-bottom: 10px;
        &:last-of-type {
            margin-bottom: 0;
        }
        .desc {
            flex: 0 0 80px;
        }
        .input {
            flex: 1;
            margin-left: 10px;
        }
    }
}
</style>
<style>
.recharge .date .el-range-separator {
    width: 10%;
}
</style>


