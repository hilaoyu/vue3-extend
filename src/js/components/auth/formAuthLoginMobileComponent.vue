

<script setup lang="ts">
import {defineProps, getCurrentInstance, ref,nextTick} from 'vue';
import Utils from "../../services/utils";
import Validator from "../../services/validators";
import ApiAuth from '../../services/api-auth'
import type { FormInstance } from 'element-plus'

const {proxy, ctx} = getCurrentInstance()
const props = defineProps({
  formLabelWidth: {type:String,default:"100px"},
  apiCaptchaImage: Object,
  apiSendSms: Object,
  apiLogin: Object,
})
const loginFormData = ref({
  mobile: '',
  code_sms_id: '',
  code_sms_val: '',
  remember: false,

})
const loginFormErrors = ref({
  mobile: '',
  code_sms_val: '',
})

const rules = ref({
  mobile: [
    {required: true, message: '邮箱', trigger: 'blur'},
    {validator: Validator.validateEmail, trigger: 'blur'}
  ]

} )


const authLoginForm = ref<FormInstance>()
const authLogin = () =>{
  authLoginForm.value?.validate(valid => {
    if (valid) {

      ApiAuth.login(props.apiLogin,loginFormData)
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
    } else {
      //console.log('error submit!!');
      return false;
    }
  })

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
      <el-form-item label="手机号" :error="Utils.joinToString(loginFormErrors.mobile||'')"
                    prop="mobile">
        <el-input v-model="loginFormData.mobile" autocomplete="off" autofocus></el-input>
      </el-form-item>
      <el-form-item label="手机验证码" :error="Utils.joinToString(loginFormErrors.code_sms_val||'')"
                    prop="code_sms_val">
        <input-captcha-sms :send-to="loginFormData.mobile"
                           :api-send-sms="props.apiSendSms"
                           :api-captcha-image="props.apiCaptchaImage"
                           v-on:val_change="(code_id,code_val)=>{loginFormData.code_sms_id=code_id;loginFormData.code_sms_val=code_val;}"></input-captcha-sms>
      </el-form-item>


      <el-form-item label="" >

        <el-button type="primary" class="btn-block" @click="authLogin()">登 录</el-button>

      </el-form-item>

    </el-form>

  </div>


</template>