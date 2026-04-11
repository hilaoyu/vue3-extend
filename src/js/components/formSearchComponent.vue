<script setup lang="ts">
import { reactive,defineExpose} from "vue";
import { Utils} from "js-utils";

const props = defineProps({
  dataSearch: {
    type: [Object, Array],
    default: () => ({})
  },
  size:{
    type: String,
    default: ''
  },
  submitCallback: Function,
  alertSearchData: Function,
});

const formSearchData = reactive({})

// 初始化
for (let field in props.dataSearch) {
  let val = props.dataSearch[field]?.value ?? "";
  if (parseInt(val) == val) val = parseInt(val)
  formSearchData[field] = val;
}

function getSearchData(pager) {
  const data = Object.assign(formSearchData,{  pager_page: pager?.current_page , pager_offset: pager?.per_page })

  if (props.alertSearchData) {
    return props.alertSearchData(data)
  }
  return data;
}
function search(pager) {
  const data = getSearchData(pager)

  if (props.submitCallback) {
    return props.submitCallback(data)
  }

  window.location.href = Utils.buildUrl(window.location.href, data)
}

defineExpose({
  search
})
</script>
<style>
.vue3-extend-form-search .el-input {
  --el-input-width: 220px;
}

.vue3-extend-form-search .el-select {
  --el-select-width: 220px;
}
</style>
<template>
  <el-form :inline="true" :model="formSearchData" :size="size" class="vue3-extend-form-search">
    <template v-for="(item,field) in dataSearch">
      <el-form-item :label="item.label||''" >
        <template v-if="'select'==item.type">
          <el-select v-model="formSearchData[field]" :placeholder="item.label||''">
            <el-option
                v-for="(o,index) in (item.options || [])"
                :key="index"
                :label="o.label"
                :value="o.value">
            </el-option>
          </el-select>
        </template>

        <template v-else-if="'selectGroup'==item.type">
          <el-select v-model="formSearchData[field]" :placeholder="item.label||''" :clearable="item.clearable">
            <el-option-group
                v-for="group in (item.options || [])"
                :key="group.label"
                :label="group.label">
              <el-option
                  v-for="(o,index) in (group.options || [])"
                  :key="index"
                  :label="o.label"
                  :value="o.value">
              </el-option>
            </el-option-group>
          </el-select>
        </template>

        <template v-else-if="'date'==item.type">
          <el-date-picker
              v-model="formSearchData[field]"
              type="date"
              :placeholder="item.label||''"
              align="right"
              size="small"
              :value-format="item.format || 'yyyy-MM-dd'"
          >
          </el-date-picker>
        </template>

        <template v-else-if="'dateTime'==item.type">
          <el-date-picker
              v-model="formSearchData[field]"
              type="datetime"
              :placeholder="item.label||''"
              align="right"
              size="small"
              :value-format="item.format || 'yyyy-MM-dd HH:mm:ss'"
          >
          </el-date-picker>
        </template>

        <template  v-else-if="'dateTimeRange'==item.type">
          <el-date-picker
              v-model="formSearchData[field]"
              type="datetimerange"
              :placeholder="item.label||''"
              align="right"
              size="small"
              :range-separator="item.rangeSeparator || '至'"
              :value-format="item.format || 'yyyy-MM-dd HH:mm:ss'"
          >
          </el-date-picker>
        </template>

        <template v-else>
          <el-input v-model="formSearchData[field]" :placeholder="item.label||''" clearable></el-input>
        </template>

      </el-form-item>
    </template>


    <el-form-item>
      <el-button :size="size" type="primary" @click="search()">搜索</el-button>
    </el-form-item>

    <div class="float-right float-end form-search-append">
      <slot name="append"></slot>
    </div>
  </el-form>
</template>