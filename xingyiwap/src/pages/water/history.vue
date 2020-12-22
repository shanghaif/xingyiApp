<template>
    <div>
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
                    </el-table-column>
                    <el-table-column
                            fixed
                            label="水质类别"
                            align="center"
                            >
                        <template slot-scope="scope">
                            <span :class="'level'+scope.row.level" style="width: 40px;">{{levelText[scope.row.level - 1]}}类</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="氨氮 (mg/L)"
                            :render-header="renderHeader"
                            width="80"
                            >
                        <template slot-scope="scope">
                            0.566
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="高锰酸盐 (mg/L)"
                            :render-header="renderHeader"
                    >
                        <template slot-scope="scope">
                            0.766
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="pH值 (mg/L)"
                            :render-header="renderHeader"
                    >
                        <template slot-scope="scope">
                            0.766
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="总磷 (mg/L)"
                            :render-header="renderHeader"
                    >
                        <template slot-scope="scope">
                            0.766
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            label="溶解氧 (mg/L)"
                            :render-header="renderHeader"
                    >
                        <template slot-scope="scope">
                            0.766
                        </template>
                    </el-table-column>
                </el-table>
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
              timeType: "",
              mns: ""
          },
          tableData: [
              {
                  time: "2020-01-10 23时",
                  name: "达力堵德站",
                  level: 3,
                  isOk: 1,
              },
              {
                time: "2020-01-10 23时",
                  name: "万峰湖九里堡站",
                  level: 2,
                  isOk: 1,
              },
              {
                time: "2020-01-10 23时",
                  name: "下纳灰河站",
                  level: 4,
                  isOk: 1,
              },
              {
                time: "2020-01-10 23时",
                  name: "黄泥河岔江站",
                  level: 2,
                  isOk: 1,
              },
              {
                time: "2020-01-10 23时",
                  name: "湾塘河平寨站",
                  level: 2,
                  isOk: 1,
              }
          ],
        }
      },
      mounted() {
          // this.stationName = JSON.parse(localStorage.getItem("stationDataWater")).text
          let d = new Date()
          this.historyTime.endTime   = d.format("yyyy-MM-dd")
          d.setTime(d.getTime()-24*60*60*1000)
          this.currentDate = d
          this.historyTime.startTime = d.format("yyyy-MM-dd")
      },
      methods: {
        onTimeClassConfirm(value, index){
          this.timeClass = value;
          this.timeClassSelectedPicker = false;
        },
        comfirmDateSelected(value){
          this.datePicker = false
          this.historyTime.startTime = value.format("yyyy-MM-dd")
        },
        comfirmDateSelectedEnd(value){
          this.datePickerEnd = false
          this.historyTime.endTime = value.format("yyyy-MM-dd")
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
                    if( localStorage.getItem("stationDataWater") ) {
                        vm.$store.state.vuex.stationDataWater = JSON.parse(localStorage.getItem("stationDataWater"))
                    }
                    if( vm.$store.state.vuex.stationDataWater.id ){
                        vm.historyTime.mns       = vm.$store.state.vuex.stationDataWater.id
                    } else {
                        vm.historyTime.mns       = ""
                    }
                }
            })
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/css/pages/assessment.less";
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