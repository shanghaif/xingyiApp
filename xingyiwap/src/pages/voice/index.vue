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
<!--                <img src="../../assets/img/message.png" style="height: 17.5px; width: 19.5px" alt="">-->
            </template>
        </van-nav-bar>
        <div class="top_content">
            <div class="cloud">
                <img src="../../assets/img/home/yun.png" class="yun" alt="">
                <img src="../../assets/img/home/yun1.png" class="yun1" alt="">
            </div>
            <p class="update"></p>
            <div class="echarts">
                <div class="bgDom voiceDom">
                    <ul>
                        <li @click="$router.push('/stationListVoiceMap')">{{voiceCount.N_001+voiceCount.N_002+voiceCount.N_003}}</li>
                        <li>声环境点位总数（个）</li>
                    </ul>
                </div>
            </div>
            <ul class="topItems voiceTopItems">
                <li @click="$router.push('/stationListVoiceMap/N_003')">
                    <div class="polluteCount"><font style="font-size: 15px">{{voiceCount.N_003}}</font> 个</div>
                    <div class="polluteType">道路交通</div>
                    <span class="borderDom"></span>
                </li>
                <li @click="$router.push('/stationListVoiceMap/N_001')">
                    <div class="polluteCount"><font style="font-size: 15px">{{voiceCount.N_001}}</font> 个</div>
                    <div class="polluteType">城市区域</div>
                    <span class="borderDom"></span>
                </li>
                <li @click="$router.push('/stationListVoiceMap/N_002')">
                    <div class="polluteCount"><font style="font-size: 15px">{{voiceCount.N_002}}</font> 个</div>
                    <div class="polluteType">城市功能区</div>
                </li>
            </ul>
        </div>
        <div class="items_content">
            <div class="tabs">
                <ul>
                    <li :class="activeClass[0]" @click="changeTabs(0,'N_003')">道路交通</li>
                    <li :class="activeClass[1]" @click="changeTabs(1,'N_001')">城市区域</li>
                    <li :class="activeClass[2]" @click="changeTabs(2,'N_002')">城市功能区</li>
                </ul>
            </div>
            <div class="items">
                <div class="title_content">
                    <div class="left">
                        <span class="left_icon"></span>
                        等级点位统计
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
                        <tr v-for="(item,index) in listData.dataList">
                            <td><span :class="'voice'+index"></span>{{item.name}}</td>
                            <td>{{item.percent}}</td>
                            <td>{{item.value}}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="items">
                <div class="title_content">
                    <div class="left">
                        <span class="left_icon"></span>
                        噪音监测
                    </div>
                </div>
                <div class="content">
                    <ul class="voiceGnq">
                        <li v-for="(item,index) in listData.data" :key="index" @click="$router.push('/voiceDetail/'+item.station_code)">
                            <div class="first"><div class="iconVoice"><span style="display: inline-block; transform: skewX(30deg)">{{item.noiseLevel}}</span></div>  {{item.station_name}}</div>
                            <div class="second">监测值：<font>{{item.leq}}</font> dp(A)</div>
                            <div class="third">时间：{{new Date(item.time).format("yyyy/MM/dd hh:mm")}}</div>
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
        params: {
          stationType: "N_003"
        },
        stationClassPicker: false,
        stationClassColumns: ["省控重点企业", "市控重点企业", "区/县控重点企业"],
        voiceCount: {
          N_001: 0,
          N_002: 0,
          N_003: 0
        },
        listData: {
          data: []
        },
      }
    },
    mounted() {
      // this.drawEcharts()
    },
    activated() {
      this.getVoiceStationCount()
      this.getVoiceList()
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
      changeTabs(num,type){
        this.activeClass      = []
        this.activeClass[num] = "active"
        this.params.stationType = type
        this.getVoiceList()
      },
      drawEcharts(){
        let that = this
        let countDayEcharts = this.$echarts.init(document.getElementById("echarts2"))
        let colorList= ["#FFFF99","#62FA61","#6799FC","#EF7031","#FF0000","#EB22EB"]
        this.listData.dataList = []
        let i = 0
        if( this.listData.level ) {
          for (var key in this.listData.level) {
            let obj = {}
            obj.value = this.listData.level[key]
            obj.name  = key
            obj.itemStyle = {
              normal: {color: colorList[i]}
            }
            i++;
            this.listData.dataList.push(obj);
          }
        }
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
                  formatter: '{a|'+this.listData.dataList[0].value+'个}\n0级',
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
              data: this.listData.dataList
            },
            {
              type: 'pie',
              radius: ['50%', '65%'],
              label: {
                position: 'outside',
                normal: {
                  formatter: function(data){
                    let percent = data.percent.toFixed(1)+"%";
                    that.listData.dataList[data.dataIndex].percent = percent
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
              data: this.listData.dataList
            }
          ]
        }
        countDayEcharts.setOption(option2)
      },
      // 获取声环境站点个数
      getVoiceStationCount(){
        this.$http.get("/AirAppXY-Service/noise/noiseStationNum").then(res=>{
          if( res.data.code == 200 || res.data.code == 0 ) {
            this.voiceCount = res.data.content.info
          }
        })
      },
      // 获取噪声详情
      getVoiceList(){
        this.$http.get("/AirAppXY-Service/noise/noiseRealData",{params: this.params}).then(res=>{
          if( res.data.code == 200 || res.data.code == 0 ) {
            this.listData = res.data.content.info
            this.drawEcharts()
          }
        })
      }
    }
  }
</script>