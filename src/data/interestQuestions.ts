// 霍兰德职业兴趣理论（RIASEC）题库
// 6种兴趣类型，每种3道题，共18道题
// 使用5级李克特量表：1=完全不喜欢，2=不太喜欢，3=一般，4=比较喜欢，5=非常喜欢

export interface InterestQuestion {
  id: string
  type: string
  text: string
  activity?: string  // 具体活动描述
}

export interface InterestType {
  key: string
  name: string
  nameEn: string
  code: string  // R/I/A/S/E/C
  icon: string
  description: string
  careers: string[]  // 相关职业
  color: string
}

// 兴趣类型定义
export const interestTypes: InterestType[] = [
  {
    key: 'realistic',
    name: '实际型',
    nameEn: 'Realistic',
    code: 'R',
    icon: '🔧',
    description: '喜欢动手操作、使用工具',
    careers: ['工程师', '建筑师', '机械师', '飞行员', '农业专家'],
    color: '#E57373'
  },
  {
    key: 'investigative',
    name: '研究型',
    nameEn: 'Investigative',
    code: 'I',
    icon: '🔬',
    description: '喜欢研究、分析和解决问题',
    careers: ['科学家', '医生', '程序员', '数据分析师', '研究员'],
    color: '#64B5F6'
  },
  {
    key: 'artistic',
    name: '艺术型',
    nameEn: 'Artistic',
    code: 'A',
    icon: '🎭',
    description: '喜欢创作、表演和艺术表达',
    careers: ['画家', '音乐家', '作家', '设计师', '演员'],
    color: '#BA68C8'
  },
  {
    key: 'social',
    name: '社会型',
    nameEn: 'Social',
    code: 'S',
    icon: '🤝',
    description: '喜欢帮助他人、教育和服务',
    careers: ['教师', '心理咨询师', '社工', '护士', '人力资源'],
    color: '#81C784'
  },
  {
    key: 'enterprising',
    name: '企业型',
    nameEn: 'Enterprising',
    code: 'E',
    icon: '💼',
    description: '喜欢领导、说服和管理',
    careers: ['企业家', '销售经理', '律师', '政治家', '项目经理'],
    color: '#FFB74D'
  },
  {
    key: 'conventional',
    name: '常规型',
    nameEn: 'Conventional',
    code: 'C',
    icon: '📊',
    description: '喜欢整理、计划和有序工作',
    careers: ['会计师', '行政人员', '银行职员', '图书管理员', '秘书'],
    color: '#90A4AE'
  }
]

// 题目库
export const interestQuestions: InterestQuestion[] = [
  // 实际型 (realistic) - 3题
  {
    id: 'real-1',
    type: 'realistic',
    text: '我喜欢修理东西或者动手制作物品',
    activity: '修理/制作'
  },
  {
    id: 'real-2',
    type: 'realistic',
    text: '我喜欢操作机器或者使用工具',
    activity: '操作工具'
  },
  {
    id: 'real-3',
    type: 'realistic',
    text: '我喜欢在户外工作或者体力活动',
    activity: '户外活动'
  },

  // 研究型 (investigative) - 3题
  {
    id: 'inve-1',
    type: 'investigative',
    text: '我喜欢做科学实验和探索未知',
    activity: '科学实验'
  },
  {
    id: 'inve-2',
    type: 'investigative',
    text: '我喜欢研究事物的原理和规律',
    activity: '研究原理'
  },
  {
    id: 'inve-3',
    type: 'investigative',
    text: '我喜欢解决复杂的难题',
    activity: '解决难题'
  },

  // 艺术型 (artistic) - 3题
  {
    id: 'arti-1',
    type: 'artistic',
    text: '我喜欢画画、音乐或者其他艺术创作',
    activity: '艺术创作'
  },
  {
    id: 'arti-2',
    type: 'artistic',
    text: '我喜欢表演或者展示自己的才艺',
    activity: '表演展示'
  },
  {
    id: 'arti-3',
    type: 'artistic',
    text: '我喜欢设计和创造新的东西',
    activity: '设计创造'
  },

  // 社会型 (social) - 3题
  {
    id: 'soci-1',
    type: 'social',
    text: '我喜欢帮助别人解决问题',
    activity: '帮助他人'
  },
  {
    id: 'soci-2',
    type: 'social',
    text: '我喜欢教别人学习新知识',
    activity: '教导他人'
  },
  {
    id: 'soci-3',
    type: 'social',
    text: '我喜欢参与志愿服务和公益活动',
    activity: '志愿服务'
  },

  // 企业型 (enterprising) - 3题
  {
    id: 'ente-1',
    type: 'enterprising',
    text: '我喜欢组织活动和带领团队',
    activity: '组织领导'
  },
  {
    id: 'ente-2',
    type: 'enterprising',
    text: '我喜欢说服别人接受我的想法',
    activity: '说服他人'
  },
  {
    id: 'ente-3',
    type: 'enterprising',
    text: '我喜欢参与竞争和挑战',
    activity: '竞争挑战'
  },

  // 常规型 (conventional) - 3题
  {
    id: 'conv-1',
    type: 'conventional',
    text: '我喜欢整理和分类东西',
    activity: '整理分类'
  },
  {
    id: 'conv-2',
    type: 'conventional',
    text: '我喜欢按照计划和规则做事',
    activity: '按计划行事'
  },
  {
    id: 'conv-3',
    type: 'conventional',
    text: '我喜欢做细致和有条理的工作',
    activity: '细致工作'
  }
]

// 获取指定类型的题目
export function getInterestQuestionsByType(type: string): InterestQuestion[] {
  return interestQuestions.filter(q => q.type === type)
}

// 获取所有题目（随机排序）
export function getShuffledInterestQuestions(): InterestQuestion[] {
  return [...interestQuestions].sort(() => Math.random() - 0.5)
}

// 获取兴趣类型信息
export function getInterestType(key: string): InterestType | undefined {
  return interestTypes.find(t => t.key === key)
}

// 根据分数获取霍兰德代码（前2-3个最高分的类型）
export function getHollandCode(scores: Record<string, number>): string {
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key]) => {
      const type = getInterestType(key)
      return type?.code || ''
    })
    .join('')
}
