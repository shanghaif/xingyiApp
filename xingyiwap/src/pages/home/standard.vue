<template>
  <div>
    <van-nav-bar :fixed="true" left-arrow @click-left="historyBack" class="common-nav-bar" title="今日达标">
    </van-nav-bar>
    <div class="standard" style="margin-top: 47px">
      <div class="standard_top">
        <ul>
          <li><img src="../../assets/img/sy_point.png" alt="">&nbsp;今日空气质量若想达到</li>
          <li><span class="liang" :class="actives[0]" @click="changeSelected(0)">优</span></li>
          <li><span class="liang" :class="actives[1]" @click="changeSelected(1)">良</span></li>
        </ul>
        <ul>
          <li><img src="../../assets/img/sy_point.png" alt="">&nbsp;今日空气质量若想达到</li>
          <li><input type="text" v-model="standardTime.airLevelNum" /> </li>
          <li><span class="jisuan" @click="getAirLevelStatus">计算</span></li>
        </ul>
      </div>
      <div class="standard_content">
        <template v-for="(item,index) in dataList">
          <div class="item level1">
            <div class="top">{{item.factor}}</div>
            <div class="center">
              <ul>
                <li>当前累计</li>
                <li>{{item.value}}</li>
                <li>（分指数：{{item.Index}}）</li>
              </ul>
              <ul>
                <li>剩余控制</li>
                <li>{{item.residue}}</li>
              </ul>
            </div>
            <div class="bottom">表现较好，继续保持！</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        actives: ["selected"],
        standardTime: {
          airLevelNum: 50,
          time: "",
          mns: ""
        },
        dataList: [],
      }
    },
    activated() {
      let time = new Date().format("yyyyMMddhh")
      this.standardTime.time = time
      this.getAirLevelStatus()
    },
    methods: {
      changeSelected(num){
        this.actives      = [];
        this.actives[num] = "selected"
        this.standardTime.airLevelNum = 50*(num+1)
        this.getAirLevelStatus()
      },
      getAirLevelStatus(){
        this.$http.get("/AirAppXY-Service/air/getAirStandardToDay",{params: this.standardTime}).then(res=>{
          if( res.data.code == 200 ) {
            this.dataList = res.data.content.info
          }
        })
      }
    },
    beforeRouteEnter(to,from,next){
      next(vm=>{
        if( vm.$store.state.vuex.stationData.id ) {
          vm.standardTime.mns       = vm.$store.state.vuex.stationData.id
        } else {
          vm.standardTime.mns       = ""
        }
      })
    }
  }
</script>

<style scoped lang="less">
  .standard{
    .standard_top{
      padding: 10px;
      background: white;
      ul{
        margin: 0;
        padding: 0;
        display: flex;
        li{
          .liang{
            width: 40px;
            height: 24px;
            line-height: 24px;
            display: inline-block;
            text-align: center;
            margin-left: 10px;
            color: #1E73D8;
            font-size: 14px;
            border: 1px solid rgba(30,115,216,1);
            border-radius: 4px;
          }
          .selected{
            background:linear-gradient(180deg,rgba(85,150,242,1) 0%,rgba(33,108,213,1) 100%);
            border: none;
            color: #fff;
          }
          input{
            width: 38px;
            height: 20px;
            line-height: 20px;
            display: inline-block;
            text-align: center;
            margin-left: 10px;
            border: 1px solid #666;
            border-radius: 4px;
            color: #666;
          }
          .jisuan{
            width: 40px;
            height: 24px;
            line-height: 24px;
            display: inline-block;
            text-align: center;
            margin-left: 10px;
            color: white;
            font-size: 14px;
            border-radius: 4px;
            background:#16E66D;
          }
        }
        li:nth-child(1){
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #1A1A1A;
          img{
            width: 10px;
            height: 10px;
          }
        }
      }
      ul:nth-child(2){
        margin-top: 10px;
      }
    }
    .standard_content{
      padding: 10px;
      width: calc(~"100% - 20px");
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .item{
        height: 120px;
        width: calc(~"50% - 5px");
        background: white;
        border-radius: 6px;
        .top{
          height: 24px;
          line-height: 24px;
          width: 100%;
          background: #16E66D;
          border-radius: 6px 6px 0 0;
          text-align: center;
          font-size: 14px;
        }
        .center{
          width: 100%;
          height: 75px;
          display: flex;
          ul{
            margin: 0;
            padding: 0;
            margin-top: 8px;
            flex: 1;
            li{
              white-space: nowrap;
              height: 33%;
              font-size: 12px;
              text-align: center;
            }
            li:nth-child(2){
              font-size: 15px;
              color: #1A1A1A;
              font-weight: 500;
            }
          }
          ul:nth-child(2){
            border-left: 1px solid rgba(0,0,0,0.1);
            height: 66%;
            li{
              height: 50%;
            }
          }
        }
        .bottom{
          height: 24px;
          line-height: 24px;
          width: 100%;
          text-align: center;
          font-size: 12px;
          background: #A7FFCC;
          border-radius: 0 0 6px 6px;
        }
        &.level1{
          .top{
            background: #16E66D;
          }
          .bottom{
            background: #A7FFCC;
          }
        }
        &.level2{
          .top{
            background: #F8AB5E;
          }
          .bottom{
            background: #F5CFAA;
          }
        }
        &.level3{
          .top{
            background: #FF5A5A;
          }
          .bottom{
            background: #FFACAC;
          }
        }
      }
      .item:not(:nth-child(2)):not(:nth-child(1)){
        margin-top: 10px;
      }
    }
  }
</style>
