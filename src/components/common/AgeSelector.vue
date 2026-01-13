<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const ages = Array.from({ length: 9 }, (_, i) => i + 7) // 7-15岁

const selectedAge = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const getAgeGroupLabel = (age: number) => {
  if (age <= 9) return '低龄段'
  if (age <= 12) return '中龄段'
  return '青少年'
}

const getAgeGroupColor = (age: number) => {
  if (age <= 9) return 'var(--color-clay-peach)'
  if (age <= 12) return 'var(--color-clay-blue)'
  return 'var(--color-clay-mint)'
}
</script>

<template>
  <div class="space-y-4">
    <label class="block font-heading text-lg text-clay-text">选择年龄</label>
    <div class="grid grid-cols-3 gap-3">
      <button
        v-for="age in ages"
        :key="age"
        @click="selectedAge = age"
        :class="[
          'relative py-4 px-2 rounded-clay border-4 font-heading text-2xl transition-all duration-200',
          selectedAge === age 
            ? 'border-clay-peach-dark text-clay-text scale-105' 
            : 'border-clay-peach-dark/30 bg-white text-clay-text/70 hover:bg-clay-bg'
        ]"
        :style="selectedAge === age ? { backgroundColor: 'var(--color-clay-peach)' } : {}"
      >
        {{ age }}
        <span 
          v-if="selectedAge === age"
          class="absolute -top-2 -right-2 text-xs px-2 py-1 rounded-full text-white"
          :style="{ backgroundColor: getAgeGroupColor(age) }"
        >
          {{ getAgeGroupLabel(age) }}
        </span>
      </button>
    </div>
    <p class="text-sm text-clay-text/60 font-body">
      {{ selectedAge > 0 ? `已选择 ${selectedAge} 岁（${getAgeGroupLabel(selectedAge)}）` : '请选择孩子的年龄' }}
    </p>
  </div>
</template>
