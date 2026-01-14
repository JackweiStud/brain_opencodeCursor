<script setup lang="ts">
import type { IntegratedAssessment } from '@/utils/gameQuestionnaireIntegration'
import { computed } from 'vue'

interface Props {
  // 综合评价数据（如果已关联分析）
  integratedAssessment: IntegratedAssessment | null
  // 规则生成的评价（后备）
  ruleAssessment: {
    avgIntelligence: number
    avgCognitive: number
    assessment: string
  }
  // AI 评价结果（可选）
  aiResult: any | null
  // AI 是否正在加载
  aiLoading: boolean
  // 显示生成AI评价的触发器（如果没有自动生成）
  showAiTrigger?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'generate-ai'): void
  (e: 'configure-api'): void
}>()

// 智能指数 (计算 integratedScores 的平均分)
const intelligenceScore = computed(() => {
  if (props.integratedAssessment) {
    const scores = Object.values(props.integratedAssessment.integratedScores)
    if (scores.length === 0) return 0
    const total = scores.reduce((sum, item) => sum + item.weightedScore, 0)
    return Math.round(total / scores.length)
  }
  return props.ruleAssessment.avgIntelligence
})

// 认知指数 (计算 cognitiveValidation 的平均分)
const cognitiveScore = computed(() => {
  if (props.integratedAssessment) {
    const validation = props.integratedAssessment.cognitiveValidation
    const scores = [
      validation.attention.score,
      validation.memory.score,
      validation.logic.score,
      validation.creativity.score
    ]
    const total = scores.reduce((sum, s) => sum + s, 0)
    return Math.round(total / scores.length)
  }
  return props.ruleAssessment.avgCognitive
})

// 可靠性等级颜色类 (修复未使用变量警告)
// const reliabilityClass = ... (已移除未使用函数)
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-report-border p-6 mb-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="font-heading text-xl text-report-text flex items-center gap-2">
        📊 快速概览
      </h2>
      
      <!-- AI 操作按钮 -->
      <div v-if="showAiTrigger" class="flex gap-2">
        <button
          v-if="!aiResult && !aiLoading"
          @click="$emit('generate-ai')"
          class="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center gap-1"
        >
          <span>✨</span> 生成 AI 深度解读
        </button>
        <button
          @click="$emit('configure-api')"
          class="px-3 py-1.5 text-gray-500 hover:text-gray-700 text-sm"
        >
          ⚙️ 设置
        </button>
      </div>
    </div>

    <!-- 核心指数仪表盘 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <!-- 智能发展指数 -->
      <div class="p-4 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
        <span class="text-sm text-report-text/60 mb-1">智能发展指数</span>
        <div class="flex items-baseline gap-1">
          <span class="font-heading text-3xl text-report-primary">{{ intelligenceScore }}</span>
          <span class="text-xs text-blue-600 font-medium">
            {{ intelligenceScore >= 60 ? '良好' : '需关注' }}
          </span>
        </div>
      </div>

      <!-- 认知能力指数 -->
      <div class="p-4 bg-green-50 rounded-lg flex flex-col items-center justify-center">
        <span class="text-sm text-report-text/60 mb-1">认知能力指数</span>
        <div class="flex items-baseline gap-1">
          <span class="font-heading text-3xl text-green-600">{{ cognitiveScore }}</span>
          <span class="text-xs text-green-600 font-medium">
            {{ cognitiveScore >= 60 ? '良好' : '需关注' }}
          </span>
        </div>
      </div>

      <!-- 评估可靠性 -->
      <div v-if="integratedAssessment" class="p-4 rounded-lg flex flex-col items-center justify-center"
        :class="integratedAssessment.overallAssessment.reliabilityLevel.includes('高') ? 'bg-green-50' : 'bg-yellow-50'">
        <span class="text-sm text-report-text/60 mb-1">评估可靠性</span>
        <div class="font-heading text-xl"
          :class="integratedAssessment.overallAssessment.reliabilityLevel.includes('高') ? 'text-green-700' : 'text-yellow-700'">
          {{ integratedAssessment.overallAssessment.reliabilityLevel }}
        </div>
        <div class="text-xs text-report-text/50 mt-1">基于问卷与游戏一致性</div>
      </div>
    </div>

    <!-- 总体评价 (优先显示 AI 摘要，否则显示规则评价) -->
    <div class="relative">
      <div v-if="aiLoading" class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
        <div class="flex items-center gap-2 text-blue-600">
          <span class="animate-spin text-xl">🔄</span>
          <span class="text-sm font-medium">AI 正在生成深度解读...</span>
        </div>
      </div>

      <div class="bg-report-bg p-5 rounded-lg border border-report-border/50">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">{{ aiResult ? '🤖' : '📝' }}</span>
          <span class="font-bold text-report-text">
            {{ aiResult ? 'AI 综合画像' : '初评结论' }}
          </span>
        </div>
        
        <div class="font-body text-report-text/80 leading-relaxed">
          <!-- AI 结果：显示 opening 和 keyHighlight -->
          <template v-if="aiResult && aiResult.overallSummary">
            <p class="mb-2">{{ aiResult.overallSummary.opening }}</p>
            <p v-if="aiResult.overallSummary.keyHighlight" class="text-sm font-medium text-report-primary">
              💡 {{ aiResult.overallSummary.keyHighlight }}
            </p>
          </template>
          <!-- 非 AI 结果：规则评估 -->
          <template v-else>
            {{ ruleAssessment.assessment }}
          </template>
        </div>

        <div v-if="aiResult" class="mt-4 flex flex-wrap gap-2">
          <!-- 潜力预测标签 -->
          <span class="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium" 
            v-if="aiResult.potentialPrediction?.shortTermVision">
            🚀 长期潜力大
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
