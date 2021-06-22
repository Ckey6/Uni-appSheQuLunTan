<template>
	<view>
		<!-- 评论列表 -->
		<view class="comments">
			<view class="titile gohere" id="gohere" ref="gohere">最新评论</view>
			<view class="no-comment" v-if="commintList.length == 0">暂无评论</view>
			<view class="one-comment" v-for="(commentItem,index) in commintList" :key="index">
				<!-- 一级评论相关 -->
				<view class="commenter">
					<view class="info">
						<view class="left">
							<u-avatar class="avatar" size="50" :src="!!commentItem.user.avatar ? commentItem.user.avatar.url : '' " />
							<view class="name">{{commentItem.user.name}}</view>
						</view>
					</view>
					<view class="comment">{{commentItem.body}}</view>
					<view class="uptime">{{commentItem.created_at | timeFormate}}</view>
				</view>
			</view>
		</view>
		
		<!-- 底部信息 -->
		<view class="tab-bar">
			<view class="minput" @tap="openComment">说点什么</view>
			<view class="mview">
				<!-- 点赞相关统计 -->
				<view class="mbtn" @tap="sendLove">
					<image class="micon" v-if=" type=='new' " :src="oneInfoClone.has_like ? '/static/lover.png' : '/static/love.png'" mode="aspectFill"></image>
					<text class="mtext" v-if=" type=='new' && oneInfoClone.digg_count > 0 ">{{oneInfoClone.digg_count}}</text>
					<text class="mtext" v-if=" type=='new' && oneInfoClone.digg_count <= 0 ">点赞</text>
					
					<image class="micon" v-if=" type=='feed' " :src="oneInfoClone.has_like ? '/static/lover.png' : '/static/love.png'" mode="aspectFill"></image>
					<text class="mtext" v-if=" type=='feed' && oneInfoClone.like_count > 0 ">{{oneInfoClone.like_count}}</text>
					<text class="mtext" v-if=" type=='feed' && oneInfoClone.like_count <= 0 ">点赞</text>
				</view>
				<!-- 评论相关统计 -->
				<view class="mbtn" @tap="gotoComment">
					<image class="micon" src="/static/msg.png" mode="aspectFill"></image>
					<text class="mtext" v-if="type=='new' && oneInfoClone.comment_count>0 ">{{oneInfoClone.comment_count}}</text>
					<text class="mtext" v-if="type=='new' && oneInfoClone.comment_count<=0">评论</text>
												   
					<text class="mtext" v-if="type=='feed' && oneInfoClone.feed_comment_count>0">{{oneInfoClone_comment_count}}</text>
					<text class="mtext" v-if="type=='feed' && oneInfoClone.feed_comment_count<=0">评论</text>
				</view>
				<!-- 转发次数统计 -->
				<button class="mbtn" open-type="share">
					<image class="micon" src="/static/wx.png" mode="aspectFill"></image>
					<text class="mtext">分享</text>
				</button>
			</view>
		</view>
		<!-- 发布评论 -->
		<view class="commentBox" v-if = "showCommentBox">
			<view class="header">
				<text class="title">发表评论</text>
				<u-icon class="icon" name="arrow-down-fill" color="#999" sizi="28" @tap="closeComment" />
			</view>
			<textarea class="texta" placeholder-style="colo:#888" placeholder="想说点什么..." cursor-spacing="150" :focus="true" :fixed="true" :value="cinput" @input="getInput" />
			<view class="btns">
				<button class="mini-btn" type="primary" size="mini" @tap="sendComment" :disabled="disableSendCommentTag">发布</button>
				<button class="mini-btn" type="default" size="mini" @tap="closeComment" >取消</button>
			</view>
		</view>
		
	</view>
</template>

<script>
	//引入时间格式化工具
	import timeFrom from '@/tools/timeFrom.js'
	
	import {
		mapState,
		mapActions
	} from 'vuex'
	import feedMixin from '@/mixins/todoFeed.js'
	
	export default {
		mixins: [feedMixin],
		props:{
			info:Object,
			type:String
		},
		data() {
			return {
				commintList:[],
				oneInfoClone:{},
				//评论输入框是否展开
				showCommentBox:false,
				//记录输入的内容
				cinput:'',
				//是否允许点发布
				disableSendCommentTag:true
			}
		},
		computed: {
			...mapState(['loginState', 'userInfo'])
		},
		created(){
			this.oneInfoClone = this.info
			// console.log(this.oneInfoClone)
			this.getComments()
			// console.log(this.commintList)
			
			
		},
		watch:{
			// info(newVal,oldVal){
			// 	this.oneInfoClone = this.info
			// 	this.getComments()
			// 	console.log(oldVal)
			// }
		},
		methods: {
			//点赞
			async sendLove(){
				// 判断当前登录状态
				if (!this.loginState) {
					this.$refs.login.openLogin()
					return
				}
				if (this.type === "feed") {
					this.clickLove(this.oneInfoClone)
				}else{
					// 资讯点赞
					if (this.oneInfoClone.has_like) {
						--this.oneInfoClone.digg_count;
						this.oneInfoClone.has_like = false;
						await this.$u.api.unlikeThisNew({
							id: this.oneInfoClone.id,
						});
						uni.showToast({
							title: "取消点赞",
							icon: "success",
							duration: 1000,
						});
					} else {
						++this.oneInfoClone.digg_count;
						this.oneInfoClone.has_like = true;
						await this.$u.api.likeThisNew({
							id: this.oneInfoClone.id,
						});
						uni.showToast({
							title: "点赞成功",
							icon: "success",
							duration: 1000,
						});
					}
				}
			},
			//获取评论列表
			async getComments(){
				if(this.type === 'feed'){
					let feedRes = await this.$u.api.getFeedComments({id:this.oneInfoClone.id})
					this.commintList = feedRes.data.comments
				}else{
					let newRes = await this.$u.api.getNewComments({id:this.oneInfoClone.id})
					this.commintList = newRes.data.comments
				}
			},
			//打开评论输入窗口
			openComment(){
				this.showCommentBox = true
			},
			closeComment(){
				this.showCommentBox = false
			},
			//点击后跳转到指定位置
			gotoComment(){
				const query = uni.createSelectorQuery().in(this);
				query.select('#gohere').boundingClientRect(data =>{
					uni.pageScrollTo({
						duration:500,
						scrollTop:data.top
					})
				}).exec();
			},
			//监听用户输入的内容
			getInput(e){
				this.cinput = e.detail.value
				if(!this.cinput){
					this.disableSendCommentTag = true
				}else{
					this.disableSendCommentTag = false
				}
			},
			//发布评论
			async sendComment(){
				//发送状态判定
				if(this.disableSendCommentTag) return
				this.disableSendCommentTag = true
				if(this.type === 'feed'){
					await this.$u.api.commentOneFeed({
						id:this.oneInfoClone.id,
						body:this.cinput
					});
					++this.oneInfoClone.feed_comment_count
					//通知个人中心当前动态评论增加
					uni.$emit('myFeedCommentChange',this.oneInfoClone)
				}else{
					await this.$u.api.commentOneInfo({
						id:this.oneInfoClone.id,
						body:this.cinput,
					});
					++this.oneInfoClone.comment_count
				}
				uni.showToast({
					title:"评论成功",
					icon:"success",
					duration:1000
				});
				this.cinput = ''
				this.closeComment()
				this.getComments()
			}
		},
		filters:{
			timeFormate(timeDate){
				return timeFrom( (new Date(timeDate)).getTime(), 'yyyy年mm月dd日' )
			}
		}
	}
</script>

<style lang="scss" scoped>
.comments{
	padding: 20upx 20upx 100upx;
	.titile{
		font-weight: bolder;
		font-size: 32upx;
		margin-bottom: 40upx;
	}
	.no-comment{
		text-align: center;
		margin: 120upx 0 280upx;
		color: #666;
	}
	.one-comment{
		&.last-comment{
			border-bottom: none;
		}
		.comenter{
			.info{
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;
				align-items: center;
				margin-top: 20upx;
			}
			.avatar{
				margin-right:20upx;
				margin-top: 10upx;
			}
			.name{
				font-size: 24upx;
				font-weight: bolder;
				color: #1f2046;
			}
		}
	}
	.conment{
		color: #666;
		font-size: 30upx;
		line-height: 50upx;
		margin-left: 70upx;
		margin-top: 10upx;
		padding-right: 20upx;
	}
	.uptime{
		color: #999;
		font-size: 20upx;
		margin-left: 70upx;
		margin-top: 10upx;
		padding-bottom: 20upx;
		border-bottom: 1upx solid #f2f2f2;
	}
}

.tab-bar{
	// 28:55
	position: fixed;
	width: 750upx;
	height: 120upx;
	left: 0;
	bottom: 0;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	align-content: center;
	color: #ccc;
	border-bottom: 1upx solid #f6f6f6;
	background-color: #fff;
	.minput{
		background-color: #eee;
		height: 60upx;
		width: 300upx;
		border-radius: 30upx;
		padding-left: 30upx;
		margin-left: 20upx;
		line-height: 60upx;
		color: #aaaaaa;
		font-size: 22upx;
	}
	.mview{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
		align-items: center;
		color: #ccc;
		margin-right: 25upx;
		.mbtn{
			display: flex;
			flex-direction: row;
			justify-content: center;
			flex-wrap: nowrap;
			align-items: center;
			align-content: center;
			width: 120upx;
			background-color: #fff;
			padding: 0;
			
			&.mhare{
				width: 150upx;
			}
		}
		.mbtn::after{
			border: none;
			background-color: none;
		}
		.micon{
			width: 36upx;
			height: 36upx;
		}
		.mtext{
			color: #001432;
			font-size: 24upx;
			margin: 10upx;
		}
	}
}
.commentBox{
	position: fixed;
	width: 750upx;
	height: 450upx;
	left: 0;
	bottom: 0;
	border-top: 1upx solid #eee;
	background-color: #fafafa;
	.header{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		align-content: center;
		padding: 20upx 15upx 20upx 25upx;
		.title{
			color: #999;
			font-size: 28upx;
			font-weight: bold;
		}
		.icon{
			padding: 20upx;
		}
	}
	.texta{
		width: 600upx;
		height: 200upx;
		margin-left: 50upx;
		padding: 10px 25upx;
		border: 1upx solid #ddd;
		border-radius: 10upx;
		background: #fff;
		font-size: 28upx;
	}
	.btns{
		width: 650upx;
		margin-left: 50upx;
		margin-top: 15upx;
		text-align: right;
		.mini-btn{
			margin-left: 40upx;
		}
	}
}
</style>
