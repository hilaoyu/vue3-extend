<script lang="ts" setup>
import Utils from "../../services/utils";
import axios from "../../services/axios";
import {defineProps, getCurrentInstance, nextTick, ref} from 'vue';

const props = defineProps({
  formLabelWidth: {type: String, default: "100px"},
  dataEntities: Array,
  dataSearch: Object,
  dataPager: Object,
  apiRoutes: Object,
  fileDisk: String,
})
const {proxy, ctx} = getCurrentInstance()
const formData = ref(Object.values(props.dataEntities))
const refreshed = ref(true)



const addItem = () => {
  formData.value.push({
    name: '',
    type: '',
    key: '',
    value: [''],
    remark: '',
  })
}
const addValue = (value) => {
  value.push('')
}
const removeValue = (value, index) => {
  refreshed.value = false
  value.splice(index, 1)
  nextTick(function () {
    refreshed.value = true
  })
}


const saveItem = (item) => {
  let apiSave = Utils.valueGet(props.apiRoutes, 'save')

  if (apiSave) {
    axios.apiRequest(apiSave, item).then(function (res_data) {
      proxy.$message.success('保存成功')
      window.location.reload()
    })
  }
}
const deleteItem = (item) => {
  let apiDelete = Utils.valueGet(props.apiRoutes, 'delete')

  if (apiDelete) {
    axios.apiRequest(apiDelete, item).then(function (res_data) {
      proxy.$message.success('删除成功')
      window.location.reload()
    })
  }
}


</script>

<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">


    </div>
    <div>
      <el-form size="small">
        <el-row class="mb-2">
          <el-col :span="3" :xs="4">
            名称
          </el-col>
          <el-col :span="3" :xs="4">
            键
          </el-col>
          <el-col :span="5" :xs="6">
            值类型
          </el-col>
          <el-col :span="12" :xs="8">
            内容
          </el-col>
          <!--<el-col :span="5" :xs="4">
            备注
          </el-col>-->
          <el-col :span="1" :xs="2">
          </el-col>
        </el-row>
        <template v-for="(item,index) in formData">

          <el-row class="mb-3 pb-3 border-bottom">
            <el-col :span="3" :xs="6">
              <el-form-item label="">
                <el-input v-model="item.name" :disabled="!!item.required"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" :xs="6">
              <el-form-item label="">
                <el-input v-model="item.key" :disabled="!!item.required"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5" :xs="10">
              <div class="d-flex">
                <el-form-item label="" class="flex-grow-1">
                  <el-select v-model="item.type" :disabled="!!item.required">
                    <el-option label="普通值" value="normal"></el-option>
                    <el-option label="图片/文件" value="file"></el-option>
                    <el-option label="多行文本" value="textarea"></el-option>
                    <el-option label="富文本" value="text_rich"></el-option>
                  </el-select>

                </el-form-item>
                <el-form-item label="">
                  <el-checkbox v-model="item.is_multi" :true-label="1" :false-label="0" :disabled="!!item.required"
                               border>多值
                  </el-checkbox>

                </el-form-item>
              </div>
            </el-col>

            <el-col :span="10" :xs="10">
              <template v-if="refreshed">
                <el-row v-for="(value,i) in (item.value||[])" :key="i">
                  <el-col :span="20">
                    <variable-form-item :type="item.type" :value="value" v-on:val_change="(v)=>{item.value[i]=v}">

                    </variable-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="">
                      <el-button v-if="!!item.is_multi" size="small" class="text-danger"
                                 @click="removeValue(item.value,i)">
                        <el-icon>
                          <Minus/>
                        </el-icon>
                      </el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>

              <el-button v-if="!!item.is_multi" size="small" type="primary" @click="addValue(item.value)">添加
              </el-button>


            </el-col>
            <!--<el-col :span="5" :xs="4">
              <el-form-item  label="" >
                <el-input v-model="item.remark" ></el-input>
              </el-form-item>
            </el-col>-->
            <el-col :span="3" :xs="6">
              <el-form-item label="">
                <el-button v-if="!item.required" size="small" type="danger" @click="deleteItem(item)">
                  <el-icon>
                    <Minus/>
                  </el-icon>
                </el-button>
                <el-button type="primary" size="small" @click="saveItem(item)">保存</el-button>

              </el-form-item>
            </el-col>
          </el-row>
        </template>


        <div class="clearfix">
          <el-button size="small" type="primary" native-type="button" @click="addItem">添加</el-button>
        </div>


      </el-form>
    </div>


    <div class="d-flex justify-content-end">
      <div class="pager" >
        <pagination :data-pager="dataPager" small>

        </pagination>
      </div>
    </div>

  </el-card>
</template>
