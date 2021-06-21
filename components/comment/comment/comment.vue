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
	</view>
</template>

<script>
	export default {
		props:{
			oneInfo:Object,
			type:String
		},
		data() {
			return {
				commintList:[]
			}
		},
		async created(){
			//初始化获取数据，最好的生命周期是在created
			if(this.type = 'feed'){
				let feedRes = await this.$u.api.getFeedComments({id:this.oneInfo.id})
				this.commintList = feedRes.data.commnet
			}else{
				let newRes = await this.$u.api.getNewComments({id:this.oneInfo.id})
				this.commintList = newRes.data.commnet
			}
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.comments{
	padding: 20upx;
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
</style>
