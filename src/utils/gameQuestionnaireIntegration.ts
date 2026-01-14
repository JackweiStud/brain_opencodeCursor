// 游戏-问卷关联分析系统
// 用于关联认知游戏结果与多元智能问卷结果，提供综合评估

// ========== 类型定义 ==========

export interface GameIntelligenceMapping {
  // 游戏类型与智能类型的关联度（0-1）
  [key: string]: Record<string, number>
}

export interface ConsistencyAnalysis {
  overall: number           // 总体一致性（0-100）
  byDimension: Record<string, {
    questionnaireScore: number    // 问卷分数
    gameScore: number             // 游戏分数
    consistency: number           // 一致性分数（0-100）
    gap: number                   // 差距
    interpretation: string        // 解读
  }>
  reliableDimensions: string[]    // 可信维度（两者一致）
  alertDimensions: string[]       // 需关注维度（差异较大）
}

export interface IntegratedAssessment {
  // 综合智能评分（结合问卷和游戏）
  integratedScores: Record<string, {
    questionnaireScore: number
    gameScore: number
    weightedScore: number      // 加权综合分数
    confidence: 'high' | 'medium' | 'low'  // 置信度
  }>

  // 认知能力验证结果
  cognitiveValidation: {
    attention: { validated: boolean; score: number; source: string }
    memory: { validated: boolean; score: number; source: string }
    logic: { validated: boolean; score: number; source: string }
    creativity: { validated: boolean; score: number; source: string }
  }

  // 一致性分析
  consistency: ConsistencyAnalysis

  // 综合评价
  overallAssessment: {
    reliabilityLevel: string    // 可靠性等级
    recommendation: string      // 建议
    flags: string[]             // 需要关注的flag
  }
}

// ========== 游戏-智能映射 ==========

/**
 * 游戏与智能类型的映射关系
 * 基于认知心理学研究和多元智能理论
 */
export const gameIntelligenceMapping: GameIntelligenceMapping = {
  // 舒尔特方格（注意力）主要关联的智能类型
  attention: {
    logical: 0.45,        // 注意力是逻辑推理的基础
    spatial: 0.35,        // 视觉搜索需要空间能力
    intrapersonal: 0.15,  // 自我控制与专注
    naturalistic: 0.05    // 细节观察
  },

  // 记忆力游戏主要关联的智能类型
  memory: {
    linguistic: 0.30,     // 语言记忆
    spatial: 0.35,        // 图形/空间记忆
    musical: 0.15,        // 节奏记忆
    logical: 0.20         // 逻辑记忆
  },

  // 逻辑推理游戏主要关联的智能类型
  logic: {
    logical: 0.60,        // 主要关联逻辑智能
    spatial: 0.15,        // 图形规律
    linguistic: 0.10,     // 语言逻辑
    naturalistic: 0.15    // 自然规律
  },

  // 创造力游戏主要关联的智能类型
  creativity: {
    linguistic: 0.25,     // 词汇创造力
    spatial: 0.30,        // 图形创造力
    bodily: 0.15,         // 动作创意
    naturalistic: 0.20,   // 自然联想
    musical: 0.10         // 音乐创意
  }
}

// 反向映射：智能类型关联的游戏
export const intelligenceToGameMapping: Record<string, Array<{ game: string; weight: number }>> = {
  linguistic: [
    { game: 'memory', weight: 0.30 },
    { game: 'creativity', weight: 0.25 },
    { game: 'logic', weight: 0.10 }
  ],
  logical: [
    { game: 'logic', weight: 0.60 },
    { game: 'attention', weight: 0.45 }
  ],
  spatial: [
    { game: 'memory', weight: 0.35 },
    { game: 'attention', weight: 0.35 },
    { game: 'creativity', weight: 0.30 }
  ],
  musical: [
    { game: 'memory', weight: 0.15 },
    { game: 'creativity', weight: 0.10 }
  ],
  bodily: [
    { game: 'creativity', weight: 0.15 }
  ],
  interpersonal: [
    // 社交智能目前没有对应游戏，标记为未测
  ],
  intrapersonal: [
    { game: 'attention', weight: 0.15 }
  ],
  naturalistic: [
    { game: 'attention', weight: 0.05 },
    { game: 'logic', weight: 0.15 },
    { game: 'creativity', weight: 0.20 }
  ]
}

// ========== 核心分析函数 ==========

/**
 * 计算游戏与问卷的一致性
 */
export function calculateConsistency(
  questionnaireScores: Record<string, number>,
  gameScores: { attention: number; memory: number; logic: number; creativity: number }
): ConsistencyAnalysis {
  const byDimension: ConsistencyAnalysis['byDimension'] = {}
  let totalConsistency = 0
  let dimensionCount = 0

  // 计算每个维度的一致性
  for (const [intelligenceType, gameMappings] of Object.entries(intelligenceToGameMapping)) {
    if (gameMappings.length === 0) continue

    const qScore = questionnaireScores[intelligenceType] || 50

    // 计算加权游戏分数
    let weightedGameScore = 0
    let totalWeight = 0
    for (const mapping of gameMappings) {
      const gScore = gameScores[mapping.game as keyof typeof gameScores] || 0
      weightedGameScore += gScore * mapping.weight
      totalWeight += mapping.weight
    }

    // 归一化
    const effectiveGameScore = totalWeight > 0 ? weightedGameScore / totalWeight : 0

    // 计算一致性（差距越小一致性越高）
    const gap = Math.abs(qScore - effectiveGameScore)
    const consistency = Math.max(0, 100 - gap)

    // 解读
    let interpretation = ''
    if (gap <= 15) {
      interpretation = '问卷与游戏表现一致'
    } else if (gap <= 30) {
      interpretation = '问卷与游戏表现略有差异'
    } else {
      interpretation = gap > 0
        ? '问卷自评高于游戏表现'
        : '游戏表现高于问卷自评'
    }

    byDimension[intelligenceType] = {
      questionnaireScore: Math.round(qScore),
      gameScore: Math.round(effectiveGameScore),
      consistency: Math.round(consistency),
      gap: Math.round(gap),
      interpretation
    }

    totalConsistency += consistency
    dimensionCount++
  }

  // 总体一致性
  const overall = dimensionCount > 0 ? totalConsistency / dimensionCount : 0

  // 找出可信和需关注的维度
  const reliableDimensions: string[] = []
  const alertDimensions: string[] = []

  for (const [type, data] of Object.entries(byDimension)) {
    if (data.consistency >= 70) {
      reliableDimensions.push(type)
    } else if (data.consistency < 50) {
      alertDimensions.push(type)
    }
  }

  return {
    overall: Math.round(overall),
    byDimension,
    reliableDimensions,
    alertDimensions
  }
}

/**
 * 生成综合评估报告
 */
export function generateIntegratedAssessment(
  questionnaireScores: Record<string, number>,
  gameScores: { attention: number; memory: number; logic: number; creativity: number }
): IntegratedAssessment {
  // 1. 计算一致性
  const consistency = calculateConsistency(questionnaireScores, gameScores)

  // 2. 计算综合智能评分
  const integratedScores: IntegratedAssessment['integratedScores'] = {}
  const allTypes = ['linguistic', 'logical', 'spatial', 'musical', 'bodily', 'interpersonal', 'intrapersonal', 'naturalistic']

  for (const type of allTypes) {
    const qScore = questionnaireScores[type] || 50

    // 获取该智能类型对应的游戏分数
    const mappings = intelligenceToGameMapping[type] || []
    let weightedGameScore = 0
    let totalWeight = 0

    for (const mapping of mappings) {
      const gScore = gameScores[mapping.game as keyof typeof gameScores] || 0
      weightedGameScore += gScore * mapping.weight
      totalWeight += mapping.weight
    }

    const effectiveGameScore = totalWeight > 0 ? weightedGameScore / totalWeight : 0

    // 计算置信度
    let confidence: 'high' | 'medium' | 'low' = 'low'
    if (totalWeight >= 0.5 && consistency.byDimension[type]?.consistency >= 70) {
      confidence = 'high'
    } else if (totalWeight >= 0.3 || consistency.byDimension[type]?.consistency >= 50) {
      confidence = 'medium'
    }

    // 计算加权综合分数
    // 当有游戏验证且一致性高时，游戏分数权重增加
    let gameWeight = 0.3
    if (confidence === 'high') gameWeight = 0.4
    if (confidence === 'low') gameWeight = 0.2

    // 如果没有游戏数据，完全依赖问卷
    if (totalWeight === 0) {
      gameWeight = 0
    }

    const weightedScore = Math.round(
      qScore * (1 - gameWeight) + effectiveGameScore * gameWeight
    )

    integratedScores[type] = {
      questionnaireScore: qScore,
      gameScore: Math.round(effectiveGameScore),
      weightedScore,
      confidence
    }
  }

  // 3. 认知能力验证
  const cognitiveValidation = {
    attention: validateCognitiveAbility('attention', questionnaireScores, gameScores.attention),
    memory: validateCognitiveAbility('memory', questionnaireScores, gameScores.memory),
    logic: validateCognitiveAbility('logic', questionnaireScores, gameScores.logic),
    creativity: validateCognitiveAbility('creativity', questionnaireScores, gameScores.creativity)
  }

  // 4. 综合评价
  const overallAssessment = generateOverallAssessment(consistency, cognitiveValidation)

  return {
    integratedScores,
    cognitiveValidation,
    consistency,
    overallAssessment
  }
}

/**
 * 验证单项认知能力
 */
function validateCognitiveAbility(
  ability: string,
  questionnaireScores: Record<string, number>,
  gameScore: number
): { validated: boolean; score: number; source: string } {
  // 获取与该认知能力相关的智能类型
  const relatedIntelligences = gameIntelligenceMapping[ability as keyof typeof gameIntelligenceMapping]
  if (!relatedIntelligences) {
    return { validated: false, score: gameScore, source: '游戏测试' }
  }

  // 计算相关智能的平均问卷分数
  let totalQScore = 0
  let totalWeight = 0
  for (const [intelligence, weight] of Object.entries(relatedIntelligences)) {
    totalQScore += (questionnaireScores[intelligence] || 50) * weight
    totalWeight += weight
  }
  const expectedQScore = totalWeight > 0 ? totalQScore / totalWeight : 50

  // 比较问卷预期与游戏实际表现
  const gap = Math.abs(expectedQScore - gameScore)
  const validated = gap <= 25  // 差距在25分以内认为验证通过

  return {
    validated,
    score: gameScore,
    source: validated ? '问卷+游戏验证' : '游戏测试'
  }
}

/**
 * 生成总体评价
 */
function generateOverallAssessment(
  consistency: ConsistencyAnalysis,
  cognitiveValidation: IntegratedAssessment['cognitiveValidation']
): IntegratedAssessment['overallAssessment'] {
  const flags: string[] = []

  // 检查一致性水平
  if (consistency.overall >= 70) {
    // 高一致性
    const validatedCount = Object.values(cognitiveValidation).filter(v => v.validated).length
    if (validatedCount >= 3) {
      return {
        reliabilityLevel: '高可靠性',
        recommendation: '问卷自评与游戏表现高度一致，评估结果可信。建议继续发展优势领域，同时关注提升空间。',
        flags
      }
    }
  }

  // 中等一致性
  if (consistency.overall >= 50) {
    // 检查是否有需要关注的维度
    if (consistency.alertDimensions.length > 0) {
      const alertNames = getChineseNames(consistency.alertDimensions)
      flags.push(`${alertNames}的问卷自评与实际表现存在较大差异`)
    }
    return {
      reliabilityLevel: '中等可靠性',
      recommendation: '问卷与游戏表现基本一致。部分维度存在差异，可能受测试状态影响，或表明该方面有发展潜力。',
      flags
    }
  }

  // 低一致性
  flags.push('问卷自评与游戏表现差异较大')
  flags.push('可能原因：测试时不够专注、对游戏不熟悉、或自我认知与实际能力存在偏差')

  return {
    reliabilityLevel: '需谨慎解读',
    recommendation: '问卷自评与游戏表现存在较大差异。建议以游戏测试结果作为能力参考，问卷结果作为兴趣参考。建议在更放松的状态下重新测试。',
    flags
  }
}

/**
 * 获取智能类型中文名称
 */
function getChineseNames(types: string[]): string {
  const nameMap: Record<string, string> = {
    linguistic: '语言智能',
    logical: '逻辑智能',
    spatial: '空间智能',
    musical: '音乐智能',
    bodily: '运动智能',
    interpersonal: '人际智能',
    intrapersonal: '内省智能',
    naturalistic: '自然智能'
  }
  return types.map(t => nameMap[t] || t).join('、')
}

/**
 * 获取智能类型中文名称（导出版本）
 */
export function getIntelligenceChineseName(type: string): string {
  const nameMap: Record<string, string> = {
    linguistic: '语言智能',
    logical: '逻辑数学智能',
    spatial: '空间智能',
    musical: '音乐智能',
    bodily: '身体运动智能',
    interpersonal: '人际交往智能',
    intrapersonal: '自我认知智能',
    naturalistic: '自然观察智能'
  }
  return nameMap[type] || type
}

/**
 * 获取游戏中文名称
 */
export function getGameChineseName(game: string): string {
  const nameMap: Record<string, string> = {
    attention: '注意力测试',
    memory: '记忆力测试',
    logic: '逻辑推理测试',
    creativity: '创造力测试'
  }
  return nameMap[game] || game
}

/**
 * 获取一致性解读
 */
export function getConsistencyInterpretation(consistency: number): string {
  if (consistency >= 80) return '高度一致'
  if (consistency >= 60) return '基本一致'
  if (consistency >= 40) return '存在差异'
  return '差异较大'
}

/**
 * 获取一致性颜色
 */
export function getConsistencyColor(consistency: number): string {
  if (consistency >= 70) return '#10B981'  // green
  if (consistency >= 50) return '#F59E0B'  // orange
  return '#EF4444'  // red
}

/**
 * 检查是否所有游戏都已完成
 */
export function areAllGamesCompleted(gameResults: {
  schulte: { times: number[] }
  memory: { scores: number[] }
  logic: { answers: boolean[] }
  creative: { answers: string[][] }
}): boolean {
  return gameResults.schulte.times.length >= 3 &&
         gameResults.memory.scores.length >= 3 &&
         gameResults.logic.answers.length >= 3 &&
         gameResults.creative.answers.length >= 2
}

/**
 * 将原始游戏结果转换为标准分数格式
 */
export function normalizeGameResults(gameResults: {
  schulte: { times: number[]; errors: number[] }
  memory: { scores: number[] }
  logic: { answers: boolean[]; times: number[] }
  creative: { answers: string[][] }
}): { attention: number; memory: number; logic: number; creativity: number } {
  // 舒尔特方格：时间越短分数越高
  const schulteTimes = gameResults.schulte.times
  let attentionScore = 0
  if (schulteTimes.length > 0) {
    const avgTime = schulteTimes.reduce((a, b) => a + b, 0) / schulteTimes.length
    // 标准化：60秒=100分，每多10秒减10分
    attentionScore = Math.max(0, Math.min(100, Math.round(100 - (avgTime - 60) / 10 * 10)))
  }

  // 记忆力：直接取平均
  const memoryScores = gameResults.memory.scores
  const memoryScore = memoryScores.length > 0
    ? Math.round(memoryScores.reduce((a, b) => a + b, 0) / memoryScores.length)
    : 0

  // 逻辑：正确率
  const logicAnswers = gameResults.logic.answers
  const logicScore = logicAnswers.length > 0
    ? Math.round((logicAnswers.filter(a => a).length / logicAnswers.length) * 100)
    : 0

  // 创造力：答案数量 + 多样性
  const creativeAnswers = gameResults.creative.answers
  let creativityScore = 0
  if (creativeAnswers.length > 0) {
    let totalAnswers = 0
    const uniqueCategories = new Set<string>()
    for (const round of creativeAnswers) {
      totalAnswers += round.length
      round.forEach(a => uniqueCategories.add(a.charAt(0)))
    }
    const quantityScore = Math.min(50, totalAnswers * 5)
    const diversityScore = Math.min(50, uniqueCategories.size * 10)
    creativityScore = quantityScore + diversityScore
  }

  return {
    attention: attentionScore,
    memory: memoryScore,
    logic: logicScore,
    creativity: creativityScore
  }
}
