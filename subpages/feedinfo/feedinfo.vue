<template>
	<view v-if="getRequestOk">
		<view class="feed-user">
			<u-avatar size="60" class="avatar" :src=" feedInfo.avatar" />
			<view class="info">
				<text>{{ feedInfo.name }}</text>
			</view>
		</view>
		<view class="feed-info">
			<view class="title" v-if="!!feedInfo.feed_content">{{ feedInfo.feed_content }}</view>
			<image class="feed-imgs" mode="widthFix" v-for="(image, index) in feedInfo.images" :key="index" :src="image" @tap="previewImage(index)"/>
			<view class="other">
				<text>{{ feedInfo.created_at | timeFormate }}发布 {{ feedInfo.feed_comment_count }}阅读 {{ feedInfo.like_count }}点赞</text>
				<u-icon class="micon" name="more-dot-fill" color="#888" size="40"/>
			</view>
		</view>
		<view class="line" />
		<!-- 调用评论组件 -->
		<comment :info="feedInfo" type="feed"/>
	</view>
</template>

<script>
	//引入时间格式化工具
	import timeFrom from '@/tools/timeFrom.js'
	//导入评论组件
	import comment from '@/components/comment/comment/comment.vue'
	export default {
		data() {
			return {
				//数据是否请求成功
				getRequestOk:false,
				feedInfo:{}
			}
		},
		components:{
			comment
		},
		async onLoad(options){
			
			// #ifdef MP-WEIXIN
			//分享到朋友圈、群组
			wx.showShareMenu({
				withShareTicket:true,
				menus:['shareAppMessage','shareTimeline']
			})
			// #endif
			
			let res = await this.$u.api.getFeedInfo(options)
			// console.log(res)
			let images = res.data.images.map( item => this.BaseFileURL + item.file)
			this.feedInfo = {
				...res.data,
				// id: res.data.id,
				name: res.data.user.name,
				avatar: res.data.user.avatar ? res.data.user.avatar.url : '/static/nopic.png',
				// created_at: res.data.created_at,
				// feed_content: res.data.feed_content,
				images,
				// feed_comment_count: res.data.feed_comment_count,
				// like_count: res.data.like_count
			}
			this.getRequestOk = true
			// console.log(this.feedInfo.created_at)
		},
		
		methods: {
			//动态图片预览
			previewImage(current){
				uni.previewImage({
					current,
					urls: this.feedInfo.images
				})
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
.feed-user {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
  margin: 20upx 0 0 25upx;
  .info {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: left;
    margin-left: 20upx;
    font-size: 24upx;
	font-weight: bolder;
	color: #1f2046;
  }
}

.feed-info {
  width: 700upx;
  margin-top: 20upx;
  margin-left: 25upx;
  text-align: center;
  padding-bottom: 10upx;

  .title {
    font-size: 32upx;
    margin-bottom: 30upx;
    text-align: left;
    line-height: 52upx;
	color: #666;
  }

  .feed-imgs {
    margin: 5upx 0;
    width: 100%;
  }
  .other{
  	display: flex;
  	flex-direction: row;
  	flex-wrap: wrap;
  	justify-content: space-between;
  	align-items: center;
  	align-content: center;
  	padding: 40upx 0 20upx;
  	font-size: 24upx;
  	color: #888;
  	.micon{
  		padding: 10upx 20upx;
  	}
  }
}
.line{
	height: 30upx;
	width: 750upx;
	background-color: #f3f3f3;
}
</style>