import { ref } from 'vue';
import type { SalesOrder } from '@/typings/SalesOrder';

export const useSalesOrderForm = (initialData?: SalesOrder) => {
  const formRef = ref({
    customerName: initialData?.customerName || '',
    status: initialData?.status || '',
    category: initialData?.category || '',
    country: initialData?.country || '',
  });

  const isFormValuesValid = () => {
    if (!formRef.value.customerName) {
      alert('Customer name is required');
      return false;
    }
    if (!formRef.value.status) {
      alert('Status is required');
      return false;
    }
    if (!formRef.value.category) {
      alert('Category is required');
      return false;
    }
    if (!formRef.value.country) {
      alert('Country is required');
      return false;
    }
    return true;
  };

  return { formRef, isFormValuesValid };
};
