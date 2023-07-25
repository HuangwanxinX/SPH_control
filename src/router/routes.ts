import type { RouteRecordRaw } from 'vue-router';
/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      hidden：        是否隐藏此路由
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

/**
 * 静态路由（默认路由）
 */
export const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    }
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      hidden: true
    }
  },

  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: '首页',//决定菜单标题 
        icon: 'ele-HomeFilled', //决定菜单前面图标
        hidden: false,//决定菜单显示与隐藏
      }
    }]
  },

  /* 匹配任意的路由 必须最后注册 */
  {
    path: '/:pathMatch(.*)',
    name: 'Any',
    redirect: '/404',
    meta: {
      hidden: true
    }
  }
  ,
  {
    //路径
    path: '/product',
    //组件
    component: () => import('@/layout/index.vue'),
    //命名路由
    name: 'Product',
    //决定当前一级路由左侧导航标题与图表与隐藏
    meta: {
      title: '商品管理',
      icon: 'ele-Goods'
    },
    children: [
      {
        path: 'trademark',
        component: () => import('@/views/product/trademark/index.vue'),
        name: "Trademark",
        meta: {
          title: '品牌管理',
          icon: 'ele-CreditCard'
        }
      },
      {
        path: 'attr',
        component: () => import('@/views/product/attr/index.vue'),
        name: "Attr",
        meta: {
          title: '平台属性管理',
          icon: 'ele-TakeawayBox'
        }
      },
      {
        path: 'spu',
        component: () => import('@/views/product/spu/index.vue'),
        name: "Spu",
        meta: {
          title: 'SPU管理',
          icon: 'ele-Drizzling'
        }
      },
      {
        path: 'sku',
        component: () => import('@/views/product/sku/index.vue'),
        name: "Sku",
        meta: {
          title: 'SKU管理',
          icon: 'ele-ChromeFilled'
        }
      }
    ]
  }
];

