<template>
  <div>
    <van-nav-bar left-arrow @click-left="historyBack" class="common-nav-bar" title="我的">
      <template #right>
        <img src="../../assets/img/mine/right.png" style="width: 20px; height: 17px" alt="">
      </template>
    </van-nav-bar>
    <div class="basic-info">
      <div class="content-info">
        <img class="avatar" src="../../assets/img/avatar.png"/>
        <div class="info-container">
<!--          <p class="name">{{user.userName}}</p>-->
            <p class="name">兴义管理员</p>
          <div>
<!--            <span class="post">运维工程师</span>-->
<!--            <span class="department">技术研发部</span>-->
          </div>
        </div>
      </div>
    </div>
    <!--第一组功能列表-->
    <div class="menu-list">
      <van-cell title="修改密码" size="large" @click="goto(1)" :icon="require('../../assets/img/mine/xgmm.png')" is-link />
      <van-cell title="新消息通知" size="large"  :icon="require('../../assets/img/mine/zxtz.png')" is-link />
      <van-cell title="关于" size="large"  :icon="require('../../assets/img/mine/gy.png')" is-link />
    </div>
<!--    第二组功能列表-->
    <div class="menu-list">
      <van-cell title="分享应用" size="large" @click="goto(4)"  :icon="require('../../assets/img/mine/fxyy.png')" is-link />
      <van-cell title="帮助中心" size="large"  :icon="require('../../assets/img/mine/bzzx.png')" is-link />
      <van-cell title="意见反馈" size="large"  :icon="require('../../assets/img/mine/yjfk.png')" is-link />
    </div>

    <div class="exit-btn" @click="exitBtnClick">退出登录</div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'

  export default {
    name: 'mine',
    created() {
      if ( localStorage.getItem("username") ) {
        this.user = {
          userName: localStorage.getItem("username")
        }
      } else {
        this.user = {
          userName: "张珊",
        }
      }

    },
    data() {
      return {
        user: {},
      }
    },
    mounted() {
      this.user.userName = localStorage.getItem("username")
    },
    methods: {
      // ...mapMutations(['updateIncludes', 'updateHomePos', 'updateTaskPos']),
      ...mapMutations(['updateIncludes', 'initialScrollPos']),
      exitBtnClick() {

        this.$dialog.confirm({
          title: '提示',
          message: '确定退出登录？'
        }).then(() => {
          this.exitRequest()
        }).catch(() => {

        })
      },
      goto(number){
        if ( number == 4 ) {
          this.$router.push({path: "/qrcode"})
        } else if ( number == 1 ) {
          this.$router.push({path: "/changePassword"})
        }
      },
      exitRequest() {
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        this.$router.push("/login")
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../../assets/css/index.less';
  .common-nav-bar{
    margin-bottom: -1px;
    background: url("../../assets/img/mine/top_bg.png") no-repeat top;
    background-size: 100%;
  }
  .basic-info {
    height: 150px;
    background: url("../../assets/img/mine/top_bg.png") no-repeat bottom;
    background-size: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .content-info {
      display: flex;
      align-items: center;
      .avatar {
        margin-left: 32px;
        width: 70px;
        height: 70px;
      }
      .info-container {
        margin-left: 12px;
        .name {
          color: #ffffff;
          font-size: @font-size-eighteen;
        }
        .post {
          color: #D4EAFF;
          font-size: @font-size-fourteen;
          margin-right: 3px;
        }
        .department {
          color: #D4EAFF;
          font-size: @font-size-eleven;
          background:linear-gradient(360deg,rgba(1,113,221,1) 0%,rgba(0,120,235,1) 100%);
          box-shadow:0px 2px 4px rgba(0,0,0,0.16);
          padding: 3px 10px;
          border-radius: 15px;
        }
      }
    }
  }

  .menu-list {
    margin-top: 10px;
  }
  .exit-btn {
    margin-top: 10px;
    background-color: #ffffff;
    height: 44px;
    line-height: 44px;
    text-align: center;
    color: #216CD5;
    font-size: @font-size-sixteen;
  }
</style>
