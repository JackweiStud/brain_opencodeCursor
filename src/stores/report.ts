import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProfileStore } from './profile'
import { useQuestionnaireEnhancedStore } from './questionnaireEnhanced'
import { useGamesStore } from './games'
import { clearAIAssessmentStorage } from '@/utils/aiAssessment'

export const useReportStore = defineStore('report', () => {
  const profileStore = useProfileStore()
  const questionnaireStore = useQuestionnaireEnhancedStore()
  const gamesStore = useGamesStore()

  // State
  const generatedAt = ref('')

  // Getters - 综合报告数据
  const reportData = computed(() => ({
    profile: profileStore.profile,
    ageGroup: profileStore.ageGroup,
    intelligence: questionnaireStore.intelligenceScores,
    interest: questionnaireStore.interestScores,
    cognitive: {
      attention: gamesStore.schulteScore,
      memory: gamesStore.memoryScore,
      logic: gamesStore.logicScore,
      creativity: gamesStore.creativeScore
    }
  }))

  // 优势智能（前3名）
  const topIntelligences = computed(() => {
    const scores = questionnaireStore.intelligenceScores
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([key, value]) => ({ type: key, score: value }))
  })

  // 职业兴趣倾向（前2名）
  const topInterests = computed(() => {
    const scores = questionnaireStore.interestScores
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([key, value]) => ({ type: key, score: value }))
  })

  // 认知能力综合得分
  const cognitiveOverall = computed(() => {
    const { attention, memory, logic, creativity } = reportData.value.cognitive
    return Math.round((attention + memory + logic + creativity) / 4)
  })

  // Actions
  function generateReport() {
    generatedAt.value = new Date().toISOString()
    saveToStorage()
  }

  function resetAll() {
    profileStore.resetProfile()
    questionnaireStore.resetAnswers()
    gamesStore.resetGames()
    generatedAt.value = ''
    localStorage.removeItem('kidpotential_report')
    // 清除 AI 评估结果
    clearAIAssessmentStorage()
  }

  function saveToStorage() {
    localStorage.setItem('kidpotential_report', JSON.stringify({
      generatedAt: generatedAt.value
    }))
  }

  function loadFromStorage() {
    const saved = localStorage.getItem('kidpotential_report')
    if (saved) {
      const data = JSON.parse(saved)
      generatedAt.value = data.generatedAt
    }
  }

  loadFromStorage()

  return {
    generatedAt,
    reportData,
    topIntelligences,
    topInterests,
    cognitiveOverall,
    generateReport,
    resetAll,
    loadFromStorage
  }
})
