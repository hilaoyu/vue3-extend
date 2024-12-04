
<script setup lang="ts">
import { defineProps, ref,getCurrentInstance,nextTick} from 'vue';
import {Utils} from "js-utils";
const props =defineProps({
  dataFile: {
    type: [Object, String],
    default: () => {
      return {
        url: '',
        type: '',
        name: '',
        is_encoded: false,
      }
    }
  },
  defaultType: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  viewInfo: {
    type: Boolean,
    default: false
  },
  width: {
    type: [Number, String],
    default: () => {
      return ''
    }
  },
  height: {
    type: [Number, String],
    default: () => {
      return ''
    }
  },

})
const { proxy, ctx } = getCurrentInstance()
const dialogViewImageVisible = ref(false)
const currentViewImageSrc = ref('')
const fileObj = ref(null)
const isVideo = ref(false)
const fileViewType = ref('')

const assignFileObj =  (data) => {
  fileObj.value = Object.assign({}, fileObj, data);
  fileViewType.value = props.defaultType;
  nextTick(function (){
    fileViewType.value = Utils.valueGet(fileObj.value,'type',props.defaultType);
  })
}
const viewImage = (src) =>{
  currentViewImageSrc.value = src;
  dialogViewImageVisible.value = true;

}
const buildUrl = (uri, params) => {
  return Utils.buildUrl(uri, params)

}
const getFileName = () =>{
  if (!Utils.isEmpty(props.fileName)) {
    return props.fileName;
  }
  let fileName = Utils.valueGet(fileObj.value, 'name', '');

  if (fileName) {
    return fileName;
  }

  return Utils.baseName(Utils.valueGet(fileObj.value, 'url', ''))
}
const handleViewImageClose = () => {
  currentViewImageSrc.value = '';
  dialogViewImageVisible.value = false;
}

</script>

<template>
  <div class="le-file-view" :style="'width:'+props.width+'px;height:'+props.height+'px'">
    <el-popover
        :disabled="!props.viewInfo"
        placement="right"
        title=""
        width=""
        trigger="hover"
        content="">
      <div v-if="props.viewInfo">
        <span class="le-file-view-name">{{ getFileName() }}</span>
        <el-link
            class="le-file-view-link"
            :href="fileObj.url || ''"
            :download="fileObj.name"
            target="_blank">

          {{ fileObj.is_encoded ?'解密':''}}下载
        </el-link>
      </div>
      <div slot="reference" class="le-file-view-content">

        <el-image
            v-if="'image' == fileViewType"
            :src="buildUrl(fileObj.url || '',{h:height,w:width})"
            :preview-src-list="[fileObj.url || '']"
            :style="'width:'+width+'px;height:'+height+'px'"
            fit="scale-down"

        >
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>

        <video  v-else-if="'video' == fileViewType"
                :src = "fileObj.url || ''"
                :width="props.width"
                :height="props.height"
                controls>

        </video>

        <audio  v-else-if="'audio' == fileViewType"
                :src = "fileObj.url || ''"
                controls>

        </audio>

        <el-link
            v-else
            class="le-file-view-other"
            :href="fileObj.url || ''"
        >

          {{ getFileName() }}
        </el-link>

      </div>
    </el-popover>


    <el-dialog
        title="查看图片"
        :visible.sync="dialogViewImageVisible"
        append-to-body
        destroy-on-close
        :before-close="handleViewImageClose"
        width="90%"
    >
      <img :src="currentViewImageSrc" width="100%">
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogViewImageVisible = false">关闭</el-button>
            </span>
    </el-dialog>
  </div>


</template>
