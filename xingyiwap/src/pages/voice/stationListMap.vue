<template>
    <div>
        <van-nav-bar left-arrow @click-left="historyBack" :fixed="true" class="common-nav-bar">
            <template #title>
                声环境点位列表
            </template>
            <template #right>
                <img src="../../assets/img/search.png" style="height: 18px; width: 18px" alt="">
            </template>
        </van-nav-bar>
        <div class="listContent">
            <div class="typeList">
                <div class="type" @click="selectPicker(0)">
                    {{voiceText}} <span class="navBarxl"></span>
                </div>
                <div class="type" @click="selectPicker(1)">
                    {{voiceTextLx}} <span class="navBarxl"></span>
                </div>
            </div>
            <div class="list">
                <van-cell-group>
                    <template v-for="(item,index) in stationList">
                        <van-cell>
                            <template #title>
                                <div style="width: 100%; height: 100%" @click="$router.push('/voiceDetail/'+item.station_code)">
                                    <font style="padding-right: 20px">{{index+1}}</font>{{item.station_name}}
                                </div>
                            </template>
                            <template #default>
                                <div class="vist" @click="$router.push('/map/2/'+item.station_code)">
                                    <span class="type" :class="item.noiseLevelNum ? 'voice'+item.noiseLevelNum : 6">{{item.noiseLevel || "--"}}</span>{{item.leq}}dp(A)<img src="../../assets/img/dz.png" style="width: 17px; height: 17px; margin-left: 40px" alt="">
                                </div>
                            </template>
                        </van-cell>
                    </template>
                </van-cell-group>
            </div>
        </div>
        <!--站点类型-->
        <van-popup v-model="voiceType" position="bottom">
            <van-picker
                    show-toolbar
                    :default-index="0"
                    :columns="voiceColumns"
                    @confirm="onvoiceConfirm"
                    @cancel="voiceType = false"
            />
        </van-popup>
        <!--功能区等级-->
        <van-popup v-model="voiceTypeLx" position="bottom">
            <van-picker
                    show-toolbar
                    :default-index="0"
                    :columns="voiceColumnsLx"
                    @confirm="onvoiceConfirmLx"
                    @cancel="voiceTypeLx = false"
            />
        </van-popup>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        active: 0,
        voiceType: false,
        voiceText: "站点类型",
        voiceColumns: ["全部", "道路交通", "城市区域", "城市功能区"],
        voiceIndex: ["N_001,N_002,N_003", "N_003", "N_001", "N_002"],
        voiceTypeLx: false,
        voiceTextLx: "功能区等级",
        voiceColumnsLx: ["全部", "0级", "1级", "2级", "3级", "4a级", "4b级"],
        voiceIndexLx: ["", "fsfq", "fs", "fq", "soil", "other", "4b"],
        keyword: "",
        levelText: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ", "--"],
        stationList: [
        ],
        voiceTime: {
          stationType: "N_001,N_002,N_003",
        },
      }
    },
    mounted() {

    },
    activated() {
      if( this.$route.params.type ) {
        this.voiceTime.stationType = this.$route.params.type
        this.voiceIndex.forEach((item,index)=>{
          if( this.$route.params.type == item ) {
            if( index == 0 ) {
              this.voiceText = "站点类型"
            } else {
              this.voiceText = this.voiceColumns[index]
            }
          }
        })
      } else {
        this.voiceTime.stationType = this.voiceIndex[0]
        this.voiceText    = "站点类型"
      }
      this.getStationList()
    },
    methods: {
      // 获取站点数据
      getStationList() {
        this.$http.get("/AirAppXY-Service/noise/noiseRealData", {params: this.voiceTime}).then(res=>{
          if( res.data.code == 0 ) {
            this.stationList = res.data.content.info.data
          }
        })
      },
      onvoiceConfirm(value,index) {
        if( index == 0 ) {
          this.voiceText = "站点类型"
        } else {
          this.voiceText = value
        }
        this.voiceTime.stationType = this.voiceIndex[index]
        this.getStationList()
        this.voiceType = false
      },
      onvoiceConfirmLx(value,index) {
        if( index == 0 ) {
          this.voiceTextLx = "功能区等级"
        } else {
          this.voiceTextLx = value
        }
        this.voiceTime.type = this.voiceIndexLx[index]
        this.getStationList()
        this.voiceTypeLx = false
      },
      selectPicker(type) {
        if( type == 0 ) {
          this.voiceType = true
        } else if( type == 1 ) {
          this.voiceTypeLx = true
        }
      }
    }
  }
</script>

<style lang="less" scoped>
    @import "../../assets/css/pages/list.less";
    @colorsVoice: {
        voice0: #FFFF99;
        voice1: #62FA61;
        voice2: #6799FC;
        voice3: #EF7031;
        voice4a: #FF0000;
        voice4b: #EB22EB;
        voice6: #cccccc;
    };
    .list{
        height: calc(100vh - 107px);
        overflow-y: scroll;
        width: 100%;
        .vist{
            display: flex;
            justify-content: flex-end;
            align-items: center;
            font-size: 13px;
            color: #1A1A1A;
            span{
                display: inline-block;
                font-size: 12px;
                padding: 0 10px;
                color: #F5F5F5;
                white-space: nowrap;
                width: 120px;
                text-align: center;
            }
            .type{
                margin-right: 10px;
                background: #0184FF;
                each(@colorsVoice, {
                    &.@{key} {
                        background: @value;
                    }
                })
            }
        }
    }
    .typeList {
        height: 40px;
        width: 100%;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        .type{
            flex: 1;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 15px;
            color: #999;
            &:first-child{
                border-right: 1px solid #ddd;
            }
            .navBarxl{
                display: inline-block;
                .setTriangleDown(#999);
            }
        }
    }
    // 下拉箭头
    .setTriangleDown(@color:#1E73D8, @borderWidth:5px, @borderTop: 5px, @marginLeft: 5px){
        height: 0;
        width: 0;
        border-left: @borderWidth solid transparent;
        border-right: @borderWidth solid transparent;
        border-top: @borderTop solid @color;
        margin-left: @marginLeft;
    }
</style>