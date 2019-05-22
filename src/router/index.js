import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'


// 创建组件
import Home from "@/components/Home";
import About from "@/components/About";



Vue.use(Router)


export default new Router({
  mode: "history",
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/about', name: 'About', component: About },
    // { path: '*', redirect: '/home' }   /*默认跳转路由*/
  ]
})
