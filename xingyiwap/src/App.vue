<template>
  <div id="app">
    <keep-alive>
      <router-view class="router-view" :class="{'has-footer': $store.state.vuex.tabShow}" v-if="$route.meta.keepAlive && isRouterAlive"></router-view>
    </keep-alive>
    <router-view class="router-view" :class="{'has-footer': $store.state.vuex.tabShow}" v-if="!$route.meta.keepAlive && isRouterAlive"></router-view>
    <van-tabbar v-model="$store.state.vuex.activeId" v-if="$store.state.vuex.tabShow">
      <van-tabbar-item
              v-for="(item,index) in tabbarItems"
              :key="index"
              :to="item.name"
              @change="changeItem"
      >
        <span>{{item.title}}</span>
        <template slot="icon" slot-scope="props">
          <img :src="props.active ? item.active : item.normal">
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>

export default {
  name: 'App',
  provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    }
  },
  data(){
    return {
      // active: 0,
      isRouterAlive: true,
      tabbarItems: [
        {
          name: '/home',
          title: '空气',
          normal: require('./assets/img/nav/kongqi_normal.png'),
          active: require('./assets/img/nav/kongqi_active.png')
        },
        {
          name: '/water',
          title: '水质',
          normal: require('./assets/img/nav/shuizhi_normal.png'),
          active: require('./assets/img/nav/shuizhi_active.png')
        },
        {
          name: '/pollute',
          title: '污染源',
          normal: require('./assets/img/nav/wuranyuan_normal.png'),
          active: require('./assets/img/nav/wuranyuan_active.png')
        },
        {
          name: '/voice',
          title: '声环境',
          normal: require('./assets/img/nav/shenghuanjing_normal.png'),
          active: require('./assets/img/nav/shenghuanjing_active.png')
        },
        {
          name: '/map',
          title: '地图',
          normal: require('./assets/img/nav/ditu_normal.png'),
          active: require('./assets/img/nav/ditu_active.png')
        },
      ]
    }
  },
  mounted() {
    
  },
  methods: {
    changeItem(key){
      // this.active = key
    },
    reload () {
      console.log("刷新页面！！！")
      this.isRouterAlive = false;            //先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true;         //再打开
      })
    }
  }
}
</script>

<style lang="less">
@import "assets/css/index.less";
#app{
  background: #EDF1F5;
}
</style>
