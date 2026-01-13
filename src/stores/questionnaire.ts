import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface QuestionnaireAnswers {
  multipleIntelligence: Record<string, number[]>  // 每种智能3道题的答案
  hollandInterest: Record<string, number[]>       // 每种兴趣3道题的答案
}

export const useQuestionnaireStore = defineStore('questionnaire', () => {
  // State
  const answers = ref<QuestionnaireAnswers>({
    multipleIntelligence: {
      linguistic: [],
      logical: [],
      spatial: [],
      musical: [],
      bodily: [],
      interpersonal: [],
      intrapersonal: [],
      naturalistic: []
    },
    hollandInterest: {
      realistic: [],
      investigative: [],
      artistic: [],
      social: [],
      enterprising: [],
      conventional: []
    }
  })

  const currentSection = ref<'intelligence' | 'interest'>('intelligence')
  const currentQuestionIndex = ref(0)

  // Getters
  const intelligenceScores = computed(() => {
    const scores: Record<string, number> = {}
    for (const [key, values] of Object.entries(answers.value.multipleIntelligence)) {
      scores[key] = values.length > 0 
        ? Math.round(values.reduce((a, b) => a + b, 0) / values.length * 20) 
        : 0
    }
    return scores
  })

  const interestScores = computed(() => {
    const scores: Record<string, number> = {}
    for (const [key, values] of Object.entries(answers.value.hollandInterest)) {
      scores[key] = values.length > 0 
        ? Math.round(values.reduce((a, b) => a + b, 0) / values.length * 20) 
        : 0
    }
    return scores
  })

  const totalQuestions = computed(() => 24 + 18) // 42道题

  const answeredCount = computed(() => {
    let count = 0
    for (const values of Object.values(answers.value.multipleIntelligence)) {
      count += values.length
    }
    for (const values of Object.values(answers.value.hollandInterest)) {
      count += values.length
    }
    return count
  })

  const progress = computed(() => {
    return Math.round((answeredCount.value / totalQuestions.value) * 100)
  })

  // Actions
  function answerIntelligence(type: string, score: number) {
    if (!answers.value.multipleIntelligence[type]) {
      answers.value.multipleIntelligence[type] = []
    }
    answers.value.multipleIntelligence[type].push(score)
    saveToStorage()
  }

  function answerInterest(type: string, score: number) {
    if (!answers.value.hollandInterest[type]) {
      answers.value.hollandInterest[type] = []
    }
    answers.value.hollandInterest[type].push(score)
    saveToStorage()
  }

  function resetAnswers() {
    answers.value = {
      multipleIntelligence: {
        linguistic: [],
        logical: [],
        spatial: [],
        musical: [],
        bodily: [],
        interpersonal: [],
        intrapersonal: [],
        naturalistic: []
      },
      hollandInterest: {
        realistic: [],
        investigative: [],
        artistic: [],
        social: [],
        enterprising: [],
        conventional: []
      }
    }
    currentSection.value = 'intelligence'
    currentQuestionIndex.value = 0
    localStorage.removeItem('kidpotential_questionnaire')
  }

  function saveToStorage() {
    localStorage.setItem('kidpotential_questionnaire', JSON.stringify({
      answers: answers.value,
      currentSection: currentSection.value,
      currentQuestionIndex: currentQuestionIndex.value
    }))
  }

  function loadFromStorage() {
    const saved = localStorage.getItem('kidpotential_questionnaire')
    if (saved) {
      const data = JSON.parse(saved)
      answers.value = data.answers
      currentSection.value = data.currentSection
      currentQuestionIndex.value = data.currentQuestionIndex
    }
  }

  loadFromStorage()

  return {
    answers,
    currentSection,
    currentQuestionIndex,
    intelligenceScores,
    interestScores,
    totalQuestions,
    answeredCount,
    progress,
    answerIntelligence,
    answerInterest,
    resetAnswers,
    loadFromStorage
  }
})
