import {AxiosRequestConfig} from "axios";

export  interface ApiAuthStatic{
	 login(api : AxiosRequestConfig | object ,data:object): Promise<Object>;
	 checkLogin(api :AxiosRequestConfig | object): Promise<Object>;
	 logout(api : AxiosRequestConfig | object): Promise<Object>;
}
declare const ApiAuth:ApiAuthStatic
export default ApiAuth