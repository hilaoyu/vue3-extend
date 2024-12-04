<style>
.menu-auth-dialog-maxw {
  max-width: 35em;
}
</style>
<script setup lang="ts">

import {defineProps, getCurrentInstance, nextTick, ref} from 'vue';
import {Utils} from "js-utils";
import ApiAuth from '../../services/api-auth'

const {proxy, ctx} = getCurrentInstance()
const props = defineProps({
  id: {
    type: String,
    default: 'auth-menu-' + Utils.randomString(6)
  },
  viewMode: {type:String,default:"horizontal"},
  formLabelWidth: {type:String,default:"100px"},
  loginByAccount:Object,
  loginByEmail:Object,
  loginBySms:Object,
  apiCaptchaImage: Object,
  apiHasLoggedIn: Object,
  thirdPartyLoginLinks: Array,
  apiLogout: Object,
  apiChangePass: Object,
})

const dialogVisible = ref({
  login: false,
  logout: false,
  changePass: false,
})
const authedUser = ref(null)

const openAuthDialog = (name)  => {
  closeAuthDialog(name);
  name = name || '';
  if (name) {
    try {
      dialogVisible.value[name] = true
    } catch (e) {

    }
  }
}
const closeAuthDialog = (name) => {
  name = name || '';
  if (name) {
    try {
      dialogVisible.value[name] = false
    } catch (e) {

    }
  } else {
    for (let n in dialogVisible) {
      dialogVisible[n] = false;
    }
  }
}
const eventAuthLoggedIn = (user,token) => {
  authedUser.value = user;
  closeAuthDialog('login')
  proxy.$emit('logined')
}
const eventAuthLogouted = () => {
  authedUser.value = null;
  closeAuthDialog('logout')
  proxy.$emit('logouted')
}
const eventChangPassSuccess = () => {
  proxy.$emit('chang-pass-success')
}
const checkLoggedIn = () => {
  ApiAuth.checkLogin(props.apiHasLoggedIn).then( (res_data) => {
    authedUser.value = Utils.valueGet(res_data,"user",null)
  })
}

nextTick(function (){
  checkLoggedIn()
})



</script>
<template>
  <div :id="id" class=" ">
    <el-menu class=" " :mode="props.viewMode" :ellipsis="false">
      <el-sub-menu >
        <template v-slot:title>
          <template v-if="authedUser">
            <slot name="title-logined" :user="authedUser">
              <span class="text-success">{{ Utils.valueGet(authedUser,'name',Utils.valueGet(authedUser,'account','')) }}</span>
            </slot>
          </template>
          <template v-else>
            <slot name="title-unlogined">
              <el-menu-item @click="openAuthDialog('login')">登录</el-menu-item>
            </slot>
          </template>

        </template>
        <template v-if="authedUser">
          <slot name="logined"></slot>
          <el-menu-item @click="openAuthDialog('changePass')">
            修改密码
          </el-menu-item>
          <el-menu-item class="border-top" @click="openAuthDialog('logout')">
            退出登录
          </el-menu-item>
        </template>
        <template v-else>
          <slot name="unlogined"></slot>
        </template>
      </el-sub-menu>
    </el-menu>
    <!--      登录弹框-->
    <el-dialog
        title=""
        v-model:="dialogVisible.login"
        :destroy-on-close="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :append-to-body="true"
        :modal-append-to-body="true"
        custom-class="menu-auth-dialog-maxw"
        center>
      <div>
        <form-auth-login
            :login-by-account="props.loginByAccount"
            :login-by-sms="props.loginBySms"
            :login-by-email="props.loginByEmail"
            :api-captcha-image="props.apiCaptchaImage"
            :third-party-login-links="props.thirdPartyLoginLinks"
            v-on:logined="eventAuthLoggedIn"
        >

        </form-auth-login>
      </div>
<!--      <template v-slot:footer>
        <div class="dialog-footer">
          <el-row type="flex" justify="space-between">
            <el-button v-if="Utils.isEmpty(props.apiChangePass)"
                       type="text" @click="openAuthDialog('forgetPass')">忘记密码 ?点此找回
            </el-button>
          </el-row>
        </div>
      </template>-->

    </el-dialog>

    <!--      退出登录弹框-->
    <el-dialog
        title="退出登录"
        v-model:="dialogVisible.logout"
        :destroy-on-close="true"
        :append-to-body="true"
        :modal-append-to-body="true"
        custom-class="menu-auth-dialog-maxw"
        center>
      <div>
        <form-auth-logout
            :api-logout="props.apiLogout"
           v-on:logouted="eventAuthLogouted"></form-auth-logout>
      </div>
      <template v-slot:footer>
        <div  class="dialog-footer">

        </div>
      </template>

    </el-dialog>
    <!--      修改密码弹框-->
    <el-dialog
        title="修改密码"
        v-model:="dialogVisible.changePass"
        :destroy-on-close="true"
        :append-to-body="true"
        :modal-append-to-body="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        custom-class="menu-auth-dialog-maxw"
        center>
      <div>
        <form-auth-user-chang-pass
            :api-change-pass="props.apiChangePass"
            v-on:changed-success="eventChangPassSuccess"></form-auth-user-chang-pass>
      </div>
      <template v-slot:footer>
        <div class="dialog-footer">

        </div>
      </template>

    </el-dialog>


  </div>


</template>
