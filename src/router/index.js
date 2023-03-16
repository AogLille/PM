import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import test from "@/views/test";

// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题
// push
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}



// replace
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return originalReplace.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  //路由重定向
  // {
  //   path: '/', redirect: '/test',
  // },
  {
    path: '/test',
    name: 'test',
    meta: {
      requireAuth: true
    },
    component: test
  },
  {
    path: '/',
    name: 'Login',
    component: () => import("../views/Login")
  },
  {
    path: '/index',
    name: 'index',
    meta: {
      requireAuth: true
    },
    component: () => import("../views/index")
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("../views/Login")
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      requireAuth: true
    },
    component: () => import("../views/register")
  },

  //下面是模板页移植过来的
  {
    path: '/templateIndex',
    name: 'templateApp',
    component: () => import("../views/templateApp")
  },
  {
    path: '/HomeView',
    name: 'home',
    component: HomeView
  },
  {
    path: '/RealHome',
    name: 'realhome',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/RealHome.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
