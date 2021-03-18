<template>
    <div>
        <van-nav-bar left-arrow @click-left="historyBack" :fixed="true" class="common-nav-bar">
            <template #title>
                {{$store.state.vuex.stationData.text}} <span class="navBarxl" @click="$router.push('/stationListSelect')"></span>
            </template>
        </van-nav-bar>
        <div class="contentAssessment">
            <div class="title_content">
                <span class="selectStation" @click="selectPicker(6)">
                    {{timeClass}} <span class="triangleDownStationToggle"></span>
                </span>
                <span class="selectStation" @click="selectPicker(5)">
                    {{currentDate.format("yyyy-MM")}} <span class="triangleDownStationToggle"></span>
                </span>
            </div>
            <div class="items">
                <h4 style="text-align: center">站点监测报告</h4>
                <table>
                    <tr>
                        <td class="bg">当前站点</td>
                        <td colspan="3">{{$store.state.vuex.stationData.text}}</td>
                    </tr>
                    <tr>
                        <td class="bg">监测时间</td>
                        <td>{{reportData.data.spt || '--'}}</td>
                        <td class="bg">AQI指数</td>
                        <td>{{reportData.data.aqi || '--'}}</td>
                    </tr>
                    <tr>
                        <td class="bg">空气等级</td>
                        <td><span :class="'level'+(switchLevel(reportData.data.airQuality)+1)">{{levelText[switchLevel(reportData.data.airQuality)] || '--'}}</span></td>
                        <td class="bg">首要污染物</td>
                        <td>{{reportData.primaryPollution || '--'}}</td>
                    </tr>
                </table>
                <h6>1、站点监测结果与分析</h6>
                <div class="desc">
                    <img src="../../assets/img/sy_point.png" alt="">{{reportData.message1}}
                </div>
                <div class="echarts" id="echarts1">

                </div>
                <p class="echartsDesc">{{$store.state.vuex.stationData.text}}空气综合指数趋势图</p>
                <h6>2、各因子监测结果及分析</h6>
                <div class="desc">
                    <img src="../../assets/img/sy_point.png" alt="">   {{reportData.message2}}
                </div>
                <div class="echarts" id="echarts2" style="height: 300px">

                </div>
                <h6>3、超标天数占比</h6>
                <div class="content">
                    <div id="echarts4">

                    </div>
                    <table border="0" cellspacing="0" cellpadding="0" class="table1">
                        <tr>
                            <td>因子</td>
                            <td>占比</td>
                            <td>天数</td>
                        </tr>
                        <tr v-for="(item,index) in standardData.data" :key="index">
                            <td><span :class="item.name"></span><font v-html="item.html"></font></td>
                            <td>{{item.percent}}</td>
                            <td>{{item.value}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <van-overlay :show="showInfo" @click="showInfo = false">
            <div class="wrapper" @click.stop>
                <van-loading type="spinner" />
            </div>
        </van-overlay>
        <!--月度、季度、年度选择-->
        <van-popup v-model="timeClassSelectedPicker" position="bottom">
            <van-picker
                show-toolbar
                :columns="timeClassColumns"
                @confirm="onTimeClassConfirm"
                @cancel="timeClassSelectedPicker = false"
            />
        </van-popup>
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
    </div>
</template>

<script>
    export default {
      name: "assessment",
      data(){
        return {
          showInfo: false,
          levelText: ["优", "良", "轻度", "中度", "重度", "严重"],
          timeClassSelectedPicker: false,
          timeClass: "月度", // 默认选中
          timeClassPicker: false, // 选择站点
          // timeClassColumns: ["月度","季度", "年度"],
          timeClassColumns: ["月度"], // 站点列表
          minDate: new Date(2010, 0, 1),
          maxDate: new Date(),
          datePicker: false,
          currentDate: new Date(),
          standardTime: {
            startTime: '',
            endTime: '',
            mnType: 'city',
            timeType: '日',
            mns: ''
          },
          tableData: [
              {
                  name: "达力堵德站",
                  level: 2,
                  isOk: 1,
              },
              {
                  name: "万峰湖九里堡站",
                  level: 2,
                  isOk: 1,
              },
              {
                  name: "下纳灰河站",
                  level: 2,
                  isOk: 1,
              },
              {
                  name: "黄泥河岔江站",
                  level: 2,
                  isOk: 1,
              },
              {
                  name: "湾塘河平寨站",
                  level: 2,
                  isOk: 1,
              }
          ],
          standardData: {
            data: []
          },
          reportData: {
            message1: "加载中……",
            message2: "加载中……",
            data: {
              airQuality: "",
              spt: ""
            }
          },
          reportTime: {
            startTime: "",
            endTime: "",
            timeType: "月",
            mns: ""
          },
          nameList: ["pm25", "pm10", "so2", "o3", "no2", "co"],
          colorList: ["#FFCF3F","#5CDFD5","#D2F13C","#55DE38","#FF7840","#3E9AF7"],
          htmls: ["PM <sub>2.5</sub>", "PM <sub>10</sub>", "SO <sub>2</sub>", "O <sub>3</sub>", "NO <sub>2</sub>", "CO"],
        }
      },
      mounted() {
          let d = new Date()
          this.reportTime.endTime   = this.standardTime.endTime   = d.format("yyyy"+d.format("MM")+"ddhh")
          this.reportTime.startTime = this.standardTime.startTime = d.format("yyyy"+d.format("MM")+"0100")

      },
      activated() {
        this.getReportInfo()
        this.getStandardDays()
      },
      beforeRouteEnter(to,from,next){
        next(vm=>{
          if( vm.$store.state.vuex.stationData.id ) {
            vm.reportTime.mns = vm.$store.state.vuex.stationData.id
            vm.standardTime.mns = vm.$store.state.vuex.stationData.id
            vm.standardTime.mnType = "station"
          } else {
            vm.reportTime.mns = ""
            vm.standardTime.mns = ""
            vm.standardTime.mnType = "city"
          }
        })
      },
      methods: {
        getReportInfo(){
            this.showInfo = true
            this.$http.get("/AirAppXY-Service/air/airStationReportData", {params: this.reportTime}).then(res=>{
              if( res.data.code == 200 ) {
                if( !res.data.content.info.data ) {
                  res.data.content.info.data = {}
                  res.data.content.info.data.spt = ""
                  res.data.content.info.data.airQuality = ""
                }
                this.reportData = res.data.content.info
                this.drawLineMonthStaticTb()
                this.drawLineMonthStaticTb2()
                this.showInfo = false
              }
            })
        },
        // 2020年超标天数占比
        drawPieExceedDay(){
          let that = this
          this.exceedDay = this.$echarts.init(document.getElementById("echarts4"))
          // let colorList= ["#24C768","#E5CE10","#FF7E00","#FF0000","#990000","#7E0000"]
          this.standardData.data.map((item,index)=>{
            let obj       = {}
            obj.value     = item
            obj.name      = this.nameList[index]
            obj.html      = this.htmls[index]
            obj.itemStyle = {
              normal: {color: this.colorList[index]}
            }
            this.standardData.data[index] = obj
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
                data: this.standardData.data
              },
              {
                type: 'pie',
                radius: ['45%', '65%'],
                label: {
                  position: 'outside',
                  normal: {
                    formatter: function(data){
                      let percent = data.percent.toFixed(1)+"%";
                      that.standardData.data[data.dataIndex].percent = percent
                      if( data.percent > 0 ) {
                        return percent;
                      } else {
                        return ""
                      }
                    },
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
                data: this.standardData.data
              }
            ]
          }
          this.exceedDay.setOption(option2)
        },
        switchLevel(quality){
            if( !quality ) {
                return 6
            }
          if( quality.indexOf("优") != -1 ) {
            return 0
          } else if( quality.indexOf("良") != -1 ) {
            return 1
          } else if( quality.indexOf("轻度") != -1 ) {
            return 2
          } else if( quality.indexOf("中度") != -1 ) {
            return 3
          } else if( quality.indexOf("重度") != -1 ) {
            return 4
          } else if( quality.indexOf("严重") != -1 ) {
            return 5
          }
        },
        onTimeClassConfirm(value, index){
          this.timeClass = value;
          this.timeClassSelectedPicker = false;
        },
        comfirmDateSelected(value){
          this.datePicker = false
          this.reportTime.startTime = this.standardTime.startTime = value.format("yyyyMM0100")
          let d = new Date(value.format("yyyy"), value.format("MM"), 0)
          this.reportTime.endTime   = this.standardTime.endTime   = value.format("yyyyMM"+d.format("dd")+"23")
          this.getReportInfo()
          this.getStandardDays()
        },
        selectPicker(number){
          if( number == 5 ) {
            this.datePicker = true
          } else if( number == 6 ) {
            this.timeClassSelectedPicker = true
          }
        },
          // 达标情况
        drawLineMonthStaticTb(){
              let that = this
              let monthStatic = this.$echarts.init(document.getElementById('echarts1'))
              let option = {
                  tooltip: {
                      show: true
                  },
                  xAxis: {
                      type: 'category',
                      data: this.reportData.airLine.time,
                      axisLabel: {
                          show: true,
                          type: 'category',
                          rotate: 30,
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
                      interval: 1,
                      min: 0,
                      max: 5,
                      type: 'value',
                      axisTick: {
                          show: false
                      },
                      axisLabel: {
                          color: '#666666',
                          formatter: function (value) {
                              return that.levelText[Number(value)]
                          }
                      },
                      axisLine: {
                          show: false
                      },
                  },
                  grid: {
                      top: "16%",
                      left: "12%",
                      bottom: "20%",
                      right: "4%"
                  },
                  series: [{
                      name: "2019年",
                      data: this.reportData.airLine.level,
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
                  }]
              };
              monthStatic.setOption(option);
          },
        // 超标天数占比
        getStandardDays(){
          this.$http.get("/AirAppXY-Service/air/getAirStandardData", {params: this.standardTime}).then(res=>{
            if( res.data.code == 200 ) {
              let obj = res.data.content.info
              this.standardData.data =  [obj.pm25, obj.pm10, obj.so2, obj.o3, obj.no2, obj.co]
              // 2020年超标天数占比
              this.drawPieExceedDay();
            }
          })
        },
        replaceWords(name){
          return name.replace("PM2.5", "PM{sub|2.5}").replace("PM10", "PM{sub|10}").replace("SO2", "SO{sub|2}").replace("O3", "O{sub|3}").replace("NO2", "NO{sub|2}")
        },
        drawLineMonthStaticTb2(){
              let that = this
              let monthStatic = this.$echarts.init(document.getElementById('echarts2'))
              let option = {
                  tooltip: {
                      show: true
                  },
                  xAxis: {
                      type: 'category',
                      data: this.reportData.factorLine.time,
                      axisLabel: {
                          rotate: 30,
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
                      interval: 1,
                      min: 0,
                      max: 5,
                      type: 'value',
                      axisTick: {
                          show: false
                      },
                      axisLabel: {
                          color: '#666666',
                          formatter: function (value) {
                            return that.levelText[Number(value)]
                          }
                      },
                      axisLine: {
                          show: false
                      },
                  },
                  grid: {
                      top: "16%",
                      left: "12%",
                      bottom: "25%",
                      right: "4%"
                  },
                  legend: {
                    x: "center",
                    y: "bottom",
                    icon: "rect",
                    itemWidth: 10,
                    itemHeight: 10,
                    formatter:function(name){
                      return that.replaceWords(name);
                    },
                    textStyle: {
                      rich: {
                        // 数字下标
                        sub: {
                          verticalAlign: "bottom",
                          fontSize: 8
                        },
                      }
                    }
                  },
                  series: [
                      {
                          name: "PM2.5",
                          data: this.reportData.factorLine.pm25_level,
                          type: 'line',
                          smooth: true,
                          symbolSize: 8,   //折线点的大小
                          itemStyle: {
                              normal: {
                                  color: '#FFCF3F', //折点颜色
                                  lineStyle: {
                                      color: '#FFCF3F' //折线颜色
                                  }
                              }
                          }
                      },
                    {
                      name: "PM10",
                      data: this.reportData.factorLine.pm10_level,
                      type: 'line',
                      smooth: true,
                      symbolSize: 8,   //折线点的大小
                      itemStyle: {
                        normal: {
                          color: '#5CDFD5', //折点颜色
                          lineStyle: {
                            color: '#5CDFD5' //折线颜色
                          }
                        }
                      }
                    },
                    {
                      name: "SO2",
                      data: this.reportData.factorLine.so2_level,
                      type: 'line',
                      smooth: true,
                      symbolSize: 8,   //折线点的大小
                      itemStyle: {
                        normal: {
                          color: '#D2F13C', //折点颜色
                          lineStyle: {
                            color: '#D2F13C' //折线颜色
                          }
                        }
                      }
                    },
                    {
                      name: "O3",
                      data: this.reportData.factorLine.o3_level,
                      type: 'line',
                      smooth: true,
                      symbolSize: 8,   //折线点的大小
                      itemStyle: {
                        normal: {
                          color: '#55DE38', //折点颜色
                          lineStyle: {
                            color: '#55DE38' //折线颜色
                          }
                        }
                      }
                    },
                    {
                      name: "NO2",
                      data: this.reportData.factorLine.no2_level,
                      type: 'line',
                      smooth: true,
                      symbolSize: 8,   //折线点的大小
                      itemStyle: {
                        normal: {
                          color: '#FF7840', //折点颜色
                          lineStyle: {
                            color: '#FF7840' //折线颜色
                          }
                        }
                      }
                    },
                    {
                      name: "CO",
                      data: this.reportData.factorLine.co_level,
                      type: 'line',
                      smooth: true,
                      symbolSize: 8,   //折线点的大小
                      itemStyle: {
                        normal: {
                          color: '#3E9AF7', //折点颜色
                          lineStyle: {
                            color: '#3E9AF7' //折线颜色
                          }
                        }
                      }
                    }
                  ]
              };
              monthStatic.setOption(option);
          },
      }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/css/pages/assessment.less";
    // 定义首页因子颜色值
    @colorsYz: {
        pm25: #FFCF3F;
        pm10: #5CDFD5;
        so2: #D2F13C;
        o3: #55DE38;
        no2: #FF7840;
        co: #3E9AF7;
    };
    .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
    .items{
        h4,h6{
            margin: 0;
            padding: 0;
        }
        h6{
            margin: 5px 0;
        }
        .desc{
            font-size: 12px;
            color: #333333;
            img{
                max-width: 10px;
                margin-right: 5px;
            }
        }
        .echartsDesc{
            text-align: center;
            color:#666666;
            font-size: 12px;
        }
        .content{
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            div{
                width: 45%;
                height: 200px;
            }
            table{
                width: 45%;
                td{
                    &:first-child{
                        text-align: left !important;
                    }
                    span{
                        display: inline-block;
                        width: 10px;
                        height: 10px;
                        padding: 0 !important;
                        each(@colorsYz, {
                            &.@{key}{
                                background: @value;
                            }
                        })
                    }
                }
            }
        }
    }
    table{
        td{
            border: 1px solid #D6E3F2;
            width: 25%;
            &.bg{
                background: #F5F7FA;
            }
        }
    }
</style>