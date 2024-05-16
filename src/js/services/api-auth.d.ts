import {AxiosRequestConfig} from "axios";

declare namespace ApiAuth{

	function login(api : AxiosRequestConfig | object ,data:object): Promise<Object>;
	function checkLogin(api :AxiosRequestConfig | object): Promise<Object>;
	function logout(api : AxiosRequestConfig | object): Promise<Object>;
}

export default ApiAuth