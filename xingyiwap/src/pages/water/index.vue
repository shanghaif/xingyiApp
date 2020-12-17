<template>
    <div class="pages_content">
        <van-nav-bar :fixed="true" class="common-nav-bar">
            <template #left>
                <img src="../../assets/img/user_icon.png" @click="$router.push({path: '/mine'})" style="height: 18px; width: 18px" alt="">
            </template>
            <template #title>
                xx站点
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
            <p class="update">更新：2020-01-10 10:00</p>
            <div class="menu_list">
                <ul>
                    <li @click="goto(1)"><img src="../../assets/img/home/wrrl.png" style="width: 43.2px; height: 43.8px" alt=""><br>污染日历</li>
                    <li @click="goto(2)"><img src="../../assets/img/home/jrdb.png" style="width: 43.2px; height: 43.8px" alt=""><br>达标分析</li>
                    <li @click="goto(3)"><img src="../../assets/img/home/jrfz.png" style="width: 43.2px; height: 43.8px" alt=""><br>历史数据</li>
                    <li @click="goto(4)"><img src="../../assets/img/home/jrbj.png" style="width: 43.2px; height: 43.8px" alt=""><br>报表分析</li>
                </ul>
            </div>
            <div class="svgCanvas" style="width: 70%; margin: 0 15%">
                <div id="dashboard" style="width: 100%; height: 100%">

                </div>
                <div class="waterDisc">
                    目标水质：<span class="level3">Ⅲ</span>，首要污染物：无
                </div>
            </div>
            <div class="actionCanvas">
                <div class="boat">
                    <img src="../../assets/img/home/xiaoshui.png" style="width: 75px; height: 116px;margin-top: 145px; margin-left: 60px" alt="">
                </div>
                <div class="aqiContent">
                    <ul class="waterContent">
                        <li>34</li>
                        <li>52</li>
                        <li>8.12</li>
                        <li>15</li>
                        <li>110</li>
                        <li>0.6</li>
                        <li>COD</li>
                        <li>pH值</li>
                        <li>总磷</li>
                        <li>高锰酸盐</li>
                        <li>溶解氧</li>
                        <li>氨氮</li>
                        <li class="level1">Ⅰ</li>
                        <li class="level2">Ⅱ</li>
                        <li class="level3">Ⅲ</li>
                        <li class="level4">Ⅳ</li>
                        <li class="level5">Ⅴ</li>
                        <li class="level6">劣Ⅴ</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="chartsFormData">
            <div class="item">
                <div class="title">
                    <div class="left"><span></span> 水质监测数据</div>
                    <div class="right"><span class="selectStation" @click="selectPicker(2)">{{factorValue}} <span class="triangleDownStationToggle"></span></span></div>
                </div>
                <div class="content">
                    <div class="waterChangeSelect">
                        <ul>
                            <li :class="selectTimeActive[0]" @click="selectTime(0)">每时</li>
                            <li :class="selectTimeActive[1]" @click="selectTime(1)">每日</li>
                            <li :class="selectTimeActive[2]" @click="selectTime(2)">每月</li>
                        </ul>
                    </div>
                    <div class="factorMaxAndMin">
                        <ul>
                            <li>0.25 <img src="../../assets/img/avg.png" alt=""></li>
                            <li>0.45 <img src="../../assets/img/max.png" alt=""></li>
                            <li>0.08 <img src="../../assets/img/min.png" alt=""></li>
                        </ul>
                    </div>
                    <div class="echarts" id="echarts">

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
                                <td>总磷(mg/L)</td>
                            </tr>
                            <tr>
                                <td>13日1时</td>
                                <td>67</td>
                            </tr>
                            <tr>
                                <td>13日2时</td>
                                <td>89</td>
                            </tr>
                            <tr>
                                <td>13日3时</td>
                                <td>123</td>
                            </tr>
                            <tr>
                                <td>13日4时</td>
                                <td>256</td>
                            </tr>
                            <tr>
                                <td>13日5时</td>
                                <td>200</td>
                            </tr>
                            <tr>
                                <td>13日6时</td>
                                <td>111</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="title">
                    <div class="left"><span></span> 水质类型分布图</div>
                    <div class="right"><span class="selectStation" @click="selectPicker(3)">{{currentDate.format("yyyy-MM")}} <span class="triangleDownStationToggle"></span></span></div>
                </div>
                <div class="content">
                    <calendar
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
            <div class="item">
                <div class="title">
                    <div class="left"><span></span> 同比分析</div>
                    <div class="right"><span class="selectStation" @click="selectPicker(4)">{{factorValueTb}} <span class="triangleDownStationToggle"></span></span></div>
                </div>
                <div class="content factor">
                    <div class="echarts" id="echarts6">

                    </div>
                </div>
            </div>
            <div class="item">
                <div class="title">
                    <div class="left"><span></span> 水质达标情况</div>
                    <div class="right"><span class="selectStation" @click="selectPicker(6)">{{timeClass}} <span class="triangleDownStationToggle"></span></span><span class="selectStation" @click="selectPicker(5)">{{currentDateDb.format("yyyy-MM")}} <span class="triangleDownStationToggle"></span></span></div>
                </div>
                <div class="content factor">
                    <div class="factorMaxAndMin" style="margin-top: 0; margin-bottom: 10px">
                        <ul>
                            <li>水质达标率：80%</li>
                            <li>目标水质：<span class="level3">Ⅲ</span></li>
                        </ul>
                    </div>
                    <div class="echarts" id="echarts7">

                    </div>
                </div>
            </div>
        </div>
        <!-- 站点选择-->
        <van-popup v-model="stationPicker" position="bottom">
            <van-picker
                    show-toolbar
                    :columns="stationColumns"
                    @confirm="onStationConfirm"
                    @cancel="stationPicker = false"
            />
        </van-popup>
        <!--月度、季度、年度选择-->
        <van-popup v-model="timeClassSelectedPicker" position="bottom">
            <van-picker
                show-toolbar
                :columns="timeClassColumns"
                @confirm="onTimeClassConfirm"
                @cancel="timeClassSelectedPicker = false"
            />
        </van-popup>
        <!-- 因子选择-->
        <van-popup v-model="factorPicker" position="bottom">
            <van-picker
                    show-toolbar
                    :columns="factorColumns"
                    @confirm="onFactorConfirm"
                    @cancel="factorPicker = false"
            />
        </van-popup>
        <!-- 同比分析弹窗-->
        <van-popup v-model="factorPickerTb" position="bottom">
            <van-picker
                    show-toolbar
                    :columns="factorColumnsTb"
                    @confirm="onFactorConfirmTb"
                    @cancel="factorPickerTb = false"
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
        <!-- 日期选择 -->
        <van-popup v-model="datePickerDb" position="bottom">
            <van-datetime-picker
                v-model="currentDateDb"
                type="year-month"
                title="选择年月"
                :min-date="minDate"
                :max-date="maxDate"
                @confirm="comfirmDateSelectedDb"
                @cancel="datePickerDb = false"
            />
        </van-popup>
    </div>
</template>

<script>
  import calendar from "../../components/calendar";
  export default {
    name: "water",
    components: {
      calendar
    },
    data () {
      return {
        marker: [
            {"date":"2020-12-01","className":"level2"},
            {"date":"2020-12-02","className":"level1"},
            {"date":"2020-12-03","className":"level2"},
            {"date":"2020-12-04","className":"level2"},
            {"date":"2020-12-05","className":"level2"},
            {"date":"2020-12-06","className":"level2"},
            {"date":"2020-12-07","className":"level2"},
            {"date":"2020-12-08","className":"level2"},
            {"date":"2020-12-09","className":"level1"},
            {"date":"2020-12-10","className":"level2"},
            {"date":"2020-12-11","className":"level3"},
            {"date":"2020-12-12","className":"level4"},
            {"date":"2020-12-13","className":"level4"},
            {"date":"2020-12-14","className":"level1"},
            {"date":"2020-12-15","className":"level1"},
            {"date":"2020-12-16","className":""},
            {"date":"2020-12-17","className":""},
            {"date":"2020-12-18","className":""},
            {"date":"2020-12-19","className":""},
            {"date":"2020-12-20","className":""},
            {"date":"2020-12-21","className":""},
            {"date":"2020-12-22","className":""},
            {"date":"2020-12-23","className":""},
            {"date":"2020-12-24","className":""},
            {"date":"2020-12-25","className":""},
            {"date":"2020-12-26","className":""},
            {"date":"2020-12-27","className":""},
            {"date":"2020-12-28","className":""},
            {"date":"2020-12-29","className":""},
            {"date":"2020-12-30","className":""},
            {"date":"2020-12-31","className":""}
        ],
        minDate: new Date(2010, 0, 1),
        maxDate: new Date(),
        datePicker: false,
        datePickerDb: false,
        currentDate: new Date(),
        currentDateDb: new Date(),
        options: {
          srtokeWidth: 2.4  // svg线宽度
        },
        selectTimeActive: ["active"],
        selectActive: [["active"],["active"],["active"],["active"],["active"],["active"]],
        lineHoursEcharts: {}, // 水质监测数据
        countDayEcharts: {}, // 2020年优良天数统计
        pieContribution: {}, // 2020年度综合指数贡献比
        firstWaste: {}, // 2020年首要污染物占比
        exceedDay: {}, // 2020年超标天数占比
        monthStatic: {}, // 同比分析
        stationValue: "站点", // 默认选中
        stationPicker: false, // 选择站点
        stationColumns: ["站点A","站点B"], // 站点列表
        factorValue: "总磷", // 默认选中
        factorPicker: false, // 选择因子
        factorColumns: ["COD", 'pH值', '总磷', '高锰酸盐', '溶解氧', '氨氮'], // 因子列表
        factorValueTb: "总磷",
        factorPickerTb: false, // 选择因子
        factorColumnsTb: ["COD", 'pH值', '总磷', '高锰酸盐', '溶解氧', '氨氮'], // 因子列表
        timeClassSelectedPicker: false,
        timeClass: "月度", // 默认选中
        timeClassPicker: false, // 选择站点
        timeClassColumns: ["月度","季度", "年度"], // 站点列表
      }
    },
    mounted() {
      // 顶部仪表盘
      this.initDashboard();
      // 水质监测数据
      this.drawLineHoursData();
      // 同比分析
      this.drawLineMonthStatic();
      // 达标情况
      this.drawLineMonthStaticTb();
    },
    methods: {
      // 顶部菜单跳转
      goto(number){
      },
      comfirmDateSelected(value){
        this.datePicker = false
        this.$refs.calendar.ChoseMonth(value.format("yyyy-MM"))
      },
      comfirmDateSelectedDb(value){
        this.datePickerDb = false
      },
      // 水质监测数据
      drawLineHoursData(){
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
            data: ['13日1时','13日2时','13日3时','13日4时','13日5时','13日6时']
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
            name: 'sdata',
            data: [67, 89, 123, 256, 200, 111],
            type: 'bar',
            barWidth: 7,
            itemStyle: {
              normal: {
                //每根柱子颜色设置
                color: function(params) {
                  return "#24C768";
                  // switch (that.dataItem.LEVEL[params.dataIndex]) {
                  //   case "优":
                  //     return "#24C768"
                  //     break;
                  //   case "良":
                  //     return "#E5CE10"
                  //     break;
                  //   case "轻度污染":
                  //     return "#FF7E00"
                  //     break;
                  //   case "中度污染":
                  //     return "#FF0000"
                  //     break;
                  //   case "重度污染":
                  //     return "#990000"
                  //     break;
                  //   case "严重污染":
                  //     return "#7E0000"
                  //     break;
                  // }
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
      // 达标情况
      drawLineMonthStaticTb(){
        let monthStatic = this.$echarts.init(document.getElementById('echarts7'))
        let option = {
          tooltip: {
            show: true
          },
          title: {
            text: "水质达标变化情况",
            textStyle: {
              fontSize: 12,
              fontWeight: 100
            }
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
      // 选择站点确认回调
      onStationConfirm(value, index) {
        this.stationValue = value;
        this.stationPicker = false;
      },
      onTimeClassConfirm(value, index){
        this.timeClass = value;
        this.timeClassSelectedPicker = false;
      },
      // 选择因子回调
      onFactorConfirm(value, index){
        this.factorValue = value;
        this.factorPicker = false;
      },
      // 选择因子回调(同比分析)
      onFactorConfirmTb(value, index){
        this.factorValueTb = value;
        this.factorPickerTb = false;
      },
      // 统一切换处理
      changeItem(key, index){
        this.$set(this.selectActive, key, [])
        this.$set(this.selectActive[key], index, "active")
      },
      selectTime(number){
        this.selectTimeActive         = []
        this.selectTimeActive[number] = "active"
      },
      // 顶部仪表盘
      initDashboard(){
        let echarts = this.$echarts.init(document.getElementById("dashboard"))
        let option = {
          tooltip: {
            formatter: '{b}{c}'
          },
          series: [{
            tooltip: {
              show: false
            },
            type: 'gauge',
            radius: '100%',
            center: ['50%', '60%'],
            startAngle: 180,
            endAngle: 0,
            detail: {
              show: false
            },
            axisLine: {
              lineStyle: {
                width: 4,
                color: [
                  [0.19, '#CCFFFF'],
                  [0.39, '#00CCFF'],
                  [0.59, '#00FF00'],
                  [0.79, '#FFFF00'],
                  [0.99, '#FF9B00'],
                  [1, '#FF0000'],
                ]
              }
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          }, {
            type: 'gauge',
            radius: '100%',
            min: 0,
            max: 5,
            center: ['50%', '60%'],
            data: [{
              value: 4,
              name: '当前水质'
            }],
            splitNumber: 5,
            startAngle: 180,
            endAngle: 0,
            title: {
              offsetCenter: ['-50%', '20%'],
              fontSize: 12,
              color: "#fff"
            },
            detail: {
              formatter: function(value) {
                return "Ⅴ"
              },
              fontSize: 40,
              color: "#fff",
              offsetCenter: ['0%', '40%']
            },
            axisLine: {
              lineStyle: {
                width: 0,
                color: [
                  [0.19, '#CCFFFF'],
                  [0.39, '#00CCFF'],
                  [0.59, '#00FF00'],
                  [0.79, '#FFFF00'],
                  [0.99, '#FF9B00'],
                  [1, '#FF0000'],
                ]
              }
            },
            axisLabel: {
              color: '#fff',
              fontSize: 10,
              distance: 0,
              formatter: function(value) {
                if(value >= 5) {
                  return "劣Ⅴ"
                } else if (value >= 4) {
                  return 'Ⅴ'
                } else if (value >= 3) {
                  return 'Ⅳ'
                }
                else if (value >= 2) {
                  return 'Ⅲ'
                }
                else if (value >= 1) {
                  return 'Ⅱ'
                }
                else if (value >= 0) {
                  return 'Ⅰ'
                }
              }
            },
            axisTick: {
              splitNumber: 10,
              show: true,
              lineStyle: {
                color: 'auto',
                width: 2
              },
              length: 10,
            },
            splitLine: {
              show: true,
              length: 14,
              lineStyle: {
                color: 'auto',
                width: 2
              }
            },
            itemStyle: {
              normal: {
                color: 'auto'
              }
            },
            pointer: {
              width: 5,
              length: '50%'
            }
          }]
        };
        echarts.setOption(option)
      },
      clickDay(value){
      },
      changeMonth(){},

    }
  }
</script>