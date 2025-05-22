<template>
  <div class="d-flex justify-content-center my-4">
    <nav>
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
            Previous
          </button>
        </li>

        <li v-for="page in visiblePages" :key="page.key" class="page-item" :class="{ active: page.number === currentPage, disabled: page.isEllipsis }">
          <span v-if="page.isEllipsis" class="page-link">…</span>
          <button
              v-else
              class="page-link"
              @click="goToPage(page.number)"
          >
            {{ page.number }}
          </button>
        </li>

        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
            Next
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  modelValue: number,
  totalItems: number,
  itemsPerPage: number
}>()

const emit = defineEmits(['update:modelValue'])

const currentPage = computed(() => props.modelValue)
const totalPages = computed(() => Math.max(1, Math.ceil(props.totalItems / props.itemsPerPage)))

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:modelValue', page)
  }
}

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2
  const range = []
  let left = current - delta
  let right = current + delta

  if (left < 2) {
    right += 2 - left
    left = 2
  }
  if (right > total - 1) {
    left -= right - (total - 1)
    right = total - 1
  }

  left = Math.max(left, 2)

  range.push({ number: 1, key: 'page-1' })

  if (left > 2) {
    range.push({ isEllipsis: true, key: 'left-ellipsis' })
  }

  for (let i = left; i <= right; i++) {
    range.push({ number: i, key: `page-${i}` })
  }

  if (right < total - 1) {
    range.push({ isEllipsis: true, key: 'right-ellipsis' })
  }

  if (total > 1) {
    range.push({ number: total, key: `page-${total}` })
  }

  return range
})
</script>
