import {AxiosResponse, Axios,AxiosRequestConfig} from "axios/index";


export declare class AxiosExStatic extends Axios {
    useLoading(loadingService: any): AxiosExStatic;

    unUseLoading(): AxiosExStatic;

    tryCloseLoading(): void;

    quiet(isQuiet: boolean): AxiosExStatic;

    setMessageHandle(callback: CallableFunction): AxiosExStatic;

    apiRequest(reqConfig : AxiosRequestConfig):Promise<AxiosResponse>
    apiPost(url : string ,data ?: object,reqConfig ?: AxiosRequestConfig):Promise<AxiosResponse>
    apiPatch(url : string ,data ?: object,reqConfig ?: AxiosRequestConfig):Promise<AxiosResponse>
    apiGet(url : string ,params ?: object,reqConfig ?: AxiosRequestConfig):Promise<AxiosResponse>
    apiDelete(url : string ,params ?: object,reqConfig ?: AxiosRequestConfig):Promise<AxiosResponse>

}


declare const axios: AxiosExStatic

export function setAxiosGlobalMessageHandle(callback: CallableFunction): void;
export function buildAxiosRequestConfig(reqConfig : AxiosRequestConfig | Object | string ,data ?: object,headers ?: object,method ?: string):AxiosRequestConfig

export default axios;