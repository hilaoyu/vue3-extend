import passwordView from './components/passwordViewComponent.vue'
import copyView from './components/copyViewComponent.vue'

import inputCaptchaSms from './components/captcha/inputCaptchaSmsComponent.vue'
import inputCaptchaEmail from './components/captcha/inputCaptchaEmailComponent.vue'
import inputCaptchaImage from './components/captcha/inputCaptchaImageComponent.vue'

import formAuthLoginAccount from './components/auth/formAuthLoginAccountComponent.vue'
import formAuthLoginEmail from './components/auth/formAuthLoginEmailComponent.vue'
import formAuthLoginMobile from './components/auth/formAuthLoginMobileComponent.vue'
import formAuthLogin from './components/auth/formAuthLoginComponent.vue'
import formAuthLogOut from './components/auth/formAuthLogoutComponent.vue'
import formAuthUserChangPass from './components/auth/formAuthUserChangPassComponent.vue'
import menuAuth from './components/auth/menuAuthComponent.vue'
import pagination from './components/pagination/paginationComponent.vue'

import listVariablesEntities from './components/variables/listVariablesEntitiesComponent.vue'
import variableFormItemValue from './components/variables/variableFormItemValueComponent.vue'

import inputXcfsFile from './components/files/inputXcfsFileComponent.vue'
import inputRichEditorWithXcfs from './components/files/inputRichEditorWithXcfsComponent.vue'

function extendComponentsRegister(vueApp){
    vueApp.component('password-view', passwordView);
    vueApp.component('copy-view', copyView);

    vueApp.component('input-captcha-sms', inputCaptchaSms);
    vueApp.component('input-captcha-email', inputCaptchaEmail);
    vueApp.component('input-captcha-image', inputCaptchaImage);

    vueApp.component('form-auth-login-account', formAuthLoginAccount);
    vueApp.component('form-auth-login-email', formAuthLoginEmail);
    vueApp.component('form-auth-login-mobile', formAuthLoginMobile);
    vueApp.component('form-auth-login', formAuthLogin);
    vueApp.component('form-auth-logout', formAuthLogOut);
    vueApp.component('form-auth-user-chang-pass', formAuthUserChangPass);
    vueApp.component('menu-auth', menuAuth);
    vueApp.component('pagination', pagination);

    vueApp.component('list-variables-entities', listVariablesEntities);
    vueApp.component('variable-form-item', variableFormItemValue);

    vueApp.component('input-xcfs-file', inputXcfsFile);
    app.component('input-rich-editor-with-xcfs', inputRichEditorWithXcfs);


}

export default extendComponentsRegister

