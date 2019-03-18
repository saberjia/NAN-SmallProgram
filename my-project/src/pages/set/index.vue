<template>
  <div class="container">
    <div class="backwhite">
      <div class="title">识别历史</div>
      <switch :checked="ifrecord"  @change="switch1Change" color="#292839" />
    </div>

    <div class="backwhite backwhite2">
      <div class="title">意见反馈</div>
      <form @submit="bindFormSubmit">
        <textarea placeholder="欢迎给我们提建议哦！" @confirm="bindFormSubmit"  name="textarea" v-model="message"  />
        <button form-type="submit"  :hover-class="hoverclass"> 提交 </button>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },

  data () {
    return {
      message: '',
      record:'0',
      ifrecord:true,
      hoverclass:'hoverclass',
    }
  },
  methods: {
    // 改变识别历史开关
      switch1Change: function (e){
        const that =this;
        that.ifrecord=!that.ifrecord
        console.log(e.mp.detail.value)
        if(e.mp.detail.value==false){
            that.record='1'
        }else if((e.mp.detail.value==true)){
            that.record='0'
        }
        
         wx.request({
            url: 'https://nannima.top/tencent/changeSwitch',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: { record:that.record, openid:that.openid },
            success: function (res) {
             console.log(res)
            }
          })
      },
      //提交意见反馈
      bindFormSubmit: function(e) {
        const that =this;
        if(e.mp.detail.value.textarea==""){
          wx.showToast({
                title: '请先输入再提交',
                icon: 'none',
                duration: 2000
              })
          return
        }
        
         wx.request({
            url: 'https://nannima.top/tencent/saveSuggest',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: { suggest:e.mp.detail.value.textarea, openid:that.openid },
            success: function (res) {
               wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 2000
                })
              that.message=''
              console.log(res)
            }
          })
      },
      getUserInfo () {
      const that= this;
      // 调用登录接口
      wx.login({
        success: (res) => {
          wx.getUserInfo({
            success: (res) => {
              that.userInfo = res.userInfo
            }
          })

          if(res.code){
              wx.request({
                url:'https://nannima.top/tencent/getWechatUserInfo',
                method:'GET',
                 header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                data:{
                  code:res.code
                },
                success:function(res){
                  that.openid = res.data;
                  wx.request({
                    url: 'https://nannima.top/tencent/getUserInfo',
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST",
                    data: { openid:that.openid },
                    success: function (res) {
                      that.record=res.data.userInfo.record;
                      if(that.record=='1'){
                        that.ifrecord=false;
                      }
                    }
                  })
                }
              })
           }else{
             console.log('获取用户登录状态失败'+res.errMsg)
           }

        }
        
      })
      


    }
  },
  created () {
   this.getUserInfo()
  }
}
</script>
<style  scoped>

.hoverclass {
  background:#000!important;
}
.backwhite {
  background-color: #fff;
  padding: 30rpx 40rpx;
  width: 100%;
  margin: 18rpx auto 0rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}
.title {
  font-size: 36rpx;
}
.backwhite2  {
  display: block;
}
.backwhite2  .title {
  margin-bottom: 30rpx;
}
textarea {
  border:1rpx solid #292839;
  width: 100%;
  box-sizing: border-box;
  padding: 30rpx 33rpx;
  margin-bottom: 32rpx;
  font-size: 26rpx;
  color: #292839;
}
button {
  line-height: 104rpx;
  border-radius: 0;
  background-color: #292839;
  color: #fff;
  font-size: 36rpx;
}
</style>
