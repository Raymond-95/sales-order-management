<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import SortImage from '../assets/sort.png';
import DotsImage from '../assets/dots.png';
import type { SalesOrder, SalesOrderHeaders } from '../typings/SalesOrder';

interface Props {
  headers: SalesOrderHeaders;
  dataList: SalesOrder[];
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();

const { headers, dataList } = defineProps<Props>();
const sortedDataList = ref<SalesOrder[]>([...dataList] || []);
const sortDirection = ref<'asc' | 'desc'>('asc');
const currentSortKey = ref<string | null>(null);
const showOptionsIndex = ref<number | null>(null);

// Computed property to format headers
const formattedHeaders = computed(() =>
  headers.map((header) =>
    header.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase(),
  ),
);

const handleSort = (headerKey: string) => {
  if (currentSortKey.value === headerKey) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortDirection.value = 'asc';
    currentSortKey.value = headerKey;
  }

  const dataKey = headerKey
    .toLowerCase()
    .split(' ')
    .map(
      (word, index) =>
        index === 0
          ? word // Keep the first word in lowercase
          : word.charAt(0).toUpperCase() + word.slice(1), // Capitalize subsequent words
    )
    .join('') as keyof (typeof sortedDataList.value)[0];

  const newSortedDataList = sortedDataList.value.sort((a, b) => {
    const aValue = a[dataKey];
    const bValue = b[dataKey];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection.value === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection.value === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  sortedDataList.value = [...newSortedDataList];
};

const handleOptionsClick = (index: number) => {
  showOptionsIndex.value = showOptionsIndex.value === index ? null : index;
};

// Watch for changes to props.dataList and update sortedDataList accordingly
watch(
  () => dataList,
  (newDataList) => {
    sortedDataList.value = [...newDataList];
  },
  { deep: true },
);

// Implement handlers for edit and delete actions
const handleEdit = (row: SalesOrder) => {
  router.push({
    name: 'EditSalesOrder',
    query: {
      salesOrder: encodeURIComponent(JSON.stringify(row)),
    },
  });
};

const handleDelete = async (row: SalesOrder) => {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete the order for ${row.customerName}?`,
  );
  if (!confirmDelete) return;

  try {
    // Assuming you have an API endpoint like `/api/salesOrders/:id`
    await axios.delete(`${apiBaseUrl}/salesOrder/${row.orderId}`);

    // Remove the deleted row from the data list
    sortedDataList.value = sortedDataList.value.filter(
      (item) => item.orderId !== row.orderId,
    );
  } catch (error) {
    console.error('Error deleting the sales order:', error);
    alert('Failed to delete the sales order');
  }
};
</script>

<template>
  <table>
    <thead>
      <tr>
        <th
          v-for="(header, index) in formattedHeaders"
          :key="index"
          @click="handleSort(header)"
        >
          {{ header }}
          <img :src="SortImage" width="10" />
        </th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(data, rowIndex) in sortedDataList" :key="rowIndex">
        <td v-for="(header, colIndex) in headers" :key="colIndex">
          {{ data[header as keyof typeof data] }}
        </td>
        <td>
          <img
            :src="DotsImage"
            width="20"
            @click="handleOptionsClick(rowIndex)"
            style="cursor: pointer"
          />
          <div v-if="showOptionsIndex === rowIndex" class="options-menu">
            <button @click="handleEdit(data)">Edit</button>
            <button @click="handleDelete(data)">Delete</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  white-space: nowrap;
  font-weight: bold;
}

th,
td {
  padding: 8px;
  border: 1px solid black;
  text-align: left;
  white-space: nowrap;
}

thead {
  background-color: #f2f2f2;
}

.options-menu {
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  z-index: 1;
}

.options-menu button {
  display: block;
  margin: 5px 0;
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.options-menu button:hover {
  background-color: #0056b3;
}

td {
  position: relative;
}
</style>
