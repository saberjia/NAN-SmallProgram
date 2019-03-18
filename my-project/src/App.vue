<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log('app created and cache logs by setStorageSync')
  }
}
</script>

<style>
body {
  background:#f6f2f2;
}
.container {
  /* background: #f6f2f2; */
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  /* padding: 200rpx 0; */
  box-sizing: border-box;
  padding-bottom: 120rpx;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}

a {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  /* -webkit-user-select: none; */
  -moz-user-focus: none;
  /* -moz-user-select: none; */
}
a,a:hover,a:active,a:visited,a:link,a:focus{
    -webkit-tap-highlight-color:rgba(0,0,0,0);
    -webkit-tap-highlight-color: transparent;
    outline:none;
    background: none;
    text-decoration: none;
}

::selection { 
    background: #FFF; 
    color: #333; 
} 
::-moz-selection { 
    background: #FFF; 
    color: #333; 
} 
::-webkit-selection { 
    background: #FFF; 
    color: #333; 
}
input {
  -webkit-tap-highlight-color:rgba(0,0,0,0);
}

</style>
