//vue-router提供组合式API函数
import { createRouter, createWebHistory } from 'vue-router';
import { staticRoutes } from '@/router/routes';
//创建路由器对象,可以管理多个路由
const router = createRouter({
  //模式的设置:history
  history: createWebHistory(),
  //路由器管理的路由
  routes: staticRoutes,
  //滚动行为
  scrollBehavior() {
    return { top: 0, left: 0 }
  },
})
// 导出路由器
export default router;