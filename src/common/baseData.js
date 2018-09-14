export const acquisitionMode = [{
        value: "fixed",
        name: "固定"
    },
    {
        value: "reference",
        name: "自动采集"
    },
    {
        value: "flow",
        name: "本地浮动"
    }
];

export const fabiAcquisitionMode = [{
        value: "fixed",
        name: "固定"
    },
    {
        value: "reference",
        name: "自动采集"
    }
];

export const payway = [{
        value: "alipay",
        name: "支付宝"
    },
    {
        value: "wechat",
        name: "微信"
    },
    {
        value: "paypal",
        name: "paypal"
    },
    {
        value: "unionpay",
        name: "银联"
    }
];


export const paywayImg = [{
        value: 'alipay',
        url: require('assets/image/payment_alipay.png')
    },
    {
        value: 'wechat',
        url: require('assets/image/payment_wechat.png')
    },
    {
        value: 'unionpay',
        url: require('assets/image/payment_card.png')
    },
    {
        value: 'paypal',
        url: require('assets/image/paypal.png')
    }
]


export const communityIcon = [{
        icon: 'qq',
        name: 'QQ'
    },
    {
        icon: 'weixin',
        name: '微信'
    },
    {
        icon: 'twitter',
        name: 'Twitter'
    },
    {
        icon: 'paper-plane',
        name: 'Telegram'
    },
    {
        icon: 'rss',
        name: 'blog'
    },
    {
        icon: 'facebook',
        name: 'facebook'
    }
]


export const feePayWay = [{
        value: 'self',
        name: '本币支付'
    },
    {
        value: 'official',
        name: '官方币支付'
    },
    {
        value: 'optional',
        name: '优先使用官方币支付'
    }
]

export const dealStatus = [{ //提现状态
        value: 'process',
        name: '等待审核',
        color: '#e6a23c'
    },
    {
        value: 'refuse',
        name: '已拒绝',
        color: '#f56c6c'
    },
    {
        value: 'running',
        name: '正在提币',
        color: '#69c2fe'
    },
    {
        value: 'success',
        name: '已完成',
        color: '#67c23a'
    }
]


export const depositsStatus = [{ //充值状态
        value: 'process',
        name: '进行中',
        color: '#e6a23c'
    },
    {
        value: 'success',
        name: '成功',
        color: '#67c23a'
    }
]

export const advertStatus = [ //广告状态
    {
        value: 'online',
        name: '已上架',
        color: '#67c23a'
    },
    {
        value: 'offline',
        name: '已下架',
        color: '#909399'
    },
    {
        value: 'delete',
        name: '已删除',
        color: '#f56c6c'
    }
]

export const orderStatus = [ //订单状态
    {
        value: 'waitPay',
        name: '等待付款',
        color: '#e6a23c'
    },
    {
        value: 'waitCoin',
        name: '等待发币',
        color: '#69c2fe'
    },
    {
        value: 'success',
        name: '交易成功',
        color: '#67c23a'
    },
    {
        value: 'cancel',
        name: '交易取消',
        color: '#909399'
    },
    {
        value: 'expire',
        name: '交易过期',
        color: '#f56c6c'
    }
]

export const appealType = [{
        value: 'no_pay',
        name: '买家并未付款'
    },
    {
        value: 'no_coin',
        name: '卖家不释放货币'
    },
    {
        value: 'no_response',
        name: '长时间无回应'
    },
    {
        value: 'spite',
        name: '恶意买卖'
    },
    {
        value: 'other',
        name: '其他'
    }
]

export const competenceList = [
    // {
    //     name: '新增管理员',
    //     value: 'admin_signup',
    //     val: false
    // },
    // {
    //     name: '编辑管理员',
    //     value: 'admin_pwd',
    //     val: false
    // },
    // {
    //     name: '删除管理员',
    //     value: 'admin_del',
    //     val: false
    // },
    {
        name: '文章列表展示',
        value: 'article_*',
        val: true
    },
    {
        name: '添加文章',
        value: 'article_add',
        val: false
    },
    {
        name: '删除文章',
        value: 'article_del',
        val: false
    },
    {
        name: '编辑文章',
        value: 'article_edit',
        val: false
    },
    {
        name: '添加文章标签',
        value: 'label_add',
        val: false
    },
    {
        name: '删除文章标签',
        value: 'label_del',
        val: false
    },
    {
        name: '编辑文章标签',
        value: 'label_edit',
        val: false
    },
    {
        name: '文章标签展示',
        value: 'label_*',
        val: true
    },
    {
        name: '糖果发放',
        value: 'candy_provide',
        val: false
    },
    {
        name: '糖果发放模块展示',
        value: 'candy_*',
        val: true
    },
    {
        name: '添加Token货币',
        value: 'currency_add',
        val: false
    },
    {
        name: '编辑Token货币',
        value: 'currency_edit',
        val: false
    },
    {
        name: '添加法定货币',
        value: 'fiatCurrency_add',
        val: false
    },
    {
        name: '编辑法定货币',
        value: 'fiatCurrency_edit',
        val: false
    },
    {
        name: '添加语言',
        value: 'lang_add',
        val: false
    },
    {
        name: '编辑语言',
        value: 'lang_edit',
        val: false
    },
    {
        name: '删除语言',
        value: 'lang_del',
        val: false
    },
    {
        name: '领取申诉',
        value: 'appeal_mark',
        val: false
    },
    {
        name: '处理申诉',
        value: 'appeal_process',
        val: false
    }
]