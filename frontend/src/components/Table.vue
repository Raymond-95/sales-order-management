<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SortImage from '../assets/sort.png'

interface Props {
  headers: string[]
  dataList: Record<string, any>[]
}

const { headers, dataList } = defineProps<Props>()
const sortedDataList = ref<Record<string, any>[]>([...dataList] || [])
const sortDirection = ref<'asc' | 'desc'>('asc')
const currentSortKey = ref<string | null>(null)

// Computed property to format headers
const formattedHeaders = computed(() =>
  headers.map((header) => header.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase())
)

const handleSort = (headerKey: string) => {
  if (currentSortKey.value === headerKey) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortDirection.value = 'asc'
    currentSortKey.value = headerKey
  }

  const dataKey = headerKey
    .toLowerCase()
    .split(' ')
    .map(
      (word, index) =>
        index === 0
          ? word // Keep the first word in lowercase
          : word.charAt(0).toUpperCase() + word.slice(1) // Capitalize subsequent words
    )
    .join('')

  const newSortedDataList = sortedDataList.value.sort((a, b) => {
    const aValue = a[dataKey]
    const bValue = b[dataKey]

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection.value === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection.value === 'asc' ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  sortedDataList.value = [...newSortedDataList]
}

// Watch for changes to props.dataList and update sortedDataList accordingly
watch(
  () => dataList,
  (newDataList) => {
    sortedDataList.value = [...newDataList]
  },
  { deep: true }
)
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="(header, index) in formattedHeaders" :key="index" @click="handleSort(header)">
          {{ header }}
          <img :src="SortImage" width="10" />
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(data, rowIndex) in sortedDataList" :key="rowIndex">
        <td v-for="(header, colIndex) in headers" :key="colIndex">
          {{ data[header] }}
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
</style>
