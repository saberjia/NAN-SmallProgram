<template>
  <div class="container">
    <div class="photo">
      <!-- <div  class="img-photo"  :style="{backgroundImage: 'url(' +photo + ')'}"></div> -->
       <img  class="img-photo"  :src="resultsimg" mode="widthFix" />
       <!-- @click="back" -->
      <div class="photo-btn"   @click="getfun" ><img :src="camera"  class="img-camera">重新识别</div>
    </div>
    <h1>识别结果</h1>
    <text class="text"  selectable="true">
      {{hrefresults}}
      <!-- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget. -->
    </text>
    <div class="tabbar">
      <a @click="copyTBL"  :hover-class="hoverclass" style="padding-bottom:-12rpx;margin-top:12rpx;"><img :src="copyb"  class="icon" ></a>
      <button   :hover-class="hoverclass" open-type="share"><div><img :src="shareb"  class="icon"></div></button> 
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },

  data () {
    return {

      hoverclass:'hoverclass',
      photo:require('../../assets/images/bgqwe.png'),
      camera:require('../../assets/images/icon-cam.png'),
      copyb:require('../../assets/images/icon-copyb.png'),
      shareb:require('../../assets/images/icon-shareb.png'),
      hrefresults:'',
      resultsimg:'',
      photore:false,
      resultid:'',
      index:'',
      type:'',
      openid:'',
      share:false
    }
  },
   onLoad:function(res){
        var that = this;
        that.resultid=res.resultid;
        that.share=res.share;    
        
        // console.log(that.resultid)
         wx.request({
            url: 'https://nannima.top/tencent/getRecordById',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: { id: that.resultid},
            success: function (res) {
              console.log(res)
              that.type =res.data.list[0].type;
              var type =res.data.list[0].type;
              if(type=="花草识别" || type=="车辆识别"){
                that.hrefresults=res.data.list[0].result.tag_list[0].label_name;
                that.resultsimg=res.data.list[0].ImgUrl;
              }else if(type=="图片翻译" ){
                that.resultsimg=res.data.list[0].ImgUrl;
                // that.hrefresults=res.data.list[0].result.image_recordsList;
                if (res.data.list[0].result.ret == 0) {
                var image_records = res.data.list[0].result.image_recordsList;
                var sourceContent = "";
                var targetContent = "";
                for (var i = 0; i < image_records.length; i++) {
                  sourceContent =
                    sourceContent + image_records[i].source_text + "   ";
                }
                for (var i = 0; i < image_records.length; i++) {
                  targetContent =
                    targetContent + image_records[i].target_text + "   ";
                }
                var allConetent =
                  "检测内容如下：\r\n" +
                  sourceContent +
                  "\r\n\r\n\r\n" +
                  "翻译内容如下：\r\n" +
                  targetContent;
                }
                that.hrefresults=allConetent
              }else if(type=="看图说话"){
                that.hrefresults=res.data.list[0].result.text;
                that.resultsimg=res.data.list[0].ImgUrl;
                // that.photore=res.data.resre;
              }else if(type=="行驶证识别" || type=="驾驶证识别"){
                that.resultsimg=res.data.list[0].ImgUrl;
                  var content = "";
                  var item_list = res.data.list[0].result.item_list;
                  for (var i = 0; i < item_list.length; i++) {
                    content = content + item_list[i].item+":"+item_list[i].itemstring + "\r\n";
                  }
                that.hrefresults=content
              }
              console.log(that.share)
              // if(that.share=='true') {
              //      wx.showToast({
              //         title: '点击下方右侧按钮分享',
              //         icon: 'none',
              //         duration: 3000
              //       })
              // }   
            }
          })
    },
  methods: {

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
    //点击获取
    getfun:function(){
        const that =this;
        if(that.type =="花草识别"){
          that.getVision('2')
        }else if(that.type =="车辆识别"){
          that.getVision('1')
        }else if(that.type =="图片翻译"){
          that.getImageTranlate('2')
        }else if(that.type =="看图说话"){
          that.getVision('0')
        }else if(that.type =="行驶证识别"){
          that.getImageDriver('0')
        }else if(that.type =="驾驶证识别"){
          that.getImageDriver('1')
        }
    },
    //复制
    copyTBL:function(e){  
        var self=this; 
        wx.setClipboardData({  
          data: self.hrefresults,  
          success: function(res) {  
            wx.showToast({
              title: '复制成功',
              icon: 'success',
              duration: 2000
            })
          }  
        });  
    }  ,
    
    //分享
     onShareAppMessage: function (res) {
        const that = this;
        console.log(that.resultid)
        // that.resultid=that.getCurrentPageUrlWithArgs()
        if (res.from === 'button') {
          // 来自页面内转发按钮
          console.log(res.target)
        }
        return {
          title: 'NAN',
          path: '/page/results/results?resultid='+that.resultid,
          success: function(res) {
            // 转发成功
          },
          fail: function(res) {
            // 转发失败
          }
        }
      } ,
    // 跳转到上一页面
    back:function (){
      wx.navigateBack({
        delta: 1
      })
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
        if (event==0){
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
              'scene': event,
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
  //行驶证驾驶证识别
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
            'type': event,
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
  //  this.getresults()
   this.getUserInfo()
  }
}
</script>
<style  scoped>

.hoverclass {
  background: rgba(0, 0, 0, 0.04)!important;
}
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
        display: flex;
        align-items: center;
}
.tabbar a , .tabbar button {
  width: 50%;
  display: inline-block;
  text-align: center;
}
.tabbar button::after{
  border:0;
  display: inline-block;
  background: rgba(255, 255, 255, 0);
  color: #fff;
  position: relative;
  overflow: visible;
  padding: 0;
  top: -2rpx;
  
}
.tabbar button div{
  background: #ffffff;
  position: absolute;
  width: 100%;
  /* height: 100rpx; */
  margin-left: -26rpx;
  margin-top: -4rpx;
}
</style>
