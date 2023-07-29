//引入createApp创建应用的实例对象
import { createApp } from "vue";
//pinia仓库(大仓库:三个小仓库,选择式API)
import pinia from "./stores";

//element-plusUI组件库
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
//引入根组件
import App from "./App.vue";
//创建App应用实例
const app = createApp(App);
//引入路由
import router from "./router";
//引入全局样式
import "./styles/index.scss";
//路由鉴权文件
import "./permission";
//将图标全部引入,注册为全局组件
import ElSvg from "./components/SvgIcon/ElSvg";

import Category from "./components/Category/index.vue";
app.component("Category", Category);
ElSvg(app);
app
  .use(pinia)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount("#app");
