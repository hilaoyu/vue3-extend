<script setup lang="ts">
import {defineProps, getCurrentInstance, ref} from 'vue';
import Validators from '../../services/validators'
import axios,{buildAxiosRequestConfig} from "../../services/axios";
import Utils from "../../services/utils";

const {proxy, ctx} = getCurrentInstance()
const props = defineProps({
  apiSendEmail: Object,
  apiCaptchaImage: Object,
  sendTo: {
    type: String,
    default: ''
  }
})

const formLabelWidth = '30%'
const captchaImgDialogVisible = ref(false)
const sendButton = ref({
  content: '发送验证码',
  disabled: false
})
const captcha = ref({
  code_val: '',
  code_id: ''
})
const sendFormData = ref({
  code_img_id: '',
  code_img_val: '',
  email: '',
})


const captchaImageChange = (code_id, code_val) => {
  sendFormData.value.code_img_id = code_id;
  sendFormData.value.code_img_val = code_val;
}
const send = () => {
      Validators.validateEmail(null, props.sendTo, function (error) {
        if (error) {
          proxy.$message.error(error.message || '错误')
          return;
        }
        sendFormData.value.email = props.sendTo

        axios.apiRequest(buildAxiosRequestConfig(props.apiSendEmail,sendFormData)).then(function (res) {

          let _status = Utils.valueGet(res,'status',false)
          if (_status) {
            captcha.value.code_id = Utils.valueGet(res,'data.code_id','');
            captchaImgDialogVisible.value = false;
            proxy.$message.success('发送成功');

            sendButton.value.disabled = true;
            sendButton.value.content = '';
            Utils.timeCountDown(60, function () {
              sendButton.value.disabled = false;
              sendButton.value.content = '发送验证码';
            }, function (timeout) {
              sendButton.value.content = timeout + '秒后重新发送';
            })

            return true;
          }

          return false;
        });
      })


    }
const openCaptchaImgDialog = () =>{
  Validator.validateEmail(null, props.sendTo, function (error) {
    if (error) {
      proxy.$message.error(error.message || '错误')
      return;
    }
    captchaImgDialogVisible.value = true;
  })
}
const closeCaptchaImgDialog = () => {
  captchaImgDialogVisible.value = false
}

</script>

<template>

  <el-row type="flex">
    <el-input v-model="captcha.code_val" autocomplete="off" placeholder="邮件验证码"
              v-on:change="$emit('val_change',captcha.code_id,captcha.code_val)">
      <template v-slot:append>
        <el-button @click="openCaptchaImgDialog()" v-text="sendButton.content||'发送验证码'"
                   :disabled="sendButton.disabled"></el-button>
      </template>
    </el-input>

    <el-dialog
        title="发送邮件验证码"
        :visible.sync="captchaImgDialogVisible"
        :destroy-on-close="true"
        :close-on-click-modal="false"
        append-to-body
        center>
      <div>
        <el-form :model="sendFormData" :label-width="formLabelWidth">
          <el-form-item label="发送到">
            <el-input :value="sendTo" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="图片验证码">
            <input-captcha-image :api-captcha-image="apiCaptchaImage" v-on:val_change="captchaImageChange"></input-captcha-image>
          </el-form-item>

        </el-form>
      </div>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="closeCaptchaImgDialog()">取 消</el-button>
          <el-button type="primary" @click="send()">发 送</el-button>

        </div>
      </template>

    </el-dialog>
  </el-row>

</template>
