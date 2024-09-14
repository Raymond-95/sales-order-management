<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useEnumOptions } from '@/hooks/useEnumOptions';
import { useSalesOrderForm } from '@/hooks/useSalesOrderForm';
import { addSalesOrder } from '@/services/apis/salesOrderService';

const router = useRouter();

const { formRef, isFormValuesValid } = useSalesOrderForm();

const { statuses, categories, countries, fetchEnumOptions } = useEnumOptions();

// call the API to fetch enum options when the component is mounted
onMounted(() => {
  fetchEnumOptions();
});

const submitForm = async () => {
  if (!isFormValuesValid()) {
    return;
  }

  try {
    await addSalesOrder(formRef.value);

    alert('Sales order added successfully');

    router.push({ name: 'Home' });
  } catch (error) {
    console.error('Error adding sales order:', error);
    alert('Error adding sales order');
  }
};
</script>

<template>
  <div class="add-sales-order">
    <h1>Add Sales Order</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="customer-name">
          Customer Name: <span class="required-asterisk">*</span>
        </label>
        <input
          id="customer-name"
          v-model="formRef.customerName"
          type="text"
          required
        />
      </div>

      <div class="form-group">
        <label for="status">
          Status: <span class="required-asterisk">*</span>
        </label>
        <select id="status" v-model="formRef.status" required>
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
        <select id="category" v-model="formRef.category" required>
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
        <select id="country" v-model="formRef.country" required>
          <option value="">Select Country</option>
          <option v-for="country in countries" :key="country" :value="country">
            {{ country }}
          </option>
        </select>
      </div>

      <button type="submit">Confirm</button>
    </form>
  </div>
</template>

<style scoped>
.add-sales-order {
  min-width: 400px;
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
