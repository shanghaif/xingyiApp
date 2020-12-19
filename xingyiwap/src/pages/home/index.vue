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
                        <li :class="'level'+(realTimeData.pm25_level+1)">PM <sub>2.5</sub></li>
                        <li :class="'level'+(realTimeData.pm10_level+1)">PM <sub>10</sub></li>
                        <li :class="'level'+(realTimeData.so2_level+1)">SO <sub>2</sub></li>
                        <li :class="'level'+(realTimeData.o3_level+1)">O <sub>3</sub></li>
                        <li :class="'level'+(realTimeData.no2_level+1)">NO <sub>2</sub></li>
                        <li :class="'level'+(realTimeData.co_level+1)">CO</li>
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
                    <div class="left"><span></span> {{new Date().getFullYear()}}年度优良天数统计</div>
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
                        <tr v-for="(item,index) in goodfineData.data" :key="index">
                            <td><span :class="'level'+index"></span>{{item.name}}</td>
                            <td>{{item.percent}}</td>
                            <td>{{item.value}}</td>
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
                        <tr v-for="(item,index) in comprehensiveData.data" :key="index">
                            <td><span :class="item.name"></span><font v-html="item.html"></font></td>
                            <td>{{item.percent}}</td>
                            <td>{{item.value}}</td>
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
                        <tr v-for="(item,index) in firstPolluteData.data" :key="index">
                            <td><span :class="item.name"></span><font v-html="item.html"></font></td>
                            <td>{{item.percent}}</td>
                            <td>{{item.value}}</td>
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
                            <tr v-for="(item,index) in airData" :key="index">
                                <td>{{item.item}}</td>
                                <td>{{item.case}}</td>
                                <td>{{item.dq_tb != "--" ? Math.abs(item.dq_tb) : item.dq_tb}} <template v-if="item.dq_tb != '--' && Number(item.dq_tb) != 0"><font class="down" v-if="Number(item.dq_tb) < 0">↓</font><font class="up" v-else>↑</font></template></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="title">
                    <div class="left"><span></span> 同比分析</div>
                    <div class="right"><span class="active selectStation" @click="selectPicker(2)">{{factorValue}} <span class="triangleDownStation"></span></span></div>
                </div>
                <div class="content factor">
                    <div class="echarts" id="echarts6">

                    </div>
                </div>
            </div>
        </div>
<!--        <van-popup v-model="stationPicker" position="bottom">-->
<!--            <van-picker-->
<!--                show-toolbar-->
<!--                :columns="stationColumns"-->
<!--                @confirm="onStationConfirm"-->
<!--                @cancel="stationPicker = false"-->
<!--            />-->
<!--        </van-popup>-->
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
            goodAndFineTime: {
              startTime: '',
              endTime: '',
              mnType: 'city',
              timeType: '日',
              mns: ''
            },
            comprehensiveTime: {
              startTime: '',
              endTime: '',
              mnType: 'city',
              timeType: '年',
              mns: ''
            },
            firstPolluteTime: {
              startTime: '',
              endTime: '',
              mnType: 'city',
              timeType: '日',
              mns: ''
            },
            standardTime: {
              startTime: '',
              endTime: '',
              mnType: 'city',
              timeType: '日',
              mns: ''
            },
            airDataTime: {
              startTime: '',
              endTime: '',
              mnType: 'city',
              timeType: '年',
              mns: ''
            },
            tbTime: {
              startTime: '',
              endTime: '',
              mnType: 'city',
              timeType: '月',
              factor: "aqi",
              mns: ''
            },
            recentData: {},
            goodfineData: {
              data: []
            },
            comprehensiveData: {
              data: []
            },
            firstPolluteData: {
              data: []
            },
            standardData: {
              data: []
            },
            airData: [],
            showYBP: false,
            selectActive: [["active"],["active"],["active"],["active"],["active"],["active"]],
            factorActive: ["active"],
            lineHoursEcharts: {}, // 近24小时趋势
            countDayEcharts: {}, // 2020年优良天数统计
            pieContribution: {}, // 2020年度综合指数贡献比
            firstWaste: {}, // 2020年首要污染物占比
            exceedDay: {}, // 2020年超标天数占比
            monthStatic: {}, // 同比分析
            factorValue: "AQI", // 默认选中
            factorPicker: false, // 选择因子
            factorColumns: ["AQI", 'PM2.5', 'PM10', 'SO2', 'O3', 'NO2', 'CO'], // 因子列表
            colorList: ["#FFCF3F","#5CDFD5","#D2F13C","#55DE38","#FF7840","#3E9AF7"],
            htmls: ["PM <sub>2.5</sub>", "PM <sub>10</sub>", "SO <sub>2</sub>", "O <sub>3</sub>", "NO <sub>2</sub>", "CO"],
            nameList: ["pm25", "pm10", "so2", "o3", "no2", "co"]
          }
        },
      activated() {
        // 获取实时空气质量
        this.getRealTimeAirQuality();
        // 近24小时趋势
        this.getRecentlyRealData();
        // 优良天数统计
        this.getGoodAndFineDays();
        // 综合贡献指数
        this.getComprehensive();
        // 首要污染物占比
        this.getFirstPollute();
        // 超标天数占比
        this.getStandardDays();
        // 空气质量累计情况
        this.getAirDataStatus();
        // 同比分析
        this.getTbStatisticData();
      },
      mounted() {
        let date = new Date()
        this.recentlyTime.endTime      = date.format("yyyyMMddhh")
        this.goodAndFineTime.endTime   = date.format("yyyyMMddhh")
        this.goodAndFineTime.startTime = date.format("yyyy010100")
        this.comprehensiveTime.startTime = date.format("yyyy010100")
        this.comprehensiveTime.endTime   = date.format("yyyyMMddhh")
        this.firstPolluteTime.startTime  = date.format("yyyy010100")
        this.firstPolluteTime.endTime    = date.format("yyyyMMddhh")
        this.standardTime.startTime  = date.format("yyyy010100")
        this.standardTime.endTime    = date.format("yyyyMMddhh")
        this.airDataTime.startTime  = date.format("yyyy010100")
        this.airDataTime.endTime    = date.format("yyyyMMddhh")
        this.tbTime.endTime    = date.format("yyyyMMddhh")
        date.setTime(date.getTime()-24*60*60*1000) // 近24小时
        this.recentlyTime.startTime = date.format("yyyyMMddhh")
        date.setTime(date.getTime()-3*365*24*60*60*1000) // 近三年
        this.tbTime.startTime    = date.format("yyyyMMddhh")
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
            let that = this
            this.countDayEcharts = this.$echarts.init(document.getElementById("echarts2"))
            let colorList= ["#24C768","#E5CE10","#FF7E00","#FF0000","#990000","#7E0000"]
            let levelList= ["优","良","轻度","中度","重度","严重"]
            this.goodfineData.data.map((item,index)=>{
              let obj       = {}
              obj.value     = item
              obj.name      = levelList[index]
              obj.itemStyle = {
                normal: {color: colorList[index]}
              }
              this.goodfineData.data[index] = obj
            })
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
                      formatter: '优良天数\n{a|'+(this.goodfineData.data[0].value + this.goodfineData.data[1].value)+'天}\n同比增长'+this.goodfineData.tb+'天',
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
                  data: this.goodfineData.data
                },
                {
                  type: 'pie',
                  radius: ['45%', '65%'],
                  label: {
                    position: 'outside',
                    normal: {
                      formatter: function(data){
                        let percent = data.percent.toFixed(1)+"%";
                        that.goodfineData.data[data.dataIndex].percent = percent
                        if( data.percent > 0 ) {
                          return percent;
                        } else {
                          return ""
                        }
                      } ,
                      textStyle: {
                        fontWeight: 'normal',
                        fontSize: 10,
                        color: '#666'
                      }
                    }
                  },
                  labelLine: {
                    show: false,
                    length: 0,
                    length2: 0,
                  },
                  data: this.goodfineData.data
                }
              ]
            }
            this.countDayEcharts.setOption(option2)
          },
          // 2020年度综合指数贡献比
          drawPieContribution(){
            let that = this
            this.pieContribution = this.$echarts.init(document.getElementById("echarts3"))
            let value    = 0
            this.comprehensiveData.data.map((item,index)=>{
              let obj       = {}
              obj.value     = item
              value        += item
              obj.name      = this.nameList[index]
              obj.html      = this.htmls[index]
              obj.itemStyle = {
                normal: {color: this.colorList[index]}
              }
              this.comprehensiveData.data[index] = obj
            })
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
                      formatter: '综合指数\n{a|'+value+'}\n同比减少'+this.comprehensiveData.tb,
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
                  data: this.comprehensiveData.data
                },
                {
                  type: 'pie',
                  radius: ['45%', '65%'],
                  label: {
                    position: 'outside',
                    normal: {
                      formatter: function(data){
                        let percent = data.percent.toFixed(1)+"%";
                        that.comprehensiveData.data[data.dataIndex].percent = percent
                        if( data.percent > 0 ) {
                          return percent;
                        } else {
                          return ""
                        }
                      } ,
                      textStyle: {
                        fontWeight: 'normal',
                        fontSize: 10,
                        color: '#666'
                      }
                    }
                  },
                  labelLine: {
                    show: false,
                    length: 1,
                    length2: 1,
                  },
                  data: this.comprehensiveData.data
                }
              ]
            }
            this.pieContribution.setOption(option2)
          },
          // 2020年首要污染物占比
          drawPieFirstWaste(){
            let that = this
            this.firstWaste = this.$echarts.init(document.getElementById("echarts4"))
            this.firstPolluteData.data.map((item,index)=>{
              let obj       = {}
              obj.value     = item
              obj.name      = this.nameList[index]
              obj.html      = this.htmls[index]
              obj.itemStyle = {
                normal: {color: this.colorList[index]}
              }
              this.firstPolluteData.data[index] = obj
            })
            console.log(this.firstPolluteData, "fir")
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
                  data: this.firstPolluteData.data
                },
                {
                  type: 'pie',
                  radius: ['45%', '65%'],
                  label: {
                    position: 'outside',
                    normal: {
                      formatter: function(data){
                        let percent = data.percent.toFixed(1)+"%";
                        that.firstPolluteData.data[data.dataIndex].percent = percent
                        if( data.percent > 0 ) {
                          return percent;
                        } else {
                          return ""
                        }
                      } ,
                      textStyle: {
                        fontWeight: 'normal',
                        fontSize: 10,
                        color: '#666'
                      }
                    }
                  },
                  labelLine: {
                    show: false,
                    length: 0,
                    length2: 0,
                  },
                  data: this.firstPolluteData.data
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
            let date = new Date()
            if( key == 0 ) {
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
            } else if( key == 1 ) {
              if( index == 0 ) {
                this.goodAndFineTime.startTime = date.format("yyyy010100")
              } else {
                this.goodAndFineTime.startTime = date.format("yyyyMM0100")
              }
              this.getGoodAndFineDays()
            } else if( key == 2 ) {
              if( index == 0 ) {
                this.comprehensiveTime.startTime = date.format("yyyy010100")
                this.comprehensiveTime.timeType  = "年"
              } else {
                this.comprehensiveTime.startTime = date.format("yyyyMM0100")
                this.comprehensiveTime.timeType  = "月"
              }
              this.getComprehensive()
            } else if( key == 3 ) {
              if( index == 0 ) {
                this.firstPolluteTime.startTime = date.format("yyyy010100")
              } else {
                this.firstPolluteTime.startTime = date.format("yyyyMM0100")
              }
              this.getFirstPollute()
            } else if( key == 4 ) {

            } else if( key == 5 ) {
              if( index == 0 ) {
                this.airDataTime.startTime = date.format("yyyy010100")
                this.airDataTime.timeType  = "年"
              } else {
                this.airDataTime.startTime = date.format("yyyyMM0100")
                this.airDataTime.timeType  = "月"
              }
              this.getAirDataStatus()
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
            this.$http.get("/AirAppXY-Service/air/airLineData", {params:this.recentlyTime}).then(res=>{
              if( res.data.code == 200 ) {
                this.recentData = res.data.content.info
                // 近24小时趋势图表
                this.drawLineHoursData();
              }
            })
          },
          // 优良天数占比
          getGoodAndFineDays(){
            this.$http.get("/AirAppXY-Service/air/getAirLevelData", {params: this.goodAndFineTime}).then(res=>{
              if( res.data.code == 200 ) {
                let obj = res.data.content.info
                this.goodfineData.data =  [obj[0], obj[1], obj[2], obj[3], obj[4], obj[5]]
                this.goodfineData.tb   = obj['01TB']
                // 优良天数统计
                this.drawPieCountDay();
              }
            })
          },
          // 综合贡献指数
          getComprehensive(){
            this.$http.get("/AirAppXY-Service/air/getAirCompositeIndex", {params: this.comprehensiveTime}).then(res=>{
              if( res.data.code == 200 ) {

                let obj = res.data.content.info
                this.comprehensiveData.data =  [obj.pm25, obj.pm10, obj.so2, obj.o3, obj.no2, obj.co]
                this.comprehensiveData.tb   =  obj['IndexDq_Tb']
                // 优良天数统计
                this.drawPieContribution();
              }
            })
          },
          // 首要污染物占比
          getFirstPollute(){
            this.$http.get("/AirAppXY-Service/air/getAirPollutionData", {params: this.firstPolluteTime}).then(res=>{
              if( res.data.code == 200 ) {
                let obj = res.data.content.info
                this.firstPolluteData.data =  [obj.PM25, obj.PM10, obj.SO2, obj.O3, obj.NO2, obj.CO]
                // 首要污染物占比
                this.drawPieFirstWaste();
              }
            })
          },
          // 超标天数占比
          getStandardDays(){
            this.$http.get("/AirAppXY-Service/air/getAirStandardData", {params: this.standardTime}).then(res=>{
              if( res.data.code == 200 ) {
                let obj = res.data.content.info
                this.standardData.data =  [obj.PM25, obj.PM10, obj.SO2, obj.O3, obj.NO2, obj.CO]
                // 2020年超标天数占比
                this.drawPieExceedDay();
              }
            })
          },
          // 空气质量累计情况
          getAirDataStatus() {
            this.$http.get("/AirAppXY-Service/air/getAirQualityData",{params: this.airDataTime}).then(res=>{
                if(res.data.code == 200) {
                  this.airData = res.data.content.info
                }
            })
          },
          // 同比分析
          getTbStatisticData(){
            this.$http.get("/AirAppXY-Service/air/getAirTBAnalyze",{params:this.tbTime}).then(res=>{
              if( res.data.code == 200 ) {
                // 同比分析
                this.drawLineMonthStatic();
              }
            })
          }
        },
        beforeRouteEnter(to,from,next){
          next(vm=>{
            if( vm.$store.state.vuex.stationData.id ) {
              vm.recentlyTime.mns       = vm.$store.state.vuex.stationData.id
              vm.recentlyTime.mnType    = "station"
              vm.goodAndFineTime.mns    = vm.$store.state.vuex.stationData.id
              vm.goodAndFineTime.mnType = "station"
              vm.comprehensiveTime.mns       = vm.$store.state.vuex.stationData.id
              vm.comprehensiveTime.mnType    = "station"
              vm.firstPolluteTime.mns       = vm.$store.state.vuex.stationData.id
              vm.firstPolluteTime.mnType    = "station"
              vm.standardTime.mns       = vm.$store.state.vuex.stationData.id
              vm.standardTime.mnType    = "station"
              vm.airDataTime.mns       = vm.$store.state.vuex.stationData.id
              vm.airDataTime.mnType    = "station"
            } else {
              vm.recentlyTime.mns       = ""
              vm.recentlyTime.mnType    = "city"
              vm.goodAndFineTime.mns    = ""
              vm.goodAndFineTime.mnType = "city"
              vm.comprehensiveTime.mns       = ""
              vm.comprehensiveTime.mnType    = "city"
              vm.firstPolluteTime.mns       = ""
              vm.firstPolluteTime.mnType    = "city"
              vm.standardTime.mns       = ""
              vm.standardTime.mnType    = "city"
              vm.airDataTime.mns       = ""
              vm.airDataTime.mnType    = "city"
            }
          })
        }
    }
</script>