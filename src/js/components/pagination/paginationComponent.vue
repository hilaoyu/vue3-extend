<template>
    <el-pagination
        background
        :small="small"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pager.current_page"
        :page-sizes="pageSizes"
        :page-size="pager.per_page"
        :layout="pageLayout"
        :total="pager.total">
    </el-pagination>
</template>

<script lang="ts" setup>
import {defineProps, getCurrentInstance, ref, watch} from 'vue';
import Utils from "../../services/utils";
const {proxy, ctx} = getCurrentInstance()
const props = defineProps({
  small: Boolean,
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


</script>
