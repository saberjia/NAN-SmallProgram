//index.js

var app = getApp();
var that;
var chatListData = [];
var speakerInterval;
Page({
  data: {
    defaultCorpus:'你都会什么',
    askWord: '',
    sendButtDisable:true,
    userInfo: {},
    chatList: [],
    scrolltop:'',
    userLogoUrl:'/res/image/user_default.png',
    keyboard:false,
    isSpeaking:false,
    speakerUrl:'/res/image/speaker0.png',
    speakerUrlPrefix:'/res/image/speaker',
    speakerUrlSuffix:'.png',
    filePath:null,
    contactFlag:true,
  },
  onLoad: function () {
    console.log("[Console log]:Loading...");
    that = this;
    var timestamp = new Date().getTime();
    app.getUserInfo(function (userInfo) {
      var aUrl = userInfo.avatarUrl;
      console.log(userInfo);
      if(aUrl != null){
        that.setData({
          userLogoUrl: aUrl,
        });
      }
    });
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

  onReady: function () {
    wx.setNavigationBarTitle({
      title: '人工智能'
    })
  },
  // 切换语音输入和文字输入
  switchInputType:function(){
    this.setData({
      keyboard: !(this.data.keyboard),
    })
  },
  // 监控输入框输入
  Typing:function(e){
    var inputVal = e.detail.value;
    var buttDis = true;
    if(inputVal.length != 0){
      var buttDis = false;
    }
    that.setData({
      sendButtDisable: buttDis,
    })
  },
  // 按钮按下
  touchdown:function(){
    this.setData({
      isSpeaking : true,
    })
    that.speaking.call();
    console.log("[Console log]:Touch down!Start recording!");
    wx.startRecord({
      'success':function(res){
        var tempFilePath = res.tempFilePath;
        that.data.filePath = tempFilePath;
        console.log("[Console log]:Record success!File path:" + tempFilePath);
        that.voiceToChar();
      },
      'fail':function(){
        console.log("[Console log]:Record failed!");
        wx.showModal({
          title: '录音失败',
          content:'换根手指再试一次！',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#09BB07',
        })
      },
    });
  },
  // 按钮松开
  touchup:function(){
    wx.stopRecord();
    console.log("[Console log]:Touch up!Stop recording!");
    this.setData({
      isSpeaking: false,
      speakerUrl: '/res/image/speaker0.png',
    })
    clearInterval(that.speakerInterval);
  },
  // 语音转文字
  voiceToChar:function(){
    var voiceFilePath = that.data.filePath;
    console.log("录音文件："+voiceFilePath);
    if(voiceFilePath == null){
      console.log("[Console log]:File path do not exist!");
      wx.showModal({
        title: '录音文件不存在',
        content: '我也不知道哪错了，反正你就再试一次吧！',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#09BB07',
      })
      return;
    }
    wx.showLoading({
      title: '语音识别中...',
    })
    wx.hideLoading();
    wx.uploadFile({
      url: "https://nannima.top/tencent/getVoiceToText",
      filePath: voiceFilePath,
      name: 'file',
      formData: { "format": "4", "rate": "16000"},
      header: { 'content-type': 'multipart/form-data' },
      success: function (res) { 
        wx.hideLoading();
        console.log(res.data);
        wx.showModal({
          title: '待完善',
          content: "待完善",
          showCancel: false,
          success: function (res) {
          }
        });
        return;
      },
      fail: function (res) {
        console.log("[Console log]:Voice upload failed:" + res.errMsg);
        wx.hideLoading();
        wx.showModal({
          title: '录音识别失败',
          content: "请你离WIFI近一点再试一次！",
          showCancel: false,
          success: function (res) {
          }
        });
      }
    });
  },

  // 增加对话到显示界面（scrolltopFlag为True）
  addChat: function (word, orientation) {
    that.addChatWithFlag(word, orientation,true);
  },
  // 增加对话到显示界面（scrolltopFlag为是否滚动标志）
  addChatWithFlag: function (word, orientation, scrolltopFlag){
    let ch = { 'text': word, 'time': new Date().getTime(), 'orientation': orientation };
    chatListData.push(ch);
    var charlenght = chatListData.length;
    console.log("[Console log]:Add message to chat list...");
    if (scrolltopFlag){
      console.log("[Console log]:Rolling to the top...");
      that.setData({
        chatList: chatListData,
        scrolltop: "roll" + charlenght,
      });
    }else{
      console.log("[Console log]:Not rolling...");
      that.setData({
        chatList: chatListData,
      });
    }
  },
  sendChat:function(e){
    console.log(e.detail.value);
    if (e.detail.value==""){
      wx.showModal({
        title: '提示',
        content: '请输入内容呀亲',
        showCancel: false,
      });
    }
    else{
    that.addChat(e.detail.value, "r");  
    wx.getStorage({
      key: 'key',
      success: function (res) {
        console.log("key:" + res.data + ";" + "question:" + e.detail.value);
        wx.request({
          url: 'https://nannima.top/tencent/getAIToText', 
          method:"POST",
          data: {
            question: e.detail.value,
            session: res.data
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            console.log(res.data.data);
            if(res.data.ret==0){
              that.addChat(res.data.data.answer, "l");  
            }
            else{
              that.addChat("你看，这就是人工智能待完善的时候，我答不上来了", "l");  
            }  
            that.setData({ askWord:''});
          }
        })
      }
    })
    }
  },
  // 联系作者
  contactMe:function(){
    if(that.data.contactFlag){
	  // 语义平台自定义回复
      that.addChat("你好我是楠尼玛，小程序的录音上传遇到了问题，但已有两个在线web智能闲聊了\r\n我的qq：519286925","l");
    }
    else{
      wx.showModal({
        title: '提示',
        content: '你都点过了，还点干嘛！！',
        showCancel:false,
      });
    }
    that.data.contactFlag = false;
  },
  // 麦克风帧动画 
  speaking:function() {
    //话筒帧动画 
    var i = 0;
    that.speakerInterval = setInterval(function () {
      i++;
      i = i % 7;
      that.setData({
        speakerUrl: that.data.speakerUrlPrefix + i + that.data.speakerUrlSuffix,
      });
      console.log("[Console log]:Speaker image changing...");
    }, 300);
  }
})
