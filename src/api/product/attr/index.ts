//引入二次封装axios
import request from "@/utils/request";
//引入接口类型
import type { CategoryArr, Attrs, Attr } from "./type/index";
//枚举地址
enum API {
  C1_URL = "/admin/product/getCategory1",
  C2_URL = "/admin/product/getCategory2/",
  C3_URL = "/admin/product/getCategory3/",
  GETATTRLIST_URL = "/admin/product/attrInfoList/",
  ADDORUPDATEATTR_URL = "/admin/product/saveAttrInfo",
  DELETEATTR_URL = "/admin/product/deleteAttr",
}
//一级分类的接口
export const reqC1 = () => request.get<any, CategoryArr>(API.C1_URL);
//二级分类的接口
export const reqC2 = (category1Id: number | string) =>
  request.get<any, CategoryArr>(API.C2_URL + category1Id);
//三级分类的接口
export const reqC3 = (category2Id: number | string) =>
  request.get<any, CategoryArr>(API.C3_URL + category2Id);
//获取平台属性与属性值(三级分类的)
export const reqAttrList = (
  category1Id: number | string,
  category2Id: number | string,
  category3Id: number | string
) =>
  request.get<any, Attrs>(
    API.GETATTRLIST_URL + `${category1Id}/${category2Id}/${category3Id}`
  );
//添加新的与更新已有的属性接口
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADDORUPDATEATTR_URL, data);

//删除属性接口
export const reqDeleteAttr = (attrId: number | string) => {
  return request.delete<any, any>(API.DELETEATTR_URL + `/${attrId}`);
};
