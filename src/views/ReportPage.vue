<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RadarChart, ScoreCard } from '../components/report'
import { useProfileStore } from '../stores/profile'
import { useQuestionnaireStore } from '../stores/questionnaire'
import { useGamesStore } from '../stores/games'
import { useReportStore } from '../stores/report'
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
import { intelligenceTypes } from '../data/intelligenceQuestions'
import { interestTypes } from '../data/interestQuestions'

const router = useRouter()
const isExporting = ref(false)
const profileStore = useProfileStore()
const questionnaireStore = useQuestionnaireStore()
const gamesStore = useGamesStore()
const reportStore = useReportStore()

const reportRef = ref<HTMLDivElement | null>(null)

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

// 当前日期
const currentDate = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

// 重新测评
const restartAssessment = () => {
  reportStore.resetAll()
  router.push('/')
}

// 导出 PDF
const handleExportPDF = async () => {
  if (!reportRef.value || isExporting.value) return
  
  isExporting.value = true
  try {
    await exportToPDF(reportRef.value, {
      filename: `童智星探-${profileStore.profile.name}-评估报告`
    })
  } catch (error) {
    alert('PDF 导出失败，请重试')
  } finally {
    isExporting.value = false
  }
}

onMounted(() => {
  reportStore.generateReport()
})
</script>

<template>
  <div class="min-h-screen bg-report-bg">
    <!-- 报告内容 -->
    <div ref="reportRef" class="max-w-4xl mx-auto py-8 px-4">
      <!-- 报告头部 -->
      <div class="bg-white rounded-xl shadow-sm border border-report-border p-8 mb-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="font-heading text-3xl text-report-text mb-2">儿童发展潜力评估报告</h1>
            <p class="font-body text-report-text/60">童智星探 · {{ currentDate }}</p>
          </div>
          <div class="text-right">
            <div class="text-5xl mb-2">🌟</div>
            <span class="font-body text-sm text-report-text/50">专业评估</span>
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="grid grid-cols-3 gap-4 p-4 bg-report-bg rounded-lg">
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
            <p class="font-heading text-3xl text-report-primary">{{ overallAssessment.avgIntelligence }}</p>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <span class="font-body text-sm text-report-text/60">认知能力指数</span>
            <p class="font-heading text-3xl text-green-600">{{ overallAssessment.avgCognitive }}</p>
          </div>
        </div>
        <p class="font-body text-report-text/80 leading-relaxed bg-report-bg p-4 rounded-lg">
          {{ overallAssessment.assessment }}
        </p>
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

      <!-- 职业兴趣分析 -->
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
          @click="() => window.print()"
          class="px-6 py-3 bg-report-primary text-white rounded-lg font-body hover:bg-blue-700 transition-colors"
        >
          打印报告 🖨️
        </button>
      </div>

      <!-- 版权信息 -->
      <p class="text-center mt-8 font-body text-sm text-report-text/40">
        © 2026 童智星探 · 儿童发展潜力评估系统
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
