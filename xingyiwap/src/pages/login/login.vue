<template>
    <div>
        <div class="container">
            <div class="top">
                <img src="../../assets/img/logo.png" class="logo" alt="">
            </div>
            <div class="formContent">
                <div class="inputIcon">
                    <img src="../../assets/img/username.png" style="width: 13.5px; height: 16px" alt="">
                    <input type="text" v-model="formData.userName" placeholder="请输入账号" />
                </div>
                <van-divider :style="{ color: '#4986E4', margin: '0 40px 30px 40px' }" />
                <div class="inputIcon">
                    <img src="../../assets/img/password_icon.png" style="width: 12.5px; height: 14.5px" alt="">
                    <input type="password" v-model="formData.password" placeholder="请输入密码" />
                </div>
                <van-divider :style="{ color: '#4986E4', margin: '0 40px 10px 40px' }" />
                <div class="inputIcon">
                    <van-button round type="info" @click="submit" style="width: 100%">登录</van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import qs from "qs";

    export default {
        data(){
          return {
            formData: {
              userName: "",
              password: "",
            },
            active: false,
          }
        },
        methods: {
          submit(){
            this.loginButtonActiveSetup()
            if( !this.active ) {
              return false
            } else {
              this.loginRequest()
            }
          },
          loginButtonActiveSetup() {
            if (this.formData.userName == null || this.formData.userName == '' || this.formData.userName == undefined || this.formData.userName == 'undefined' || this.formData.userName.length==0) {
              this.active = false
              this.$toast.fail("请输入用户名！")
              return
            }
            if (this.formData.password == null || this.formData.password == '' || this.formData.password == undefined || this.formData.password == 'undefined' || this.formData.password.length==0 || this.formData.password.length < 6  || this.formData.password.length > 16 ) {
              this.active = false
              this.$toast.fail("请输入密码！")
              return
            }
            this.active = true
          },
          loginRequest() {
            let parameters = {
              account: this.formData.userName,
              password: this.formData.password
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

<style lang="less" scoped>
    @import "../../assets/css/pages/login";
</style>