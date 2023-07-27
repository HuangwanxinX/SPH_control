import request from "@/utils/request";

enum API {
    TRADEMARK_URL = `/admin/product/baseTrademark/`,
  DELETE_URL = "/admin/product/baseTrademark/remove/",
  ADDORUPDATE_URL = "/admin/product/baseTrademark/",}
  
//trademark模块  
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