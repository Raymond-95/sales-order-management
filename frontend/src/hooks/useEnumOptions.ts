import { ref } from 'vue';
import axios from 'axios';
import type { EnumOptions } from '@/typings/EnumOptions';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export function useEnumOptions() {
  const statuses = ref<string[]>([]);
  const categories = ref<string[]>([]);
  const countries = ref<string[]>([]);

  const fetchEnumOptions = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/enums`);
      const data: EnumOptions = response.data;
      statuses.value = data.status;
      categories.value = data.category;
      countries.value = data.country;
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
