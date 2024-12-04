<script setup lang="ts">
import {defineProps, getCurrentInstance, ref} from 'vue';
import {Utils,axios} from "js-utils";
import Validators from '../../services/validators'
import type {FormInstance} from 'element-plus'

const {proxy, ctx} = getCurrentInstance()
const props = defineProps({
  formLabelWidth: {type: String, default: "100px"},
  apiChangePass: Object,
})
const formData = ref({
  old_password: '',
  password: '',
  password_confirm: '',
})
const formErrors = ref({
  old_password: '',
  password: '',
  password_confirm: '',
})

const validatePasswordConfirm = (rule, value, callback) => {
  if (value !== formData.value.password) {
    callback(new Error('两次密码输入不一致'));
  }
  callback();
};

const rules = {
  old_password: [
    {required: true, message: '请输入原密码', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {validator: Validators.validatePasswordStrong, trigger: 'blur'}
  ],
  password_confirm: [
    {required: true, message: '请重复密码', trigger: 'blur'},
    {validator: validatePasswordConfirm, trigger: 'blur'}
  ],

}
const changePassForm = ref<FormInstance>()
const changPassSubmit = () => {
  changePassForm.value.validate((valid) => {
    if (valid) {
      axios.apiRequest(props.apiChangePass, formData.value)
          .then(function (res_data) {
            proxy.$message.success('修改成功');
            changePassForm.value.resetFields();
            proxy.$emit('changed-success')
          }).catch(function (error) {
        formErrors.value = Utils.valueGet(error, 'response.data.errors', {});
      })
    } else {
      //console.log('error submit!!');
      return false;
    }
  });

}
</script>


<template>
  <el-form ref="changePassForm" :model="formData" :rules="rules" :label-width="formLabelWidth">

    <el-form-item label="原密码"
                  :error="Utils.joinToString(formErrors.old_password||'')"
                  prop="old_password">
      <el-input type="password" v-model="formData.old_password"
                autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="新密码"
                  :error="Utils.joinToString(formErrors.password||'')"
                  prop="password">
      <el-input type="password" v-model="formData.password"
                autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item
        label="重复密码"
        :error="Utils.joinToString(formErrors.password_confirm||'')"
        prop="password_confirm">
      <el-input type="password" v-model="formData.password_confirm"
                autocomplete="off"></el-input>
    </el-form-item>

    <el-form-item
        label=" ">
      <el-button type="primary" @click="changPassSubmit()">确定修改</el-button>
    </el-form-item>
  </el-form>
</template>