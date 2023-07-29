import { defineStore } from "pinia";
import type { CategortState } from "./interface";
//请求
import { reqC1, reqC2, reqC3 } from "@/api/product/attr/index";

import type { CategoryArr } from "@/api/product/attr/type";
const useCategoryStore = defineStore("Category", {
  state: (): CategortState => ({
    c1Arr: [],
    c1Id: "",
    c2Arr: [],
    c2Id: "",
    c3Arr: [],
    c3Id: "",
  }),
  actions: {
    async getC1() {
      //获取一级分类的数据
      let result: CategoryArr = await reqC1();
      //将数据保存到仓库中
      this.c1Arr = result;
    },
    //获取二级分类的数据
    async getC2() {
      let result: CategoryArr = await reqC2(this.c1Id);
      this.c2Arr = result;
    },
    //获取三级分类的数据
    async getC3() {
      let result = await reqC3(this.c2Id);
      this.c3Arr = result;
    },
  },
});

export default useCategoryStore;
