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
                <div class="bgDom">
                    <ul>
                        <li>140</li>
                        <li>污染源总数（家）</li>
                    </ul>
                </div>
            </div>
            <ul class="topItems">
                <li>
                    <div class="polluteCount"><font style="font-size: 15px">32</font> 家</div>
                    <div class="polluteType"><span class="round_icon"></span>废水废气企业</div>
                </li>
                <li>
                    <div class="polluteCount"><font style="font-size: 15px">63</font> 家</div>
                    <div class="polluteType"><span class="round_icon"></span>废水企业</div>
                </li>
                <li>
                    <div class="polluteCount"><font style="font-size: 15px">45</font> 家</div>
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
                        <tr>
                            <td><span class="level1"></span>工业源</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="level2"></span>生活源</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="level3"></span>污水处理厂</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="level4"></span>重金属污染…</td>
                            <td>80%</td>
                            <td>160</td>
                        </tr>
                        <tr>
                            <td><span class="level5"></span>规模化禽…</td>
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
                        重点企业名录
                    </div>
                    <div class="right">
                        <span class="selectStation" @click="stationClassPicker = true">{{stationClassValue}} <span class="triangleDownStationToggle"></span></span>
                    </div>
                </div>
                <div class="content normal1">
                    <ul class="companyCount">
                        <li>企业总数：140</li>
                        <li>废水废气：45</li>
                        <li>废水：70</li>
                        <li>废气：70</li>
                        <li>土壤：8</li>
                        <li>其他：12</li>
                    </ul>
                    <table border="0" cellspacing="0" class="bottomTable" cellpadding="0">
                        <tr>
                            <td>序号</td>
                            <td>企业名称</td>
                            <td>污染类型</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>兴义市丰都污水处理厂</td>
                            <td>废水/废气</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>兴义市鸿源再生能源回收处理</td>
                            <td>废水</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>兴义市水务有限责任公司</td>
                            <td>废水</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>兴义市水务有限责任公司桔山</td>
                            <td>废气</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td>兴义市阳光水务有限责任公司</td>
                            <td>废水</td>
                        </tr>
                        <tr>
                            <td>6</td>
                            <td>贵州兴化化工股份有限公司</td>
                            <td>废水</td>
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
        <!--月度、季度、年度选择-->
        <van-popup v-model="stationClassPicker" position="bottom">
            <van-picker
                show-toolbar
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
                        formatter: '{a|60家}\n重点污染源',
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