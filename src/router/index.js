import Vue from "vue";
import Router from "vue-router";
//登录
const Login = resolve => {
    import ("views/login/login").then(module => {
        resolve(module);
    });
};
//首页组件
const Indexs = resolve => {
    import ("views/index/index").then(module => {
        resolve(module);
    });
};
//交易管理
const Order = resolve => {
    import ("views/deal/order").then(module => {
        resolve(module);
    });
};
const Record = resolve => {
    import ("views/deal/record").then(module => {
        resolve(module);
    });
};
const Pending = resolve => {
    import ("views/deal/pending").then(module => {
        resolve(module);
    });
};
const Transfer = resolve => {
    import ("views/deal/transfer").then(module => {
        resolve(module);
    })
}
const TransferRecord = resolve => {
    import ("views/deal/transfer-record").then(module => {
        resolve(module);
    })
}

//场内交易
const cangNeiJiaoYi = resolve => {
    import ("views/cangNei/index").then(module => {
        resolve(module);
    });
};

//申诉中心
const ComplaintRecord = resolve => {
    import ("views/complaint/record").then(module => {
        resolve(module);
    });
};
const ComplaintNoReceive = resolve => {
    import ("views/complaint/no-receive").then(module => {
        resolve(module);
    });
};
const ComplaintReceive = resolve => {
    import ("views/complaint/receive").then(module => {
        resolve(module);
    });
};
const ComplaintDetail = resolve => {
    import ("views/complaint/detail").then(module => {
        resolve(module)
    })
}

//dashboard 默认首页
const Dashboard = resolve => {
    import ("views/dashboard/dashboard").then(module => {
        resolve(module);
    });
};
//充值提现
const Recharge = resolve => {
    import ("views/cashlists/recharge").then(module => {
        resolve(module);
    });
};
const Withdraw = resolve => {
    import ("views/cashlists/withdraw").then(module => {
        resolve(module);
    });
};
//用户管理
const UserList = resolve => {
    import ("views/user/user-list").then(module => {
        resolve(module);
    });
};
const LoginLog = resolve => {
    import ("views/user/login-log").then(module => {
        resolve(module);
    });
};
const Detail = resolve => {
    import ("views/user/detail").then(module => {
        resolve(module);
    });
};
const Wallet = resolve => {
    import ("views/user/wallet").then(module => {
        resolve(module);
    });
};
//钱包
const Pool = resolve => {
    import ("views/wallet/pool").then(module => {
        resolve(module);
    });
};
//数据管理 ---法币与token
const DataFabi = resolve => {
    import ("views/database/fabi").then(module => {
        resolve(module);
    });
};
const TokenList = resolve => {
    import ("views/database/tokenlist").then(module => {
        resolve(module);
    });
};
const TokenDetail = resolve => {
    import ("views/database/token-detail").then(module => {
        resolve(module);
    });
};
const rollin = resolve => {
    import ("views/database/rollin").then(module => {
        resolve(module);
    });
};
//系统配置
const SystemConfig = resolve => {
    import ("views/system/config").then(module => {
        resolve(module);
    });
};
//系统配置-列表
const listSystemConfig = resolve => {
  import ("views/system/list").then(module => {
      resolve(module);
  });
};
//系统配置-添加域名
const addSystemConfig = resolve => {
  import ("views/system/add").then(module => {
      resolve(module);
  });
};
//公告管理
// const AnnounceList = resolve => {
//     import ("views/announce/list").then(module => {
//         resolve(module);
//     });
// };
// const AnnounceDetail = resolve => {
//     import ("views/announce/detail").then(module => {
//         resolve(module);
//     });
// };

//文章及标签
const ArticleList = resolve => {
    import ("views/article/list").then(module => {
        resolve(module);
    });
};
const ArticleDetail = resolve => {
    import ("views/article/detail").then(module => {
        resolve(module);
    });
};
const ArticleTag = resolve => {
    import ("views/article/tags").then(module => {
        resolve(module);
    });
};
const TagDetail = resolve => {
    import ("views/article/tag-detail").then(module => {
        resolve(module);
    });
};
//语言
const LanguageList = resolve => {
    import ("views/language/list").then(module => {
        resolve(module);
    });
};
//管理员
const Administrator = resolve => {
    import ("views/administrator/list").then(module => {
        resolve(module);
    });
};
const CompetenceConfig = resolve => {
    import ("views/administrator/competence").then(module => {
        resolve(module);
    });
};
//糖果发放
const CandySend = resolve => {
    import ("views/candy/send").then(module => {
        resolve(module);
    });
};
//统计分析
const Statistics = resolve => {
    import ("views/statistics/analysis").then(module => {
        resolve(module);
    });
};
//发币管理
const ManagerCoin = resolve => {
    import ("views/manager/sendcoin").then((module) => {
        resolve(module)
    })
}


Vue.use(Router);

export default new Router({
    routes: [{
                path: "/",
                redirect: "/login",
                name: "login",
                component: Login
            },
            {
                path: "/login",
                component: Login
            },
            {
                path: "/index",
                redirect: "/dashboard",
                component: Indexs,
                children: [{
                        path: "/dashboard",
                        component: Dashboard
                    },
                    {
                        path: "/deal/order",
                        component: Order
                    },
                    {
                        path: "/deal/record",
                        component: Record
                    },
                    {
                        path: "/deal/pending",
                        component: Pending
                    },
                    {
                        path: "/deal/transfer",
                        component: Transfer
                    },
                    {
                        path: "/deal/transfer/record",
                        component: TransferRecord
                    },
                    {
                        path: "/complaint/detail/:id",
                        component: ComplaintDetail
                    },
                    {
                        path: "/cangNei/index",
                        component: cangNeiJiaoYi
                    },
                    {
                        path: "/complaint/record",
                        component: ComplaintRecord
                    },
                    {
                        path: "/complaint/noreceive",
                        component: ComplaintNoReceive
                    },
                    {
                        path: "/complaint/receive",
                        component: ComplaintReceive
                    },
                    {
                        path: "/cashlists/withdraw",
                        component: Withdraw
                    },
                    {
                        path: "/cashlists/recharge",
                        component: Recharge
                    },
                    {
                        path: "/user/userlist",
                        component: UserList
                    },
                    {
                        path: "/user/loginlog",
                        component: LoginLog
                    },
                    {
                        path: "/user/detail/:id",
                        component: Detail
                    },
                    {
                        path: "/user/wallet",
                        component: Wallet
                    },
                    {
                        path: "/wallet/pool",
                        component: Pool
                    },
                    {
                        path: "/database/fabi",
                        component: DataFabi
                    },
                    {
                        path: "/database/tokenlist",
                        component: TokenList
                    },
                    {
                        path: "/database/tokenlist/:id",
                        component: TokenDetail
                    },
                    
                    {
                        path: "/database/rollin",
                        component: rollin
                    },
                    {
                        path: "/system/config",
                        component: SystemConfig
                    },
                    {
                      path: "/system/list",
                      component: listSystemConfig
                    },
                    {
                      path: '/system/add',
                      component: addSystemConfig
                    },
                    {
                        path: "/article/list",
                        component: ArticleList
                    },
                    {
                        path: "/article/detail",
                        component: ArticleDetail
                    },
                    {
                        path: "/article/detail/:id",
                        component: ArticleDetail
                    },
                    {
                        path: "/article/tags",
                        component: ArticleTag
                    },
                    {
                        //新增时的路由
                        path: "/article/tag",
                        component: TagDetail
                    },
                    {
                        path: "/article/tag/:id",
                        component: TagDetail
                    },
                    {
                        path: "/language/list",
                        component: LanguageList
                    },
                    {
                        path: "/administrator/list",
                        component: Administrator
                    },
                    {
                        path: "/administrator/competence",
                        component: CompetenceConfig
                    },
                    {
                        path: "/administrator/competence/:id",
                        component: CompetenceConfig
                    },
                    {
                        path: "/candy/send",
                        component: CandySend
                    },
                    {
                        path: "/statistics/analysis",
                        component: Statistics
                    },
                    {
                        path: "/manager/sendcoin",
                        component: ManagerCoin
                    }
                ]
            }
        ]
        // scrollBehavior(to, from, savedPosition) {
        //     // `to` 和 `from` 都是路由对象
        //     // console.log("to", to)
        // }
});
