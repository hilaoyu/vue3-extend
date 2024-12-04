
export  interface StorageUtilStatic {
    serializeValue(value: any): string;

    unSerializeValue(value: any): void;

    sessionSet(key: string, value: any): boolean;

    sessionGet(key: string): void;

    sessionRemove(key: string): boolean;

    sessionClear(): boolean;

    localSet(key: string, value: any): boolean;

    localGet(key: string): void;

    localRemove(key: string): boolean;

    localClear(): boolean;

    setClientSource(): void;

    getClientSource(): void;

    removeClientSource(): boolean;

    saveAuthInfo(user: any, token: any): void;

    clearAuthInfo(): void;

    getAuthUser(key: any, defaultValue: any): void;

    getAuthToken(key: any, defaultValue: any): void;
}
export const StorageUtil:StorageUtilStatic
export default StorageUtil