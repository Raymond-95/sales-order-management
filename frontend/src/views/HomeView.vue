<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Table from '../components/Table.vue';
import FilterModal from '../components/FilterModal.vue';
import type { Filteration } from '../typings/Filteration';
import type { FilterOptions } from '../typings/FilterOptions';
import type { SalesOrder, SalesOrderHeaders } from '../typings/SalesOrder';

const router = useRouter();

const isModalOpened = ref(false);
const initialSalesOrderList = ref<SalesOrder[]>([]);
const salesOrderList = ref<SalesOrder[]>([]);
const tableHeaders = ref<SalesOrderHeaders>([]);
const filterOptions = ref<FilterOptions>({
  status: [],
  category: [],
  customerName: [],
  country: [],
});

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

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
    const response = await axios.get(`${apiBaseUrl}/salesOrders`);

    initialSalesOrderList.value = response.data;

    tableHeaders.value = Object.keys(initialSalesOrderList.value[0]).filter(
      (header) => header !== 'categoryGroup',
    ) as SalesOrderHeaders;

    // Load filters from session storage
    loadFiltersFromSessionStorage();
  } catch (error) {
    console.error('Error fetching sales orders:', error);
  }
};

// Load filters from session storage
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

const fetchFilterOptions = async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/filterOptions`);
    filterOptions.value = response.data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
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
  const filteredSalesOrders = initialSalesOrderList.value.filter(
    (salesOrder) => {
      // filter by created date range
      const isValidFromDate = filters.createdDateRange.from !== '';
      const isValidToDate = filters.createdDateRange.to !== '';
      const createdDate = new Date(salesOrder.createdDate);
      const fromDate = new Date(filters.createdDateRange.from);
      const toDate = new Date(filters.createdDateRange.to);

      const isWithinDateRange =
        (!isValidFromDate && !isValidToDate) ||
        (isValidFromDate &&
          isValidToDate &&
          createdDate >= fromDate &&
          createdDate <= toDate) ||
        (isValidFromDate && !isValidToDate && createdDate >= fromDate) ||
        (!isValidFromDate && isValidToDate && createdDate <= toDate);

      // filter by customer name
      const isMatchingCustomerName = salesOrder.customerName.includes(
        filters.customerName,
      );

      // filter by status
      const isMatchingStatus =
        filters.status.length === 0 ||
        filters.status.includes('All') ||
        filters.status.includes(salesOrder.status);

      // filter by category
      const isMatchingCategory =
        filters.category.length === 0 ||
        filters.category.includes('All') ||
        filters.category.includes(salesOrder.categoryGroup);

      // filter by country
      const isMatchingCountry =
        filters.country === '' || salesOrder.country === filters.country;

      // return true if all criteria match
      return (
        isWithinDateRange &&
        isMatchingCustomerName &&
        isMatchingStatus &&
        isMatchingCategory &&
        isMatchingCountry
      );
    },
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
    <div class="action-container">
      <button @click="showFilterModal">filter</button>
    </div>

    <FilterModal
      :isOpen="isModalOpened"
      :onModalClosed="hideFilterModal"
      :filterOptions="filterOptions"
      :applyFilter="applyFilter"
    />

    <Table :headers="tableHeaders" :data-list="salesOrderList" />

    <div class="action-container action-footer-container">
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
