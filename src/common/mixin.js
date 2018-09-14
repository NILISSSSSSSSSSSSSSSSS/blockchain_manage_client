import { getCurrency, getFiatCurrency } from "api/api";

export const getCurrencyList = {
    data() {
        return {
            currency: []
        };
    },
    created() {
        this._getCurrency();
    },
    methods: {
        _getCurrency() {
            getCurrency().then(res => {
                if (res.code == 0) {
                    this.currency = res.data || [];
                } else {
                    this.$message.error(res.msg || "获取币种失败");
                }
            });
        }
    }
};

export const getFiatCurrencyList = {
    data() {
        return {
            fiatCurrency: []
        };
    },
    created() {
        this._getFiatCurrency();
    },
    methods: {
        _getFiatCurrency() {
            getFiatCurrency().then(res => {
                if (res.code == 0) {
                    this.fiatCurrency = res.data || [];
                } else {
                    this.$message.error(res.msg || "获取法币币种失败");
                }
            });
        }
    }
};

export const parseUser = {
    methods: {
        parseName(owner) {
            if (!owner && typeof owner != "undefined" && owner != 0) {
                return "";
            }
            if (!owner) {
                return "";
            }
            return owner.nickName || owner.name || "";
        },
        toUser(owner) {
            let id = "";
            if (!owner && typeof owner != "undefined" && owner != 0) {
                id = "";
            } else {
                id = owner._id || "";
            }
            if (id) {
                const { href } = this.$router.resolve({
                    path: `/user/detail/${id}`
                });
                window.open(href, "_blank");
            } else {
                // this.$message.error("此用户没有id.....")
            }
        }
    }
};