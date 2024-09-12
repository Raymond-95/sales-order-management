<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { useEnumOptions } from '@/hooks/useEnumOptions'; // Import the composable
import type { SalesOrder } from '@/typings/SalesOrder';

// Accept props from parent component
const { salesOrder } = defineProps<{
  salesOrder: SalesOrder;
  statuses: string[];
  categories: string[];
  countries: string[];
}>();

const router = useRouter();
const route = useRoute();

// Destructure enum options from the composable
const { statuses, categories, countries, fetchEnumOptions } = useEnumOptions();

// Call the API to fetch enum options when the component is mounted
onMounted(() => {
  fetchEnumOptions();
});

// Create form based on the salesOrder prop
const form = ref({
  customerName: salesOrder.customerName || '',
  status: salesOrder.status || '',
  category: salesOrder.category || '',
  country: salesOrder.country || '',
});

// Validation for each field
const validateForm = () => {
  if (!form.value.customerName) {
    alert('Customer name is required');
    return false;
  }
  if (!form.value.status) {
    alert('Status is required');
    return false;
  }
  if (!form.value.category) {
    alert('Category is required');
    return false;
  }
  if (!form.value.country) {
    alert('Country is required');
    return false;
  }
  return true;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Handle form submission
const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  const salesOrderId = salesOrder.orderId;

  try {
    await axios.put(`${apiBaseUrl}/salesOrders/${salesOrderId}`, form.value, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    alert('Sales order updated successfully');
    router.push({ name: 'Home' });
  } catch (error) {
    console.error('Error updating sales order:', error);
    alert('Error updating sales order');
  }
};
</script>

<template>
  <div class="edit-sales-order">
    <h1>Edit Sales Order</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="customer-name">
          Customer Name: <span class="required-asterisk">*</span>
        </label>
        <input
          id="customer-name"
          v-model="form.customerName"
          type="text"
          required
        />
      </div>

      <div class="form-group">
        <label for="status">
          Status: <span class="required-asterisk">*</span>
        </label>
        <select id="status" v-model="form.status" required>
          <option value="">Select Status</option>
          <option v-for="status in statuses" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="category">
          Category: <span class="required-asterisk">*</span>
        </label>
        <select id="category" v-model="form.category" required>
          <option value="">Select Category</option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="country">
          Country: <span class="required-asterisk">*</span>
        </label>
        <select id="country" v-model="form.country" required>
          <option value="">Select Country</option>
          <option v-for="country in countries" :key="country" :value="country">
            {{ country }}
          </option>
        </select>
      </div>

      <button type="submit">Update Sales Order</button>
    </form>
  </div>
</template>

<style scoped>
.edit-sales-order {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.required-asterisk {
  color: red;
}
</style>
