<script setup lang="ts">
interface Props {
  title: string
  score: number
  icon?: string
  color?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: '📊',
  color: '#2563EB'
})

// 根据分数获取等级
const getLevel = (score: number) => {
  if (score >= 90) return { text: '优秀', class: 'text-green-500' }
  if (score >= 75) return { text: '良好', class: 'text-blue-500' }
  if (score >= 60) return { text: '中等', class: 'text-yellow-500' }
  return { text: '待提升', class: 'text-orange-500' }
}

const level = getLevel(props.score)
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-report-border p-4">
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-2">
        <span class="text-2xl">{{ icon }}</span>
        <span class="font-heading text-report-text">{{ title }}</span>
      </div>
      <span :class="['font-heading text-sm px-2 py-1 rounded', level.class, `bg-${level.class.split('-')[1]}-50`]">
        {{ level.text }}
      </span>
    </div>
    
    <div class="flex items-end gap-2 mb-2">
      <span class="font-heading text-4xl" :style="{ color }">{{ score }}</span>
      <span class="font-body text-report-text/50 text-sm mb-1">/ 100</span>
    </div>

    <!-- 进度条 -->
    <div class="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
      <div 
        class="h-full rounded-full transition-all duration-500"
        :style="{ width: `${score}%`, backgroundColor: color }"
      />
    </div>

    <p v-if="description" class="font-body text-xs text-report-text/60">
      {{ description }}
    </p>
  </div>
</template>
