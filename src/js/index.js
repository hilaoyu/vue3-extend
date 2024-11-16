"use strict";

let useEsm = false

export function setUssEsm(v) {
    useEsm = !!v
}
import axios,{setAxiosGlobalMessageHandle,buildAxiosRequestConfig,setAxiosGlobalLoadingServiceHandle} from "./services/axios";

import('./services/prototypes');
import jquery from 'jquery'
window.jQuery = jquery

import Utils from './services/utils'
import Validator from './services/validators'
import StorageUtil from './services/storage'
import ApiAuth from './services/api-auth'

import ElementUI,{ ElMessage,ElLoading } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueClipboard from 'vue-clipboard3'
window._copyText = VueClipboard().toClipboard
import extendComponentsRegister from './extend-components-register'
import { createApp as createEsmApp } from 'vue/dist/vue.esm-bundler'

import { createApp } from 'vue'


setAxiosGlobalMessageHandle(function (msg,type){
    if('error' === type){
        ElMessage({
            type:"error",
            message:msg ,
            showClose:true
        });
    }else if('success' === type){
        ElMessage({
            type:"success",
            message:msg,
            showClose:true
        });
    }else if('warning' === type){
        ElMessage({
            type:"warning",
            message:msg,
            showClose:true
        });
    }else{
        ElMessage({
            type:"info",
            message:msg,
            showClose:true
        });
    }
})

setAxiosGlobalLoadingServiceHandle(function (){
    return ElLoading.service({
        lock: true,
        text: 'Loading...',
        background: 'rgba(0, 0, 0, 0.7)',
    })
})

function creatExtendApp(rootComponent,rootProps) {
    let app
    if(useEsm){
        app = createEsmApp(rootComponent,rootProps)
    }else{
        app = createApp(rootComponent,rootProps)
    }

    app.config.globalProperties.$copyText = VueClipboard().toClipboard
    app.config.globalProperties.$windowReload = function () {
        window.location.reload();
    }
    app.config.globalProperties.$joinToString = function (obj, glue) {
        return Utils.joinToString(obj, glue)
    }
    app.use(ElementUI, { locale: zhCn });
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }

    extendComponentsRegister(app)
    return app
}


export  {
    creatExtendApp,
    Utils,
    Validator,
    StorageUtil,
    axios,
    setAxiosGlobalMessageHandle,
    setAxiosGlobalLoadingServiceHandle,
    buildAxiosRequestConfig,
    ApiAuth,
}