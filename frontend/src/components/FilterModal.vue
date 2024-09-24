<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, onMounted } from 'vue';
import type { CreatedDateRange, Filteration } from '@/typings/Filteration';
import type { FilterOptions } from '@/typings/FilterOptions';

const {
  onModalClosed,
  filterOptions = {
    status: [],
    category: [],
    customerName: [],
    country: [],
  },
  applyFilter,
} = defineProps<{
  isOpen: boolean;
  onModalClosed: () => void;
  filterOptions: FilterOptions;
  applyFilter?: (filters: Filteration) => void;
}>();

const emit = defineEmits(['modal-close']);

const createdDateRange = ref<CreatedDateRange>({
  from: '',
  to: '',
});
const selectedCustomerName = ref('');
const selectedStatuses = ref<string[]>(['All']);
const selectedCategories = ref<string[]>(['All']);
const selectedCountry = ref('');

// load filters from local storage
const loadFiltersFromLocalStorage = () => {
  try {
    const savedFilters = localStorage.getItem('filters');
    if (savedFilters) {
      const {
        createdDateRange: savedDateRange,
        customerName: savedCustomerName,
        status: savedStatuses,
        category: savedCategories,
        country: savedCountry,
      } = JSON.parse(savedFilters);
      createdDateRange.value = savedDateRange;
      selectedCustomerName.value = savedCustomerName;
      selectedStatuses.value = savedStatuses;
      selectedCategories.value = savedCategories;
      selectedCountry.value = savedCountry;
    }
  } catch (error) {
    console.error('Error loading filters from localStorage: ', error);
  }
};

// load filters when the component is mounted
onMounted(() => {
  loadFiltersFromLocalStorage();
});

const closeModal = () => {
  const isStateChanged =
    createdDateRange.value.from !== '' ||
    createdDateRange.value.to !== '' ||
    selectedCustomerName.value !== '' ||
    selectedStatuses.value.length > 0 ||
    selectedCategories.value.length > 0 ||
    selectedCountry.value !== '';

  if (isStateChanged) {
    const confirmed = window.confirm(
      'Closing this modal will discard any filter selections you have made. Are you sure you want to close it?',
    );

    if (confirmed) {
      // user clicked "OK"
      onModalClosed();
    }
  } else {
    onModalClosed();
  }
};

const toggleAllStatuses = () => {
  if (selectedStatuses.value.includes('All')) {
    selectedStatuses.value = ['All'];
  } else if (selectedStatuses.value.length === 0) {
    selectedStatuses.value = [];
  }
};

const toggleAllCategories = () => {
  if (selectedCategories.value.includes('All')) {
    selectedCategories.value = ['All'];
  } else if (selectedCategories.value.length === 0) {
    selectedCategories.value = [];
  }
};

const handleSubmit = () => {
  const filteration = {
    createdDateRange: createdDateRange.value,
    customerName: selectedCustomerName.value,
    status: selectedStatuses.value,
    category: selectedCategories.value,
    country: selectedCountry.value,
  };

  try {
    // save the filteration object to localStorage
    localStorage.setItem('filters', JSON.stringify(filteration));
  } catch (error) {
    // handle any errors that occur during saving
    console.error('Error saving filters to localStorage: ', error);
  }

  applyFilter?.(filteration);

  onModalClosed();
};

const handleReset = () => {
  Object.assign(createdDateRange.value, { from: '', to: '' });
  selectedCustomerName.value = '';
  selectedStatuses.value = [];
  selectedCategories.value = [];
  selectedCountry.value = '';
};
</script>

<template>
  <div v-if="isOpen" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <h1>Filters</h1>
          <h2>Select criteria filter in listing</h2>
        </div>

        <div class="modal-body">
          <form @submit.prevent="handleSubmit" class="filters">
            <!-- Date Range -->
            <div class="filter-row">
              <label class="filter-label">Created Date</label>
              <div class="filter-controls">
                <input
                  id="created-date-from"
                  v-model="createdDateRange.from"
                  type="text"
                  placeholder="Enter start date"
                />
                <span>to</span>
                <input
                  id="created-date-to"
                  v-model="createdDateRange.to"
                  type="text"
                  placeholder="Enter end date"
                />
              </div>
            </div>

            <!-- Customer Name -->
            <div class="filter-row">
              <label for="customer-name" class="filter-label"
                >Customer Name</label
              >
              <select id="customer-name" v-model="selectedCustomerName">
                <option value="">Select Customer Name</option>
                <option
                  v-for="customerName in filterOptions.customerName"
                  :key="customerName"
                  :value="customerName"
                >
                  {{ customerName }}
                </option>
              </select>
            </div>

            <!-- Status -->
            <div class="filter-row">
              <label class="filter-label">Status</label>
              <div class="filter-controls">
                <!-- Add "All" option -->
                <div class="filter-checkbox">
                  <input
                    type="checkbox"
                    id="status-all"
                    v-model="selectedStatuses"
                    value="All"
                    @change="toggleAllStatuses"
                  />
                  <label for="status-all">All</label>
                </div>

                <!-- Other status options -->
                <div
                  class="filter-checkbox"
                  v-for="status in filterOptions.status"
                  :key="status"
                >
                  <input
                    type="checkbox"
                    :id="`status-${status}`"
                    v-model="selectedStatuses"
                    :value="status"
                  />
                  <label :for="`status-${status}`">{{ status }}</label>
                </div>
              </div>
            </div>

            <!-- Category -->
            <div class="filter-row">
              <label class="filter-label">Category</label>
              <div class="filter-controls">
                <!-- Add "All" option -->
                <div class="filter-checkbox">
                  <input
                    type="checkbox"
                    id="category-all"
                    v-model="selectedCategories"
                    value="All"
                    @change="toggleAllCategories"
                  />
                  <label for="category-all">All</label>
                </div>

                <!-- Other category options -->
                <div
                  class="filter-checkbox"
                  v-for="category in filterOptions.category"
                  :key="category"
                >
                  <input
                    type="checkbox"
                    :id="`category-${category}`"
                    v-model="selectedCategories"
                    :value="category"
                  />
                  <label :for="`category-${category}`">{{ category }}</label>
                </div>
              </div>
            </div>

            <!-- Country -->
            <div class="filter-row">
              <label for="country" class="filter-label">Country</label>
              <select id="country" v-model="selectedCountry">
                <option value="">Select Country</option>
                <option
                  v-for="country in filterOptions.country"
                  :key="country"
                  :value="country"
                >
                  {{ country }}
                </option>
              </select>
            </div>

            <!-- Buttons -->
            <div class="filter-row">
              <button type="button" @click="handleReset" class="reset-btn">
                Reset
              </button>
              <div class="right-button-container">
                <button type="submit" class="apply-btn">Apply</button>
                <button type="button" @click="closeModal" class="close-btn">
                  Close
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  max-width: 800px;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-header {
  margin-bottom: 15px;
}

.filters {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 15px;
}

.filter-row {
  display: contents;
}

.filter-label {
  justify-self: start;
}

.filter-controls,
select {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 5px;
}

.right-button-container {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.reset-btn,
.apply-btn,
.close-btn {
  max-width: 80px;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: normal; /* Allow text to wrap */
  text-align: center; /* Center text */
}

.apply-btn {
  background-color: #007bff;
  color: white;
}

.close-btn {
  background-color: #dc3545;
  color: white;
}

.reset-btn {
  background-color: #6c757d;
  color: white;
}

.apply-btn:hover {
  background-color: #0056b3;
}

.close-btn:hover {
  background-color: #c82333;
}

.reset-btn:hover {
  background-color: #5a6268;
}
</style>
