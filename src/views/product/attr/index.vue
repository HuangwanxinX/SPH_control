<template>
  <div>
    <Category :scene="scene"></Category>
    <!-- 底下将来展示某一个三级分类平台属性与属性值 -->
    <el-card style="margin: 10px 0px">
      <div v-if="scene == 0">
        <el-button
          type="primary"
          size="default"
          :icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addAttr"
          >添加平台属性</el-button
        >
        <!-- table展示平台属性与属性值 -->
        <el-table
          border
          style="margin-top: 10px"
          :data="attrList"
          v-if="attrList.length > 0"
        >
          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            prop="attrName"
            width="150px"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <!-- row:代表即为一个已有的属性对象 -->
            <template #="{ row, $index }">
              <el-tag
                style="margin: 5px"
                class="ml-2"
                :type="attrValue.id % 2 == 0 ? 'success' : 'warning'"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template #="{ row, $index }">
              <el-button type="warning" size="small" :icon="Edit"></el-button>
              <el-button
                type="danger"
                size="small"
                :icon="Delete"
                @click="deleteattr(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-empty
          v-else
          :image-size="400"
          description="暂无数据..."
          image="https://img.soogif.com/CJhQflauuC12jz6ZIaSj85WWlkgdni2T.gif"
        />
      </div>
      <div v-else>
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请输入属性名字"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          size="default"
          :icon="Plus"
          :disabled="!attrParams.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="cancel">取消</el-button>
        <el-table
          :data="attrParams.attrValueList"
          border
          style="margin: 10px 0px"
        >
          <el-table-column
            label="序号"
            width="80px"
            align="center"
            type="index"
          ></el-table-column>
          <el-table-column label="属性值">
            <!-- row:即为一个属性值对象 -->
            <template #="{ row, $index }">
              <el-input
                placeholder="请你输入属性值"
                v-model="row.valueName"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button type="danger" size="small" :icon="Delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          @click="save"
          :disabled="attrParams.attrValueList.length ? false : true"
          >保存</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
//引入图标
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
//引入监听和ref
import { watch, ref, reactive } from "vue";
//引入请求方法
import {
  reqAttrList,
  reqAddOrUpdateAttr,
  reqDeleteAttr,
} from "@/api/product/attr";
//引入ts类型
import type { Attrs, Attr } from "@/api/product/attr/type/index";
//获取分类仓库
import useCategoryStore from "@/stores/category";
const categoryStore = useCategoryStore();
//存储全部已有的属性与属性值
const attrList = ref<Attrs>([]);
const scene = ref<number>(0);
const attrParams = reactive<Attr>({
  attrName: "", //属性的名字
  attrValueList: [], //属性值数组
  categoryId: 0, //三级某一个分类的ID
  categoryLevel: 3, //代表三级分类
});

//获取平台属性方法
const getAttrList = async () => {
  //获取平台属性与属性值
  const { c1Id, c2Id, c3Id } = categoryStore;
  let result: Attrs = await reqAttrList(c1Id, c2Id, c3Id);
  //存储服务器的数据
  attrList.value = result;
};
//监听分类仓库的三级分类id
watch(
  () => categoryStore.c3Id,
  () => {
    //监听到三级分类ID变化上一次存储已有的属性与属性值数组立马情况
    attrList.value = [];
    //调用方法
    categoryStore.c3Id && getAttrList();
  }
);
//添加平台属性按钮回调
const addAttr = () => {
  //清空数组
  reset();
  //场景数值变为1
  scene.value = 1;
  //收集新增属性的三级分类的ID
  attrParams.categoryId = categoryStore.c3Id as number;
};
const reset = () => {
  Object.assign(attrParams, {
    attrName: "", //属性的名字
    attrValueList: [], //属性值数组
    categoryId: 0, //三级某一个分类的ID
    categoryLevel: 3, //代表三级分类
  });
};
//取消按钮的回调
const cancel = () => {
  //场景值为零
  scene.value = 0;
};
//添加属性值按钮回调
const addAttrValue = () => {
  //点击此按钮需要向属性值的数组新增一个属性值对象---table多一行
  attrParams.attrValueList.push({
    valueName: "",
  });
};
const save = async () => {
  //整理参数
  //发请求
  try {
    //添加获取更新成功
    await reqAddOrUpdateAttr(attrParams);
    //提示
    ElMessage({
      type: "success",
      message: attrParams.id ? "更新成功" : "添加成功",
    });
    //切换场景为零
    scene.value = 0;
    //再次获取更新后的全部属性与属性值
    getAttrList();
  } catch (error) {
    ElMessage({
      type: "error",
      message: attrParams.id ? "更新失败" : "添加失败",
    });
  }
  //成功
  //失败
};
//删除attr
const deleteattr = async (row: Attr) => {
  try {
    await reqDeleteAttr(row.id as number).then(() => {
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      getAttrList();
    });
  } catch (error) {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
};
</script>
<script lang="ts">
export default {
  name: "Attr",
};
</script>
<style scoped></style>
