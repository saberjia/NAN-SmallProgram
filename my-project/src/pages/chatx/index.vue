<template>
  <div class="container" >
    <scroll-view class="scrool-view"  scroll-y="true" scroll-with-animation="true" :scroll-into-view="scrolltop" enable-back-to-top="true">
        <div class="listul" v-for="(item, index) in chatList" :key="index">
          <!-- <div class="user chat-right" :id="index + 1"  v-if="item.orientation == 'r'">
              <img v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover"   class="img-head">
              <div class="text-message">
                <p>{{item.text}}{{item.url}}</p>
                <img :src='tailuser' class="img-tail">
              </div>
          </div>
          <div :id="index + 1" class="chat-left" v-if="item.orientation == 'l'">
              <img  :src="bearimg" background-size="cover"   class="img-head">
              <div class="text-message">
                <p>{{item.text}}</p>
                <img :src="tail" class="img-tail">
              </div>
          </div> -->
          <div class="listli user" v-if="item.orientation == 'r'" :id="'roll'+(index + 1)">
              <img v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover"   class="img-head">
              <div class="text-message">
                <p>{{item.text}}</p>
                <img :src='tailuser' class="img-tail">
              </div>
          </div>
          <div class="listli" v-if="item.orientation == 'l'" :id="'roll'+(index + 1)">
              <img  :src="bearimg" background-size="cover"   class="img-head">
              <div class="text-message">
                <p>{{item.text}}</p>
                <img :src="tail" class="img-tail">
              </div>
          </div>
          <!-- <div class="time-info">下午 6:38</div>
          <div class="listli user">
              <img v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover"   class="img-head">
              <div class="text-message">
                <p>你好，你叫什么名字？喜欢吃什么？</p>
                <img :src='tailuser' class="img-tail">
              </div>
          </div>
          <div class="listli" >
              <img  :src="bearimg" background-size="cover"   class="img-head">
              <div class="text-message">
                <p>我叫阿楠，喜欢吃麻辣香锅、麻辣烫、火锅、冒菜。这个问题你问过了。</p>
                <img :src="tail" class="img-tail">
              </div>
          </div>
          <div class="listli user">
              <img v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover"   class="img-head">
              <div class="text-message">
                <p>你好，你叫什么名字？喜欢吃什么？</p>
                <img :src='tailuser' class="img-tail">
              </div>
          </div>
          <div class="listli" >
              <img  :src="bearimg" background-size="cover"   class="img-head">
              <div class="text-message">
                <p>我叫阿楠，喜欢吃麻辣香锅、麻辣烫、火锅、冒菜。这个问题你问过了。</p>
                <img :src="tail" class="img-tail">
              </div>
          </div> -->
        </div>
    </scroll-view>
    <form @submit="sendChat">
      <div class="userinput" :class="{ userinputtop: istop }">
          <div :hover-class="hoverclass" class="voicebox" ><img class="voice" :src="voice" @click="voicefun"  /></div>
          <input class="text" @focus="iftop" @blur="ifbottom" placeholder="和我聊天吧！" @confirm="sendChat"   type="text"  :value="askWord" />
          <!--  confirm-type="send" name="ask_word"  @input="Typing" -->
           
      </div>
    </form>
  </div>
</template>

<script>

export default {
  components: {
  },

  data () {
    return {
      userInfo: {},
      tail:require('../../assets/images/tail.png'),
      tailuser:require('../../assets/images/tail2.png'),
      bearimg:require('../../assets/images/icon-bearimg.png'),
      voice:require('../../assets/images/icon-voice.png'),
      istop:false,
      // defaultCorpus:'你都会什么',
      askWord: '',
      // sendButtDisable:true,
      // userInfo: {},
      // chatdivst: [],
      scrolltop:'',
      // keyboard:false,
      // isSpeaking:false,
      // filePath:null,
      // contactFlag:true,
       chatList: [
        // { orientation: 'r' ,
        //   text:'你好，你叫什么名字？喜欢吃什么'
        // },
        { orientation: 'l' ,
          text:'你好啊！'
        }
      ],
      hoverclass:'hoverclass',
    }
  },
  onUnload(){
    wx.setStorage({
      key:"navgo",
      data:"true"
    })
     wx.getStorage({
      key: 'navgonum',
      success: function(res) {
           if(res.data=="1"){
              wx.switchTab({
                url: '../index/index'
              })
           }else if(res.data=="2"){
              wx.switchTab({
                url: '../my/my'
              })
           }
      },
      fail:function(res){
        console.log(res)
          wx.switchTab({
            url: '../index/index'
          })
      } 
    })
  },
  methods: {
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    iftop(){
      const that =this;
      that.istop=true;
      console.log(that.istop)
    },
    ifbottom(){
      const that =this;
      that.istop=false;
      console.log(that.istop)
    },
  //语音，现在弹还未实现
  voicefun:function(){
       wx.showToast({
          title: '功能未上线，敬请期待',
          icon: 'none',
          duration: 2000
        })
  },  
  // 增加对话到显示界面（scrolltopFlag为True）
  addChat: function (word, orientation) {
    var that=this;
    that.addChatWithFlag(word, orientation,true);
  },
  // 增加对话到显示界面（scrolltopFlag为是否滚动标志）
  addChatWithFlag: function (word, orientation, scrolltopFlag){
    var that=this;
    let ch = { 'text': word, 'time': new Date().getTime(), 'orientation': orientation };
    that.chatList.push(ch);
    var charlenght = that.chatList.length;
    console.log("[Console log]:Add message to chat list...");
    if (scrolltopFlag){
      console.log("[Console log]:Rolling to the top...");
      this.chatList=that.chatList;
      this.scrolltop="roll" + charlenght;
    }else{
      console.log("[Console log]:Not rolling...");
      this.chatList=that.chatList
    }
  },
  sendChat:function(e){
    console.log(e.target.value)
    // console.log(e.detail.value);
    var that=this;
    if (e.target.value==""){
      wx.showModal({
        title: '提示',
        content: '请输入对话内容',
        showCancel: false,
      });
    }
    else{
    that.addChat(e.target.value, "r");  
    wx.getStorage({
      key: 'key',
      success: function (res) {
        console.log("key:" + res.data + ";" + "question:" + e.target.value);
        wx.request({
          url: 'https://nannima.top/tencent/getAIToText', 
          method:"POST",
          data: {
            question: e.target.value,
            session: res.data
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            console.log(res.data.data);
            if(res.data.ret==0){
              that.addChat(res.data.data.answer, "l");  

            var charlenght = that.chatList.length;
            that.scrolltop="roll" + charlenght;
            that.askWord='';
            }
            else{
              that.addChat("你看，这就是人工智能待完善的时候，我答不上来了", "l");  

            var charlenght = that.chatList.length;
            that.scrolltop="roll" + charlenght;
            that.askWord='';
            }  
          }
        })
      }
    })
    }
  },


onLoad: function () {
    console.log("[Console log]:Loading...");
    var that = this;
    // var app = getApp();
    var timestamp = new Date().getTime();
    // app.getUserInfo(function (userInfo) {
    //   var aUrl = userInfo.avatarUrl;
    //   console.log(userInfo);
    //   if(aUrl != null){
    //     that.setData({
    //       userLogoUrl: aUrl,
    //     });
    //   }
    // });
    wx.getStorage({
      key: 'key',
      success: function (res) {
        console.log(res.data)
      },
      fail:function(res){
        console.log("失败")
        wx.setStorage({
          key: "key",
          data: timestamp
        })
      }
    })
  },

  },
  //第一次页面渲染完之后滚动条在最底部
  mounted(){
   
  },
  created () {
   // 调用应用实例的方法获取全局数据
    this.getUserInfo()
    this.onLoad()
    
  }
}
</script>
<style  scoped>
.hoverclass {
  background: rgba(0, 0, 0, 0.04)!important;
}
.container  {
  /* padding:33rpx 0 120rpx;  */
  overflow-x: hidden;
}
.scrool-view {
  height:1000rpx;
}
.container .listli {
  margin: 33rpx auto;
  width:520rpx;
  position: relative;
  margin-left:160rpx;
}
div.time-info {
  margin:33rpx auto;
  text-align:center;
  font-size:20rpx;
  border-bottom:1rpx sodivd #e1dddf;
  padding:0rpx 0 30rpx;
  color:#928f95;
  width:700rpx;
}
.img-head {
  width:97rpx;
  height: 97rpx; 
  border-radius: 50%;
  background-color: #fff;
  position: absolute;
  bottom: 0;
  left:-130rpx;

}
.text-message {
  padding: 30rpx 36rpx;
  background: #fff;
  position: relative;
  max-width: 400rpx;
  font-size: 26rpx;
  color: #292839;
  border-radius: 20rpx;
  text-align:justify;
  /* text-justify:inter-ideograph; */
}
.img-tail {
  position: absolute;
  width: 50rpx;
  height: 38rpx;
  left:-23rpx;
  bottom:-1rpx;
  z-index: 2;
}
div.user {
  margin-left:240rpx;
}
.user .text-message {
  background-color: #292839;
  color: #fff;
  max-width: 278rpx;
}
.user .img-tail {
  right:-21rpx;
  bottom:-1rpx;
  left: auto;
}
.user .img-head {
  left:auto;
  right:40rpx;
}

.userinput {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  height: 70rpx;
  padding: 20rpx 0;
  z-index: 99;
  display: flex;
  align-items: center;
  left:0;
}
/* .userinputtop {
  bottom: 500rpx;
}  */
.userinput .voice {
  width: 72rpx;
  height: 72rpx;
}
.userinput  .voicebox {
  width: 72rpx;
  height: 72rpx;
  margin: auto 30rpx;
  border-radius: 50%;
}
.userinput input.text {
height:70rpx;
line-height:70rpx;
margin:20rpx;
width:560rpx;
padding-left:20rpx;
background-color:#f8f8f8;
display:inline-block;
font-size:26rpx;
color:#292839;
margin-left:0rpx;

}

</style>
