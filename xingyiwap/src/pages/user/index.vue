<template>
    <div class="pages_content">
        <van-nav-bar :fixed="true" class="common-nav-bar">
            <template #left>
                <img src="../../assets/img/user_icon.png" @click="$router.push({path: '/mine'})" style="height: 18px; width: 18px" alt="">
            </template>
            <template #title>
                兴义市
            </template>
        </van-nav-bar>
    </div>
</template>

<script>
    export default {
        name: "home",
        data () {
          return {

          }
        },
        mounted() {

        },
        methods: {

        }
    }
</script>