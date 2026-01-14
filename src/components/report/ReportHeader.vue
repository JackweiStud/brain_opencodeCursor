<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  profile: {
    name: string
    age: number
    gender: string
    ageGroup: string
  }
}

const props = defineProps<Props>()

const genderText = computed(() => {
  return props.profile.gender === 'male' ? '👦 男生' : props.profile.gender === 'female' ? '👧 女生' : '👶 未知'
})

const ageGroupText = computed(() => {
  const map: Record<string, string> = {
    young: '低年级 (7-9岁)',
    middle: '高年级 (10-12岁)',
    teen: '初中 (13-15岁)'
  }
  return map[props.profile.ageGroup] || props.profile.ageGroup
})

const currentDate = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-report-border p-8 mb-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-heading text-3xl text-report-primary mb-2">
          儿童发展潜力评估报告 (增强版)
        </h1>
        <p class="font-body text-report-text/60">
          测评时间：{{ currentDate }}
        </p>
      </div>
      <div class="text-right">
        <div class="text-4xl mb-2">🌟</div>
        <div class="font-body text-sm font-bold text-report-primary">童智星探</div>
      </div>
    </div>

    <!-- 基础信息卡片 -->
    <div class="bg-report-bg rounded-lg p-6 flex flex-wrap gap-8">
      <div>
        <span class="block text-xs text-report-text/40 mb-1">姓名</span>
        <span class="font-heading text-xl text-report-text">{{ profile.name }}</span>
      </div>
      <div>
        <span class="block text-xs text-report-text/40 mb-1">年龄</span>
        <span class="font-heading text-xl text-report-text">{{ profile.age }}岁</span>
      </div>
      <div>
        <span class="block text-xs text-report-text/40 mb-1">性别</span>
        <span class="font-heading text-xl text-report-text">{{ genderText }}</span>
      </div>
      <div>
        <span class="block text-xs text-report-text/40 mb-1">年龄组</span>
        <span class="font-heading text-xl text-report-text">{{ ageGroupText }}</span>
      </div>
    </div>
  </div>
</template>
