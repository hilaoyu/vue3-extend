import axios from './axios'
import Utils from './utils'
import Storage from './storage'
const ApiAuth = {
    login :function (api,data) {

        Storage.setClientSource();

        return axios.apiRequest(api,data)
            .then(function (res_data) {
                let data = Utils.valueGet(res_data, 'data', null)
                let user = Utils.valueGet(data, 'user', null);
                let token = Utils.valueGet(data, 'token', null);
                if (user) {
                    Storage.saveAuthInfo(user, token)
                }
                return data
            })
    },
    checkLogin :function (api) {
        return axios.quiet(true).apiRequest(api)
            .then(function (res_data) {
                let data = Utils.valueGet(res_data, 'data', null)
                let user = Utils.valueGet(data, 'user', null);
                let token = Utils.valueGet(data, 'token', null);
                if (user) {
                    Storage.saveAuthInfo(user, token)
                }
                return data
            }).catch(function (error){
                Storage.clearAuthInfo();
                Storage.removeClientSource();
            });
    },
    logout :function (api) {
        return axios.apiRequest(api)
            .then(function (res_data) {
                Storage.clearAuthInfo();
                Storage.removeClientSource();
                return res_data;
            })
    }
}

export default ApiAuth
