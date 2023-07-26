//封装用户相关接口-->替换真实的接口
import request from "@/utils/request";
import type { UserParamsType, UserLoginResponseData, UserInfo } from "./type";
//枚举(ts):定义存储项目接口地址
enum API {
  LOGIN_URL = "/admin/acl/index/login",
  USERINFO_URL = "/admin/acl/index/info",
  LOGOUT_URL = "/admin/acl/index/logout",
  TRADEMARK_URL = `/admin/product/baseTrademark/`,
  DELETE_URL = "/admin/product/baseTrademark/remove/",
  ADDORUPDATE_URL = "/admin/product/baseTrademark/",
}
//登录接口
export const reqLogin = (data: UserParamsType) =>
  request.post<any, UserLoginResponseData>(API.LOGIN_URL, data);

//获取用户信息接口
export const reqUserInfo = () => request.get<any, UserInfo>(API.USERINFO_URL);

export const reqlogout = () => request.post<any, any>(API.LOGOUT_URL);

export const reqtrademark = (page: number, limit: number) => {
  return request.get<any, any>(API.TRADEMARK_URL + `${page}/${limit}`);
};
export const reqdelete = (id: string) => {
  return request.delete<any, any>(API.DELETE_URL + `${id}`);
};

export const reqaddorUpdata = (data: any) => {
  if (!data.id) {
    return request.post<any, any>(API.ADDORUPDATE_URL + "save", data);
  } else {
    return request.put<any, any>(API.ADDORUPDATE_URL + "update", data);
  }
};
