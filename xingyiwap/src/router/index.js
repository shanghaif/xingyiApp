import Vue from "vue";
import VueRouter from "vue-router";
import store from '../store';

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

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
      path: "/map/:type?/:code?",
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
        keepAlive: false,
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
    // 污染源列表
    {
      path: "/stationListPollute/:type?",
      name: "stationListPollute",
      meta: {
        tabShow: false,
        keepAlive: true,
      },
      component: () => import("@/pages/pollute/stationList.vue")
    },
    // 污染源列表, 地图进入
    {
      path: "/stationListPolluteMap/:type?",
      name: "stationListPolluteMap",
      meta: {
        tabShow: false,
        keepAlive: true,
      },
      component: () => import("@/pages/pollute/stationListMap.vue")
    },
    // 声环境列表
    {
      path: "/stationListVoice/:type?",
      name: "stationListVoice",
      meta: {
        tabShow: false,
        keepAlive: true,
      },
      component: () => import("@/pages/voice/stationList.vue")
    },
    // 声环境列表, 地图进入
    {
      path: "/stationListVoiceMap/:type?",
      name: "stationListVoiceMap",
      meta: {
        tabShow: false,
        keepAlive: true,
      },
      component: () => import("@/pages/voice/stationListMap.vue")
    },
    // 水首页污染日历
    {
      path: "/calendarWater",
      name: "calendarWater",
      meta: {
        tabShow: false,
        keepAlive: false,
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
    // 水站报表分析
    {
      path: "/reportWater",
      name: "reportWater",
      meta: {
        tabShow: false,
        activeId: 1,
        keepAlive: true,
      },
      component: () => import("@/pages/water/report.vue")
    },
    ,
    // 气站报表分析
    {
      path: "/report",
      name: "report",
      meta: {
        tabShow: false,
        activeId: 1,
        keepAlive: true,
      },
      component: () => import("@/pages/home/report.vue")
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
      // 声环境点位详情
    {
      path: "/voiceDetail/:code",
      name: "voiceDetail",
      meta: {
        tabShow: false,
        activeId: 3,
        keepAlive: false,
      },
      component: () => import("@/pages/voice/detail.vue")
    },
    // 污染源详情
    {
      path: "/pollDetail/:code",
      name: "pollDetail",
      meta: {
        tabShow: false,
        activeId: 3,
        keepAlive: false,
      },
      component: () => import("@/pages/pollute/detail.vue")
    },
    // 空气点位详情
    {
      path: "/airDetail/:code",
      name: "airDetail",
      meta: {
        tabShow: false,
        activeId: 3,
        keepAlive: false,
      },
      component: () => import("@/pages/home/detail.vue")
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
  // 初始化选择站点
  if( localStorage.getItem("stationData") && !store.state.vuex.stationData.id ) {
    store.state.vuex.stationData = JSON.parse(localStorage.getItem("stationData"))
  } else if( !localStorage.getItem("stationData") && !store.state.vuex.stationData.text ) {
    store.state.vuex.stationData = {id: null, text: "兴义市"}
  }
  if( localStorage.getItem("stationDataWater") && !store.state.vuex.stationDataWater.id ) {
    store.state.vuex.stationDataWater = JSON.parse(localStorage.getItem("stationDataWater"))
  }
  store.state.vuex.tabShow = to.meta.tabShow
})

export default router;