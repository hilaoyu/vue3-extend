<template>
    <el-pagination
        background
        :size="size"
        @update:size-change="handleSizeChange"
        @update:current-change="handleCurrentChange"
        :current-page="pager.current_page"
        :page-sizes="pageSizes"
        :page-size="pager.per_page"
        :layout="pageLayout"
        :total="pager.total">
    </el-pagination>
</template>

<script lang="ts" setup>
import {defineExpose, defineProps, getCurrentInstance, ref, PropType} from 'vue';
import {Utils} from "js-utils";
const {proxy, ctx} = getCurrentInstance()
const props = defineProps({
  size: {
    type:String as PropType<'large' | 'default' | 'small'>,
    default:"default"
  },
  dataPager: Object,
  pageSizes: {
    type: Array,
    default: function (){
      return [
        10,
        50,
        100,
        200
      ]
    }
  },
  pageCount: {
    type: Number,
    default: 11,
  },
  pageLayout: {
    type: String,
    default: "total, sizes, prev, pager, next,jumper",
  },
  ajaxCallback: {
    type: Function,
    default: null
  },
})

const pager = ref(props.dataPager)

const handleSizeChange = (val) => {
  pager.value.per_page = val
  if(Utils.typeIs('function',props.ajaxCallback)){
    props.ajaxCallback(pager.value)
    return
  }
  window.location.href = Utils.buildUrl(window.location.href,{per_page:val})
}
const handleCurrentChange = (val) => {
  pager.value.current_page = val
  if(Utils.typeIs('function',props.ajaxCallback)){
    props.ajaxCallback(pager.value)
    return
  }
  window.location.href = Utils.buildUrl(window.location.href,{pager_page:val})
}

const getCurrentPage = ()=>{
  return pager.value
}

defineExpose({
  getCurrentPage
})

</script>
