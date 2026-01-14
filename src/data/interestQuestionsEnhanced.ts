// 霍兰德职业兴趣理论（RIASEC）增强题库
// 6种兴趣类型，每种10-12题，共64题
// 包含正向题(+)和反向题(-)
// 包含年龄差异化表述：young(7-9岁), middle(10-12岁), teen(13-15岁)
// 使用5级李克特量表：1=完全不喜欢，2=不太喜欢，3=一般，4=比较喜欢，5=非常喜欢

export interface InterestQuestionEnhanced {
  id: string
  type: string
  text: string
  ageGroup: 'young' | 'middle' | 'teen' | 'all'
  direction: 'forward' | 'reverse'  // 正向题/反向题
  activity?: string  // 具体活动描述
}

export interface InterestType {
  key: string
  name: string
  nameEn: string
  code: string  // R/I/A/S/E/C
  icon: string
  description: string
  descriptionYoung?: string
  descriptionTeen?: string
  careers: string[]  // 相关职业
  color: string
}

// 兴趣类型定义（含年龄差异化描述）
export const interestTypesEnhanced: InterestType[] = [
  {
    key: 'realistic',
    name: '实际型',
    nameEn: 'Realistic',
    code: 'R',
    icon: '🔧',
    description: '喜欢动手操作、使用工具',
    descriptionYoung: '喜欢做手工、搭积木、修东西',
    descriptionTeen: '偏好需要动手操作的技术性工作',
    careers: ['工程师', '建筑师', '机械师', '飞行员', '农业专家', '电工', '厨师', '技术员'],
    color: '#E57373'
  },
  {
    key: 'investigative',
    name: '研究型',
    nameEn: 'Investigative',
    code: 'I',
    icon: '🔬',
    description: '喜欢研究、分析和解决问题',
    descriptionYoung: '喜欢问为什么，爱做科学实验',
    descriptionTeen: '善于观察分析，喜欢探索未知',
    careers: ['科学家', '医生', '程序员', '数据分析师', '研究员', '大学教授', '实验室技术员'],
    color: '#64B5F6'
  },
  {
    key: 'artistic',
    name: '艺术型',
    nameEn: 'Artistic',
    code: 'A',
    icon: '🎭',
    description: '喜欢创作、表演和艺术表达',
    descriptionYoung: '喜欢画画、唱歌、表演',
    descriptionTeen: '富有想象力，追求创造性表达',
    careers: ['画家', '音乐家', '作家', '设计师', '演员', '导演', '摄影师', '建筑师'],
    color: '#BA68C8'
  },
  {
    key: 'social',
    name: '社会型',
    nameEn: 'Social',
    code: 'S',
    icon: '🤝',
    description: '喜欢帮助他人、教育和服务',
    descriptionYoung: '喜欢帮助别人，和大家一起玩',
    descriptionTeen: '善于沟通，关注他人福利',
    careers: ['教师', '心理咨询师', '社工', '护士', '人力资源', '辅导员', '公务员'],
    color: '#81C784'
  },
  {
    key: 'enterprising',
    name: '企业型',
    nameEn: 'Enterprising',
    code: 'E',
    icon: '💼',
    description: '喜欢领导、说服和管理',
    descriptionYoung: '喜欢当小领导，组织大家玩游戏',
    descriptionTeen: '善于领导影响，追求目标和成就',
    careers: ['企业家', '销售经理', '律师', '政治家', '项目经理', '市场营销', '主播'],
    color: '#FFB74D'
  },
  {
    key: 'conventional',
    name: '常规型',
    nameEn: 'Conventional',
    code: 'C',
    icon: '📊',
    description: '喜欢整理、计划和有序工作',
    descriptionYoung: '喜欢把东西收拾得整整齐齐',
    descriptionTeen: '注重细节，喜欢有秩序的工作',
    careers: ['会计师', '行政人员', '银行职员', '图书管理员', '秘书', '数据录入员', '档案管理员'],
    color: '#90A4AE'
  }
]

// ========== 题目库 ==========

// 实际型 (realistic) - 11题 [7正 + 4反]
const realisticQuestions: InterestQuestionEnhanced[] = [
  // 正向题
  { id: 'real-01', type: 'realistic', text: '我喜欢修理东西或者动手制作物品', ageGroup: 'all', direction: 'forward', activity: '修理/制作' },
  { id: 'real-02', type: 'realistic', text: '我喜欢操作机器或者使用工具', ageGroup: 'all', direction: 'forward', activity: '操作工具' },
  { id: 'real-03', type: 'realistic', text: '我喜欢在户外工作或者体力活动', ageGroup: 'all', direction: 'forward', activity: '户外活动' },
  { id: 'real-04', type: 'realistic', text: '我喜欢搭积木、拼模型或做手工', ageGroup: 'young', direction: 'forward', activity: '搭建' },
  { id: 'real-05', type: 'realistic', text: '我想学习如何修理电器或机械', ageGroup: 'middle', direction: 'forward', activity: '学习技术' },
  { id: 'real-06', type: 'realistic', text: '我对木材、金属加工等技术工作感兴趣', ageGroup: 'teen', direction: 'forward', activity: '技术加工' },
  { id: 'real-07', type: 'realistic', text: '我喜欢园艺或种植活动', ageGroup: 'all', direction: 'forward', activity: '园艺' },
  // 反向题
  { id: 'real-08', type: 'realistic', text: '我不喜欢需要动手操作的体力劳动', ageGroup: 'all', direction: 'reverse', activity: '体力劳动' },
  { id: 'real-09', type: 'realistic', text: '使用工具对我来说是一件困难的事情', ageGroup: 'all', direction: 'reverse', activity: '工具使用' },
  { id: 'real-10', type: 'realistic', text: '我不喜欢弄脏手或衣服', ageGroup: 'all', direction: 'reverse', activity: '清洁偏好' },
  { id: 'real-11', type: 'realistic', text: '我更愿意坐在办公室工作而不是户外', ageGroup: 'all', direction: 'reverse', activity: '工作环境' }
]

// 研究型 (investigative) - 11题 [7正 + 4反]
const investigativeQuestions: InterestQuestionEnhanced[] = [
  // 正向题
  { id: 'inve-01', type: 'investigative', text: '我喜欢做科学实验和探索未知', ageGroup: 'all', direction: 'forward', activity: '科学实验' },
  { id: 'inve-02', type: 'investigative', text: '我喜欢研究事物的原理和规律', ageGroup: 'all', direction: 'forward', activity: '研究原理' },
  { id: 'inve-03', type: 'investigative', text: '我喜欢解决复杂的难题', ageGroup: 'all', direction: 'forward', activity: '解决难题' },
  { id: 'inve-04', type: 'investigative', text: '我喜欢看关于科学和自然的书', ageGroup: 'young', direction: 'forward', activity: '科学阅读' },
  { id: 'inve-05', type: 'investigative', text: '我喜欢数学课或编程课', ageGroup: 'middle', direction: 'forward', activity: '数学编程' },
  { id: 'inve-06', type: 'investigative', text: '我享受分析数据和寻找规律的过程', ageGroup: 'teen', direction: 'forward', activity: '数据分析' },
  { id: 'inve-07', type: 'investigative', text: '我喜欢思考"为什么"和探索背后的原因', ageGroup: 'all', direction: 'forward', activity: '探索原因' },
  // 反向题
  { id: 'inve-08', type: 'investigative', text: '我不喜欢需要深入思考的复杂问题', ageGroup: 'all', direction: 'reverse', activity: '复杂思考' },
  { id: 'inve-09', type: 'investigative', text: '科学课程对我来说很枯燥', ageGroup: 'all', direction: 'reverse', activity: '科学课程' },
  { id: 'inve-10', type: 'investigative', text: '我不喜欢研究理论或抽象的概念', ageGroup: 'all', direction: 'reverse', activity: '理论学习' },
  { id: 'inve-11', type: 'investigative', text: '遇到难题时，我倾向于放弃而不是深入分析', ageGroup: 'all', direction: 'reverse', activity: '问题解决态度' }
]

// 艺术型 (artistic) - 10题 [6正 + 4反]
const artisticQuestions: InterestQuestionEnhanced[] = [
  // 正向题
  { id: 'arti-01', type: 'artistic', text: '我喜欢画画、音乐或者其他艺术创作', ageGroup: 'all', direction: 'forward', activity: '艺术创作' },
  { id: 'arti-02', type: 'artistic', text: '我喜欢表演或者展示自己的才艺', ageGroup: 'all', direction: 'forward', activity: '表演展示' },
  { id: 'arti-03', type: 'artistic', text: '我喜欢设计和创造新的东西', ageGroup: 'all', direction: 'forward', activity: '设计创造' },
  { id: 'arti-04', type: 'artistic', text: '我喜欢涂鸦、画画或做手工', ageGroup: 'young', direction: 'forward', activity: '美术创作' },
  { id: 'arti-05', type: 'artistic', text: '我对时尚、装饰或美学设计感兴趣', ageGroup: 'teen', direction: 'forward', activity: '美学设计' },
  { id: 'arti-06', type: 'artistic', text: '我喜欢欣赏艺术作品或参观博物馆', ageGroup: 'all', direction: 'forward', activity: '艺术欣赏' },
  // 反向题
  { id: 'arti-07', type: 'artistic', text: '我没有艺术方面的天赋或兴趣', ageGroup: 'all', direction: 'reverse', activity: '艺术天赋' },
  { id: 'arti-08', type: 'artistic', text: '我觉得艺术活动没有意义', ageGroup: 'all', direction: 'reverse', activity: '艺术价值' },
  { id: 'arti-09', type: 'artistic', text: '我不喜欢在别人面前表演或展示', ageGroup: 'all', direction: 'reverse', activity: '表演意愿' },
  { id: 'arti-10', type: 'artistic', text: '我觉得画画或唱歌很浪费时间', ageGroup: 'all', direction: 'reverse', activity: '艺术时间' }
]

// 社会型 (social) - 11题 [7正 + 4反]
const socialQuestions: InterestQuestionEnhanced[] = [
  // 正向题
  { id: 'soci-01', type: 'social', text: '我喜欢帮助别人解决问题', ageGroup: 'all', direction: 'forward', activity: '帮助他人' },
  { id: 'soci-02', type: 'social', text: '我喜欢教别人学习新知识', ageGroup: 'all', direction: 'forward', activity: '教导他人' },
  { id: 'soci-03', type: 'social', text: '我喜欢参与志愿服务和公益活动', ageGroup: 'all', direction: 'forward', activity: '志愿服务' },
  { id: 'soci-04', type: 'social', text: '我喜欢和朋友分享玩具或帮助同学', ageGroup: 'young', direction: 'forward', activity: '分享帮助' },
  { id: 'soci-05', type: 'social', text: '我愿意倾听朋友的烦恼并给予建议', ageGroup: 'middle', direction: 'forward', activity: '倾听支持' },
  { id: 'soci-06', type: 'social', text: '我关注社会问题，希望帮助弱势群体', ageGroup: 'teen', direction: 'forward', activity: '社会关怀' },
  { id: 'soci-07', type: 'social', text: '我愿意为团队或集体付出额外的时间和精力', ageGroup: 'all', direction: 'forward', activity: '团队贡献' },
  // 反向题
  { id: 'soci-08', type: 'social', text: '我不喜欢处理别人的问题或情绪', ageGroup: 'all', direction: 'reverse', activity: '他人问题' },
  { id: 'soci-09', type: 'social', text: '我更愿意独自工作而不是和别人合作', ageGroup: 'all', direction: 'reverse', activity: '合作意愿' },
  { id: 'soci-10', type: 'social', text: '我觉得照顾别人的感受很累', ageGroup: 'all', direction: 'reverse', activity: '情感负担' },
  { id: 'soci-11', type: 'social', text: '我不太关心别人的困难或烦恼', ageGroup: 'all', direction: 'reverse', activity: '同理心' }
]

// 企业型 (enterprising) - 10题 [6正 + 4反]
const enterprisingQuestions: InterestQuestionEnhanced[] = [
  // 正向题
  { id: 'ente-01', type: 'enterprising', text: '我喜欢组织活动和带领团队', ageGroup: 'all', direction: 'forward', activity: '组织领导' },
  { id: 'ente-02', type: 'enterprising', text: '我喜欢说服别人接受我的想法', ageGroup: 'all', direction: 'forward', activity: '说服他人' },
  { id: 'ente-03', type: 'enterprising', text: '我喜欢参与竞争和挑战', ageGroup: 'all', direction: 'forward', activity: '竞争挑战' },
  { id: 'ente-04', type: 'enterprising', text: '我喜欢当小组长或班干部', ageGroup: 'young', direction: 'forward', activity: '领导角色' },
  { id: 'ente-05', type: 'enterprising', text: '我想成为一名企业家或领导者', ageGroup: 'teen', direction: 'forward', activity: '职业抱负' },
  { id: 'ente-06', type: 'enterprising', text: '我愿意为了目标承担风险和压力', ageGroup: 'all', direction: 'forward', activity: '风险承担' },
  // 反向题
  { id: 'ente-07', type: 'enterprising', text: '我不喜欢领导或指挥别人', ageGroup: 'all', direction: 'reverse', activity: '领导意愿' },
  { id: 'ente-08', type: 'enterprising', text: '我害怕竞争，更喜欢安稳', ageGroup: 'all', direction: 'reverse', activity: '竞争态度' },
  { id: 'ente-09', type: 'enterprising', text: '我不善于在众人面前表达观点', ageGroup: 'all', direction: 'reverse', activity: '公开表达' },
  { id: 'ente-10', type: 'enterprising', text: '我更喜欢按部就班而不是冒险', ageGroup: 'all', direction: 'reverse', activity: '风险偏好' }
]

// 常规型 (conventional) - 11题 [7正 + 4反]
const conventionalQuestions: InterestQuestionEnhanced[] = [
  // 正向题
  { id: 'conv-01', type: 'conventional', text: '我喜欢整理和分类东西', ageGroup: 'all', direction: 'forward', activity: '整理分类' },
  { id: 'conv-02', type: 'conventional', text: '我喜欢按照计划和规则做事', ageGroup: 'all', direction: 'forward', activity: '按计划行事' },
  { id: 'conv-03', type: 'conventional', text: '我喜欢做细致和有条理的工作', ageGroup: 'all', direction: 'forward', activity: '细致工作' },
  { id: 'conv-04', type: 'conventional', text: '我喜欢把房间和书桌收拾得整整齐齐', ageGroup: 'young', direction: 'forward', activity: '整理收纳' },
  { id: 'conv-05', type: 'conventional', text: '我喜欢做有明确步骤和标准答案的任务', ageGroup: 'middle', direction: 'forward', activity: '标准化任务' },
  { id: 'conv-06', type: 'conventional', text: '我对会计、档案管理等有条理的工作感兴趣', ageGroup: 'teen', direction: 'forward', activity: '文书工作' },
  { id: 'conv-07', type: 'conventional', text: '我不喜欢突发变化，更喜欢稳定的工作方式', ageGroup: 'all', direction: 'forward', activity: '稳定性偏好' },
  // 反向题
  { id: 'conv-08', type: 'conventional', text: '我不喜欢需要仔细处理细节的工作', ageGroup: 'all', direction: 'reverse', activity: '细节处理' },
  { id: 'conv-09', type: 'conventional', text: '我觉得整理东西很浪费时间', ageGroup: 'all', direction: 'reverse', activity: '整理态度' },
  { id: 'conv-10', type: 'conventional', text: '我不喜欢遵守固定的规则和程序', ageGroup: 'all', direction: 'reverse', activity: '规则遵守' },
  { id: 'conv-11', type: 'conventional', text: '我喜欢灵活变化而不是按计划来', ageGroup: 'all', direction: 'reverse', activity: '灵活性偏好' }
]

// 测谎题/社会期望检验题
// 这些题目检测是否作答者倾向于选择社会期望的答案而非真实答案
const socialDesirabilityQuestions: InterestQuestionEnhanced[] = [
  { id: 'sds-01', type: 'social', text: '我从来没有说过谎', ageGroup: 'all', direction: 'forward' },
  { id: 'sds-02', type: 'social', text: '我总是愿意帮助任何人，不管自己多忙', ageGroup: 'all', direction: 'forward' },
  { id: 'sds-03', type: 'conventional', text: '我从来不会迟到或忘记事情', ageGroup: 'all', direction: 'forward' },
  { id: 'sds-04', type: 'enterprising', text: '我从来没有害怕过任何挑战', ageGroup: 'all', direction: 'forward' }
]

// ========== 导出所有题目 ==========

export const interestQuestionsEnhanced: InterestQuestionEnhanced[] = [
  ...realisticQuestions,
  ...investigativeQuestions,
  ...artisticQuestions,
  ...socialQuestions,
  ...enterprisingQuestions,
  ...conventionalQuestions,
  ...socialDesirabilityQuestions
]

// ========== 工具函数 ==========

// 获取指定年龄段的题目
export function getInterestQuestionsByAgeGroup(ageGroup: 'young' | 'middle' | 'teen'): InterestQuestionEnhanced[] {
  return interestQuestionsEnhanced.filter(q => {
    return q.ageGroup === ageGroup || q.ageGroup === 'all'
  })
}

// 获取指定类型的题目
export function getInterestQuestionsByType(type: string, ageGroup?: 'young' | 'middle' | 'teen'): InterestQuestionEnhanced[] {
  let questions = interestQuestionsEnhanced.filter(q => q.type === type)
  if (ageGroup) {
    questions = questions.filter(q => q.ageGroup === ageGroup || q.ageGroup === 'all')
  }
  return questions
}

// 获取兴趣类型信息（含年龄差异化描述）
export function getInterestTypeEnhanced(key: string, ageGroup?: 'young' | 'teen'): InterestType | undefined {
  const type = interestTypesEnhanced.find(t => t.key === key)
  if (!type) return undefined

  // 根据年龄返回不同的描述
  if (ageGroup === 'young' && type.descriptionYoung) {
    return { ...type, description: type.descriptionYoung }
  }
  if (ageGroup === 'teen' && type.descriptionTeen) {
    return { ...type, description: type.descriptionTeen }
  }
  return type
}

// 获取所有题目（随机排序）
export function getShuffledInterestQuestions(ageGroup: 'young' | 'middle' | 'teen'): InterestQuestionEnhanced[] {
  const questions = getInterestQuestionsByAgeGroup(ageGroup)
  return shuffleArray(questions)
}

// 根据分数获取霍兰德代码（前2-3个最高分的类型）
export function getHollandCodeEnhanced(scores: Record<string, number>): string {
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key]) => {
      const type = getInterestTypeEnhanced(key)
      return type?.code || ''
    })
    .join('')
}

// 获取职业建议（基于霍兰德代码和分数）
export function getCareerSuggestionsEnhanced(scores: Record<string, number>, hollandCode: string): string[] {
  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)

  const careers: string[] = []
  const top2 = sorted.slice(0, 2)

  for (const [key] of top2) {
    const type = interestTypesEnhanced.find(t => t.key === key)
    if (type) {
      careers.push(...type.careers.slice(0, 4))
    }
  }

  return [...new Set(careers)].slice(0, 8)
}

// Fisher-Yates 洗牌算法
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// 反向计分：将1-5分转换为5-1分
export function reverseInterestScore(score: number): number {
  return 6 - score
}

// 计算某种兴趣的原始分数（考虑反向题）
export function calculateInterestRawScore(answers: Array<{ questionId: string; score: number }>, type: string): number {
  const questions = getInterestQuestionsByType(type)
  let totalScore = 0
  let count = 0

  for (const answer of answers) {
    const question = questions.find(q => q.id === answer.questionId)
    if (question) {
      // 反向题需要反向计分
      const score = question.direction === 'reverse' ? reverseInterestScore(answer.score) : answer.score
      totalScore += score
      count++
    }
  }

  return count > 0 ? totalScore : 0
}

// 计算社会期望分数（用于检测作答偏差）
export function calculateSocialDesirabilityScore(answers: Array<{ questionId: string; score: number }>): number {
  const sdsIds = socialDesirabilityQuestions.map(q => q.id)
  let totalScore = 0
  let count = 0

  for (const answer of answers) {
    if (sdsIds.includes(answer.questionId)) {
      // 这些题目如果都答5分，说明可能有社会期望偏差
      totalScore += answer.score
      count++
    }
  }

  return count > 0 ? totalScore / count : 0
}
