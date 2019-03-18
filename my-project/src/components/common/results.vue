<template>
  <div class="container">
    <div class="photo">
      <!-- <div  class="img-photo"  :style="{backgroundImage: 'url(' +photo + ')'}"></div> -->
      <img  class="img-photo"  :src="resultsimg" mode="widthFix" />
      <div class="photo-btn"><img :src="camera"  class="img-camera">重新识别</div>
    </div>
    <h1>识别结果</h1>
    <div class="text">
      {{hrefresults}}
      <!-- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget. -->
    </div>
    <div class="tabbar">
      <a><img :src="copyb"  class="icon"></a>
      <a><img :src="shareb"  class="icon"></a> 
    </div>
  </div>
</template>

<script>

export default {
  props: {
      hrefresults:String,
      resultsimg:String,
  },
  components: {
  },

  data () {
    return {
      photo:require('../../assets/images/bgqwe.png'),
      camera:require('../../assets/images/icon-cam.png'),
      copyb:require('../../assets/images/icon-copyb.png'),
      shareb:require('../../assets/images/icon-shareb.png'),
    }
  },

  created () {
   
  }
}
</script>
<style  scoped>
.icon {
  width: 100rpx;
  height: 100rpx;
}
.photo {
  width: 100%;
  position: relative;
}
.img-photo {
  width: 100%;
}
.photo-btn {
  position: absolute;
  right: 20rpx;
  bottom: 20rpx;
  color: #fff;
  background-color: rgba(41, 40, 57, 0.6);
  font-size: 26rpx;
  padding: 15rpx 25rpx;
  display: flex;
  align-items: center;
  border-radius: 16rpx;
}
.img-camera {
  width: 47rpx;
  height: 44rpx;
  margin-right: 23rpx;
}
.text {
  font-size: 26rpx;
  color: #666;
  padding: 42rpx 42rpx;
  background-color: #fff;
  line-height: 40rpx;
  width: 670rpx;
}
h1 {
  width: 680rpx;
  margin: 40rpx auto 20rpx;
  text-align: left;
  font-size: 40rpx;
  color: #292839;
}
.tabbar {
        position: fixed;
        left: 0;
        bottom: 0;
        border-top: 1px solid #c1c0c5;
        width: 100%;
        height: 100rpx;
        background: #fff;
        z-index: 100;
}
.tabbar a {
  width: 50%;
  display: inline-block;
  text-align: center;
  
}
</style>
