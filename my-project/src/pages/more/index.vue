<template>
  <div class="container">
     <div class="suspension ">
          <a :style="{backgroundImage: 'url(' +pcard + ')'}" @click="getImageTranlate" data-index="0"  :hover-class="hoverclass">
            <div>身份证识别</div>
          </a>
          <a :style="{backgroundImage: 'url(' +cocard + ')'}" @click="getImageDriver" data-index="0"  :hover-class="hoverclass">
            <div>行驶证识别</div>
          </a>
          <a :style="{backgroundImage: 'url(' +ctcard + ')'}" @click="getImageDriver" data-index="1" :hover-class="hoverclass">
            <div>驾驶证识别</div>
          </a>
          <a :style="{backgroundImage: 'url(' +playcard + ')'}"  @click="getImageTranlate" data-index="2" class="four"  :hover-class="hoverclass">
            <div>营业识别</div>
          </a>
          <a :style="{backgroundImage: 'url(' +bankcard + ')'}" @click="getImageTranlate" data-index="3" :hover-class="hoverclass">
            <div>银行卡识别</div>
          </a>
          <a :style="{backgroundImage: 'url(' +norcard + ')'}" @click="getImageTranlate" data-index="4" :hover-class="hoverclass">
            <div>通用识别</div>
          </a>
          <a :style="{backgroundImage: 'url(' +carcard + ')'}" @click="getVision" data-index="1"  :hover-class="hoverclass">
            <div>车辆识别</div>
          </a>
          <a :style="{backgroundImage: 'url(' +piccard + ')'}" @click="getVision" data-index="0" class="four" :hover-class="hoverclass">
            <div>看图说话</div>
          </a>
      </div>
  </div>
</template>

<script>
export default {
  components: {
  },

  data () {
    return {
      pcard:require('../../assets/images/icon-pcard.png'),
      cocard:require('../../assets/images/icon-cocard.png'),
      ctcard:require('../../assets/images/icon-ctcard.png'),
      playcard:require('../../assets/images/icon-playcard.png'),
      bankcard:require('../../assets/images/icon-bankcard.png'),
      norcard:require('../../assets/images/icon-norcard.png'),
      carcard:require('../../assets/images/icon-carcard.png'),
      piccard:require('../../assets/images/icon-piccard.png'),
      openid:'',
      hoverclass:'hoverclass',
    }
  },
 methods: {
    bindViewTap() {
      const url = "../logs/logs";
      wx.navigateTo({ url });
    },
    getUserInfo() {
      const that = this;
      // 调用登录接口
      wx.login({
        success: (res) => {
          wx.getUserInfo({
            success: res => {
              this.userInfo = res.userInfo;
            }
          });
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

                }
              })
           }else{
             console.log('获取用户登录状态失败'+res.errMsg)
           }
        }
      });
    },
    clickHandle(msg, ev) {
      console.log("clickHandle:", msg, ev);
    },
    //------------识别花草车辆
    getVision:function(event){
       const that = this;
    // console.log(event.currentTarget.dataset.index);  //序号
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
             formData: {
              'openid':that.openid
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
                // var content = res.data.data.text;
                // wx.showModal({
                //   title: '识别成功',
                //   content: content,
                // })
                console.log(that.openid )
                wx.request({
                  url: 'https://nannima.top/tencent/getRecord',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  method: "POST",
                  data: { limit: 1, skip: "0", openid:that.openid },
                  success: function (res) {
                    console.log(res.data)
                    wx.navigateTo({
                      url: '../results/results?resultid='+res.data.list[0]._id
                    })

                  wx.hideLoading()

                  }
                })
              } else {
                wx.showModal({
                  title: '识别失败',
                  content: '请确认您的照片是否清楚或者方向是否正确和对应的识别是否准确',
                })
                 wx.hideLoading()
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
              'openid':that.openid
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
                // var content = res.data.data.tag_list;
                // console.log("识别内容："+content);
                // wx.showModal({
                //   title: '识别成功',
                //   content: "识别结果：" + content[0].label_name + "\r\n" + "可信度：" + content[0].label_confd + "\r\n" +"（最高为1，可信度越高越准确）",
                // })
                 wx.request({
                  url: 'https://nannima.top/tencent/getRecord',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  method: "POST",
                  data: { limit: 1, skip: "0", openid:that.openid },
                  success: function (res) {
                    console.log(res.data)
                    wx.navigateTo({
                      url: '../results/results?resultid='+res.data.list[0]._id
                    })

                  wx.hideLoading()

                  }
                })

              } else {
                wx.showModal({
                  title: '识别失败',
                  content: '请确认您的照片是否清楚或者方向是否正确和对应的识别是否准确',
                  })
                   wx.hideLoading()
              }
            }

          })

        }
       
        // setTimeout(function () {
        //   wx.hideLoading();
        // }, 3000);
      }
    })



  },
  //行驶证识别
  getImageDriver: function (event) {  //行驶证
   const that =this;
    // console.log(event.currentTarget.dataset.index);  //序号
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
             'openid':that.openid
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
              // var content = "";
              // var item_list = res.data.data.item_list;
              // for (var i = 0; i < item_list.length; i++) {
              //   content = content + item_list[i].item+":"+item_list[i].itemstring + "\r\n";
              // }
              // wx.showModal({
              //   title: '识别成功',
              //   content: content,
              // })
               wx.request({
                  url: 'https://nannima.top/tencent/getRecord',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  method: "POST",
                  data: { limit: 1, skip: "0", openid:that.openid },
                  success: function (res) {
                    console.log(res.data)
                    wx.navigateTo({
                      url: '../results/results?resultid='+res.data.list[0]._id
                    })

                  wx.hideLoading()

                  }
                })

          
            } else {
              wx.showModal({
                title: '识别失败',
                content: '请确认您的照片是否清楚或者方向是否正确和对应的识别是否准确',
              })
               wx.hideLoading()
            }
          }

        })
        // setTimeout(function () {
        //   wx.hideLoading();
        // }, 3000);
      }
    })



  },
    //------------图片翻译
    getImageTranlate: function(event) {
       const that = this;
      wx.chooseImage({
        count: 1, // 默认9
        success: function(res) {
          var tempFilePaths = res.tempFilePaths;
          console.log(tempFilePaths[0]);
          wx.showLoading({
            title: "正在翻译..."
          });
          wx.uploadFile({
            url: "https://nannima.top/tencent/getNPL_getImageTrans",
            filePath: tempFilePaths[0],
            name: "file",
            formData: {
              source: "en",
              target: "zh",
              openid:that.openid
            },
            success: function(res) {
              var jsonStr = res.data;
              console.log(res.data);
              //json解析
              jsonStr = jsonStr.replace(" ", "");
              if (typeof jsonStr != "object") {
                jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
                var jj = JSON.parse(jsonStr);
                res.data = jj;
              }
              if (res.data.ret == 0) {
                // var image_records = res.data.data.image_records;
                // var sourceContent = "";
                // var targetContent = "";
                // for (var i = 0; i < image_records.length; i++) {
                //   sourceContent =
                //     sourceContent + image_records[i].source_text + "   ";
                // }
                // for (var i = 0; i < image_records.length; i++) {
                //   targetContent =
                //     targetContent + image_records[i].target_text + "   ";
                // }
                // var allConetent =
                //   "检测内容如下：\r\n" +
                //   sourceContent +
                //   "\r\n\r\n\r\n" +
                //   "翻译内容如下：\r\n" +
                //   targetContent;
                // console.log(allConetent);
                // wx.showModal({
                //   title: "翻译结果(注意误差)",
                //   content: allConetent
                // });
                 wx.request({
                  url: 'https://nannima.top/tencent/getRecord',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  method: "POST",
                  data: { limit: 1, skip: "0", openid:that.openid },
                  success: function (res) {
                    console.log(res.data)
                    wx.navigateTo({
                      url: '../results/results?resultid='+res.data.list[0]._id
                    })

                  wx.hideLoading()

                  }
                })
              } else {
                wx.showModal({
                  title: "翻译结果",
                  content: "检测不到内容请换一张或大侠重来一遍"
                });
                 wx.hideLoading()
              }
            }
          });
          // setTimeout(function() {
          //   wx.hideLoading();
          // }, 3000);
        }
      });
    }
  },

  created () {
   this.getUserInfo()
  }
}
</script>
<style  scoped>

.hoverclass {
  background-color: rgba(0, 0, 0, 0.04)!important;
}
  .suspension {
    width:100%;
    position: relative;
    margin: 0 auto ;
    background: #fff;
    z-index: 1;
    border-radius: 10rpx;
    /* box-shadow:0rpx 0rpx 30rpx rgba(0, 0, 0, 0.1); */

  }
  .suspension a {
    font-size:22rpx;
    color:#999;
    width:25%;
    height:172rpx;
    background-size:100%;
    display:inline-block;
    border-right:1px solid #ebebeb;
    border-bottom:1px solid #ebebeb;
    box-sizing:border-box;
  }
  a.four {
     border-right:none;
  }
  .suspension a div {
    text-align: center;
    padding-top: 106rpx;
  }
</style>
