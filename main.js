import Vue from 'vue'
import App from './App'
//引入uView-ui插件
import uView from 'uview-ui'
//将uview-ui挂载到Vue实例上，方便全局调用
Vue.use(uView)

//引入公用的头部导航组件（插件市场下载）
import uniNavBar from '@/components/uni-nav-bar/index.vue'
Vue.component('uniNavBar',uniNavBar)

//导入登录组件
import login from "@/components/login/login.vue"
Vue.component('login',login)


Vue.prototype.BaseFileURL = 'http://47.115.83.135/api/v2/files/'

//引入Vuex store
import store from '@/store/index.js'
Vue.prototype.$store = store

//引入minxin
import feedMixin from '@/mixins/todoFeed.js'
Vue.prototype.$feedMixin = feedMixin

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})

// http拦截器，此为需要加入的内容，如果不是写在common目录，请自行修改引入路径
import httpInterceptor from '@/common/http.interceptor.js'
// 这里需要写在最后，是为了等Vue创建对象完成，引入"app"对象(也即页面的"this"实例)
Vue.use(httpInterceptor, app)

//http接口API集中管理引入
import httpAPI from '@/common/http.api.js'
Vue.use(httpAPI,app)

app.$mount()
