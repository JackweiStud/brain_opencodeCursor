// 多元智能理论（Gardner）增强题库
// 8种智能类型，每种10-12题，共85题
// 包含正向题(+)和反向题(-)
// 包含年龄差异化表述：young(7-9岁), middle(10-12岁), teen(13-15岁)
// 使用5级李克特量表：1=完全不符合，2=不太符合，3=一般，4=比较符合，5=完全符合

export interface QuestionEnhanced {
  id: string
  type: string
  text: string
  ageGroup: 'young' | 'middle' | 'teen' | 'all'
  direction: 'forward' | 'reverse'  // 正向题/反向题
  category?: string  // 子分类（用于更精细分析）
}

export interface IntelligenceType {
  key: string
  name: string
  nameEn: string
  icon: string
  description: string
  color: string
  descriptionYoung?: string  // 7-9岁描述
  descriptionTeen?: string   // 13-15岁描述
}

// 智能类型定义（含年龄差异化描述）
export const intelligenceTypesEnhanced: IntelligenceType[] = [
  {
    key: 'linguistic',
    name: '语言智能',
    nameEn: 'Linguistic',
    icon: '📝',
    description: '善于用语言表达和理解',
    descriptionYoung: '喜欢听故事、讲故事，说话清楚',
    descriptionTeen: '擅长语言表达和文字理解，善于沟通',
    color: '#FF6B6B'
  },
  {
    key: 'logical',
    name: '逻辑数学智能',
    nameEn: 'Logical-Mathematical',
    icon: '🔢',
    description: '善于逻辑推理和数学运算',
    descriptionYoung: '喜欢数数、做算术，爱问为什么',
    descriptionTeen: '擅长逻辑分析和数学推理，善于解决问题',
    color: '#4ECDC4'
  },
  {
    key: 'spatial',
    name: '空间智能',
    nameEn: 'Spatial',
    icon: '🎨',
    description: '善于视觉想象和空间感知',
    descriptionYoung: '喜欢画画、拼图，认路很厉害',
    descriptionTeen: '空间想象力强，擅长图形思维',
    color: '#45B7D1'
  },
  {
    key: 'musical',
    name: '音乐智能',
    nameEn: 'Musical',
    icon: '🎵',
    description: '善于感知和创作音乐',
    descriptionYoung: '喜欢唱歌，能记住很多歌',
    descriptionTeen: '对音乐敏感，有节奏感和旋律感',
    color: '#96CEB4'
  },
  {
    key: 'bodily',
    name: '身体运动智能',
    nameEn: 'Bodily-Kinesthetic',
    icon: '⚽',
    description: '善于身体协调和运动技能',
    descriptionYoung: '喜欢跑跑跳跳，运动很棒',
    descriptionTeen: '身体协调性好，擅长运动和手工',
    color: '#FFEAA7'
  },
  {
    key: 'interpersonal',
    name: '人际智能',
    nameEn: 'Interpersonal',
    icon: '👥',
    description: '善于理解他人和社交',
    descriptionYoung: '喜欢和朋友一起玩，会照顾人',
    descriptionTeen: '善于理解他人，擅长社交和合作',
    color: '#DDA0DD'
  },
  {
    key: 'intrapersonal',
    name: '内省智能',
    nameEn: 'Intrapersonal',
    icon: '🧘',
    description: '善于自我认识和反思',
    descriptionYoung: '知道自己喜欢什么，不想什么',
    descriptionTeen: '自我认知清晰，善于反思和规划',
    color: '#98D8C8'
  },
  {
    key: 'naturalistic',
    name: '自然观察智能',
    nameEn: 'Naturalistic',
    icon: '🌿',
    description: '善于观察和理解自然',
    descriptionYoung: '喜欢小动物和植物，爱去户外',
    descriptionTeen: '对自然敏感，善于观察和分类',
    color: '#7CB342'
  }
]

// ========== 题目库 ==========

// 语言智能 (linguistic) - 10题 [6正 + 4反]
const linguisticQuestions: QuestionEnhanced[] = [
  // 正向题
  { id: 'ling-01', type: 'linguistic', text: '我特别喜欢阅读各种类型的书籍和文章', ageGroup: 'all', direction: 'forward' },
  { id: 'ling-02', type: 'linguistic', text: '我能够清楚地向别人解释复杂的事情', ageGroup: 'all', direction: 'forward' },
  { id: 'ling-03', type: 'linguistic', text: '我喜欢写日记、故事或者诗歌', ageGroup: 'all', direction: 'forward' },
  { id: 'ling-04', type: 'linguistic', text: '我的词汇量比较丰富，能找到合适的词语表达想法', ageGroup: 'middle', direction: 'forward' },
  { id: 'ling-05', type: 'linguistic', text: '我喜欢玩文字游戏、猜谜语或者学习新词语', ageGroup: 'young', direction: 'forward' },
  { id: 'ling-06', type: 'linguistic', text: '我喜欢参加辩论、演讲或朗诵活动', ageGroup: 'teen', direction: 'forward' },
  // 反向题（需要反向计分）
  { id: 'ling-07', type: 'linguistic', text: '当我需要用文字表达自己的想法时，我觉得很困难', ageGroup: 'all', direction: 'reverse' },
  { id: 'ling-08', type: 'linguistic', text: '我不喜欢阅读长文章，觉得很枯燥', ageGroup: 'all', direction: 'reverse' },
  { id: 'ling-09', type: 'linguistic', text: '别人经常听不懂我想要表达什么', ageGroup: 'all', direction: 'reverse' },
  { id: 'ling-10', type: 'linguistic', text: '我觉得写作文或写信是一件很麻烦的事情', ageGroup: 'all', direction: 'reverse' }
]

// 逻辑数学智能 (logical) - 12题 [7正 + 5反]
const logicalQuestions: QuestionEnhanced[] = [
  // 正向题
  { id: 'logi-01', type: 'logical', text: '我喜欢解决数学问题和逻辑谜题', ageGroup: 'all', direction: 'forward' },
  { id: 'logi-02', type: 'logical', text: '我能够快速找出事物之间的规律', ageGroup: 'all', direction: 'forward' },
  { id: 'logi-03', type: 'logical', text: '我喜欢分析问题，寻找解决方案', ageGroup: 'all', direction: 'forward' },
  { id: 'logi-04', type: 'logical', text: '我对数字敏感，喜欢做计算', ageGroup: 'young', direction: 'forward' },
  { id: 'logi-05', type: 'logical', text: '我喜欢科学实验，想知道事情为什么会发生', ageGroup: 'young', direction: 'forward' },
  { id: 'logi-06', type: 'logical', text: '我喜欢电脑编程或解决数学难题', ageGroup: 'teen', direction: 'forward' },
  { id: 'logi-07', type: 'logical', text: '做事之前，我习惯先制定详细的计划和步骤', ageGroup: 'all', direction: 'forward' },
  // 反向题
  { id: 'logi-08', type: 'logical', text: '数学是我最困难的科目之一', ageGroup: 'all', direction: 'reverse' },
  { id: 'logi-09', type: 'logical', text: '遇到需要推理的问题时，我经常不知道从哪里开始', ageGroup: 'all', direction: 'reverse' },
  { id: 'logi-10', type: 'logical', text: '我不喜欢需要仔细分析的复杂问题', ageGroup: 'all', direction: 'reverse' },
  { id: 'logi-11', type: 'logical', text: '我觉得找规律是一件很累人的事情', ageGroup: 'young', direction: 'reverse' },
  { id: 'logi-12', type: 'logical', text: '我做事比较随性，不喜欢按计划来', ageGroup: 'all', direction: 'reverse' }
]

// 空间智能 (spatial) - 10题 [6正 + 4反]
const spatialQuestions: QuestionEnhanced[] = [
  // 正向题
  { id: 'spat-01', type: 'spatial', text: '我能够很好地想象物体旋转后的样子', ageGroup: 'all', direction: 'forward' },
  { id: 'spat-02', type: 'spatial', text: '我喜欢画画、拼图或者搭建模型', ageGroup: 'all', direction: 'forward' },
  { id: 'spat-03', type: 'spatial', text: '我容易记住地图和方向', ageGroup: 'all', direction: 'forward' },
  { id: 'spat-04', type: 'spatial', text: '我喜欢涂鸦、画画或手工制作', ageGroup: 'young', direction: 'forward' },
  { id: 'spat-05', type: 'spatial', text: '我擅长想象三维空间的物体和结构', ageGroup: 'teen', direction: 'forward' },
  { id: 'spat-06', type: 'spatial', text: '我注意到别人看不到的细节和变化', ageGroup: 'all', direction: 'forward' },
  // 反向题
  { id: 'spat-07', type: 'spatial', text: '看地图时，我经常搞不清楚方向', ageGroup: 'all', direction: 'reverse' },
  { id: 'spat-08', type: 'spatial', text: '我很不擅长想象物体从不同角度看是什么样子', ageGroup: 'all', direction: 'reverse' },
  { id: 'spat-09', type: 'spatial', text: '我不喜欢画画或手工，觉得做不好', ageGroup: 'all', direction: 'reverse' },
  { id: 'spat-10', type: 'spatial', text: '即使去过很多次，我还是会在陌生的地方迷路', ageGroup: 'all', direction: 'reverse' }
]

// 音乐智能 (musical) - 10题 [6正 + 4反]
const musicalQuestions: QuestionEnhanced[] = [
  // 正向题
  { id: 'musi-01', type: 'musical', text: '我能够轻松记住歌曲的旋律', ageGroup: 'all', direction: 'forward' },
  { id: 'musi-02', type: 'musical', text: '我能听出音乐中不同乐器的声音', ageGroup: 'all', direction: 'forward' },
  { id: 'musi-03', type: 'musical', text: '我喜欢唱歌或者演奏乐器', ageGroup: 'all', direction: 'forward' },
  { id: 'musi-04', type: 'musical', text: '我喜欢跟着音乐打拍子或跳舞', ageGroup: 'young', direction: 'forward' },
  { id: 'musi-05', type: 'musical', text: '我经常不由自主地哼唱歌曲', ageGroup: 'all', direction: 'forward' },
  { id: 'musi-06', type: 'musical', text: '我能够轻易分辨出音高和节奏的变化', ageGroup: 'teen', direction: 'forward' },
  // 反向题
  { id: 'musi-07', type: 'musical', text: '我唱歌经常跑调，自己都没察觉', ageGroup: 'all', direction: 'reverse' },
  { id: 'musi-08', type: 'musical', text: '我对音乐不感兴趣，觉得很吵', ageGroup: 'all', direction: 'reverse' },
  { id: 'musi-09', type: 'musical', text: '我很难跟上音乐的节奏', ageGroup: 'all', direction: 'reverse' },
  { id: 'musi-10', type: 'musical', text: '我不太能分辨出不同歌曲的旋律差异', ageGroup: 'all', direction: 'reverse' }
]

// 身体运动智能 (bodily) - 10题 [6正 + 4反]
const bodilyQuestions: QuestionEnhanced[] = [
  // 正向题
  { id: 'bodi-01', type: 'bodily', text: '我擅长运动或者舞蹈', ageGroup: 'all', direction: 'forward' },
  { id: 'bodi-02', type: 'bodily', text: '我喜欢动手做手工或者实验', ageGroup: 'all', direction: 'forward' },
  { id: 'bodi-03', type: 'bodily', text: '我学习新的身体动作很快', ageGroup: 'all', direction: 'forward' },
  { id: 'bodi-04', type: 'bodily', text: '我喜欢体育课，跑跳投都很擅长', ageGroup: 'young', direction: 'forward' },
  { id: 'bodi-05', type: 'bodily', text: '我喜欢参加各种体育运动或健身活动', ageGroup: 'teen', direction: 'forward' },
  { id: 'bodi-06', type: 'bodily', text: '我喜欢拆解和组装东西', ageGroup: 'all', direction: 'forward' },
  // 反向题
  { id: 'bodi-07', type: 'bodily', text: '体育运动对我来说是一件很困难的事情', ageGroup: 'all', direction: 'reverse' },
  { id: 'bodi-08', type: 'bodily', text: '我经常动作笨拙，容易碰倒东西', ageGroup: 'all', direction: 'reverse' },
  { id: 'bodi-09', type: 'bodily', text: '我不喜欢需要动手操作的活动', ageGroup: 'all', direction: 'reverse' },
  { id: 'bodi-10', type: 'bodily', text: '学习新的动作或舞蹈时，我总是比别人慢', ageGroup: 'all', direction: 'reverse' }
]

// 人际智能 (interpersonal) - 11题 [7正 + 4反]
const interpersonalQuestions: QuestionEnhanced[] = [
  // 正向题
  { id: 'inte-01', type: 'interpersonal', text: '我很容易交到新朋友', ageGroup: 'all', direction: 'forward' },
  { id: 'inte-02', type: 'interpersonal', text: '我能够理解别人的感受和想法', ageGroup: 'all', direction: 'forward' },
  { id: 'inte-03', type: 'interpersonal', text: '我喜欢参加团队活动和小组讨论', ageGroup: 'all', direction: 'forward' },
  { id: 'inte-04', type: 'interpersonal', text: '朋友有烦恼时，喜欢找我倾诉', ageGroup: 'all', direction: 'forward' },
  { id: 'inte-05', type: 'interpersonal', text: '我喜欢和大家一起玩耍，不喜欢一个人待着', ageGroup: 'young', direction: 'forward' },
  { id: 'inte-06', type: 'interpersonal', text: '我善于调解同学之间的矛盾', ageGroup: 'middle', direction: 'forward' },
  { id: 'inte-07', type: 'interpersonal', text: '在团队合作中，我经常担任协调者的角色', ageGroup: 'teen', direction: 'forward' },
  // 反向题
  { id: 'inte-08', type: 'interpersonal', text: '我在陌生人面前感到很紧张，不知道说什么', ageGroup: 'all', direction: 'reverse' },
  { id: 'inte-09', type: 'interpersonal', text: '我很难理解别人的情绪和想法', ageGroup: 'all', direction: 'reverse' },
  { id: 'inte-10', type: 'interpersonal', text: '我不喜欢集体活动，更喜欢一个人待着', ageGroup: 'all', direction: 'reverse' },
  { id: 'inte-11', type: 'interpersonal', text: '我觉得和很多人一起玩很累', ageGroup: 'young', direction: 'reverse' }
]

// 内省智能 (intrapersonal) - 11题 [7正 + 4反]
const intrapersonalQuestions: QuestionEnhanced[] = [
  // 正向题
  { id: 'intr-01', type: 'intrapersonal', text: '我了解自己的优点和缺点', ageGroup: 'all', direction: 'forward' },
  { id: 'intr-02', type: 'intrapersonal', text: '我喜欢独处思考问题', ageGroup: 'all', direction: 'forward' },
  { id: 'intr-03', type: 'intrapersonal', text: '我能够很好地控制自己的情绪', ageGroup: 'all', direction: 'forward' },
  { id: 'intr-04', type: 'intrapersonal', text: '我有明确的目标和梦想', ageGroup: 'all', direction: 'forward' },
  { id: 'intr-05', type: 'intrapersonal', text: '我知道自己喜欢什么，不喜欢什么', ageGroup: 'young', direction: 'forward' },
  { id: 'intr-06', type: 'intrapersonal', text: '我经常思考自己的行为和感受', ageGroup: 'middle', direction: 'forward' },
  { id: 'intr-07', type: 'intrapersonal', text: '我会定期反思自己的成长和进步', ageGroup: 'teen', direction: 'forward' },
  // 反向题
  { id: 'intr-08', type: 'intrapersonal', text: '我不太清楚自己真正想要什么', ageGroup: 'all', direction: 'reverse' },
  { id: 'intr-09', type: 'intrapersonal', text: '我很难控制自己的情绪', ageGroup: 'all', direction: 'reverse' },
  { id: 'intr-10', type: 'intrapersonal', text: '独自一人时，我感到很不舒服', ageGroup: 'all', direction: 'reverse' },
  { id: 'intr-11', type: 'intrapersonal', text: '我很少思考自己的感受和想法', ageGroup: 'all', direction: 'reverse' }
]

// 自然观察智能 (naturalistic) - 10题 [6正 + 4反]
const naturalisticQuestions: QuestionEnhanced[] = [
  // 正向题
  { id: 'natu-01', type: 'naturalistic', text: '我喜欢观察动物和植物', ageGroup: 'all', direction: 'forward' },
  { id: 'natu-02', type: 'naturalistic', text: '我能够区分不同种类的动植物', ageGroup: 'all', direction: 'forward' },
  { id: 'natu-03', type: 'naturalistic', text: '我喜欢在户外探索大自然', ageGroup: 'all', direction: 'forward' },
  { id: 'natu-04', type: 'naturalistic', text: '我对小动物和植物很好奇，喜欢观察它们', ageGroup: 'young', direction: 'forward' },
  { id: 'natu-05', type: 'naturalistic', text: '我喜欢饲养宠物或种植植物', ageGroup: 'all', direction: 'forward' },
  { id: 'natu-06', type: 'naturalistic', text: '我对自然环境保护很关注', ageGroup: 'teen', direction: 'forward' },
  // 反向题
  { id: 'natu-07', type: 'naturalistic', text: '我对动植物不感兴趣', ageGroup: 'all', direction: 'reverse' },
  { id: 'natu-08', type: 'naturalistic', text: '我不喜欢户外活动，怕虫子或弄脏', ageGroup: 'all', direction: 'reverse' },
  { id: 'natu-09', type: 'naturalistic', text: '我分不清不同花草树木的名字', ageGroup: 'all', direction: 'reverse' },
  { id: 'natu-10', type: 'naturalistic', text: '我觉得观察自然很无聊', ageGroup: 'all', direction: 'reverse' }
]

// 测谎题/一致性检验题（插入在问卷中不同位置）
// 这些题目以不同形式重复相同内容，用于检测作答一致性
const consistencyQuestions: QuestionEnhanced[] = [
  // 语言智能一致性检验
  { id: 'cons-01', type: 'linguistic', text: '阅读是我最喜欢的活动之一', ageGroup: 'all', direction: 'forward' },
  { id: 'cons-02', type: 'linguistic', text: '我不太喜欢花时间阅读', ageGroup: 'all', direction: 'reverse' },
  // 逻辑数学一致性检验
  { id: 'cons-03', type: 'logical', text: '数学题对我来说很有趣', ageGroup: 'all', direction: 'forward' },
  { id: 'cons-04', type: 'logical', text: '做数学题让我感到头疼', ageGroup: 'all', direction: 'reverse' },
  // 人际智能一致性检验
  { id: 'cons-05', type: 'interpersonal', text: '和别人相处对我来说很容易', ageGroup: 'all', direction: 'forward' },
  { id: 'cons-06', type: 'interpersonal', text: '社交场合让我感到不自在', ageGroup: 'all', direction: 'reverse' }
]

// ========== 导出所有题目 ==========

export const intelligenceQuestionsEnhanced: QuestionEnhanced[] = [
  ...linguisticQuestions,
  ...logicalQuestions,
  ...spatialQuestions,
  ...musicalQuestions,
  ...bodilyQuestions,
  ...interpersonalQuestions,
  ...intrapersonalQuestions,
  ...naturalisticQuestions,
  ...consistencyQuestions
]

// ========== 工具函数 ==========

// 获取指定年龄段的题目
export function getQuestionsByAgeGroup(ageGroup: 'young' | 'middle' | 'teen'): QuestionEnhanced[] {
  return intelligenceQuestionsEnhanced.filter(q => {
    return q.ageGroup === ageGroup || q.ageGroup === 'all'
  })
}

// 获取指定类型的题目
export function getIntelligenceQuestionsByType(type: string, ageGroup?: 'young' | 'middle' | 'teen'): QuestionEnhanced[] {
  let questions = intelligenceQuestionsEnhanced.filter(q => q.type === type)
  if (ageGroup) {
    questions = questions.filter(q => q.ageGroup === ageGroup || q.ageGroup === 'all')
  }
  return questions
}

// 获取智能类型信息（含年龄差异化描述）
export function getIntelligenceTypeEnhanced(key: string, ageGroup?: 'young' | 'teen'): IntelligenceType | undefined {
  const type = intelligenceTypesEnhanced.find(t => t.key === key)
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
export function getShuffledIntelligenceQuestions(ageGroup: 'young' | 'middle' | 'teen'): QuestionEnhanced[] {
  const questions = getQuestionsByAgeGroup(ageGroup)
  return shuffleArray(questions)
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
export function reverseScore(score: number): number {
  return 6 - score
}

// 计算某种智能的原始分数（考虑反向题）
export function calculateRawScore(answers: Array<{ questionId: string; score: number }>, type: string): number {
  const questions = getIntelligenceQuestionsByType(type)
  let totalScore = 0
  let count = 0

  for (const answer of answers) {
    const question = questions.find(q => q.id === answer.questionId)
    if (question) {
      // 反向题需要反向计分
      const score = question.direction === 'reverse' ? reverseScore(answer.score) : answer.score
      totalScore += score
      count++
    }
  }

  return count > 0 ? totalScore : 0
}
