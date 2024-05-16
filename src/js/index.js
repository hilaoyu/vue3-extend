"use strict";


import {setAxiosGlobalMessageHandle} from "./services/axios";

import('./services/prototypes');
import jquery from 'jquery'
window.jQuery = jquery
import ElementUI,{ ElMessage } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import VueClipboard from 'vue-clipboard3'
window._copyText = VueClipboard().toClipboard
import extendComponentsRegister from './extend-components-register'
import { createApp ,nextTick,getCurrentInstance} from 'vue/dist/vue.esm-bundler'
window.vueNextTick = nextTick
window.vueGetCurrentInstance = getCurrentInstance
window.$windowReload = function (){
    window.location.reload()
}

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
export function creatExtendApp(rootComponent,rootProps) {
    const app = createApp(rootComponent,rootProps)
    app.config.globalProperties.$copyText = VueClipboard().toClipboard
    app.config.globalProperties.$windowReload = function () {
        window.location.reload();
    }
    app.config.globalProperties.$joinToString = function (obj, glue) {
        return Utils.joinToString(obj, glue)
    }
    app.use(ElementUI, { locale: zhCn });


    extendComponentsRegister(app)
    return app
}
