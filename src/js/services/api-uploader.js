import LeRoute from './le-route';
import Axios from './axios';
import Utils from './utils';
import LeStorage from "./le-storage";
import th from "element-ui/src/locale/lang/th";

function WebUploader() {
    this.isReady = false;
    this.apis = {
        upload: '',
        task_add: '',
        task_get: '',
        task_complete: '',
    };
    this.urlAbsolute = false;
    this.uploader = null;
    this.limitExts = function (){
        return Utils.valueGet(this.apis,'limit_exts',[])
    };
    this.limitSize = function (){
        return Utils.valueGet(this.apis,'limit_size',0)
    };
    this.limitTip = function (){
        return Utils.valueGet(this.apis,'limit_tip',"")
    };
    this.init = function () {
        let _this = this;
        let _fileSingleSizeLimit = _this.limitSize();
        let _accept = {};
        let _limitExts = _this.limitExts();
        if(!Utils.isEmpty(_limitExts)){
            _accept.extensions = Utils.joinToString(_limitExts,',',false)
        }
        Axios.messageHandle = _this.messageHandle ;
        Utils.timeCountDown(180, null, function () {
            if (window.WebUploader) {
                _this.uploader = new window.WebUploader.Uploader({
                    server: Utils.valueGet(_this.apis, 'upload', ''),
                    fileVal: 'upload_file',
                    accept: _accept,
                    fileSingleSizeLimit: _fileSingleSizeLimit > 0 ? _fileSingleSizeLimit : false,
                    /*formData: {
                     task_id: taskId
                     },*/
                    // 开起分片上传。
                    compress: false,
                    chunked: true,
                    chunkSize: 1024 * 1024,
                    chunkRetry: 3,
                    auto: true,
                    duplicate: true,
                    fileNumLimit: false
                })
                    .on('error', function (err_type) {
                        var msg = '上传错误:' + err_type;
                        if (err_type == 'Q_TYPE_DENIED') {
                            msg = '文件类型错误';
                        } else if (err_type == 'F_EXCEED_SIZE') {
                            msg = '文件总大小超出限制 ';
                        } else if (err_type == 'Q_EXCEED_SIZE_LIMIT') {
                            msg = '单个文件大小超出限制';
                        }
                        _this.messageHandle(msg, 'error');

                    })
                    .on('beforeFileQueued', function (file) {
                        _this.onBeforeFileQueued(file)
                    })
                    .on('fileQueued', function (file) {
                        _this.uploader.makeThumb(file, function (error, ret) {

                            if (error) {
                                file.thumb = '';
                            } else {
                                file.thumb = ret;
                            }
                            //console.log(file)
                            _this.onFileQueued(file)

                        });
                    })
                    .on('fileDequeued', function (file) {
                        _this.onFileDequeued(file)
                    })
                    .on('uploadBeforeSend', function (object, data, headers) {

                        headers['X-Requested-With'] = 'XMLHttpRequest';
                        headers['apiToken'] = LeStorage.getAuthToken('id', '')
                        data['task_id'] = Utils.valueGet(object, 'file.source.source.upload_task.id');
                        //console.log(object,data,headers);
                        _this.onUploadBeforeSend(object, data, headers)
                    })
                    .on('uploadStart', function (file) {
                        _this.onUploadStart(file);
                    })
                    .on('uploadAccept', function (object, res) {

                        let reStatus = Utils.valueGet(res, 'status', false);
                        if (!reStatus) {
                            let msg = Utils.valueGet(res, 'message', '上传错误')

                            _this.messageHandle(msg, 'error');
                            _this.uploader.cancelFile(object.file)
                            return
                        }

                        //debugger
                        //let percent = res.data.chunks_completed_percent || 0;


                        _this.onUploadAccept(object, res);
                    })
                    .on('uploadProgress', function (file, percentage) {
                        let percent = parseInt(percentage * 10000) / 100;
                        _this.onUploadProgress(file, percent)

                    })

                    .on('uploadSuccess', function (file, res) {
                        var reStatus = res.status || false;
                        var reMessage = res.message || (reStatus ? '上传成功' : '上传失败');

                        if (!reStatus) {
                            _this.messageHandle(file.name + reMessage, 'error')
                            return
                        } else {

                        }
                        //console.log(data);
                        Axios.post(Utils.valueGet(_this.apis, 'task_complete', ''), {
                            id: Utils.valueGet(res, 'data.id', ''),
                            url_absolute: _this.urlAbsolute ? '1' : '0',
                        })
                            .then(function (cres) {
                                var reStatus = cres.status || false;
                                var reMessage = cres.message || (reStatus ? '上传成功' : '上传失败');
                                if (!reStatus) {
                                    _this.messageHandle(file.name + reMessage, 'error')
                                    return
                                }
                                _this.messageHandle(file.name + reMessage, 'success')

                                _this.onUploadSuccess(file, cres)
                            });
                    })
                    .on('uploadComplete', function (file) {
                        _this.onUploadComplete(file)

                    })
                    .on('uploadFinished', function () {
                        _this.uploader.reset();
                        _this.onUploadFinished()
                    })
                    .on('uploadError', function (file, reason, a, b, c) {
                        _this.messageHandle(file.name + '上传失败', 'error')
                        _this.onUploadError(file, reason)
                    });

                _this.isReady = true;
                return true;
            }
        });

        if(this.isReady){
            this.onUploaderReady(this);
        }
    };
    this.onUploaderReady = function (uploader){};
    this.addUploadQueue = function (file, successCallback, failedCallback) {
        let _this = this;
        Axios.post(Utils.valueGet(_this.apis, 'task_add', ''), {
            disk: _this.fileDisk,
        })
            .then(function (res) {
                var taskStatus = res.status || false;
                var taskId = res.data.id || false;

                if (!taskStatus || !taskId) {
                    _this.messageHandle('请求上传任务失败', 'error');

                    if (Utils.typeIs('function', failedCallback)) {
                        failedCallback(file, res)
                    }
                    return false;
                }

                file.upload_task = res.data;
                _this.uploader.addFiles(file);

                if (Utils.typeIs('function', successCallback)) {
                    successCallback(file, res)
                }
                //console.log(_this.uploadQueue);
            })
            .catch(function (error) {
                _this.removeUploadQueue(file)
                if (Utils.typeIs('function', failedCallback)) {
                    failedCallback(file)
                }
            });
    };
    this.removeUploadQueue = function (file) {
        file = file || '';
        if (file) {
            this.cancelFile(file);
        }
    };
    this.addFiles = function (files) {
        this.uploader.addFile(files);
    };
    this.cancelFile = function (file) {
        this.uploader.cancelFile(file);
    };
    this.startUpload = function () {
        this.uploader.upload();
    };
    this.stopUpload = function (force) {
        this.uploader.stop(force);
    };
    this.reset = function (force) {
        this.uploader.reset();
    };
    this.messageHandle = function (msg, type) {
        if(Utils.typeIs('function',window._extendMessageHandle)){
            return window._extendMessageHandle(msg,type)
        }
        alert(msg);
    }
    this.onBeforeFileQueued = function (file) {
    };
    this.onFileQueued = function (file) {
    };
    this.onFileDequeued = function (file) {
    };
    this.onUploadBeforeSend = function (object, data, headers) {
    };
    this.onUploadStart = function (file) {
    };
    this.onUploadAccept = function (object, res) {
    };
    this.onUploadProgress = function (file, percentage) {
    };
    this.onUploadSuccess = function (file, res) {
    };
    this.onUploadComplete = function (file) {
    };
    this.onUploadFinished = function (file) {
    };
    this.onUploadError = function (file) {
    };


}


function createUploaderForDisk(fs_disk, urlAbsolute) {
    let uploader = new WebUploader();
    uploader.urlAbsolute = !!urlAbsolute
    LeRoute.quiet().request('api.l-e-s.files.uploader', {
        disk: fs_disk
    }).then(function (res) {
        let reStatus = Utils.valueGet(res, 'status', false);
        uploader.apis = Utils.valueGet(res, 'data', {});
        if (!reStatus || Utils.isEmpty(uploader.apis)) {
            return
        }
        uploader.init();
    })
    return uploader;
}

function createUploaderForApi(api, urlAbsolute, method) {
    let uploader = new WebUploader();
    uploader.urlAbsolute = !!urlAbsolute
    method = method || 'GET';

    Axios.quiet().request({
        url: api,
        method: method
    }).then(function (res) {
        let reStatus = Utils.valueGet(res, 'status', false);
        uploader.apis = Utils.valueGet(res, 'data', {});
        if (!reStatus || Utils.isEmpty(uploader.apis)) {
            return
        }
        uploader.init();
    })
    return uploader;
}

const ApiUploader = {
    createUploaderForDisk: createUploaderForDisk,
    createUploaderForApi: createUploaderForApi,
}

export default ApiUploader

export {createUploaderForDisk, createUploaderForApi}

