<template>
  <div class="d-flex justify-content-between align-items-center my-3">
    <div>
      <label for="itemsPerPage" class="me-2">Items per page:</label>
      <select id="itemsPerPage" v-model.number="localItemsPerPage" class="form-select d-inline-block w-auto">
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
    </div>

    <div>
      <button class="btn btn-outline-primary btn-sm me-1" :disabled="modelValue === 1" @click="updatePage(modelValue - 1)">Previous</button>
      <span>Page {{ modelValue }} / {{ totalPages }}</span>
      <button class="btn btn-outline-primary btn-sm ms-1" :disabled="modelValue === totalPages" @click="updatePage(modelValue + 1)">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps} from 'vue'

const props = defineProps<{
  modelValue: number, // currentPage
  itemsPerPage: number,
  totalItems: number
}>()

const emit = defineEmits(['update:modelValue', 'update:itemsPerPage'])

const localItemsPerPage = computed({
  get: () => props.itemsPerPage,
  set: (value) => emit('update:itemsPerPage', value)
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(props.totalItems / props.itemsPerPage))
})

function updatePage(newPage: number) {
  emit('update:modelValue', newPage)
}
</script>
