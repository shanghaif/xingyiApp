<template>
    <div>
        <van-nav-bar v-if="!showSearch" left-arrow @click-left="historyBack" :fixed="true" class="common-nav-bar">
            <template #title>
                水质站点列表
            </template>
            <template #right>
                <img @click="showSearch = true" src="../../assets/img/search.png" style="height: 18px; width: 18px" alt="">
            </template>
        </van-nav-bar>
        <van-search
                v-if="showSearch"
                v-model="searchValue"
                show-action
                shape="round"
                background="#0184FF"
                placeholder="请输入站点名称"
        >
            <template #action>
                <div class="searchBtn">
                    <span @click="searchFun">搜索</span>
                    <span @click="showSearch = false">取消</span>
                </div>
            </template>
        </van-search>
        <div class="listContent">
            <van-tabs v-model="active" color="#216CD5">
                <van-tab title="国控站">
                    <div class="list">
                        <van-cell-group>
                            <template v-for="(item,index) in stationList" v-if="item.controlorLevel == 'GUO0000'">
                                <van-cell :title="item.stationName" @click="$router.push('/map/0/'+item.stationCode)">
                                    <template #default>
                                        <div class="listRightContent">
                                            <div class="waterLevel">
                                                <span :class="'level'+(item.aRealData ? (item.aRealData.wq_tp+1) : 6)">水质等级</span>{{levelText[item.aRealData ? item.aRealData.wq_tp : 6]}}类
                                            </div>
                                            <img src="../../assets/img/dz.png" style="width: 17px; height: 17px" alt="">
                                        </div>
                                    </template>
                                </van-cell>
                            </template>
                        </van-cell-group>
                    </div>
                </van-tab>
                <van-tab title="省控站">
                    <div class="list">
                        <van-cell-group>
                            <template v-for="(item,index) in stationList" v-if="item.controlorLevel == 'SHE0000'">
                                <van-cell :title="item.stationName" @click="$router.push('/map/0/'+item.stationCode)">
                                    <template #default>
                                        <div class="listRightContent">
                                            <div class="waterLevel">
                                                <span :class="'level'+(item.aRealData ? (item.aRealData.wq_tp+1) : 6)">水质等级</span>{{levelText[item.aRealData ? item.aRealData.wq_tp : 6]}}类
                                            </div>
                                            <img src="../../assets/img/dz.png" style="width: 17px; height: 17px" alt="">
                                        </div>
                                    </template>
                                </van-cell>
                            </template>
                        </van-cell-group>
                    </div>
                </van-tab>
                <van-tab title="市控站">
                    <div class="list">
                        <van-cell-group>
                            <template v-for="(item,index) in stationList" v-if="item.controlorLevel == 'SHI0000' && item.monitorType == '1'">
                                <van-cell :title="item.stationName" @click="$router.push('/map/0/'+item.stationCode)">
                                    <template #default>
                                        <div class="listRightContent">
                                            <div class="waterLevel">
                                                <span :class="'level'+(item.aRealData ? (item.aRealData.wq_tp+1) : 6)">水质等级</span>{{levelText[item.aRealData ? item.aRealData.wq_tp : 6]}}类
                                            </div>
                                            <img src="../../assets/img/dz.png" style="width: 17px; height: 17px" alt="">
                                        </div>
                                    </template>
                                </van-cell>
                            </template>
                        </van-cell-group>
                    </div>
                </van-tab>
                <van-tab>
                    <template #title>
                        <span @click="changeTabs" style="display: inline-block; height: 100%; width: 100%">{{waterTextLx}}</span>
                    </template>
                    <div class="list">
                        <van-cell-group>
                            <template v-for="(item,index) in stationList" v-if="item.monitorType == '0'">
                                <van-cell :title="item.stationName" @click="$router.push('/map/0/'+item.stationCode)">
                                    <template #default>
                                        <div class="listRightContent">
                                            <div class="waterLevel">
                                                <span :class="'level'+(item.aRealData ? (item.aRealData.wq_tp+1) : 6)">水质等级</span>{{levelText[item.aRealData ? item.aRealData.wq_tp : 6]}}类
                                            </div>
                                            <img src="../../assets/img/dz.png" style="width: 17px; height: 17px" alt="">
                                        </div>
                                    </template>
                                </van-cell>
                            </template>
                        </van-cell-group>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
        <!--污染源类型-->
        <van-popup v-model="waterTypeLx" position="bottom">
            <van-picker
                show-toolbar
                :default-index="0"
                :columns="waterColumnsLx"
                @confirm="onWaterConfirmLx"
                @cancel="waterTypeLx = false"
            />
        </van-popup>
    </div>
</template>

<script>
    export default {
        data () {
          return {
            showSearch: false,
            searchValue: '',
            active: 2,
            keyword: "",
            levelText: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ", "--"],
            stationList: [
            ],
            stationNum: {
              water: {
                sk: 0,
                gk: 0,
                sek: 0,
                sgz: 0
              }
            },
            waterTypeLx: false,
            waterTextLx: "手工站",
            waterColumnsLx: ["手工站"],
            waterIndexLx: ["0"],
            waterTypeList: [],
            waterSgType: "0",
            initList: []
          }
        },
        mounted() {

        },
      activated() {
          this.getWaterNum(()=>{
            this.getStationList(()=>{
              if( this.$route.params.index ) {
                this.active = Number(this.$route.params.index)
                if( this.active == 3 && this.$route.params.type && this.$route.params.type != "0" ) {
                  this.waterSgType = this.$route.params.type
                  this.waterIndexLx.forEach((item,index)=>{
                    if( item == this.$route.params.type ) {
                      this.onWaterConfirmLx(this.waterColumnsLx[index],index)
                    }
                  })
                }
              }
            })
          })
      },
      methods: {
        changeTabs(){
          this.waterTypeLx = true
        },
          // 获取站点数据
          getStationList(callback=null) {
              this.$http.get("/AirAppXY-Service/map/getRealStationWaterData").then(res=>{
                if( res.data.code == 200 ) {
                  this.stationList = res.data.content.info
                  this.initList    = res.data.content.info
                  if( callback ) {
                    callback()
                  }
                }
              })
          },
            getWaterNum(callback=null){
              this.$http.get("/AirAppXY-Service/map/stationTypeStatistics",{params:{typeCode: "W"}}).then(res=>{
                this.waterColumnsLx = ["手工站"]
                this.waterIndexLx = ["0"]
                this.waterTextLx = "手工站"
                if( res.data.code == 200 || res.data.code == 0 ) {
                  this.waterTypeList = res.data.content.dataList
                  this.waterTypeList.forEach((item,index)=>{
                    if( item.monitor_type == "0" ) {
                      this.waterColumnsLx.push(item.stationTypeName)
                      this.waterIndexLx.push(item.stationTypeCode)
                    }
                  })
                  if( callback ) {
                    callback()
                  }
                }
              })
            },
            onWaterConfirmLx(value,index){
              this.waterTextLx = value
              this.waterTypeLx = false
              this.waterSgType = this.waterIndexLx[index]
              this.stationList = JSON.parse(JSON.stringify(this.initList))
              if( this.waterSgType && this.waterSgType != "0" ) {
                this.stationList = this.stationList.filter(item=>item.stationType == this.waterSgType)
              }
            },
            searchFun(){
                this.stationList = JSON.parse(JSON.stringify(this.initList))
                if( this.searchValue ) {
                  this.stationList = this.stationList.filter(item=>item.stationName.indexOf(this.searchValue)>=0)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/css/pages/list.less";
    .van-search{
        position: fixed;
        top: 0;
        height: 47px;
        z-index: 999;
        width: 100vw;
    }
    .searchBtn{
        span{
            color: #fff;
            &:first-child{
                margin-right: 10px;
            }
        }
    }
</style>