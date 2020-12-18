<template>
  <div>
    <van-nav-bar left-arrow @click-left="historyBack" class="common-nav-bar" title="修改密码">
    </van-nav-bar>
    <van-form @submit="onSubmit">
      <van-field
        v-model="password"
        type="password"
        name="原密码"
        label="原密码"
        placeholder="请填写原密码"
        :rules="[{ required: true, message: '请填写原密码' }]"
      />
      <van-field
        v-model="password1"
        type="password"
        name="新密码"
        label="新密码"
        placeholder="请填写新密码"
        :rules="[{ required: true, message: '请填写新密码' }]"
      />
      <van-field
        v-model="password2"
        type="password"
        name="确认密码"
        label="确认密码"
        placeholder="再次填写确认"
        :rules="[{ required: true, message: '请再次填写新密码' }]"
      />
      <div style="margin: 16px 0;">
        <van-button block type="default" native-type="submit" style="color: #216CD5">
          完成
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        password: "",
        password1: "",
        password2: ""
      }
    },
    methods: {
      onSubmit(){

      }
    }
  }
</script>

<style>

</style>
