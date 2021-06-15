<template>
	<view id="index">
		<view class="header-box">
			<swiper class="swiper" :indicator-dots="false" :autoplay="true" :interval="2500" :duration="500">
				<swiper-item v-for="item in swiperAdList" :key="item.id">
					<navigator open-type="navigate" :url=" '/pages/webview/webview?url='+item.link">
						<image class="banner-swiper-img" :src="item.image" mode="aspectFill" />
					</navigator>
				</swiper-item>
			</swiper>
			<!-- 遮罩使用弧形框 -->
			<image class="crile" src="@/static/crile.png" mode="aspectFill" />
			<!-- 两个选项按钮 -->
			<view class="card-header">
				<view class="card-one card-left">
					<image class="img" src="@/static/coffee.png" mode="aspectFill" />
					<view class="iright">
						<view class="title">新鲜事</view>
						<view class="iview">88个分享</view>
					</view>
				</view>
				<view class="card-one card-right">
					<image class="img" src="@/static/ran.png" mode="aspectFill" />
					<view class="iright">
						<view class="title">活动墙</view>
						<view class="iview">
							100人参与
						</view>
					</view>
				</view>
			</view>
			<!-- Tab 选项卡 -->
			<view class="tabs-box">
				<view class="one-nav" :class="currentSwiperIndex === 0 ? 'nav-actived' : '' " @tap="swiperChange(0)">推荐</view>
				<view class="one-nav" :class="currentSwiperIndex === 1 ? 'nav-actived' : '' " @tap="swiperChange(1)">资讯</view>
			</view>
			
		</view>
		<!-- 内容轮播导航实现 -->
		<swiper  class="swiper-box" style="height:1015px" :current="currentSwiperIndex" @animationfinish="swiperSlider">
			<!-- 推荐动态实现 -->
			<swiper-item class="swiper-item">
				<view class="page-item sns-now">
					<view class="feeds-box">
						<u-waterfall v-model="feedsList" ref="uWaterfall">
							<template v-slot:left="{leftList}">
								<view class="feed-one" v-for="(item, index) in leftList" :key="index">
									<a>
										<image class="feed-img" :src="item.cover" mode="aspectFill" :lazy-load="true" />
										<view class="u-line-2 feed-title" v-if="!!item.feed_content">{{ item.feed_content }}</view>
										<view class="feed-info">
											<view class="iview">
												<image class="avatar" :src=" item.avatar" />
												<text class="name u-line-1">{{ item.name }}</text>
											</view>
											<view class="iview">
												<view class="ilike">
													<image v-if="item.has_liked" src="@/static/lover.png" class="micon" />
													<image v-else src="@/static/love.png" class="micon" />
													<text class="love-count" v-if="item.like_count>0">{{ item.like_count }}</text>
												</view>
											</view>
										</view>
									</a>
								</view>
							</template>
							<template v-slot:right="{rightList}">
								<view class="feed-one" v-for="(item, index) in rightList" :key="index">
									<a>
										<image class="feed-img" :src="item.cover" mode="aspectFill" :lazy-load="true" />
										<view class="u-line-2 feed-title" v-if="!!item.feed_content">{{ item.feed_content }}</view>
										<view class="feed-info">
											<view class="iview">
												<image class="avatar" :src=" item.avatar" />
												<text class="name u-line-1">{{ item.name }}</text>
											</view>
											<view class="iview">
												<view class="ilike">
													<image v-if="item.has_liked" src="@/static/lover.png" class="micon" />
													<image v-else src="@/static/love.png" class="micon" />
													<text class="love-count" v-if="item.like_count>0">{{ item.like_count }}</text>
												</view>
											</view>
										</view>
									</a>
								</view>
							</template>
						</u-waterfall>
					</view>
				</view>
			</swiper-item>
			<!-- 资讯列表实现 -->
			<swiper-item class="swiper-item sns-news">
				<view v-for="(item, index) in newsList" :key="index">
					<a class="one-new">
						<view class="left">
							<view class="title u-line-2">{{item.title}}</view>
							<view class="uinfo">
								<view class="iview">
									<view class="utime">
										<text class="name">{{ item.author }}</text>
									</view>
								</view>
								<text class="uptime">{{ item.created_at }}发布</text>
							</view>
						</view>
						<view class="right">
							<image class="pic" mode="aspectFill" :src="item.cover" />
						</view>
					</a>
				</view>
			</swiper-item>
		</swiper>
		
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				//顶部轮播图列表 
				swiperAdList:{},
				//推荐列表数据
				feedsList:[],
				//资讯列表数据
				newsList:[],
				currentSwiperIndex:0
			}
		},
		async onLoad() {
			let Adverts = await this.$u.api.getAdvert()
				this.swiperAdList = Adverts.data.map(item=>{
					return {
						id:item.id,
						link:item.data.link,
						image:item.data.image,
					}
				})
				
			let feeds = await this.$u.api.getFeeds()
				this.feedsList = feeds.data.feeds.map(item => {
					return {
						cover: this.BaseFileURL + item.images[0].file,
						feed_content: item.feed_content,
						avatar: !!item.user.avatar ? item.user.avatar.url : '/static/nopic.png',
						name: item.user.name,
						has_liked: item.has_liked,
						like_count: item.like_count
					}
				})
				
			let news = await this.$u.api.getNews()
				this.newsList = news.data.map(item =>{
					return{
						title: item.title,
						author: item.author,
						created_at: item.created_at,
						cover: this.BaseFileURL + item.image.id
					}
				})
			
			
		},
		methods: {
			//资讯和推荐页面左右滑动时的效果
			swiperSlider(event){
				// console.log(event.detail.current);
				this.currentSwiperIndex = event.detail.current
			},
			//点击资讯和推荐切换分页
			swiperChange(index){
				this.currentSwiperIndex = index
			}
		}
	}
</script>

<style lang="scss" scoped>
	#sns {
			background-color: #F9F9F9;
		}
		.header-box {
			position: relative;
			left: 0;
			height: 500upx;
		
			// 广告位轮播器相关样式
			.swiper {
				width: 750upx;
				height: 400upx;
				position: absolute;
				left: 0;
				top: 0;
				text-align: center;
				z-index: 1;
				.banner-swiper-img {
					width: 750upx;
					height: 400upx;
					box-shadow: 0 0 2px 0 rgb(188, 188, 188);
				}
			}
		
			.crile {
				width: 750upx;
				height: 50upx;
				position: absolute;
				left: 0;
				top: 355upx;
				z-index: 9;
			}
		
			// 新鲜事 活动墙 按钮样式
			.card-header {
				position: absolute;
				left: 0;
				top: 320upx;
				height: 160upx;
				z-index: 99;
				width: 710upx;
				margin-left: 20upx;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;
				align-items: center;
				align-content: center;
		
				.card-one {
					width: 328upx;
					height: 96upx;
					border-radius: 49upx;
					background-color: #fff;
					margin: 0 10upx;
					box-shadow: 0 0 2px 0 rgb(188, 188, 188);
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: flex-start;
					align-items: center;
					align-content: center;
					.img {
						width: 44upx;
						height: 44upx;
						margin-left: 50upx;
					}
					.iright {
						margin-left: 30upx;
						text-align: left;
						color: #888;
						.title {
							margin-top: 5upx;
							font-size: 30upx;
							color: #001432;
						}
		
						.iview {
							display: flex;
							flex-direction: row;
							flex-wrap: wrap;
							justify-content: space-between;
							align-items: center;
							align-content: center;
							font-size: 20upx;
							margin-top: -5upx;
						}
					}
				}
			}
			// 推荐、咨询 按钮样式
			.tabs-box {
				width: 750upx;
				position: absolute;
				left: 0;
				top: 480upx;
				display: flex;
				flex-direction: row;
				justify-content: center;
				
				.one-nav {
					height: 80upx;
					width: 110upx;
					color: #9B9B9B;
					font-size: 36upx;
					text-align: center;
					font-weight: blod;
					&.nav-actived {
						color: #0050FF;
					}
				}
			}
		}
		
		// 此刻 栏目样式\
		.swiper-box{
			margin-top: 60upx;
		}
		.sns-now {
			// 动态相关瀑布流样式
			.feeds-box {
				width: 735upx;
				margin-left: 13upx;
				padding-bottom: 20upx;
				
				.feed-one {
					width: 358upx;
					margin-bottom: 12upx;
					background-color: #FFF;
					border-radius: 10upx;
				
					position: relative;
				
					.feed-img {
						width: 358upx;
						border-radius: 10upx 10upx 0 0;
						height: 488upx;
						&.h-img {
							height: 488upx;
						}
				
						&.w-img {
							height: 358upx;
						}
					}
				
					.feed-title {
						width: 350upx;
						margin-top: 15upx;
						margin-left: 10upx;
						font-size: 28upx;
						line-height: 40upx;
						color: #001432;
						text-align: left;
					}
				
					.feed-info {
						display: flex;
						flex-direction: row;
						flex-wrap: nowrap;
						justify-content: space-between;
						align-items: center;
						align-content: center;
						margin-top: 10upx;
						font-size: 20upx;
						color: #666;
						padding: 0 10upx 16upx;
				
						.iview {
							display: flex;
							flex-direction: row;
							flex-wrap: nowrap;
							justify-content: space-between;
							align-items: center;
							align-content: center;
							.ilike {
								display: flex;
								flex-direction: row;
								flex-wrap: nowrap;
								justify-content: space-between;
								align-items: center;
								align-content: center;
								height: 60upx;
								padding: 0 10upx;
								background-color: #FFFFFF;
							}
						}
				
						.avatar {
							margin-right: 10upx;
							height: 40upx;
							width: 40upx;
							border-radius: 50%;
							border: 1upx solid #eee;
						}
				
						.name {
							max-width: 120upx;
							color: #757474;
						}
				
						.micon {
							width: 32upx;
							height: 28upx;
						}
				
						.love-count {
							padding-left: 10upx;
							color: #757474;
						}
					}
				}
			}
		}
		
		// 轮播页面 资讯
		.sns-news {
			background-color: #fff;
			width: 730upx;
			margin-left: 10upx;
			.one-new {
				width: 700upx;
				height: 150upx;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-around;
				align-items: flex-start;
				align-content: center;
				padding-bottom: 14px;
				padding-top: 10upx;
				padding-left: 25upx;
				padding-right: 25upx;
				.left {
					width: 490upx;
					height: 140upx;
					text-align: left;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: flex-start;
					.title {
						font-size: 30upx;
						line-height: 48upx;
						color: #001432;
						margin-top: 20upx;
					}
					.uinfo {
						width: 490upx;
						display: flex;
						flex-direction: row;
						flex-wrap: nowrap;
						justify-content: space-between;
						align-items: center;
						align-content: center;
						margin-top: 10upx;
						font-size: 20upx;
						color: #999;
	
						.utime {
							font-size: 24upx;
	
							.name {
								max-width: 120upx;
								color: #777;
							}
						}
					}
				}
				.right {
					width: 120upx;
					.pic {
						width: 120upx;
						height: 120upx;
						margin-top: 20upx;
						border-radius: 6upx;
					}
				}
			}
		}
</style>
