//pinia提供创建小仓库的方法
import { defineStore } from "pinia";
//引入你们公司自己的真实的接口
import { reqdelete, reqtrademark } from "@/api/user";

export const useTrademarkStore = defineStore("Trademark", {
  state: () => ({
    trademarkList: [],
    total: 0,
  }),
  actions: {
    async getTrademarkList(page: number, limit: number) {
      let result = await reqtrademark(page, limit);

      this.trademarkList = result.records;
      this.total = result.total;
    },
    async deleteTrademark(id: string) {
      try {
        await reqdelete(id);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
