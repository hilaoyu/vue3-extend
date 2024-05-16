
<script setup lang="ts">
import {defineProps, getCurrentInstance, ref,nextTick} from 'vue';
import Utils from "../../services/utils";
import ApiAuth from '../../services/api-auth'
import type { FormInstance } from 'element-plus'

const {proxy, ctx} = getCurrentInstance()
const props = defineProps({
  formLabelWidth: {type:String,default:"100px"},
  apiCaptchaImage: Object,
  apiLogin: Object,
})
const loginFormData = ref({
      account: '',
      password: '',
  code_img_id: '',
  code_img_val: '',
    })
const loginFormErrors = ref({
  account: '',
  password: '',
  code_img_val: '',
})

const rules = ref({
  account: [
    {required: true, message: '请输入账号', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
  ],

} )


const authLoginForm = ref<FormInstance>()
const authLogin = () =>{
 authLoginForm.value?.validate(valid => {
   if (valid) {

     ApiAuth.login(props.apiLogin,loginFormData.value)
         .then(function ({user, token}) {
           if (user) {
             proxy.$message.success('登录成功');
             proxy.$emit('logined', user, token);
           } else {
             proxy.$message.error('登录失败');
           }

         })
         .catch(function (error) {
           loginFormErrors.value = Utils.valueGet(error, 'response.data.errors', {});
         })
         .finally(function (){
           refreshCaptchaImage()
         })

   } else {
     //console.log('error submit!!');
     return false;
   }
 })

}

const handleCaptchaImageChange = (code_id,code_val) => {
  loginFormData.value.code_img_id = code_id
  loginFormData.value.code_img_val = code_val
}

const refreshCaptchaImage = () => {
  proxy.$refs?.inputCaptchaImage?.loadImage()
}

nextTick(function (){
  Utils.listenKeyUp('enter', 'login', function () {
    authLogin();
  })

})

</script>


<template>
  <div >
    <el-form ref="authLoginForm" :model="loginFormData" :label-width="formLabelWidth" :rules="rules" hide-required-asterisk label-position="left">
      <el-form-item label="账 号" :error="Utils.joinToString(loginFormErrors.account||'')" prop="account" >
        <el-input v-model="loginFormData.account" autocomplete="off" autofocus></el-input>

      </el-form-item>
      <el-form-item label="密 码" :error="Utils.joinToString(loginFormErrors.password||'')" prop="password" >
        <el-input type="password" v-model="loginFormData.password" autocomplete="off"></el-input>

      </el-form-item>
      <el-form-item label="图片验证码" v-if="!Utils.isEmpty(props.apiCaptchaImage)"
                    :error="Utils.joinToString(loginFormErrors.code_img_val||'')">
        <input-captcha-image ref="inputCaptchaImage" :api-captcha-image="props.apiCaptchaImage"
            v-on:val_change="handleCaptchaImageChange"></input-captcha-image>
      </el-form-item>

      <el-form-item label="" >

        <el-button type="primary" class="btn-block" @click="authLogin()">登 录</el-button>

      </el-form-item>

    </el-form>

  </div>


</template>
