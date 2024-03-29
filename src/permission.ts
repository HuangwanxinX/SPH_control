//引入路由器对象
import router from '@/router'
//进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false });
//获取用户相关的小仓库(token)
import pinia from '@/stores'
import { useUserInfoStore } from '@/stores/userInfo'
const userInfoStore = useUserInfoStore(pinia)
//消息提示框
import { ElMessage } from 'element-plus'
//函数未知
import getPageTitle from './utils/get-page-title'
// 不用进行token检查的白名单路径数组
const whiteList = ['/login']
// 路由加载前
router.beforeEach(async (to, from, next) => {
  //访问路由之前:进度条开始动
  NProgress.start()
  // 设置整个页面的标题
  document.title = getPageTitle(to.meta.title as string)
  //获取小仓库的token,判断是否登录
  const token = userInfoStore.token
  //登录成功
  if (token) {
    // 如果请求的是登陆路由
    if (to.path === '/login') {
      // 直接跳转到根路由, 并完成进度条
      next({ path: '/' })
      NProgress.done()
    } else { // 请求的不是登陆路由
      // 是否已经登陆
      const hasLogin = !!userInfoStore.name
      // 如果已经登陆直接放行
      if (hasLogin) {
        next()
      } else { // 如果还没有登陆
        try {
          // 异步请求获取用户信息(包含权限数据) ==> 动态注册用户的权限路由 => 当次跳转不可见
          await userInfoStore.getInfo()
          next(to) // 重新跳转去目标路由, 能看到动态添加的异步路由, 且不会丢失参数
          NProgress.done() // 结束进度条

        } catch (error: any) { // 如果请求处理过程中出错
          // 重置用户信息
          await userInfoStore.reset()
          // 提示错误信息
          // ElMessage.error(error.message || 'Has Error') // axios拦截器中已经有提示了
          // 跳转到登陆页面, 并携带原本要跳转的路由路径, 用于登陆成功后跳转
          next(`/login?redirect=${to.path}`)
          // 完成进度条
          NProgress.done()
        }
      }
    }
  } else { // 没有token
    // 如果目标路径在白名单中(是不需要token的路径)
    if (whiteList.indexOf(to.path) !== -1) {
      // 放行
      next()
    } else {
      // 如果没在白名单中, 跳转到登陆路由携带原目标路径
      next(`/login?redirect=${to.path}`)
      // 完成进度条  当次跳转中断了, 要进行一个新的跳转了
      NProgress.done()
    }
  }
})

// 路由加载后
router.afterEach(() => {
  //访问进度条结束消失
  NProgress.done();
})
