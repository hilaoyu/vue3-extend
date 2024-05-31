
export  interface ValidatorStatic {
    validateMobile(rule: any, value: string, callback: CallableFunction): void;

    validateEmail(rule: any, value: string, callback: CallableFunction): void;

    validatePasswordStrong(rule: any, value: string, callback: CallableFunction): void;
}
declare const Validator:ValidatorStatic
export default Validator
