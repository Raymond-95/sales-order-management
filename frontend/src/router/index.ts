import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AddSalesOrderView from '@/views/AddSalesOrderView.vue';
import EditSalesOrderView from '@/views/EditSalesOrderView.vue';
import type { SalesOrder } from '@/typings/SalesOrder';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/addSalesOrder',
      name: 'AddSalesOrder',
      component: AddSalesOrderView,
    },
    {
      path: '/editSalesOrder',
      name: 'EditSalesOrder',
      component: EditSalesOrderView,
      props: (route) => {
        const salesOrderQuery = route.query.salesOrder as string;
        const salesOrder: SalesOrder = salesOrderQuery
          ? JSON.parse(decodeURIComponent(salesOrderQuery))
          : ({} as SalesOrder);

        return {
          salesOrder,
        };
      },
    },
  ],
});

export default router;
