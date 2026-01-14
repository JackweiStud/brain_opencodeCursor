// 增强评分算法工具
// 包含：标准分转换、信度检验、异常值检测、年龄常模对比

export interface ScoringResult {
  rawScore: number           // 原始分数
  standardScore: number      // 标准分数 (T分数，均值50，标准差10)
  percentile: number         // 百分等级 (0-100)
  confidenceInterval: {      // 95%置信区间
    lower: number
    upper: number
  }
  reliability: number        // 信度系数 (Cronbach's α近似值)
}

export interface AgeNorm {
  ageGroup: 'young' | 'middle' | 'teen'
  mean: number               // 平均分
  standardDeviation: number  // 标准差
  sampleSize: number         // 样本量
}

// ========== 临时常模数据（需要通过收集真实数据来完善）==========
// 这些是基于理论推测的临时数据，需要用实际收集的数据替换

export const temporaryNorms: Record<string, AgeNorm> = {
  // 多元智能临时常模
  'intelligence-young': { ageGroup: 'young', mean: 35, standardDeviation: 6, sampleSize: 0 },
  'intelligence-middle': { ageGroup: 'middle', mean: 38, standardDeviation: 7, sampleSize: 0 },
  'intelligence-teen': { ageGroup: 'teen', mean: 40, standardDeviation: 8, sampleSize: 0 },

  // 职业兴趣临时常模
  'interest-young': { ageGroup: 'young', mean: 32, standardDeviation: 5, sampleSize: 0 },
  'interest-middle': { ageGroup: 'middle', mean: 35, standardDeviation: 6, sampleSize: 0 },
  'interest-teen': { ageGroup: 'teen', mean: 37, standardDeviation: 7, sampleSize: 0 },

  // 认知能力临时常模
  'cognitive-young': { ageGroup: 'young', mean: 60, standardDeviation: 15, sampleSize: 0 },
  'cognitive-middle': { ageGroup: 'middle', mean: 70, standardDeviation: 12, sampleSize: 0 },
  'cognitive-teen': { ageGroup: 'teen', mean: 80, standardDeviation: 10, sampleSize: 0 },
}

// ========== 标准分转换 ==========

/**
 * 原始分数转换为T分数
 * T分数 = (原始分 - 平均分) / 标准差 × 10 + 50
 * T分数的均值是50，标准差是10，范围通常是20-80
 */
export function convertToTScore(
  rawScore: number,
  mean: number,
  standardDeviation: number
): number {
  if (standardDeviation === 0) return 50
  const tScore = ((rawScore - mean) / standardDeviation) * 10 + 50
  return Math.max(0, Math.min(100, Math.round(tScore)))
}

/**
 * 计算百分等级
 * 基于标准正态分布，将Z分数转换为百分位
 */
export function convertToPercentile(tScore: number): number {
  const zScore = (tScore - 50) / 10
  // 使用近似公式计算标准正态分布的累积概率
  const sign = zScore >= 0 ? 1 : -1
  const absZ = Math.abs(zScore)
  const percentile = sign * (1 -
    (1 / (1 + 0.2316419 * absZ +
      0.5191762 * absZ * absZ +
      0.0947879 * absZ * absZ * absZ +
      0.0327651 * absZ * absZ * absZ * absZ)) ** 16
  ) * 100
  return Math.round((percentile + 100) / 2)
}

/**
 * 计算95%置信区间
 * CI = 分数 ± 1.96 × 标准误
 */
export function calculateConfidenceInterval(
  score: number,
  standardError: number
): { lower: number; upper: number } {
  const margin = 1.96 * standardError
  return {
    lower: Math.max(0, Math.round(score - margin)),
    upper: Math.min(100, Math.round(score + margin))
  }
}

/**
 * 计算标准误
 * SE = 标准差 × √(1 - 信度)
 */
export function calculateStandardError(
  standardDeviation: number,
  reliability: number
): number {
  return standardDeviation * Math.sqrt(1 - reliability)
}

// ========== 信度检验 ==========

/**
 * 计算Cronbach's α系数（内部一致性信度）
 * α = (k / (k - 1)) × (1 - Σσi² / σt²)
 * 其中k是题目数，σi²是各题目方差，σt²是总分方差
 */
export function calculateCronbachAlpha(
  itemScores: number[][]  // 二维数组，每个人在所有题目上的得分
): number {
  const k = itemScores[0]?.length || 0
  if (k < 2) return 0

  // 计算每个题目的方差
  const itemVariances: number[] = []
  for (let i = 0; i < k; i++) {
    const scores = itemScores.map(person => person[i])
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length
    const variance = scores.reduce((sum, score) => sum + (score - mean) ** 2, 0) / scores.length
    itemVariances.push(variance)
  }

  // 计算总分的方差
  const totalScores = itemScores.map(scores => scores.reduce((a, b) => a + b, 0))
  const totalMean = totalScores.reduce((a, b) => a + b, 0) / totalScores.length
  const totalVariance = totalScores.reduce((sum, score) => sum + (score - totalMean) ** 2, 0) / totalScores.length

  if (totalVariance === 0) return 0

  const alpha = (k / (k - 1)) * (1 - itemVariances.reduce((a, b) => a + b, 0) / totalVariance)
  return Math.max(0, Math.min(1, alpha))
}

/**
 * 检查作答一致性（检测随意作答）
 * 比较相似题目之间的作答一致性
 */
export function checkAnswerConsistency(
  answers: Map<string, number>,
  questionPairs: Array<[string, string]>  // 成对题目ID，应该有相似的作答
): {
  consistent: boolean
  correlation: number
  details: Array<[string, string, number, number, boolean]>
} {
  const details: Array<[string, string, number, number, boolean]> = []
  let consistentCount = 0

  for (const [q1, q2] of questionPairs) {
    const score1 = answers.get(q1) ?? 0
    const score2 = answers.get(q2) ?? 0
    const diff = Math.abs(score1 - score2)
    const consistent = diff <= 1  // 差异不超过1分认为一致

    if (consistent) consistentCount++
    details.push([q1, q2, score1, score2, consistent])
  }

  const correlation = questionPairs.length > 0
    ? consistentCount / questionPairs.length
    : 0

  return {
    consistent: correlation >= 0.6,  // 60%以上一致认为通过
    correlation: Math.round(correlation * 100) / 100,
    details
  }
}

/**
 * 检测社会期望偏差
 * 如果测谎题分数过高，说明可能存在社会期望偏差
 */
export function detectSocialDesirabilityBias(
  sdsScores: number[]
): {
  hasBias: boolean
  level: 'none' | 'low' | 'moderate' | 'high'
  averageScore: number
} {
  if (sdsScores.length === 0) {
    return { hasBias: false, level: 'none', averageScore: 0 }
  }

  const avgScore = sdsScores.reduce((a, b) => a + b, 0) / sdsScores.length

  let level: 'none' | 'low' | 'moderate' | 'high'
  if (avgScore >= 4.5) {
    level = 'high'
  } else if (avgScore >= 4.0) {
    level = 'moderate'
  } else if (avgScore >= 3.5) {
    level = 'low'
  } else {
    level = 'none'
  }

  return {
    hasBias: avgScore >= 4.0,
    level,
    averageScore: Math.round(avgScore * 100) / 100
  }
}

/**
 * 检测异常作答模式（如全部选择同一选项）
 */
export function detectAbnormalPattern(
  scores: number[]
): {
  hasAbnormality: boolean
  pattern: 'straight-lining' | 'zigzag' | 'normal'
  details: string
} {
  if (scores.length === 0) {
    return { hasAbnormality: false, pattern: 'normal', details: '无数据' }
  }

  // 检测"直线作答"（全部选同一选项）
  const firstScore = scores[0]
  const allSame = scores.every(s => s === firstScore)
  if (allSame) {
    return {
      hasAbnormality: true,
      pattern: 'straight-lining',
      details: `所有题目都选择了${firstScore}分`
    }
  }

  // 检测"锯齿作答"（规律性高低波动）
  let zigzagCount = 0
  for (let i = 1; i < scores.length; i++) {
    const prevDiff = i > 1 ? scores[i - 1] - scores[i - 2] : 0
    const currDiff = scores[i] - scores[i - 1]
    if (prevDiff !== 0 && Math.sign(currDiff) !== Math.sign(prevDiff)) {
      zigzagCount++
    }
  }
  const zigzagRatio = zigzagCount / (scores.length - 2)
  if (zigzagRatio > 0.6) {
    return {
      hasAbnormality: true,
      pattern: 'zigzag',
      details: '作答呈现规律性波动'
    }
  }

  return {
    hasAbnormality: false,
    pattern: 'normal',
    details: '作答模式正常'
  }
}

// ========== 完整评分流程 ==========

/**
 * 对一组题目答案进行完整评分
 */
export function scoreQuestionnaire(
  answers: Array<{ questionId: string; score: number }>,
  questionType: 'intelligence' | 'interest',
  ageGroup: 'young' | 'middle' | 'teen',
  itemCount: number,  // 该类型的题目数量
  reverseQuestions: string[] = [],  // 需要反向计分的题目ID
  sdsQuestions: string[] = []  // 测谎题ID
): ScoringResult & {
  warnings: string[]
  reliabilityFlag: boolean
} {
  const warnings: string[] = []
  let reliabilityFlag = false

  // 1. 处理反向题
  const processedAnswers = answers.map(a => ({
    questionId: a.questionId,
    score: reverseQuestions.includes(a.questionId)
      ? reverseScore(a.score)
      : a.score
  }))

  // 2. 计算原始分数
  const rawScore = processedAnswers.reduce((sum, a) => sum + a.score, 0)
  const maxPossibleScore = itemCount * 5
  const rawPercentScore = (rawScore / maxPossibleScore) * 100

  // 3. 获取常模数据
  const normKey = `${questionType}-${ageGroup}`
  const norm = temporaryNorms[normKey] || { mean: 50, standardDeviation: 10 }

  // 4. 转换为T分数
  const standardScore = convertToTScore(rawPercentScore, norm.mean, norm.standardDeviation)

  // 5. 计算百分等级
  const percentile = convertToPercentile(standardScore)

  // 6. 计算信度（基于题目数量的近似值）
  // 使用Spearman-Brown预测公式：α = k × r̄ / (1 + (k - 1) × r̄)
  // 假设平均题目间相关 r̄ = 0.3
  const avgItemCorrelation = 0.3
  const reliability = (itemCount * avgItemCorrelation) / (1 + (itemCount - 1) * avgItemCorrelation)

  // 7. 计算标准误和置信区间
  const standardError = calculateStandardError(norm.standardDeviation, reliability)
  const confidenceInterval = calculateConfidenceInterval(standardScore, standardError)

  // 8. 检测异常
  const allScores = processedAnswers.map(a => a.score)
  const abnormality = detectAbnormalPattern(allScores)
  if (abnormality.hasAbnormality) {
    warnings.push(`检测到异常作答模式：${abnormality.details}`)
    reliabilityFlag = true
  }

  // 9. 检测社会期望偏差
  const sdsScores = processedAnswers
    .filter(a => sdsQuestions.includes(a.questionId))
    .map(a => a.score)
  const bias = detectSocialDesirabilityBias(sdsScores)
  if (bias.hasBias) {
    warnings.push(`可能存在社会期望偏差（${bias.level}级）`)
  }

  // 10. 检查信度
  if (itemCount < 5) {
    warnings.push('题目数量较少，结果可靠性可能较低')
    reliabilityFlag = true
  }

  return {
    rawScore: Math.round(rawPercentScore),
    standardScore,
    percentile,
    confidenceInterval,
    reliability: Math.round(reliability * 100) / 100,
    warnings,
    reliabilityFlag
  }
}

/**
 * 反向计分
 */
function reverseScore(score: number): number {
  return 6 - score
}

// ========== 年龄常模更新接口 ==========

/**
 * 更新常模数据（当收集到足够样本后使用）
 */
export function updateNormData(
  type: 'intelligence' | 'interest' | 'cognitive',
  ageGroup: 'young' | 'middle' | 'teen',
  data: {
    mean: number
    standardDeviation: number
    sampleSize: number
  }
): void {
  const key = `${type}-${ageGroup}`
  temporaryNorms[key] = {
    ageGroup,
    mean: data.mean,
    standardDeviation: data.standardDeviation,
    sampleSize: data.sampleSize
  }
}

/**
 * 获取当前常模数据（用于展示常模状态）
 */
export function getNormStatus(): Array<{
  type: string
  ageGroup: string
  mean: number
  sd: number
  sampleSize: number
  isProvisional: boolean
}> {
  return Object.entries(temporaryNorms).map(([key, norm]) => {
    const [type, ageGroup] = key.split('-')
    return {
      type,
      ageGroup,
      mean: norm.mean,
      sd: norm.standardDeviation,
      sampleSize: norm.sampleSize,
      isProvisional: norm.sampleSize < 100  // 样本量小于100视为临时常模
    }
  })
}
