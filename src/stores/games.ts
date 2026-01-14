import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { normalizeGameResults } from '../utils/gameQuestionnaireIntegration'

export interface GameResults {
  schulte: {
    times: number[]      // 3次完成时间（秒）
    errors: number[]     // 3次错误次数
  }
  memory: {
    scores: number[]     // 3次正确率（0-100）
  }
  logic: {
    answers: boolean[]   // 3道题对错
    times: number[]      // 3道题用时
  }
  creative: {
    answers: string[][]  // 2道题的答案列表
  }
}

// 标准化认知能力分数（0-100）
export interface NormalizedCognitiveScores {
  attention: number
  memory: number
  logic: number
  creativity: number
}

export const useGamesStore = defineStore('games', () => {
  // State
  const results = ref<GameResults>({
    schulte: { times: [], errors: [] },
    memory: { scores: [] },
    logic: { answers: [], times: [] },
    creative: { answers: [] }
  })

  const currentGame = ref<'schulte' | 'memory' | 'logic' | 'creative'>('schulte')
  const currentRound = ref(0)

  // Getters
  const schulteScore = computed(() => {
    const times = results.value.schulte.times
    if (times.length === 0) return 0
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length
    // 评分：60秒以内100分，每多10秒减10分，最低0分
    return Math.max(0, Math.round(100 - (avgTime - 60) / 10 * 10))
  })

  const memoryScore = computed(() => {
    const scores = results.value.memory.scores
    if (scores.length === 0) return 0
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  })

  const logicScore = computed(() => {
    const answers = results.value.logic.answers
    if (answers.length === 0) return 0
    const correct = answers.filter(a => a).length
    return Math.round((correct / answers.length) * 100)
  })

  const creativeScore = computed(() => {
    const answers = results.value.creative.answers
    if (answers.length === 0) return 0
    // 评分：答案数量 + 多样性
    let totalAnswers = 0
    const uniqueCategories = new Set<string>()
    for (const round of answers) {
      totalAnswers += round.length
      round.forEach(a => uniqueCategories.add(a.charAt(0))) // 简化的多样性计算
    }
    const quantityScore = Math.min(50, totalAnswers * 5)
    const diversityScore = Math.min(50, uniqueCategories.size * 10)
    return quantityScore + diversityScore
  })

  // 标准化认知能力分数（用于与问卷关联分析）
  const normalizedScores = computed<NormalizedCognitiveScores>(() => {
    return normalizeGameResults(results.value)
  })

  // 所有游戏是否完成
  const allGamesCompleted = computed(() => {
    return results.value.schulte.times.length >= 3 &&
           results.value.memory.scores.length >= 3 &&
           results.value.logic.answers.length >= 3 &&
           results.value.creative.answers.length >= 2
  })

  // Actions
  function recordSchulte(time: number, errors: number) {
    results.value.schulte.times.push(time)
    results.value.schulte.errors.push(errors)
    saveToStorage()
  }

  function recordMemory(score: number) {
    results.value.memory.scores.push(score)
    saveToStorage()
  }

  function recordLogic(correct: boolean, time: number) {
    results.value.logic.answers.push(correct)
    results.value.logic.times.push(time)
    saveToStorage()
  }

  function recordCreative(answers: string[]) {
    results.value.creative.answers.push(answers)
    saveToStorage()
  }

  function resetGames() {
    results.value = {
      schulte: { times: [], errors: [] },
      memory: { scores: [] },
      logic: { answers: [], times: [] },
      creative: { answers: [] }
    }
    currentGame.value = 'schulte'
    currentRound.value = 0
    localStorage.removeItem('kidpotential_games')
  }

  function saveToStorage() {
    localStorage.setItem('kidpotential_games', JSON.stringify({
      results: results.value,
      currentGame: currentGame.value,
      currentRound: currentRound.value
    }))
  }

  function loadFromStorage() {
    const saved = localStorage.getItem('kidpotential_games')
    if (saved) {
      const data = JSON.parse(saved)
      results.value = data.results
      currentGame.value = data.currentGame
      currentRound.value = data.currentRound
    }
  }

  loadFromStorage()

  return {
    results,
    currentGame,
    currentRound,
    schulteScore,
    memoryScore,
    logicScore,
    creativeScore,
    normalizedScores,
    allGamesCompleted,
    recordSchulte,
    recordMemory,
    recordLogic,
    recordCreative,
    resetGames,
    loadFromStorage
  }
})
