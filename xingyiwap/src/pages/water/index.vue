<template>
    <div class="pages_content">
        <van-nav-bar :fixed="true" class="common-nav-bar">
            <template #left>
                <img src="../../assets/img/user_icon.png" @click="$router.push({path: '/mine'})" style="height: 18px; width: 18px" alt="">
            </template>
            <template #title>
                {{$store.state.vuex.stationDataWater.text}} <span class="navBarxl" @click="$router.push('/stationListSelectWater')"></span>
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
            <p class="update">更新：{{realData.aRealData.spt}}</p>
            <div class="menu_list">
                <ul>
                    <li @click="goto(1)"><img src="../../assets/img/home/wrrl.png" style="width: 43.2px; height: 43.8px" alt=""><br>污染日历</li>
<!--                    <li @click="goto(2)"><img src="../../assets/img/home/jrdb.png" style="width: 43.2px; height: 43.8px" alt=""><br>达标分析</li>-->
                    <li @click="goto(3)"><img src="../../assets/img/home/jrfz.png" style="width: 43.2px; height: 43.8px" alt=""><br>历史数据</li>
                    <li @click="goto(4)"><img src="../../assets/img/home/jrbj.png" style="width: 43.2px; height: 43.8px" alt=""><br>报表分析</li>
                </ul>
            </div>
            <div class="svgCanvas" style="width: 70%; margin: 0 15%">
                <div id="dashboard" style="width: 100%; height: 100%">

                </div>
                <div class="waterDisc">
                    目标水质：<span :class="'level'+(Number(realData.targetLevel)+1)">{{levelText[Number(realData.targetLevel)]}}</span>，首要污染物：{{realData.aRealData.primary_pollutant || '--'}}
                </div>
            </div>
            <div class="actionCanvas">
                <div class="boat">
                    <img src="../../assets/img/home/xiaoshui.png" style="width: 75px; height: 116px;margin-top: 145px; margin-left: 60px" alt="">
                </div>
                <div class="aqiContent">
                    <ul class="waterContent">
<!--                        <li>{{realData.aRealData.cond}}</li>-->
                        <li>{{realData.aRealData.ph || '--'}}</li>
                        <li>{{realData.aRealData.tp || '--'}}</li>
                        <li>{{realData.aRealData.codmn || '--'}}</li>
                        <li>{{realData.aRealData.dox || '--'}}</li>
                        <li>{{realData.aRealData.nh3n || '--'}}</li>
<!--                        <li>电导率</li>-->
                        <li>pH值</li>
                        <li>总磷</li>
                        <li>高锰酸盐</li>
                        <li>溶解氧</li>
                        <li>氨氮</li>
<!--                        <li class="level1" style="background-color: #ccc">无</li>-->
                        <li class="level2" style="background-color: #ccc">无</li>
                        <li :class="'level'+(realData.aRealData.tp_level+1)">{{levelText[realData.aRealData.tp_level] || '--'}}</li>
                        <li :class="'level'+(realData.aRealData.codmn_level+1)">{{levelText[realData.aRealData.codmn_level] || '--'}}</li>
                        <li :class="'level'+(realData.aRealData.dox_level+1)">{{levelText[realData.aRealData.dox_level] || '--'}}</li>
                        <li :class="'level'+(realData.aRealData.nh3n_level+1)">{{levelText[realData.aRealData.nh3n_level] || '--'}}</li>
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
                            <li>{{monitorData.avg}} <img src="../../assets/img/avg.png" alt=""></li>
                            <li>{{monitorData.max}} <img src="../../assets/img/max.png" alt=""></li>
                            <li>{{monitorData.min}} <img src="../../assets/img/min.png" alt=""></li>
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
                                <td>{{factorValue}}(mg/L)</td>
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
                    <div class="left"><span></span> 水质类型分布图</div>
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
                    <div class="right"><span class="selectStation" @click="selectPicker(6)">{{timeClass}} <span class="triangleDownStationToggle"></span></span><span class="selectStation" @click="selectPicker(5)">{{currentDateDb.format(formatDate)}} <span class="triangleDownStationToggle"></span></span></div>
                </div>
                <div class="content factor">
                    <div class="factorMaxAndMin" style="margin-top: 0; margin-bottom: 10px">
                        <ul>
                            <li>水质达标率：{{standardData.standard*100}}%</li>
                            <li>目标水质：<span :class="'level'+(standardData.targetLevel+1)">{{levelText[standardData.targetLevel]}}</span></li>
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
                    :default-index="1"
                    :columns="factorColumns"
                    @confirm="onFactorConfirm"
                    @cancel="factorPicker = false"
            />
        </van-popup>
        <!-- 同比分析弹窗-->
        <van-popup v-model="factorPickerTb" position="bottom">
            <van-picker
                    show-toolbar
                    :default-index="2"
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
        formatDate: "yyyy",
        marker: [
        ],
        minDate: new Date(2010, 0, 1),
        maxDate: new Date(),
        datePicker: false,
        datePickerDb: false,
        currentDate: new Date(),
        currentDateDb: new Date(),
        realData: {
          aRealData: {}
        },
        monitorData: {},
        levelText: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ"],
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
        factorColumns: ['pH值', '总磷', '高锰酸盐', '溶解氧', '氨氮'], // 因子列表
        factorValueArray: ['ph', 'tp', 'codmn','dox','nh3n'],
        factorValueTb: "总磷",
        factorPickerTb: false, // 选择因子
        factorColumnsTb: ['水质','pH值', '总磷', '高锰酸盐', '溶解氧', '氨氮'], // 因子列表
        timeClassSelectedPicker: false,
        timeClass: "年度", // 默认选中
        timeClassPicker: false, // 选择站点
       //  timeClassColumns: ["月度", "年度"], // 站点列表
        timeClassColumns: ["年度"],
        realQualityTime: {
          mns: ""
        },
        showCalendar: false,
        monitorTime: {
          startTime: '',
          endTime: '',
          timeType: '小时',
          factor: 'tp',
          mns: ""
        },
        distributionTime: {
          startTime: '',
          endTime: '',
          timeType: '日',
          mns: ""
        },
        tbTime: {
          startTime: '',
          endTime: '',
          timeType: '月',
          factor: 'tp',
          mns: ""
        },
        standardTime: {
          startTime: '',
          endTime: '',
          timeType: '月',
          mns: ""
        },
        tbData: {},
        waterColor: ["#CCFFFF","#00CCFF","#00FF00","#FFFF00","#FF9B00","#FF0000"],
        standardData: {
          standard: 0,
        },
      }
    },
    mounted() {
      let d = new Date()
      this.monitorTime.endTime = d.format("yyyyMMddhh")
      this.distributionTime.endTime = d.format("yyyyMMddhh")
      this.distributionTime.startTime = d.format("yyyyMM0100")
      this.tbTime.startTime = d.format("yyyy010100")
      this.tbTime.endTime   = d.format("yyyyMMddhh")
      this.standardTime.endTime = d.format("yyyyMMddhh")
      this.standardTime.startTime = d.format("yyyy010100")
      d.setTime(d.getTime()-24*60*60*1000)
      this.monitorTime.startTime = d.format("yyyyMMddhh")
    },
    created() {

    },
    activated() {
      // 获取默认站点
      this.getStationList();
    },
    methods: {
      // 获取站点列表
      getStationList() {
        this.$http.get("/AirAppXY-Service/map/queryTreeW", {params: {typeCode: 'WQ', basinnOrAreaOrCustom: "type"}}).then(res=>{
          if( res.data.code == 200 ) {
            if( !this.$store.state.vuex.stationDataWater.id ) {
              this.$set(this.$store.state.vuex.stationDataWater, "text", res.data.content.info[2].children[0].nodeName)
              this.$set(this.$store.state.vuex.stationDataWater, "id", res.data.content.info[2].children[0].nodeId)
              this.$set(this.$store.state.vuex.stationDataWater, "children", [])
              localStorage.setItem("stationDataWater",JSON.stringify(this.$store.state.vuex.stationDataWater))
            }
            this.realQualityTime.mns = this.monitorTime.mns = this.tbTime.mns = this.distributionTime.mns = this.standardTime.mns = this.$store.state.vuex.stationDataWater.id
            // 获取水质达标情况
            this.getWaterRealQuality();
            // 水质监测数据
            this.getMonitorData();
            // 水质日历
            this.getWaterDistribution();
            // 同比数据
            this.getTbStacticsData();
            // 水质达标
            this.getWaterStandardStatus();
          }
        })
      },
      getWaterRealQuality() {
        this.$http.get("/AirAppXY-Service/water/waterRealQuality",{params: this.realQualityTime}).then(res=>{
          if( res.data.code == 200 ) {
            this.realData = res.data.content.info
            // 顶部仪表盘
            this.initDashboard();
          }
        })
      },
      // 顶部菜单跳转
      goto(number){
        if( number == 1 ) {
          this.$router.push("/calendarWater")
        } else if( number == 3 ) {
          this.$router.push("/history")
        } else if( number == 4 ) {
          this.$router.push("/reportWater")
        }
      },
      comfirmDateSelected(value){
        this.datePicker = false
        this.$refs.calendar.ChoseMonth(value.format("yyyy-MM"))
        this.distributionTime.startTime = value.format("yyyyMMddhh")
        let lastDay = new Date(value.format("yyyy"), value.format("MM"), 0).getDate();
        this.distributionTime.endTime   = value.format("yyyyMM"+lastDay+"hh")
        this.getWaterDistribution();
      },
      comfirmDateSelectedDb(value){
        this.datePickerDb = false
        this.standardTime.startTime = value.format("yyyy010100")
        let d = new Date(value.format("yyyy"),12,0);
        this.standardTime.endTime   = value.format("yyyy12"+d.getDate()+"00")
        this.getWaterStandardStatus()
      },
      // 水质监测数据
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
                  if( that.factorValue == "pH值" ) {
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
        this.lineHoursEcharts.setOption(option)
      },
      // 同比分析
      drawLineMonthStatic(){
        let year = new Date().getFullYear()
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
              data: [(year-2)+''],
            },
            {
              x: "25%",
              y: "top",
              data: [(year-1)+''],
            },
            {
              x: "50%",
              y: "top",
              data: [year+''],
            }
          ],
          xAxis: {
            type: 'category',
            data: this.tbData.time,
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
            left: "12%",
            bottom: "15%",
            right: "4%"
          },
          series: [{
            name: (year-2)+'',
            data: this.tbData.tbDatas,
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
            name: (year-1)+'',
            data: this.tbData.tbData,
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
            name: year+'',
            data: this.tbData.dqData,
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
            data: this.standardData.time,
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
            interval: 25,
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
            name: this.currentDateDb.format(this.formatDate),
            data: this.standardData.data,
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
        // if( index == 0 ) {
        //   this.formatDate = "yyyy-MM"
        // } else if( index == 1 ) {
        //   this.formatDate = "yyyy"
        // }
      },
      // 选择因子回调
      onFactorConfirm(value, index){
        this.factorValue = value;
        this.factorPicker = false;
        this.monitorTime.factor = this.factorValueArray[index]
        this.getMonitorData();
      },
      // 选择因子回调(同比分析)
      onFactorConfirmTb(value, index){
        this.factorValueTb = value;
        this.factorPickerTb = false;
        if( index == 0 ) {
          this.tbTime.factor = "wqg"
        } else {
          this.tbTime.factor = this.factorValueArray[index-1]
        }
        this.getTbStacticsData();
      },
      // 统一切换处理
      changeItem(key, index){
        this.$set(this.selectActive, key, [])
        this.$set(this.selectActive[key], index, "active")
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
      // 顶部仪表盘
      initDashboard(){
        let that = this
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
              value: this.realData.aRealData.wq_tp,
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
                return that.levelText[value]
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
                return that.levelText[value]
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
      getMonitorData(){
        this.$http.get("/AirAppXY-Service/water/waterMonitorData", {params: this.monitorTime}).then(res=>{
            if( res.data.code == 200 ) {
              this.monitorData = res.data.content.info
              // 水质监测数据
              this.drawLineHoursData();
            }
        })
      },
      getWaterDistribution(){
        this.$http.get("/AirAppXY-Service/water/getWaterLineData", {params: this.distributionTime}).then(res=>{
          if( res.data.code == 200 ) {
            this.marker = []
            res.data.content.info.forEach((item,index)=>{
              let obj  = {}
              obj.date = item.spt.slice(0,4) + "-" + item.spt.slice(4,6) + "-" + item.spt.slice(6,8)
              if( item.wq_tp ) {
                obj.className= "level" + (Number(item.wq_tp) + 1)
              } else {
                obj.className= ""
              }
              this.marker.push(obj)
            })
            this.showCalendar = true
          }
        })
      },
      getTbStacticsData(){
        this.$http.get("/AirAppXY-Service/water/getWaterTBAnalyze", {params: this.tbTime}).then(res=>{
          if( res.data.code == 200 ) {
            this.tbData = res.data.content.info
            // 同比分析
            this.drawLineMonthStatic();
          }
        })
      },
      getWaterStandardStatus(){
        this.$http.get("/AirAppXY-Service/water/getWaterStandard",{params: this.standardTime}).then(res=>{
          if( res.data.code == 200 ) {
            this.standardData = res.data.content.info
            // 达标情况
            this.drawLineMonthStaticTb();
          }
        })
      }
    }
  }
</script>