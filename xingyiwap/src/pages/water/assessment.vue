<template>
    <div>
        <van-nav-bar left-arrow @click-left="historyBack" :fixed="true" class="common-nav-bar">
            <template #title>
                水质考核分析
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
                <div class="title">各监测站点数据</div>
                <ul class="legend">
                    <li class="level1">Ⅰ类</li>
                    <li class="level2">Ⅱ类</li>
                    <li class="level3">Ⅲ类</li>
                    <li class="level4">Ⅳ类</li>
                    <li class="level5">Ⅴ类</li>
                    <li class="level6">劣Ⅴ类</li>
                </ul>
                <div class="echarts" id="echarts" style="height: 250px">

                </div>
            </div>
            <div class="items">
<!--                <div class="title">水环境达标率</div>-->
<!--                <ul class="getGift">-->
<!--                    <li>达标率：<font>80%</font></li>-->
<!--                    <li>站点总数：<font>1140</font></li>-->
<!--                </ul>-->
                <div class="title"><span class="waterIcon"></span>水质达标变化情况</div>
                <div class="echarts" id="echarts1" style="height: 240px">

                </div>
                <div class="title"><span class="waterIcon"></span>站点达标情况</div>
                <table>
                    <tr>
                        <td>站点名称</td>
                        <td>现状水质</td>
                        <td>目标水质</td>
                        <td>是否达标</td>
                    </tr>
                    <tr v-for="(item,index) in assessData.dataList" :key="index">
                        <td>{{item.stationName}}</td>
                        <td><span :class="'level'+(Number(item.wq_tp)+1)">{{levelText[item.wq_tp]}}类</span></td>
                        <td><span :class="'level'+(Number(item.targetLevel)+1)">{{levelText[item.targetLevel]}}类</span></td>
                        <td>{{item.standard == "1" ? "是" : "否"}}</td>
                    </tr>
                </table>
            </div>
<!--            <div class="items">-->
<!--                <div class="title">水质污染贡献率</div>-->
<!--            </div>-->
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
          timeClassColumns: ["月度"], // 站点列表
          minDate: new Date(2010, 0, 1),
          maxDate: new Date(),
          datePicker: false,
          currentDate: new Date(),
          assessmentTime: {
            startTime: "",
            endTime: "",
            timeType: "月",
            mns: ""
          },
          assessData: {
            dataList: [],
            monitor: {
              X: [],
              Y: []
            }
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
        }
      },
      activated() {
          let d = new Date()
          // d.setTime(d.getTime() - 30*24*60*60*1000)
          this.assessmentTime.startTime = d.format("yyyyMM0100")
          this.assessmentTime.endTime   = d.format("yyyyMM3000")
          this.getAssessData()
      },
      methods: {
        getAssessData(){
          this.$http.get("/AirAppXY-Service/water/waterStationCheckData", {params: this.assessmentTime}).then(res=>{
            if( res.data.code == 200 ) {
              this.assessData = res.data.content.info
              if( this.assessData.monitor.Y.length > 0 ) {
                let dataArr = [[],[],[],[],[],[]]
                this.assessData.monitor.Y.forEach((item, index)=>{
                  item.forEach((it,ind)=>{
                    dataArr[ind].push(it)
                  })
                })
                this.assessData.monitor.Y = dataArr
              }
              this.drawBarEcharts()
              this.drawLineMonthStaticTb()
            }
          })
        },
        onTimeClassConfirm(value, index){
          this.timeClass = value;
          this.timeClassSelectedPicker = false;
        },
        comfirmDateSelected(value){
          this.datePicker = false
          this.assessmentTime.startTime = value.format("yyyyMM0100")
          let d = new Date(value.format("yyyy"), value.format("MM"), 0)
          this.assessmentTime.endTime   = value.format("yyyyMM"+d.format("dd")+"23")
          this.getAssessData()
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
                        rotate: 30,
                        color: "#666"
                    },
                    data: this.assessData.monitor.X
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
                    interval: 6,
                    // min: 0,
                    // max: 31,
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
                series: []
            }
            if( this.assessData.monitor.Y.length > 0 ) {
              let colorList = ["#CCFFFF","#00CCFF","#00FF00","#FFFF00","#FF9B00","#FF0000"]
              this.assessData.monitor.Y.forEach((item,index)=>{
                let series = {
                  stack: '1',
                  name: this.levelText[index],
                  data: item,
                  type: 'bar',
                  barWidth: 15,
                  itemStyle: {
                    normal: {
                      //每根柱子颜色设置
                      color: function(params) {
                        return colorList[index];
                      },
                      label: {
                        show: true, //开启显示
                        position: 'inside', //在上方显示
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
                }
                option.series.push(series)
              })
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
                      data: this.assessData.standard.time,
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
                      type: 'value',
                      axisTick: {
                          show: false
                      },
                      axisLabel: {
                          color: '#666666',
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
                      data: this.assessData.standard.data,
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

<style lang="less">
    @import "../../assets/css/pages/assessment.less";
</style>