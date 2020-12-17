import Vue from 'vue'
import App from './App.vue'
// 引入vant
import {
  Button,
  Step,
  Steps,
  PullRefresh,
  NavBar,
  List,
  Image,
  Cell,
  CellGroup,
  Collapse,
  CollapseItem,
  NumberKeyboard,
  Field,
  Popup,
  DatetimePicker,
  Overlay,
  Switch,
  Tab, Tabs,
  Tag,
  Icon,
  Picker,
  TreeSelect,
  Uploader,
  ActionSheet,
  Search,
  Checkbox,
  CheckboxGroup,
  Tabbar,
  TabbarItem,
  Swipe,
  SwipeItem,
  Grid, GridItem,
  Dialog,
  DropdownMenu, DropdownItem,
  IndexBar, IndexAnchor,
  Divider,
  Slider,
  Progress,
  ImagePreview,
  Toast,
  RadioGroup,
  Radio
} from 'vant'
import 'vant/lib/index.css'
// 引入vuex
import store from "./store";
// 引入vue-router
import router from "./router";
// 引入echarts
import * as echarts from 'echarts'
// 日期格式化
import time from "./libs/time";
// 百度地图
import BaiduMap from "vue-baidu-map";
// 返回功能
import historyBack from "./libs/historyBack";
Vue.use(time)
Vue.use(BaiduMap,{key: "MjvG4rIZL3MbcnWHG8fiz5kZ"})
Vue.prototype.historyBack = historyBack
Vue.prototype.$echarts = echarts;
Vue.use(PullRefresh).use(List).use(Image).use(Cell).use(CellGroup).use(NavBar).use(Collapse).use(CollapseItem)
    .use(Button).use(Step).use(Steps).use(NumberKeyboard).use(Field).use(Popup).use(DatetimePicker).use(Overlay).use(Switch).use(Tab).use(Tabs)
    .use(Tag).use(Icon).use(Picker).use(TreeSelect).use(Uploader).use(ActionSheet).use(Search).use(Checkbox).use(CheckboxGroup).use(Tabbar).use(TabbarItem)
    .use(Swipe).use(SwipeItem).use(Grid).use(GridItem).use(Dialog).use(DropdownMenu).use(DropdownItem).use(IndexBar).use(IndexAnchor).use(Divider).use(Slider).use(Progress)
    .use(ImagePreview).use(Toast).use(RadioGroup).use(Radio)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
