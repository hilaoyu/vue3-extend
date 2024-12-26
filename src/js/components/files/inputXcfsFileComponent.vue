<script setup lang="ts">
import {defineProps, getCurrentInstance,  ref,onMounted} from 'vue';
import { Uploader, Utils,type fileQueueItem} from 'js-utils';

const {proxy, ctx} = getCurrentInstance()

const props = defineProps({
  generateTokenCallback:{
    type:Function,
    default:() => {
      return Promise.reject("generateTokenCallback 必传")
    }
  },
  previewUrlCallback:{
    type:Function,
    default:null
  },
  dataValue:{
    type:Array,
    default:() => {
      return []
    }
  },
  multiple:{
    type:Boolean,
    default:false
  },
  dataButtonText:{
    type:String,
    default:"上传"
  },
  disabled:{
    type:Boolean,
    default:false
  },
  readonly:{
    type:Boolean,
    default:false
  },

})
const emits = defineEmits<{
  change: [values: Array<string>] // named tuple syntax
  finished: [values: Array<string>]
}>()

const uploader = new Uploader("", true)

//设置上传线程
uploader.setLimitMaxThreads(5)

//设置错误信息显示回调
uploader.setEventOnError(function (err:Error) {
  proxy.$message.error(err.message)
})


const fileQueue = ref<Array<{value:string,canceled:Boolean,queueItem:fileQueueItem|null}>>([])
//设置队列变化时的回调方法，在队列中文件状态发生变化时会触发
uploader.setEventOnFileQueueChange(function (queue, changedIndex) {
  queue.forEach(function (queueItem){
    if(Utils.valueGet(fileQueue.value,queueItem.customId + '.canceled',false)){
      return
    }

    fileQueue.value[queueItem.customId].queueItem = queueItem
    if (queueItem.uploadCompleted){
      fileQueue.value[queueItem.customId].value = queueItem.url
    }
  })
  handleOnInputChange()
})

const preview = (uri) => {
  if (Utils.isEmpty(uri)) {
    return;
  }
  let _this = this;
  if (Utils.typeIs('function', props.previewUrlCallback)) {
    return props.previewUrlCallback(uri)
  }
  Utils.linkClick(uri,"_blank")
  return
}

const getInputValues = () => {
  let values = []
  fileQueue.value.forEach(function (fq){
    if ("" != fq.value){
      values.push(fq.value)
    }
  })
  return values
}

uploader.setEventOnUploadFinished(function (){
  emits("finished",getInputValues())
})

const handleOnInputChange =() =>{
  emits("change",getInputValues())
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

    uploader.selectFile(props.multiple,!props.multiple,valueIndex)
  }).catch(function (err){
    proxy.$message.error(err.message)
  })


}

const addInput = ()=>{
  fileQueue.value.push({
    canceled:false,
    value:"",
    queueItem:null
  })
}
const removeInput = (index) => {
  fileQueue.value.splice(index,1)
  handleOnInputChange()
}

const cancelUpload = (index)=> {
  if (fileQueue.value.length <= index) {
    return
  }

  fileQueue.value[index].canceled = true

  if (!!fileQueue.value[index].queueItem) {
    uploader.fileQueueRemove(fileQueue.value[index].queueItem.taskId)
    fileQueue.value[index].queueItem = null
  }
  /*fileQueueRefreshed = false
  nextTick(function () {
    fileQueueRefreshed = true
  })*/
}


onMounted(function (){

})


if(Utils.typeIs('array',props.dataValue) && props.dataValue.length > 0){
  if(props.multiple){
    fileQueue.value = [{
      canceled:false,
      value:props.dataValue[0],
      queueItem:null
    }]
  }else{
    props.dataValue.forEach(function (v){
      fileQueue.value.push({
        canceled:false,
        value:v,
        queueItem:null
      })
    })
  }

}else{
  fileQueue.value = [{
    canceled:false,
    value:"",
    queueItem:null
  }]
}

</script>


<template>
  <div class="w-100">
    <div class="d-flex"  v-for="(v,i) in fileQueue">
      <div>
        <el-input v-model="fileQueue[i].value" :readonly="readonly" :disabled="disabled" @change="handleOnInputChange">
          <template v-slot:prepend>
            <el-button @click="preview(fileQueue[i].value)">
              <el-icon :size="16"><View /></el-icon>
            </el-button>
          </template>
          <template v-slot:append>
            <el-button   @click="selectFileToUploader(i)">{{ dataButtonText }}</el-button>
          </template>
        </el-input>
      </div>

      <div style="width:24px" class=" me-2">
        <el-icon style="cursor: pointer;" class="text-danger mt-1" v-if="multiple && i > 0" :size="24" @click="removeInput(i)"><Delete /></el-icon>
      </div>
      <div class="d-flex flex-grow-1 " >

        <template v-if="fileQueue[i].queueItem">
        <div class="flex-grow-1">
          <el-progress  :text-inside="true" :stroke-width="32"
                        :percentage="fileQueue[i].queueItem.chunksCompletedPercent">

              <span class="">{{fileQueue[i].queueItem.chunksCompletedPercent}}%</span>
              <span class="ms-3">{{fileQueue[i].queueItem.file.name}}</span>
          </el-progress>
        </div>
        <div >
          <el-icon :size="24" class="mt-1" v-if="fileQueue[i].queueItem.uploadCompleted"  @click="cancelUpload(i)" style="cursor: pointer;" ><CircleClose /></el-icon>
        </div>
        </template>
      </div>

    </div>
    <div>
      <el-button v-if="multiple"  type="info" plain size="small" @click="addInput">添加文件</el-button>
    </div>

  </div>


</template>
