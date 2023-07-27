<template>
  <el-card class="box-card">
    <template #header>
      <el-button class="el-button el-button--primary" @click="add">
        添加
      </el-button>
      <el-badge
        :value="trademarkList.length"
        class="item"
        type="primary"
        style="margin: 0 20px"
      >
        <el-button
          type="primary"
          size="default"
          :icon="Download"
          @click="exportToExcel(trademarkList, 'excel')"
          >导出此页数据</el-button
        >
      </el-badge>

      <el-dialog
        v-model="centerDialogVisible"
        :title="trademark.id ? '修改品牌' : '添加品牌'"
        width="50%"
      >
        <el-form
          :rules="rules"
          ref="ruleFormRef"
          label-width="120px"
          class="demo-ruleForm"
          status-icon
          :model="trademark"
        >
          <el-form-item
            prop="tmName"
            ref="item"
            class="eeeinput"
            label="品牌名称"
          >
            <el-input width="60%" v-model="trademark.tmName" />
          </el-form-item>
          <el-form-item label="品牌LOGO" prop="logoUrl">
            <el-upload
              class="avatar-uploader"
              action="/app-dev/admin/product/fileUpload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="trademark.logoUrl"
                :src="trademark.logoUrl"
                class="avatar"
              />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="centerDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="eidt"> Confirm </el-button>
          </span>
        </template>
      </el-dialog>
    </template>
    <el-table :data="trademarkList" border style="width: 100%">
      <el-table-column prop="id" label="序号" width="80" />
      <el-table-column prop="tmName" label="品牌名称" />
      <el-table-column prop="logoUrl" label="品牌LOGO">
        <template v-slot="scope">
          <img :src="scope.row.logoUrl" style="height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="Operations">
        <template #default="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
            :icon="Edit"
          ></el-button>
          <el-popconfirm
            title="你确定要删除吗?"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button size="small" type="danger" :icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="currentPage1"
      v-model:page-size="pageSize1"
      :page-sizes="[3, 5, 7]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout=" prev, pager, next, jumper,->,total, sizes"
      :total="total"
      @size-change="getData"
      @current-change="getData"
      :prev-icon="ArrowLeftBold"
      :next-icon="ArrowRightBold"
    />
  </el-card>
</template>
<script lang="ts" setup>
import {
  Plus,
  Download,
  ArrowLeftBold,
  ArrowRightBold,
  Edit,
  Delete,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import type { UploadProps } from "element-plus";
import { onMounted, reactive, ref, nextTick } from "vue";
import { reqaddorUpdata, reqtrademark, reqdelete } from "@/api/trademark";
import * as XLSX from "xlsx/xlsx.mjs";
// 这种引入方式会报错
// import XLSX from 'xlsx'

const currentPage1 = ref(1);
const pageSize1 = ref(3);
const small = ref(false);
const background = ref(true);
const disabled = ref(false);
const centerDialogVisible = ref(false);
//from表单
const ruleFormRef = ref();
const item = ref();

let trademark = reactive({
  id: 0,
  tmName: "",
  logoUrl: "",
});
let trademarkList = ref([]);
// let trademarkList1 = reactive([])
let total = ref(0);
const rules = reactive({
  tmName: [
    { required: true, message: "请输入品牌名称" },
    { min: 2, max: 10, message: "长度在 2 到 10 个字符" },
  ],
  logoUrl: [{ required: true, message: "请上传品牌LOGO", trigger: "blur" }],
});
onMounted(() => {
  getData();
});
const handleAvatarSuccess: UploadProps["onSuccess"] = (response) => {
  trademark.logoUrl = response.data;
};
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (
    !(
      rawFile.type == "image/png" ||
      rawFile.type == "image/gif" ||
      rawFile.type == "image/jpeg"
    )
  ) {
    ElMessage.error("Avatar picture must be JPG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  return true;
};
const getData = async () => {
  let result = await reqtrademark(currentPage1.value, pageSize1.value);
  // reactive数据不能直接赋值
  // trademarkList1.splice(0, trademarkList.length, ...result.records)
  trademarkList.value = result.records;
  total.value = result.total;
};
const handleDelete = async (a: any, b: any) => {
  await reqdelete(b.id);
  getData();
};
const handleEdit = async (a: any, b: any) => {
  centerDialogVisible.value = true;
  trademark.id = b.id;
  trademark.tmName = b.tmName;
  trademark.logoUrl = b.logoUrl;
  nextTick(() => {
    ruleFormRef.value.clearValidate("tmName");
    ruleFormRef.value.clearValidate("logoUrl");
  });
};
const eidt = async () => {
  try {
    await ruleFormRef.value.validate();
    try {
      if (!trademark.id) {
        currentPage1.value = 1;
      }
      await reqaddorUpdata(trademark);
      ElMessage({
        type: "success",
        message: trademark.id ? "修改成功" : "添加成功",
      });
      getData();
      centerDialogVisible.value = false;
    } catch (error) {
      ElMessage({
        type: "error",
        message: trademark.id ? "修改失败" : "添加失败",
      });
    }
  } catch (error) {
    ElMessage({
      type: "error",
      message: "验证失败",
    });
  }
};
const add = () => {
  centerDialogVisible.value = true;
  trademark.id = 0;
  trademark.tmName = "";
  trademark.logoUrl = "";
  nextTick(() => {
    ruleFormRef.value.clearValidate("logoUrl");
  });
  setTimeout(() => {
    ruleFormRef.value.clearValidate("tmName");
  }, 50);
};
const exportToExcel = (data: any, fileName: any) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // 导出 Excel 文件
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
</script>

<style scoped>
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}

.eeeinput .el-input {
  width: 60%;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

:deep(.el-dialog) {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0 !important;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
