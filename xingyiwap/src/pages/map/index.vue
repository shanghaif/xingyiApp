<template>
    <div style="position: relative">
        <van-nav-bar :fixed="true" class="common-nav-bar">
            <template #left>
                <img src="../../assets/img/user_icon.png" @click="$router.push({path: '/mine'})" style="height: 18px; width: 18px" alt="">
            </template>
            <template #title>
                <ul>
                    <li :class="activeClass[0]" @click="changeItem(0)">水质</li>
                    <li :class="activeClass[1]" @click="changeItem(1)">空气</li>
                    <li :class="activeClass[2]" @click="changeItem(2)">声环境</li>
                    <li :class="activeClass[3]" @click="changeItem(3)">污染源</li>
                </ul>
            </template>
            <template #right>
                <img src="../../assets/img/search.png" @click="$router.push({path: '/mine'})" style="height: 18px; width: 18px" alt="">
            </template>
        </van-nav-bar>
        <div class="rightNav">
            <ul>
                <li><img src="../../assets/img/desc.png" style="max-width: 15.5px" />说明</li>
                <li @click="refresh"><img src="../../assets/img/refresh.png" style="max-width: 16px" />刷新</li>
                <li @click="$router.push('/stationList')"><img src="../../assets/img/station.png" style="max-width: 12.5px" />站点<br />列表</li>
                <li @click="$router.push('/assessmentWater')"><img src="../../assets/img/kaohe.png" style="max-width: 11.5px" />考核<br />分析</li>
            </ul>
        </div>
        <baidu-map class="map" ref="map" :center="options.center" :zoom="options.zoom" center="兴义市" @ready="initMap">
            <template v-for="(item,index) in pointList" v-if="pointList.length > 0 && navActive == 0">
                <bm-label :content="levelText[item.level]" :position="item.point" :labelStyle="Object.assign(label[item.level], baseStyle)" @click="showStationInfo(item)" />
            </template>
        </baidu-map>
        <div class="stationInfo" v-if="navActive == 0 && show">
            <div class="title">
                <div class="left">
                    <img src="../../assets/img/pos.png" style="max-width: 13.5px">xxx站点
                </div>
                <div class="right">
                    <img src="../../assets/img/close.png" @click="show = false" style="max-width: 24px">
                </div>
            </div>
            <div class="title time">
                <div class="left">
                    2020-08-20 14时 &nbsp;<span class="waterIcon level2">Ⅱ</span>
                </div>
                <div class="right">
                    目标水质：<span class="waterIcon level2">Ⅱ</span>
                </div>
            </div>
            <ul class="fator">
                <li>8</li>
                <li>50</li>
                <li>0.41</li>
                <li>6.98</li>
                <li>0.22</li>
                <li>4.60</li>
                <li>COD</li>
                <li>高锰酸盐</li>
                <li>氨氮</li>
                <li>pH值</li>
                <li>总磷</li>
                <li>溶解氧</li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "mapCom",
        data () {
          return {
            show: false,
            navActive: 0,
            levelText: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ"],
            activeClass: ["active"],
            options: {
              zoom: 11,
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
            ],
            pointList: [],
            map: {}
          }
        },
        mounted() {
          this.getTestPoint()
        },
        methods: {
            changeItem(num){
              this.activeClass      = []
              this.activeClass[num] = "active"
              this.navActive        = num
            },
            // 获取百度地图对象
            initMap({BMap, map}){
              // 点击地图空白地方触发
              let that = this
              map.addEventListener("click", function(e){
                if(e.overlay){
                  return; // 存在覆盖物则不触发
                }
                that.hideInfo()
              });
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
                this.pointList.push(obj)
              }
            },
            showStationInfo(info){
                this.show = true
            },
            hideInfo(){
              this.show = false
            },
            refresh(){
              window.location.reload(true)
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
                  margin-left: 5px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 13px;
                  color: #fff;
                  width: 20px;
                  height: 20px;
                  border-radius: 20px;
                  each(@colorsWaterLevels, {
                      &.@{key} {
                          background: @value;
                      }
                  })
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
</style>