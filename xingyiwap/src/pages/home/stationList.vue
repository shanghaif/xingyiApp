<template>
    <div>
        <van-nav-bar v-if="!showSearch" left-arrow @click-left="historyBack" :fixed="true" class="common-nav-bar">
            <template #title>
                空气站点列表
            </template>
            <template #right>
                <img @click="showSearch = true" src="../../assets/img/search.png" style="height: 18px; width: 18px" alt="">
            </template>
        </van-nav-bar>
        <van-search
                v-if="showSearch"
                v-model="searchValue"
                show-action
                shape="round"
                background="#0184FF"
                placeholder="请输入站点名称"
        >
            <template #action>
                <div class="searchBtn">
                    <span @click="searchFun">搜索</span>
                    <span @click="showSearch = false">取消</span>
                </div>
            </template>
        </van-search>
        <div class="listContent">
            <van-tabs v-model="active" color="#216CD5">
                <van-tab title="国控站">
                    <div class="list">
                        <van-cell-group>
                            <template v-for="(item,index) in stationList" v-if="item.controlorLevel == 'GUO0000'">
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
                <van-tab title="省控站">
                    <div class="list">
                        <van-cell-group>
                            <template v-for="(item,index) in stationList" v-if="item.controlorLevel == 'SHE0000'">
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
                <van-tab title="微型站">
                    <div class="list">
                        <van-cell-group>
                            <template v-for="(item,index) in stationList" v-if="item.stationType == 'A_002'">
                                <van-cell :title="item.stationName" @click="$router.push('/map/1/'+item.stationCode)">
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
            showSearch: false,
            searchValue: '',
            active: 2,
            levelText: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ"],
            stationList: [
            ],
            initList: []
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
                    this.initList = JSON.parse(JSON.stringify(this.stationList))
                  }
                })
            },
              searchFun(){
                this.stationList = JSON.parse(JSON.stringify(this.initList))
                if( this.searchValue ) {
                  this.stationList = this.stationList.filter(item=>item.stationName.indexOf(this.searchValue)>=0)
                }
              }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/css/pages/list.less";
    .van-search{
        position: fixed;
        top: 0;
        height: 47px;
        z-index: 999;
        width: 100vw;
    }
    .searchBtn{
        span{
            color: #fff;
            &:first-child{
                margin-right: 10px;
            }
        }
    }
</style>