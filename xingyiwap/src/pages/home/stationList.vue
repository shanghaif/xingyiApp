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
            <van-tabs v-model="active" color="#216CD5">
                <van-tab title="市控站">
                    <div class="list">
                        <van-cell-group>
                            <template v-for="(item,index) in stationList">
                                <van-cell :title="item.stationName" @click="$router.push('/map')">
                                    <template #default>
                                        <div class="listRightContent">
                                            <div class="waterLevel air">
                                                <span :class="'level'+(item.level+1)">AQI</span>{{(item.aRealData && item.aRealData.aqi) ? item.aRealData.aqi : '--'}}
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
            levelText: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ"],
            stationList: [
            ]
          }
        },
        mounted() {
            this.getAirStationList()
        },
        methods: {
            getAirStationList(){
                this.$http.get("/AirAppXY-Service/map/queryAirRealData").then(res=>{
                  if( res.data.code == 200 || res.data.code == 0 ) {
                    this.stationList = res.data.content.info
                    this.stationList.map((item)=>{
                      if( item.aRealData && item.aRealData.airQuality ) {
                        if( item.aRealData.airQuality.indexOf("优") != -1 ) {
                          item.level = 0
                        } else if( item.aRealData.airQuality.indexOf("良") != -1 ) {
                          item.level = 1
                        } else if( item.aRealData.airQuality.indexOf("轻度") != -1 ) {
                          item.level = 2
                        } else if( item.aRealData.airQuality.indexOf("中度") != -1 ) {
                          item.level = 3
                        } else if( item.aRealData.airQuality.indexOf("重度") != -1 ) {
                          item.level = 4
                        } else if( item.aRealData.airQuality.indexOf("严重") != -1 ) {
                          item.level = 5
                        }
                      } else {
                        item.level = 6
                      }
                    })
                    console.log(this.stationList, "hahah")
                  }
                })
            }
        }
    }
</script>

<style lang="less">
    @import "../../assets/css/pages/list.less";
</style>