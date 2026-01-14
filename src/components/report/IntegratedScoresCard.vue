<script setup lang="ts">
import { computed } from 'vue'
import { getIntelligenceChineseName } from '@/utils/gameQuestionnaireIntegration'
import { intelligenceTypesEnhanced } from '@/data/intelligenceQuestionsEnhanced'

interface Props {
  integratedScores: Record<string, {
    questionnaireScore: number
    gameScore: number
    weightedScore: number
    confidence: 'high' | 'medium' | 'low'
  }>
}

const props = defineProps<Props>()

// 按综合分数排序
const sortedScores = computed(() => {
  return Object.entries(props.integratedScores)
    .sort(([, a], [, b]) => b.weightedScore - a.weightedScore)
    .map(([key, data]) => ({
      key,
      type: intelligenceTypesEnhanced.find(t => t.key === key),
      ...data
    }))
})

// 置信度配置
const confidenceConfig = {
  high: { text: '高', color: 'bg-green-100 text-green-700', icon: '✓' },
  medium: { text: '中', color: 'bg-yellow-100 text-yellow-700', icon: '~' },
  low: { text: '低', color: 'bg-gray-100 text-gray-700', icon: '-' }
}

// 获取分数颜色
const getScoreColor = (score: number) => {
  if (score >= 75) return 'text-green-600'
  if (score >= 50) return 'text-yellow-600'
  return 'text-gray-600'
}

</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h2 class="font-heading text-xl text-gray-800 mb-4 flex items-center gap-2">
      <span>🎯</span>
      <span>综合智能评分</span>
    </h2>

    <!-- 说明 -->
    <div class="bg-blue-50 rounded-lg p-3 mb-4">
      <p class="font-body text-sm text-blue-800">
        <span class="font-semibold">💡 综合评分说明：</span>
        综合评分结合了问卷自评和游戏测试结果。当两者一致时，游戏验证会提高评分的置信度。
      </p>
    </div>

    <!-- TOP3 优势 -->
    <div class="mb-4">
      <h3 class="font-body text-sm font-semibold text-gray-700 mb-2">🌟 综合优势 TOP3</h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="item in sortedScores.slice(0, 3)"
          :key="item.key"
          class="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg font-body text-sm flex items-center gap-1"
        >
          <span>{{ item.type?.icon || '📊' }}</span>
          <span>{{ getIntelligenceChineseName(item.key) }}</span>
          <span class="font-bold">{{ item.weightedScore }}</span>
        </span>
      </div>
    </div>

    <!-- 详细列表 -->
    <div class="space-y-3">
      <div
        v-for="item in sortedScores"
        :key="item.key"
        class="border border-gray-100 rounded-lg p-3"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xl">{{ item.type?.icon || '📊' }}</span>
            <span class="font-body text-sm font-medium text-gray-700">
              {{ getIntelligenceChineseName(item.key) }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <!-- 置信度标签 -->
            <span
              class="text-xs px-2 py-0.5 rounded-full font-medium"
              :class="confidenceConfig[item.confidence].color"
            >
              {{ confidenceConfig[item.confidence].icon }}
              置信度{{ confidenceConfig[item.confidence].text }}
            </span>
            <!-- 综合分数 -->
            <span
              class="font-heading text-lg"
              :class="getScoreColor(item.weightedScore)"
            >
              {{ item.weightedScore }}
            </span>
          </div>
        </div>

        <!-- 分数条形图 -->
        <div class="relative">
          <div class="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span class="w-16">问卷 {{ item.questionnaireScore }}</span>
            <span class="flex-1 text-center">综合评分</span>
            <span class="w-16 text-right">游戏 {{ item.gameScore }}</span>
          </div>
          <div class="h-3 bg-gray-100 rounded-full overflow-hidden flex">
            <!-- 问卷部分 -->
            <div
              class="bg-blue-400 h-full transition-all duration-500"
              :style="{ width: `${item.questionnaireScore * 0.6}%` }"
            />
            <!-- 游戏部分 -->
            <div
              class="bg-purple-400 h-full transition-all duration-500"
              :style="{ width: `${item.gameScore * 0.4}%` }"
            />
          </div>
          <!-- 综合分数指示器 -->
          <div
            class="absolute top-3 w-0.5 h-2 bg-gray-800 transition-all duration-500"
            :style="{ left: `${item.weightedScore}%` }"
          />
        </div>

        <!-- 数据来源说明 -->
        <p class="text-xs text-gray-400 mt-2">
          <template v-if="item.gameScore > 0">
            问卷自评 {{ item.questionnaireScore }}分 + 游戏验证 {{ item.gameScore }}分
          </template>
          <template v-else>
            仅问卷自评（该类型暂无对应游戏测试）
          </template>
        </p>
      </div>
    </div>

    <!-- 图例 -->
    <div class="mt-4 pt-4 border-t border-gray-100">
      <div class="flex items-center gap-4 text-xs text-gray-500">
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 rounded bg-blue-400"></div>
          <span>问卷自评</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 rounded bg-purple-400"></div>
          <span>游戏验证</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-0.5 h-2 bg-gray-800"></div>
          <span>综合评分</span>
        </div>
      </div>
    </div>
  </div>
</template>
