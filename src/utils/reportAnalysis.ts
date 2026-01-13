// 报告分析工具函数

import { intelligenceTypes } from '../data/intelligenceQuestions'
import { interestTypes } from '../data/interestQuestions'

// 智能类型中文名称映射
export const intelligenceNameMap: Record<string, string> = {
  linguistic: '语言智能',
  logical: '逻辑数学',
  spatial: '空间智能',
  musical: '音乐智能',
  bodily: '身体运动',
  interpersonal: '人际智能',
  intrapersonal: '内省智能',
  naturalistic: '自然观察'
}

// 兴趣类型中文名称映射
export const interestNameMap: Record<string, string> = {
  realistic: '实际型(R)',
  investigative: '研究型(I)',
  artistic: '艺术型(A)',
  social: '社会型(S)',
  enterprising: '企业型(E)',
  conventional: '常规型(C)'
}

// 认知能力中文名称映射
export const cognitiveNameMap: Record<string, string> = {
  attention: '注意力',
  memory: '记忆力',
  logic: '逻辑思维',
  creativity: '创造力'
}

// 根据智能得分生成建议
export function getIntelligenceSuggestions(scores: Record<string, number>) {
  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
  
  const top3 = sorted.slice(0, 3)
  const bottom2 = sorted.slice(-2)

  const suggestions = {
    strengths: top3.map(([key, score]) => {
      const type = intelligenceTypes.find(t => t.key === key)
      return {
        name: type?.name || key,
        icon: type?.icon || '📊',
        score,
        suggestion: getStrengthSuggestion(key)
      }
    }),
    improvements: bottom2.map(([key, score]) => {
      const type = intelligenceTypes.find(t => t.key === key)
      return {
        name: type?.name || key,
        icon: type?.icon || '📊',
        score,
        suggestion: getImprovementSuggestion(key)
      }
    })
  }

  return suggestions
}

// 优势建议
function getStrengthSuggestion(type: string): string {
  const suggestions: Record<string, string> = {
    linguistic: '可以尝试写作、演讲、辩论等活动，发展语言天赋',
    logical: '适合学习编程、数学奥赛、科学实验等',
    spatial: '可以尝试绘画、建筑设计、3D建模等',
    musical: '建议学习乐器、参加合唱团或音乐创作',
    bodily: '适合参加体育运动、舞蹈或手工制作',
    interpersonal: '可以担任班干部、组织活动、参与志愿服务',
    intrapersonal: '适合写日记、冥想、制定个人成长计划',
    naturalistic: '可以参加自然探索营、养植物或观察动物'
  }
  return suggestions[type] || '继续保持并发展这项优势'
}

// 提升建议
function getImprovementSuggestion(type: string): string {
  const suggestions: Record<string, string> = {
    linguistic: '多阅读、写日记、练习讲故事可以提升语言能力',
    logical: '玩数独、逻辑谜题、编程游戏有助于提升',
    spatial: '拼图、绘画、搭积木可以锻炼空间感',
    musical: '多听音乐、学习节奏打击可以培养乐感',
    bodily: '参加体育运动、学习舞蹈可以提升身体协调',
    interpersonal: '多参与小组活动、练习倾听可以提升社交能力',
    intrapersonal: '写日记、反思每天的收获可以增强自我认识',
    naturalistic: '养植物、观察昆虫、户外探索可以培养自然观察力'
  }
  return suggestions[type] || '通过有针对性的练习可以提升'
}

// 根据职业兴趣生成职业建议
export function getCareerSuggestions(scores: Record<string, number>) {
  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)

  const careerMap: Record<string, string[]> = {
    realistic: ['工程师', '建筑师', '机械师', '农业专家', '厨师'],
    investigative: ['科学家', '医生', '程序员', '研究员', '数据分析师'],
    artistic: ['设计师', '画家', '音乐家', '作家', '演员'],
    social: ['教师', '心理咨询师', '护士', '社工', '人力资源'],
    enterprising: ['企业家', '销售经理', '律师', '项目经理', '主持人'],
    conventional: ['会计师', '银行职员', '行政人员', '图书管理员', '秘书']
  }

  const careers: string[] = []
  sorted.forEach(([key]) => {
    careers.push(...(careerMap[key] || []).slice(0, 3))
  })

  return [...new Set(careers)].slice(0, 6)
}

// 获取霍兰德代码
export function getHollandCode(scores: Record<string, number>): string {
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key]) => {
      const type = interestTypes.find(t => t.key === key)
      return type?.code || ''
    })
    .join('')
}

// 获取综合评价
export function getOverallAssessment(
  intelligenceScores: Record<string, number>,
  interestScores: Record<string, number>,
  cognitiveScores: Record<string, number>
) {
  const avgIntelligence = Object.values(intelligenceScores).reduce((a, b) => a + b, 0) / 8
  const avgCognitive = Object.values(cognitiveScores).reduce((a, b) => a + b, 0) / 4

  let assessment = ''
  
  if (avgIntelligence >= 75 && avgCognitive >= 75) {
    assessment = '综合表现优秀，各方面发展均衡，建议继续保持并深入发展优势领域。'
  } else if (avgIntelligence >= 60 && avgCognitive >= 60) {
    assessment = '综合表现良好，有明显的优势领域，建议针对性培养兴趣特长。'
  } else {
    assessment = '发展潜力大，建议通过多样化活动激发兴趣，发现并培养特长。'
  }

  return {
    avgIntelligence: Math.round(avgIntelligence),
    avgCognitive: Math.round(avgCognitive),
    assessment
  }
}
