
<script setup lang="ts">
import {defineProps, getCurrentInstance, ref,onMounted} from 'vue';
import {Utils} from "js-utils";
import Validator from "../../services/validators";
import ApiAuth from '../../services/api-auth'
import type { FormInstance } from 'element-plus'

const {proxy, ctx} = getCurrentInstance()
const props = defineProps({
  formLabelWidth: {type:String,default:"100px"},
  apiCaptchaImage: Object,
  apiSendEmail: Object,
  apiLogin: Object,
})
const loginFormData = ref({
  email: '',
  code_email_id: '',
  code_email_val: '',
  remember: false,

})
const loginFormErrors = ref({
  email: '',
  code_email_val: '',
})

const rules = ref({
  email: [
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

onMounted(function (){
  Utils.listenKeyUp('enter', 'login', function () {
    authLogin();
  })
})

</script>


<template>
  <div >
    <el-form ref="authLoginForm" :model="loginFormData" :label-width="formLabelWidth" :rules="rules" hide-required-asterisk label-position="left">
      <el-form-item label="邮箱" :error="Utils.joinToString(loginFormErrors.email||'')"
                    prop="email">
        <el-input v-model="loginFormData.email" autocomplete="off" autofocus></el-input>
      </el-form-item>
      <el-form-item label="邮箱验证码" :error="Utils.joinToString(loginFormErrors.code_email_val||'')"
                    prop="code_email_val">
        <input-captcha-email :send-to="loginFormData.email"
                             :api-send-email="props.apiSendEmail"
                             :api-captcha-image="props.apiCaptchaImage"
                             v-on:val_change="(code_id,code_val)=>{loginFormData.code_email_id=code_id;loginFormData.code_email_val=code_val;}"></input-captcha-email>
      </el-form-item>


      <el-form-item label="" >

        <el-button type="primary" class="btn-block" @click="authLogin()">登 录</el-button>

      </el-form-item>

    </el-form>

  </div>


</template>
