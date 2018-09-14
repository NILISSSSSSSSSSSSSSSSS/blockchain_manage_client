<template>
    <div class="container">
        <bread title="管理员列表" desc="系统得管理员信息" :list="breadNav"></bread>
        <div class="recharge-box">
            <div class="recharge">
                <header class="head">管理员列表</header>
                <div class="search">
                    <el-input placeholder="管理员账号" v-model="search.username" class="item"></el-input>
                    <el-button type="success" @click="searchBtn">搜索</el-button>
                    <el-button type="success" class="add" @click="add" >增加管理员</el-button>
                </div>
                <div class="table">
                    <el-table :data="tableData" :header-cell-style="{color: 'rgba(0,0,0,.85)','text-align': 'center'}" :cell-style="{'text-align': 'center'}" style="width: 100%">
                        <el-table-column type="index" label="编号" width="50">
                        </el-table-column>
                        <el-table-column prop="username" label="账号名称">
                        </el-table-column>
                        <el-table-column label="上次登录时间">
                            <template slot-scope="scope">
                                <span>{{_datetimeFormat(scope.row.signinTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间">
                            <template slot-scope="scope">
                                <span>{{_datetimeFormat(scope.row.createTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column  label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="success" class="operate"   @click="edit(scope.$index, scope.row._id)">
                                    <i class="el-icon-check"></i>
                                    编辑</el-button>
                                <el-button size="mini" type="danger" class="operate" :disabled="scope.row.isRoot"  @click="dele(scope.$index, scope.row._id)">
                                    <i class="el-icon-close"></i>
                                    删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="pagenation">
                        <select-page @changeSize="changeSize" :total="page.total" />
                        <el-pagination background layout="prev, pager, next,jumper" :page-size="page.pageSize" :total="page.total" :current-page="page.page"  @current-change="handleCurrentChange">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <dia-log title="确认删除" types="danger" ref="dele" @sure="deleSure">
            <div>确认删除此管理员</div>
        </dia-log>
    </div>

</template>
<script>
import Bread from "components/bread";
import DiaLog from "components/dia-log";
import SelectPage from "components/select-page";
import {
    addAdmin,
    getAdminList,
    getAdminOne,
    editAdminOne,
    deleAdminOne
} from "api/api";
import { validate } from "common/util";
import { datetimeFormat } from "common/util";

export default {
    data() {
        return {
            isRoot: false,
            admin: {
                username: "",
                pass: "",
                passAgain: ""
            },
            tmpId: "", //用于删除时的暂存id
            breadNav: [
                { name: "管理员", path: "" },
                { name: "管理员列表", path: "/administrator/list" }
            ],
            search: {
                username: ""
            },
            tableData: [],
            page: {
                page: 1,
                pageSize: 10,
                total: 0
            }
        };
    },
    created() {
        this.isRoot = sessionStorage.getItem("isRoot") || false;
        this._getAdminList();
    },
    methods: {
        _getAdminList() {
            let searchObj = {
                page: this.page.page,
                pageSize: this.page.pageSize,
                username: this.search.username
            }
            getAdminList(searchObj).then(res => {
                if (res.code == 0) {
                    this.tableData = res.data.list || [];
                    this.page.total = res.data.count || 0;
                }
            });
        },
        searchBtn(){
            this.page.page = 1
            this._getAdminList()
        },
        edit(index, id) {
            this.$router.push({
                path: `/administrator/competence/${id}`
            })
        },
        dele(index, id) {
            this.tmpId = id;
            this.$refs.dele.show();
        },
        deleSure() {
            deleAdminOne({
                adminId: this.tmpId
            }).then(res => {
                if (res.code == 0) {
                    this.$message.success(res.msg || "删除成功");
                    this.$refs.dele.hide();
                    this._getAdminList();
                } else {
                    this.$message.error(res.msg || "删除失败");
                }
            });
        },
        add() {
            this.$router.push({
                path: `/administrator/competence`
            })
        },
        handleCurrentChange(page) {
            this.page.page = page;
            this._getAdminList();
        },
        changeSize(pageSize) {
            this.page.pageSize = Number(pageSize);
            this.page.page = 1;
            this._getAdminList();
        },
        _datetimeFormat(time) {
            return datetimeFormat(time);
        },
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
.dialog {
    .content {
        display: flex;
        flex-direction: column;
        .item {
            display: flex;
            margin-bottom: 10px;
            height: 40px;
            align-items: center;
            .name {
                flex: 0 0 80px;
                display: flex;
                justify-content: space-between;
            }
            .val {
                flex: 1;
            }
        }
    }
}
</style>
<style>
.recharge .date .el-range-separator {
    width: 10%;
}
</style>


