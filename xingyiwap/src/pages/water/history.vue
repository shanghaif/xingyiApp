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
            </div>
            <div class="items">
                <table>
                    <tr>
                        <td>时间</td>
                        <td>水质类别</td>
                        <td>氨氮<br />(mg/L)</td>
                        <td>高锰酸盐<br />(mg/L)</td>
                    </tr>
                    <tr v-for="(item,index) in tableData" :key="index">
                        <td>{{item.time}}</td>
                        <td><span :class="'level'+item.level">{{levelText[item.level - 1]}}类</span></td>
                        <td>0.566</td>
                        <td>0.488</td>
                    </tr>
                </table>
                <el-table
                        :data="tableData"
                        style="width: 100%"
                        >
                    <el-table-column
                            fixed
                            prop="time"
                            label="时间"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            fixed
                            label="水质类别"
                            >
                        <template slot-scope="scope">
                            {{levelText[scope.row.level - 1]}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="province"
                            label="省份"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="city"
                            label="市区"
                            width="120">
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
          this.stationName = JSON.parse(localStorage.getItem("stationDataWater")).text
      },
      methods: {
        onTimeClassConfirm(value, index){
          this.timeClass = value;
          this.timeClassSelectedPicker = false;
        },
        comfirmDateSelected(value){
          this.datePicker = false
          this.$refs.calendar.ChoseMonth(value.format("yyyy-MM"))
        },
        selectPicker(number){
          if( number == 5 ) {
            this.datePicker = true
          } else if( number == 6 ) {
            this.timeClassSelectedPicker = true
          }
        },
      }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/css/pages/assessment.less";
    .items{
        width: 100% !important;
        padding: 0 !important;
    }
</style>