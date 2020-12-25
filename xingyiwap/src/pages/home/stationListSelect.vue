<template>
    <div>
        <van-nav-bar left-arrow @click-left="historyBack" :fixed="true" class="common-nav-bar">
            <template #title>
                空气站点列表
            </template>
            <template #right>
                <img src="../../assets/img/search.png" style="height: 18px; width: 18px" alt="">
            </template>
        </van-nav-bar>
        <div class="listContent">
            <div class="list">
                <van-tree-select
                        @click-item="selectItem"
                        height="calc(100vh - 46px)"
                        v-if="showTree"
                        :active-id.sync="activeId"
                        :main-active-index.sync="activeIndex"
                        :items="stationTree"
                />
            </div>
<!--            <van-tabs v-model="active" color="#216CD5">-->
<!--                <van-tab title="区域">-->
<!--                    <div class="list">-->
<!--                        <van-cell-group>-->
<!--                            <template v-for="(item,index) in stationList">-->
<!--                                <van-cell :title="item.name" @click="selectItem(item)">-->
<!--                                </van-cell>-->
<!--                            </template>-->
<!--                        </van-cell-group>-->
<!--                    </div>-->
<!--                </van-tab>-->
<!--                <van-tab title="站点">-->
<!--                    -->
<!--                </van-tab>-->
<!--            </van-tabs>-->
        </div>
    </div>
</template>

<script>
    export default {
        data () {
          return {
            active: 0,
            activeIndex: 0,
            activeId: 0,
            levelText: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ"],
            stationList: [
              {
                name: "达力堵德站",
                level: 2
              },
              {
                name: "万峰湖九里堡站",
                level: 3
              },
              {
                name: "下纳灰河站",
                level: 3
              },
              {
                name: "万峰湖坝达章站",
                level: 4
              }
            ],
            stationTree: [],
            showTree: false
          }
        },
        mounted() {
          this.getStationList()
        },
        methods: {
            selectItem(item) {
              this.$store.state.vuex.stationData = item
              this.$router.push('/home')
            },
            // 获取站点列表
            getStationList(){
              this.$http.get("/AirAppXY-Service/map/queryTreeW", {params: {typeCode: 'MM', basinnOrAreaOrCustom: "type"}}).then(res=>{
                this.stationTree = res.data.content.info
                this.stationTree.unshift({text: "区域", id: "area", children: [{ text: "兴义市", id: null, children: [] }]})
                this.handleTree(this.stationTree)
              })
            },
            // 处理树
            handleTree(list){
              console.log(list, "shenme")
              list.map((item, index)=>{
                console.log(item, "null")
                if( index > 0 ) {
                  item.id   = item.nodeId
                  item.text = item.nodeName
                  if( item.children.length > 0 ) {
                    this.handleTree(item.children)
                  }
                }
              })
              this.showTree = true
            }
        }
    }
</script>

<style lang="less">
    @import "../../assets/css/pages/list.less";
    .list{
        margin-top: 0 !important;
        .van-tree-select__item--active{
            color: #0581EB !important;
        }
        .van-sidebar-item--select::before{
            background-color: #0581EB !important;
        }
    }
</style>