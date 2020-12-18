<template>
  <div>
    <van-nav-bar :fixed="true" left-arrow @click-left="historyBack" class="common-nav-bar" title="今日峰值">
    </van-nav-bar>
    <div class="peak" style="margin-top: 47px">
      <div class="peak_top">
        <ul>
          <li><img src="../../assets/img/sy_point.png" alt="">&nbsp;xx县(2020-06-29 16时至2020-06-30 15时)峰值分析</li>
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
          <tr>
            <td>PM2.5</td>
            <td>108</td>
            <td>108</td>
            <td>108</td>
          </tr>
          <tr>
            <td>PM10</td>
            <td class="important">58</td>
            <td>58</td>
            <td>58</td>
          </tr>
          <tr>
            <td>SO <sub>2</sub></td>
            <td>34</td>
            <td>34</td>
            <td>34</td>
          </tr>
          <tr>
            <td>O <sub>3</sub></td>
            <td>12</td>
            <td>12</td>
            <td>12</td>
          </tr>
          <tr>
            <td>NO <sub>2</sub></td>
            <td>2.7</td>
            <td>2.7</td>
            <td>2.7</td>
          </tr>
          <tr>
            <td>CO</td>
            <td class="important">190</td>
            <td>190</td>
            <td>190</td>
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
                <li class="active">AQI</li>
                <li>PM2.5</li>
                <li>PM10</li>
                <li>SO2</li>
                <li>O3</li>
                <li>NO2</li>
                <li>CO</li>
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
    mounted() {
      this.drawLine()
    },
    methods: {
      drawLine(){
        let echarts = this.$echarts.init(document.getElementById("echarts"))
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
            data: ['1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时', '24时']
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
            max: 150,
            interval: 30,
          },
          series: [{
            data: [20, 30, 40, 50, 60, 80, 20, 40, 110, 65, 98, 45, 88, 22, 11, 55, 88, 99, 12, 77, 33, 44, 88, 99],
            type: 'bar',
            barWidth: 8,
            itemStyle: {
              normal: {
                //每根柱子颜色设置
                color: function(params) {
                  if ( params.value > 60 ) {
                    return "#FF7E00"
                  }
                }
              }
            },
            backgroundStyle: {
              color: 'rgba(220, 220, 220, 0.8)'
            }
          }]
        }
        echarts.setOption(option)
      },
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
