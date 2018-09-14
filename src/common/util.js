// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
export const Format = function(fmt) {
    //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
            );
    return fmt;
};

Date.prototype.Format = Format;

export const datetimeFormat = function(date) {
    return new Date(date).Format("yyyy-MM-dd hh:mm");
};

export const dateFormat = function(date) {
    return new Date(date).Format("yyyy-MM-dd");
};

export const getUrlParam = function(name) {
    //获取url中的参数
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};

export const validate = function(reg, str) {
    return reg.test(str);
};

export const daterange = function(startDate, endDate, str) {
    str = str || "";
    if (!startDate && typeof startDate != "undefined" && startDate != 0) {
        startDate = "";
    }
    if (!endDate && typeof endDate != "undefined" && endDate != 0) {
        endDate = "";
    }
    if (startDate && endDate) {
        if (startDate >= endDate) {
            $vm.$message.error(`${str}开始日期应该小于结束日期`);
            return false;
        }
        // $vm.search.createTime = datetimeFormat(startDate) + "--" + datetimeFormat(endDate)
    } else if (!startDate && endDate) {
        $vm.$message.error(`${str}请选择开始日期`);
        return false;
    } else if (!endDate && startDate) {
        $vm.$message.error(`${str}请选择结束日期`);
        return false;
    }

    return true;
};

//获取操作的权限
export function getWpermissions(obj) {
    let wPermissions = sessionStorage.getItem("wPermissions") || "";
    if (wPermissions) {
        wPermissions = JSON.parse(wPermissions);
    } else {
        wPermissions = [];
    }
    if (wPermissions.length) {
        wPermissions.forEach(item => {
            let key = `${item.controller}_${item.action}`;
            for (let objKey in obj) {
                if (key == objKey) {
                    obj[objKey] = item.val;
                }
            }
        });
    }
    // return wPermissions
}