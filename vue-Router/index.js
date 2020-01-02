import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

//比如里的login 不需要路由守卫
//home需要路由守卫 ,则需要 meta: { requireAuth: true }
export default new Router({
    routes: [{
        path: '/',
        component: resolve => require(['@/views/Login'], resolve)
    },{
        path: '/home',
        meta: { requireAuth: true },
        component: resolve => require(["@/views/home"],resolve)
    }
    ]
})