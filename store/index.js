import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	//这个代表全局可以访问数据对象，就像是咱们在组件中声明的data属性
	state:{
		loginState:!!uni.getStorageSync('loginState') ? true : false,
		userInfo:!!uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {
			name:'未知用户',
			avatar:'/static/nopic.png',
			like:0,
			commented:0
		}
	},
	//这个实时监听state内的数据对象变化，类似组件中的computed属性，会依赖state属性变化而变化
	getters:{
		
	},
	//用来同步设置state的值
	mutations:{
		userLogin(state,userInfo){
			state.loginState = true
			state.userInfo = userInfo
			uni.setStorageSync('loginState','ok')
			uni.setStorageSync('userInfo',JSON.stringify(userInfo))
		},
		userLogout(state){
			state.loginState = false
			state.userInfo = {
				name:'未知用户',
				avatar:'/static/nopic.png',
				like:0,
				commented:0
			}
			uni.clearStorageSync('userInfo')
			uni.clearStorageSync('loginState')
			uni.clearStorageSync('token')
		}
	},
	//通过提交mutation内部的方法。异步更新state的状态，官方推荐都使用这种方法
	actions:{
		userLoginAction(context,userInfo){
			context.commit('userLogin',userInfo)
		},
		userLogoutAction(context){
			context.commit('userLogout')
		}
	}
})
export default store