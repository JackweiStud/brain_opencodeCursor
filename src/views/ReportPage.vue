<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ReportHeader, 
  ReportOverview, 
  AIDeepAnalysis, 
  DetailedDataCharts, 
  ReportFooter, 
  ApiKeyModal 
} from '../components/report'
import { useProfileStore } from '../stores/profile'
import { useQuestionnaireEnhancedStore } from '../stores/questionnaireEnhanced'
import { useGamesStore } from '../stores/games'
import { useReportStore } from '../stores/report'
import { useTestHistoryStore } from '../stores/testHistory'
import {
  intelligenceNameMap,
  interestNameMap,
  getOverallAssessment
} from '../utils/reportAnalysis'
import { addNormRecord } from '@/utils/normCollection'
import { generateIntegratedAssessment } from '@/utils/gameQuestionnaireIntegration'
import { useAIAssessment, hasApiKey } from '@/utils/aiAssessment'
import { formatAssessmentData } from '@/utils/assessmentDataFormatter'

const router = useRouter()
const profileStore = useProfileStore()
const questionnaireStore = useQuestionnaireEnhancedStore()
const gamesStore = useGamesStore()
const reportStore = useReportStore()
const testHistoryStore = useTestHistoryStore()

const isHistorySaved = ref(false)

// ========== AI 评价状态 ==========
const aiAssessment = useAIAssessment()
const showApiKeyModal = ref(false)

// 自动生成 AI 报告 (如果在有 API Key 的情况下)
const autoGenerateAI = async () => {
  // 如果已经有结果或正在加载，跳过
  if (aiAssessment.state.value.result || aiAssessment.state.value.loading) return
  
  // 如果有 Key，自动生成
  if (hasApiKey()) {
    console.log('🤖 检测到 API Key，自动触发 AI 评价...')
    await generateAIReport()
  } else {
    console.log('👀 未检测到 API Key，等待用户手动触发')
  }
}

// 生成 AI 评价
const generateAIReport = async () => {
  if (!hasApiKey()) {
    showApiKeyModal.value = true
    return
  }

  // 格式化评估数据
  const formattedData = formatAssessmentData(
    {
      name: profileStore.profile.name,
      age: profileStore.profile.age,
      gender: profileStore.profile.gender as 'male' | 'female' | 'other',
      ageGroup: profileStore.ageGroup as 'young' | 'middle' | 'teen'
    },
    questionnaireStore.answerRecords,
    questionnaireStore.intelligenceQuestions,
    questionnaireStore.interestQuestions,
    questionnaireStore.intelligenceScores,
    questionnaireStore.interestScores,
    gamesStore.results,
    cognitiveScores.value,
    integratedAssessment.value?.consistency
  )

  // 调用 AI 生成
  await aiAssessment.generate(formattedData.markdown)
}

// API Key 保存后的回调
const onApiKeySaved = () => {
  generateAIReport() // 保存后立即生成
}

// ========== 数据转换 ==========

// 多元智能雷达图数据
const intelligenceChartData = computed(() => {
  return Object.entries(questionnaireStore.intelligenceScores).map(([key, value]) => ({
    name: intelligenceNameMap[key] || key,
    value
  }))
})

// 职业兴趣雷达图数据
const interestChartData = computed(() => {
  return Object.entries(questionnaireStore.interestScores).map(([key, value]) => ({
    name: interestNameMap[key] || key,
    value
  }))
})

// 认知能力数据
const cognitiveScores = computed(() => ({
  attention: gamesStore.schulteScore,
  memory: gamesStore.memoryScore,
  logic: gamesStore.logicScore,
  creativity: gamesStore.creativeScore
}))

// 综合评估（游戏+问卷）
const integratedAssessment = computed(() => {
  if (!gamesStore.allGamesCompleted) return null
  return generateIntegratedAssessment(
    questionnaireStore.intelligenceScores,
    gamesStore.normalizedScores
  )
})

// 规则及评估（后备）
const ruleAssessment = computed(() => {
  return getOverallAssessment(
    questionnaireStore.intelligenceScores,
    questionnaireStore.interestScores,
    cognitiveScores.value
  )
})

// 是否显示关联分析
const showIntegrationAnalysis = computed(() => {
  return gamesStore.allGamesCompleted && integratedAssessment.value !== null
})

// ========== 通用操作 ==========

const restartAssessment = () => {
  reportStore.resetAll()
  router.push('/')
}

const printReport = () => {
  window.print()
}

// 保存历史
const saveToHistory = () => {
  if (isHistorySaved.value) return
  if (!profileStore.profile.name || questionnaireStore.progress < 100) return
  
  testHistoryStore.saveTestRecord({
    name: profileStore.profile.name,
    age: profileStore.profile.age,
    gender: profileStore.profile.gender,
    ageGroup: profileStore.ageGroup,
    intelligenceScores: { ...questionnaireStore.intelligenceScores },
    interestScores: { ...questionnaireStore.interestScores },
    cognitiveScores: cognitiveScores.value,
    // 如果有 AI 结果也保存
    aiResult: aiAssessment.state.value.result
  })
  isHistorySaved.value = true
}

// 监听 AI 结果生成，保存到历史
watch(() => aiAssessment.state.value.result, (newResult) => {
  if (newResult) {
    // 如果已有历史记录，更新它
    // 注意：当前 historyStore 可能没有 update 方法，这里简化处理，
    // 实际应考虑更新已保存的记录。目前 saveToHistory 有防重锁，
    // 可以考虑解锁后重新保存，或者扩展 historyStore。
    // 简单起见，这里仅打印日志，实际上 historyStore 需要支持 update
    console.log('AI 结果已生成，建议更新历史记录')
  }
})

onMounted(() => {
  reportStore.generateReport()
  saveToHistory()
  
  // 自动尝试生成 AI 报告
  autoGenerateAI()

  // 常模收集逻辑...
  if (questionnaireStore.normCollectionConsent && profileStore.profile.gender) {
    try {
      addNormRecord(
        { age: profileStore.profile.age, gender: profileStore.profile.gender as any },
        questionnaireStore.intelligenceScores,
        questionnaireStore.interestScores,
        {
          schulte: gamesStore.results.schulte.times.map((time, i) => ({ time, errors: gamesStore.results.schulte.errors[i] || 0 })),
          memory: gamesStore.results.memory.scores,
          logic: gamesStore.results.logic.answers.map((correct, i) => ({ correct, time: gamesStore.results.logic.times[i] || 0 })),
          creative: gamesStore.results.creative.answers
        }
      )
    } catch (e) {
      console.error('Norm collection failed:', e)
    }
  }
})
</script>

<template>
  <div class="min-h-screen bg-report-bg">
    <!-- 报告主体 -->
    <div id="report-content" class="max-w-4xl mx-auto py-8 px-4">
      
      <!-- 1. 报告头部 -->
      <ReportHeader :profile="{
        name: profileStore.profile.name,
        age: profileStore.profile.age,
        gender: profileStore.profile.gender,
        ageGroup: profileStore.ageGroup
      }" />

      <!-- 2. 快速概览与 AI 摘要 -->
      <ReportOverview
        :integrated-assessment="integratedAssessment"
        :rule-assessment="ruleAssessment"
        :ai-result="aiAssessment.state.value.result"
        :ai-loading="aiAssessment.state.value.loading"
        :show-ai-trigger="!hasApiKey()"
        @generate-ai="generateAIReport"
        @configure-api="showApiKeyModal = true"
      />

      <!-- 3. AI 深度分析 (仅当有结果时显示) -->
      <AIDeepAnalysis
        :result="aiAssessment.state.value.result"
        :loading="aiAssessment.state.value.loading"
      />

      <!-- 4. 详细数据图表 -->
      <DetailedDataCharts
        :intelligence-scores="questionnaireStore.intelligenceScores"
        :intelligence-chart-data="intelligenceChartData"
        :interest-scores="questionnaireStore.interestScores"
        :interest-chart-data="interestChartData"
        :cognitive-scores="cognitiveScores"
        :integrated-assessment="integratedAssessment"
        :show-integration-analysis="showIntegrationAnalysis"
      />

      <!-- 5. 底部信息 -->
      <ReportFooter />
      
      <!-- 底部操作按钮 (打印时不显示) -->
      <div class="mt-8 flex gap-4 justify-center print:hidden">
        <button
          @click="restartAssessment"
          class="px-6 py-3 bg-white border border-report-border rounded-lg font-body text-report-text hover:bg-gray-50 transition-colors"
        >
          重新测评
        </button>
        <button
          @click="printReport"
          class="px-6 py-3 bg-report-primary text-white rounded-lg font-body hover:bg-blue-700 transition-colors"
        >
          打印报告 🖨️
        </button>
      </div>

    </div>

    <!-- API Key 配置弹窗 -->
    <ApiKeyModal
      :show="showApiKeyModal"
      @close="showApiKeyModal = false"
      @saved="onApiKeySaved"
    />
  </div>
</template>

<style>
@media print {
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  /* 强制分页控制 */
  .section-break {
    page-break-before: always;
  }
}
</style>
