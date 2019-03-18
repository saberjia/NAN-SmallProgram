<template>
    <div class="tabbar">
        <ul class="tabbar-ul">
            <li  :style="{backgroundImage: 'url(' +homeimg + ')'}">
                <router-link class="inner"  v-if="tab()" to="/">首页1</router-link>
                <router-link class="inner"  v-else to="/">{{tabactive}}首页2</router-link>
                <!-- 有问题！ -->
            </li>
            <li>
                <a href="/pages/chat/chat"  class="inner">聊天</a>
            </li>
            <li>
                <a href="/pages/logs/logs" class="inner">我的</a>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: "tabbar",
    props: {
        tabactive:String,
    },
    data(){
        return{
            homeimg:require('../../assets/images/icon-home.png')
        }
    },
    methods: {
         tab() {
            console.log(111) 
            var tabn = this.tabactive;
            if(tabn == "home"){
                return true
            }else{
                return false
            }
        }
    },

    created () {
    },
    updated(){ var sd
    }
}
</script>
<style  scoped>
    .tabbar {
        position: fixed;
        left: 0;
        bottom: 0;
        border-top: 1px solid #c1c0c5;
        width: 100%;
        height: 100rpx;
        background: #fff;
        z-index: 100;
       
    }
    .tabbar-ul{
        overflow: hidden;
        height:100rpx;
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        
    }
    .tabbar-ul li {
        width: 33.3%; 
        text-align: center;
    }
    .tabbar-ul li .inner {
        color: #292839;
        font-size: 20rpx;
        display: block;
        padding-top:40rpx;
    }
</style>
