<template>
    <el-pagination
        background
        :size="size"
        v-model:current-page="pager.current_page"
        :page-sizes="pageSizes"
        v-model:page-size="pager.per_page"
        :layout="pageLayout"
        :total="pager.total">
    </el-pagination>
</template>

<script lang="ts" setup>
import {defineExpose, defineProps, getCurrentInstance, ref, PropType,watch} from 'vue';
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

watch(
    () => [pager.value.current_page, pager.value.per_page],
    ([page, size], [oldPage, oldSize]) => {
      if (page === oldPage && size === oldSize) return
      if (Utils.typeIs('function', props.ajaxCallback)) {
        props.ajaxCallback(pager.value)
        return
      }
      window.location.href = Utils.buildUrl(window.location.href, {
        per_page: size,
        pager_page: page
      })
    }
)

const getCurrentPage = ()=>{
  return pager.value
}

defineExpose({
  getCurrentPage
})

</script>
