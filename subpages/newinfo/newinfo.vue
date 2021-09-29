<template>
	<view v-if="getRequestOK">
		<!-- 顶部导航 -->
		<uni-nav-bar backState="2000" fontColor="#FFF" :titleCenter="false" type="transparent">
			<view slot="left">
				<image class="hicon" src="/static/home.png" mode="aspectFit" @tap="goHome" />
			</view>
		</uni-nav-bar>
		<uni-nav-bar v-if="navBarShow" backState="1000" :titleCenter="false">{{ newInfo.cutTitle }}</uni-nav-bar>


		<!-- 顶部毛玻璃背景图 -->
		<!-- 可选值 xs s m l xl -->
		<pic-blur :params="{
				width:'750rpx',
				height:'520rpx',
				image: newInfo.cover,
				blur:'xs'
			}"></pic-blur>
		<view class="model">
			<!-- 标题 -->
			<view class="mtitle">{{newInfo.title}}</view>
			<view class="info-user">
				<view class="info">
					<text>{{ newInfo.author }} {{ newInfo.created_at | timeFormate }} 发布</text>
				</view>
			</view>
		</view>


		<!-- 资讯详情 -->
		<view class="info-content">
			<html-parse  :content="newInfo.content" />
		</view>
		
		<!-- 作者信息 -->
		<view class="info-header">
			<text class="send">{{ newInfo.created_at | timeFormate }}发布 </text>
			<text>{{ newInfo.hits }}阅读</text>
		</view>

		<view class="line" />
		<comment :info="newInfo" type="new"/>
	</view>
</template>

<script>
	// 引入 时间日期格式化显示函数
	import timeFrom from '@/tools/timeFrom.js'
	// 引入富文本解析组件
	import htmlParse from "@/components/html-parse/parse.vue";
	// 引入毛玻璃组件
	import picBlur from "@/components/pic-blur/pic-blur.vue";
	//导入评论组件
	import comment from '@/components/comment/comment/comment.vue'
	
	export default {
		components: {
			htmlParse,
			picBlur,
			comment
		},
		data() {
			return {
				// 是否显示 navbar
				navBarShow: false,
				// 数据请求状态
				getRequestOK: false,
				// 当前动态详情
				newInfo: {},
			};
		},
		onPageScroll(res) {
			if (res.scrollTop > 100) {
				this.navBarShow = true;
			} else {
				this.navBarShow = false;
			}
		},
		async onLoad(options) {
			// 分享
			wx.showShareMenu({
			  withShareTicket: true,
			  menus: ['shareAppMessage', 'shareTimeline']
			})
			let res = await this.$u.api.getNewInfo(options);
			res = res.data
			
			/* 
				我们用过的 Vue React 这些高阶的框架，当然，还有 JSX 的语法，这些东西看起来很熟悉
				包括其他语言，比如：PHP的smarty 模板引擎这些都是这个道理
				但是呢，我们又觉得很陌生，为什么陌生啊？因为，这些东西给我的感觉不像是 JS 
				但是，它又在执行 JS 的事情，这是怎么做到的呢？
				
				同时，很多面试官经常会问到这样一个问题：你看过 XXX vue 的源码吗？
				
				很多同学可能不知道如何去看这玩意，其实我的建议是：你自己能够感觉到你什么时候适合去看这个源码
				当你觉得你似乎还不适合去看这个源码的时候，你强行去看，可能有些老师一些视频中给到一些窍门
				
				但是，我一直认为这些窍门并不合适！请记住，只有你到了一定的思维高度的时候，你再去做这些事情吧！
				不然，你会感觉到非常迷茫！这个高度是什么呢？是经验！是积累！是一分水到渠成！
				
				我们刚刚遇到了这种 MD 文件，现在我们要做的事情是不是 把 MD 文件 解析成为 html
				这个时候，你有没有又一次的似曾相识的感觉？
				
				我们使用 正则表达式 来匹配解析字符流，输出我们想要的字符流！
				
				很多同学，你若是对正则这样的知识都还不熟悉的话！请你一定不要强行要自己学着什么源码啊什么的
			*/
		   let content = res.content.replace(/@!\[.*\]\((\d*)\)/g, "<img src='"+ this.BaseFileURL +"$1' />")
		   // console.log(content)

			this.newInfo = {
				...res,
				// id: res.id,
				cutTitle : res.title.length > 11 ? res.title.substring(0, 11) + "..." : res.title,
				// title: res.title,
				cover: this.BaseFileURL + res.image.id,
				// userId: res.user_id,
				// author: res.author,
				content,
				// created_at: res.created_at,
				// views_count: res.hits
			}
			this.getRequestOK = true;
		},
		filters: {
			timeFormate(timeDate) {
				let Time = new Date(timeDate);
				let timestemp = Time.getTime();
				let t = timeFrom(timestemp, "yyyy年mm月dd日");
				return t;
			},
		},
		methods: {
			goHome() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
/* 引入富文本解析器 */
@import '@/components/html-parse/parse.css';
.hicon{
	height: 36upx;
	width: 36upx;
	padding-left: 30upx;
	padding-top: 10upx;
}

.model {
    width: 750upx;
    height: 520upx;
    position: absolute;
    background-color: rgba($color: #364161, $alpha: 0.2);
    z-index: 1;
    top: 0;
    left: 0;
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: flex-end;
	
	.mtitle{
		margin-top: 20upx;
		width: 700upx;
		margin-left: 25upx;
		font-size: 44upx;
		color: #fff;
		line-height: 64upx;
	}
	
	
	.info-user {
	  display: flex;
	  flex-direction: row;
	  flex-wrap: wrap;
	  justify-content: flex-start;
	  align-items: center;
	  align-content: center;
	  margin-top: 30upx;
	  margin-left: 5upx;
	  margin-bottom: 30upx;
	  .info {
	    display: flex;
	    flex-direction: column;
	    flex-wrap: wrap;
	    justify-content: flex-end;
	    align-items: left;
	    margin-left: 20upx;
	    font-size: 24upx;
		font-weight: bolder;
		color: #fff;
	  }
	}
}


.info-content {
  width: 680upx;
  text-align: left;
  margin-top: 40upx;
  margin-left: 35upx;
}

.info-header{
	margin-top: 10upx;
	margin-left: 25upx;
	padding-bottom: 20upx;
	color: #999;
	font-size: 22upx;
	.send{
		margin-right: 20upx;
	}
}

.line{
	height: 30upx;
	width: 750upx;
	background-color: #f3f3f3;
}
</style>
