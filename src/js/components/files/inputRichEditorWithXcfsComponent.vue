<script setup lang="ts">
import {defineProps, getCurrentInstance, computed, ref,defineEmits,onMounted} from 'vue';
import {Uploader,Utils,type  fileQueueItem} from 'js-utils';
import "quill/dist/quill.snow.css";
import Quill from "quill/core";
import Toolbar from "quill/modules/toolbar";
import Snow from "quill/themes/snow";

import Header from "quill/formats/header";
import Indent from "quill/formats/indent";

import Bold from "quill/formats/bold";
import Italic from "quill/formats/italic";
import Underline from "quill/formats/underline";
import Strike from "quill/formats/strike";

import List from "quill/formats/list";
import Script from "quill/formats/script";
//import { DirectionAttribute } from "quill/formats/direction";
import {SizeStyle} from "quill/formats/size";

SizeStyle.whitelist = ['0.5rem', '0.75rem', '1rem', '1.25rem', '1.5rem', '1.75rem', '2rem'];
import Blockquote from "quill/formats/blockquote";
import Code from "quill/formats/code";
import {ColorStyle} from "quill/formats/color";
import {BackgroundStyle} from "quill/formats/background";

import Image from "quill/formats/image";
import Video from "quill/formats/video";

Quill.register({
    "modules/toolbar": Toolbar,
    "themes/snow": Snow,

    "formats/header": Header,
    "formats/indent": Indent,

    "formats/bold": Bold,
    "formats/italic": Italic,
    "formats/underline": Underline,
    "formats/strike": Strike,

    "formats/list": List,
    "formats/script": Script,
    "formats/size": SizeStyle,

    //"formats/direction": DirectionAttribute,

    "formats/blockquote": Blockquote,
    "formats/code-block": Code,
    "formats/color": ColorStyle,
    "formats/background": BackgroundStyle,

    'formats/image': Image,
    'formats/video': Video,
});

const toolbarOptions = [
    [{'header': [1, 2, 3, 4, 5, 6, false]}],

    [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    [{'size': [false, '0.5rem', '0.75rem', '1rem', '1.25rem', '1.5rem', '1.75rem', '2rem']}],  // custom dropdown
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

    [{'list': 'ordered'}, {'list': 'bullet'}, {'list': 'check'}],

    ['blockquote', 'code-block', {'script': 'sub'}, {'script': 'super'}],

    //[{ 'direction': 'rtl' }],                         // text direction

    ['link', 'formula', 'image', 'video'],

    [{'color': []}, {'background': []}],          // dropdown with defaults from them

    ['clean']                                         // remove formatting button
];

const {proxy, ctx} = getCurrentInstance()
const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  generateTokenCallback: {
    type: Function,
    default: () => {
      return Promise.reject(new Error("token回调必传"))
    }
  },
  disabled: { //不可编辑
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits<{
  change: [value: string]
}>()

const editorId =  Utils.randomString(32)
const editorValue = ref(props.value)
const uploadTask = ref<fileQueueItem|null>(null)

const uploadHasTask = computed(() => !!uploadTask.value)

const uploader = new Uploader("", true)
//设置上传线程
uploader.setLimitMaxThreads(5)
//设置错误信息显示回调
uploader.setEventOnError(function (err) {
  proxy.$message.error(err.message)
})
uploader.setEventOnFileQueueChange(function (queue, changedIndex) {
  uploadTask.value = Utils.valueGet(queue,'0',null)

})


let quill  = null

onMounted(function (){
  quill = new Quill("#" + editorId, {
    theme: "snow",
    bounds: "#" + editorId + '-container',
    readOnly: props.disabled,
    modules: {
      toolbar: toolbarOptions
    },
  });
  quill.on('editor-change', (eventName, ...args) => {
    emits("change",quill.getSemanticHTML())
  });

  const toolbar = quill.getModule('toolbar');
  toolbar.addHandler('image', selectFileToUploader('image'));
  toolbar.addHandler('video', selectFileToUploader('video'));
})


const selectFileToUploader = function (emType) {

  return function (){
    uploader.setEventOnUploadFinished(uploadFinishedEnevt(emType))

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

      uploader.selectFile(false, true)

    }).catch(function (err) {
      proxy.$message.error(err.message)
    })
  }
}

const uploadFinishedEnevt = function (emType){
  return function (urls) {
    uploadTask.value = null

    if(!quill){
      return
    }

    let url = ""
    if(Utils.typeIs('array',urls) && urls.length > 0){
      url = urls[0]
    }
    if(!!url){
      let range = quill.getSelection();
      let rangeIndex = 0 + (range !== null ? range.index : 0)

      switch (emType){
        case "image":
          quill.insertEmbed(rangeIndex, 'image', url);
          break
        case "video":
          quill.insertEmbed(rangeIndex, 'video', url);
          break
      }
      quill.setSelection(1 + rangeIndex)
    }
  }
}


</script>

<template>
  <div class="m-0 p-0 lin" :id="editorId+'-container'" style="line-height: normal !important;">
    <div :id="editorId" v-html="editorValue"></div>
    <el-dialog
        v-if="uploadTask"
        :title="uploadTask.file.name"
        v-model="uploadHasTask"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        width="50%">
      <div class="d-flex">
        <div class="flex-grow-1">
          <el-progress :text-inside="true" :stroke-width="26" :percentage="uploadTask.chunksCompletedPercent" >
          </el-progress>
        </div>
        <div>
          <i v-if="!uploadTask.uploadCompleted" class="el-icon-circle-close"
             style="cursor: pointer;font-size: 28px" @click="uploadTask.remove()"></i>
        </div>
      </div>

    </el-dialog>
  </div>
</template>