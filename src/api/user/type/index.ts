//登录接口需要携带的参数ts类型
export interface UserParamsType{
       username:string,
       password:string
}
//登录接口返回的数据的ts类型
export interface UserLoginResponseData{
    token:string
}

export interface UserInfo {
    "routes": string[],
    "buttons": string[],
    "roles": string[],
    "name": string,
    "avatar": string
}
