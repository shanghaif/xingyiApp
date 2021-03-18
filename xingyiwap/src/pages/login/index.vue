<template>
  <div class="login-page-container">
    <div class="top-icon-container">
      <img src="../../assets/img/company-logo.png"/>
    </div>
    <div class="login-container">
      <van-cell-group class="input-container">
        <van-field class="input van-hairline--bottom" v-model="userName" placeholder="手机号/邮箱/用户名" @input="userNameDidChange">
          <div slot="left-icon">
            <img src="../../assets/img/user_icon1.png" style="max-width: 18px" alt="">
          </div>
        </van-field>
        <van-divider :style="{ color: '#4986E4' }" />
        <van-field v-model="password" placeholder="请输入密码" type="password" @input="passwordDidChange">
          <div slot="left-icon">
            <img src="../../assets/img/password.png" style="max-width: 15px" alt="">
          </div>
        </van-field>
      </van-cell-group>
    </div>
    <div class="login-btn" @click="loginButtonClick">
      登&nbsp;&nbsp;录
    </div>
<!--    <div class="bottom-container">-->
<!--      <div class="content-container">-->
<!--        <span @click="registerBtnClick">用户注册</span>-->
<!--        <span @click="forgetPasswordBtnClick">忘记密码</span>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
  import qs from "qs"
  export default {
    name: 'index',
    data() {
      return {
        userName: '',
        password: '',
        active: false,
      }
    },
    methods: {
      /**
       * 用户名输入变化事件
       */
      userNameDidChange() {
        this.loginButtonActiveSetup()
      },
      /**
       * 密码输入变化事件
       */
      passwordDidChange() {
        this.loginButtonActiveSetup()
      },
      /**
       * 登录按钮活性设置
       */
      loginButtonActiveSetup() {
        if (this.userName == null || this.userName == '' || this.userName == undefined || this.userName == 'undefined' || this.userName.length==0) {
          this.active = false
          return
        }
        if (this.password == null || this.password == '' || this.password == undefined || this.password == 'undefined' || this.password.length==0 || this.password.length < 6  || this.password.length > 16 ) {
          this.active = false
          return
        }
        this.active = true
      },
      /**
       * 注册按钮点击事件
       */
      registerBtnClick() {
        console.log('registerBtnClick')
      },
      /**
       * 忘记密码按钮点击事件
       */
      forgetPasswordBtnClick() {
        console.log('forgetPasswordBtnClick')
      },
      /**
       * 登录按钮点击事件
       */
      loginButtonClick() {
        if (!this.active) {
          this.$dialog.alert({
            title: '',
            message: '用户名或密码不正确！',
            confirmButtonColor: "#409EFF"
          })
          return
        }
        this.loginRequest()
      },
      /**
       * 登录请求
       */
      loginRequest() {
        let parameters = {
          account: this.userName,
          password: this.password
        }
        this.$http.post("/identify/auth/login", qs.stringify(parameters)).then(res=>{
          if( res.data.code == 0 ) {
            localStorage.setItem("token", res.data.content.token)
            localStorage.setItem("userInfo", JSON.stringify(res.data.content.info))
            setTimeout(()=>{
              this.$router.push({path: "/home"})
            },1000)
          } else {
            this.$dialog.alert({
              title: '',
              message: '用户名或密码不正确！',
              confirmButtonColor: "#409EFF"
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../assets/css/back/index";

  .login-page-container {
    width: 100vw;
    height: 100vh;
    background: url("../../assets/img/login_bg.png") no-repeat center center;
    background-size: 100% 100%;
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .top-icon-container {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      // position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      height: 18%;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
      img {
        width: 65px;
        height: 65px;
      }
    }
    .login-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      //padding: 20px 16px;
      height: 110px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 5px;
      margin: 0 14%;
      margin-top: 10%;
      z-index: 100;
      .input {
        width: 100%;
      }
      .tip-container {
        display: flex;
        align-items: center;
        .icon {
          width: 20px;
          height: 20px;
          margin-right: 5px;
        }
      }
      .divider {
        width: 100%;
        .separator {
          margin: 0 0 0 16px;
        }
      }
      /deep/ .van-cell-group{
        background: none !important;
        border: none !important;
        .van-cell{
          background: none !important;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 54px;
          margin-left: 20px;
          padding: 0;
          input::-webkit-input-placeholder{
            color: rgba(255, 255, 255, 0.8);
            font-size: 15px;
          }
          input{
            color: #fff;
            line-height: 28px;
            margin-left: 40px;
          }
        }
        .van-cell::after{
          border: none !important;
        }
      }
    }
    .login-btn {
      margin: 32px 14% 0 14%;
      height: 44px;
      line-height: 44px;
      border-radius: 6px;
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      text-align: center;
    }
    .bottom-container {
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      height: 44px;
      color: #fff;
      font-size: 14px;
      .content-container {
        margin: 0 32px;
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
