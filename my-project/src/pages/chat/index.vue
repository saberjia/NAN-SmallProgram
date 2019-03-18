<template>
  <div >
  </div>
</template>

<script>
export default {

  data () {
    return {
    }
  },
  
  methods: {
    

  },
  //第一次页面渲染完之后滚动条在最底部
  mounted(){
   
  },
  created () {
    
  },
  onShow:function(){
    wx.getStorage({
      key: 'navgo',
      complete: function(res) {
        if(res.data=="false"){
            wx.navigateTo({
                url: '../chatx/chatx'
            }) 
        }
           
      },
      fail:function(res){
          wx.setStorage({
              key:"navgo",
              data:"false"
          })
          wx.navigateTo({
              url: '../chatx/chatx'
          }) 
      } 
    })
   

  },
}
</script>