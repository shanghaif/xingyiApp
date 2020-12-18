<template>
    <div class="pages_content">
        <van-nav-bar :fixed="true" class="common-nav-bar">
            <template #left>
                <img src="../../assets/img/user_icon.png" @click="$router.push({path: '/mine'})" style="height: 18px; width: 18px" alt="">
            </template>
            <template #title>
                {{$store.state.vuex.stationData.text || '兴义市'}} <span class="navBarxl" @click="$router.push('/stationListSelect')"></span>
            </template>
            <template #right>
                <img src="../../assets/img/message.png" @click="$router.push({path: '/mine'})" style="height: 17.5px; width: 19.5px" alt="">
            </template>
        </van-nav-bar>
        <div class="bg_fullscreen">
            <div class="cloud">
                <img src="../../assets/img/home/yun.png" class="yun" alt="">
                <img src="../../assets/img/home/yun1.png" class="yun1" alt="">
            </div>
            <p class="update">更新：{{realTimeData.spt}}</p>
            <div class="menu_list">
                <ul>
                    <li @click="goto(1)"><img src="../../assets/img/home/wrrl.png" style="width: 43.2px; height: 43.8px" alt=""><br>污染日历</li>
                    <li @click="goto(2)"><img src="../../assets/img/home/jrdb.png" style="width: 43.2px; height: 43.8px" alt=""><br>今日达标</li>
                    <li @click="goto(3)"><img src="../../assets/img/home/jrfz.png" style="width: 43.2px; height: 43.8px" alt=""><br>今日峰值</li>
                    <li @click="goto(4)"><img src="../../assets/img/home/jrbj.png" style="width: 43.2px; height: 43.8px" alt=""><br>报表分析</li>
                </ul>
            </div>
            <div class="svgCanvas">
                <circleCom v-if="showYBP" :options="options" :value="realTimeData.percent" :pollutionLevel="realTimeData.airQuality"></circleCom>
                <div class="svgContent">
                    <span class="aqi">AQI</span>
                    <span class="aqiValue">{{realTimeData.aqi || '--'}}</span>
                    <span class="waste">首页污染物：<font>{{realTimeData.primaryPollution || '--'}}</font></span>
                </div>
                <div class="svgDesc">
                    <ul>
                        <li><span>12℃</span><span>晴</span></li>
                        <li><span><img src="../../assets/img/icon/jt.png" style="width: 20px; height: 20px" alt="">&nbsp;2级</span><span><img src="../../assets/img/icon/yd.png" style="width: 11.2px; height: 14.3px" alt="">&nbsp;61%</span></li>
                    </ul>
                </div>
            </div>
            <div class="actionCanvas">
                <div class="boat">
                    <img src="../../assets/img/home/lingling.png" style="width: 71.5px; height: 111px;margin-top: 145px; margin-left: 60px" alt="">
                </div>
                <div class="aqiContent">
<!--                    <p class="aqiTitle">今日累计AQI <font>56</font>, 首页污染物 <font>PM2.5</font></p>-->
                    <ul style="margin-top: 20px">
                        <li>{{realTimeData.pm25 || '--'}}</li>
                        <li>{{realTimeData.pm10 || '--'}}</li>
                        <li>{{realTimeData.so2 || '--'}}</li>
                        <li>{{realTimeData.o3 || '--'}}</li>
                        <li>{{realTimeData.no2 || '--'}}</li>
                        <li>{{realTimeData.co || '--'}}</li>
                        <li class="level1">PM <sub>2.5</sub></li>
                        <li class="level2">PM <sub>10</sub></li>
                        <li class="level3">SO <sub>2</sub></li>
                        <li class="level4">O <sub>3</sub></li>
                        <li class="level5">NO <sub>2</sub></li>
                        <li class="level6">CO</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="chartsFormData">
            <div class="item">
                <div class="title">
                    <div class="left"><span></span> 最{{recentText}}趋势</div>
                    <div class="right"><span :class="selectActive[0][0]" @click="changeItem(0,0)">近24小时</span> <span :class="selectActive[0][1]" @click="changeItem(0,1)">近30天</span></div>
                </div>
                <div class="content">
                    <div class="echarts" id="echarts">

                    </div>
                    <div class="e_select">
                        <ul>
                            <li :class="factorActive[0]" @click="changeFactor(0, 'aqi')">AQI</li>
                            <li :class="factorActive[1]" @click="changeFactor(1, 'pm25')">PM2.5</li>
                            <li :class="factorActive[2]" @click="changeFactor(2, 'pm10')">PM10</li>
                            <li :class="factorActive[3]" @click="changeFactor(3, 'so2')">SO2</li>
                            <li :class="factorActive[4]" @click="changeFactor(4, 'o3')">O3</li>
                            <li :class="factorActive[5]" @click="changeFactor(5, 'no2')">NO2</li>
                            <li :class="factorActive[6]" @click="changeFactor(6, 'co')">CO</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="title">
                    <div class="left"><span></span> 2020年度优良天数统计</div>
                    <div class="right"><span :class="selectActive[1][0]" @click="changeItem(1,0)">本年</span> <span :class="selectActive[1][1]" @click="changeItem(1,1)">本月</span></div>
                </div>
                <div class="content normal">
                    <div class="echarts" id="echarts2">

                    </div>
                    <table border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td>类别</td>
                            <td>占比</td>
                            <td>天数</td>
                        </tr>
                        <tr>
                            <td><span class="level1"></span>优</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="level2"></span>良</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="level3"></span>轻度</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="level4"></span>中度</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="level5"></span>重度</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="level6"></span>严重</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="item">
                <div class="title">
                    <div class="left"><span></span> 2020年度综合指数贡献比</div>
                    <div class="right"><span :class="selectActive[2][0]" @click="changeItem(2,0)">本年</span> <span :class="selectActive[2][1]" @click="changeItem(2,1)">本月</span></div>
                </div>
                <div class="content normal">
                    <div class="echarts" id="echarts3">

                    </div>
                    <table border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td>因子</td>
                            <td>占比</td>
                            <td>指数</td>
                        </tr>
                        <tr>
                            <td><span class="pm25"></span>PM <sub>2.5</sub></td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="pm10"></span>PM <sub>10</sub></td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="so2"></span>SO <sub>2</sub></td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="o3"></span>O <sub>3</sub></td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="no2"></span>NO <sub>2</sub></td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="co"></span>CO</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="item">
                <div class="title">
                    <div class="left"><span></span> 2020年首要污染物占比</div>
                    <div class="right"><span :class="selectActive[3][0]" @click="changeItem(3,0)">本年</span> <span :class="selectActive[3][1]" @click="changeItem(3,1)">本月</span></div>
                </div>
                <div class="content normal">
                    <div class="echarts" id="echarts4">

                    </div>
                    <table border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td>因子</td>
                            <td>占比</td>
                            <td>天数</td>
                        </tr>
                        <tr>
                            <td><span class="pm25"></span>PM <sub>2.5</sub></td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="pm10"></span>PM <sub>10</sub></td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="so2"></span>SO <sub>2</sub></td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="o3"></span>O <sub>3</sub></td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="no2"></span>NO <sub>2</sub></td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="co"></span>CO</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="item">
                <div class="title">
                    <div class="left"><span></span> 2020年超标天数占比</div>
                    <div class="right"><span :class="selectActive[4][0]" @click="changeItem(4,0)">本年</span> <span :class="selectActive[4][1]" @click="changeItem(4,1)">本月</span></div>
                </div>
                <div class="content normal">
                    <div class="echarts" id="echarts5">

                    </div>
                    <table border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td>因子</td>
                            <td>占比</td>
                            <td>天数</td>
                        </tr>
                        <tr>
                            <td><span class="pm25"></span>PM <sub>2.5</sub></td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="pm10"></span>PM <sub>10</sub></td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="so2"></span>SO <sub>2</sub></td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="o3"></span>O <sub>3</sub></td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="no2"></span>NO <sub>2</sub></td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="co"></span>CO</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="item">
                <div class="title">
                    <div class="left"><span></span> 空气质量累计情况</div>
                    <div class="right"><span :class="selectActive[5][0]" @click="changeItem(5,0)">本年</span> <span :class="selectActive[5][1]" @click="changeItem(5,1)">本月</span></div>
                </div>
                <div class="content">
                    <div class="e_select">
                        <p class="note">注：CO单位为mg，其余单位为μg</p>
                        <table border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td>项目</td>
                                <td>情况</td>
                                <td>同比</td>
                            </tr>
                            <tr>
                                <td>PM2.5</td>
                                <td>108</td>
                                <td>-10 <font class="down">↓</font></td>
                            </tr>
                            <tr>
                                <td>PM10</td>
                                <td>108</td>
                                <td>-10 <font class="down">↓</font></td>
                            </tr>
                            <tr>
                                <td>SO2</td>
                                <td>108</td>
                                <td>-10 <font class="down">↓</font></td>
                            </tr>
                            <tr>
                                <td>O3</td>
                                <td>108</td>
                                <td>-10 <font class="up">↑</font></td>
                            </tr>
                            <tr>
                                <td>NO2</td>
                                <td>108</td>
                                <td>-10 <font class="down">↓</font></td>
                            </tr>
                            <tr>
                                <td>CO</td>
                                <td>108</td>
                                <td>-10 <font class="down">↓</font></td>
                            </tr>
                            <tr>
                                <td>优良天数</td>
                                <td>108</td>
                                <td>-10 <font class="down">↓</font></td>
                            </tr>
                            <tr>
                                <td>综合指数</td>
                                <td>108</td>
                                <td>-10 <font class="down">↓</font></td>
                            </tr>
                            <tr>
                                <td>O3超标天数</td>
                                <td>108</td>
                                <td>-10 <font class="down">↓</font></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="title">
                    <div class="left"><span></span> 同比分析</div>
                    <div class="right"><span class="active selectStation" @click="selectPicker(1)">{{stationValue}} <span class="triangleDownStation"></span></span></div>
                </div>
                <div class="content factor">
                    <div class="selectFactor" @click="selectPicker(2)">
                        {{factorValue}} <span class="triangleDown"></span>
                    </div>
                    <div class="echarts" id="echarts6">

                    </div>
                </div>
            </div>
        </div>
        <van-popup v-model="stationPicker" position="bottom">
            <van-picker
                show-toolbar
                :columns="stationColumns"
                @confirm="onStationConfirm"
                @cancel="stationPicker = false"
            />
        </van-popup>
        <van-popup v-model="factorPicker" position="bottom">
            <van-picker
                show-toolbar
                :columns="factorColumns"
                @confirm="onFactorConfirm"
                @cancel="factorPicker = false"
            />
        </van-popup>
    </div>
</template>

<script>
    import circleCom from "../../components/circle";
    export default {
        name: "home",
        components: {
            circleCom
        },
        data () {
          return {
            options: {
              srtokeWidth: 2.4  // svg线宽度
            },
            realTimeData: {}, // 实时数据
            recentText: "近24小时",
            recentlyTime: {
              startTime: '',
              endTime: '',
              timeType: '小时',
              factor: 'aqi',
              mnType: "city"
            },
            recentData: {},
            showYBP: false,
            selectActive: [["active"],["active"],["active"],["active"],["active"],["active"]],
            factorActive: ["active"],
            lineHoursEcharts: {}, // 近24小时趋势
            countDayEcharts: {}, // 2020年优良天数统计
            pieContribution: {}, // 2020年度综合指数贡献比
            firstWaste: {}, // 2020年首要污染物占比
            exceedDay: {}, // 2020年超标天数占比
            monthStatic: {}, // 同比分析
            stationValue: "站点", // 默认选中
            stationPicker: false, // 选择站点
            stationColumns: ["站点A","站点B"], // 站点列表
            factorValue: "AQI", // 默认选中
            factorPicker: false, // 选择因子
            factorColumns: ["AQI", 'PM2.5', 'PM10', 'SO2', 'O3', 'NO2', 'CO'], // 因子列表
          }
        },
      activated() {
        // 获取实时空气质量
        this.getRealTimeAirQuality();
        // 近24小时趋势
        this.getRecentlyRealData();
      },
      mounted() {
            let date = new Date()
            this.recentlyTime.endTime   = date.format("yyyyMMddhh")
            date.setTime(date.getTime()-24*60*60*1000) // 近24小时
            this.recentlyTime.startTime = date.format("yyyyMMddhh")
            // 2020年优良天数统计
            this.drawPieCountDay();
            // 2020年度综合指数贡献比
            this.drawPieContribution();
            // 2020年首要污染物占比
            this.drawPieFirstWaste();
            // 2020年超标天数占比
            this.drawPieExceedDay();
            // 同比分析
            this.drawLineMonthStatic();
        },
        methods: {
          // 顶部菜单跳转
          goto(number){
            if( number == 1 ) {
                this.$router.push('/calendar')
            } else if( number == 2 ) {
                this.$router.push('/standard')
            } else if( number == 3 ) {
                this.$router.push('/peakvalue')
            } else if( number == 4 ) {

            }
          },
          // 近24小时趋势
          drawLineHoursData(){
            let that = this
            this.lineHoursEcharts = this.$echarts.init(document.getElementById("echarts"))
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
                data: this.recentData.time
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
                max: 300,
                interval: 60,
              },
              series: [{
                data: this.recentData.data,
                type: 'bar',
                barWidth: 7,
                itemStyle: {
                  normal: {
                    //每根柱子颜色设置
                    color: function(params) {
                      switch (that.recentData.level[params.dataIndex]) {
                        case 0:
                          return "#24C768"
                          break;
                        case 1:
                          return "#E5CE10"
                          break;
                        case 2:
                          return "#FF7E00"
                          break;
                        case 3:
                          return "#FF0000"
                          break;
                        case 4:
                          return "#990000"
                          break;
                        case 5:
                          return "#7E0000"
                          break;
                      }
                    }
                  }
                },
                backgroundStyle: {
                  color: 'rgba(220, 220, 220, 0.8)'
                }
              }]
            }
            this.lineHoursEcharts.setOption(option)
          },
          // 2020年优良天数统计
          drawPieCountDay(){
            this.countDayEcharts = this.$echarts.init(document.getElementById("echarts2"))
            // let colorList= ["#24C768","#E5CE10","#FF7E00","#FF0000","#990000","#7E0000"]
            let option2 = {
              series: [
                {
                  name: '综合指数',
                  type: 'pie',
                  radius: ['45%', '65%'],
                  avoidLabelOverlap: false,
                  selectedMode: false,
                  label: {
                    normal: {
                      formatter: '优良天数\n{a|200天}\n同比增长24天',
                      rich: {
                        a: {
                          color: '#1A1A1A',
                          lineHeight: 22,
                          fontFamily: "PingFang SC",
                          align: 'center',
                          fontSize: 12
                        }
                      },
                      textStyle: {
                        color: "#666666",
                        fontWeight: "normal",
                        fontSize: 9
                      },
                      position: "center",
                      show: true
                    }
                  },
                  emphasis: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  },
                  data: [100, 146, 46]
                },
                {
                  type: 'pie',
                  radius: ['45%', '65%'],
                  label: {
                    position: 'outside',
                    normal: {
                      formatter: function(data){ return data.percent.toFixed(1)+"%";} ,
                      textStyle: {
                        fontWeight: 'normal',
                        fontSize: 10,
                        color: '#666'
                      }
                    }
                  },
                  labelLine: {
                    show: true,
                    length: 1,
                    length2: 1,
                  },
                  data: [100, 146, 46]
                }
              ]
            }
            this.countDayEcharts.setOption(option2)
          },
          // 2020年度综合指数贡献比
          drawPieContribution(){
            this.pieContribution = this.$echarts.init(document.getElementById("echarts3"))
            // let colorList= ["#24C768","#E5CE10","#FF7E00","#FF0000","#990000","#7E0000"]
            let option2 = {
              series: [
                {
                  name: '综合指数',
                  type: 'pie',
                  radius: ['45%', '65%'],
                  avoidLabelOverlap: false,
                  selectedMode: false,
                  label: {
                    normal: {
                      formatter: '综合指数\n{a|6.133}\n同比减少1.009',
                      rich: {
                        a: {
                          color: '#1A1A1A',
                          lineHeight: 22,
                          fontFamily: "PingFang SC",
                          align: 'center',
                          fontSize: 12
                        }
                      },
                      textStyle: {
                        color: "#666666",
                        fontWeight: "normal",
                        fontSize: 9
                      },
                      position: "center",
                      show: true
                    }
                  },
                  emphasis: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  },
                  data: [100, 146, 46]
                },
                {
                  type: 'pie',
                  radius: ['45%', '65%'],
                  label: {
                    position: 'outside',
                    normal: {
                      formatter: function(data){ return data.percent.toFixed(1)+"%";} ,
                      textStyle: {
                        fontWeight: 'normal',
                        fontSize: 10,
                        color: '#666'
                      }
                    }
                  },
                  labelLine: {
                    show: true,
                    length: 1,
                    length2: 1,
                  },
                  data: [100, 146, 46]
                }
              ]
            }
            this.pieContribution.setOption(option2)
          },
          // 2020年首要污染物占比
          drawPieFirstWaste(){
            this.firstWaste = this.$echarts.init(document.getElementById("echarts4"))
            // let colorList= ["#24C768","#E5CE10","#FF7E00","#FF0000","#990000","#7E0000"]
            let option2 = {
              series: [
                {
                  name: '综合指数',
                  type: 'pie',
                  radius: ['45%', '65%'],
                  avoidLabelOverlap: false,
                  selectedMode: false,
                  label: {
                    normal: {
                      // formatter: '综合指数\n{a|6.133}\n同比减少1.009',
                      // rich: {
                      //   a: {
                      //     color: '#1A1A1A',
                      //     lineHeight: 22,
                      //     fontFamily: "PingFang SC",
                      //     align: 'center',
                      //     fontSize: 12
                      //   }
                      // },
                      // textStyle: {
                      //   color: "#666666",
                      //   fontWeight: "normal",
                      //   fontSize: 9
                      // },
                      position: "center",
                      show: false
                    }
                  },
                  emphasis: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  },
                  data: [100, 146, 46]
                },
                {
                  type: 'pie',
                  radius: ['45%', '65%'],
                  label: {
                    position: 'outside',
                    normal: {
                      formatter: function(data){ return data.percent.toFixed(1)+"%";} ,
                      textStyle: {
                        fontWeight: 'normal',
                        fontSize: 10,
                        color: '#666'
                      }
                    }
                  },
                  labelLine: {
                    show: true,
                    length: 1,
                    length2: 1,
                  },
                  data: [100, 146, 46]
                }
              ]
            }
            this.firstWaste.setOption(option2)
          },
          // 2020年超标天数占比
          drawPieExceedDay(){
            this.exceedDay = this.$echarts.init(document.getElementById("echarts5"))
            // let colorList= ["#24C768","#E5CE10","#FF7E00","#FF0000","#990000","#7E0000"]
            let option2 = {
              series: [
                {
                  name: '综合指数',
                  type: 'pie',
                  radius: ['45%', '65%'],
                  avoidLabelOverlap: false,
                  selectedMode: false,
                  label: {
                    normal: {
                    //   formatter: '综合指数\n{a|6.133}\n同比减少1.009',
                    //   rich: {
                    //     a: {
                    //       color: '#1A1A1A',
                    //       lineHeight: 22,
                    //       fontFamily: "PingFang SC",
                    //       align: 'center',
                    //       fontSize: 12
                    //     }
                    //   },
                    //   textStyle: {
                    //     color: "#666666",
                    //     fontWeight: "normal",
                    //     fontSize: 9
                    //   },
                    //   position: "center",
                      show: false
                    }
                  },
                  emphasis: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  },
                  data: [100, 146, 46]
                },
                {
                  type: 'pie',
                  radius: ['45%', '65%'],
                  label: {
                    position: 'outside',
                    normal: {
                      formatter: function(data){ return data.percent.toFixed(1)+"%";} ,
                      textStyle: {
                        fontWeight: 'normal',
                        fontSize: 10,
                        color: '#666'
                      }
                    }
                  },
                  labelLine: {
                    show: true,
                    length: 1,
                    length2: 1,
                  },
                  data: [100, 146, 46]
                }
              ]
            }
            this.exceedDay.setOption(option2)
          },
          // 同比分析
          drawLineMonthStatic(){
            this.monthStatic = this.$echarts.init(document.getElementById('echarts6'))
            let option = {
              // title: {
              //   text: '(μg/m3)',
              //   textStyle: {
              //     color: '#666666',        // 颜色
              //     fontStyle: 'normal',     // 风格
              //     fontWeight: 'normal',    // 粗细
              //     fontFamily: 'Microsoft yahei',   // 字体
              //     fontSize: 14,     // 大小
              //     align: 'center'   // 水平对齐
              //   },
              // },
              tooltip: {
                show: true
              },
              legend: [
                {
                  x: "left",
                  y: "top",
                  data: ["2018年"],
                },
                {
                  x: "25%",
                  y: "top",
                  data: ["2019年"],
                },
                {
                  x: "50%",
                  y: "top",
                  data: ["2020年"],
                }
              ],
              xAxis: {
                type: 'category',
                data: ["5月", "6月", "7月", "8月", "9月", "10月"],
                axisLabel: {
                  show: true,
                  type: 'category',
                  boundaryGap: false,
                  textStyle: {
                    color: "#666666",
                    fontSize: 12
                  },
                  lineStyle: {
                    color: '#ddd',
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#ddd', // 颜色
                    width: 1 // 粗细
                  }
                },
                axisTick: {
                  show: false
                },
                splitLine: {
                  show: false,
                },
              },
              yAxis: {
                interval: 50,
                min: 0,
                max: 150,
                type: 'value',
                axisTick: {
                  show: false
                },
                axisLabel: {
                  color: '#666666'
                },
                axisLine: {
                  show: false
                },
              },
              grid: {
                top: "16%",
                left: "8%",
                bottom: "15%",
                right: "4%"
              },
              series: [{
                name: "2018年",
                data: [32,54,121,68,89,111],
                type: 'line',
                smooth: true,
                symbolSize: 8,   //折线点的大小
                itemStyle: {
                  normal: {
                    color: '#1EBCBC', //折点颜色
                    lineStyle: {
                      color: '#1EBCBC' //折线颜色
                    }
                  }
                }
              },{
                name: "2019年",
                data: [45,77,111,67,112,21],
                type: 'line',
                smooth: true,
                symbolSize: 8,   //折线点的大小
                itemStyle: {
                  normal: {
                    color: '#FF7017', //折点颜色
                    lineStyle: {
                      color: '#FF7017' //折线颜色
                    }
                  }
                }
              },{
                name: "2020年",
                data: [34,56,87,55,120,111],
                type: 'line',
                smooth: true,
                symbolSize: 8,   //折线点的大小
                itemStyle: {
                  normal: {
                    color: '#1EBC52', //折点颜色
                    lineStyle: {
                      color: '#1EBC52' //折线颜色
                    }
                  }
                }
              }]
            };
            this.monthStatic.setOption(option);
          },
          // 选择站点及因子
          selectPicker(number){
            if( number == 1 ) {
              this.stationPicker = true
            } else if( number == 2 ) {
              this.factorPicker = true
            }
          },
          // 选择站点确认回调
          onStationConfirm(value, index) {
            console.log(index);
            this.stationValue = value;
            this.stationPicker = false;
          },
          // 选择因子回调
          onFactorConfirm(value, index){
            console.log(index);
            this.factorValue = value;
            this.factorPicker = false;
          },
          // 统一切换处理
          changeItem(key, index){
            this.$set(this.selectActive, key, [])
            this.$set(this.selectActive[key], index, "active")
            if( key == 0 ) {
              let date = new Date()
              if( index == 0 ) {
                this.recentText = "近24小时"
                date.setTime(date.getTime()-24*60*60*1000) // 近24小时
                this.recentlyTime.startTime = date.format("yyyyMMddhh")
                this.recentlyTime.timeType  = "小时"
              } else {
                this.recentText = "近30天"
                date.setTime(date.getTime()-30*24*60*60*1000) // 近24小时
                this.recentlyTime.startTime = date.format("yyyyMMddhh")
                this.recentlyTime.timeType  = "日"
              }
              this.getRecentlyRealData()
            }
          },
          // 切换因子
          changeFactor(key, name) {
            this.factorActive        = []
            this.factorActive[key]   = "active"
            this.recentlyTime.factor = name
            this.getRecentlyRealData()
          },
          // 获取实时空气质量
          getRealTimeAirQuality(){
            let params = {}
            if( this.$store.state.vuex.stationData.id ) {
              params.mns = this.$store.state.vuex.stationData.id
            } else {
              params.mns = ""
            }
            this.showYBP = false
            this.$http.get("/AirAppXY-Service/air/queryRealXingYiAQI", {params: params}).then(res=>{
              if( res.data.code == 200 ) {
                this.realTimeData = res.data.content.info.hasOwnProperty('spt') ? res.data.content.info : res.data.content.info[0]
                if( this.realTimeData.aqi ) {
                  let percent = Number(( this.realTimeData.aqi / 300 ).toFixed(1))
                  this.$set(this.realTimeData, "percent", percent)
                }
                this.showYBP = true
              }
            })
          },
          // 最近24小时趋势
          getRecentlyRealData(){
            if( this.$store.state.vuex.stationData.id ) {
              this.recentlyTime.mns = this.$store.state.vuex.stationData.id
              this.recentlyTime.mnType = "station"
            } else {
              this.recentlyTime.mns = ""
              this.recentlyTime.mnType = "city"
            }
            this.$http.get("/AirAppXY-Service/air/airLineData", {params:this.recentlyTime}).then(res=>{
              if( res.data.code == 200 ) {
                this.recentData = res.data.content.info
                // 近24小时趋势图表
                this.drawLineHoursData();
              }
            })
          }
        }
    }
</script>