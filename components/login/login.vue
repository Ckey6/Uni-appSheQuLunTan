<template>
	<view class="login" :class="{show:show}">
		<view class="mask" @tap="closeLogin" bind:tap="cancel" catch:touchmove="emptyHandler"></view>
		<view class="container">
			<view class="close-box" @tap="closeLogin" bind:tap="cancel">
				<image class="close-img" src="/static/close.png"></image>
			</view>
			
			<view class="p-name" v-if="getUserInfoTag">
				前端交流学习中心欢迎您
			</view>
			<button class="submit-btn"  @click="getWechatUserInfo" v-if="getUserInfoTag">
				<image class="wechat-img" src="/static/wechat.png"></image>
				<text>一键获取微信信息</text>
			</button>
			<u-form :model="form" ref="uForm" v-show="!getUserInfoTag">
				<u-form-item label="账号" prop="login" label-width="150" requird v-if="loginType === 'login'">
					<u-input v-model="form.login" placeholder="请输入手机号/邮箱/昵称"/>
				</u-form-item>
				<u-form-item label="昵称" prop="name" label-width="150" requird v-if="loginType !== 'login'">
					<u-input v-model="form.name" placeholder="2-10个字符"/>
				</u-form-item>
				<u-form-item label="电话" prop="puone" label-width="150" requird v-if="loginType === 'phone'">
					<u-input v-model="form.phone" placeholder="请输入11位手机号"/>
				</u-form-item>
				<u-form-item label="邮箱" prop="email" label-width="150" requird v-if="loginType === 'email'">
					<u-input v-model="form.email" placeholder="请输邮箱"/>
				</u-form-item>
				<u-form-item label="验证码" prop="code" label-width="150" requird v-if="loginType !== 'login'">
					<u-input v-model="form.code" placeholder="请输入4位验证码" type="text"/>
					<u-button slot="right" type="success" size="mini" @click="getCode">获取验证码</u-button>
				</u-form-item>
				
				<u-form-item label="密码" prop="password" label-width="150" requird >
					<u-input v-model="form.password" type="password" placeholder="4-20个字符,区分大小写"/>
				</u-form-item>
				<u-form-item label="重复密码" prop="password" label-width="150" requird v-if="loginType !== 'login'">
					<u-input v-model="form.repassword" type="password" placeholder="再次输入密码"/>
				</u-form-item>
				<view class="btns">
					<u-button class="ubtn" @click="submit">提交</u-button>
					<u-button class="ubtn" @click="cancel">取消</u-button>
				</view>
				<view class="type">
					<u-subsection active-color="#007cba" font-size="24" height="52" :list="subsectionList" :current="0" @change="sectionChange"></u-subsection>
				</view>
			</u-form>
			<view class="serve-info">点击登录/注册前端论坛，即表示已阅读并同意</view>
			<view class="serve-text">
				<view @tap="gotoWeb('https://uniapp.dcloud.io/component/mp-weixin-plugin')">《隐私政策》</view>
				<view @tap="gotoWeb('https://developers.weixin.qq.com/miniprogram/dev/framework')">《用户协议》</view>
			</view>
		</view>
	</view>
</template>

<script>
	//引入vuex （computed和method也要同步展开）
	import{
		mapState,
		mapActions,
	}from 'vuex'
	export default{
		data(){
			return{
				//当前组件是否显示
				show:true,
				//是否需要获取微信的相关信息
				getUserInfoTag:true,
				//登录、手机注册、邮箱注册的分类
				loginType:'login',
				//登录方式选择器
				subsectionList:[
					{name:'账号登录'},
					{name:'手机注册'},
					{name:'邮箱注册'}
				],
				//表单输入的内容
				form:{
					login:'',
					avatar:'',
					name:'',
					phone:'',
					email:'',
					code:'',
					password:'',
					repassword:''
				},
				//输入校验规则
				rules:{
					login:[
						{
							validator:(rule,value,callback) =>{
								if(this.loginType === 'login'){
									return !this.$u.test.isEmpty(value)
								}else{
									return true
								}
							},
							message:'必填*内容不许为空',
							trigger:['change','blur']
						}
					],
					name:[
						{
							asyncValidator:(rule,value,callback) =>{
								this.$u.api.findUser({name:value}).then(res =>{
									//如果验证不通过,需要在callback()中抛出new Error('错误提示')
									if(!!value && res.statusCode === 200){
										callback(new Error('当前用户昵称不存在'));
									}else{
										//如果通过,也要执行callback()回调
										callback();
									}
								})
							},
							trigger:['blur']
						}
					],
					phone:[
						{
							asyncValidator:(rule,value,callback) =>{
								this.$u.api.findUser({name:value}).then(res =>{
									//如果验证不通过,需要在callback()中抛出new Error('错误提示')
									if(!!value && res.statusCode === 200){
										callback(new Error('当前电话已注册'));
									}else{
										callback();
									}
								})
							},
							trigger:['blur']
						}
					],
					email:[
						{
							asyncValidator:(rule,value,callback) =>{
								this.$u.api.findUser({name:value}).then(res =>{
									//如果验证不通过,需要在callback()中抛出new Error('错误提示')
									if(!!value && res.statusCode === 200){
										callback(new Error('当前用eami已被注册'));
									}else{
										//如果通过,也要执行callback()回调
										callback();
									}
								})
							},
							trigger:['blur']
						}
					],
					code:[
						{
							validator:(rule,value,callback) =>{
								if(this.loginType !== 'login'){
									return value =='8888'
								}else{
									return true
								}
							},
							message:'必填*内容不许为空',
							trigger:['change','blur']
						}
					],
					password:[
						{
							required:true,
							min:4,
							max:20,
							message:'必填 * 请输入4-20 位密码',
							trigger:['change','blur']
						}
					],
					repassword:[
						{
							validator:(rule,value,callback) =>{
								if(this.loginType === 'login' || this.form.password === value){
									return true
								}else{
									return false
								}
							},
							message:'必填*两次密码不一致',
							trigger:['change','blur']
						}
					],
				}
			}
		},
		computed:{
			...mapState(['loginState','userInfo'])
		},
		//必须要在onready生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady(){
			this.$refs.uForm.setRules(this.rules);
		},
		async created(){
			//每次这个组件展开，就去判断一下当前token是否可以获取新的token，如果可以获取，就关闭登录状态
			let res = await this.$u.api.getUserMsg()
			console.log(res)
			//点赞消息数量
			if(res.statusCode === 200){
				this.show = false
				return
			}else{
				this.show = true
			}
			wx.getSetting({
				success: res =>{
					// console.log(res.authSetting)
					if(res.authSetting["scope.userInfo"]){
						uni.getUserProfile({
					        desc:'微信登录',
							success: res => {
								console.log(res)
								console.log(111)
								//如果用户授权了，我们就直接调用一些关键信息，避免用户过多操作
								this.form.avatar = res.userInfo.avatarUrl
								this.form.name = res.userInfo.nickName
								this.form.login = res.userInfo.nickName
								this.getUserInfoTag = false
							},
							fail:()=>{
								console.log('用户未授权')
							}
						})
					}
				}
			})
		},
		methods:{
			...mapActions(['userLoginAction','userLogoutAction']),
			//点击关闭登录注册组件
			openLogin(){
				this.show = true
			},
			closeLogin(){
				this.show = false
			},
			//微信手动授权获取用户信息
			getWechatUserInfo(){
				uni.getUserProfile({
					desc:'微信登录',
					success: res =>{
						// console.log(222)
						console.log(res)
						//如果用户授权了，我们就直接调用一些关键信息，避免用户过多操作
						this.form.avatar = res.userInfo.avatarUrl
						this.form.name = res.userInfo.nickName
						this.form.login = res.userInfo.nickName
						this.getUserInfoTag = false
						
					},
					fail:()=>{
						// console.log('用户未授权')
					}
				})
			},
			//切换登录注册方式
			sectionChange(index){
				switch(index){
					case 1 : this.loginType = "phone";break;
					case 2 : this.loginType = "email";break;
					default : this.loginType = "login";break;
				}
			},
			//点击获取验证码
			getCode(){
				uni.showModal({
					title:'验证码',
					content:'8888'
				})
			},
			//
			gotoWeb(url){
				wx.navigateTo({
					url:'/pages/webview/webview?url=' + encodeURI(url)
				})
			},
			//取消输入内容
			cancel(){
				this.form={
					login:'',
					avatar:'',
					name:'',
					phone:'',
					email:'',
					code:'',
					password:'',
					repassword:''
				}
			},
			//提交按钮
			submit(){
				this.$refs.uForm.validate( async valid =>{
					if(!valid){
						uni.showToast({
							titile:'请检查输入'
						})
						return
					}
					switch(this.loginType){
						case 'login':{
							let resa = await this.$u.api.userLogin({
								login:this.form.login,
								password:this.form.password
							})
							if(resa.statusCode === 200){
								this.loginAfter(resa.data.access_token)
								
							}else{
								uni.showModal({
									title:'登录失败',
									content:resa.data.message
								})
							}
							break;
						}
						case 'phone':{
							let resb = await this.$u.api.userRegister({
								//必须。用户名
								name:this.form.name,
								//必须。验证码发送模式
								verifiable_type:'sms',
								//必须。用户收到的验证码（教学期间统一8888）
								verifiable_code:'8888',
								//如果 verifiable_type 为'sms' 则必须，手机号码
								phone:this.form.phone,
								//可选。密码，如果不输入密码允许用户无密码注册
								password:this.form.password
							})
							if(resb.statusCode === 201){
								//登录成功
								this.loginAfter(resb.data.token)
							}else{
								uni.showModal({
									title:'登录失败',
									content:resb.data.message
								})
							}
							break;
						}
						case 'email':{
							let resc = await this.$u.api.userRegister({
								//必须。用户名
								name:this.form.name,
								//必须。验证码发送模式
								verifiable_type:'mail',
								//必须。用户收到的验证码（教学期间统一8888）
								verifiable_code:'8888',
								//如果 verifiable_type 为'sms' 则必须，手机号码
								phone:this.form.email,
								//可选。密码，如果不输入密码允许用户无密码注册
								password:this.form.password
							})
							if(resc.statusCode === 201){
								//登录成功
								this.loginAfter(resc.data.token)
							}else{
								uni.showModal({
									title:'登录失败',
									content:resc.data.message
								})
							}
							break;
						 }
						    
						default:{
							uni.showToast({
								title:'未知用户',
								icon:'losding'
							})
							break;
						}
						
					}
				})
			},
			//登录成功以后要干的事情
			async loginAfter(token){
				//登录成功
				this.show = false
				//保存token
				uni.setStorageSync('token',token)
				//获取当前用户的通知消息
				let res = await this.$u.api.getUserMsg()
				
				let name = this.form.name
				if(this.loginType === 'login'){
					name = this.form.login
				}
				
				uni.$emit('meUserLogin')
				uni.$emit('indexUserLogin')
				
				//Vuex保存登录状态
				this.userLoginAction({
					name:this.form.login,
					avatar:this.form.avatar,
					like:res.data.user.liked,
					commented:res.data.user.commented
				})
			}
			
		}
	}
</script>


<style lang="scss" scoped>
	.login{
		position:fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: flex-end;
		opacity: 0;
		transition: opacity 300,z-index 0 300;
		pointer-events: none;
		z-index: 999;
		&.show{
			z-index: 9999;
			opacity: 1;
			pointer-events: auto;
		}
		.mask{
			position: fixed;
			width: 100%;
			height: 100%;
			background-color: rgba($color:#000000, $alpha:0.3);
		}
		.container{
			z-index: 999;
			display: flex;
			flex-direction: column;
			width: 100%;
			padding: 40upx 20upx;
			background-color: #f1f1f1;
			align-items: center;
			position: relative;
		}
		.p-name{
			margin-top: 45upx;
			font-size: 36upx;
			font-weight: normal;
		}
		.close-box{
			position: absolute;
			right: 32upx;
			top: 38upx;
			width: 56.56upx;
			height: 56.56upx;
			padding: 10upx;
			.close-img{
				width: 100%;
				height: 100%;
				
			}
		}
	}
	.container{
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 28upx;
		.logo-wrap{
			width: 144upx;
			height: 144upx;
			overflow: hidden;
			border-radius: 20upx;
			.logo{
				width: 100%;
				height: 100%;
			}
		}
		.info{
			color: #333;
		}
		.submit-btn{
			width: 642upx;
			height: 88upx;
			margin-top: 60upx;
			margin-bottom: 60upx;
			border-radius: 44upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			color: #fff;
			background-color: #0046f5;
			font-size: 36upx;
			.wechat-img{
				width: 44upx;
				height: 34upx;
				margin: 0 18upx;
			}
		}
		.phone-login{
			color: #0046f5;
			font-size: 28upx;
			margin-top: 60upx;
			border: none;
			background-color: #f1f1f1;
		}
		.cancel-btn{
			width: 100%;
			margin-top: 60upx;
			color: #333;
			background-color: #f1f1f1;
		}
		.serve-info{
			font-size: 22upx;
			margin-top: 20upx;
		}
		.serve-text{
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			font-size: 22upx;
			color: #6079b8;
			margin-top: 10upx;
		}
	}
	button::after{
		border: none;
	}
	.btns{
		margin-top: 20upx;
		align-items: center;
		.ubtn{
			display: inline-block;
			margin: 0 20upx;
		}
	}
	.type{
		margin-top: 80upx;
	}
</style>
