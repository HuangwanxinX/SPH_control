<template>
  <el-card>
    <!-- 三级分类表单的结构 -->
    <el-form :inline="true">
      <div>
        <el-form-item label="一级分类">
          <!-- 表单项当中下拉菜单 -->
          <el-select
            v-model="categoryStore.c1Id"
            @change="handler"
            :disabled="scene ? true : false"
          >
            <el-option
              v-for="(c1, index) in categoryStore.c1Arr"
              :key="c1.id"
              :label="c1.name"
              :value="c1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <!-- 表单项当中下拉菜单 -->
          <el-select
            @change="handler2"
            v-model="categoryStore.c2Id"
            :disabled="scene ? true : false"
          >
            <el-option
              v-for="(c2, index) in categoryStore.c2Arr"
              :key="c2.id"
              :label="c2.name"
              :value="c2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <!-- 表单项当中下拉菜单 -->
          <el-select
            v-model="categoryStore.c3Id"
            :disabled="scene ? true : false"
          >
            <el-option
              v-for="(c3, index) in categoryStore.c3Arr"
              :key="c3.id"
              :label="c3.name"
              :value="c3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import useCategoryStore from "@/stores/category";
const categoryStore = useCategoryStore();
onMounted(() => {
  categoryStore.getC1();
});
const handler = () => {
  categoryStore.c3Arr = [];
  categoryStore.c2Id = "";
  categoryStore.c3Id = "";
  categoryStore.getC2();
};
const handler2 = () => {
  categoryStore.c3Arr = [];
  categoryStore.c3Id = "";
  categoryStore.getC3();
};

//组件销毁:路由切换了
onUnmounted(() => {
  //重置仓库:仓库数据清空
  categoryStore.$reset();
});
defineProps(["scene"]);
</script>

<style scoped></style>
