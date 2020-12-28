<template>
    <div class="pages_content">
        <van-nav-bar left-arrow @click-left="historyBack" :fixed="true" class="common-nav-bar">
            <template #title>
                {{realTimeData.stationName || '兴义市'}}
            </template>
        </van-nav-bar>
        <div class="full_screen">
            <p class="time">更新：{{realTimeData.spt || '--'}}</p>
            <div class="content">
                <div class="first">
                    <div class="aqi">{{realTimeData.aqi || '--'}}</div>
                    <div class="desc">
                        <span class="desc_text">AQI</span>
                        <span class="other_text">预报</span>
                    </div>
                </div>
                <div class="second"><span :class="'level'+(realTimeData.level+1)">{{realTimeData.airQuality || '--'}}</span></div>
                <div class="third">首要污染物：{{realTimeData.primaryPollution || '--'}}</div>
            </div>
            <!--排名-->
            <p class="rank">
                在兴义市41个站点中综合排名--
            </p>
            <div class="fixed_bottom">
                <ul class="detailData">
                    <li v-for="(item,index) in factorList" :key="index">
                        <div class="first">
                            <font>{{realTimeData[item.cd] || '--'}}</font>{{item.monitoring_factor_dw}}
                        </div>
                        <div class="second">{{item.cd}}</div>
                        <div class="third">{{item.monitoring_factor_nm}}</div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="chartsFormData">
            <div class="item">
                <div class="title">
                    <div class="left"><span></span> 空气监测数据</div>
                    <div class="right"><span class="selectStation" @click="selectPicker(2)">{{factorValue}} <span class="triangleDownStationToggle"></span></span></div>
                </div>
                <div class="content">
                    <div class="waterChangeSelect">
                        <ul>
                            <li :class="selectTimeActive[0]" @click="selectTime(0)">24小时</li>
                            <li :class="selectTimeActive[1]" @click="selectTime(1)">30天</li>
                        </ul>
                    </div>
                    <div class="factorMaxAndMin">
                        <ul>
                            <li>{{monitorData.avg}} <img src="../../assets/img/avg.png" alt=""></li>
                            <li>{{monitorData.max}} <img src="../../assets/img/max.png" alt=""></li>
                            <li>{{monitorData.min}} <img src="../../assets/img/min.png" alt=""></li>
                        </ul>
                    </div>
                    <div class="echarts" id="echarts_airDetail">

                    </div>
                    <ul class="legend">
                        <li><span class="level1"></span>Ⅰ</li>
                        <li><span class="level2"></span>Ⅱ</li>
                        <li><span class="level3"></span>Ⅲ</li>
                        <li><span class="level4"></span>Ⅳ</li>
                        <li><span class="level5"></span>Ⅴ</li>
                        <li><span class="level6"></span>劣Ⅴ</li>
                    </ul>
                    <div class="e_select">
                        <table>
                            <tr>
                                <td>时间</td>
                                <td>{{factorValue}}({{unit}})</td>
                            </tr>
                            <tr v-for="(item,index) in monitorData.time">
                                <td>{{item}}</td>
                                <td>{{monitorData.data[index] || "--"}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="title">
                    <div class="left"><span></span> 空气质量分布图</div>
                    <div class="right"><span class="selectStation" @click="selectPicker(3)">{{currentDate.format("yyyy-MM")}} <span class="triangleDownStationToggle"></span></span></div>
                </div>
                <div class="content">
                    <calendar
                            v-if="showCalendar"
                            v-on:choseDay="clickDay"
                            v-on:changeMonth="changeMonth"
                            :sundayStart="false"
                            :markDateMore="marker"
                            :showMonthSelect="false"
                            ref="calendar"
                    ></calendar>
                    <ul class="legend">
                        <li><span class="level1"></span>Ⅰ</li>
                        <li><span class="level2"></span>Ⅱ</li>
                        <li><span class="level3"></span>Ⅲ</li>
                        <li><span class="level4"></span>Ⅳ</li>
                        <li><span class="level5"></span>Ⅴ</li>
                        <li><span class="level6"></span>劣Ⅴ</li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 日期选择 -->
        <van-popup v-model="datePicker" position="bottom">
            <van-datetime-picker
                    v-model="currentDate"
                    type="year-month"
                    title="选择年月"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @confirm="comfirmDateSelected"
                    @cancel="datePicker = false"
            />
        </van-popup>
        <!-- 因子选择-->
        <van-popup v-model="factorPicker" position="bottom">
            <van-picker
                    show-toolbar
                    :default-index="1"
                    :columns="factorColumns"
                    @confirm="onFactorConfirm"
                    @cancel="factorPicker = false"
            />
        </van-popup>
    </div>
</template>

<script>
    import calendar from "../../components/calendar";
    export default {
       components: {
         calendar
       },
        data(){
          return {
            factorValue: "", // 默认选中
            unit: "",
            factorPicker: false, // 选择因子
            factorColumns: [], // 因子列表
            factorValueArray: ['ph', 'tp', 'codmn','dox','nh3n'],
            selectTimeActive: ["active"],
            showCalendar: false,
            minDate: new Date(2010, 0, 1),
            maxDate: new Date(),
            factorList: [],
            datePicker: false,
            monitorData: {},
            waterColor: ["#CCFFFF","#00CCFF","#00FF00","#FFFF00","#FF9B00","#FF0000"],
            currentDate: new Date(),
            marker: [],
            monitorTime: {
              startTime: '',
              endTime: '',
              timeType: '小时',
              mnType: "city",
              factor: '',
              mns: ""
            },
            distributionTime: {
              startTime: '',
              endTime: '',
              timeType: '日',
              mns: ""
            },
            realTimeData: {}
          }
        },
        mounted() {
          let d = new Date()
          this.monitorTime.endTime = d.format("yyyyMMddhh")
          this.distributionTime.endTime = d.format("yyyyMMddhh")
          this.distributionTime.startTime = d.format("yyyyMM0100")
          d.setTime(d.getTime()-24*60*60*1000)
          this.monitorTime.startTime = d.format("yyyyMMddhh")
          if( this.$route.params.code ) {
            this.monitorTime.mns = this.distributionTime.mns = this.$route.params.code
          }
          // 获取所有站点监测因子
          this.getMonitorFactor();
          // 空气日历
          this.getWaterDistribution();
          // 获取实时空气质量
          this.getRealTimeAirQuality();
        },
      methods: {
        // 获取实时空气质量
        getRealTimeAirQuality(){
          let params = {}
          if( this.$route.params.code ) {
            params.mns = this.$route.params.code
          } else {
            params.mns = ""
          }
          this.$http.get("/AirAppXY-Service/air/queryRealXingYiAQI", {params: params}).then(res=>{
            if( res.data.code == 200 ) {
              this.realTimeData = res.data.content.info.hasOwnProperty('spt') ? res.data.content.info : res.data.content.info[0]
              if( this.realTimeData.airQuality.indexOf("优") != -1 ) {
                this.realTimeData.level = 0
              } else if( this.realTimeData.airQuality.indexOf("良") != -1 ) {
                this.realTimeData.level = 1
              } else if( this.realTimeData.airQuality.indexOf("轻度") != -1 ) {
                this.realTimeData.level = 2
              } else if( this.realTimeData.airQuality.indexOf("中度") != -1 ) {
                this.realTimeData.level = 3
              } else if( this.realTimeData.airQuality.indexOf("重度") != -1 ) {
                this.realTimeData.level = 4
              } else if( this.realTimeData.airQuality.indexOf("严重") != -1 ) {
                this.realTimeData.level = 5
              } else {
                this.realTimeData.level = 6
              }
            }
          })
        },
          // 选择站点及因子
          selectPicker(number){
            if( number == 1 ) {
              this.stationPicker = true
            } else if( number == 2 ) {
              this.factorPicker = true
            } else if( number == 3 ) {
              this.datePicker = true
            } else if( number == 4 ) {
              this.factorPickerTb = true
            } else if( number == 5 ) {
              this.datePickerDb = true
            } else if( number == 6 ) {
              this.timeClassSelectedPicker = true
            }
          },
        // 获取站点监测动态因子
          getMonitorFactor(){
            let params = {
              mns: ""
            }
            if( this.$route.params.code ) {
              params.mns = this.$route.params.code
            }
            this.$http.get("/AirAppXY-Service/map/queryStationMontFactors", {params:params}).then(res=>{
                if( res.data.code == 200 ) {
                  this.factorList = res.data.content.info
                  this.factorValue = this.factorList[0].monitoring_factor_nm
                  this.unit        = this.factorList[0].monitoring_factor_dw
                  this.monitorTime.factor = this.factorList[0].cd
                  this.factorList.forEach((item,index)=>{
                    this.factorColumns.push(item.monitoring_factor_nm)
                  })
                  // 水质监测数据
                  this.getMonitorData();
                }
            })
          },
          selectTime(number){
            this.selectTimeActive         = []
            this.selectTimeActive[number] = "active"
            let d = new Date()
            if( number == 0 ) {
              this.monitorTime.endTime = d.format("yyyyMMddhh")
              d.setTime(d.getTime()-24*60*60*1000)
              this.monitorTime.startTime = d.format("yyyyMMddhh")
              this.monitorTime.timeType  = "小时"
            } else if( number == 1 ) {
              this.monitorTime.endTime = d.format("yyyyMMddhh")
              d.setTime(d.getTime()-30*24*60*60*1000)
              this.monitorTime.startTime = d.format("yyyyMMddhh")
              this.monitorTime.timeType  = "日"
            } else if( number == 2 ) {
              this.monitorTime.endTime = d.format("yyyyMMddhh")
              d.setTime(d.getTime()-365*24*60*60*1000)
              this.monitorTime.startTime = d.format("yyyyMMddhh")
              this.monitorTime.timeType  = "月"
            }
            this.getMonitorData();
          },
        // 选择因子回调
        onFactorConfirm(value, index){
          this.factorValue = value;
          this.factorPicker = false;
          this.monitorTime.factor = this.factorList[index].cd
          this.unit        = this.factorList[index].monitoring_factor_dw
          this.getMonitorData();
        },
            comfirmDateSelected(value){
              this.datePicker = false
              this.$refs.calendar.ChoseMonth(value.format("yyyy-MM"))
              this.distributionTime.startTime = value.format("yyyyMMddhh")
              let lastDay = new Date(value.format("yyyy"), value.format("MM"), 0).getDate();
              this.distributionTime.endTime   = value.format("yyyyMM"+lastDay+"hh")
              this.getWaterDistribution();
            },
          getMonitorData(){
            this.$http.get("/AirAppXY-Service/air/airMonitorData", {params: this.monitorTime}).then(res=>{
              if( res.data.code == 200 ) {
                this.monitorData = res.data.content.info
                // 水质监测数据
                this.drawLineHoursData();
              }
            })
          },
          clickDay(value){
          },
          changeMonth(){},
         // 水质监测数据
         drawLineHoursData(){
              let that = this
              let lineHoursEcharts = this.$echarts.init(document.getElementById("echarts_airDetail"))
              let option  = {
                color: "#E5CE10",
                xAxis: {
                  type: 'category',
                  axisTick: {
                    alignWithLabel: true,
                    show: false,
                  },
                  axisLine: {
                    lineStyle: {
                      color: '#ddd', // 颜色
                      width: 1 // 粗细
                    },
                  },
                  axisLabel: {
                    rotate: 40,
                    color: "#666"
                  },
                  data: this.monitorData.time
                },
                tooltip: {
                  trigger: 'axis'
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  top: '10%',
                  containLabel: true
                },
                yAxis: {
                  type: 'value',
                  axisLine: {
                    show: false
                  },
                  axisTick: {
                    show: false
                  },
                  splitLine:{
                    show: true,
                    lineStyle: {
                      color: "#ddd"
                    }
                  },
                },
                series: [{
                  name: this.factorValue,
                  data: this.monitorData.data,
                  type: 'bar',
                  barWidth: 7,
                  itemStyle: {
                    normal: {
                      //每根柱子颜色设置
                      color: function(params) {
                        if( that.factorValue == "pH值" || Number(that.monitorData.level[params.dataIndex]) == -1 ) {
                          return "#24C768";
                        } else {
                          return that.waterColor[that.monitorData.level[params.dataIndex]]
                        }
                      }
                    }
                  },
                  backgroundStyle: {
                    color: 'rgba(220, 220, 220, 0.8)'
                  }
                }]
              }
              lineHoursEcharts.setOption(option)
            },
            getWaterDistribution(){
              this.$http.get("/AirAppXY-Service/air/getAirCalendarData", {params: this.distributionTime}).then(res=>{
                if( res.data.code == 200 ) {
                  this.marker = []
                  res.data.content.info.forEach((item,index)=>{
                    let obj  = {}
                    obj.date = item.spt.slice(0,4) + "-" + item.spt.slice(4,6) + "-" + item.spt.slice(6,8)
                    if( item.level || item.level == 0 ) {
                      obj.className= "level" + (Number(item.level) + 1)
                    } else {
                      obj.className= ""
                    }
                    this.marker.push(obj)
                  })
                  console.log(this.marker, "marker")
                  this.showCalendar = true
                }
              })
            },
        }
    }
</script>

<style lang="less" scoped>
    @colorsLevels: {
        level1: #00E400;
        level2: #FFFF00;
        level3: #FF7E00;
        level4: #FF0000;
        level5: #99004C;
        level6: #7E0023;
        level7: #cccccc;
    };
    .pages_content{
        height: 100vh;
        .chartsFormData{
            top: 100vh;
            margin-bottom: 0;
        }
    }
    .common-nav-bar{
        background: rgba(#0581EB, 0.5) !important;
    }
    .full_screen{
        width: 100%;
        height: calc(100vh - 47px);
        padding-top: 47px;
        background: linear-gradient(184deg, #0581EB 0%, #80C3FF 100%);
        .time{
            text-align: center;
            font-size: 13px;
            color: #F5F5F5;
            margin-top: 10px;
        }
        .content{
            margin-top: 40px;
            .first{
                display: flex;
                align-items: center;
                justify-content: center;
                .aqi{
                    font-size: 60px;
                    color: #fff;
                }
                .desc{
                    display: flex;
                    flex-direction: column;
                    .desc_text{
                        font-size: 15px;
                        color: #F5F5F5;
                    }
                    .other_text{
                        margin-top: 5px;
                        font-size: 18px;
                        color: #FF7E00;
                    }
                }
            }
            .second{
                display: flex;
                align-items: center;
                justify-content: center;
                span{
                    padding: 3px 50px;
                    border-radius: 4px;
                    color: #fff;
                    box-shadow: 2px 2px 1px #666;
                    each(@colorsLevels, {
                        &.@{key}{
                            background: @value;
                        }
                    })
                }
            }
            .third{
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 20px;
                color: #F5F5F5;
                font-size: 15px;
            }
        }
        .fixed_bottom{
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 100px;
            background: #216AD5;
            .detailData{
                display: flex;
                width: 100%;
                height: 100%;
                overflow-x: scroll;
                li{
                    white-space: nowrap;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    width: 130px;
                    color: #B5BFDB;
                    font-size: 13px;
                    margin-left: 50px;
                    .first{
                        font-size: 9px;
                        font{
                            font-size: 26px;
                            color: #fff
                        }
                    }
                    &:last-child{
                        padding-right: 50px;
                    }
                }
            }
        }
        .rank{
            width: 100%;
            font-size: 15px;
            color: #fff;
            position: absolute;
            bottom: 110px;
            text-align: center;
        }
    }
</style>