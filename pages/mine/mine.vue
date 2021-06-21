<template>
	<view>
		<u-avatar :src="avatar"></u-avatar>
		<text class="user-name">{{userInfo.name}}</text>
		<login />
	</view>
</template>

<script>
	//引入vuex （computed和method也要同步展开）
	import{
		mapState,
		mapActions,
	}from 'vuex'
	
	export default {
		data() {
			return {
				
			}
		},
		onShow(){
			console.log(this.userInfo)
		},
		computed:{
			...mapState(['loginState','userInfo'])
		},
		
		methods: {
			...mapActions(['userLoginAction','userLogouAction']),
		}
	}
</script>

<style>

</style>
