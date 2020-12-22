import Vue from "vue";
import VueRouter from "vue-router";
import store from '../store';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/home",
      name: "home",
      meta: {
        tabShow: true,
        activeId: 0,
        keepAlive: true,
      },
      component: () => import("@/pages/home/index.vue")
    },
    {
      path: "/water",
      name: "water",
      meta: {
        tabShow: true,
        activeId: 1,
        keepAlive: true,
      },
      component: () => import("@/pages/water/index.vue")
    },
    {
      path: "/pollute",
      name: "pollute",
      meta: {
        tabShow: true,
        activeId: 2,
        keepAlive: true,
      },
      component: () => import("@/pages/pollute/index.vue")
    },
    {
      path: "/voice",
      name: "voice",
      meta: {
        tabShow: true,
        activeId: 3,
        keepAlive: true,
      },
      component: () => import("@/pages/voice/index.vue")
    },
    {
      path: "/map",
      name: "map",
      meta: {
        tabShow: true,
        activeId: 4,
        keepAlive: true,
      },
      component: () => import("@/pages/map/index.vue")
    },
    // 首页选择站点
    {
      path: "/stationListSelect",
      name: "stationListSelect",
      meta: {
        tabShow: false,
        keepAlive: true,
      },
      component: () => import("@/pages/home/stationListSelect.vue")
    },
    // 首页今日峰值
    {
      path: "/peakvalue",
      name: "peakvalue",
      meta: {
        tabShow: false,
        keepAlive: true,
      },
      component: () => import("@/pages/home/peakvalue.vue")
    },
    // 首页今日达标
    {
      path: "/standard",
      name: "standard",
      meta: {
        tabShow: false,
        keepAlive: true,
      },
      component: () => import("@/pages/home/standard.vue")
    },
    // 首页污染日历
    {
      path: "/calendar",
      name: "calendar",
      meta: {
        tabShow: false,
        keepAlive: true,
      },
      component: () => import("@/pages/home/calendar.vue")
    },
      // 水站站点列表
    {
      path: "/stationList",
      name: "stationList",
      meta: {
        tabShow: false,
        keepAlive: true,
      },
      component: () => import("@/pages/water/stationList.vue")
    },
    // 水首页污染日历
    {
      path: "/calendarWater",
      name: "calendarWater",
      meta: {
        tabShow: false,
        keepAlive: true,
      },
      component: () => import("@/pages/water/calendar.vue")
    },
      // 水站考核分析
    {
      path: "/assessmentWater",
      name: "assessmentWater",
      meta: {
        tabShow: false,
        keepAlive: true,
      },
      component: () => import("@/pages/water/assessment.vue")
    },
    // 水环境首页选择站点
    {
      path: "/stationListSelectWater",
      name: "stationListSelectWater",
      meta: {
        tabShow: false,
        keepAlive: true,
      },
      component: () => import("@/pages/water/stationListSelectWater.vue")
    },
      // 水站历史数据
    {
      path: "/history",
      name: "history",
      meta: {
        tabShow: false,
        activeId: 1,
        keepAlive: true,
      },
      component: () => import("@/pages/water/history.vue")
    },
      // 气站站点列表
    {
      path: "/stationListAir",
      name: "stationListAir",
      meta: {
        tabShow: false,
        keepAlive: true,
      },
      component: () => import("@/pages/home/stationList.vue")
    },
      // 气站考核分析
    {
      path: "/assessmentAir",
      name: "assessmentAir",
      meta: {
        tabShow: false,
        keepAlive: true,
      },
      component: () => import("@/pages/home/assessment.vue")
    },
    {
      path: '/mine',
      name: 'mine',
      meta: {
        tabShow: false,
        keepAlive: true
      },
      component: () => import('@/pages/mine/index.vue')
    },
    {
      path: '/changePassword',
      name: 'changePassword',
      meta: {
        tabShow: false,
        keepAlive: true
      },
      component: () => import('@/pages/mine/changePassword.vue')
    },
    {
      path: '/qrcode',
      name: 'qrcode',
      meta: {
        tabShow: false,
        keepAlive: true
      },
      component: () => import('@/pages/mine/qrcode.vue')
    }
  ]
})
router.afterEach((to,from)=>{
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
  // 选中tab
  if( to.meta.tabShow ) {
    store.state.vuex.activeId = to.meta.activeId
  }
  store.state.vuex.tabShow = to.meta.tabShow
})
export default router;