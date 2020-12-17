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
    {
      path: "/stationList",
      name: "stationList",
      meta: {
        tabShow: false,
        keepAlive: true,
      },
      component: () => import("@/pages/water/stationList.vue")
    },
    {
      path: "/assessmentWater",
      name: "assessmentWater",
      meta: {
        tabShow: false,
        keepAlive: true,
      },
      component: () => import("@/pages/water/assessment.vue")
    },
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