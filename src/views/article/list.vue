<template>
    <div class="container">
        <bread title="文章列表" desc="系统的公告管理" :list="breadNav"></bread>
        <div class="recharge-box">
            <div class="recharge">
                <header class="head">文章列表</header>
                <div class="search">
                    <el-input placeholder="文章标题" v-model="search.title" class="item"></el-input>
                    <el-select multiple clearable v-model="search.tags"  placeholder="请选择标签" class="item" style="width:300px;" >
                        <el-option v-for="item in labels" :key="item.id" :label="item.tagName" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-button type="success" @click="searchBtn">搜索</el-button>
                    <el-button type="success" class="add" @click="add" v-if="permissions.article_add">增加文章</el-button>
                </div>
                <div class="table">
                    <el-table ref="table" :data="tableData" :header-cell-style="{color: 'rgba(0,0,0,.85)','text-align': 'center'}" :cell-style="{'text-align': 'center'}" style="width: 100%">
                        <!-- <el-table-column type="index" label="编号" width="50">
            </el-table-column> -->
                        <el-table-column prop="title" label="文章中文标题">
                            <template slot-scope="scope">
                                <span>{{scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="首页展示">
                            <template slot-scope="scope">
                                <span>{{scope.row.showInHome ? '是' : '否'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="场外交易展示">
                            <template slot-scope="scope">
                                <span>{{scope.row.showInOutside ? '是' : '否'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间">
                            <template slot-scope="scope">
                                <span>{{_datetimeFormat(scope.row.createTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" v-if="permissions.article_edit || permissions.article_del">
                            <template slot-scope="scope">
                                <el-button size="mini" type="success" class="operate" v-if="permissions.article_edit" @click="edit(scope.$index, scope.row)">
                                    <i class="el-icon-check"></i>
                                    编辑</el-button>
                                <el-button size="mini" type="danger" class="operate" v-if="permissions.article_del" @click="dele(scope.$index, scope.row)">
                                    <i class="el-icon-close"></i>
                                    删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="pagenation">
                        <select-page @changeSize="changeSize" :total="page.total" />
                        <el-pagination background layout="prev, pager, next,jumper" :page-size="page.pageSize" :total="page.total" :current-page="page.page" @current-change="handleCurrentChange">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <dia-log title="确认删除" type="danger" ref="dialogDele" @sure="deleItem">
            <div>确认删除此文章?</div>
        </dia-log>
    </div>

</template>
<script>
import Bread from "components/bread";
import DiaLog from "components/dia-log";
import SelectPage from "components/select-page";
import { datetimeFormat ,getWpermissions } from "common/util";
import { getArticleList, deleArticle ,getCommonTagList} from "api/api";

export default {
    data() {
        return {
            breadNav: [
                { name: "文章管理", path: "" },
                { name: "文章列表", path: "/article/list" }
            ],
            search: {
                tags: [],
                title: "",
                sort: ""
            },
            permissions: {
                article_add: false,
                article_edit: false,
                article_del: false
            },
            labels: [],
            id: "",
            tableData: [],
            page: {
                page: 1,
                pageSize: 10,
                total: 0
            }
        };
    },
    created() {
        this._getCommonTagList();
        this._getArticleList();
        getWpermissions(this.permissions)
    },
    methods: {
        // sortChange({ column, prop, order }) {
        //     if (order == "ascending") {
        //         this.search.sort = `${prop}.asc`;
        //     } else if (order == "descending") {
        //         this.search.sort = `${prop}.desc`;
        //     } else {
        //         this.search.sort = "";
        //     }
        //     this._getArticleList();
        // },
        _datetimeFormat(time) {
            return datetimeFormat(time);
        },
        _getArticleList() {
            let tags = ""
            if(this.search.tags.length){
                tags = this.search.tags.join(",")
            }
            let searchObj = {
                page: this.page.page,
                pageSize: this.page.pageSize,
                title: this.search.title,
                tags: tags
            };

            getArticleList(searchObj).then(res => {
                if (res.code == 0) {
                    this.tableData = res.data.list || [];
                    this.page.total = res.data.count || 0;
                }
            });
        },
        _getCommonTagList() {
            getCommonTagList().then(res => {
                if (res.code == 0) {
                    this.labels = res.data.labels;
                } else {
                    this.$message.error(res.msg || "获取标签失败");
                }
            });
        },
        searchBtn() {
            this.page.page = 1;
            this._getArticleList();
        },
        edit(index, row) {
            let id = row._id;
            this.$router.push({
                path: `/article/detail/${id}`
            });
        },
        dele(index, row) {
            this.id = row._id;
            this.$refs.dialogDele.show();
        },
        deleItem() {
            let obj = {
                articleIds: [this.id]
            };
            deleArticle(obj).then(res => {
                if (res.code == 0) {
                    this.$message.success(res.msg || "删除成功");
                    this.$refs.dialogDele.hide();
                    this._getArticleList();
                } else {
                    this.$message.error(res.msg || "删除失败");
                }
            });
        },
        add() {
            this.$router.push({
                path: `/article/detail`
            });
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this._getArticleList();
        },
        changeSize(pageSize) {
            this.page.pageSize = Number(pageSize);
            this.page.page = 1;
            this._getArticleList();
        }
    },
    components: {
        Bread,
        DiaLog,
        SelectPage
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
        .search {
            padding: 15px;
            border-bottom: 1px solid #ccc;
            .add {
                float: right;
                margin-right: 40px;
            }
            .item {
                width: 180px;
                margin-bottom: 10px;
            }
            .date {
                width: 230px;
                margin-bottom: 10px;
            }
        }
        .table {
            padding: 20px 15px;
            .operate {
                margin: 2px;
            }
        }
        .pagenation {
            padding: 20px 0;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
<style>
.recharge .date .el-range-separator {
    width: 10%;
}
</style>


