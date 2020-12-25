<template>
    <div>
        <van-nav-bar left-arrow @click-left="historyBack" :fixed="true" class="common-nav-bar">
            <template #title>
                声环境点位详情
            </template>
        </van-nav-bar>
        <div class="contents">
            <div class="items">
                <div class="topTitle"><span class="icon"></span>点位信息</div>
                <van-cell-group>
                    <van-cell>
                        <template #title>
                            <div class="row">
                                <span class="title">点位名称：</span>
                                <span class="content">{{info.station_name || '--'}}</span>
                            </div>
                        </template>
                    </van-cell>
                    <van-cell>
                        <template #title>
                            <div class="row">
                                <span class="title">所属类型：</span>
                                <span class="content">{{info.station_type_code == "N_001" ? "城市区域" : info.station_type_code == "N_002" ? "城市功能区" : info.station_type_code == "N_003" ? "道路交通" : ""}}</span>
                            </div>
                        </template>
                    </van-cell>
                    <van-cell>
                        <template #title>
                            <div class="row">
                                <span class="title">地址：</span>
                                <span class="content">{{info.station_address || '--'}}</span>
                            </div>
                        </template>
                    </van-cell>
                    <van-cell>
                        <template #title>
                            <div class="row">
                                <span class="title">经纬度：</span>
                                <span class="content">{{info.longitude || '--'}},{{info.latitude || '--'}}</span>
                            </div>
                        </template>
                    </van-cell>
                </van-cell-group>
            </div>
            <div class="items">
                <div class="topTitle"><span class="icon"></span>实时数据<font class="time">（{{info.time || '--'}})</font></div>
                <ul class="voiceList">
                    <li>
                        <span>Leq</span>
                        <span>{{info.leq || '--'}}</span>
                    </li>
                    <li>
                        <span>L10</span>
                        <span>{{info.l10 || '--'}}</span>
                    </li>
                    <li>
                        <span>L50</span>
                        <span>{{info.l50 || '--'}}</span>
                    </li>
                    <li>
                        <span>L90</span>
                        <span>{{info.l90 || '--'}}</span>
                    </li>
                    <li>
                        <span>标准差</span>
                        <span>{{info.sd || '--'}}</span>
                    </li>
                    <li>
                        <span>最大值</span>
                        <span>{{info.data_value_max || '--'}}</span>
                    </li>
                    <li>
                        <span>最小值</span>
                        <span>{{info.data_value_min || '--'}}</span>
                    </li>
                    <li></li>
                </ul>
            </div>
            <div class="items">
                <div class="topTitle"><span class="icon"></span>历史数据</div>
                <div class="title_content">
                <div class="timePicker">
                    <span class="title">选择日期：</span>
                    <input type="text" @click="datePicker = true" v-model="historyTime.startTime" readonly="true" />
                    ~
                    <input type="text" @click="datePickerEnd = true" v-model="historyTime.endTime" readonly="true" />
                </div>
                </div>
                <div class="list">
                    <table>
                        <tr>
                            <td>时间</td>
                            <td>Leq</td>
                            <td>L10</td>
                            <td>L50</td>
                            <td>L90</td>
                        </tr>
                        <tr v-for="(item,index) in historyData" :key="index">
                            <td>{{item.time || '--'}}</td>
                            <td>{{item.leq || '--'}}</td>
                            <td>{{item.l10 || '--'}}</td>
                            <td>{{item.l50 || '--'}}</td>
                            <td>{{item.l90 || '--'}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <!-- 开始日期选择 -->
        <van-popup v-model="datePicker" position="bottom">
            <van-datetime-picker
                    v-model="currentDate"
                    type="date"
                    title="请选择日期"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @confirm="comfirmDateSelected"
                    @cancel="datePicker = false"
            />
        </van-popup>
        <!-- 结束日期选择 -->
        <van-popup v-model="datePickerEnd" position="bottom">
            <van-datetime-picker
                    v-model="currentDateEnd"
                    type="date"
                    title="请选择日期"
                    :min-date="minDateEnd"
                    :max-date="maxDateEnd"
                    @confirm="comfirmDateSelectedEnd"
                    @cancel="datePickerEnd = false"
            />
        </van-popup>
    </div>
</template>

<script>
    export default {
        data(){
          return {
            minDate: new Date(2010, 0, 1),
            maxDate: new Date(),
            datePicker: false,
            currentDate: new Date(),
            minDateEnd: new Date(2010, 0, 1),
            maxDateEnd: new Date(),
            datePickerEnd: false,
            currentDateEnd: new Date(),
            info: {},
            historyTime: {
              startTime: "",
              endTime: "",
              stationCode: ""
            },
            historyData: [],
          }
        },
        mounted() {
          let d = new Date()
          this.historyTime.endTime   = d.format("yyyy-MM-dd")
          d.setTime(d.getTime()-365*24*60*60*1000)
          this.currentDate = d
          this.historyTime.startTime = d.format("yyyy-MM-dd")
          this.historyTime.stationCode = this.$route.params.code
          this.getStationInfo()
          this.getHistoryData()
        },
      methods: {
          comfirmDateSelected(value){
            this.datePicker = false
            this.historyTime.startTime = value.format("yyyy-MM-dd")
            this.getHistoryData()
          },
          comfirmDateSelectedEnd(value){
            this.datePickerEnd = false
            this.historyTime.endTime = value.format("yyyy-MM-dd")
            this.getHistoryData()
          },
          getStationInfo(){
            this.$http.get("/AirAppXY-Service/noise/getNoiseStationInfo", {params: {stationCode: this.$route.params.code}}).then(res=>{
                console.log(res)
                if( res.data.code == 200 ) {
                  this.info = res.data.content.info
                }
            })
          },
          getHistoryData(){
            this.$http.get("/AirAppXY-Service/noise/getNoiseStationHisInfo",{params: this.historyTime}).then(res=>{
              if( res.data.code == 200 ) {
                this.historyData = res.data.content.info
              }
            })
          }
        }
    }
</script>

<style lang="less" scoped>
    .contents{
        margin-top: 37px;
        .items{
            width: 100%;
            margin: 10px 0;
            background: #fff;
            .row{
                display: flex;
                align-items: center;
                font-size: 13px;
                color: #1A1A1A;
                .title{
                    width: 100px;
                }
            }
            .topTitle{
                display: flex;
                align-items: center;
                padding: 12px 15px;
                color: #1A1A1A;
                .icon{
                    display: inline-block;
                    width: 4px;
                    height: 16px;
                    margin-right: 10px;
                    background: linear-gradient(180deg, #5596F2 0%, #216CD5 100%);
                    border-radius: 3px;
                }
                .time{
                    font-size: 12px;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #666666;
                }
            }
            .voiceList{
                width: calc(100% - 30px);
                margin-left: 15px;
                margin-right: 15px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                li{
                    width: 22%;
                    height: 56px;
                    background: #FFFFFF;
                    &:not(:last-child){
                        background: #FFFFFF;
                        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.16);
                        border-top: 3px solid #24C768;
                    }
                    &:not(:nth-child(-n+4)) {
                        margin-top: 10px;
                        margin-bottom: 15px;
                    }
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    span:nth-child(1){
                        font-size: 13px;
                        margin-bottom: 5px;
                        color: #1A1A1A;
                    }
                }
            }
            .list{
                padding-bottom: 15px;
            }
            table{
                width: calc(100% - 30px);
                margin: 0 15px;
                border-collapse: collapse;/* 为table设置这个属性 */
                tr{
                    td{
                        height: 28px;
                        font-size: 12px;
                        border-collapse: collapse;
                        text-align: center;
                        border: 1px solid #ddd;
                    }
                    td:nth-child(1) {
                        width: 40%;
                    }
                }
                tr:nth-child(odd){
                    background: #F5F7FA;
                }
                tr:nth-child(1){
                    height: 12%;
                    line-height: 12%;
                    background: #E6ECF5;
                }
            }
            .title_content{
                .timePicker{
                    .title{
                        font-size: 13px;
                        width: 20%;
                        white-space: nowrap;
                        color: #666666;
                    }
                    padding-bottom: 10px;
                    width: calc(100% - 30px);
                    margin: 0 15px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    input{
                        width: 40%;
                        border-radius: 4px;
                        border: 1px solid #999999;
                        font-size: 13px;
                        padding: 4.5px 0;
                        padding-left: 4px;
                        color: #666;
                    }
                }
            }
        }
    }
</style>