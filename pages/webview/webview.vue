<template>
	<web-view :src="url"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				url:''
			}
		},
		onLoad(option){
			this.url = decodeURI(option.url);
		}
	}
</script>

<style>

</style>
