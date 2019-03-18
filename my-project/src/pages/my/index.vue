<template>
  <div class="container">
    <div class="backwhite">
      <img v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover"   class="img-head">
      <div class="userinfo">{{userInfo.nickName}}<span>识别萌新</span></div>
      <a  href="/pages/set/set" :hover-class="hoverclass" class="icon-right"><img  :src="set" class="icon"></a>
    </div>
    <div v-if="ifrecord">
      <h1>识别历史</h1>
        <div class="overh"    v-for="(item, index) in hosList" :key="index" v-if="item.text!=''">
          <div class="backwhite list" :hover-class="hoverclass">
            <span @click="getRecord(item.id)">{{item.text}}</span>
            <img  :src="copyno" class="icon " style="padding-top:10rpx;"  @click="copyTBL(item.text)" >
            <button  @click="onShareAppMessage(item.id)"  :hover="none"   ><img :src="shareno" class="icon icon-right" ></button>
          </div>
        </div>

        <!-- <div class="overh"  v-for="(item, index) in hosList" :key="index">
          <div class="backwhite list">
            <span @click="getRecord(item._id)">{{item.result.tag_list[0].label_name}}</span>
            <img :src="copyno" class="icon " style="padding-top:10rpx;"  @click="copyTBL(item.result.tag_list[0].label_name)" >
            <button @click="onShareAppMessage(item._id)"  hover-class="none"  open-type="share"><img :src="shareno" class="icon icon-right" ></button>
          </div>
        </div> -->
    </div>
    <div v-if="!ifrecord" style="color:#999; font-size:26rpx; margin-top:20rpx;">开启识别历史将获得更多体验</div>
    <!-- <div class="overh">
      <div class="backwhite list">
        <span >这是一支笔这是一支笔这是一支笔这是一支笔这是一支笔这是一支笔这是一支笔</span>
        <img :src="copyno" class="icon icon-right">
          <img :src="shareno" class="icon ">
      </div>
    </div> -->
    <!-- <div class="overh">
      <div class="backwhite list" >
        <span>这是一支笔这是一支笔这是一支笔</span>
        <div class="choobox">
          <img :src="copyno" class="icon ">
          <img :src="shareno" class="icon ">
          <img :src="del" class="icon ">
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>

export default {
  components: {
  },

  data () {
    return {
      userInfo: {},
      set:require('../../assets/images/icon-set.png'),
      copyno:require('../../assets/images/icon-copyno.png'),
      // copy:require('../../assets/images/icon-copy.png'),
      // share:require('../../assets/images/icon-share.png'),
      shareno:require('../../assets/images/icon-shareno.png'),
      del:require('../../assets/images/icon-del.png'),
      openid:'',
      hosList:[],
      ifrecord:true,
      hoverclass:'hoverclass',
    }
  },
  
  methods: {
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
                      if(res.data.userInfo.record=="1"){
                        that.ifrecord=false;
                      }
                      // console.log(that.ifrecord)
                    }
                  })
                  wx.request({
                    url: 'https://nannima.top/tencent/getRecord',
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST",
                    data: { limit: "10", skip: "0", openid:that.openid },
                    success: function (res) {
                      // that.hosList=res.data.list;
                      var datalist=[];
                       for( var j=0; j< res.data.list.length; j++){
                          var type =res.data.list[j].type;
                          var obj = {};

                          if(res.data.list[j].result.ret=="0"){
                            if(type=="花草识别" || type=="车辆识别"){
                              obj.id = res.data.list[j]._id;
                              obj.text = res.data.list[j].result.tag_list[0].label_name;
                              datalist.push(obj);
                            }else if(type=="图片翻译" ){
                              obj.id = res.data.list[j]._id;
                              // that.hrefresults=res.data.list[0].result.image_recordsList;
                              if (res.data.list[j].result.ret == 0) {
                              var image_records = res.data.list[j].result.image_recordsList;
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
                              obj.text = allConetent;
                              datalist.push(obj);
                            }else if(type=="看图说话"){
                              obj.id = res.data.list[j]._id;
                              obj.text = res.data.list[j].result.text;
                              datalist.push(obj);
                              // that.photore=res.data.resre;
                            }else if(type=="行驶证识别" || type=="驾驶证识别"){
                             obj.id = res.data.list[j]._id;
                                var content = "";
                                var item_list = res.data.list[j].result.item_list;
                                for (var i = 0; i < item_list.length; i++) {
                                  content = content + item_list[i].item+":"+item_list[i].itemstring + "\r\n";
                                }
                              obj.text = content;
                              datalist.push(obj);
                            }
                          }
                       }
                       that.hosList=datalist;
                      // console.log(that.hosList)
                    }
                  })
                  
                }
              })
           }else{
             console.log('获取用户登录状态失败'+res.errMsg)
           }

        }
        
      })
      


    },


    //点击查看原本结果
    getRecord:function(e){
      const that = this;
      wx.navigateTo({
        url: '../results/results?resultid='+e
      })
    },
     //复制
    copyTBL:function(e){  
        // var self=this;  
        wx.setClipboardData({  
          data: e,  
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
        // console.log(res)
        wx.navigateTo({
          url: '../results/results?resultid='+res+'&share=true'
        })
        // return {
        //   title: 'NAN',
        //   path: '/page/results/results?resultid='+res,
        //   success: function(res) {
        //     // 转发成功
        //   },
        //   fail: function(res) {
        //     // 转发失败
        //   }
        // }
      } ,

    //滑动事件处理
    touchstart: function (e) {
        const that= this;
        var e = e||window.event;  
        that.startPoint = e.mp.touches[0]; 
        
    },
    touchend: function (e) {
        const that= this; 
            var e=e||window.event;  
            //e.changedTouches能找到离开手机的手指，返回的是一个数组
            that.endPoint = e.mp.changedTouches[0];  
            //计算终点与起点的差值  
            var x = that.endPoint.clientX - that.startPoint.clientX;  
            var y = that.endPoint.clientY - that.startPoint.clientY;  
            //设置滑动距离的参考值  
            var d = 10;  
            if(Math.abs(x)>d){  
                if(x>0){  
                console.log("向右滑动");  
                }else{  
                console.log("向左滑动");  
                that.isActiveleft=true
                that.handmove='0'
                }  
            }  
            if(Math.abs(y)>d){  
                if(y>0){  
                // console.log("向下滑动");  
                }else{  
                // console.log("向上滑动");  
                }  
            }  
    },




    
  },
  created () {
   // 调用应用实例的方法获取全局数据
    this.getUserInfo()
    
  },
  onShow:function(){
     wx.setStorage({
      key:"navgo",
      data:"false"
    });
    wx.setStorage({
      key:"navgonum",
      data:"2"
    });
    const that= this;
     wx.request({
        url: 'https://nannima.top/tencent/getUserInfo',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: { openid:that.openid },
        success: function (res) {
          if(res.data.userInfo.record=="1"){
            that.ifrecord=false;
          }else{
             that.ifrecord=true;
          }

                  wx.request({
                    url: 'https://nannima.top/tencent/getRecord',
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST",
                    data: { limit: "10", skip: "0", openid:that.openid },
                    success: function (res) {
                      // that.hosList=res.data.list;
                      var datalist=[];
                       for( var j=0; j< res.data.list.length; j++){
                          var type =res.data.list[j].type;
                          var obj = {};
                          if(res.data.list[j].result.ret=="0"){
                            if(type=="花草识别" || type=="车辆识别"){
                              obj.id = res.data.list[j]._id;
                              obj.text = res.data.list[j].result.tag_list[0].label_name;
                              datalist.push(obj);
                            }else if(type=="图片翻译" ){
                              obj.id = res.data.list[j]._id;
                              // that.hrefresults=res.data.list[0].result.image_recordsList;
                              if (res.data.list[j].result.ret == 0) {
                              var image_records = res.data.list[j].result.image_recordsList;
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
                              obj.text = allConetent;
                              datalist.push(obj);
                            }else if(type=="看图说话"){
                              obj.id = res.data.list[j]._id;
                              obj.text = res.data.list[j].result.text;
                              datalist.push(obj);
                              // that.photore=res.data.resre;
                            }else if(type=="行驶证识别" || type=="驾驶证识别"){
                             obj.id = res.data.list[j]._id;
                                var content = "";
                                var item_list = res.data.list[j].result.item_list;
                                for (var i = 0; i < item_list.length; i++) {
                                  content = content + item_list[i].item+":"+item_list[i].itemstring + "\r\n";
                                }
                              obj.text = content;
                              datalist.push(obj);
                            }
                          }
                       }
                       that.hosList=datalist;
                      // console.log(that.hosList)
                    }
                  })
                  
          // console.log(that.ifrecord)
        }
      })
  },
}
</script>
<style  scoped>

.hoverclass {
  background: rgba(0, 0, 0, 0.04)!important;
}
.container {
  overflow-x: hidden;
}

.backwhite {
  background-color: #fff;
  padding: 30rpx 0;
  width: 100%;
  margin: 18rpx auto 28rpx;
  display: flex;
  align-items: center;
}
.img-head {
  width:97rpx;
  height: 97rpx; 
  border-radius: 50%;
  background-color: #fff;
   margin-left:28rpx;
   margin-right:38rpx;
}
.userinfo {
  font-size: 40rpx;
  color: #292839;
  display: inline-block;
}
.userinfo span {
    font-size: 26rpx;
    color: #999;
    display: block;
    margin-top: 4rpx;
}
.icon {
  width: 116rpx;
  height: 116rpx;
}
.icon-right {
  position: absolute;
  right: 10rpx;
  /* padding-top: 18rpx; */
}

h1 {
  width: 680rpx;
  margin: 20rpx auto;
  text-align: left;
  font-size: 40rpx;
  color: #292839;
}
.list {
  margin: 0;
  line-height: 40rpx;
  border:1rpx solid #ebebeb;
  margin-top: -1rpx;
  position: relative;
  z-index: 3;
  padding: 0rpx 0;
  /* padding-right: 270rpx; */
}
.list span {
  font-size: 26rpx;
  color: #999;
  margin-left: 40rpx;
  width: 500rpx;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  line-height: 120rpx;
}
.choobox {
  position: absolute;
  right: 0;
  background-color: #292839;
  padding:0 10rpx;
  display: flex;
  align-items: center;
  z-index: 1;
}
.overh {
 width: 100%;
 /* overflow:scroll; */
 overflow-x:hidden;
 overflow-y:hidden;
}
.overh::-webkit-scrollbar {display:none}


 button {
  /* width: 50%; */
  display: inline-block;
  /* text-align: center; */
  background: rgba(255, 255, 255, 0);
  padding-left: 90rpx;
  width: 16rpx;
  right: 4rpx;
 position: relative;
 top: -12rpx
}
 button::after{
  border:0;
  display: inline-block;
  background: rgba(255, 255, 255, 0);
  color: #fff;
  position: relative;
  overflow: visible;
  padding: 0;
  top: -2rpx;
  
}
</style>
