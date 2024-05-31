<script setup lang="ts">
import {defineProps, getCurrentInstance, ref, watch} from 'vue';
const {proxy, ctx} = getCurrentInstance()
const props = defineProps({
  type: String,
  value: [String,Object],
  label: String,
  fileDisk: String,
})
const inputValue = ref(props.value)
watch(inputValue,(newValue, oldValue) =>{
  proxy.$emit('val_change', newValue)
})

</script>


<template>
  <el-form-item label="">
    <el-input v-if="'textarea'===type" type="textarea" v-model="inputValue"></el-input>
    <el-input v-else-if="'text_rich'===type" type="textarea" v-model="inputValue"></el-input>
    <el-input v-else v-model="inputValue"></el-input>
  </el-form-item>

</template>