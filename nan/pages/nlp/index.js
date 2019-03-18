//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    result1: "",
  },
  //获取用户输入的用户名
  userNameInput: function (e) {
    this.setData({
      textareaValue: e.detail.value
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  swiperchange: function (e) {
    //FIXME: 当前页码
    //console.log(e.detail.current)
  },

  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '自然语言处理'
    })
  },
  texttranslate: function (event) {
    var that = this;
    wx.showLoading({
      title: '正在翻译...',
    })
    wx.request({
      url: 'https://nannima.top/tencent/getNPL_getTextTrans',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { text: this.data.textareaValue, type: "0" },
      success: function (res) {
        console.log(res.data);
        // this.result = res.data.data.trans_text;
        that.setData({ result1: res.data.data.trans_text });
      }
    })
    setTimeout(function () {
      wx.hideLoading();
    }, 1000);

  },
  getImageTranlate: function (event) {
    wx.chooseImage({
      count: 1, // 默认9
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0]);
        wx.showLoading({
          title: '正在翻译...',
        })
        wx.uploadFile({
          url: 'https://nannima.top/tencent/getNPL_getImageTrans',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'source': 'en',
            'target': 'zh'
          },
          success: function (res) {
            var jsonStr = res.data
            console.log(res.data);
            //json解析
            jsonStr = jsonStr.replace(" ", "");
            if (typeof jsonStr != 'object') {
              jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
              var jj = JSON.parse(jsonStr);
              res.data = jj;
            }
            if (res.data.ret == 0) {
              var image_records = res.data.data.image_records;
              var sourceContent = "";
              var targetContent = "";
               for(var i = 0;i<image_records.length;i++){   
                 sourceContent = sourceContent + image_records[i].source_text+"   ";
               }
              for (var i = 0; i < image_records.length; i++) {
                targetContent = targetContent + image_records[i].target_text + "   ";
              }
              var allConetent = "检测内容如下：\r\n" + sourceContent +"\r\n\r\n\r\n"+"翻译内容如下：\r\n" + targetContent;
              console.log(allConetent);
              wx.showModal({
                title: '翻译结果(注意误差)',
                content: allConetent,
              })
            } else {
              wx.showModal({
                title: '翻译结果',
                content: '检测不到内容请换一张或大侠重来一遍',
              })
            }
          
          }
          
        })
        setTimeout(function () {
          wx.hideLoading();
        }, 3000);
      }
    })

  },
  getImageTranlate2: function (event) {
    wx.showToast({
      title: '闪你狗眼',
      icon: 'loading',
      duration: 300
    })
  }
})

