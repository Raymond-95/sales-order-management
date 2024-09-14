import { ref } from 'vue';
import { getFilterOptions } from '@/services/apis/salesOrderService';
import type { FilterOptions } from '@/typings/FilterOptions';

export const useFilterOptions = () => {
  const filterOptions = ref<FilterOptions>({
    status: [],
    category: [],
    customerName: [],
    country: [],
  });

  const fetchFilterOptions = async () => {
    try {
      const result = await getFilterOptions();
      filterOptions.value = result;
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  return {
    fetchFilterOptions,
    filterOptions,
  };
};
