import $http from "api/config";
import { axiosget, axiospost, axiosput, axiosdelete ,axiospatch} from 'api/axios'

//管理员自己修改密码
export function modifySecret(obj) {
    return axiosput("/admin/pwd", obj)
}

//编辑保存单条公告
export function announceEdit(obj) {
    return $http.put("/notice/edit", obj).then(res => {
        return Promise.resolve(res.data);
    });
}

//获取文章列表
export function getArticleList(obj) {
    return axiosget("/article/list", obj)
}

//删除文章
export function deleArticle(ids) {
    return axiosdelete("/article/del", ids)
}

//获取单篇文章
export function getArticleOne(obj) {
    return axiosget("/article/detail", obj)
}

//编辑保存文章
export function editArticle(obj) {
    return axiosput("/article/edit", obj)
}

//新建保存文章
export function addArticle(obj) {
    return axiospost("/article/add", obj)
}


//获取标签列表 (有token)
export function getTagList() {
    return axiosget("/label/list")
}

//获取标签列表(无token,公共)
export function getCommonTagList() {
    return axiosget("/index/labelopt")
}

//获取单个标签的内容
export function getTagOne(obj) {
    return axiosget("/label/detail", obj)
}

//编辑单个标签后的保存
export function editTag(obj) {
    return axiosput("/label/edit", obj)
}


//新增 标签的保存
export function addTag(obj) {
    return axiospost("/label/add", obj)
}

//删除单个标签
export function deleTag(ids) {
    return axiosdelete("/label/del", ids)
}


//获取语言列表(有token)
export function getLangList() {
    return axiosget("/lang/list")
}
//获取语言列表(无token)
export function getCommonLangList() {
    return axiosget("/index/langopt")
}
//增加语言
export function addLang(obj, config) {
    return axiospost("/lang/add", obj, config)
}
//删除语言
export function deleLang(ids) {
    return axiosdelete("/lang/del", ids)
}
//编辑语言
export function editLang(obj, config) {
    return axiosput("/lang/edit", obj, config)
}


//管理员权限部分

//登录
export function login(obj) {
    return axiospost("/admin/signin", obj)
}
//登出
export function loginOut() {
    return axiospost("/admin/logout")
}

//新增管理员
export function addAdmin(obj) {
    return axiospost("/admin/signup", obj)
}

//管理员列表
export function getAdminList(obj) {
    return axiosget("/admin/list", obj)
}

//获取单个管理员信息
export function getAdminOne(obj) {
    return axiosget("/admin/detail", obj)
}

//编辑单个管理员信息
export function editAdminOne(obj) {
    return axiosput("/admin/edit", obj)
}

//删除单个管理员信息
export function deleAdminOne(obj) {
    return axiosdelete("/admin/del", obj)
}

//token与法币部分

//获取token列表
export function getTokenList(obj) {
    return axiosget("/currency/list", obj)
}
//新增token
export function addToken(obj) {
    return axiospost("/currency/add", obj)
}
//token的详细信息
export function getTokenDetail(obj) {
    return axiosget("/currency/detail", obj)
}
//token的编辑保存
export function editToken(obj) {
    return axiosput("/currency/edit", obj)
}
//获取法币
export function getFiatList(obj) {
    return axiosget("/fiatCurrency/list", obj)
}
//获取法币详细信息
export function getFiatDetail(obj) {
    return axiosget("/fiatCurrency/detail", obj)
}
//编辑法币
export function editFiatSave(obj) {
    return axiosput("/fiatCurrency/edit", obj)
}
//新增法币
export function addFiatSave(obj) {
    return axiospost("/fiatCurrency/add", obj)
}
//虚拟币的一些配置
export function getSysconf() {
    return axiosget("/sysconf/detail")
}
//虚拟币配置时的编辑
export function editSysconf(obj) {
    return axiosput("/sysconf/edit", obj)
}

//获取所有的虚拟币种
export function getCurrency(obj) {
    return axiosget("/index/tokenopt", obj)
}
//获取所有的法币币种
export function getFiatCurrency(obj) {
    return axiosget("/index/fiatopt", obj)
}

//钱包管理部分
//获取钱包池列表
export function getAddrPoolList(obj) {
    return axiosget("/addrpool/list", obj)
}

//用户管理
//获取用户列表
export function getUserList(obj) {
    return axiosget("/user/list", obj)
}
//获取用户的详细信息
export function getUserInfo(obj) {
    return axiosget("/user/detail", obj)
}
//批量增加账户
export function addManyAcount(obj) {
    return axiospost("/user/addaccount", obj)
}

//获取用户的登录日志
export function getUserRecord(obj) {
    return axiosget("/record/list", obj)
}
//获取用户钱包信息
export function getUserWallet(obj) {
    return axiosget("/wallet/list", obj)
}

//充值提现
//获取提现列表
export function getWithdrawList(obj) {
    return axiosget("/withdraws/list", obj)
}
//获取充值列表
export function getDepositsList(obj) {
    return axiosget("/deposits/list", obj)
}

//站内交易
//获取挂单列表
export function getAdvertList(obj) {
    return axiosget("/advert/list", obj)
}
//获取订单列表
export function getOrderList(obj) {
    return axiosget("/order/list", obj)
}
//获取交易记录
export function getTraderecord(obj) {
    return axiosget("traderecord/list", obj)
}
//编辑挂单上架或者下架
export function editAdvertOne(obj) {
    return axiospost("/advert/edit", obj)
}
//获取转账记录
export function getTransferRecord(obj){  //用户的转账记录
    return axiosget("/transfer/record",obj)
}
export function getTransferApiRecord(obj){ //接口转账记录
    return axiosget("/transfer/apirecord",obj)
}

//糖果交易
//糖果充值
export function candySend(obj) {
    return axiospost("/candy/provide", obj)
}
//糖果记录
export function getCandyList(obj) {
    return axiosget("/candy/record", obj)
}


//获取场内记录
export function getCangNeiRecord(obj) {
    return axiosget("/qh/list", obj)
}

//导出场内数据
export function cangNeiExport(obj) {
    return axiosget("/qh/export", obj)
}

//申诉中心
//获取未领取申诉列表
export function getAppealList(obj) {
    return axiosget("/appealHandle/list", obj)
}
//获取申诉详情
export function getAppealDetail(obj) {
    return axiospost("/appealHandle/detail", obj)
}
//领取申诉
export function markAppeal(obj) {
    return axiospost("/appealHandle/mark", obj)
}
//提交申诉结果
export function processAppeal(obj) {
    return axiospost("/appealHandle/process", obj)
}
//已处理的申诉列表
export function getAppealProcessedList(obj) {
    return axiospost("/appealHistory/list", obj)
}
//已处理的申诉列表详情
export function getAppealProcessedDetail(obj) {
    return axiospost("/appealHistory/detail", obj)
}
//获取已经领取的列表
export function getReceiveAppeal(obj) {
    return axiosget("/appealHandle/unprocessedlist", obj)
}


//获取权限的接口
export function getAdminPermissions(obj) {
    return axiosget("/admin/permissions", obj)
}

//统计分析/statistics/list
export function getStatisticsList(obj) {
    return axiospost("/statistics/list", obj)
}
//币种统计
export function getCurrencyStat(obj) {
    return axiosget("/currencyStat/index", obj)
}

//发币管理
//获取发币列表
export function getIssueCurrencyList(obj){
    return axiosget("/issueCurrency/list",obj)
}
//发币进行中
export function issueCurrencyInprogress(obj){
    return axiospatch("/issueCurrency/inprogress", obj)
}
//发币取消
export function issueCurrencyCancel(obj){
    return axiospatch("/issueCurrency/cancel",obj)
}
//发币完成
export function issueCurrencyApprove(obj){
    return axiospost("/issueCurrency/approve",obj)
}
// 获取系统配置，6项
export function getSysconfDetail() {
  return axiosget("/sysconf/detail")
}

// 修改系统设置，就是你上面的6个框框
export function editsys(obj) {
  return axiospost('/sysconf/editsys', obj)
}

// 拉所有域名列表
export function listdomain() {
  return axiosget('/sysconf/listdomain')
}

// 修改或新增某个域名的配置
export function editdomain(obj) {
  return axiospost('/sysconf/editdomain', obj)
}

// 删除域名配置
export function deleteDomain(obj) {
  return axiospost('/sysconf/deletedomain', obj)
}
