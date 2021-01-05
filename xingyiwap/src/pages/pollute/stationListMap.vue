<template>
    <div>
        <van-nav-bar v-if="!showSearch" left-arrow @click-left="historyBack" :fixed="true" class="common-nav-bar">
            <template #title>
                污染源列表
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
            <div class="typeList">
                <div class="type" @click="selectPicker(0)">
                    {{polluteText}} <span class="navBarxl"></span>
                </div>
                <div class="type" @click="selectPicker(1)">
                    {{polluteTextLx}} <span class="navBarxl"></span>
                </div>
            </div>
            <div class="list">
                <van-cell-group>
                    <template v-for="(item,index) in stationList">
                        <van-cell>
                            <template #title>
                                <div style="display: flex; align-items: center">
                                    <span style="margin-right: 20px">{{index+1}}</span>
                                    <div>
                                        <p>{{item.name}}</p>
                                        <div class="vist" style="justify-content: flex-start">
                                            <span class="type">{{item.unitType || "其他"}}</span>
                                            <span class="otype">{{item.pollTypeName}}</span>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template #default>
                                <div @click="$router.push('/map/3/'+item.id)" style="height: 100%; display: flex; align-items: center; justify-content: flex-end">
                                    <img src="../../assets/img/dz.png" style="width: 17px; height: 17px" alt="">
                                </div>
                            </template>
                        </van-cell>
                    </template>
                </van-cell-group>
            </div>
        </div>
        <!--污染源类别-->
        <van-popup v-model="polluteType" position="bottom">
            <van-picker
                show-toolbar
                :default-index="0"
                :columns="polluteColumns"
                @confirm="onPolluteConfirm"
                @cancel="polluteType = false"
            />
        </van-popup>
        <!--污染源类型-->
        <van-popup v-model="polluteTypeLx" position="bottom">
            <van-picker
                show-toolbar
                :default-index="0"
                :columns="polluteColumnsLx"
                @confirm="onPolluteConfirmLx"
                @cancel="polluteTypeLx = false"
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
            active: 0,
            polluteType: false,
            polluteText: "污染源类别",
            polluteColumns: ["全部", "工业源", "农业源", "集中式", "生活源", "移动源"],
            polluteIndex: ["", "GY", "NY", "JZ", "SH", "YD"],
            polluteTypeLx: false,
            polluteTextLx: "污染源类型",
            polluteColumnsLx: ["全部", "废水/废气企业", "废水企业", "废气企业", "土壤企业", "其他"],
            polluteIndexLx: ["", "fsfq", "fs", "fq", "soil", "other"],
            keyword: "",
            levelText: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ", "--"],
            stationList: [
            ],
            initList: [],
            polluteTime: {
              pollType: "",
              type: ""
            },
          }
        },
        mounted() {

        },
      activated() {
        if( this.$route.params.type ) {
            this.polluteTime.type = this.$route.params.type
            this.polluteIndexLx.forEach((item,index)=>{
              if( this.$route.params.type == item ) {
                this.polluteTextLx = this.polluteColumnsLx[index]
              }
            })
        } else {
          this.polluteTime.type = ""
          this.polluteTextLx    = "污染源类型"
        }
        this.getStationList()
      },
      methods: {
          // 获取站点数据
          getStationList() {
              this.$http.get("/AirAppXY-Service/pollutionSource/pollInfo", {params: this.polluteTime}).then(res=>{
                if( res.data.code == 200 ) {
                  this.stationList = res.data.content.info
                  this.initList    = res.data.content.info
                }
              })
          },
          onPolluteConfirm(value,index) {
            if( index == 0 ) {
              this.polluteText = "污染源类别"
            } else {
              this.polluteText = value
            }
            this.polluteTime.pollType = this.polluteIndex[index]
            this.getStationList()
            this.polluteType = false
          },
          onPolluteConfirmLx(value,index) {
            if( index == 0 ) {
              this.polluteTextLx = "污染源类型"
            } else {
              this.polluteTextLx = value
            }
            this.polluteTime.type = this.polluteIndexLx[index]
            this.getStationList()
            this.polluteTypeLx = false
          },
          selectPicker(type) {
            if( type == 0 ) {
              this.polluteType = true
            } else if( type == 1 ) {
              this.polluteTypeLx = true
            }
          },
            searchFun(){
              this.stationList = JSON.parse(JSON.stringify(this.initList))
              if( this.searchValue ) {
                this.stationList = this.stationList.filter(item=>item.name.indexOf(this.searchValue)>=0)
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
    .list{
        height: calc(100vh - 107px);
        overflow-y: scroll;
        width: 100%;
        .vist{
            display: flex;
            justify-content: flex-end;
            align-items: center;
            span{
                display: inline-block;
                font-size: 12px;
                padding: 0 10px;
                color: #F5F5F5;
            }
            .type{
                margin-right: 10px;
                background: #0184FF;
            }
            .otype{
                background: #20BFF5;
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