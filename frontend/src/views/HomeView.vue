<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Table from '@/components/Table.vue';
import FilterModal from '@/components/FilterModal.vue';
import type { Filteration } from '@/typings/Filteration';
import type { SalesOrder, SalesOrderHeaders } from '@/typings/SalesOrder';
import { getSalesOrders } from '@/services/apis/salesOrderService';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import { useSalesOrdersFilter } from '@/hooks/useSalesOrderFilter';

const router = useRouter();
const { fetchFilterOptions, filterOptions } = useFilterOptions();

const isModalOpened = ref(false);
const initialSalesOrderList = ref<SalesOrder[]>([]);
const salesOrderList = ref<SalesOrder[]>([]);
const tableHeaders = ref<SalesOrderHeaders>([]);

const { filterSalesOrders } = useSalesOrdersFilter();

// 1 minute refresh interval
const refreshInterval = 60000;

const refreshPage = () => {
  window.location.reload();
};

// auto-refreshed every minute
onMounted(() => {
  const intervalId = setInterval(refreshPage, refreshInterval);

  onUnmounted(() => {
    clearInterval(intervalId);
  });

  fetchSalesOrders();
  fetchFilterOptions();
});

const fetchSalesOrders = async () => {
  try {
    const result = await getSalesOrders();

    initialSalesOrderList.value = result;
    salesOrderList.value = result;

    tableHeaders.value = Object.keys(initialSalesOrderList.value[0]).filter(
      (header) => header !== 'categoryGroup',
    ) as SalesOrderHeaders;

    // Load filters from session storage
    loadFiltersFromSessionStorage();
  } catch (error) {
    console.error('Error fetching sales orders:', error);
  }
};

// load filters from session storage
const loadFiltersFromSessionStorage = () => {
  try {
    const savedFilters = sessionStorage.getItem('filters');
    if (savedFilters) {
      const filters: Filteration = JSON.parse(savedFilters);
      applyFilter(filters);
    }
  } catch (error) {
    console.error('Error loading filters from sessionStorage: ', error);
  }
};

const showFilterModal = () => {
  isModalOpened.value = true;
};

const hideFilterModal = () => {
  isModalOpened.value = false;
};

const applyFilter = (filters: Filteration) => {
  // filter the list based on filter criteria
  const filteredSalesOrders = filterSalesOrders(
    initialSalesOrderList.value,
    filters,
  );

  // update the list
  salesOrderList.value = [...filteredSalesOrders];
};

const addSalesOrder = () => {
  router.push({ name: 'AddSalesOrder' });
};
</script>

<template>
  <main>
    <!-- show a message if salesOrderList is empty -->
    <div v-if="salesOrderList.length === 0" class="empty-state">
      No sales orders available.
    </div>

    <div class="action-container" v-if="salesOrderList.length > 0">
      <button @click="showFilterModal">filter</button>
    </div>

    <FilterModal
      :isOpen="isModalOpened"
      :onModalClosed="hideFilterModal"
      :filterOptions="filterOptions"
      :applyFilter="applyFilter"
    />

    <!-- render the table if there are sales orders -->
    <Table
      v-if="salesOrderList.length > 0"
      :headers="tableHeaders"
      :data-list="salesOrderList"
    />

    <!-- show the Add button only if there are sales orders -->
    <div
      class="action-container action-footer-container"
      v-if="salesOrderList.length > 0"
    >
      <button @click="addSalesOrder">Add</button>
    </div>
  </main>
</template>

<style scoped>
main {
  background-color: '#ffffff';
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-top: 15px;
}

.action-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.action-footer-container {
  margin-top: 15px;
  margin-bottom: 0px;
}
</style>
