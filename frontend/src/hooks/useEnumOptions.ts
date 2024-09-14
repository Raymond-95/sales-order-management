import { ref } from 'vue';
import { getEnums } from '@/services/apis/salesOrderService';

export function useEnumOptions() {
  const statuses = ref<string[]>([]);
  const categories = ref<string[]>([]);
  const countries = ref<string[]>([]);

  const fetchEnumOptions = async () => {
    try {
      const response = await getEnums();
      statuses.value = response.status;
      categories.value = response.category;
      countries.value = response.country;
    } catch (error) {
      console.error('Error fetching enum options:', error);
    }
  };

  return {
    statuses,
    categories,
    countries,
    fetchEnumOptions,
  };
}
