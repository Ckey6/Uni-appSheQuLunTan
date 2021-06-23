<template>
	<view class="rfeeds">
			<view class="one-feeds-box" v-for=" (feedsList, i) in showArrList " :key="i">
				<view v-for=" (item, k) in feedsList " :key="item.id" class="one-feed" 
					:class="k % 6 == 0 ? ( i%2==0 ? 'feed-big-left' :'feed-big-right' ) : '' ">
					<navigator :url=" '/subpages/feedinfo/feedinfo?id=' + item.id ">
						<image :src="item.cover" class="feed-content" mode="aspectFill" :lazy-load="true" />
					</navigator>
				</view>
			</view>
			<!-- 分享组件 -->
			<goto-share />
		</view>
</template>

<script>
	export default {
		data() {
			return {
				feedsList:[],
				showArrList:[]
			}
		},
		onLoad(){
			this.getFeeds()
			
			//用户发布动态后触发数据更新
			uni.$on('feedsUpdate',()=>{
				this.feedsList = []
				this.getFeeds()
			})
		},
		methods: {
			async getFeeds(){
				let res = await this.$u.api.getFeeds()
				let feeds = [...res.data.feeds,...res.data.feeds,...res.data.feeds]
				// console.log(feeds)
				let feedList = feeds.map(item => {
					return {
						id: item.id,
						cover: this.BaseFileURL + item.images[0].file
					}
				})
				if(feedList.length > 5){
					this.feedsList = [...feedList,...this.feedsList]
					let showArrList = []
					for(let i=0;i<this.feedsList.length;i++){
						if(i%6==0 && !!this.feedsList[i+5]){
							//slice截取一个新的数组，不包含第I+6个元素，不改变新数组
							showArrList.push(this.feedsList.slice(i,i+6))
						}
					}
					this.showArrList = showArrList
				}else{
					uni.showToast({
						titile:'滚动到底了，没数据了！',
						icon:'success',
						duration:1000
					})
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.rfeeds {
		background-color: #FFFFFF;
		padding-bottom: 20upx;

		.one-feeds-box {
			width: 704upx;
			margin: 4upx 22upx 0 22upx;
			// 定义栅格布局
			display: grid;
			// 定义栅格每一列的宽度
			grid-template-columns: 232upx 232upx 232upx;
			// 定义栅格每一行的高度
			grid-template-rows: 232upx 232upx 232upx;
			// grid-row-gap属性设置行与行的间隔（行间距），grid-column-gap属性设置列与列的间隔（列间距）
			grid-row-gap: 4upx;
			grid-column-gap: 4upx;
			background-color: #DADADA;

			.one-feed {
				position: relative;

				.feed-content {
					width: 232upx;
					height: 232upx;
					border: 1px solid #EEEEEE;
					border-radius: 4upx;
				}

				.icon {
					position: absolute;
					right: 10upx;
					top: 10upx;

					.play-icon {
						width: 40upx;
						height: 40upx;
					}
				}

				&.feed-big-left {
					grid-column-start: 1;
					grid-column-end: 3;
					grid-row-start: 1;
					grid-row-end: 3;
					background-color: #DADADA;

					.feed-content {
						width: 466upx;
						height: 466upx;
						border: 1px solid #EEEEEE;
					}
				}

				&.feed-big-right {
					grid-column-start: 2;
					grid-column-end: 4;
					grid-row-start: 1;
					grid-row-end: 3;
					background-color: #DADADA;

					.feed-content {
						width: 466upx;
						height: 466upx;
						border: 1px solid #EEEEEE;
					}
				}
			}
		}
	}
</style>
