// Type definitions for src/js/services/storage.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace StorageUtil{
	// StorageUtil.serializeValue.!0
	
	/**
	 * 
	 */
	interface SerializeValue0 {
	}
}
declare namespace StorageUtil{
	// StorageUtil.setLeServiceRoute.!ret
	
	/**
	 * 
	 */
	interface SetLeServiceRouteRet {
	}
}

/**
 * 
 */
declare namespace StorageUtil{
		
	/**
	 * 
	 * @param value 
	 * @return  
	 */
	function serializeValue(value : StorageUtil.SerializeValue0): string;
		
	/**
	 * 
	 * @param value 
	 */
	function unSerializeValue(value : any): void;
		
	/**
	 * 
	 * @param key 
	 * @param value 
	 * @return  
	 */
	function sessionSet(key : string, value : any): boolean;
		
	/**
	 * 
	 * @param key 
	 */
	function sessionGet(key : string): void;
		
	/**
	 * 
	 * @param key 
	 * @return  
	 */
	function sessionRemove(key : string): boolean;
		
	/**
	 * 
	 * @return  
	 */
	function sessionClear(): boolean;
		
	/**
	 * 
	 * @param key 
	 * @param value 
	 * @return  
	 */
	function localSet(key : string, value : /* StorageUtil.setLeServiceRoute.!ret */ any): boolean;
		
	/**
	 * 
	 * @param key 
	 */
	function localGet(key : string): void;
		
	/**
	 * 
	 * @param key 
	 * @return  
	 */
	function localRemove(key : string): boolean;
		
	/**
	 * 
	 * @return  
	 */
	function localClear(): boolean;
		
	/**
	 * 
	 */
	function setClientSource(): void;
		
	/**
	 * 
	 */
	function getClientSource(): void;
		
	/**
	 * 
	 * @return  
	 */
	function removeClientSource(): boolean;
		
	/**
	 * 
	 * @param user 
	 * @param token 
	 */
	function saveAuthInfo(user : any, token : any): void;
		
	/**
	 * 
	 */
	function clearAuthInfo(): void;
		
	/**
	 * 
	 * @param key 
	 * @param defaultValue 
	 */
	function getAuthUser(key : any, defaultValue : any): void;
		
	/**
	 * 
	 * @param key 
	 * @param defaultValue 
	 */
	function getAuthToken(key : any, defaultValue : any): void;
		
	/**
	 * 
	 * @return  
	 */
	function getLeServiceRoutes(): /* StorageUtil.serializeValue.!0 */ any;
		
	/**
	 * 
	 * @param routes 
	 * @return  
	 */
	function setLeServiceRoutes(routes : /* StorageUtil.setLeServiceRoute.!ret */ any): /* StorageUtil.setLeServiceRoute.!ret */ any;
		
	/**
	 * 
	 * @param routeName 
	 * @param route 
	 * @return  
	 */
	function setLeServiceRoute(routeName : any, route : any): StorageUtil.SetLeServiceRouteRet;
		
	/**
	 * 
	 */
	function clearLeServiceRoutes(): void;
}
