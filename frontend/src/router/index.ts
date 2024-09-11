import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AddSalesOrderView from '@/views/AddSalesOrderView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/addSalesOrder',
      name: 'AddSalesOrder',
      component: AddSalesOrderView
    }
  ]
})

export default router
