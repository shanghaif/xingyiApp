<template>
  <div style="height: auto; width: 100%; background: white">
    <van-nav-bar :fixed="true" left-arrow @click-left="historyBack" class="common-nav-bar" :title="'污染日历'">
    </van-nav-bar>
    <div class="calendar" style="margin-top: 47px">
      <div class="next_and_prev">
        <div class="left">
          <ul>
            <li @click="prevMonth"><van-icon name="arrow-left" /></li>
            <li>{{dateTop}}</li>
            <li @click="nextMonth"><van-icon name="arrow" /></li>
          </ul>
        </div>
        <div class="right" @click="$router.go(0)">
          回到今天
        </div>
      </div>
      <Calendar
        v-on:choseDay="clickDay"
        v-on:changeMonth="changeMonth"
        :textTop="textTop"
        :sundayStart="true"
        :markDateMore="marker"
        ref="calendar"
      ></Calendar>
    </div>
    <div class="airQuality">
      <div class="title">空气质量 <font>({{currentData.spt ? ( currentData.spt.slice(0,4)+"-"+currentData.spt.slice(4,6)+"-"+currentData.spt.slice(6,8) ) : "--" }})</font></div>
      <div class="quality">
        <ul>
          <li>
            <template v-if="currentData.level == 0">
              <span class="level1 selected"><font>{{currentData.aqi}}</font>优</span> <div class="first">0<font>50</font></div>
            </template>
            <template v-else>
              优 <span class="level1"></span> <div class="first">0<font>50</font></div>
            </template>
          </li>
          <li>
            <template v-if="currentData.level == 1">
              <span class="level2 selected"><font>{{currentData.aqi}}</font>良</span> 100
            </template>
            <template v-else>
              良 <span class="level2"></span>100
            </template>
          </li>
          <li>
            <template v-if="currentData.level == 2">
              <span class="level3 selected"><font>{{currentData.aqi}}</font>轻度</span> 150
            </template>
            <template v-else>
              轻度 <span class="level3"></span>150
            </template>
          </li>
          <li>
            <template v-if="currentData.level == 3">
              <span class="level4 selected"><font>{{currentData.aqi}}</font>中度</span> 200
            </template>
            <template v-else>
              中度 <span class="level4"></span>200
            </template>
          </li>
          <li>
            <template v-if="currentData.level == 4">
              <span class="level5 selected"><font>{{currentData.aqi}}</font>重度</span> 300
            </template>
            <template v-else>
              重度 <span class="level5"></span>300
            </template>
          </li>
          <li>
            <template v-if="currentData.level == 5">
              <span class="level6 selected"><font>{{currentData.aqi}}</font>严重</span> 500
            </template>
            <template v-else>
              严重 <span class="level6"></span>500
            </template>
          </li>
        </ul>
      </div>
    </div>
    <div class="contaminated">
      <div class="title">
        <div class="left"><img src="../../assets/img/sy_point.png" alt="">&nbsp;首要污染物：{{currentData.primaryPollution}}</div>
        <div class="right">注：CO单位为mg/m3，其余为μg/m3</div>
      </div>
      <div class="cont">
        <ul>
          <li><span>PM<sub>2.5</sub> </span><span>{{currentData.pm25 || "--"}}</span></li>
          <li><span>PM<sub>10</sub></span><span>{{currentData.pm10 || "--"}}</span></li>
          <li><span>SO<sub>2</sub></span><span>{{currentData.so2 || "--"}}</span></li>
          <li><span>NO<sub>2</sub></span><span>{{currentData.no2 || "--"}}</span></li>
          <li><span>CO</span><span>{{currentData.co || "--"}}</span></li>
          <li><span>O<sub>3</sub></span><span>{{currentData.o3 || "--"}}</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import Calendar from '../../components/calendarPollute/index';
  export default {
    name: "calendar",
    components: {
      Calendar
    },
    data(){
      return {
        textTop: ["日", "一", "二", "三", "四", "五", "六"],
        dateTop: "",
        show_level: 1,
        checkLevel: false,
        calendarData: [],
        currentData: {},
        firstClick: true,
        marker: [
        ],
        calendarTime: {
          startTime: '',
          endTime: '',
          mnType: 'city',
          timeType: '日',
          mns: ''
        }
      }
    },
    methods: {
      clickDay(item) {
        this.currentData = this.calendarData[item.id - 1]
      },
      changeMonth(date){
        this.$nextTick(()=>{
          this.dateTop = this.$refs.calendar.dateTop
        })
        date = date.replace("/", "-").replace("/", "-")
        let d = new Date(date)
        let w    = new Date(d.format("yyyy"), d.format("MM"), 0)
        this.calendarTime.endTime  = d.format("yyyyMM"+w.getDate()+"hh")
        this.calendarTime.startTime= d.format("yyyyMM0100")
        this.getCalendarData()
      },
      prevMonth(){
        this.$refs.calendar.PreMonth(this.$refs.calendar.myDate,false)
        this.dateTop = this.$refs.calendar.dateTop
      },
      nextMonth(){
        this.$refs.calendar.NextMonth(this.$refs.calendar.myDate,false)
        this.dateTop = this.$refs.calendar.dateTop
      },
      getCalendarData() {
        let d   = new Date()
        let lat = new Date(d.format("yyyyy"),d.format("MM"), 0)
        let cout= lat.getDate()
        this.marker = []
        let indexChoose = 0
        this.$http.get("/AirAppXY-Service/air/getAirCalendarData", {params:this.calendarTime}).then(res=>{
          if( res.data.code == 200 ) {
            this.calendarData = res.data.content.info
            this.calendarData.forEach((item,index)=>{
              let obj = { date: item.spt.slice(0,4)+"-"+item.spt.slice(4,6)+"-"+item.spt.slice(6,8), className: "level"+(item.level+1) }
              if( !item.hasOwnProperty("level") && this.calendarData[index-1].hasOwnProperty("level") ) {
                indexChoose = index - 1
              }
              this.marker.push(obj)
            })
            this.checkLevel  = true
            this.currentData = this.calendarData[indexChoose]
            this.marker[indexChoose].chooseDay = true
          }
        })
      },
    },
    mounted() {
      let d    = new Date()
      let w    = new Date(d.format("yyyy"), d.format("MM"), 0)
      this.calendarTime.endTime  = d.format("yyyyMM"+w.getDate()+"hh")
      this.calendarTime.startTime= d.format("yyyyMM0100")

      this.getCalendarData()
      this.$nextTick(() => {
        this.dateTop = this.$refs.calendar.dateTop
      })
    },
    beforeRouteEnter(to,from,next){
      next(vm=>{
        if( vm.$store.state.vuex.stationData.id ) {
          vm.calendarTime.mns       = vm.$store.state.vuex.stationData.id
          vm.calendarTime.mnType    = "station"
        } else {
          vm.calendarTime.mns       = ""
          vm.calendarTime.mnType    = "city"
        }
      })
    }
  }
</script>
<style scoped lang="less">
.van-nav-bar{
  z-index: 0;
}
  .calendar{
    background: white;
    .next_and_prev{
      display: flex;
      width: calc(~"100% - 30px");
      margin: 15px;
      border:1px solid rgba(102,102,102,.6);
      border-radius: 4px;
      .left{
        padding: 6px 0;
        border-right: 1px solid rgba(102,102,102,.4);
        flex: 2;
        ul{
          display: flex;
          align-items: center;
          justify-content: space-around;
          li:nth-child(2){
            color: #666;
          }
          li:not(:nth-child(2)){
            color: #1A1A1A;
          }
        }
      }
      .right{
        padding: 6px 0;
        flex: 1;
        text-align: center;
        color: #666;
      }
    }
    /deep/ .wh_container{
      .wh_content_all{
        background: white;
        .wh_top_changge{
          display: none;
        }
        .wh_content{
          .wh_content_item{
            margin-top: 5px;
            .wh_top_tag{
              color: #216CD5;
            }
            .wh_item_date{
              color: black;
              height: 34px;
              line-height: 34px;
              &.wh_other_dayhide{
                color: #666666;
              }
              &.wh_chose_day{
                color: white;
                background: none;
                border-radius: 0;
              }
              &.wh_isToday{
                background: none;
                border-radius: 0;
              }
              &.level1{
                background: #24C768;
              }
              &.level2{
                background: #E5CE10;
              }
              &.level3{
                background: #FF7E00;
              }
              &.level4{
                background: #FF0000;
              }
            }
          }
        }
      }
    }
  }
  .airQuality{
    background: white;
    .title{
      margin: 0 15px 15px 15px;
      color:#1A1A1A;
      font-size: 16px;
      border-top: 1px solid rgba(102, 102, 102, 0.2);
      padding-top: 15px;
      font{
        color: #666;
        font-size: 14px;
      }
    }
    .quality{
      margin: 0 15px 15px 15px;
      width: calc(~"100%-30px");
      ul{
        margin: 0;
        padding: 0;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        li{
          width: 14%;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-size: 12px;
          color: #666;
          span{
            height: 15px;
            margin: 3px 0;
            width: 100%;
            background: #4EDC78;
            &.selected{
              height: 60px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: white;
              font{
                color:white;
                font-size: 20px;
              }
            }
            &.level1{
              background: #4EDC78;
            }
            &.level2{
              background: #E5CE10;
            }
            &.level3{
              background: #FF7E00;
            }
            &.level4{
              background: #FF0000;
            }
            &.level5{
              background: #990000;
            }
            &.level6{
              background: #7E0000;
            }
          }
          .first{
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
  }
  .contaminated{
    background: white;
    .title{
      margin: 0 15px 15px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left{
        display: flex;
        align-items: center;
        font-size: 13px;
        img{
          width: 10px;
          height: 10px;
        }
      }
      .right{
        font-size: 13px;
        color: #666;
      }
    }
    .cont{
      margin: 0 15px 15px 15px;
      ul{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        li{
          width: 30%;
          height: 35px;
          line-height: 35px;
          border: 1px solid #CCC;
          margin-top: 10px;
          display: flex;
          border-radius: 4px;
          white-space: nowrap;
          span{
            flex: 1;
            text-align: center;
            white-space: nowrap;
            font-size: 14px;
          }
          span:nth-child(1){
            height: 37px;
            line-height: 37px;
            background: #24C768;
            border-radius: 4px;
            margin-top: -1px;
            margin-left: -1px;
          }
        }
      }
    }
  }
</style>
