// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import store from './store/index'
import sha1 from 'sha1'
import { url } from "api/url-config"
import { getUrl } from "../src/common/tool"
//iconfont的图标
import './assets/iconfont/iconfont.css'

Vue.use(ElementUI)
Vue.component('icon', Icon)

Vue.prototype.sha1 = sha1

Vue.prototype.getUrl = getUrl

Vue.config.productionTip = false

window.ueditorUrl = url


/* eslint-disable no-new */


window.$vm = new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})