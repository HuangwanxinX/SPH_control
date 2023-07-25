//pinia提供创建小仓库的方法
import { defineStore } from "pinia";
//仓库数据的对象的ts类型
import type { UserInfoState } from "./interface";
//持久化存储仓库的数据:token
import { getToken, removeToken, setToken } from "../utils/token-utils";
//消息提示框
import { ElMessage } from "element-plus";
//项目的配置全部的路由的数组
import { staticRoutes } from "@/router/routes";
//引入你们公司自己的真实的接口
import { reqLogin } from "@/api/user";
//登录接口的ts类型
import type { UserLoginResponseData } from "@/api/user/type";
import { reqUserInfo, reqlogout } from "@/api/user/index";
//分别暴露获取用户相关的仓库
export const useUserInfoStore = defineStore("userInfo", {
  state: (): UserInfoState => ({
    token: getToken() as string,
    name: "",
    avatar: "",
    menuRoutes: [], //决定左侧菜单到底显示哪些
  }),
  actions: {
    //登录方法
    async login(username: string, password: string) {
      let result: UserLoginResponseData = await reqLogin({
        username,
        password,
      });
      //本地存储持久化存储token
      setToken(result.token);
      //pinia仓库存储token
      this.token = result.token;
    },
    //获取用户信息
    async getInfo() {
      let result = await reqUserInfo();
      this.name = result.name;
      this.avatar = result.avatar;
      this.menuRoutes = staticRoutes;
    },
    //退出登录
    reset() {
      // 向服务发送请求,让服务器删除token
      reqlogout();
      // 删除local中保存的token
      removeToken();
      // 提交重置用户信息的mutation
      this.token = "";
      this.name = "";
      this.avatar = "";
    },
  },
});
