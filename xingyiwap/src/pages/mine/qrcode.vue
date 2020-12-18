<template>
  <div>
    <van-nav-bar left-arrow @click-left="historyBack" class="common-nav-bar" title="分享应用">
    </van-nav-bar>
    <div class="qrcode">
      <vue-qr :logoSrc="imageUrl" :aria-level="10" ref="Qrcode" text="app下载地址" :size="200"></vue-qr>
    </div>
    <a :href="exportLink" @click="downloadImg" :download="downloadFilename">保存到手机</a>
  </div>
</template>

<script>
  import vueQr from 'vue-qr'
  export default {
    data(){
      return {
        imageUrl: require("../../assets/img/logo.png"),
        exportLink: '',
        downloadFilename: ''
      }
    },
    components: {
      vueQr
    },
    mounted() {
      this.qrCode("app下载地址")
    },
    methods: {
      qrCode (url) {

      },
      // 下载二维码图片
      downloadImg () {
        let Qrcode = this.$refs.Qrcode
        this.exportLink = Qrcode.$el.currentSrc
        this.downloadFilename = '二维码'
      }
    }
  }
</script>

<style scoped lang="less">
  .qrcode{
    height: 300px;
    width: 100%;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  a{
    width: 80%;
    margin: 0 auto;
    text-align: center;
    padding: 8px 0;
    background: white;
    border-radius: 20px;
    margin-top: 20px;
    color: #3399ff;
  }
  a:active{
    color: #3399ff;
  }
</style>
