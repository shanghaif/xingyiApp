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
      <div class="title">水质等级 <font>({{currentData.spt ? ( currentData.spt.slice(0,4)+"-"+currentData.spt.slice(4,6)+"-"+currentData.spt.slice(6,8) ) : "--" }})</font></div>
      <div class="quality">
        <ul>
          <li>
            <template v-if="Number(currentData.wq_tp) == 0">
              <span class="level1 selected"><font>{{levelText[Number(currentData.wq_tp)]}}</font></span>
            </template>
            <template v-else>
              Ⅰ <span class="level1"></span>
            </template>
          </li>
          <li>
            <template v-if="Number(currentData.wq_tp) == 1">
              <span class="level2 selected"><font>{{levelText[Number(currentData.wq_tp)]}}</font></span>
            </template>
            <template v-else>
              Ⅱ <span class="level2"></span>
            </template>
          </li>
          <li>
            <template v-if="Number(currentData.wq_tp) == 2">
              <span class="level3 selected"><font>{{levelText[Number(currentData.wq_tp)]}}</font></span>
            </template>
            <template v-else>
              Ⅲ <span class="level3"></span>
            </template>
          </li>
          <li>
            <template v-if="Number(currentData.wq_tp) == 3">
              <span class="level4 selected"><font>{{levelText[Number(currentData.wq_tp)]}}</font></span>
            </template>
            <template v-else>
              Ⅳ <span class="level4"></span>
            </template>
          </li>
          <li>
            <template v-if="Number(currentData.wq_tp) == 4">
              <span class="level5 selected"><font>{{levelText[Number(currentData.wq_tp)]}}</font></span>
            </template>
            <template v-else>
              Ⅴ <span class="level5"></span>
            </template>
          </li>
          <li>
            <template v-if="Number(currentData.wq_tp) == 5">
              <span class="level6 selected"><font>{{levelText[Number(currentData.wq_tp)]}}</font></span>
            </template>
            <template v-else>
              劣Ⅴ <span class="level6"></span>
            </template>
          </li>
        </ul>
      </div>
    </div>
    <div class="contaminated">
      <div class="title">
        <div class="left"><img src="../../assets/img/sy_point.png" alt="">&nbsp;首要污染物：{{currentData.primaryPollution}}</div>
        <div class="right">注：CO单位为mg/m3，其余与μg/m3</div>
      </div>
      <div class="cont">
        <ul>
          <li><span>pH值</span><span>{{currentData.ph || "--"}}</span></li>
          <li><span>总磷</span><span>{{currentData.tp || "--"}}</span></li>
          <li><span>高锰酸盐</span><span>{{currentData.codmn || "--"}}</span></li>
          <li><span>溶解氧</span><span>{{currentData.dox || "--"}}</span></li>
          <li><span>氨氮</span><span>{{currentData.nh3n || "--"}}</span></li>
          <li></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import Calendar from '../../components/calendarPollute/index';
  export default {
    name: "calendarWater",
    components: {
      Calendar
    },
    data(){
      return {
        levelText: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ"],
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
        this.$http.get("/AirAppXY-Service/water/getWaterCalendarData", {params:this.calendarTime}).then(res=>{
          if( res.data.code == 200 ) {
            this.calendarData = res.data.content.info
            this.calendarData.forEach((item,index)=>{
              let obj = { date: item.spt.slice(0,4)+"-"+item.spt.slice(4,6)+"-"+item.spt.slice(6,8) }
              if(item.wq_tp){
                obj.className = "level"+(Number(item.wq_tp)+1)
              }
              if( !item.hasOwnProperty("wq_tp") && this.calendarData[index-1].hasOwnProperty("wq_tp") ) {
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
        if( vm.$store.state.vuex.stationDataWater.id ) {
          vm.calendarTime.mns       = vm.$store.state.vuex.stationDataWater.id
        } else {
          vm.calendarTime.mns       = ""
        }
      })
    }
  }
</script>
<style scoped lang="less">
  @colorsWaterLevels: {
    level1: #CCFFFF;
    level2: #00CCFF;
    level3: #00FF00;
    level4: #FFFF00;
    level5: #FF9B00;
    level6: #FF0000;
  };
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
              each(@colorsWaterLevels,{
                &.@{key}{
                  background: @value;
                }
              })
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
            each(@colorsWaterLevels,{
              &.@{key}{
                background: @value;
              }
            })
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
          &:not(:last-child){
            border: 1px solid #CCC;
          }
          margin-top: 10px;
          display: flex;
          border-radius: 4px;
          white-space: nowrap;
          span{
            white-space: nowrap;
            flex: 1;
            text-align: center;
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
