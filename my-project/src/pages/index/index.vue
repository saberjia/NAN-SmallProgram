<template>
  <!-- <div class="container" @click="clickHandle('test click', $event)">

    <div class="userinfo" @click="bindViewTap">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div>
    </div>

    <div class="usermotto">
      <div class="user-motto">
        <card :text="motto"></card>
      </div>
    </div>
      
    <form class="form-container">
      <input type="text" class="form-control" v-model="motto" placeholder="v-model" />
      <input type="text" class="form-control" v-model.lazy="motto" placeholder="v-model.lazy" />
    </form>

  </div> -->
   <div class="container" >
      <div class="topbacp" @click="ptextfun()">
        <img  v-if="bgtup" :src="bgtup"  class="img-bgtup">
        <img  v-if="bear" :src="bear"  class="img-bear">
        <div class="text-message">
          <!-- <p>嗨，你好，{{userInfo.nickName}}，我是阿楠，需要翻译、识别图片、闲聊都可以找我。</p> -->
          <p  v-for="(item, index) in ptext" :key="index" v-if="index==ptextnum" >{{item.text}}</p>
          
          <img v-if="tail" :src="tail" class="img-tail">
        </div>
      </div>
      <div class="suspension suspension-top">
          <!-- <a :style="{backgroundImage: 'url(' + flower + ')'}"  href="/pages/results/results" > -->
          <!-- <a   href="/pages/results/results?{{ hrefresults }}">{{ hrefresults }}</a> -->
          <a :hover-class="hoverclass" :style="{backgroundImage: 'url(' + flower + ')'}"  @click="getVision" data-index="2"> 
            <div>花草识别</div>
          </a>
          <a :hover-class="hoverclass" :style="{backgroundImage: 'url(' +bcard + ')'}" @click="getImageTranlate" data-index="1" >
            <div>名片识别</div>
          </a>
          <a :hover-class="hoverclass" :style="{backgroundImage: 'url(' +text + ')'}" @click="getImageTranlate" >
            <div>图片翻译</div>
          </a>
          <a :hover-class="hoverclass" :style="{backgroundImage: 'url(' +more + ')'}"  href="/pages/more/more" >
            <div>更多识别</div>
          </a>
      </div>
      <h1>翻译</h1>
      <form @submit="texttranslate">
        <div class="suspension translation">
          <input class="translation-input" type="text"  @confirm="texttranslate" placeholder="输入查找内容" v-model="mes"  >
          <a class="translation-a" :hover-class="hoverclass000"  @click="texttranslate">查词</a>
          <div v-if="ifresult" style="margin-left:20rpx;">翻译结果：{{ result }}</div>
        </div>
       </form>
      <!-- <tabbar :tabactive="tabactive" ></tabbar> -->
  </div>
</template>

<script>
import card from "@/components/card";
import results from "@/components/common/results";

export default {
  data() {
    return {
      bear: require("../../assets/images/bear-nor.png"),
      tail: require("../../assets/images/tail.png"),
      flower: require("../../assets/images/icon-flower.png"),
      bcard: require("../../assets/images/icon-bcard.png"),
      text: require("../../assets/images/icon-text.png"),
      more: require("../../assets/images/icon-more.png"),
      bgtup: require("../../assets/images/bgqwe.png"),
      motto: "Hello World",
      userInfo: {},
      result: "",
      ifresult: false,
      mes: "",
      openid:"",     
      hrefresults:"",
      resultsimg:"",
      ptext:[],
      ptextnum:0,
      ptextindex:0,
      hoverclass:'hoverclass',
      hoverclass000:'hoverclass000'
    };
  },
  components: {
    card,results
  },

  methods: {
    bindViewTap() {
      const url = "../logs/logs";
      wx.navigateTo({ url });
    },
    getUserInfo() {
      // 调用登录接口
      var that=this;
      wx.login({
        success: (res) => {
          wx.getUserInfo({
            success: res => {
              that.userInfo = res.userInfo;
              // userInfo=res.userInfo;
              console.log(that.userInfo)
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

                  wx.request({
                    url:'https://nannima.top/tencent/getNotice',
                    method:'POST',
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    success:function(res){
                      that.ptext=res.data;
                      // console.log(that.ptext)
                    }
                  })
                  if(that.userInfo.nickName==undefined){
                    return
                  }
                  if(that.userInfo.avatarUrl==undefined){
                      that.userInfo.avatarUrl=""
                  }
                  if(that.userInfo.gender==undefined){
                      that.userInfo.gender=""
                  }
                  if(that.userInfo.city==undefined){
                      that.userInfo.city=""
                  }
                  if(that.userInfo.country==undefined){
                      that.userInfo.country=""
                  }
                  if(that.userInfo.province==undefined){
                      that.userInfo.province=""
                  }
                  wx.request({
                    url:'https://nannima.top/tencent/saveUserInfo',
                    method:'POST',
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data:{
                      nickName:that.userInfo.nickName,
                      avatarUrl:that.userInfo.avatarUrl,
                      gender:that.userInfo.gender,
                      city:that.userInfo.city,
                      country:that.userInfo.country,
                      province:that.userInfo.province,
                      openid:that.openid,
                    },
                    success:function(res){
                    }
                  })

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
    //切换公告
    ptextfun:function (){
        const that =this;
        if(that.ptextnum==that.ptext.length-1){
          that.ptextnum=0;
          that.ptextindex=0
        }else{
          that.ptextnum=that.ptextindex+1
          that.ptextindex=that.ptextnum
        }
        
    },
    //-------分割线-------请求翻译
    texttranslate: function(event) {
      var that = this;
      if(that.mes==""){
        wx.showToast({
              title: '请先输入单词再翻译',
              icon: 'none',
              duration: 2000
            })
        return
      }
      wx.showLoading({
          title: '正在翻译...',
        })
      wx.request({
        url: 'https://nannima.top/tencent/getNPL_getTextTrans',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: { text: that.mes, type: "0", openid:that.openid },
        success: function (res) {
          that.result = res.data.data.trans_text;
          that.ifresult=true;
          
        },complete(){
            wx.hideLoading()
        }
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
          if (event.currentTarget.dataset.index==0){
            wx.uploadFile({
              url: 'https://nannima.top/tencent/getSpeakOnce',
              filePath: tempFilePaths[0],
              name: 'file',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
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
                  var content = res.data.data.text;
                  console.log(res.data)
                  // wx.showModal({
                  //   title: '识别成功',
                  //   content: content,
                  // })
                

                } else {
                  wx.showModal({
                    title: '识别失败',
                    content: '请确认您的照片是否清楚或者方向是否正确和对应的识别是否准确',
                  })
                }
              },complete(){
            wx.hideLoading()
        }

            })

          }
          else{

            wx.uploadFile({
              url: 'https://nannima.top/tencent/getGrass_Car',
              filePath: tempFilePaths[0],
              name: 'file',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              formData: {
                'scene': event.currentTarget.dataset.index,
                'openid':that.openid 
              },
              success: function (res) {
                // console.log(res.data);
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
                  // console.log("识别内容："+content);
                  // 转到results页面
                  // that.hrefresults=content[0].label_name;
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

                    },complete(){
                        wx.hideLoading()
                    }
                  })
                  // wx.showModal({
                  //   title: '识别成功',
                  //   content: "识别结果：" + content[0].label_name + "\r\n" + "可信度：" + content[0].label_confd + "\r\n" +"（最高为1，可信度越高越准确）",
                  // })

                } else {
                  wx.showModal({
                    title: '识别失败',
                    content: '请确认您的照片是否清楚或者方向是否正确和对应的识别是否准确',
                    })
                }
              },complete(){
            wx.hideLoading()
        }
            })

          }
        
          // setTimeout(function () {
          //   wx.hideLoading();
          // }, 3000);
        }
      })



    },
    //------------图片翻译
    getImageTranlate: function(event) {
      var that =this;
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
                  },complete(){
            wx.hideLoading()
        }
                })

              } else {
                wx.showModal({
                  title: "翻译结果",
                  content: "检测不到内容请换一张或大侠重来一遍"
                });
              }
            },complete(){
            wx.hideLoading()
        }
          });
          // setTimeout(function() {
          //   wx.hideLoading();
          // }, 3000);
        }
      });
    }
  },

  created() {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo();
  },
  onShow:function(){
     wx.setStorage({
      key:"navgo",
      data:"false"
    });
    wx.setStorage({
      key:"navgonum",
      data:"1"
    });
      const that =this;
      that.ifresult=false;
      that.mes="";


      const updateManager = wx.getUpdateManager()

      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate)
      })

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })

      })

      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
      })

  },
};
</script>


<style  scoped>
.hoverclass {
  background-color: rgba(0, 0, 0, 0.04);
}
.hoverclass000 {
  background: #000!important;
}
.topbacp {
  background-size: 100%;
  height: 400rpx;
  width: 100%;
  position: relative;
  z-index: 1;
}
.img-bgtup {
  height: 400rpx;
  width: 100%;
  position: absolute;
  z-index: 1;
}
.img-bear {
  width: 419rpx;
  height: 384rpx;
  position: absolute;
  bottom: 0px;
  z-index: 1;
}
.text-message {
  padding: 30rpx 36rpx;
  background: #fff;
  position: absolute;
  z-index: 2;
  width: 328rpx;
  right: 30rpx;
  bottom: 180rpx;
  font-size: 26rpx;
  color: #292839;
  border-radius: 20rpx;
  text-align: justify;
  text-justify: inter-ideograph;
}
.img-tail {
  position: absolute;
  width: 50rpx;
  height: 38rpx;
  left: -22rpx;
  bottom: -1rpx;
}
.suspension {
  width: 712rpx;
  position: relative;
  margin: 0 auto;
  background: #fff;
  z-index: 1;
  border-radius: 10rpx;
  box-shadow: 0rpx 0rpx 30rpx rgba(0, 0, 0, 0.1);
}
.suspension-top {
  margin: -50rpx auto 0;
  height: 166rpx;
}
.suspension-top a {
  font-size: 22rpx;
  color: #999;
  width: 178rpx;
  height: 172rpx;
  background-size: 100%;
  display: inline-block;
}
.suspension-top a div {
  text-align: center;
  padding-top: 106rpx;
}
h1 {
  width: 680rpx;
  margin: 58rpx auto 20rpx;
  font-size: 68rpx;
  text-align: left;
  color: #292839;
}
.translation {
  height: 100rpx;
  line-height: 100rpx;
  font-size: 34rpx;
  color: #292839;
}
input.translation-input {
  padding-left: 30rpx;
  height: 100rpx;
  line-height: 100rpx;
}
.translation-a {
  background: #292839;
  color: #fff;
  width: 150rpx;
  text-align: center;
  border-radius: 0 10rpx 10rpx 0;
  float: right;
  position: absolute;
  z-index: 98;
  right: 0;
  top: 0;
}

/* 原始 */
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}
</style>
