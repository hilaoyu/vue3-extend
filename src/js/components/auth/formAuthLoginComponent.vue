

<script setup lang="ts">
import {defineProps, getCurrentInstance, ref} from 'vue';
import {Utils} from "js-utils";

const {proxy, ctx} = getCurrentInstance()
const props = defineProps({
  formLabelWidth: {type:String,default:"100px"},
  loginByAccount:Object,
  loginByEmail:Object,
  loginBySms:Object,
  apiCaptchaImage: Object,
  thirdPartyLoginLinks: Array,
})

const activeTabName = ref("accountLogin")
const handleLogined = (user,token) => {
  proxy.$emit('logined', user, token);
}

</script>

<template>
  <div>
    <el-tabs v-model="activeTabName" type="card">
      <el-tab-pane v-if="!Utils.isEmpty(props.loginByAccount)" label="账号登录" name="accountLogin">
        <form-auth-login-account
            class=""
            :api-login="loginByAccount"
            :api-captcha-image="apiCaptchaImage"
            :form-label-width="formLabelWidth"
            v-on:logined="handleLogined"
        >

        </form-auth-login-account>


      </el-tab-pane>
      <el-tab-pane v-if="!Utils.isEmpty(props.loginBySms)" label="手机验证登录" name="mobileLogin">
        <form-auth-login-mobile
            class=""
            :api-login="loginBySms"
            :api-captcha-image="apiCaptchaImage"
            :form-label-width="formLabelWidth"
            v-on:logined="handleLogined"
        >

        </form-auth-login-mobile>

      </el-tab-pane>
      <el-tab-pane v-if="!Utils.isEmpty(props.loginByEmail)" label="邮箱验证登录" name="emailLogin">
        <form-auth-login-email
            class=""
            :api-login="loginByEmail"
            :api-captcha-image="apiCaptchaImage"
            :form-label-width="formLabelWidth"
            v-on:logined="handleLogined"
        >

        </form-auth-login-email>
      </el-tab-pane>
    </el-tabs>
    <div>
      <el-link v-for="(third,index) in (thirdPartyLoginLinks||[])" :key="index" :href="third.url" class="me-3"
               v-html="third.name"></el-link>
    </div>
  </div>


</template>