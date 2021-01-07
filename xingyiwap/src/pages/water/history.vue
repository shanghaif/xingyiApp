<template>
    <div style="height: 100%">
        <van-nav-bar left-arrow @click-left="historyBack" :fixed="true" class="common-nav-bar">
            <template #title>
                {{stationName}}历史数据
            </template>
        </van-nav-bar>
        <div class="contentAssessment">
            <div class="title_content">
                <span class="selectStation" @click="selectPicker(6)">
                    {{timeClass}} <span class="triangleDownStationToggle"></span>
                </span>
                <div class="timePicker">
                    <input type="text" @click="datePicker = true" v-model="historyTime.startTime" readonly="true" />
                    ~
                    <input type="text" @click="datePickerEnd = true" v-model="historyTime.endTime" readonly="true" />
                </div>

            </div>
            <div class="items">
                <van-list
                        v-model="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="onLoad"
                >
                    <el-table
                        :data="tableData"
                        style="width: 100%"
                        border
                        >
                    <el-table-column
                            fixed
                            prop="time"
                            align="center"
                            label="时间"
                            width="140">
                        <template slot-scope="scope">
                            <font v-if="historyTime.timeType == '小时'">
                                {{scope.row.spt ? (scope.row.spt.slice(0,4)+'-'+scope.row.spt.slice(4,6)+'-'+scope.row.spt.slice(6,8)+' '+scope.row.spt.slice(8,10)+'时') : '--'}}
                            </font>
                            <font v-else-if="historyTime.timeType == '日'">
                                {{scope.row.spt ? (scope.row.spt.slice(0,4)+'-'+scope.row.spt.slice(4,6)+'-'+scope.row.spt.slice(6,8)) : '--'}}
                            </font>
                            <font v-else-if="historyTime.timeType == '月'">
                                {{scope.row.spt ? (scope.row.spt.slice(0,4)+'-'+scope.row.spt.slice(4,6)) : '--'}}
                            </font>
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed
                            label="水质类别"
                            align="center"
                            >
                        <template slot-scope="scope">
                            <span :class="'level'+(Number(scope.row.wq_tp)+1)" style="width: 40px;">{{levelText[Number(scope.row.wq_tp)]}}类</span>
                        </template>
                    </el-table-column>
<!--                    <el-table-column-->
<!--                            align="center"-->
<!--                            label="氨氮 (mg/L)"-->
<!--                            :render-header="renderHeader"-->
<!--                            width="80"-->
<!--                            >-->
<!--                        <template slot-scope="scope">-->
<!--                            {{scope.row.nh3n || '&#45;&#45;'}}-->
<!--                        </template>-->
<!--                    </el-table-column>-->
                    <template v-if="factorList.length > 0" v-for="(item,index) in factorList">
                        <el-table-column
                                align="center"
                                :label="item.monitoring_factor_nm+' ('+item.monitoring_factor_dw+')'"
                                :render-header="renderHeader"
                        >
                            <template slot-scope="scope">
                                {{scope.row[item.cd] || '--'}}
                            </template>
                        </el-table-column>
                    </template>
<!--                    <el-table-column-->
<!--                            align="center"-->
<!--                            label="pH值 (mg/L)"-->
<!--                            :render-header="renderHeader"-->
<!--                    >-->
<!--                        <template slot-scope="scope">-->
<!--                            {{scope.row.ph || '&#45;&#45;'}}-->
<!--                        </template>-->
<!--                    </el-table-column>-->
<!--                    <el-table-column-->
<!--                            align="center"-->
<!--                            label="总磷 (mg/L)"-->
<!--                            :render-header="renderHeader"-->
<!--                    >-->
<!--                        <template slot-scope="scope">-->
<!--                            {{scope.row.tp || '&#45;&#45;'}}-->
<!--                        </template>-->
<!--                    </el-table-column>-->
<!--                    <el-table-column-->
<!--                            align="center"-->
<!--                            label="溶解氧 (mg/L)"-->
<!--                            :render-header="renderHeader"-->
<!--                    >-->
<!--                        <template slot-scope="scope">-->
<!--                            {{scope.row.dox || '&#45;&#45;'}}-->
<!--                        </template>-->
<!--                    </el-table-column>-->
                </el-table>
                </van-list>
            </div>
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
      name: "assessment",
      data(){
        return {
          stationName: "",
          loading: false,
          finished: false,
          levelText: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ"],
          timeClassSelectedPicker: false,
          timeClass: "小时数据", // 默认选中
          timeClassPicker: false, // 选择站点
          timeClassColumns: ["小时数据","天数据", "月数据"], // 站点列表
          minDate: new Date(2010, 0, 1),
          maxDate: new Date(),
          datePicker: false,
          currentDate: new Date(),
          minDateEnd: new Date(2010, 0, 1),
          maxDateEnd: new Date(),
          datePickerEnd: false,
          currentDateEnd: new Date(),
          historyTime: {
              startTime: "",
              endTime: "",
              timeType: "小时",
              mns: ""
          },
          pages: {
            pageSize: 10,
            pageNum: 1
          },
          tableData: [
          ],
          factorList: []
        }
      },
      mounted() {
          this.stationName =  this.$store.state.vuex.stationDataWater.text
          let d = new Date()
          this.historyTime.endTime   = d.format("yyyy-MM-dd")
          d.setTime(d.getTime()-3*24*60*60*1000)
          this.currentDate = d
          this.historyTime.startTime = d.format("yyyy-MM-dd")
      },
      activated() {
        this.getMonitorFactor()
        this.getHistoryData()
      },
      methods: {
        // 获取监测因子列表
        getMonitorFactor(){
          let params = {
            mns: ""
          }
          if( this.$store.state.vuex.stationDataWater.id ) {
            params.mns = this.$store.state.vuex.stationDataWater.id
          }
          this.$http.get("/AirAppXY-Service/map/queryStationMontFactors", {params:params}).then(res=>{
            if( res.data.code == 200 ) {
              this.factorList = res.data.content.info
            }
          })
        },
        onTimeClassConfirm(value, index){
          this.timeClass = value;
          this.timeClassSelectedPicker = false;
          if( index == 0 ) {
            this.historyTime.timeType = "小时"
          } else if( index == 1 ) {
            this.historyTime.timeType = "日"
          } else if( index == 2 ) {
            this.historyTime.timeType = "月"
          }
          this.finished = false
          this.tableData = []
          this.pages.pageNum = 1
          this.getHistoryData()
        },
        comfirmDateSelected(value){
          this.datePicker = false
          this.historyTime.startTime = value.format("yyyy-MM-dd")
          this.finished = false
          this.tableData = []
          this.pages.pageNum = 1
          this.getHistoryData()
        },
        comfirmDateSelectedEnd(value){
          this.datePickerEnd = false
          this.historyTime.endTime = value.format("yyyy-MM-dd")
          this.finished = false
          this.tableData = []
          this.pages.pageNum = 1
          this.getHistoryData()
        },
        selectPicker(number){
          if( number == 5 ) {
            this.datePicker = true
          } else if( number == 6 ) {
            this.timeClassSelectedPicker = true
          }
        },
        changeStartTime(startTime){
            console.log(startTime, "startTime")
        },
        changeEndTime(endTime){
            console.log(endTime, "startTime")
        },
        getHistoryData() {
          this.loading = true
            let params = JSON.parse(JSON.stringify(this.historyTime))
            params.startTime = new Date(params.startTime).format("yyyyMMddhh")
            params.endTime   = new Date(params.endTime).format("yyyyMMddhh")
            params = Object.assign(this.pages,params)
            this.$http.get("/AirAppXY-Service/water/getWaterStationData", {params: params}).then(res=>{
              if( res.data.code == 200 ) {
                this.tableData = this.tableData.concat(res.data.content.info)
                this.$nextTick(()=>{
                  // 加载状态结束
                  this.loading = false;
                })
                if( res.data.content.info.length < this.pages.pageSize ) {
                  this.finished = true
                }
              }
            })
        },
        onLoad(){
          this.pages.pageNum ++;
          this.getHistoryData()
        },
        renderHeader(h, { column, $index}){
            let label    = column.label;
            let labelArr = label.split(' ');
            return h(
                'div',
                {
                    'class': 'header-center'
                },
                [
                    h('div', {
                            attrs: { type: 'text' },
                        }, [labelArr[0]]
                    ),
                    h('div', {
                            attrs: { type: 'text' },
                        }, [labelArr[1] || '']
                    )
                ]
            );
        }
      },
        beforeRouteEnter(to,from,next){
            next(vm=>{
                if( vm.$store.state.vuex.stationDataWater.id ) {
                    vm.historyTime.mns       = vm.$store.state.vuex.stationDataWater.id
                } else {
                    vm.historyTime.mns       = ""
                }
            })
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/css/pages/assessment.less";
    .van-loading{
        text-align: center;
        margin-top: 10px;
    }
    .common-nav-bar{
        z-index: 999999;
    }
    .items{
        width: 100% !important;
        padding: 0 !important;
        /deep/ .el-table{
            th{
                .cell{
                    font-size: 13px;
                    color:#1A1A1A;
                }
            }
        }
    }
    .title_content{
        .timePicker{
            width: calc(100% - 100px);
            display: flex;
            justify-content: center;
            align-items: center;
            input{
                width: 48%;
                border-radius: 4px;
                border: 1px solid #999999;
                font-size: 13px;
                padding: 4.5px 0;
                padding-left: 4px;
                color: #666;
            }
        }
    }
</style>