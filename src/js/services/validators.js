const Validator = {
    patternMobile: /^(\+?86)?1[3456789]{1}\d{9}$/,
    patternEmail: /^\w+([-\.]\w+)*@\w+([\.-]\w+)*\.\w{2,4}$/,
    patternPasswordStrong: /^.*(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/,//不少于8位 大写字母,小写字母,数字至少各一个
    validateMobile: function(rule, value, callback) {
        if (!Validator.patternMobile.test(value)) {
            callback(new Error('手机号码错误'));
        } else {
            callback();
        }
    },
    validateEmail: function(rule, value, callback) {
        if (! Validator.patternEmail.test(value)) {
            callback(new Error('邮箱错误'));
        } else {
            callback();
        }
    },
    validatePasswordStrong: function(rule, value, callback){
        if (! Validator.patternPasswordStrong.test(value)) {
            callback(new Error('密码太简单，最少8位 大小写字母数字组合'));
        } else {
            callback();
        }
    }
}
export default Validator
