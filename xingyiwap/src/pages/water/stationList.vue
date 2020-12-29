<template>
    <div>
        <van-nav-bar left-arrow @click-left="historyBack" :fixed="true" class="common-nav-bar">
            <template #title>
                水质站点列表
            </template>
            <template #right>
                <img src="../../assets/img/search.png" style="height: 18px; width: 18px" alt="">
            </template>
        </van-nav-bar>
        <div class="listContent">
            <van-tabs v-model="active" color="#216CD5">
                <van-tab title="市控站">
                    <div class="list">
                        <van-cell-group>
                            <template v-for="(item,index) in stationList">
                                <van-cell :title="item.stationName" @click="$router.push('/map')">
                                    <template #default>
                                        <div class="listRightContent">
                                            <div class="waterLevel">
                                                <span :class="'level'+(item.aRealData ? (item.aRealData.wq_tp+1) : 6)">水质等级</span>{{levelText[item.aRealData ? item.aRealData.wq_tp : 6]}}类
                                            </div>
                                            <img src="../../assets/img/dz.png" style="width: 17px; height: 17px" alt="">
                                        </div>
                                    </template>
                                </van-cell>
                            </template>
                        </van-cell-group>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
          return {
            active: 0,
            keyword: "",
            levelText: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ", "--"],
            stationList: [
            ]
          }
        },
        mounted() {

        },
      activated() {
        this.getStationList()
      },
      methods: {
          // 获取站点数据
          getStationList() {
              this.$http.get("/AirAppXY-Service/map/getRealStationWaterData").then(res=>{
                if( res.data.code == 200 ) {
                  this.stationList = res.data.content.info
                }
              })
          },
        }
    }
</script>

<style lang="less">
    @import "../../assets/css/pages/list.less";
</style>