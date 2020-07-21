import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const ROUTER_404 = [
  { path: '*', redirect: '/404', hidden: true }
]

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index'),
    hidden: true,
    meta: { title: 'Login' }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404'),
    hidden: true,
    meta: { title: '404' }
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const routerInstance = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  routerInstance.matcher = newRouter.matcher // reset router
}

export default routerInstance
