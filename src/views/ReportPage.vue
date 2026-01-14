<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RadarChart, ScoreCard, ConsistencyAnalysisCard, IntegratedScoresCard } from '../components/report'
import { useProfileStore } from '../stores/profile'
import { useQuestionnaireEnhancedStore } from '../stores/questionnaireEnhanced'
import { useGamesStore } from '../stores/games'
import { useReportStore } from '../stores/report'
import { useTestHistoryStore } from '../stores/testHistory'
import {
  intelligenceNameMap,
  interestNameMap,
  cognitiveNameMap,
  getIntelligenceSuggestions,
  getCareerSuggestions,
  getHollandCode,
  getOverallAssessment
} from '../utils/reportAnalysis'
import { exportToPDF } from '../utils/pdfExport'
import { addNormRecord } from '@/utils/normCollection'
import { generateIntegratedAssessment } from '@/utils/gameQuestionnaireIntegration'

const router = useRouter()
const isExporting = ref(false)
const profileStore = useProfileStore()
const questionnaireStore = useQuestionnaireEnhancedStore()
const gamesStore = useGamesStore()
const reportStore = useReportStore()
const testHistoryStore = useTestHistoryStore()

const reportRef = ref<HTMLDivElement | null>(null)

// 标记当前报告是否已保存到历史（避免重复保存）
const isHistorySaved = ref(false)

// ========== 数据获取 ==========

// 多元智能雷达图数据（使用标准分）
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

// ========== 游戏-问卷关联分析 ==========

// 综合评估（结合问卷和游戏）
const integratedAssessment = computed(() => {
  // 只有当所有游戏都完成时才进行关联分析
  if (!gamesStore.allGamesCompleted) {
    return null
  }

  return generateIntegratedAssessment(
    questionnaireStore.intelligenceScores,
    gamesStore.normalizedScores
  )
})

// 是否显示关联分析
const showIntegrationAnalysis = computed(() => {
  return gamesStore.allGamesCompleted && integratedAssessment.value !== null
})

// ========== 增强评分结果展示 ==========

// 检查是否有增强评分数据可用
const hasEnhancedScores = computed(() => {
  return Object.keys(questionnaireStore.intelligenceEnhancedScores).length > 0
})

// 获取标准分显示
const getStandardScoreDisplay = (type: string) => {
  const enhanced = questionnaireStore.intelligenceEnhancedScores[type]
  if (!enhanced || enhanced.standardScore === 0) return null
  return {
    score: enhanced.standardScore,
    percentile: enhanced.percentile,
    confidenceInterval: enhanced.confidenceInterval,
    reliability: enhanced.reliability
  }
}

// ========== 分析结果 ==========

// 智能建议
const intelligenceSuggestions = computed(() => {
  return getIntelligenceSuggestions(questionnaireStore.intelligenceScores)
})

// 职业建议
const careerSuggestions = computed(() => {
  return getCareerSuggestions(questionnaireStore.interestScores)
})

// 霍兰德代码
const hollandCode = computed(() => {
  return getHollandCode(questionnaireStore.interestScores)
})

// 综合评价
const overallAssessment = computed(() => {
  return getOverallAssessment(
    questionnaireStore.intelligenceScores,
    questionnaireStore.interestScores,
    cognitiveScores.value
  )
})

// ========== 其他 ==========

// 当前日期
const currentDate = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

// 警告信息
const warnings = computed(() => questionnaireStore.allWarnings)

// 重新测评
const restartAssessment = () => {
  reportStore.resetAll()
  router.push('/')
}

// 打印报告
const printReport = () => {
  window.print()
}

// 导出 PDF
const handleExportPDF = async () => {
  const targetElement = reportRef.value || document.getElementById('report-content')

  if (!targetElement) {
    alert('报告内容未加载完成，请刷新页面后重试')
    return
  }

  isExporting.value = true
  try {
    await exportToPDF(targetElement as HTMLElement, {
      filename: `童智星探-${profileStore.profile.name}-评估报告`
    })
  } catch (error: any) {
    console.error('PDF 导出失败:', error)
    alert(`PDF 导出失败: ${error?.message || '未知错误'}\n\n建议使用浏览器打印功能：按 Ctrl+P 保存为 PDF`)
  } finally {
    isExporting.value = false
  }
}

// 保存测试历史记录
const saveToHistory = () => {
  if (isHistorySaved.value) return // 避免重复保存
  
  // 检查是否有完整数据
  if (!profileStore.profile.name || questionnaireStore.progress < 100) return
  
  try {
    testHistoryStore.saveTestRecord({
      name: profileStore.profile.name,
      age: profileStore.profile.age,
      gender: profileStore.profile.gender,
      ageGroup: profileStore.ageGroup,
      intelligenceScores: { ...questionnaireStore.intelligenceScores },
      interestScores: { ...questionnaireStore.interestScores },
      cognitiveScores: {
        attention: gamesStore.schulteScore,
        memory: gamesStore.memoryScore,
        logic: gamesStore.logicScore,
        creativity: gamesStore.creativeScore
      }
    })
    isHistorySaved.value = true
    console.log('测试历史记录已保存')
  } catch (e) {
    console.error('Failed to save test history:', e)
  }
}

// 组件挂载时
onMounted(() => {
  reportStore.generateReport()
  
  // 保存测试历史记录（仅首次查看时保存）
  saveToHistory()

  // 如果用户同意了常模收集，则收集数据
  if (questionnaireStore.normCollectionConsent && profileStore.profile.gender) {
    try {
      addNormRecord(
        {
          age: profileStore.profile.age,
          gender: profileStore.profile.gender as 'male' | 'female' | 'other'
        },
        questionnaireStore.intelligenceScores,
        questionnaireStore.interestScores,
        {
          schulte: gamesStore.results.schulte.times.map((time, i) => ({
            time,
            errors: gamesStore.results.schulte.errors[i] || 0
          })),
          memory: gamesStore.results.memory.scores,
          logic: gamesStore.results.logic.answers.map((correct, i) => ({
            correct,
            time: gamesStore.results.logic.times[i] || 0
          })),
          creative: gamesStore.results.creative.answers
        }
      )
    } catch (e) {
      console.error('Failed to save norm data:', e)
    }
  }
})
</script>

<template>
  <div class="min-h-screen bg-report-bg">
    <!-- 报告内容 -->
    <div ref="reportRef" id="report-content" class="max-w-4xl mx-auto py-8 px-4">
      <!-- 报告头部 -->
      <div class="bg-white rounded-xl shadow-sm border border-report-border p-8 mb-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="font-heading text-3xl text-report-text mb-2">儿童发展潜力评估报告</h1>
            <p class="font-body text-report-text/60">童智星探 · {{ currentDate }}</p>
          </div>
          <div class="text-right">
            <div class="text-5xl mb-2">🌟</div>
            <span class="font-body text-sm text-report-text/50">教育参考</span>
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="grid grid-cols-4 gap-4 p-4 bg-report-bg rounded-lg">
          <div>
            <span class="font-body text-sm text-report-text/50">姓名</span>
            <p class="font-heading text-lg text-report-text">{{ profileStore.profile.name }}</p>
          </div>
          <div>
            <span class="font-body text-sm text-report-text/50">年龄</span>
            <p class="font-heading text-lg text-report-text">{{ profileStore.profile.age }} 岁</p>
          </div>
          <div>
            <span class="font-body text-sm text-report-text/50">性别</span>
            <p class="font-heading text-lg text-report-text">
              {{ profileStore.profile.gender === 'male' ? '男' : '女' }}
            </p>
          </div>
          <div>
            <span class="font-body text-sm text-report-text/50">年龄组</span>
            <p class="font-heading text-lg text-report-text">
              {{ profileStore.ageGroup === 'young' ? '7-9岁' :
                 profileStore.ageGroup === 'middle' ? '10-12岁' :
                 profileStore.ageGroup === 'teen' ? '13-15岁' : '未知' }}
            </p>
          </div>
        </div>

        <!-- 免责声明提醒 -->
        <div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
          <p class="font-body text-xs text-yellow-800">
            ⚠️ <strong>重要提示：</strong>本报告仅供参考，不能替代专业心理评估。结果基于儿童当前状态，会随成长变化。
          </p>
        </div>
      </div>

      <!-- 综合评价 -->
      <div class="bg-white rounded-xl shadow-sm border border-report-border p-6 mb-6">
        <h2 class="font-heading text-xl text-report-text mb-4 flex items-center gap-2">
          📋 综合评价
        </h2>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <span class="font-body text-sm text-report-text/60">智能发展指数</span>
            <p class="font-heading text-3xl text-report-primary">
              {{ integratedAssessment ? '综合' : '' }}{{ overallAssessment.avgIntelligence }}
            </p>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <span class="font-body text-sm text-report-text/60">认知能力指数</span>
            <p class="font-heading text-3xl text-green-600">{{ overallAssessment.avgCognitive }}</p>
          </div>
        </div>
        <p class="font-body text-report-text/80 leading-relaxed bg-report-bg p-4 rounded-lg">
          {{ integratedAssessment?.overallAssessment.recommendation || overallAssessment.assessment }}
        </p>

        <!-- 可靠性等级 -->
        <div v-if="integratedAssessment" class="mt-3 p-3 rounded-lg" :class="{
          'bg-green-50': integratedAssessment.overallAssessment.reliabilityLevel.includes('高'),
          'bg-yellow-50': integratedAssessment.overallAssessment.reliabilityLevel.includes('中'),
          'bg-red-50': integratedAssessment.overallAssessment.reliabilityLevel.includes('谨慎')
        }">
          <p class="font-body text-sm font-medium" :class="{
            'text-green-700': integratedAssessment.overallAssessment.reliabilityLevel.includes('高'),
            'text-yellow-700': integratedAssessment.overallAssessment.reliabilityLevel.includes('中'),
            'text-red-700': integratedAssessment.overallAssessment.reliabilityLevel.includes('谨慎')
          }">
            📊 评估可靠性：{{ integratedAssessment.overallAssessment.reliabilityLevel }}
          </p>
        </div>
      </div>

      <!-- 游戏-问卷关联分析（仅在游戏完成后显示） -->
      <template v-if="showIntegrationAnalysis && integratedAssessment">
        <!-- 综合智能评分 -->
        <IntegratedScoresCard
          :integrated-scores="integratedAssessment.integratedScores"
          class="mb-6"
        />

        <!-- 一致性分析 -->
        <ConsistencyAnalysisCard
          :consistency="integratedAssessment.consistency"
          class="mb-6"
        />

        <!-- 认知能力验证 -->
        <div class="bg-white rounded-xl shadow-sm border border-report-border p-6 mb-6">
          <h2 class="font-heading text-xl text-report-text mb-4 flex items-center gap-2">
            ✅ 认知能力验证
          </h2>
          <p class="font-body text-sm text-report-text/60 mb-4">
            通过问卷相关智能维度预测游戏表现，与实际游戏结果对比验证
          </p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="(validation, key) in integratedAssessment.cognitiveValidation"
              :key="key"
              class="p-4 rounded-lg border-2 text-center"
              :class="validation.validated ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'"
            >
              <div class="text-2xl mb-1">
                {{ validation.validated ? '✅' : '⚠️' }}
              </div>
              <span class="font-body text-sm text-report-text/60">{{ cognitiveNameMap[key] }}</span>
              <p class="font-heading text-2xl" :class="validation.validated ? 'text-green-600' : 'text-orange-600'">
                {{ validation.score }}
              </p>
              <p class="font-body text-xs text-report-text/50 mt-1">
                {{ validation.source }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <!-- 原有的多元智能分析（如果没有游戏验证时显示） -->
      <template v-if="!showIntegrationAnalysis">

      <!-- 警告信息（如果有） -->
      <div v-if="warnings.length > 0" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
        <h3 class="font-heading text-sm text-yellow-800 mb-2">⚠️ 测评提醒：</h3>
        <ul class="font-body text-sm text-yellow-700 space-y-1">
          <li v-for="(warning, index) in warnings" :key="index">{{ warning }}</li>
        </ul>
      </div>

      <!-- 多元智能分析 -->
      <div class="bg-white rounded-xl shadow-sm border border-report-border p-6 mb-6">
        <h2 class="font-heading text-xl text-report-text mb-4 flex items-center gap-2">
          🧠 多元智能分析
        </h2>

        <div class="grid md:grid-cols-2 gap-6">
          <!-- 雷达图 -->
          <div>
            <RadarChart
              title="多元智能分布"
              :data="intelligenceChartData"
              color="#2563EB"
            />
          </div>

          <!-- 优势智能 -->
          <div>
            <h3 class="font-heading text-lg text-report-text mb-3">🌟 优势智能 TOP3</h3>
            <div class="space-y-3">
              <div
                v-for="(item, index) in intelligenceSuggestions.strengths"
                :key="index"
                class="p-3 bg-blue-50 rounded-lg"
              >
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xl">{{ item.icon }}</span>
                  <span class="font-heading text-report-text">{{ item.name }}</span>
                  <span class="ml-auto font-heading text-report-primary">{{ item.score }}分</span>
                </div>
                <!-- 标准分显示（如果可用）-->
                <div v-if="hasEnhancedScores" class="text-xs text-blue-600/70 mb-1">
                  标准分: T{{ getStandardScoreDisplay(item.name.split(' ')[0]?.toLowerCase() || '')?.score || '-' }}
                  (超过{{ getStandardScoreDisplay(item.name.split(' ')[0]?.toLowerCase() || '')?.percentile || '-' }}%同龄人)
                </div>
                <p class="font-body text-sm text-report-text/70">{{ item.suggestion }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 提升建议 -->
        <div class="mt-6">
          <h3 class="font-heading text-lg text-report-text mb-3">💪 提升建议</h3>
          <div class="grid md:grid-cols-2 gap-3">
            <div
              v-for="(item, index) in intelligenceSuggestions.improvements"
              :key="index"
              class="p-3 bg-orange-50 rounded-lg"
            >
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xl">{{ item.icon }}</span>
                <span class="font-heading text-report-text">{{ item.name }}</span>
                <span class="ml-auto font-heading text-orange-600">{{ item.score }}分</span>
              </div>
              <p class="font-body text-sm text-report-text/70">{{ item.suggestion }}</p>
            </div>
          </div>
        </div>
      </div>
      </template>

      <!-- 职业兴趣分析（始终显示） -->
      <div class="bg-white rounded-xl shadow-sm border border-report-border p-6 mb-6">
        <h2 class="font-heading text-xl text-report-text mb-4 flex items-center gap-2">
          💼 职业兴趣分析
        </h2>

        <div class="grid md:grid-cols-2 gap-6">
          <!-- 雷达图 -->
          <div>
            <RadarChart
              title="霍兰德职业兴趣"
              :data="interestChartData"
              color="#F97316"
            />
          </div>

          <!-- 职业建议 -->
          <div>
            <div class="mb-4">
              <span class="font-body text-sm text-report-text/60">霍兰德代码</span>
              <p class="font-heading text-2xl text-report-cta">{{ hollandCode }}</p>
            </div>

            <h3 class="font-heading text-lg text-report-text mb-3">🎯 推荐职业方向</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="career in careerSuggestions"
                :key="career"
                class="px-3 py-1 bg-orange-50 text-orange-700 rounded-full font-body text-sm"
              >
                {{ career }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 认知能力分析 -->
      <div class="bg-white rounded-xl shadow-sm border border-report-border p-6 mb-6">
        <h2 class="font-heading text-xl text-report-text mb-4 flex items-center gap-2">
          🎮 认知能力分析
        </h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ScoreCard
            title="注意力"
            :score="cognitiveScores.attention"
            icon="🎯"
            color="#EF4444"
            description="舒尔特方格测试"
          />
          <ScoreCard
            title="记忆力"
            :score="cognitiveScores.memory"
            icon="🧠"
            color="#3B82F6"
            description="图形记忆测试"
          />
          <ScoreCard
            title="逻辑思维"
            :score="cognitiveScores.logic"
            icon="🧩"
            color="#10B981"
            description="规律推理测试"
          />
          <ScoreCard
            title="创造力"
            :score="cognitiveScores.creativity"
            icon="💡"
            color="#F59E0B"
            description="发散思维测试"
          />
        </div>
      </div>

      <!-- 数据说明 -->
      <div class="bg-gray-50 border border-gray-200 p-4 mb-6 rounded-lg text-sm">
        <h3 class="font-heading text-sm text-gray-800 mb-2">📊 数据说明</h3>
        <ul class="font-body text-xs text-gray-600 space-y-1">
          <li>• 本测评使用增强版题库（多元智能{{ questionnaireStore.intelligenceQuestions.length }}题，职业兴趣{{ questionnaireStore.interestQuestions.length }}题）</li>
          <li>• 题目已根据年龄组（{{ profileStore.ageGroup === 'young' ? '7-9岁' : profileStore.ageGroup === 'middle' ? '10-12岁' : '13-15岁' }}）进行适配</li>
          <li v-if="showIntegrationAnalysis">• 已完成认知游戏验证，问卷与游戏结果已进行关联分析，评估可靠性更高</li>
          <li v-if="hasEnhancedScores">• 评分包含标准分转换和信度检验</li>
          <li v-else-if="!showIntegrationAnalysis">• 当前使用临时常模数据，建议完成所有游戏后获得更准确的评估</li>
        </ul>
      </div>

      <!-- 底部操作 -->
      <div class="flex gap-4 justify-center print:hidden">
        <button
          @click="restartAssessment"
          class="px-6 py-3 bg-white border border-report-border rounded-lg font-body text-report-text hover:bg-gray-50 transition-colors"
        >
          重新测评
        </button>
        <button
          @click="handleExportPDF"
          :disabled="isExporting"
          class="px-6 py-3 bg-report-cta text-white rounded-lg font-body hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {{ isExporting ? '导出中...' : '导出 PDF 📄' }}
        </button>
        <button
          @click="printReport"
          class="px-6 py-3 bg-report-primary text-white rounded-lg font-body hover:bg-blue-700 transition-colors"
        >
          打印报告 🖨️
        </button>
      </div>

      <!-- 免责声明 -->
      <div class="mt-6 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
        <p class="font-semibold mb-2">⚠️ 免责声明：</p>
        <p>本评估报告基于Howard Gardner多元智能理论和John Holland职业兴趣理论生成，仅供参考使用。
        测评结果受多种因素影响，不能完全代表儿童的实际能力或未来发展潜力。
        如需专业评估或建议，请咨询合格的心理咨询师或教育评估专家。</p>
      </div>

      <!-- 版权信息 -->
      <p class="text-center mt-8 font-body text-sm text-report-text/40">
        © 2026 童智星探 · 儿童发展潜力评估系统（增强版）
      </p>
    </div>
  </div>
</template>

<style>
@media print {
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
