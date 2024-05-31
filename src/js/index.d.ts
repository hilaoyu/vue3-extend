import {App} from "@vue/runtime-dom";
import {UtilsStatic} from "./services/utils";
import {ValidatorStatic} from "./services/validators";
import {StorageUtilStatic} from "./services/storage";
import {AxiosExStatic} from "./services/axios";
import {AxiosRequestConfig} from "axios";
export declare function creatExtendApp(rootComponent ?: string, rootProps ?: any): App<Element>;
export declare var Utils:UtilsStatic
export declare var Validator:ValidatorStatic
export declare var StorageUtil:StorageUtilStatic
export declare var axios:AxiosExStatic
export declare function  setAxiosGlobalMessageHandle(callback: CallableFunction): void
export declare function  buildAxiosRequestConfig(reqConfig : AxiosRequestConfig | Object | string ,data ?: object,headers ?: object,method ?: string):AxiosRequestConfig