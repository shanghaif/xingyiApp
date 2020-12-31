<template>
  <div>
    <van-nav-bar :fixed="true" left-arrow @click-left="historyBack" class="common-nav-bar" title="今日峰值">
    </van-nav-bar>
    <div class="peak" style="margin-top: 47px">
      <div class="peak_top">
        <ul>
          <li><img src="../../assets/img/sy_point.png" alt="">&nbsp;{{$store.state.vuex.stationData.text}}({{showTime.startTime}}时至{{showTime.endTime}}时)峰值分析</li>
        </ul>
      </div>
      <div class="peak_table">
        <table>
          <tbody>
          <tr>
            <td>项目</td>
            <td>峰值</td>
            <td>谷值</td>
            <td>平均值</td>
          </tr>
          <tr v-for="(item,index) in dataList" :key="index">
            <td>{{item.factor}}</td>
            <td>{{item.max}}</td>
            <td>{{item.min}}</td>
            <td>{{item.avg}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="peak_top">
        <ul>
          <li><img src="../../assets/img/sy_point.png" alt="">&nbsp;最近24小时数据</li>
        </ul>
      </div>
      <div class="form_data">
        <div class="model1 items">
          <div class="b_items">
            <div class="echarts" id="echarts">

            </div>
            <div class="e_select">
              <ul>
                <li :class="factorActive[0]" @click="changeFactor(0, 'aqi')">AQI</li>
                <li :class="factorActive[1]" @click="changeFactor(1, 'pm25')">PM <sub>2.5</sub></li>
                <li :class="factorActive[2]" @click="changeFactor(2, 'pm10')">PM <sub>10</sub></li>
                <li :class="factorActive[3]" @click="changeFactor(3, 'so2')">SO <sub>2</sub></li>
                <li :class="factorActive[4]" @click="changeFactor(4, 'o3')">O <sub>3</sub></li>
                <li :class="factorActive[5]" @click="changeFactor(5, 'no2')">NO <sub>2</sub></li>
                <li :class="factorActive[6]" @click="changeFactor(6, 'co')">CO</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        factorActive: ["active"],
        peakTime: {
          startTime: "",
          endTime: "",
          mnType: "city",
          factor: "aqi",
          timeType: "小时",
          mns: ""
        },
        dataList: [],
        showTime: {
          startTime: "",
          endTime: ""
        },
        recentData: {},
        lineHoursEcharts: {}
      }
    },
    activated() {
      // 最近24小时
      let d = new Date()
      this.peakTime.endTime = d.format("yyyyMMddhh")
      this.showTime.endTime = d.format("yyyy-MM-dd hh")
      d.setTime(d.getTime()-24*60*60*1000)
      this.peakTime.startTime = d.format("yyyyMMddhh")
      this.showTime.startTime = d.format("yyyy-MM-dd hh")
      this.getPeakValueData()
      this.getRecentlyRealData()
    },
    methods: {
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
      getPeakValueData(){
        this.$http.get("/AirAppXY-Service/air/getAirPeakData",{params: this.peakTime}).then(res=>{
          if( res.data.code == 200 ) {
            this.dataList = res.data.content.info
            if( this.dataList.length > 0 ) {
              this.dataList.map((item)=>{
                if( String(item.avg).indexOf(".") != -1 ) { // 如果是小数就保留两位小数
                  item.avg = item.avg.toFixed(2)
                }
              })
            }
          }
        })
      },
      // 最近24小时趋势
      getRecentlyRealData(){
        this.$http.get("/AirAppXY-Service/air/airLineData", {params:this.peakTime}).then(res=>{
          if( res.data.code == 200 ) {
            this.recentData = res.data.content.info
            // 近24小时趋势图表
            this.drawLineHoursData();
          }
        })
      },
      // 切换因子
      changeFactor(key, name) {
        this.factorActive        = []
        this.factorActive[key]   = "active"
        this.peakTime.factor     = name
        this.getRecentlyRealData()
      },
    },
    beforeRouteEnter(to,from,next){
      next(vm=>{
        if( vm.$store.state.vuex.stationData.id ) {
          vm.peakTime.mns       = vm.$store.state.vuex.stationData.id
          vm.peakTime.mnType    = "station"
        } else {
          vm.peakTime.mns       = ""
          vm.peakTime.mnType    = "city"
        }
      })
    }
  }
</script>

<style scoped lang="less">
  .peak{
    width: calc(~"100% - 20px");
    height: 100%;
    background: white;
    padding: 10px;
    .peak_top{
      margin-top: 5px;
      ul{
        margin: 0;
        padding: 0;
        display: flex;
        li{
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #1A1A1A;
          img{
            width: 10px;
            height: 10px;
          }
        }
      }
    }
    .peak_table{
      margin-bottom: 10px;
      table{
        width: 100%;
        height: 240px;
        margin-top: 10px;
        tbody{
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          width: 100%;
          height: 100%;
          tr{
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            td{
              flex: 1;
              text-align: center;
              height: 30px;
              font-size: 14px;
              line-height: 30px;
              &.important{
                color: #FF0000;
              }
            }
          }
          tr:nth-child(odd){
            td{
              background: #F5F7FA;
            }
          }
          tr:nth-child(1){
            td{
              height: 35px;
              line-height: 35px;
              color: #1A1A1A;
              font-family:PingFang SC;
              font-weight:500;
              font-size: 16px;
              background: #E6ECF5;
            }
          }
        }
      }
    }
    .form_data{
      .model1{
        .b_items{
          width: 100%;
          height: 350px;
          background: white;
          border-radius: 4px;
          .echarts{
            height: 280px;
          }
          .e_select{
            ul{
              margin: 0;
              padding: 0;
              display: flex;
              flex-wrap: wrap;
              margin-left: 10px;
              li{
                width: 15%;
                margin-top: 8px;
                margin-right: 6%;
                background: #DDDDDD;
                border-radius: 4px;
                text-align: center;
                font-size: 14px;
                padding: 2px 0;
                &.active{
                  background:linear-gradient(180deg,rgba(85,150,242,1) 0%,rgba(33,108,213,1) 100%);
                  color: white;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
