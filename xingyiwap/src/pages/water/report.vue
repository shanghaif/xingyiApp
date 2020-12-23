<template>
    <div>
        <van-nav-bar left-arrow @click-left="historyBack" :fixed="true" class="common-nav-bar">
            <template #title>
                xx站点 <span class="navBarxl" @click="$router.push('/stationListSelect')"></span>
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
                        <td colspan="3">xx站点</td>
                    </tr>
                    <tr>
                        <td class="bg">监测时间</td>
                        <td>2020年12月</td>
                        <td class="bg">水质综合指数</td>
                        <td>0.89</td>
                    </tr>
                    <tr>
                        <td class="bg">水质类别</td>
                        <td><span class="level2">{{levelText[1]}}类</span></td>
                        <td class="bg">首要污染物</td>
                        <td>--</td>
                    </tr>
                </table>
                <h6>1、站点监测结果与分析</h6>
                <div class="desc">
                    <img src="../../assets/img/sy_point.png" alt="">2020年12月01日~2020年12月31日时间段内 [xx] 站点监测结果为：水质综合指数平均为1.33，与2019年12月01日~2019年12月31日监测结果相比，暂无数据。
                </div>
                <div class="echarts" id="echarts1">

                </div>
                <p class="echartsDesc">XX站点水质综合指数趋势图</p>
                <h6>2、各因子监测结果及分析</h6>
                <div class="desc">
                    <img src="../../assets/img/sy_point.png" alt="">    本站点2020年12月01日~2020年12月31日站点监测结果，与去年同期相比，暂无数据。
                </div>
                <div class="echarts" id="echarts2">

                </div>
                <div class="content">
                    <div id="echarts4">

                    </div>
                    <table border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td>因子</td>
                            <td>占比</td>
                            <td>天数</td>
                        </tr>
                        <tr>
                            <td><span class="so2"></span>so<sub>2</sub></td>
                            <td>50%</td>
                            <td>50</td>
                        </tr>
                        <tr>
                            <td><span class="so2"></span>so<sub>2</sub></td>
                            <td>50%</td>
                            <td>50</td>
                        </tr>
                        <tr>
                            <td><span class="so2"></span>so<sub>2</sub></td>
                            <td>50%</td>
                            <td>50</td>
                        </tr>
                        <tr>
                            <td><span class="so2"></span>so<sub>2</sub></td>
                            <td>50%</td>
                            <td>50</td>
                        </tr>
                        <tr>
                            <td><span class="so2"></span>so<sub>2</sub></td>
                            <td>50%</td>
                            <td>50</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
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
          levelText: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ"],
          timeClassSelectedPicker: false,
          timeClass: "月度", // 默认选中
          timeClassPicker: false, // 选择站点
          timeClassColumns: ["月度","季度", "年度"], // 站点列表
          minDate: new Date(2010, 0, 1),
          maxDate: new Date(),
          datePicker: false,
          currentDate: new Date(),
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
        }
      },
      mounted() {
          this.drawLineMonthStaticTb()
          this.drawLineMonthStaticTb2()
          this.drawPieFirstWaste()
      },
      methods: {
        onTimeClassConfirm(value, index){
          this.timeClass = value;
          this.timeClassSelectedPicker = false;
        },
        comfirmDateSelected(value){
          this.datePicker = false
          this.$refs.calendar.ChoseMonth(value.format("yyyy-MM"))
        },
        selectPicker(number){
          if( number == 5 ) {
            this.datePicker = true
          } else if( number == 6 ) {
            this.timeClassSelectedPicker = true
          }
        },
        drawBarEcharts(){
            let bar = this.$echarts.init(document.getElementById("echarts"))
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
                        color: "#666"
                    },
                    data: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ"]
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: 0,
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
                    name: 'sdata',
                    data: [44, 89, 123, 111, 200, 111],
                    type: 'bar',
                    barWidth: 15,
                    itemStyle: {
                        normal: {
                            //每根柱子颜色设置
                            color: function(params) {
                                switch (params.name) {
                                  case "Ⅰ":
                                    return "#CCFFFF"
                                    break;
                                  case "Ⅱ":
                                    return "#00CCFF"
                                    break;
                                  case "Ⅲ":
                                    return "#00FF00"
                                    break;
                                  case "Ⅳ":
                                    return "#FFFF00"
                                    break;
                                  case "Ⅴ":
                                    return "#FF9B00"
                                    break;
                                  case "劣Ⅴ":
                                    return "#FF0000"
                                    break;
                                }
                            },
                            label: {
                                show: true, //开启显示
                                position: 'top', //在上方显示
                                textStyle: { //数值样式
                                    color: '#1A1A1A',
                                    fontSize: 12
                                }
                            }
                        }
                    },
                    backgroundStyle: {
                        color: 'rgba(220, 220, 220, 0.8)'
                    }
                }]
            }
            bar.setOption(option)
        },
          // 达标情况
        drawLineMonthStaticTb(){
              let monthStatic = this.$echarts.init(document.getElementById('echarts1'))
              let option = {
                  tooltip: {
                      show: true
                  },
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
                      max: 100,
                      type: 'value',
                      axisTick: {
                          show: false
                      },
                      axisLabel: {
                          color: '#666666',
                          formatter: function (value) {
                              return value + "%"
                          }
                      },
                      axisLine: {
                          show: false
                      },
                  },
                  grid: {
                      top: "16%",
                      left: "12%",
                      bottom: "15%",
                      right: "4%"
                  },
                  series: [{
                      name: "2019年",
                      data: [45,77,12,45,25,21],
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
        drawPieFirstWaste(){
              this.firstWaste = this.$echarts.init(document.getElementById("echarts4"))
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
                          data: ['12', '16', '19']
                      },
                      {
                          type: 'pie',
                          radius: ['45%', '65%'],
                          label: {
                              position: 'outside',
                              normal: {
                                  formatter: function(data){
                                      let percent = data.percent.toFixed(1)+"%";
                                      return percent;
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
                          data: ['12', '16', '19']
                      }
                  ]
              }
              this.firstWaste.setOption(option2)
          },
        drawLineMonthStaticTb2(){
              let monthStatic = this.$echarts.init(document.getElementById('echarts2'))
              let option = {
                  tooltip: {
                      show: true
                  },
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
                      max: 100,
                      type: 'value',
                      axisTick: {
                          show: false
                      },
                      axisLabel: {
                          color: '#666666',
                          formatter: function (value) {
                              return value + "%"
                          }
                      },
                      axisLine: {
                          show: false
                      },
                  },
                  grid: {
                      top: "16%",
                      left: "12%",
                      bottom: "15%",
                      right: "4%"
                  },
                  series: [{
                      name: "2019年",
                      data: [45,77,12,45,25,21],
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
      }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/css/pages/assessment.less";
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