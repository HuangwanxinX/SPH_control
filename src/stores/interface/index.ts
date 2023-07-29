import type { RouteRecordRaw } from "vue-router";

// 用户信息包括权限数据
export interface UserInfoState {
  token: string;
  avatar: string;
  name: string;
  menuRoutes: RouteRecordRaw[]; // 用于生成导航菜单的路由列表
}

import type { CategoryArr } from "@/api/product/attr/type";
//分类的小仓库state对象的ts类型
export interface CategortState {
  c1Arr: CategoryArr;
  c1Id: number | string;
  c2Arr:CategoryArr,
  c2Id:number|string,
  c3Arr:CategoryArr,
  c3Id:number|string,
}
