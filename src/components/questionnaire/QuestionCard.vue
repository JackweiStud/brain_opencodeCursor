<script setup lang="ts">
import { computed } from 'vue'
import LikertScale from './LikertScale.vue'
import { ClayCard } from '../common'

interface Props {
  questionNumber: number
  totalQuestions: number
  questionText: string
  questionType?: string
  typeIcon?: string
  typeName?: string
  modelValue: number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'next': []
}>()

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (value !== null) {
      emit('update:modelValue', value)
      // 选择后自动延迟跳转
      setTimeout(() => {
        emit('next')
      }, 300)
    }
  }
})

// 进度百分比
const progressPercent = computed(() => {
  return Math.round((props.questionNumber / props.totalQuestions) * 100)
})
</script>

<template>
  <div class="w-full max-w-lg mx-auto">
    <!-- 进度指示 -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-2">
        <span class="font-body text-sm text-clay-text/70">
          第 {{ questionNumber }} / {{ totalQuestions }} 题
        </span>
        <span class="font-heading text-sm text-clay-text">
          {{ progressPercent }}%
        </span>
      </div>
      <div class="h-2 bg-clay-bg rounded-full border border-clay-peach-dark/30 overflow-hidden">
        <div 
          class="h-full bg-clay-peach rounded-full transition-all duration-500 ease-out"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>
    </div>

    <!-- 问题卡片 -->
    <ClayCard padding="lg" class="mb-6">
      <!-- 类型标签 -->
      <div 
        v-if="typeIcon && typeName"
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clay-lilac/50 mb-4"
      >
        <span class="text-lg">{{ typeIcon }}</span>
        <span class="font-body text-sm text-clay-text/70">{{ typeName }}</span>
      </div>

      <!-- 问题文本 -->
      <h3 class="font-heading text-xl text-clay-text mb-8 leading-relaxed">
        {{ questionText }}
      </h3>

      <!-- 李克特量表 -->
      <LikertScale v-model="selectedValue" />
    </ClayCard>

    <!-- 提示文字 -->
    <p class="text-center text-sm text-clay-text/50 font-body">
      选择最符合你情况的选项，点击即可继续
    </p>
  </div>
</template>
