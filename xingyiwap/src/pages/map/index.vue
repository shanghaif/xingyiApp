<template>
    <div style="position: relative">
        <van-nav-bar :fixed="true" class="common-nav-bar">
            <template #left>
                <img src="../../assets/img/user_icon.png" @click="$router.push({path: '/mine'})" style="height: 18px; width: 18px" alt="">
            </template>
            <template #title>
                <ul>
                    <li :class="activeClass[0]" @click="changeItem(0,'water')">水质</li>
                    <li :class="activeClass[1]" @click="changeItem(1,'air')">空气</li>
                    <li :class="activeClass[2]" @click="changeItem(2,'noise')">声环境</li>
                    <li :class="activeClass[3]" @click="changeItem(3,'poll')">污染源</li>
                </ul>
            </template>
            <template #right>
                <img src="../../assets/img/search.png" style="height: 18px; width: 18px" alt="">
            </template>
        </van-nav-bar>
        <div class="rightNav">
            <ul>
                <li><img src="../../assets/img/desc.png" style="max-width: 15.5px" />说明</li>
                <li @click="refresh"><img src="../../assets/img/refresh.png" style="max-width: 16px" />刷新</li>
                <li @click="jumpUrl(1)"><img src="../../assets/img/station.png" style="max-width: 12.5px" /><template v-if="navActive == 3">企业</template><template v-else>站点</template><br />列表</li>
                <li @click="jumpUrl(2)" v-if="navActive==0 || navActive==1"><img src="../../assets/img/kaohe.png" style="max-width: 11.5px" />考核<br />分析</li>
            </ul>
        </div>
        <baidu-map class="map" @click="hideInfo" ref="map" :center="options.center" :zoom="options.zoom" center="兴义市" @ready="initMap">
            <bm-label v-for="(item,index) in stationList.water" :key="index" v-if="stationList.water.length > 0 && navActive == 0" :content="item.aRealData ? levelText[item.aRealData.wq_tp] : '--'" :position="{lng:item.longitude,lat:item.latitude}" :labelStyle="Object.assign(label[item.aRealData ? item.aRealData.wq_tp : 6], baseStyle)" @click="showStationInfo(item,'water')" />
            <template v-for="(item,index) in stationList.air">
                <bm-overlay
                    pane="labelPane"
                    :class="'level'+(item.level+1)+' sample '+active[index]"
                    @draw="({el, BMap, map})=>{draw({el, BMap, map}, item)}"
                    @touchstart.native="showStationInfo(item,'air',index)"
                    v-show="stationList.air.length > 0 && navActive == 1"
                   >
                    <div class="airPoint">
                        <img :src="fxImg[item.fx ? item.fx : 2]" style="max-width: 21px" alt="">
                        <span class="airNumber">{{(item.aRealData && item.aRealData.aqi) ? item.aRealData.aqi : '--'}}</span><span class="airText">微型</span>
                    </div>
                </bm-overlay>
            </template>
            <bm-marker v-if="stationList.noise.data.length > 0 && navActive == 2" v-for="(item,index) in stationList.noise.data" :key="index" :icon="{url: item.noiseLevelNum ? voiceIcons[Number(item.noiseLevelNum)] : voiceIcons[0 ], size: {width: 24, height: 28}}" :position="{lng:item.longitude,lat:item.latitude}" @click="showStationInfo(item,'noise')"></bm-marker>
            <bm-marker v-if="stationList.poll.length > 0 && navActive == 3 && index < 140" v-for="(item,index) in stationList.poll" :key="index" :icon="{url: require('../../assets/img/icon/wry.png'), size: {width: 26, height: 26}}" :position="{lng:item.longitude,lat:item.latitude}" @click="showStationInfo(item,'poll')"></bm-marker>
        </baidu-map>
        <div class="stationInfo" @click="selectStations" v-if="navActive == 0 && show">
            <div class="title">
                <div class="left">
                    <img src="../../assets/img/pos.png" style="max-width: 13.5px">{{waterInfo.stationName}}
                </div>
                <div class="right">
                    <img src="../../assets/img/close.png" @click.stop="show = false" style="max-width: 24px">
                </div>
            </div>
            <div class="title time">
                <div class="left">
                    {{waterInfo.aRealData ? waterInfo.aRealData.spt : '--'}} &nbsp;<span class="waterIcon" :class="waterInfo.aRealData ? ( 'level' + ( waterInfo.aRealData.wq_tp + 1 ) ) : ''">{{waterInfo.aRealData ? levelText[waterInfo.aRealData.wq_tp] : '--'}}</span>
                </div>
                <div class="right">
                    目标水质：<span class="waterIcon" :class="waterInfo.targetLevel ? ('level'+(waterInfo.targetLevel+1)) : 'normal'">{{waterInfo.targetLevel ? levelText[waterInfo.targetLevel] : "--"}}</span>
                </div>
            </div>
            <ul class="fator water">
                <li>{{waterInfo.aRealData ? waterInfo.aRealData.codmn : '--'}}</li>
                <li>{{waterInfo.aRealData ? waterInfo.aRealData.nh3n : '--'}}</li>
                <li>{{waterInfo.aRealData ? waterInfo.aRealData.ph : '--'}}</li>
                <li>{{waterInfo.aRealData ? waterInfo.aRealData.tp : '--'}}</li>
                <li>{{waterInfo.aRealData ? waterInfo.aRealData.dox : '--'}}</li>
                <li>高锰酸盐</li>
                <li>氨氮</li>
                <li>pH值</li>
                <li>总磷</li>
                <li>溶解氧</li>
            </ul>
        </div>
<!--        <div class="airStationType" v-if="navActive == 1 && !show">-->
<!--            <ul>-->
<!--                <li :class="typeClass[0]" @click="changeType(0)">国控站（6）</li>-->
<!--                <li :class="typeClass[1]" @click="changeType(1)">省控站（6）</li>-->
<!--                <li :class="typeClass[2]" @click="changeType(2)">常规站（6）</li>-->
<!--                <li :class="typeClass[3]" @click="changeType(3)">微型站（6）</li>-->
<!--            </ul>-->
<!--        </div>-->
<!--        <div class="airStationType" v-if="navActive == 0 && !show">-->
<!--            <ul>-->
<!--                <li :class="typeClass[0]" @click="changeType(0)">国控站（6）</li>-->
<!--                <li :class="typeClass[1]" @click="changeType(1)">省控站（6）</li>-->
<!--                <li :class="typeClass[2]" @click="changeType(2)">市控站（6）</li>-->
<!--                <li :class="typeClass[3]" @click="changeType(3)">手工站（6）</li>-->
<!--            </ul>-->
<!--        </div>-->
        <div class="stationInfo" v-if="navActive == 1 && show">
            <div class="title">
                <div class="left">
                    <img src="../../assets/img/pos.png" style="max-width: 13.5px">{{airInfo.stationName}}
                </div>
                <div class="right">
                    <img src="../../assets/img/close.png" @click="show = false" style="max-width: 24px">
                </div>
            </div>
            <div class="title time">
                <div class="left">
                    {{airInfo.aRealData ? airInfo.aRealData.spt : '--'}} &nbsp;<span class="waterIcon air" :class="'level'+(airInfo.level+1)">{{airInfo.aRealData ? airInfo.aRealData.airQuality : '--'}}</span>
                </div>
                <div class="right">
                </div>
            </div>
            <ul class="fator">
                <li>{{(airInfo.aRealData && airInfo.aRealData.aqi) ? airInfo.aRealData.aqi : '--'}}</li>
                <li>{{(airInfo.aRealData && airInfo.aRealData.pm10) ? airInfo.aRealData.pm10 : '--'}}</li>
                <li>{{(airInfo.aRealData && airInfo.aRealData.so2) ? airInfo.aRealData.so2 : '--'}}</li>
                <li>{{(airInfo.aRealData && airInfo.aRealData.no2) ? airInfo.aRealData.no2 : '--'}}</li>
                <li>{{(airInfo.aRealData && airInfo.aRealData.co) ? airInfo.aRealData.co : '--'}}</li>
                <li>{{(airInfo.aRealData && airInfo.aRealData.o3) ? airInfo.aRealData.o3 : '--'}}</li>
                <li>AQI</li>
                <li>PM <sub>10</sub></li>
                <li>SO <sub>2</sub></li>
                <li>NO <sub>2</sub></li>
                <li>CO</li>
                <li>O <sub>3</sub></li>
            </ul>
        </div>
        <div class="stationInfo" v-if="navActive == 2 && show" @click="$router.push('/voiceDetail/'+noiseInfo.station_code)">
            <div class="title">
                <div class="left">
                    <img src="../../assets/img/pos.png" style="max-width: 13.5px">{{noiseInfo.station_name}}
                </div>
                <div class="right">
                    <img src="../../assets/img/close.png" @click.stop="show = false" style="max-width: 24px">
                </div>
            </div>
            <div class="title time">
                <div class="left">
                    {{noiseInfo.time || '--'}}
                </div>
                <div class="right">
                </div>
            </div>
            <div class="title time">
                <div><font style="font-size: 19px">{{noiseInfo.leq}}</font>dp(A) <span class="waterIcon noise" :class="'voice'+Number(noiseInfo.noiseLevelNum)">{{noiseInfo.noiseLevel ? noiseInfo.noiseLevel : '--'}}</span></div>
            </div>
            <p style="font-size: 15px; color: #666; margin-top: 10px">{{noiseInfo.station_address}}</p>
        </div>
        <div class="stationInfo" v-if="navActive == 3 && show">
            <div class="title">
                <div class="left">
                    <img src="../../assets/img/pos.png" style="max-width: 13.5px">{{pollInfo.name}}
                </div>
                <div class="right">
                    <img src="../../assets/img/close.png" @click="show = false" style="max-width: 24px">
                </div>
            </div>
            <div class="title time">
                <div class="left">
                    {{pollInfo.tradeName || '--'}}
                </div>
                <div class="right">
                </div>
            </div>
            <div class="title time">
                <div><span style="display: inline-block; padding: 2px 5px; background: #1E73D8; color: #fff">废水</span>&nbsp;&nbsp;--吨</div>
                <div><span style="display: inline-block; padding: 2px 5px; background: #1E73D8; color: #fff">废气</span>&nbsp;&nbsp;--万立方</div>
            </div>
            <p style="font-size: 15px; color: #666; margin-top: 10px">{{pollInfo.address}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "mapCom",
        data () {
          return {
            typeClass: ["active"],
            type: 0,
            voiceIcons: [
              require("../../assets/img/icon/voice0.png"),
              require("../../assets/img/icon/voice1.png"),
              require("../../assets/img/icon/voice2.png"),
              require("../../assets/img/icon/voice3.png"),
              require("../../assets/img/icon/voice4a.png"),
              require("../../assets/img/icon/voice4b.png"),
            ],
            show: false,
            active: [],
            isClickState: false,
            navActive: 0,
            levelText: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ"],
            activeClass: ["active"],
            options: {
              zoom: 12 ,
              center: {
                lng: 104.895830154,
                lat: 25.0965590049
              }
            },
            baseStyle: {
              width: "25px",
              height: "25px",
              borderRadius: "25px",
              border: 0,
              color: '#fff',
              display: 'flex',
              alignItems: "center",
              justifyContent: "center",
              fontSize : '12px',
            },
            label: [
              {  backgroundColor: "#CCFFFF"  },
              {  backgroundColor: "#00CCFF"  },
              {  backgroundColor: "#00FF00"  },
              {  backgroundColor: "#FFFF00"  },
              {  backgroundColor: "#FF9B00"  },
              {  backgroundColor: "#FF0000"  },
              {  backgroundColor: "#cccccc"  },
            ],
            fxImg: [
              require("../../assets/img/icon/b.png"),
              require("../../assets/img/icon/db.png"),
              require("../../assets/img/icon/d.png"),
              require("../../assets/img/icon/dn.png"),
              require("../../assets/img/icon/n.png"),
              require("../../assets/img/icon/xn.png"),
              require("../../assets/img/icon/x.png"),
              require("../../assets/img/icon/xb.png"),
            ],
            pointList: [],
            map: {},
            waterInfo: {},
            airInfo: {},
            noiseInfo: {},
            pollInfo: {},
            stationList: {
              water: [],
              air: [],
              noise: {
                data: []
              },
              poll: []
            },

          }
        },
        mounted() {
          this.getTestPoint()
        },
        activated() {
          this.getStationList()
        },
      methods: {
            jumpUrl(num){
              if( this.navActive == 0 && num == 1 ) {
                this.$router.push('/stationList')
              }else if( this.navActive == 0 && num == 2 ) {
                this.$router.push('/assessmentWater')
              } else if( this.navActive == 1 && num == 1 ) {
                this.$router.push('/stationListAir')
              } else if( this.navActive == 1 && num == 2 ) {
                this.$router.push('/assessmentAir')
              }
            },
            changeItem(num,type){
              this.activeClass      = []
              this.activeClass[num] = "active"
              this.show             = false
              this.navActive        = num
              this.active           = []
              this.getStationList(type)
            },
            // 获取百度地图对象
            initMap({BMap, map}){
              this.map = BMap
            },
            getTestPoint() {
              for (let key=0; key < 50; key++) {
                let obj = {}
                obj.point = {}
                if( key%2 == 0 ) {
                  obj.point.lng = this.options.center.lng + ( Math.random()/5 )
                  obj.point.lat = this.options.center.lat + ( Math.random()/5 )
                } else {
                  obj.point.lng = this.options.center.lng - ( Math.random()/5 )
                  obj.point.lat = this.options.center.lat - ( Math.random()/5 )
                }
                obj.level = Math.floor(Math.random() * 5) + 1;
                obj.fx    = Math.floor(Math.random() * 6) + 1;
                obj.fl    = Math.floor(Math.random() * 100);
                obj.type  = Math.floor(Math.random() * 4);
                if( obj.type == 0 ) {
                  obj.typeName = "国控"
                } else if( obj.type == 1 ) {
                  obj.typeName = "省控"
                } else if( obj.type == 2 ) {
                  obj.typeName = "常规"
                } else if( obj.type == 3 ) {
                  obj.typeName = "微型"
                }
                this.pointList.push(obj)
              }
            },
            showStationInfo(info, type, index=0){
              this.isClickState = true
              this.show = true
              this.active = []
              this.active[index] = "active"
              if( type == "water" ) {
                this.waterInfo = info
              } else if( type == "air" ) {
                this.airInfo = info
              } else if( type == "noise" ) {
                this.noiseInfo = info
              } else if( type == "poll" ) {
                this.pollInfo = info
              }
            },
            hideInfo({type, target, point, pixel, overlay}){
              if(overlay || this.isClickState) {
                this.isClickState = false
                return false;
              }
              this.active = []
              this.show = false
            },
            refresh(){
              window.location.reload(true)
            },
          draw ({el, BMap, map},item) {
            const pixel = map.pointToOverlayPixel(new BMap.Point(item.longitude, item.latitude))
            el.style.left = pixel.x - 60 + 'px'
            el.style.top = pixel.y - 20 + 'px'
          },
          // 切换站点类型
          changeType(num){
              this.typeClass      = []
              this.typeClass[num] = "active"
              this.type           = num
              this.active         = []
          },
          // 获取站点数据
          getStationList(type="water") {
              if( (type == "noise" && this.stationList[type].data.length==0) || this.stationList[type].length == 0 ) {
                let url = type == "water" ? "/AirAppXY-Service/map/getRealStationWaterData" : type == "air" ? "/AirAppXY-Service/map/queryAirRealData" : type == "noise" ? "/AirAppXY-Service/noise/noiseRealData" : '/AirAppXY-Service/pollutionSource/pollInfo'
                let params = {}
                if( type == "noise" ) {
                  params.stationType = "N_001,N_002,N_003"
                }
                this.$http.get(url, {params: params}).then(res=>{
                  if( res.data.code == 200 || res.data.code == 0 ) {
                    this.stationList[type] = res.data.content.info
                    if( type == "air" ) {
                      this.stationList[type].map((item)=>{
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
                    }
                  }
                })
              }
          },
          selectStations(){
              // this.$store.state.vuex.stationDataWater.id = this.waterInfo.stationCode
              // this.$store.state.vuex.stationDataWater.text = this.waterInfo.stationName
              // this.$store.state.vuex.stationDataWater.children = []
              // localStorage.setItem("stationDataWater",JSON.stringify(this.$store.state.vuex.stationDataWater))
              // this.$router.push("/water")
          }
        }
    }
</script>

<style lang="less" scoped>
    @borderColor: rgba(255, 255, 255, 0.7);
    @colorsWaterLevels: {
        level1: #CCFFFF;
        level2: #00CCFF;
        level3: #00FF00;
        level4: #FFFF00;
        level5: #FF9B00;
        level6: #FF0000;
    };
    @colorsLevels: {
        level1: #00E400;
        level2: #FFFF00;
        level3: #FF7E00;
        level4: #FF0000;
        level5: #99004C;
        level6: #7E0023;
        level7: #cccccc;
    };
    @colorsVoice: {
        voice0: #FFFF99;
        voice1: #62FA61;
        voice2: #6799FC;
        voice3: #EF7031;
        voice4: #FF0000;
        voice5: #EB22EB;
    };
    .map{
        width: 100%;
        height: 100vh;
    }
    .common-nav-bar{
        /deep/ .van-nav-bar__title{
            ul{
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid @borderColor;
                border-radius: 15px;
                padding: 0;
                margin: 0;
                overflow: hidden;
                li{
                    font-size: 14px;
                    padding: 3px 8px;
                    &:not(:last-child){
                        border-right: 1px solid @borderColor;
                    }
                    &.active{
                        background: #fff;
                        color: #216CD5;
                    }
                }
            }
        }
    }
    .stationInfo{
        position: absolute;
        left: 10px;
        right: 10px;
        bottom: 60px;
        background: #fff;
        border-radius: 4px;
        width: calc(100% - 40px);
        height: 120px;
        padding: 10px;
        .title{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .left{
                display: flex;
                align-items: center;
                color: #1A1A1A;
                font-size: 19px;
                img{
                    margin-right: 5px;
                }
            }
            .right{
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666666;
            }
            &.time{
              margin-top: 6px;
              .left{
                  color: #666666;
                  font-size: 15px;
              }
              .waterIcon{
                  white-space: nowrap;
                  margin-left: 5px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 13px;
                  color: #fff;
                  width: 20px;
                  height: 20px;
                  border-radius: 20px;
                  &.normal{
                      color: #1a1a1a;
                  }
                  each(@colorsWaterLevels, {
                      &.@{key} {
                          background: @value;
                      }
                  })
                  &.air{
                      width: auto;
                      each(@colorsLevels, {
                          &.@{key} {
                              background: @value;
                          }
                      })
                      border-radius: 0;
                      padding: 2px 8px;
                  }
                  &.noise{
                      width: auto;
                      each(@colorsVoice, {
                          &.@{key} {
                              background: @value;
                          }
                      })
                      border-radius: 0;
                      padding: 2px 8px;
                      display: inline-block;
                  }
              }
            }
        }
        .fator{
            display: flex;
            align-items: center;
            justify-content: space-around;
            flex-wrap: wrap;
            li{
                width: 16%;
                font-size: 14px;
                white-space: nowrap;
                text-align: center;
                margin-top: 10px;
                color: #1A1A1A;
            }
            &.water{
                li{
                    width: 19%;
                }
            }
        }
    }
    .airStationType{
        position: absolute;
        left: 10px;
        right: 10px;
        bottom: 60px;
        ul{
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #FFFFFF;
            box-shadow: 0px 3px 6px rgba(26, 26, 26, 0.11);
            padding: 10px 0;
            border-radius: 6px;
            li{
                flex: 1;
                font-size: 12px;
                color: #999999;
                text-align: center;
                &:not(:last-child){
                    border-right: 1px solid #ddd;
                }
                &.active{
                    color: #216CD5;
                }
            }
        }
    }
    .rightNav{
        position: absolute;
        top: 50px;
        right: 10px;
        z-index: 999;
        li{
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            border-radius: 10px;
            margin-top: 10px;
            width: 45px;
            min-height: 35px;
            padding: 5px 0;
            height: auto;
            background: #fff;
            text-align: center;
            font-size: 12px;
            box-shadow: 0px 3px 6px rgba(26, 26, 26, 0.11);
        }
    }
    .sample {
        img{
            position: absolute;
            top: -9px;
            left: -13px;
        }
        width: 60px;
        height: 23px;
        background: #24C768;
        each(@colorsLevels, {
            &.@{key} {
                background: @value;
            }
        })
        position: absolute;
        border-radius: 4px;
        .airPoint{
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: black;
            text-align: center;
            span{
                flex: 1;
                text-align: center;
            }
            .airNumber{
                font-size: 13px;
                color: #fff;
            }
            .airText{
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: #333333;
                background: #EEEEEE;
                height: calc(100% - 4px);
                margin: 2px;
                border-radius: 2px;
            }
        }
    }
    .sample.active {
        img{
            animation: myfirst 2s infinite;
        }
    }
    @keyframes myfirst {
        0% {
            transform: translate(0px, 0px);
        }
        50% {
            transform: translate(0px, -10px);
        }
        100% {
            transform: translate(0px, 0px);
        }
    }
</style>