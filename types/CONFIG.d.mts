export default CONFIG;
declare namespace CONFIG {
    export { CONNECTION_CONFIG };
    export { REDIS_KEY_PREFIX as KEY_PREFIX };
}
export const SERVICE: string;
declare namespace CONNECTION_CONFIG {
    export { REDIS_AUTH as password };
    export namespace tls {
        function checkServerIdentity(): any;
    }
}
declare const REDIS_KEY_PREFIX: string;
declare const REDIS_AUTH: string;
