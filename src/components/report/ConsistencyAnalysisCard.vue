<script setup lang="ts">
import { computed } from 'vue'
import {
  getIntelligenceChineseName,
  getConsistencyInterpretation,
  getConsistencyColor
} from '@/utils/gameQuestionnaireIntegration'

interface Props {
  consistency: {
    overall: number
    byDimension: Record<string, {
      questionnaireScore: number
      gameScore: number
      consistency: number
      gap: number
      interpretation: string
    }>
    reliableDimensions: string[]
    alertDimensions: string[]
  }
}

const props = defineProps<Props>()

// 按一致性排序的维度列表
const sortedDimensions = computed(() => {
  return Object.entries(props.consistency.byDimension)
    .sort(([, a], [, b]) => b.consistency - a.consistency)
})

// 获取一致性等级文本
const overallLevel = computed(() => {
  const score = props.consistency.overall
  if (score >= 70) return { text: '高度一致', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
  if (score >= 50) return { text: '基本一致', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }
  return { text: '存在差异', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
})

// 获取条形图宽度
const getBarWidth = (score: number) => `${Math.min(100, score)}%`
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h2 class="font-heading text-xl text-gray-800 mb-4 flex items-center gap-2">
      <span>🔗</span>
      <span>问卷-游戏一致性分析</span>
    </h2>

    <!-- 总体一致性 -->
    <div :class="[`p-4 rounded-lg border mb-6`, overallLevel.bg, overallLevel.border]">
      <div class="flex items-center justify-between">
        <div>
          <span class="font-body text-sm text-gray-600">总体一致性</span>
          <p :class="[`font-heading text-3xl`, overallLevel.color]">
            {{ consistency.overall }}%
          </p>
        </div>
        <div class="text-right">
          <span :class="[`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium`, overallLevel.bg, overallLevel.color]">
            {{ overallLevel.text }}
          </span>
        </div>
      </div>

      <!-- 一致性说明 -->
      <p class="font-body text-sm text-gray-600 mt-2">
        <template v-if="consistency.overall >= 70">
          ✅ 问卷自评与游戏测试结果高度吻合，评估结果可信度高
        </template>
        <template v-else-if="consistency.overall >= 50">
          ⚠️ 问卷与游戏结果基本一致，部分维度存在正常差异
        </template>
        <template v-else>
          ❗ 问卷自评与实际表现差异较大，建议结合两者综合解读
        </template>
      </p>
    </div>

    <!-- 可信维度 -->
    <div v-if="consistency.reliableDimensions.length > 0" class="mb-4">
      <h3 class="font-body text-sm font-semibold text-gray-700 mb-2">✅ 可信维度（两者一致）</h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="dim in consistency.reliableDimensions"
          :key="dim"
          class="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-body"
        >
          {{ getIntelligenceChineseName(dim) }}
        </span>
      </div>
    </div>

    <!-- 需关注维度 -->
    <div v-if="consistency.alertDimensions.length > 0" class="mb-4">
      <h3 class="font-body text-sm font-semibold text-gray-700 mb-2">⚠️ 需关注维度（存在差异）</h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="dim in consistency.alertDimensions"
          :key="dim"
          class="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-body"
        >
          {{ getIntelligenceChineseName(dim) }}
        </span>
      </div>
    </div>

    <!-- 详细对比 -->
    <div class="mt-6">
      <h3 class="font-body text-sm font-semibold text-gray-700 mb-3">📊 维度详细对比</h3>
      <div class="space-y-3">
        <div
          v-for="[key, data] in sortedDimensions"
          :key="key"
          class="border border-gray-100 rounded-lg p-3"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="font-body text-sm font-medium text-gray-700">
              {{ getIntelligenceChineseName(key) }}
            </span>
            <span
              class="text-xs px-2 py-0.5 rounded-full"
              :style="{
                backgroundColor: getConsistencyColor(data.consistency) + '20',
                color: getConsistencyColor(data.consistency)
              }"
            >
              {{ getConsistencyInterpretation(data.consistency) }} ({{ data.consistency }}%)
            </span>
          </div>

          <!-- 分数对比条形图 -->
          <div class="space-y-1.5">
            <!-- 问卷分数 -->
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500 w-12">问卷</span>
              <div class="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  class="h-full bg-blue-500 rounded-full transition-all duration-500"
                  :style="{ width: getBarWidth(data.questionnaireScore) }"
                />
              </div>
              <span class="text-xs text-gray-600 w-8 text-right">{{ data.questionnaireScore }}</span>
            </div>

            <!-- 游戏分数 -->
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500 w-12">游戏</span>
              <div class="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  class="h-full bg-purple-500 rounded-full transition-all duration-500"
                  :style="{ width: getBarWidth(data.gameScore) }"
                />
              </div>
              <span class="text-xs text-gray-600 w-8 text-right">{{ data.gameScore }}</span>
            </div>
          </div>

          <!-- 差距说明 -->
          <p class="text-xs text-gray-500 mt-2">
            {{ data.interpretation }}
            <span class="ml-2" :class="data.gap > 30 ? 'text-red-500' : 'text-gray-400'">
              (差距: {{ data.gap }}分)
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="mt-4 pt-4 border-t border-gray-100">
      <div class="flex items-center gap-4 text-xs text-gray-500">
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>问卷自评分数</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 rounded-full bg-purple-500"></div>
          <span>游戏测试分数</span>
        </div>
      </div>
    </div>
  </div>
</template>
