import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/popup.html',
    name: 'popup',
    component: HomeView
  },
  {
    path: '/createwallet',
    name: 'create',
    component: () => import(/* webpackChunkName: "about" */ '../views/CreateWalletView.vue')
  },  
  {
    path: '/importwallet',
    name: 'import',
    component: () => import(/* webpackChunkName: "about" */ '../views/ImportWalletView.vue')
  },     
  {
    path: '/chainstats',
    name: 'chainstats',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ChainStatsView.vue')
  },  
  {
    path: '/auth',
    name: 'auth',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AuthView.vue')
  },
  {
    path: '/tx',
    name: 'tx',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited. 
    component: () => import(/* webpackChunkName: "about" */ '../view/tx/App.vue')
  },
  {
    path: '/connect.html',
    name: 'connect',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../view/connect/App.vue')
  }   
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
