<script setup lang="ts">
import {defineProps, getCurrentInstance, nextTick, ref,onMounted} from 'vue';
import { Uploader, Utils,type fileQueueItem} from 'js-utils';

const {proxy, ctx} = getCurrentInstance()

const props = defineProps<{
  generateTokenCallback: Function,
  multiple:boolean,
}>()

const uploader = new Uploader("", true)
//new Uploader 第二个参数为是否自动开始上传。如果为true,那么添加文件以后会自动开始上传，否则需要手动用 uploader.startUpload() 启动上传

//设置错误信息显示回调
uploader.setEventOnError(function (err:Error) {
  proxy.$message.error(err.message)
})
const fileQueue = ref<Array<{value:string,queueItem:fileQueueItem|null}>>([{
  value:"",
  queueItem:null
}])
//设置队列变化时的回调方法，在队列中文件状态发生变化时会触发
uploader.setEventOnFileQueueChange(function (queue, changedIndex) {
  queue.forEach(function (queueItem){
    fileQueue.value[queueItem.customId].queueItem = queueItem
    if (queueItem.uploadCompleted){
      fileQueue.value[queueItem.customId].value = queueItem.url
    }
  })
  handleOnInputChange()
})

uploader.setEventOnUploadFinished(function (){
  proxy.$emit("finished")
})

const handleOnInputChange =() =>{
  let values = []
  fileQueue.value.forEach(function (fq){
    if ("" != fq.value){
      values.push(fq.value)
    }
  })
  proxy.$emit("change",values)
}



const selectFileToUploader = (valueIndex) => {

  props.generateTokenCallback().then(function (res_data) {

    let serviceUrl = Utils.valueGet(res_data, "data.service_url")
    uploader.setServerUrl(serviceUrl)
    let maxSize = Utils.valueGet(res_data, "data.max_size", 0)
    if (maxSize > 0) {
      uploader.setFileLimitMaxSize(maxSize)

    }
    let maxChunkSize = Utils.valueGet(res_data, "data.max_chunk_size", 0)
    if (maxChunkSize > 0) {
      uploader.setChunkSize(maxChunkSize)
    }
    uploader.setFileLimitAllowExt(Utils.valueGet(res_data, "data.allow_ext", []))

    uploader.selectFile(false,false,valueIndex)
  }).catch(function (err){

    proxy.$message.error(err.message)
  })


}
const addInput = ()=>{
  fileQueue.value.push({
    value:"",
    queueItem:null
  })
}
const removeInput = (index) => {
  fileQueue.value.splice(index,1)
}

onMounted(function (){
})

</script>


<template>
  <div class="w-100">
    <div class="d-flex"  v-for="(v,i) in fileQueue">
      <div>
        <el-input v-model="fileQueue[i].value" @change="handleOnInputChange"></el-input>
      </div>

      <div style="width:24px" class=" me-2">
        <el-icon style="cursor: pointer;" class="text-danger mt-1" v-if="multiple && i > 0" :size="24" @click="removeInput(i)"><Delete /></el-icon>
      </div>
      <div class="d-flex flex-grow-1 " >
        <div>
          <el-button  type="info" plain  @click="selectFileToUploader(i)">上传</el-button>
        </div>
        <template v-if="v.queueItem">
        <div class="flex-grow-1">
          <el-progress  :text-inside="true" :stroke-width="32"
                        :percentage="v.queueItem.chunksCompletedPercent">

              <span class="">{{v.queueItem.chunksCompletedPercent}}%</span>
              <span class="ms-3">{{v.queueItem.file.name}}</span>
          </el-progress>
        </div>
        <div >
          <el-link class="ms-3" v-if="!!v.queueItem.url" target="_blank" :href="v.queueItem.url"><el-icon :size="28"><View /></el-icon></el-link>

        </div>
        </template>
      </div>

    </div>
    <div>
      <el-button v-if="multiple"  type="info" plain size="small" @click="addInput">添加文件</el-button>
    </div>

  </div>


</template>
