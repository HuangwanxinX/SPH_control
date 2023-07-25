<template>
  <div class="login-container">
    <el-form ref="formRef" :model="loginForm" :rules="loginRules" class="login-form">
      <div class="title-container">
        <h3 class="title">尚品汇后台管理</h3>
      </div>
      <!-- 账号表单 -->
      <el-form-item prop="username">
        <span class="svg-container">
          <!-- svg图表封装为全局组件 -->
          <svg-icon name="ele-UserFilled" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请你输入账号"
          name="username"
        />
      </el-form-item>
      <!-- 密码表单 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon name="ele-Lock" />
        </span>
        <el-input
          :key="passwordType"
          ref="passwordRef"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请你输入密码"
          name="password"
          @keyup.enter="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :name="passwordType === 'password' ? 'ele-Hide' : 'ele-View'" />
        </span>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px; height: 40px"
        @click.prevent="handleLogin"
        >登 陆</el-button
      >
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { useUserInfoStore } from "@/stores/userInfo";
import type { FormInstance } from "element-plus";
import { nextTick, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
//用户相关的仓库
const userInfoStore = useUserInfoStore();
//获取路由对象
const route = useRoute();
//路由器
const router = useRouter();
//收集表单的数据:账号与密码
const loginForm = ref({
  username: "admin",
  password: "111111",
});
//控制登录按钮小菊花的效果
const loading = ref(false);
//控制密码表单元素的类型:text->password
const passwordType = ref("password");
//存储query参数
const redirect = ref("");
//获取密码表单元素实例
const passwordRef = ref<HTMLInputElement>();
//获取form表单组件实例
const formRef = ref<FormInstance>();

//校验用户的名字
const validateUsername = (rule: any, value: any, callback: any) => {
  //rule:规则对象
  //value:当前表单文本内容
  //callBack放行函数
  if (value.length < 4) {
    callback(new Error("用户名长度不能小于4位"));
  } else {
    callback();
  }
};
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value.length < 6) {
    callback(new Error("密码长度不能小于6位"));
  } else {
    callback();
  }
};

//表单校验之自定义校验规则
//required:次字段务必校验
//trigger:触发的时机 blur失去焦点  change:文本发生变化 validator:自定校验规则
const loginRules = {
  username: [{ required: true, validator: validateUsername }],
  password: [{ required: true, validator: validatePassword }],
};

//监听路由
watch(
  route,
  () => {
    redirect.value = route.query && (route.query.redirect as string);
  },
  { immediate: true } //上来立即监听一次
);

/* 
切换密码的显示/隐藏
*/
const showPwd = () => {
  //密码框的类型切换
  passwordType.value = passwordType.value === "password" ? "text" : "password";
  //当响应式数据发生变化的时候获取更新后的DOM
  //获取的密码的表单元素聚焦
  nextTick(() => {
    passwordRef.value?.focus();
  });
};

/* 
点击登陆的回调
*/
const handleLogin = async () => {
  //通过form组件实例的方法,校验两个表单项是否全部通过校验
  await formRef.value?.validate();
  //控制小菊花开始转动
  loading.value = true;
  //收集登录需要参数
  const { username, password } = loginForm.value;
  try {
    //发起登录请求
    await userInfoStore.login(username, password);
    //如果登录成功:跳转到首页|曾经想去二没有去成的那个地方
    router.push({ path: redirect.value || "/" });
  } finally {
    //小菊花关闭
    loading.value = false;
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.login-container {
  background-image: url(../../assets/bg.jpg);
  background-color: #2d3a4b;
  background-size: cover;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    .el-input__wrapper {
      width: 100%;
      background-color: transparent;
      box-shadow: none;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100vw;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
