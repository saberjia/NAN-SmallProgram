import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    pages: [
      '^pages/index/index',
      'pages/logs/logs',
      'pages/counter/counter',
      'pages/chat/chat',
      'pages/chatx/chatx',
      
      'pages/my/my',
      'pages/set/set',
      'pages/results/results',
      'pages/more/more'], // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#292839',
      navigationBarTitleText: '首页',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      color:"#999",
      borderAtyle:"",
      selectedColor:"#292839",
      list: [{
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "static/img/icon-homeno.png",
        "selectedIconPath": "static/img/icon-home.png"
      },
      {
        "pagePath": "pages/chat/chat",
        "text": "聊天",
        "iconPath": "static/img/icon-messageno.png",
        "selectedIconPath": "static/img/icon-message.png"
      },
      {
        "pagePath": "pages/my/my",
        "text": "我的",
        "iconPath": "static/img/icon-myno.png",
        "selectedIconPath": "static/img/icon-my.png"
      }]
    },
    "networkTimeout": {
      "request": 10000,
      "downloadFile": 10000
    },
    "debug": true
  },
}
