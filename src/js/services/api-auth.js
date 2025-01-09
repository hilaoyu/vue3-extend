import {axios,Utils,StorageUtil} from 'js-utils'

export const ApiAuth = {
    login :function (api,data) {

        StorageUtil.setClientSource();

        return axios.apiRequest(api,data)
            .then(function (res_data) {
                let data = Utils.valueGet(res_data, 'data', null)
                let user = Utils.valueGet(data, 'user', null);
                let token = Utils.valueGet(data, 'token', null);
                if (user) {
                    StorageUtil.saveAuthInfo(user, token)
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
                    StorageUtil.saveAuthInfo(user, token)
                }
                return data
            }).catch(function (error){
                StorageUtil.clearAuthInfo();
                StorageUtil.removeClientSource();
            });
    },
    logout :function (api) {
        return axios.apiRequest(api)
            .then(function (res_data) {
                StorageUtil.clearAuthInfo();
                StorageUtil.removeClientSource();
                return res_data;
            })
    }
}

export default ApiAuth
