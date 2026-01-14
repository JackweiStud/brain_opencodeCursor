// 常模数据收集系统
// 用于收集匿名测评数据，建立中国儿童常模

export interface NormDataRecord {
  id: string  // 匿名ID
  age: number
  gender: 'male' | 'female' | 'other'
  ageGroup: 'young' | 'middle' | 'teen'
  region?: string  // 地区（可选）

  // 多元智能原始分数
  intelligenceScores: {
    linguistic: number
    logical: number
    spatial: number
    musical: number
    bodily: number
    interpersonal: number
    intrapersonal: number
    naturalistic: number
  }

  // 职业兴趣原始分数
  interestScores: {
    realistic: number
    investigative: number
    artistic: number
    social: number
    enterprising: number
    conventional: number
  }

  // 认知游戏原始分数
  cognitiveScores: {
    schulte: { time: number; errors: number }[]
    memory: number[]
    logic: { correct: boolean; time: number }[]
    creative: string[][]
  }

  // 元数据
  completedAt: string  // ISO时间戳
  testVersion: string  // 题库版本
  dataQuality: 'good' | 'fair' | 'poor'  // 数据质量标记
}

export interface NormStatistics {
  type: 'intelligence' | 'interest' | 'cognitive'
  subtype?: string  // 具体智能/兴��类型
  ageGroup: 'young' | 'middle' | 'teen'
  sampleSize: number
  mean: number
  standardDeviation: number
  min: number
  max: number
  standardError: number
  confidenceInterval: { lower: number; upper: number }
  genderBreakdown?: {
    male: { n: number; mean: number }
    female: { n: number; mean: number }
    other: { n: number; mean: number }
  }
}

/**
 * 计算描述性统计
 */
export function calculateStatistics(values: number[]): {
  n: number
  mean: number
  standardDeviation: number
  min: number
  max: number
  standardError: number
  confidenceInterval: { lower: number; upper: number }
} {
  const n = values.length
  if (n === 0) {
    return {
      n: 0,
      mean: 0,
      standardDeviation: 0,
      min: 0,
      max: 0,
      standardError: 0,
      confidenceInterval: { lower: 0, upper: 0 }
    }
  }

  const mean = values.reduce((a, b) => a + b, 0) / n
  const variance = values.reduce((sum, val) => sum + (val - mean) ** 2, 0) / n
  const standardDeviation = Math.sqrt(variance)
  const standardError = standardDeviation / Math.sqrt(n)

  // 95%置信区间
  const margin = 1.96 * standardError

  return {
    n,
    mean: Math.round(mean * 100) / 100,
    standardDeviation: Math.round(standardDeviation * 100) / 100,
    min: Math.min(...values),
    max: Math.max(...values),
    standardError: Math.round(standardError * 100) / 100,
    confidenceInterval: {
      lower: Math.round((mean - margin) * 100) / 100,
      upper: Math.round((mean + margin) * 100) / 100
    }
  }
}

/**
 * 生成匿名数据ID
 */
export function generateAnonymousId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${random}`
}

/**
 * 评估数据质量
 */
export function assessDataQuality(record: NormDataRecord): 'good' | 'fair' | 'poor' {
  let score = 100

  // ���查1：作答时间是否过短
  const completionTime = new Date(record.completedAt).getTime()
  const estimatedTime = 15 * 60 * 1000  // 预计15分钟
  if (completionTime < estimatedTime * 0.3) {
    score -= 30  // 作答时间太短
  }

  // 检查2：是否有异常作答模式
  const allScores = [
    ...Object.values(record.intelligenceScores),
    ...Object.values(record.interestScores)
  ]
  const uniqueScores = new Set(allScores).size
  if (uniqueScores < 3) {
    score -= 40  // 分数过于单一
  }

  // 检查3：认知游戏数据的合理性
  const avgSchulteTime = record.cognitiveScores.schulte.reduce((sum, s) => sum + s.time, 0) / record.cognitiveScores.schulte.length
  if (avgSchulteTime < 10) {
    score -= 20  // 舒尔特时间过短，不合理
  }

  // 检查4：创造力答案数量
  const creativeAnswers = record.cognitiveScores.creative.flat().length
  if (creativeAnswers < 3) {
    score -= 10
  }

  if (score >= 80) return 'good'
  if (score >= 50) return 'fair'
  return 'poor'
}

/**
 * 准备上传的数据（脱敏处理）
 */
export function prepareDataForUpload(
  record: NormDataRecord
): string {
  // 移除可能识别个人身份的信息
  const sanitized = {
    ...record,
    // 只保留年龄段，不保留具体年龄
    age: undefined,
    // 地区信息转为大区级别
    region: record.region ? sanitizeRegion(record.region) : undefined,
  }

  return JSON.stringify(sanitized)
}

/**
 * 地区脱敏（转为大区）
 */
function sanitizeRegion(region: string): string {
  // 简化的地区映射
  const easternChina = ['上海', '江苏', '浙江', '安徽', '福建', '江西']
  const northernChina = ['北京', '天津', '河北', '山西', '内蒙古']
  const southernChina = ['广东', '广西', '海南']
  const westernChina = ['四川', '重庆', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆']
  const centralChina = ['河南', '湖北', '湖南']
  const northEasternChina = ['辽宁', '吉林', '黑龙江']

  for (const prov of easternChina) {
    if (region.includes(prov)) return '华东'
  }
  for (const prov of northernChina) {
    if (region.includes(prov)) return '华北'
  }
  for (const prov of southernChina) {
    if (region.includes(prov)) return '华南'
  }
  for (const prov of westernChina) {
    if (region.includes(prov)) return '西部'
  }
  for (const prov of centralChina) {
    if (region.includes(prov)) return '华中'
  }
  for (const prov of northEasternChina) {
    if (region.includes(prov)) return '东北'
  }

  return '其他'
}

/**
 * 从本地存储加载已收集的数据
 */
export function loadCollectedData(): NormDataRecord[] {
  try {
    const data = localStorage.getItem('kidpotential_norm_data')
    if (!data) return []
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * 保存收集的数据到本地存储
 */
export function saveCollectedData(data: NormDataRecord[]): void {
  try {
    localStorage.setItem('kidpotential_norm_data', JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save norm data:', e)
  }
}

/**
 * 添加一条新的数据记录
 */
export function addNormRecord(
  profile: { age: number; gender: 'male' | 'female' | 'other'; region?: string },
  intelligenceScores: Record<string, number>,
  interestScores: Record<string, number>,
  cognitiveScores: NormDataRecord['cognitiveScores']
): string {
  const existingData = loadCollectedData()

  const ageGroup = profile.age < 10 ? 'young' : profile.age < 13 ? 'middle' : 'teen'

  const record: NormDataRecord = {
    id: generateAnonymousId(),
    age: profile.age,
    gender: profile.gender,
    ageGroup,
    region: profile.region,
    intelligenceScores: intelligenceScores as NormDataRecord['intelligenceScores'],
    interestScores: interestScores as NormDataRecord['interestScores'],
    cognitiveScores,
    completedAt: new Date().toISOString(),
    testVersion: '1.0-enhanced',
    dataQuality: 'good' // 稍后更新
  }

  // 评估数据质量
  record.dataQuality = assessDataQuality(record)

  // 只保存质量合格的数据
  if (record.dataQuality !== 'poor') {
    existingData.push(record)
    saveCollectedData(existingData)
  }

  return record.id
}

/**
 * 计算当前收集数据的统计信息
 */
export function calculateCurrentNorms(): {
  intelligence: Record<string, NormStatistics[]>
  interest: Record<string, NormStatistics[]>
  cognitive: NormStatistics[]
  overallSummary: {
    totalRecords: number
    goodQuality: number
    fairQuality: number
    poorQuality: number
    byAgeGroup: Record<string, number>
    byGender: Record<string, number>
  }
} {
  const data = loadCollectedData()

  // 总体摘要
  const overallSummary = {
    totalRecords: data.length,
    goodQuality: data.filter(d => d.dataQuality === 'good').length,
    fairQuality: data.filter(d => d.dataQuality === 'fair').length,
    poorQuality: data.filter(d => d.dataQuality === 'poor').length,
    byAgeGroup: {
      young: data.filter(d => d.ageGroup === 'young').length,
      middle: data.filter(d => d.ageGroup === 'middle').length,
      teen: data.filter(d => d.ageGroup === 'teen').length
    },
    byGender: {
      male: data.filter(d => d.gender === 'male').length,
      female: data.filter(d => d.gender === 'female').length,
      other: data.filter(d => d.gender === 'other').length
    }
  }

  // 多元智能统计
  const intelligenceTypes = ['linguistic', 'logical', 'spatial', 'musical', 'bodily', 'interpersonal', 'intrapersonal', 'naturalistic']
  const intelligence: Record<string, NormStatistics[]> = {}

  for (const type of intelligenceTypes) {
    intelligence[type] = []
    for (const ageGroup of ['young', 'middle', 'teen'] as const) {
      const filtered = data.filter(d => d.ageGroup === ageGroup && d.dataQuality !== 'poor')
      const values = filtered.map(d => d.intelligenceScores[type as keyof typeof d.intelligenceScores])
      const stats = calculateStatistics(values)

      intelligence[type].push({
        type: 'intelligence',
        subtype: type,
        ageGroup,
        sampleSize: stats.n,
        mean: stats.mean,
        standardDeviation: stats.standardDeviation,
        min: stats.min,
        max: stats.max,
        standardError: stats.standardError,
        confidenceInterval: stats.confidenceInterval
      })
    }
  }

  // 职业兴趣统计
  const interestTypes = ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional']
  const interest: Record<string, NormStatistics[]> = {}

  for (const type of interestTypes) {
    interest[type] = []
    for (const ageGroup of ['young', 'middle', 'teen'] as const) {
      const filtered = data.filter(d => d.ageGroup === ageGroup && d.dataQuality !== 'poor')
      const values = filtered.map(d => d.interestScores[type as keyof typeof d.interestScores])
      const stats = calculateStatistics(values)

      interest[type].push({
        type: 'interest',
        subtype: type,
        ageGroup,
        sampleSize: stats.n,
        mean: stats.mean,
        standardDeviation: stats.standardDeviation,
        min: stats.min,
        max: stats.max,
        standardError: stats.standardError,
        confidenceInterval: stats.confidenceInterval
      })
    }
  }

  // 认知游戏统计（简化处理）
  const cognitive: NormStatistics[] = []
  for (const ageGroup of ['young', 'middle', 'teen'] as const) {
    const filtered = data.filter(d => d.ageGroup === ageGroup && d.dataQuality !== 'poor')

    // 舒尔特方格平均时间
    const schulteTimes = filtered.flatMap(d => d.cognitiveScores.schulte.map(s => s.time))
    const schulteStats = calculateStatistics(schulteTimes)

    cognitive.push({
      type: 'cognitive',
      subtype: 'schulte-time',
      ageGroup,
      sampleSize: schulteStats.n,
      mean: schulteStats.mean,
      standardDeviation: schulteStats.standardDeviation,
      min: schulteStats.min,
      max: schulteStats.max,
      standardError: schulteStats.standardError,
      confidenceInterval: schulteStats.confidenceInterval
    })
  }

  return { intelligence, interest, cognitive, overallSummary }
}

/**
 * 导出数据（用于上传到服务器或分享）
 */
export function exportNormData(): string {
  const data = loadCollectedData()
  const sanitized = data.map(record => {
    const { age, region, ...rest } = record
    return {
      ...rest,
      region: region ? sanitizeRegion(region) : undefined
    }
  })

  return JSON.stringify(sanitized, null, 2)
}

/**
 * 清除已收集的数据（用户可选项）
 */
export function clearCollectedData(): void {
  localStorage.removeItem('kidpotential_norm_data')
}

/**
 * 检查是否应该提示用户参与数据收集
 */
export function shouldPromptDataCollection(): boolean {
  const data = loadCollectedData()
  const lastPrompt = localStorage.getItem('kidpotential_norm_prompt_timestamp')
  const now = Date.now()

  // 如果没有数据，或者距离上次提示超过30天
  if (data.length === 0) return true
  if (!lastPrompt) return true
  if (now - parseInt(lastPrompt) > 30 * 24 * 60 * 60 * 1000) return true

  return false
}

/**
 * 记录用户已拒绝参与数据收集
 */
export function declineDataCollection(): void {
  localStorage.setItem('kidpotential_norm_prompt_timestamp', Date.now().toString())
}

/**
 * 检查当前样本量是否足够建立正式常模
 */
export function isSampleSizeSufficient(): boolean {
  const data = loadCollectedData()
  const goodQuality = data.filter(d => d.dataQuality === 'good')

  // 要求：每个年龄段至少100个高质量样本
  const youngCount = goodQuality.filter(d => d.ageGroup === 'young').length
  const middleCount = goodQuality.filter(d => d.ageGroup === 'middle').length
  const teenCount = goodQuality.filter(d => d.ageGroup === 'teen').length

  return youngCount >= 100 && middleCount >= 100 && teenCount >= 100
}
