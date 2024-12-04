

<script setup lang="ts">
import {defineProps, getCurrentInstance, ref} from 'vue';
import ApiAuth from "../../services/api-auth";

const {proxy, ctx} = getCurrentInstance()
const props = defineProps({
  formLabelWidth: {type:String,default:"100px"},
  apiLogout: Object,
})

const logoutFormData = ref({})
const authLogout =  () => {
  ApiAuth.logout(props.apiLogout).then(function () {
    proxy.$message.success('退出成功');
    proxy.$emit('logouted');
  })

}

</script>


<template>
  <el-form :model="logoutFormData">
    <el-form-item label="" >
      <el-button type="primary" class="btn-block" @click.prevent="authLogout()">退出登录</el-button>

    </el-form-item>

  </el-form>
</template>