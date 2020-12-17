<template>
    <div class="pages_content_form">
        <van-nav-bar :fixed="true" class="common-nav-bar">
            <template #left>
                <img src="../../assets/img/user_icon.png" @click="$router.push({path: '/mine'})" style="height: 18px; width: 18px" alt="">
            </template>
            <template #title>
                兴义市
            </template>
            <template #right>
                <img src="../../assets/img/message.png" @click="$router.push({path: '/mine'})" style="height: 17.5px; width: 19.5px" alt="">
            </template>
        </van-nav-bar>
        <div class="top_content">
            <div class="cloud">
                <img src="../../assets/img/home/yun.png" class="yun" alt="">
                <img src="../../assets/img/home/yun1.png" class="yun1" alt="">
            </div>
            <p class="update">更新：2020-01-10 10:00</p>
            <div class="echarts" id="echarts">
                <div class="bgDom voiceDom">
                    <ul>
                        <li>1120</li>
                        <li>声环境点位总数（个）</li>
                    </ul>
                </div>
            </div>
            <ul class="topItems voiceTopItems">
                <li>
                    <div class="polluteCount"><font style="font-size: 15px">132</font> 个</div>
                    <div class="polluteType">道路交通</div>
                    <span class="borderDom"></span>
                </li>
                <li>
                    <div class="polluteCount"><font style="font-size: 15px">163</font> 个</div>
                    <div class="polluteType">城市区域</div>
                    <span class="borderDom"></span>
                </li>
                <li>
                    <div class="polluteCount"><font style="font-size: 15px">145</font> 个</div>
                    <div class="polluteType">城市功能区</div>
                </li>
            </ul>
        </div>
        <div class="items_content">
            <div class="tabs">
                <ul>
                    <li :class="activeClass[0]" @click="changeTabs(0)">道路交通</li>
                    <li :class="activeClass[1]" @click="changeTabs(1)">城市区域</li>
                    <li :class="activeClass[2]" @click="changeTabs(2)">城市功能区</li>
                </ul>
            </div>
            <div class="items">
                <div class="title_content">
                    <div class="left">
                        <span class="left_icon"></span>
                        功能区等级点位统计
                    </div>
                </div>
                <div class="content normal">
                    <div class="echarts" id="echarts2">

                    </div>
                    <table border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td>类别</td>
                            <td>占比</td>
                            <td>数据量</td>
                        </tr>
                        <tr>
                            <td><span class="voice0"></span>0级</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="voice1"></span>1级</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="voice2"></span>2级</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="voice3"></span>3级</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="voice4a"></span>4a级</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="voice4b"></span>4b级</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="items">
                <div class="title_content">
                    <div class="left">
                        <span class="left_icon"></span>
                        功能区噪音监测
                    </div>
                </div>
                <div class="content">
                    <ul class="voiceGnq">
                        <li>
                            <div class="first"><div class="iconVoice">0级</div>  xxx站点</div>
                            <div class="second">监测值：<font>47.5</font> dp(A)</div>
                            <div class="third">监测时间：19:55</div>
                        </li>
                        <li>
                            <div class="first"><div class="iconVoice">0级</div>  xxx站点</div>
                            <div class="second">监测值：<font>47.5</font> dp(A)</div>
                            <div class="third">监测时间：19:55</div>
                        </li>
                        <li>
                            <div class="first"><div class="iconVoice">0级</div>  xxx站点</div>
                            <div class="second">监测值：<font>47.5</font> dp(A)</div>
                            <div class="third">监测时间：19:55</div>
                        </li>
                        <li>
                            <div class="first"><div class="iconVoice">0级</div>  xxx站点</div>
                            <div class="second">监测值：<font>47.5</font> dp(A)</div>
                            <div class="third">监测时间：19:55</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    name: "voice",
    data () {
      return {
        arrow: "arrow-up",
        activeClass: ["active"],
        activeNames: [],
        activeTab: 0,
        stationClassValue: "省控重点企业",
        stationClassPicker: false,
        stationClassColumns: ["省控重点企业", "市控重点企业", "区/县控重点企业"],
      }
    },
    mounted() {
      this.drawEcharts()
    },
    methods: {
      onStationClassConfirm(value, index){
        this.stationClassValue  = value;
        this.stationClassPicker = false;
      },
      selectToggle(num){
        $("#collapse"+num).slideToggle()
        if( this.arrow == "arrow-up" ) {
          this.arrow = "arrow-down"
        } else {
          this.arrow = "arrow-up"
        }
      },
      changeTabs(num){
        this.activeClass      = []
        this.activeClass[num] = "active"
      },
      drawEcharts(){
        let countDayEcharts = this.$echarts.init(document.getElementById("echarts2"))
        // let colorList= ["#24C768","#E5CE10","#FF7E00","#FF0000","#990000","#7E0000"]
        let option2 = {
          series: [
            {
              name: '综合指数',
              type: 'pie',
              radius: ['50%', '65%'],
              avoidLabelOverlap: false,
              selectedMode: false,
              label: {
                normal: {
                  formatter: '{a|12个}\n0级',
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
              radius: ['50%', '65%'],
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
        countDayEcharts.setOption(option2)
      }
    }
  }
</script>