
<script setup lang="ts">
import {defineProps, getCurrentInstance, ref} from 'vue';
import Validators from '../../services/validators'
import {Utils,axios} from "js-utils";

const {proxy, ctx} = getCurrentInstance()
const props = defineProps({
  apiSendSms: Object,
  apiCaptchaImage: Object,
  sendTo: {
    type: String,
    default: ''
  }
})

const formLabelWidth = '30%'
const sendDialogVisible = ref(false)
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
  mobile: '',
})


const captchaImageChange = (code_id, code_val) => {
  sendFormData.value.code_img_id = code_id;
  sendFormData.value.code_img_val = code_val;
}
const send = () => {
  Validators.validateMobile(null, props.sendTo, function (error) {
    if (error) {
      proxy.$message.error(error.message || '错误')
      return;
    }
    sendFormData.value.mobile = props.sendTo

    axios.apiRequest(props.apiSendSms,sendFormData).then(function (res) {

      let _status = Utils.valueGet(res,'status',false)
      if (_status) {
        captcha.value.code_id = Utils.valueGet(res,'data.code_id','');
        sendDialogVisible.value = false;
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
const openSendDialog = () =>{
  Validator.validateMobile(null, props.sendTo, function (error) {
    if (error) {
      proxy.$message.error(error.message || '错误')
      return;
    }
    sendDialogVisible.value = true;
  })

}

const closeSendDialog = () => {
  sendDialogVisible.value = false
}


</script>


<template>

  <el-row type="flex">
    <el-input v-model="captcha.code_val" autocomplete="off" placeholder="短信验证码"
              v-on:change="$emit('val_change',captcha.code_id,captcha.code_val)">
      <template v-slot:append>
        <el-button @click="openSendDialog()" v-text="sendButton.content||'发送验证码'"
                   :disabled="sendButton.disabled||false"></el-button>
      </template>
    </el-input>

    <el-dialog
        title="发送手机验证码"
        :visible.sync="sendDialogVisible"
        :destroy-on-close="true"
        :close-on-click-modal="false"
        append-to-body
        center>
      <div>
        <el-form :model="sendFormData">
          <el-form-item label="发送到" :label-width="formLabelWidth">
            <el-input :value="sendTo" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="图片验证码" :label-width="formLabelWidth">
            <input-captcha-image v-on:val_change="captchaImageChange"></input-captcha-image>
          </el-form-item>

        </el-form>
      </div>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="closeSendDialog()">取 消</el-button>
          <el-button type="primary" @click="send()">发 送</el-button>

        </div>
      </template>

    </el-dialog>
  </el-row>

</template>
