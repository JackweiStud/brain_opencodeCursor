import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProfileStore } from './profile'
import {
  getShuffledIntelligenceQuestions,
  reverseScore
} from '@/data/intelligenceQuestionsEnhanced'
import {
  getShuffledInterestQuestions,
  reverseInterestScore
} from '@/data/interestQuestionsEnhanced'
import { scoreQuestionnaire } from '@/utils/scoringEnhanced'

// 答案记录（存储单个答案）
export interface AnswerRecord {
  questionId: string
  score: number
  questionType: 'intelligence' | 'interest'
}

// 增强评分结果
export interface EnhancedScoreResult {
  rawScore: number
  standardScore: number
  percentile: number
  confidenceInterval: { lower: number; upper: number }
  reliability: number
  warnings: string[]
  reliabilityFlag: boolean
}

export const useQuestionnaireEnhancedStore = defineStore('questionnaireEnhanced', () => {
  const profileStore = useProfileStore()

  // State - 存储所有答案记录
  const answerRecords = ref<AnswerRecord[]>([])
  const currentSection = ref<'intelligence' | 'interest'>('intelligence')
  const currentQuestionIndex = ref(0)
  const disclaimerAccepted = ref(false)
  const normCollectionConsent = ref(false)

  // 当前年龄组
  const ageGroup = computed(() => profileStore.ageGroup as 'young' | 'middle' | 'teen' | 'unknown')

  // ========== 题目获取 ==========

  // 反向题ID列表（需要从题目库中获取）
  const intelligenceReverseQuestions = ref<string[]>([])
  const interestReverseQuestions = ref<string[]>([])
  const socialDesirabilityQuestions = ref<string[]>([])

  // 初始化反向题ID列表
  function initReverseQuestionLists() {
    const intellQuestions = getShuffledIntelligenceQuestions(ageGroup.value === 'unknown' ? 'middle' : ageGroup.value)
    const interestQuestions = getShuffledInterestQuestions(ageGroup.value === 'unknown' ? 'middle' : ageGroup.value)

    intelligenceReverseQuestions.value = intellQuestions
      .filter(q => q.direction === 'reverse')
      .map(q => q.id)

    interestReverseQuestions.value = interestQuestions
      .filter(q => q.direction === 'reverse')
      .map(q => q.id)

    socialDesirabilityQuestions.value = interestQuestions
      .filter(q => q.id.startsWith('sds-'))
      .map(q => q.id)
  }

  // 获取当前年龄组的多远智能题目
  const intelligenceQuestions = computed(() => {
    const ag = ageGroup.value === 'unknown' ? 'middle' : ageGroup.value
    return getShuffledIntelligenceQuestions(ag)
  })

  // 获取当前年龄组的职业兴趣题目
  const interestQuestions = computed(() => {
    const ag = ageGroup.value === 'unknown' ? 'middle' : ageGroup.value
    return getShuffledInterestQuestions(ag)
  })

  // ========== 进度计算 ==========

  const totalIntelligenceQuestions = computed(() => intelligenceQuestions.value.length)
  const totalInterestQuestions = computed(() => interestQuestions.value.length)
  const totalQuestions = computed(() => totalIntelligenceQuestions.value + totalInterestQuestions.value)

  const answeredIntelligenceCount = computed(() =>
    answerRecords.value.filter(a => a.questionType === 'intelligence').length
  )

  const answeredInterestCount = computed(() =>
    answerRecords.value.filter(a => a.questionType === 'interest').length
  )

  const answeredCount = computed(() => answerRecords.value.length)

  const progress = computed(() => {
    if (totalQuestions.value === 0) return 0
    return Math.round((answeredCount.value / totalQuestions.value) * 100)
  })

  // ========== 评分计算 ==========

  // 计算多元智能原始分数（考虑反向题）
  const intelligenceRawScores = computed(() => {
    // 初始化所有类型为0
    const allTypes = ['linguistic', 'logical', 'spatial', 'musical', 'bodily', 'interpersonal', 'intrapersonal', 'naturalistic']
    const result: Record<string, number> = {}
    allTypes.forEach(type => result[type] = 0)

    const scores: Record<string, { total: number; count: number }> = {}

    for (const record of answerRecords.value) {
      if (record.questionType !== 'intelligence') continue

      // 提取类型（从questionId中获取，如 'ling-01' -> 'linguistic'）
      const type = getQuestionType(record.questionId)
      if (!type) continue

      if (!scores[type]) scores[type] = { total: 0, count: 0 }

      // 判断是否为反向题
      const isReverse = intelligenceReverseQuestions.value.includes(record.questionId)
      const adjustedScore = isReverse ? reverseScore(record.score) : record.score

      scores[type].total += adjustedScore
      scores[type].count++
    }

    // 转换为百分比
    for (const [type, data] of Object.entries(scores)) {
      if (data.count > 0) {
        // 计算该类型的最大可能分数
        const maxScore = data.count * 5
        result[type] = Math.round((data.total / maxScore) * 100)
      }
    }

    return result
  })

  // 计算职业兴趣原始分数（考虑反向题）
  const interestRawScores = computed(() => {
    // 初始化所有类型为0
    const allTypes = ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional']
    const result: Record<string, number> = {}
    allTypes.forEach(type => result[type] = 0)

    const scores: Record<string, { total: number; count: number }> = {}

    for (const record of answerRecords.value) {
      if (record.questionType !== 'interest') continue

      const type = getQuestionType(record.questionId)
      if (!type) continue

      if (!scores[type]) scores[type] = { total: 0, count: 0 }

      const isReverse = interestReverseQuestions.value.includes(record.questionId)
      const adjustedScore = isReverse ? reverseInterestScore(record.score) : record.score

      scores[type].total += adjustedScore
      scores[type].count++
    }

    // 转换为百分比
    for (const [type, data] of Object.entries(scores)) {
      if (data.count > 0) {
        const maxScore = data.count * 5
        result[type] = Math.round((data.total / maxScore) * 100)
      }
    }

    return result
  })

  // ========== 增强评分（标准分、信度等） ==========

  // 多元智能增强评分
  const intelligenceEnhancedScores = computed<Record<string, EnhancedScoreResult>>(() => {
    const ag = ageGroup.value === 'unknown' ? 'middle' : ageGroup.value
    const types = ['linguistic', 'logical', 'spatial', 'musical', 'bodily', 'interpersonal', 'intrapersonal', 'naturalistic']
    const results: Record<string, EnhancedScoreResult> = {}

    for (const type of types) {
      // 获取该类型的所有答案
      const typeAnswers = answerRecords.value
        .filter(a => a.questionType === 'intelligence' && getQuestionType(a.questionId) === type)

      if (typeAnswers.length === 0) {
        results[type] = {
          rawScore: 0,
          standardScore: 0,
          percentile: 0,
          confidenceInterval: { lower: 0, upper: 0 },
          reliability: 0,
          warnings: [],
          reliabilityFlag: false
        }
        continue
      }

      const result = scoreQuestionnaire(
        typeAnswers,
        'intelligence',
        ag,
        typeAnswers.length,
        intelligenceReverseQuestions.value.filter(id => id.startsWith(type.substring(0, 4))),
        []
      )

      results[type] = result
    }

    return results
  })

  // 职业兴趣增强评分
  const interestEnhancedScores = computed<Record<string, EnhancedScoreResult>>(() => {
    const ag = ageGroup.value === 'unknown' ? 'middle' : ageGroup.value
    const types = ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional']
    const results: Record<string, EnhancedScoreResult> = {}

    for (const type of types) {
      const typeAnswers = answerRecords.value
        .filter(a => a.questionType === 'interest' && getQuestionType(a.questionId) === type)

      if (typeAnswers.length === 0) {
        results[type] = {
          rawScore: 0,
          standardScore: 0,
          percentile: 0,
          confidenceInterval: { lower: 0, upper: 0 },
          reliability: 0,
          warnings: [],
          reliabilityFlag: false
        }
        continue
      }

      const result = scoreQuestionnaire(
        typeAnswers,
        'interest',
        ag,
        typeAnswers.length,
        interestReverseQuestions.value.filter(id => id.startsWith(type.substring(0, 4))),
        socialDesirabilityQuestions.value
      )

      results[type] = result
    }

    return results
  })

  // ========== 兼容性属性（供现有组件使用）==========

  const intelligenceScores = computed(() => intelligenceRawScores.value)
  const interestScores = computed(() => interestRawScores.value)

  // ========== Actions ==========

  // 记录答案
  function answerIntelligence(questionId: string, score: number) {
    answerRecords.value.push({
      questionId,
      score,
      questionType: 'intelligence'
    })
    saveToStorage()
  }

  function answerInterest(questionId: string, score: number) {
    answerRecords.value.push({
      questionId,
      score,
      questionType: 'interest'
    })
    saveToStorage()
  }

  // 切换部分
  function setCurrentSection(section: 'intelligence' | 'interest') {
    currentSection.value = section
  }

  // 重置所有答案
  function resetAnswers() {
    answerRecords.value = []
    currentSection.value = 'intelligence'
    currentQuestionIndex.value = 0
    localStorage.removeItem('kidpotential_questionnaire_enhanced')
    initReverseQuestionLists()
  }

  // 设置免责声明接受状态
  function setDisclaimerAccepted(accepted: boolean) {
    disclaimerAccepted.value = accepted
    localStorage.setItem('kidpotential_disclaimer_accepted', accepted.toString())
  }

  // 设置常模收集同意状态
  function setNormCollectionConsent(consent: boolean) {
    normCollectionConsent.value = consent
    localStorage.setItem('kidpotential_norm_consent', consent.toString())
  }

  // 存储到本地
  function saveToStorage() {
    localStorage.setItem('kidpotential_questionnaire_enhanced', JSON.stringify({
      answerRecords: answerRecords.value,
      currentSection: currentSection.value,
      currentQuestionIndex: currentQuestionIndex.value
    }))
  }

  // 从本地加载
  function loadFromStorage() {
    const saved = localStorage.getItem('kidpotential_questionnaire_enhanced')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        answerRecords.value = data.answerRecords || []
        currentSection.value = data.currentSection || 'intelligence'
        currentQuestionIndex.value = data.currentQuestionIndex || 0
      } catch (e) {
        console.error('Failed to load questionnaire data:', e)
      }
    }

    // 加载免责声明状态
    const disclaimerSaved = localStorage.getItem('kidpotential_disclaimer_accepted')
    if (disclaimerSaved) {
      disclaimerAccepted.value = disclaimerSaved === 'true'
    }

    // 加载常模收集同意状态
    const consentSaved = localStorage.getItem('kidpotential_norm_consent')
    if (consentSaved) {
      normCollectionConsent.value = consentSaved === 'true'
    }

    // 初始化反向题列表
    initReverseQuestionLists()
  }

  // ========== 工具函数 ==========

  // 从questionId中提取类型
  function getQuestionType(questionId: string): string | null {
    // linguistic: ling-01
    // logical: logi-01
    // realistic: real-01
    const prefix = questionId.substring(0, 4)
    const typeMap: Record<string, string> = {
      'ling-': 'linguistic',
      'logi-': 'logical',
      'spat-': 'spatial',
      'musi-': 'musical',
      'bodi-': 'bodily',
      'inte': 'interpersonal',
      'intr': 'intrapersonal',
      'natu-': 'naturalistic',
      'real-': 'realistic',
      'inve-': 'investigative',
      'arti-': 'artistic',
      'soci-': 'social',
      'ente-': 'enterprising',
      'conv-': 'conventional'
    }

    return typeMap[prefix] || null
  }

  // 获取当前题目（用于问卷流程）
  function getCurrentQuestion() {
    if (currentSection.value === 'intelligence') {
      const questions = intelligenceQuestions.value
      const answered = answeredIntelligenceCount.value
      return questions[answered] || null
    } else {
      const questions = interestQuestions.value
      const answered = answeredInterestCount.value
      return questions[answered] || null
    }
  }

  // 检查是否有警告
  const hasWarnings = computed(() => {
    for (const result of Object.values(intelligenceEnhancedScores.value)) {
      if (result.warnings.length > 0) return true
    }
    for (const result of Object.values(interestEnhancedScores.value)) {
      if (result.warnings.length > 0) return true
    }
    return false
  })

  // 获取所有警告
  const allWarnings = computed(() => {
    const warnings: string[] = []
    for (const result of Object.values(intelligenceEnhancedScores.value)) {
      warnings.push(...result.warnings)
    }
    for (const result of Object.values(interestEnhancedScores.value)) {
      warnings.push(...result.warnings)
    }
    return [...new Set(warnings)] // 去重
  })

  // 初始化
  loadFromStorage()

  return {
    // State
    answerRecords,
    currentSection,
    currentQuestionIndex,
    disclaimerAccepted,
    normCollectionConsent,

    // Computed
    ageGroup,
    intelligenceQuestions,
    interestQuestions,
    totalQuestions,
    answeredCount,
    progress,
    intelligenceScores,
    interestScores,
    intelligenceRawScores,
    interestRawScores,
    intelligenceEnhancedScores,
    interestEnhancedScores,
    hasWarnings,
    allWarnings,

    // Actions
    answerIntelligence,
    answerInterest,
    setCurrentSection,
    resetAnswers,
    setDisclaimerAccepted,
    setNormCollectionConsent,
    loadFromStorage,
    getCurrentQuestion
  }
})
