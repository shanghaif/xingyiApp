<template>
    <div style="position: relative">
        <van-nav-bar :fixed="true" class="common-nav-bar" v-if="!showSearch">
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
        <div class="rightNav">
            <ul>
<!--                <li><img src="../../assets/img/desc.png" style="max-width: 15.5px" />说明</li>-->
                <li @click="refresh"><img src="../../assets/img/refresh.png" style="max-width: 16px" />刷新</li>
                <li @click="jumpUrl(1)"><img src="../../assets/img/station.png" style="max-width: 12.5px" /><template v-if="navActive == 3">企业</template><template v-else>站点</template><br />列表</li>
                <li @click="jumpUrl(2)" v-if="navActive==0 || navActive==1"><img src="../../assets/img/kaohe.png" style="max-width: 11.5px" />考核<br />分析</li>
            </ul>
        </div>
        <baidu-map class="map" @click="hideInfo" ref="map" :center="options.center" :zoom="options.zoom" center="兴义市" @ready="initMap">
            <bm-label v-for="(item,index) in stationList.water" :key="index" v-if="stationList.water.length > 0 && navActive == 0 && ((item.controlorLevel == 'GUO0000' && typeClass[0][0] == 'active') || (item.controlorLevel == 'SHE0000' && typeClass[0][1] == 'active') || (item.controlorLevel == 'SHI0000' && item.monitorType == '1' && typeClass[0][2] == 'active') || (((item.monitorType == waterSgType) || (item.stationType == waterSgType)) && typeClass[0][3] == 'active'))" :content="item.aRealData ? levelText[item.aRealData.wq_tp] : '--'" :position="{lng:item.longitude,lat:item.latitude}" :labelStyle="Object.assign(label[item.aRealData ? item.aRealData.wq_tp : 6], baseStyle)" @click="showStationInfo(item,'water')" />
            <template v-for="(item,index) in stationList.air">
                <bm-overlay
                    pane="labelPane"
                    :class="'level'+(item.level+1)+' sample '+active[index]"
                    @draw="({el, BMap, map})=>{draw({el, BMap, map}, item)}"
                    @touchstart.native="showStationInfo(item,'air',index)"
                    v-show="stationList.air.length > 0 && navActive == 1 && typeClass[1][2] == 'active'"
                   >
                    <div class="airPoint">
<!--                        <img :src="fxImg[item.fx ? item.fx : 2]" style="max-width: 21px" alt="">-->
                        <span class="airNumber">{{(item.aRealData && item.aRealData.aqi) ? item.aRealData.aqi : '--'}}</span><span class="airText">微型</span>
                    </div>
                </bm-overlay>
            </template>
            <bm-marker v-if="stationList.noise.data.length > 0 && navActive == 2 && item.station_type_code == noiseType" v-for="(item,index) in stationList.noise.data" :key="index" :icon="{url: item.noiseLevelNum ? voiceIcons[Number(item.noiseLevelNum)] : voiceIcons[0 ], size: {width: 24, height: 28}}" :position="{lng:item.longitude,lat:item.latitude}" @click="showStationInfo(item,'noise')"></bm-marker>
            <bml-marker-clusterer v-if="navActive == 3 && stationList.poll.length > 0" :averageCenter="true" :styles="[{url: require('../../assets/img/bg_map.png'),size: {width: 30, height: 30}, textColor: '#fff'}]">
                <div v-if="navActive == 3 && stationList.poll.length > 0 && typeClass[3][0] == 'active' && index<showIndex" v-for="(item,index) in stationList.poll" :key="index">
                    <bm-marker :icon="{url: require('../../assets/img/icon/wry.png'), size: {width: 26, height: 26}}" :position="{lng:item.longitude,lat:item.latitude}" @click="showStationInfo(item,'poll')"></bm-marker>
                </div>
            </bml-marker-clusterer>
            <bml-marker-clusterer v-else :averageCenter="true">
                <div v-if="navActive == 3 && stationList.poll.length > 0 && typeClass[3][0] == 'active' && index<showIndex" v-for="(item,index) in stationList.poll" :key="index">
                    <bm-marker :icon="{url: require('../../assets/img/icon/wry.png'), size: {width: 26, height: 26}}" :position="{lng:item.longitude,lat:item.latitude}" @click="showStationInfo(item,'poll')"></bm-marker>
                </div>
            </bml-marker-clusterer>
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
                    目标水质：<span class="waterIcon" :class="waterInfo.targetLevel ? ('level'+(Number(waterInfo.targetLevel)+1)) : 'level4'">{{waterInfo.targetLevel ? levelText[Number(waterInfo.targetLevel)] : "Ⅳ"}}</span>
                </div>
            </div>
            <ul class="fator water">
                <li v-for="(item,index) in factorList" :key="index">
                    {{(waterInfo.aRealData && waterInfo.aRealData[item.cd]) ? waterInfo.aRealData[item.cd] : '--'}}
                    <span class="desc">{{item.monitoring_factor_nm}}</span>
                </li>
            </ul>
        </div>
        <div class="airStationType" v-if="navActive == 0 && !show">
            <ul>
                <li :class="typeClass[0][0]" @click="changeType(0,0)">国控站（{{stationNum.water.gk || '--'}}）</li>
                <li :class="typeClass[0][1]" @click="changeType(1,0)">省控站（{{stationNum.water.sek || '--'}}）</li>
                <li :class="typeClass[0][2]" @click="changeType(2,0)">市控站（{{stationNum.water.sk || '--'}}）</li>
                <li :class="typeClass[0][3]" @click="changeType(3,0)">{{waterTextLx}}</li>
            </ul>
        </div>
        <div class="airStationType" v-if="navActive == 1 && !show">
            <ul>
                <li :class="typeClass[1][0]" @click="changeType(0,1)">国控站（--）</li>
                <li :class="typeClass[1][1]" @click="changeType(1,1)">省控站（--）</li>
                <li :class="typeClass[1][2]" @click="changeType(2,1)">微型站（{{stationList.air.length}}）</li>
            </ul>
        </div>
        <div class="airStationType" v-if="navActive == 2 && !show">
            <ul>
                <li :class="typeClass[2][0]" @click="changeType(0,2)">道路交通（{{voiceCount.N_003}}）</li>
                <li :class="typeClass[2][1]" @click="changeType(1,2)">城市区域（{{voiceCount.N_001}}）</li>
                <li :class="typeClass[2][2]" @click="changeType(2,2)">城市功能区（{{voiceCount.N_002}}）</li>
            </ul>
        </div>
        <div class="airStationType" v-if="navActive == 3 && !show">
            <ul>
                <li :class="typeClass[3][0]" @click="changeType(0,3)">企业（{{stationList.poll.length}}）</li>
                <li :class="typeClass[3][1]" @click="changeType(1,3)">废水排口（--）</li>
                <li :class="typeClass[3][2]" @click="changeType(2,3)">废气排口（--）</li>
            </ul>
        </div>
        <div class="stationInfo" v-if="navActive == 1 && show"  @click="$router.push('/airDetail/'+airInfo.stationCode)">
            <div class="title">
                <div class="left">
                    <img src="../../assets/img/pos.png" style="max-width: 13.5px">{{airInfo.stationName}}
                </div>
                <div class="right">
                    <img src="../../assets/img/close.png" @click.stop="show = false" style="max-width: 24px">
                </div>
            </div>
            <div class="title time">
                <div class="left">
                    {{airInfo.aRealData ? airInfo.aRealData.spt : '--'}} &nbsp;<span class="waterIcon air" :class="'level'+(airInfo.level+1)">{{airInfo.aRealData ? airInfo.aRealData.airQuality : '--'}}</span>
                </div>
                <div class="right">
                </div>
            </div>
            <ul class="fator water">
                <li v-for="(item,index) in factorList" :key="index">
                    {{(airInfo.aRealData && airInfo.aRealData[item.cd]) ? airInfo.aRealData[item.cd] : '--'}}
                    <span class="desc">{{item.monitoring_factor_nm}}</span>
                </li>
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
        <!--污染源类型-->
        <van-popup v-model="waterTypeLx" position="bottom">
            <van-picker
                show-toolbar
                :default-index="0"
                :columns="waterColumnsLx"
                @confirm="onWaterConfirmLx"
                @cancel="waterTypeLx = false"
            />
        </van-popup>
    </div>
</template>

<script>
  // 按需引入点聚合
    import { BmlMarkerClusterer } from 'vue-baidu-map'
    export default {
        name: "mapCom",
        components: {
          BmlMarkerClusterer,
        },
        data () {
          return {
            showSearch: false,
            searchValue: "",
            waterTypeLx: false,
            waterTextLx: "手工站",
            waterColumnsLx: ["手工站"],
            waterIndexLx: ["0"],
            waterTypeList: [],
            waterSgType: "0",
            typeClass: [
                ["","","active"],
                ["", "", "active"],
                ["active"],
                ["active"]
            ],
            type: 2,
            factorList: [],
            showIndex: 1140,
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
            noiseType: "N_003",
            isClickState: false,
            navActive: 0,
            levelText: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ"],
            activeClass: ["active"],
            options: {
              zoom: 10,
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
            map: "",
            waterInfo: {},
            voiceCount: {
              N_001: 0,
              N_002: 0,
              N_003: 0
            },
            BMap: {},
            initPoint: {},
            airInfo: {},
            noiseInfo: {},
            pollInfo: {},
            typeHandler: "water",
            stationList: {
              water: [],
              air: [],
              noise: {
                data: []
              },
              poll: []
            },
            stationNum: {
              water: {
                sk: 0,
                gk: 0,
                sek: 0,
                sgz: 0
              }
            }
          }
        },
        mounted() {
          this.getWaterNum()
        },
        watch: {
          navActive(newVal,oldVal) {
            this.searchValue = ""
          }
        },
        activated() {
          if( this.$route.params.type ) {
            let type = this.$route.params.type
            this.navActive         = type
            this.activeClass       = []
            this.activeClass[type] = "active"
            if( type == 0 ){
              this.getStationList("water",()=>{
                if( this.$route.params.code ) {
                  let code = this.$route.params.code
                  if( this.stationList.water.length > 0 ) {
                    this.stationList.water.map((item,index)=>{
                      if( item.stationCode == code ) {
                        this.showStationInfo(item,"water",0,false)
                        if( item.controlorLevel == "GUO0000" ) {  // 国控站
                          this.changeType(0,0)
                        } else if( item.controlorLevel == "SHE0000" ) { // 省控站
                          this.changeType(1,0)
                        } else if( item.controlorLevel == "SHI0000" && item.monitorType == "1" ) { // 省控站
                          this.changeType(2,0)
                        } else if( item.monitorType == "0" ) {
                          this.changeType(3,0)
                          this.onWaterConfirmLx(this.waterColumnsLx[0],0)
                        }
                      }
                    })
                  }
                }
              })
            } else if( type == 1 ) {
              this.getStationList("air",()=>{
                if( this.$route.params.code ) {
                  let code = this.$route.params.code
                  if( this.stationList.air.length > 0 ) {
                    this.stationList.air.map((item,index)=>{
                      if( item.stationCode == code ) {
                        this.showStationInfo(item,"air",0,false)
                      }
                    })
                  }
                }
              })
            } else if( type == 3 ) {
              this.getStationList("poll",()=>{
                if( this.$route.params.code ) {
                  let code = this.$route.params.code
                  if( this.stationList.poll.length > 0 ) {
                    this.stationList.poll.map((item,index)=>{
                      if( item.id == code ) {
                        this.pollInfo = item
                        this.show     = true
                      }
                    })
                  }
                }
              })
            } else if( type == 2 ) {
              this.getStationList("noise",()=>{
                if( this.$route.params.code ) {
                  let code = this.$route.params.code
                  if( this.stationList.noise.data.length > 0 ) {
                    this.stationList.noise.data.map((item,index)=>{
                      if( item.station_code == code ) {
                        this.noiseInfo = item
                        this.show      = true
                      }
                    })
                  }
                }
              })
            }
          } else {
            this.navActive         = 0
            this.activeClass       = []
            this.activeClass[0]    = "active"
            this.show              = false
            this.getStationList()
          }
        },
      methods: {
            onWaterConfirmLx(value,index){
                this.waterTextLx = value
                this.waterTypeLx = false
                this.waterSgType = this.waterIndexLx[index]
            },
            searchFun(){
                if( this.searchValue ) {
                  if( this.navActive == 0 ) {
                    this.stationList.water.forEach((item,index)=>{
                      if( item.stationName.indexOf(this.searchValue) !== -1 ) {
                        this.$http.get("/AirAppXY-Service/map/queryStationMontFactors", {params:{mns: item.stationCode}}).then(res=>{
                          if( res.data.code == 200 ) {
                            this.factorList = res.data.content.info
                            this.show = true
                          }
                        })
                        this.waterInfo = item
                      }
                    })
                  } else if( this.navActive == 1 ) {
                    this.stationList.air.forEach((item,index)=>{
                      if( item.stationName.indexOf(this.searchValue) !== -1 ) {
                        this.$http.get("/AirAppXY-Service/map/queryStationMontFactors", {params:{mns: item.stationCode}}).then(res=>{
                          if( res.data.code == 200 ) {
                            this.factorList = res.data.content.info
                            this.show = true
                          }
                        })
                        this.airInfo = item
                      }
                    })
                  } else if( this.navActive == 2 ) {
                    this.stationList.noise.data.forEach((item,index)=>{
                      if( item.station_name.indexOf(this.searchValue) !== -1 ) {
                        this.noiseInfo = item
                        this.show      = true
                      }
                    })
                  } else if( this.navActive == 3 ) {
                    this.stationList.poll.forEach((item,index)=>{
                      if( item.name.indexOf(this.searchValue) !== -1 ) {
                        this.pollInfo  = item
                        this.show      = true
                      }
                    })
                  }
                }
            },
            getWaterNum(){
              this.$http.get("/AirAppXY-Service/map/stationTypeStatistics",{params:{typeCode: "W"}}).then(res=>{
                if( res.data.code == 200 || res.data.code == 0 ) {
                  this.waterTypeList = res.data.content.dataList
                  this.waterTypeList.forEach((item,index)=>{
                    if( item.station_level_code == "GUO0000" ) {
                      this.stationNum.water.gk = this.stationNum.water.gk + item.num
                    } else if( item.station_level_code == "SHE0000" ) {
                      this.stationNum.water.sek = this.stationNum.water.sek + item.num
                    } else if( item.station_level_code == "SHI0000" && item.monitor_type == "1" ) {
                      this.stationNum.water.sk = this.stationNum.water.sk + item.num
                    }
                    if( item.monitor_type == "0" ) {
                      this.stationNum.water.sgz = this.stationNum.water.sgz + item.num
                      this.waterColumnsLx.push(item.stationTypeName+"（"+item.num+"）")
                      this.waterIndexLx.push(item.stationTypeCode)
                    }
                  })
                  this.waterTextLx = this.waterColumnsLx[0] = this.waterColumnsLx[0] + "（"+this.stationNum.water.sgz+"）"
                }
              })
            },
            jumpUrl(num){
              if( this.navActive == 0 && num == 1 ) {
                this.$router.push('/stationList/'+this.type+'/'+this.waterSgType)
              }else if( this.navActive == 0 && num == 2 ) {
                this.$router.push('/assessmentWater')
              } else if( this.navActive == 1 && num == 1 ) {
                this.$router.push('/stationListAir')
              } else if( this.navActive == 1 && num == 2 ) {
                this.$router.push('/assessmentAir')
              } else if( this.navActive == 2 && num == 1 ){
                this.$router.push('/stationListVoiceMap/'+this.noiseType)
              } else if( this.navActive == 3 && num == 1 ) {
                this.$router.push('/stationListPolluteMap')
              }
            },
            changeItem(num,type){
              if( this.$route.params.code || this.$route.params.type ) {
                this.$router.replace("/map")
              }
              this.activeClass      = []
              this.activeClass[num] = "active"
              this.show             = false
              this.navActive        = num
              this.active           = []
              this.typeHandler      = type
              this.getStationList(type)
            },
            // 获取百度地图对象
            initMap({BMap, map}){
              this.map = map
              this.BMap = BMap
              this.initPoint = new this.BMap.Point(this.options.center.lng, this.options.center.lat);
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
            showStationInfo(info, type, index=0, isClickState=true){
              let point = new this.BMap.Point(info.longitude, info.latitude);
              this.map.setCenter(point);
              this.isClickState = isClickState
              if( type == "water" || type == "air" ) {
                this.$http.get("/AirAppXY-Service/map/queryStationMontFactors", {params:{mns: info.stationCode}}).then(res=>{
                  if( res.data.code == 200 ) {
                    this.factorList = res.data.content.info
                    this.show = true
                  }
                })
              } else {
                this.show = true
              }
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
              this.$router.go(0);
            },
          draw ({el, BMap, map},item) {
            const pixel = map.pointToOverlayPixel(new BMap.Point(item.longitude, item.latitude))
            el.style.left = pixel.x - 60 + 'px'
            el.style.top = pixel.y - 20 + 'px'
          },
          // 切换站点类型
          changeType(num, index){
              this.$set(this.typeClass, index, [])
              this.$set(this.typeClass[index], num, "active")
              if( index == 2 ) {
                this.noiseType = num == 0 ? "N_003" : num == 1 ? "N_001" : "N_002"
              } else if( index == 0 && num == 3 ) {
                this.waterTypeLx = true
              }
              this.type           = num
              this.active         = []
          },
          getNoiseNum (){
            this.$http.get("/AirAppXY-Service/noise/noiseStationNum").then(res=>{
              if( res.data.code == 200 || res.data.code == 0 ) {
                this.voiceCount = res.data.content.info
              }
            })
          },
          // 获取站点数据
          getStationList(type="water", callback=null) {
              // if( (type == "noise" && this.stationList[type].data.length==0) || this.stationList[type].length == 0 ) {
                let url = type == "water" ? "/AirAppXY-Service/map/getRealStationWaterData" : type == "air" ? "/AirAppXY-Service/map/queryAirRealData" : type == "noise" ? "/AirAppXY-Service/noise/noiseRealData" : '/AirAppXY-Service/pollutionSource/pollInfo'
                let params = {}
                if( type == "noise" ) {
                  params.stationType = "N_001,N_002,N_003"
                }
                this.$http.get(url, {params: params}).then(res=>{
                  if( res.data.code == 200 || res.data.code == 0 ) {
                    this.stationList[type] = res.data.content.info
                    if( type == "noise" ) {
                      this.getNoiseNum()  // 获取声环境个数
                    }
                    setTimeout(()=>{
                      this.setMapZoom(type)
                    }, 500)
                    if( callback ) {
                      callback()
                    }
                    // if( type == "poll" ) {
                    //   let intval = setInterval(()=>{
                    //     this.showIndex += 400
                    //     if( this.showIndex > 1020 ) {
                    //       clearInterval(intval)
                    //     }
                    //   },3000)
                    // }
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
             //}
          },
          setMapZoom(type){
              if( type == "water" ) {
                this.map.centerAndZoom(this.initPoint, 10)
              } else if( type == "air" ) {
                this.map.centerAndZoom(this.initPoint, 12)
              } else if( type == "noise" ) {
                this.map.centerAndZoom(this.initPoint, 12)
              } else if( type == "poll" ) {
                this.map.centerAndZoom(this.initPoint, 13)
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
            &:nth-child(1){
                .left{
                    width: calc(100vw - 50px);
                    white-space: nowrap;
                    overflow-x: scroll;
                }
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
                justify-content: flex-start;
                width: 100%;
                overflow-x: scroll;
                flex-wrap: nowrap;
                li{
                    display: flex;
                    flex-direction: column;
                    width: 100px;
                    margin-left: 20px;
                    .desc{
                        margin-top: 10px;
                    }
                    &:last-child{
                        padding-right: 20px;
                    }
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