import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { normalizeGameResults } from '../utils/gameQuestionnaireIntegration'

// 发散思维单轮结果
export interface CreativeRoundResult {
  promptItem: string      // 题目物品（如 "📎 回形针"）
  promptQuestion: string  // 题目问题
  promptCategory: string  // 题目类别（生活物品/科学探索/天文宇宙/哲学思辨）
  referenceAnswers: string[]  // 参考答案
  userAnswers: string[]   // 用户作答
}

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
    rounds: CreativeRoundResult[]  // 2轮完整数据
    answers: string[][]  // 兼容旧格式：2道题的答案列表
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
    creative: { rounds: [], answers: [] }
  })

  const currentGame = ref<'schulte' | 'memory' | 'logic' | 'creative'>('schulte')
  const currentRound = ref(0)

  // Getters
  const schulteScore = computed(() => {
    const times = results.value.schulte.times
    if (times.length === 0) return 0
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length
    // 评分：基于平均完成时间
    // 5秒以内满分100，60秒以上0分，线性递减
    // 公式：100 - (avgTime - 5) * (100 / 55)
    const score = 100 - (avgTime - 5) * (100 / 55)
    return Math.max(0, Math.min(100, Math.round(score)))
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
    // 优先使用新格式，兼容旧格式
    const rounds = results.value.creative.rounds
    const answers = rounds.length > 0 
      ? rounds.map(r => r.userAnswers) 
      : results.value.creative.answers
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

  function recordCreative(
    answers: string[],
    promptInfo?: { item: string; question: string; examples: string[]; category?: string }
  ) {
    // 兼容旧调用方式
    results.value.creative.answers.push(answers)
    
    // 确保 rounds 数组存在（兼容旧数据）
    if (!results.value.creative.rounds) {
      results.value.creative.rounds = []
    }
    
    // 如果有题目信息，存储完整数据
    if (promptInfo) {
      results.value.creative.rounds.push({
        promptItem: promptInfo.item,
        promptQuestion: promptInfo.question,
        promptCategory: promptInfo.category || '生活物品',
        referenceAnswers: promptInfo.examples,
        userAnswers: answers
      })
    }
    saveToStorage()
  }

  function resetGames() {
    results.value = {
      schulte: { times: [], errors: [] },
      memory: { scores: [] },
      logic: { answers: [], times: [] },
      creative: { rounds: [], answers: [] }
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
      
      // 兼容旧数据：确保 creative.rounds 存在
      if (!results.value.creative.rounds) {
        results.value.creative.rounds = []
      }
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
