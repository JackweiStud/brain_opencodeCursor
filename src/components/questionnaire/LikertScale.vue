<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: number | null
  labels?: string[]
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  labels: () => ['完全不符合', '不太符合', '一般', '比较符合', '完全符合'],
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const options = [1, 2, 3, 4, 5]

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!props.disabled && value !== null) {
      emit('update:modelValue', value)
    }
  }
})

// 根据选中值获取颜色
const getOptionColor = (value: number) => {
  if (selectedValue.value !== value) return ''
  const colors = [
    'var(--color-clay-peach)',      // 1 - 粉桃
    'var(--color-clay-peach)',      // 2 - 粉桃
    'var(--color-clay-lilac)',      // 3 - 淡紫
    'var(--color-clay-blue)',       // 4 - 淡蓝
    'var(--color-clay-mint)'        // 5 - 薄荷
  ]
  return colors[value - 1]
}

// 表情图标
const getEmoji = (value: number) => {
  const emojis = ['😕', '🙁', '😐', '🙂', '😊']
  return emojis[value - 1]
}
</script>

<template>
  <div class="w-full">
    <!-- 选项按钮 -->
    <div class="flex justify-between gap-2 mb-3">
      <button
        v-for="option in options"
        :key="option"
        @click="selectedValue = option"
        :disabled="disabled"
        :class="[
          'flex-1 py-4 rounded-clay border-4 font-heading text-2xl transition-all duration-200',
          selectedValue === option 
            ? 'border-clay-peach-dark scale-105 shadow-lg' 
            : 'border-clay-peach-dark/20 bg-white hover:bg-clay-bg hover:border-clay-peach-dark/40',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        ]"
        :style="selectedValue === option ? { backgroundColor: getOptionColor(option) } : {}"
      >
        <span class="block text-3xl mb-1">{{ getEmoji(option) }}</span>
        <span class="block text-sm text-clay-text/70">{{ option }}</span>
      </button>
    </div>

    <!-- 标签说明 -->
    <div class="flex justify-between text-xs text-clay-text/50 font-body px-2">
      <span>{{ labels[0] }}</span>
      <span>{{ labels[2] }}</span>
      <span>{{ labels[4] }}</span>
    </div>
  </div>
</template>
