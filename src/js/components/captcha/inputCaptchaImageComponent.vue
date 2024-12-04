

<script setup lang="ts">
import {defineProps, ref,defineExpose} from 'vue';
import {Utils,axios} from "js-utils";


const props = defineProps({
  apiCaptchaImage: Object,
  imgHeight: {
    type: Number,
    default: 30
  },
  imgWidth: {
    type: Number,
    default: 120
  },
})
const captcha_id = ref('')
const captcha_val = ref('')
const codeSrc = ref('')
const loadImage = () => {
  axios.quiet(true).apiRequest(props.apiCaptchaImage, {h: props.imgHeight, w: props.imgWidth}).then(function (res) {

    let _status = res.status || false;
    if (_status) {
      captcha_id.value = Utils.valueGet(res,'data.code_id','');
      codeSrc.value = Utils.valueGet(res,'data.code_img','');
      return false;
    }


  });


}
loadImage()
defineExpose({
  loadImage
})


</script>


<template>

  <el-input v-model="captcha_val" autocomplete="off" placeholder="图片验证码" v-on:change="$emit('val_change',captcha_id,captcha_val)">
    <template v-slot:append >
      <div class="p-0 border border-1" :style="{width:imgWidth +'px',height:imgHeight+'px',margin:'0 -20px'}">
        <img class="d-block" :src="codeSrc" :style="{width:(imgWidth-2) +'px',height:imgHeight+'px',cursor:'pointer',}" @click="loadImage()"/>
      </div>

    </template>
  </el-input>

</template>