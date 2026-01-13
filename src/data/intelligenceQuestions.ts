// 多元智能理论（Gardner）题库
// 8种智能类型，每种3道题，共24道题
// 使用5级李克特量表：1=完全不符合，2=不太符合，3=一般，4=比较符合，5=完全符合

export interface Question {
  id: string
  type: string
  text: string
  ageGroup?: 'young' | 'middle' | 'teen' | 'all'  // 适用年龄段
}

export interface IntelligenceType {
  key: string
  name: string
  nameEn: string
  icon: string
  description: string
  color: string
}

// 智能类型定义
export const intelligenceTypes: IntelligenceType[] = [
  {
    key: 'linguistic',
    name: '语言智能',
    nameEn: 'Linguistic',
    icon: '📝',
    description: '善于用语言表达和理解',
    color: '#FF6B6B'
  },
  {
    key: 'logical',
    name: '逻辑数学智能',
    nameEn: 'Logical-Mathematical',
    icon: '🔢',
    description: '善于逻辑推理和数学运算',
    color: '#4ECDC4'
  },
  {
    key: 'spatial',
    name: '空间智能',
    nameEn: 'Spatial',
    icon: '🎨',
    description: '善于视觉想象和空间感知',
    color: '#45B7D1'
  },
  {
    key: 'musical',
    name: '音乐智能',
    nameEn: 'Musical',
    icon: '🎵',
    description: '善于感知和创作音乐',
    color: '#96CEB4'
  },
  {
    key: 'bodily',
    name: '身体运动智能',
    nameEn: 'Bodily-Kinesthetic',
    icon: '⚽',
    description: '善于身体协调和运动技能',
    color: '#FFEAA7'
  },
  {
    key: 'interpersonal',
    name: '人际智能',
    nameEn: 'Interpersonal',
    icon: '👥',
    description: '善于理解他人和社交',
    color: '#DDA0DD'
  },
  {
    key: 'intrapersonal',
    name: '内省智能',
    nameEn: 'Intrapersonal',
    icon: '🧘',
    description: '善于自我认识和反思',
    color: '#98D8C8'
  },
  {
    key: 'naturalistic',
    name: '自然观察智能',
    nameEn: 'Naturalistic',
    icon: '🌿',
    description: '善于观察和理解自然',
    color: '#7CB342'
  }
]

// 题目库
export const intelligenceQuestions: Question[] = [
  // 语言智能 (linguistic) - 3题
  {
    id: 'ling-1',
    type: 'linguistic',
    text: '我喜欢阅读各种类型的书籍和文章',
    ageGroup: 'all'
  },
  {
    id: 'ling-2',
    type: 'linguistic',
    text: '我能够清楚地向别人解释复杂的事情',
    ageGroup: 'all'
  },
  {
    id: 'ling-3',
    type: 'linguistic',
    text: '我喜欢写日记、故事或者诗歌',
    ageGroup: 'all'
  },

  // 逻辑数学智能 (logical) - 3题
  {
    id: 'logi-1',
    type: 'logical',
    text: '我喜欢解决数学问题和逻辑谜题',
    ageGroup: 'all'
  },
  {
    id: 'logi-2',
    type: 'logical',
    text: '我能够快速找出事物之间的规律',
    ageGroup: 'all'
  },
  {
    id: 'logi-3',
    type: 'logical',
    text: '我喜欢分析问题，寻找解决方案',
    ageGroup: 'all'
  },

  // 空间智能 (spatial) - 3题
  {
    id: 'spat-1',
    type: 'spatial',
    text: '我能够很好地想象物体旋转后的样子',
    ageGroup: 'all'
  },
  {
    id: 'spat-2',
    type: 'spatial',
    text: '我喜欢画画、拼图或者搭建模型',
    ageGroup: 'all'
  },
  {
    id: 'spat-3',
    type: 'spatial',
    text: '我容易记住地图和方向',
    ageGroup: 'all'
  },

  // 音乐智能 (musical) - 3题
  {
    id: 'musi-1',
    type: 'musical',
    text: '我能够轻松记住歌曲的旋律',
    ageGroup: 'all'
  },
  {
    id: 'musi-2',
    type: 'musical',
    text: '我能听出音乐中不同乐器的声音',
    ageGroup: 'all'
  },
  {
    id: 'musi-3',
    type: 'musical',
    text: '我喜欢唱歌或者演奏乐器',
    ageGroup: 'all'
  },

  // 身体运动智能 (bodily) - 3题
  {
    id: 'bodi-1',
    type: 'bodily',
    text: '我擅长运动或者舞蹈',
    ageGroup: 'all'
  },
  {
    id: 'bodi-2',
    type: 'bodily',
    text: '我喜欢动手做手工或者实验',
    ageGroup: 'all'
  },
  {
    id: 'bodi-3',
    type: 'bodily',
    text: '我学习新的身体动作很快',
    ageGroup: 'all'
  },

  // 人际智能 (interpersonal) - 3题
  {
    id: 'inte-1',
    type: 'interpersonal',
    text: '我很容易交到新朋友',
    ageGroup: 'all'
  },
  {
    id: 'inte-2',
    type: 'interpersonal',
    text: '我能够理解别人的感受和想法',
    ageGroup: 'all'
  },
  {
    id: 'inte-3',
    type: 'interpersonal',
    text: '我喜欢参加团队活动和小组讨论',
    ageGroup: 'all'
  },

  // 内省智能 (intrapersonal) - 3题
  {
    id: 'intr-1',
    type: 'intrapersonal',
    text: '我了解自己的优点和缺点',
    ageGroup: 'all'
  },
  {
    id: 'intr-2',
    type: 'intrapersonal',
    text: '我喜欢独处思考问题',
    ageGroup: 'all'
  },
  {
    id: 'intr-3',
    type: 'intrapersonal',
    text: '我能够很好地控制自己的情绪',
    ageGroup: 'all'
  },

  // 自然观察智能 (naturalistic) - 3题
  {
    id: 'natu-1',
    type: 'naturalistic',
    text: '我喜欢观察动物和植物',
    ageGroup: 'all'
  },
  {
    id: 'natu-2',
    type: 'naturalistic',
    text: '我能够区分不同种类的动植物',
    ageGroup: 'all'
  },
  {
    id: 'natu-3',
    type: 'naturalistic',
    text: '我喜欢在户外探索大自然',
    ageGroup: 'all'
  }
]

// 获取指定类型的题目
export function getQuestionsByType(type: string): Question[] {
  return intelligenceQuestions.filter(q => q.type === type)
}

// 获取所有题目（随机排序）
export function getShuffledQuestions(): Question[] {
  return [...intelligenceQuestions].sort(() => Math.random() - 0.5)
}

// 获取智能类型信息
export function getIntelligenceType(key: string): IntelligenceType | undefined {
  return intelligenceTypes.find(t => t.key === key)
}
