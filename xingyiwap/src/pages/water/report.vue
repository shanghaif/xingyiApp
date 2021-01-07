<template>
    <div>
        <van-nav-bar left-arrow @click-left="historyBack" :fixed="true" class="common-nav-bar">
            <template #title>
                {{$store.state.vuex.stationDataWater.text}} <span class="navBarxl" @click="$router.push('/stationListSelect')"></span>
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
                        <td colspan="3">{{$store.state.vuex.stationDataWater.text}}</td>
                    </tr>
                    <tr>
                        <td class="bg">监测时间</td>
                        <td>{{reportData.data.spt ? ( reportData.data.spt.slice(0,4) + '-' + reportData.data.spt.slice(4,6) ) : '--'}}</td>
                        <td class="bg">水质综合指数</td>
                        <td>{{reportData.data.wqi || '--'}}</td>
                    </tr>
                    <tr>
                        <td class="bg">水质类别</td>
                        <td><span :class="'level'+(Number(reportData.data.wq_tp)+1)">{{levelText[reportData.data.wq_tp] || '--'}}</span></td>
                        <td class="bg">主要污染物</td>
                        <td>{{reportData.data.primary_pollutant || '--'}}</td>
                    </tr>
                </table>
                <h6>1、站点监测结果与分析</h6>
                <div class="desc">
                    <img src="../../assets/img/sy_point.png" alt="">{{reportData.message1}}
                </div>
                <div class="echarts" id="echarts1">

                </div>
                <p class="echartsDesc">{{$store.state.vuex.stationDataWater.text}}水质综合指数趋势图</p>
                <h6>2、各因子监测结果及分析</h6>
                <div class="desc">
                    <img src="../../assets/img/sy_point.png" alt="">   {{reportData.message2}}
                </div>
                <div class="echarts" id="echarts2" style="height: 300px">

                </div>
                <div class="content">
                    <div id="echarts4">

                    </div>
                    <table border="0" cellspacing="0" cellpadding="0" class="table1">
                        <tr>
                            <td>因子</td>
                            <td>占比</td>
                        </tr>
                        <tr v-for="(item,index) in standardData.data" :key="index">
                            <td><span :class="item.class"></span>{{item.name}}</td>
                            <td>{{item.percent}}</td>
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
        levelText: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ"],
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
        classList: ['codmn', 'dox', 'nh3n', 'tn', 'tp'],
        nameList: ["高锰酸盐", "溶解氧", "氨氮", "总氮", "总磷"],
        colorList: ["#FFCF3F","#5CDFD5","#D2F13C","#55DE38","#FF7840","#3E9AF7"],
      }
    },
    mounted() {
      let d = new Date()
      //d.setTime(d.getTime() - 30*24*60*60*1000)
      this.reportTime.endTime   = this.standardTime.endTime   = d.format("yyyy"+d.format("MM")+"ddhh")
      this.reportTime.startTime = this.standardTime.startTime = d.format("yyyy"+d.format("MM")+"0100")

    },
    activated() {
      this.getReportInfo()
    },
    beforeRouteEnter(to,from,next){
      next(vm=>{
        if( vm.$store.state.vuex.stationDataWater.id ) {
          vm.reportTime.mns = vm.$store.state.vuex.stationDataWater.id
          vm.standardTime.mns = vm.$store.state.vuex.stationDataWater.id
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
        this.$http.get("/AirAppXY-Service/water/waterStationReportData", {params: this.reportTime}).then(res=>{
          if( res.data.code == 200 ) {
            if( !res.data.content.info.data ) {
              res.data.content.info.data = {}
              res.data.content.info.data.spt = ""
              res.data.content.info.data.airQuality = ""
            }
            this.reportData = res.data.content.info
            this.drawLineMonthStaticTb()
            this.drawLineMonthStaticTb2()
            let obj = res.data.content.info.pollution
            this.standardData.data =  [obj.codmn, obj.dox, obj.nh3n, obj.tn, obj.tp]
            this.drawPieExceedDay()
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
          obj.class     = this.classList[index]
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
            data: this.reportData.waterLine.time,
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
            data: this.reportData.waterLine.data,
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
            // formatter:function(name){
            //   return that.replaceWords(name);
            // },
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
          // colorList: ["#FFCF3F","#5CDFD5","#D2F13C","#55DE38","#FF7840","#3E9AF7"],
          series: [
            {
              name: "高锰酸盐",
              data: this.reportData.factorLine.codmn_level,
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
              name: "溶解氧",
              data: this.reportData.factorLine.dox_level,
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
              name: "氨氮",
              data: this.reportData.factorLine.nh3n_level,
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
              name: "总氮",
              data: this.reportData.factorLine.tn_level,
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
              name: "总磷",
              data: this.reportData.factorLine.tp_level,
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
        codmn: #FFCF3F;
        dox: #5CDFD5;
        nh3n: #D2F13C;
        tn: #55DE38;
        tp: #FF7840;
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