<template>
    <div>
        <van-nav-bar left-arrow @click-left="historyBack" :fixed="true" class="common-nav-bar">
            <template #title>
                空气站点列表
            </template>
            <template #right>
                <img src="../../assets/img/search.png" @click="$router.push({path: '/mine'})" style="height: 18px; width: 18px" alt="">
            </template>
        </van-nav-bar>
        <div class="listContent">
            <van-tabs v-model="active" color="#216CD5">
                <van-tab title="国控站">
                    <div class="list">
                        <van-cell-group>
                            <template v-for="(item,index) in stationList">
                                <van-cell :title="item.name" @click="$router.push('/map')">
                                    <template #default>
                                        <div class="listRightContent">
                                            <div class="waterLevel">
                                                <span :class="'level'+item.level">水质等级</span>{{levelText[item.level-1]}}类
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
                            <template v-for="(item,index) in stationList">
                                <van-cell :title="item.name" @click="$router.push('/map')">
                                    <template #default>
                                        <div class="listRightContent">
                                            <div class="waterLevel">
                                                <span :class="'level'+item.level">水质等级</span>{{levelText[item.level-1]}}类
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
    </div>
</template>

<script>
    export default {
        data () {
          return {
            active: 0,
            levelText: ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "劣Ⅴ"],
            stationList: [
              {
                name: "达力堵德站",
                level: 2
              },
              {
                name: "万峰湖九里堡站",
                level: 3
              },
              {
                name: "下纳灰河站",
                level: 3
              },
              {
                name: "万峰湖坝达章站",
                level: 4
              }
            ]
          }
        },
        mounted() {

        },
        methods: {

        }
    }
</script>

<style lang="less">
    @import "../../assets/css/pages/list.less";
</style>