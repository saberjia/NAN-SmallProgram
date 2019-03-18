//index.js
//获取应用实例
var app = getApp()
Page( {
  data: {
   
  },
  getImageTranlate:function(event){
    console.log(event.currentTarget.dataset.index);  //序号
    wx.chooseImage({
      count: 1, // 默认9
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '正在识别...',
        })
        wx.uploadFile({
          url: 'https://nannima.top/tencent/getOCR_',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'ocr': event.currentTarget.dataset.index,
          },
          success: function (res) {
            console.log(res.data);
            var jsonStr = res.data
            //json解析
            jsonStr = jsonStr.replace(" ", "");
            if (typeof jsonStr != 'object') {
              jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
              var jj = JSON.parse(jsonStr);
              res.data = jj;
            }
            if(res.data.ret==0){
              if (event.currentTarget.dataset.index==0){
                wx.showModal({
                  title: '识别成功',
                  content: "姓名：" + res.data.data.name +"\r\n"
                  + "性别：" + res.data.data.sex + "\r\n"
                  + "民族：" + res.data.data.nation + "\r\n"
                  + "生日：" + res.data.data.birth + "\r\n"
                  + "地址：" + res.data.data.address + "\r\n"
                  + "身份证号：" + res.data.data.id + " \r\n",
                })
                }
              else if (event.currentTarget.dataset.index == 4){
                var content ="";
                 var item_list = res.data.data.item_list;
                 for (var i = 0; i < item_list.length; i++) {
                   content = content + item_list[i].itemstring +"\r\n";
                 }
                 wx.showModal({
                   title: '识别成功',
                   content: content,
                 })
              }
              else {
                var content = "";
                var item_list = res.data.data.item_list;
                for (var i = 0; i < item_list.length; i++) {
                  content = content + item_list[i].item + ":" + item_list[i].itemstring + "\r\n";
                }
                wx.showModal({
                  title: '识别成功',
                  content: content,
                })
              }
            }else{
              wx.showModal({
                title: '识别失败',
                content: '请确认您的照片是否清楚或者方向是否正确和对应的识别是否准确',
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
  getImageDriver: function (event) {  //行驶证
   
    console.log(event.currentTarget.dataset.index);  //序号
    wx.chooseImage({
      count: 1, // 默认9
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '正在识别...',
        })
        wx.uploadFile({
          url: 'https://nannima.top/tencent/getOCR_Driver',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'type': event.currentTarget.dataset.index,
          },
          success: function (res) {
            console.log(res.data);
            var jsonStr = res.data
            //json解析
            jsonStr = jsonStr.replace(" ", "");
            if (typeof jsonStr != 'object') {
              jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
              var jj = JSON.parse(jsonStr);
              res.data = jj;
            }
            if (res.data.ret == 0) {
              var content = "";
              var item_list = res.data.data.item_list;
              for (var i = 0; i < item_list.length; i++) {
                content = content + item_list[i].item+":"+item_list[i].itemstring + "\r\n";
              }
              wx.showModal({
                title: '识别成功',
                content: content,
              })
          
            } else {
              wx.showModal({
                title: '识别失败',
                content: '请确认您的照片是否清楚或者方向是否正确和对应的识别是否准确',
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


  getVision:function(event){


    console.log(event.currentTarget.dataset.index);  //序号
    wx.chooseImage({
      count: 1, // 默认9
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '正在识别...',
        })
        if (event.currentTarget.dataset.index==0){
          wx.uploadFile({
            url: 'https://nannima.top/tencent/getSpeakOnce',
            filePath: tempFilePaths[0],
            name: 'file',
            success: function (res) {
              console.log(res.data);
              var jsonStr = res.data
              //json解析
              jsonStr = jsonStr.replace(" ", "");
              if (typeof jsonStr != 'object') {
                jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
                var jj = JSON.parse(jsonStr);
                res.data = jj;
              }
              if (res.data.ret == 0) {
                var content = res.data.data.text;
                wx.showModal({
                  title: '识别成功',
                  content: content,
                })

              } else {
                wx.showModal({
                  title: '识别失败',
                  content: '请确认您的照片是否清楚或者方向是否正确和对应的识别是否准确',
                })
              }
            }

          })

        }
        else{

          wx.uploadFile({
            url: 'https://nannima.top/tencent/getGrass_Car',
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
              'scene': event.currentTarget.dataset.index,
            },
            success: function (res) {
              console.log(res.data);
              var jsonStr = res.data
              //json解析
              jsonStr = jsonStr.replace(" ", "");
              if (typeof jsonStr != 'object') {
                jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
                var jj = JSON.parse(jsonStr);
                res.data = jj;
              }
              if (res.data.ret == 0) {
                var content = res.data.data.tag_list;
                console.log("识别内容："+content);
                wx.showModal({
                  title: '识别成功',
                  content: "识别结果：" + content[0].label_name + "\r\n" + "可信度：" + content[0].label_confd + "\r\n" +"（最高为1，可信度越高越准确）",
                })

              } else {
                wx.showModal({
                  title: '识别失败',
                  content: '请确认您的照片是否清楚或者方向是否正确和对应的识别是否准确',
                })
              }
            }

          })

        }
       
        setTimeout(function () {
          wx.hideLoading();
        }, 3000);
      }
    })



  },



  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo( {
      url: '../logs/logs'
    })
  },

  onLoad: function() {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo( function( userInfo ) {
      //更新数据
      that.setData( {
        userInfo: userInfo
      })
    })
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: '计算机视觉'
    })
  }
})
