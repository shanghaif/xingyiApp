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
            <div class="echarts">
                <div class="bgDom">
                    <ul>
                        <li>{{polluteData.nums[0]}}</li>
                        <li>污染源总数（家）</li>
                    </ul>
                </div>
            </div>
            <ul class="topItems scroll">
                <li>
                    <div class="polluteCount"><font style="font-size: 15px">{{polluteData.nums[1]}}</font> 家</div>
                    <div class="polluteType"><span class="round_icon"></span>废水废气企业</div>
                </li>
                <li>
                    <div class="polluteCount"><font style="font-size: 15px">{{polluteData.nums[2]}}</font> 家</div>
                    <div class="polluteType"><span class="round_icon"></span>废水企业</div>
                </li>
                <li>
                    <div class="polluteCount"><font style="font-size: 15px">{{polluteData.nums[3]}}</font> 家</div>
                    <div class="polluteType"><span class="round_icon"></span>废气企业</div>
                </li>
            </ul>
        </div>
        <div class="items_content">
            <div class="items">
                <div class="title_content">
                    <div class="left">
                        <span class="left_icon"></span>
                        类别占比分析
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
                        <tr v-for="(item,index) in typeData.data">
                            <td><span :class="'level'+(index+1)"></span>{{item.name}}</td>
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
                        重点企业名录
                    </div>
                    <div class="right">
                        <span class="selectStation" @click="stationClassPicker = true">{{stationClassValue}} <span class="triangleDownStationToggle"></span></span>
                    </div>
                </div>
                <div class="content normal1">
                    <ul class="companyCount">
                        <li v-for="(item,index) in importantData.nums" :key="index">{{importantData.type[index]}}：{{item}}</li>
                    </ul>
                    <table border="0" cellspacing="0" class="bottomTable" cellpadding="0">
                        <tr>
                            <td>序号</td>
                            <td>企业名称</td>
                            <td>污染类型</td>
                        </tr>
                        <tr v-for="(item,index) in companyData">
                            <td>{{index+1}}</td>
                            <td>{{item.name}}</td>
                            <td>{{item.unitType}}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="items nopadding">
                <div class="tabs">
                    <ul>
                        <li :class="activeClass[0]" @click="changeTabs(0)">污染源列表</li>
                        <li :class="activeClass[1]" @click="changeTabs(1)">我的关注</li>
                    </ul>
                </div>
                <div class="collapseItems">
                    <div class="collapseTitle">xxx污水处理厂 <span>添加关注</span></div>
                    <div class="collapseItem">
                        <div class="collapseTabs">
                            <div class="tabsColl" @click="selectToggle(5)"><span>废水排口 <span class="normal">正常</span></span> <div class="icon"><van-icon :name="arrow" /></div></div>
                            <div class="contentColl" id="collapse5">
                                <ul>
                                    <li>- -</li>
                                    <li>0.08</li>
                                    <li>- -</li>
                                    <li>0.08</li>
                                    <li>总磷</li>
                                    <li>总氮</li>
                                    <li>溶解氧</li>
                                    <li>高锰酸盐指数</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="collapseItem">
                        <div class="collapseTabs">
                            <div class="tabsColl" @click="selectToggle(7)"><span>废水排口 <span class="normal">正常</span></span> <div class="icon"><van-icon :name="arrow" /></div></div>
                            <div class="contentColl" id="collapse7">
                                <ul>
                                    <li>- -</li>
                                    <li>0.08</li>
                                    <li>- -</li>
                                    <li>0.08</li>
                                    <li>总磷</li>
                                    <li>总氮</li>
                                    <li>溶解氧</li>
                                    <li>高锰酸盐指数</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="collapseItems">
                    <div class="collapseTitle">xxx污水处理厂 <span>添加关注</span></div>
                    <div class="collapseItem">
                        <div class="collapseTabs">
                            <div class="tabsColl" @click="selectToggle(4)"><span>废水排口 <span class="normal">正常</span></span> <div class="icon"><van-icon :name="arrow" /></div></div>
                            <div class="contentColl" id="collapse4">
                                <ul>
                                    <li>- -</li>
                                    <li>0.08</li>
                                    <li>- -</li>
                                    <li>0.08</li>
                                    <li>总磷</li>
                                    <li>总氮</li>
                                    <li>溶解氧</li>
                                    <li>高锰酸盐指数</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <van-popup v-model="stationClassPicker" position="bottom">
            <van-picker
                show-toolbar
                :default-index="0"
                :columns="stationClassColumns"
                @confirm="onStationClassConfirm"
                @cancel="stationClassPicker = false"
            />
        </van-popup>
    </div>
</template>
<script>
    export default {
        name: "pollute",
        data () {
          return {
            arrow: "arrow-up",
            activeClass: ["active"],
            activeNames: [],
            activeTab: 0,
            stationClassValue: "省控重点企业",
            stationClassPicker: false,
            stationClassColumns: ["省控重点企业", "州控重点企业", "市控重点企业"],
            polluteTime: {
              controlLevel: 1,
              isImportant: 1
            },
            polluteData: {
              nums: [],
            },
            typeData: {

            },
            importantData: {
              nums: []
            },
            companyData: []
          }
        },
        mounted() {
            this.drawEcharts()
        },
        activated() {
            this.getPolluteNum();
            this.getTypeData();
            this.getImportantCom(); // 获取重点企业
        },
      methods: {
          onStationClassConfirm(value, index){
            this.stationClassValue  = value;
            this.stationClassPicker = false;
            this.polluteTime.controlLevel = index + 1
            this.getImportantCom()
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
            let that = this
            let countDayEcharts = this.$echarts.init(document.getElementById("echarts2"))
            let colorList= ["#1FBC53","#FF7E00","#12A2FF","#E55530","#7E30E6"]
            this.typeData.data = []
            if( this.typeData.nums ) {
              this.typeData.nums.map((item,index)=>{
                let obj       = {}
                obj.value     = item
                obj.name      = this.typeData.types[index]
                obj.itemStyle = {
                  normal: {color: colorList[index]}
                }
                this.typeData.data[index] = obj
              })
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
                        formatter: '{a|'+this.typeData.total+'家}\n重点污染源',
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
                    data: this.typeData.data
                  },
                  {
                    type: 'pie',
                    radius: ['50%', '65%'],
                    label: {
                      position: 'outside',
                      normal: {
                        formatter: function(data){
                          let percent = data.percent.toFixed(1)+"%";
                          that.typeData.data[data.dataIndex].percent = percent
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
                      show: true,
                      length: 1,
                      length2: 1,
                    },
                    data: this.typeData.data
                  }
                ]
              }
              countDayEcharts.setOption(option2)
            },
          getPolluteNum(){
            this.$http.get("/AirAppXY-Service/pollutionSource/pollNumInfo").then(res=>{
                if( res.data.code == 200 || res.data.code == 0 ) {
                  this.polluteData = res.data.content.info
                }
            })
          },
          getTypeData() {
            this.$http.get("/AirAppXY-Service/pollutionSource/pollNumInfoType").then(res=>{
              if( res.data.code == 200 || res.data.code == 0 ) {
                this.typeData = res.data.content.info
                this.drawEcharts()
              }
            })
          },
          getImportantCom(){
            this.$http.get("/AirAppXY-Service/pollutionSource/pollNumInfo", {params: this.polluteTime}).then(res=>{
              if( res.data.code == 200 || res.data.code == 0 ) {
                this.importantData = res.data.content.info
                this.$http.get("/AirAppXY-Service/pollutionSource/pollInfo", {params: this.polluteTime}).then(result=>{
                  if( result.data.code == 200 || result.data.code == 0 ) {
                    this.companyData = result.data.content.info
                  }
                })
              }
            })
          }
        }
    }
</script>