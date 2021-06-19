// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	let api = {}
	// 此处没有使用传入的params参数
	api.getAdvert = (params = {
		// 广告位id，多个以逗号隔开
		space: '1,2,3'
	}) => vm.$u.get('/advertisingspace/advertising', params)
	
	api.getFeeds = (params = {
		// 可选，单次请求最大条数
		limit: 20,
		// 可选，上次获取到数据最后一条 ID，用于获取该 ID 之后的数据
		// after : 0, 
		// 可选，默认值 new，可选值 `new` 、`hot` 、 `follow` 、`users`
		// type: 'users',
		// 可选，type = `new`时可选，搜索关键字
		// search: '',
		// 可选，type = `users` 时可选，默认值为当前用户id
		// user: 1,
		// 可选，type = `users` 时可选，`paid`-付费动态 `pinned` - 置顶动态
		// screen: 'pinned',
		// 可选，可选，仅 `type=hot` 时有效，用于热门数据翻页标记，上次获取数据最后一条的 `hot` 值
		// hot: 1
	}) => vm.$u.get('/feeds', params)
	
	// 获取资讯列表信息
	api.getNews = (params = {
		// 可选，数据返回条数 默认为20
		limit: 20,
		// 可选，上次获取到数据最后一条 ID，用于获取该 ID 之后的数据
		// after : 0, 
		// 可选，搜索关键字
		// key: ''，,
		// 可选，推荐筛选 =1 为筛选推荐资讯列表
		// recommend: 1
	})=> vm.$u.get('/news', params)
	
	//获取动态详情
	api.getFeedInfo = (params = {
		id:17
	})=>vm.$u.get('/feeds/' + params.id)
	
	//获取资讯详情
	api.getNewInfo = (params = {
		id:17
	})=>vm.$u.get('/news/' + params.id)
	
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = api
}

export default {
	install
}