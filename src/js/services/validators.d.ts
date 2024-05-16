
declare namespace Validator{
	function validateMobile(rule : any, value : string, callback : CallableFunction): void;

	function validateEmail(rule : any, value : string, callback : CallableFunction): void;
	function validatePasswordStrong(rule : any, value : string, callback : CallableFunction): void;

}