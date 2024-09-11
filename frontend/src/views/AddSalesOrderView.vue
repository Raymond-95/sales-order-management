<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  customerName: '',
  status: '',
  category: '',
  country: ''
})

// Example options, you might fetch these from an API or define them elsewhere
const statuses = ref(['Active', 'Inactive', 'Pending'])
const categories = ref(['Category 1', 'Category 2', 'Category 3'])
const countries = ref(['USA', 'Canada', 'UK'])

const submitForm = () => {
  // Handle form submission
  console.log('Form Submitted:', form.value)
  // You might send this data to an API or handle it as needed
}
</script>

<template>
  <div class="add-customer">
    <h1>Add Customer</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="customer-name">Customer Name:</label>
        <input id="customer-name" v-model="form.customerName" type="text" required />
      </div>

      <div class="form-group">
        <label for="status">Status:</label>
        <select id="status" v-model="form.status" required>
          <option value="">Select Status</option>
          <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="category">Category:</label>
        <select id="category" v-model="form.category" required>
          <option value="">Select Category</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="country">Country:</label>
        <select id="country" v-model="form.country" required>
          <option value="">Select Country</option>
          <option v-for="country in countries" :key="country" :value="country">
            {{ country }}
          </option>
        </select>
      </div>

      <button type="submit">Add Customer</button>
    </form>
  </div>
</template>

<style scoped>
.add-customer {
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
</style>
