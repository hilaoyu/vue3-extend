import {App, Component, CreateAppFunction} from "@vue/runtime-core";
import {UtilsStatic} from "./services/utils";
import {ValidatorStatic} from "./services/validators";
import {StorageUtilStatic} from "./services/storage";
import {AxiosExStatic} from "./services/axios";
import {AxiosRequestConfig} from "axios";
export function setUssEsm(v: boolean): void;
export declare function creatExtendApp<HostElement> (rootComponent?: Component, rootProps?: Record<string, unknown> | null) : App<HostElement>
export declare var Utils:UtilsStatic
export declare var Validator:ValidatorStatic
export declare var StorageUtil:StorageUtilStatic
export declare var axios:AxiosExStatic
export declare function  setAxiosGlobalMessageHandle(callback: CallableFunction): void
export declare function  setAxiosGlobalLoadingServiceHandle(callback: CallableFunction): void
export declare function  buildAxiosRequestConfig(reqConfig : AxiosRequestConfig | Object | string ,data ?: object,headers ?: object,method ?: string):AxiosRequestConfig