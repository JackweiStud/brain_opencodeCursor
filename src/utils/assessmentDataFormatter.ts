/**
 * 评估数据格式化器
 * 将用户的评估数据格式化为 Markdown 格式，用于发送给 AI 模型
 */

import type { AnswerRecord } from '@/stores/questionnaireEnhanced'
import type { GameResults } from '@/stores/games'
import type { ConsistencyAnalysis } from './gameQuestionnaireIntegration'
import type { QuestionEnhanced } from '@/data/intelligenceQuestionsEnhanced'
import type { InterestQuestionEnhanced } from '@/data/interestQuestionsEnhanced'

// 智能类型名称映射
const intelligenceNameMap: Record<string, string> = {
    linguistic: '语言智能',
    logical: '逻辑数学智能',
    spatial: '空间智能',
    musical: '音乐智能',
    bodily: '身体运动智能',
    interpersonal: '人际智能',
    intrapersonal: '内省智能',
    naturalistic: '自然观察智能'
}

// 兴趣类型名称映射
const interestNameMap: Record<string, string> = {
    realistic: '实际型(R)',
    investigative: '研究型(I)',
    artistic: '艺术型(A)',
    social: '社会型(S)',
    enterprising: '企业型(E)',
    conventional: '常规型(C)'
}

// 分数文字描述
const scoreLabels: Record<number, string> = {
    1: '完全不符合',
    2: '不太符合',
    3: '一般',
    4: '比较符合',
    5: '完全符合'
}

export interface ProfileData {
    name: string
    age: number
    gender: 'male' | 'female' | 'other'
    ageGroup: 'young' | 'middle' | 'teen'
}

export interface FormattedAssessmentData {
    markdown: string
    metadata: {
        childName: string
        age: number
        gender: string
        ageGroup: string
        totalQuestions: number
        totalGames: number
        hasConsistencyAnalysis: boolean
    }
}

/**
 * 格式化评估数据为 Markdown
 */
export function formatAssessmentData(
    profile: ProfileData,
    answerRecords: AnswerRecord[],
    intelligenceQuestions: QuestionEnhanced[],
    interestQuestions: InterestQuestionEnhanced[],
    intelligenceScores: Record<string, number>,
    interestScores: Record<string, number>,
    gameResults: GameResults,
    cognitiveScores: { attention: number; memory: number; logic: number; creativity: number },
    consistency?: ConsistencyAnalysis
): FormattedAssessmentData {
    const sections: string[] = []

    // 1. 基础信息
    sections.push(formatBasicInfo(profile))

    // 2. 问卷结果摘要
    sections.push(formatScoresSummary(intelligenceScores, interestScores))

    // 3. 问卷详细答题记录
    sections.push(formatDetailedAnswers(answerRecords, intelligenceQuestions, interestQuestions))

    // 4. 游戏测试结果
    sections.push(formatGameResults(gameResults, cognitiveScores))

    // 5. 一致性分析（如果有）
    if (consistency) {
        sections.push(formatConsistencyAnalysis(consistency))
    }

    const markdown = sections.join('\n\n---\n\n')

    return {
        markdown,
        metadata: {
            childName: profile.name,
            age: profile.age,
            gender: profile.gender === 'male' ? '男' : profile.gender === 'female' ? '女' : '其他',
            ageGroup: profile.ageGroup === 'young' ? '7-9岁' : profile.ageGroup === 'middle' ? '10-12岁' : '13-15岁',
            totalQuestions: answerRecords.length,
            totalGames: 4,
            hasConsistencyAnalysis: !!consistency
        }
    }
}

/**
 * 格式化基础信息
 */
function formatBasicInfo(profile: ProfileData): string {
    const genderText = profile.gender === 'male' ? '男' : profile.gender === 'female' ? '女' : '其他'
    const ageGroupText = profile.ageGroup === 'young' ? '7-9岁（低年级）' :
        profile.ageGroup === 'middle' ? '10-12岁（高年级）' : '13-15岁（初中）'

    return `# 儿童基础信息

- **姓名**：${profile.name}
- **年龄**：${profile.age}岁
- **性别**：${genderText}
- **年龄组**：${ageGroupText}
- **评估时间**：${new Date().toLocaleString('zh-CN')}`
}

/**
 * 格式化分数摘要
 */
function formatScoresSummary(
    intelligenceScores: Record<string, number>,
    interestScores: Record<string, number>
): string {
    // 多元智能分数
    const intelligenceEntries = Object.entries(intelligenceScores)
        .sort(([, a], [, b]) => b - a)
        .map(([key, score]) => `- ${intelligenceNameMap[key] || key}：${score}分`)
        .join('\n')

    // 职业兴趣分数
    const interestEntries = Object.entries(interestScores)
        .sort(([, a], [, b]) => b - a)
        .map(([key, score]) => `- ${interestNameMap[key] || key}：${score}分`)
        .join('\n')

    // 计算平均分
    const avgIntelligence = Math.round(
        Object.values(intelligenceScores).reduce((a, b) => a + b, 0) /
        Object.values(intelligenceScores).length
    )
    const avgInterest = Math.round(
        Object.values(interestScores).reduce((a, b) => a + b, 0) /
        Object.values(interestScores).length
    )

    return `# 问卷评分摘要

## 多元智能评分（满分100分）

${intelligenceEntries}

**平均分**：${avgIntelligence}分

## 霍兰德职业兴趣评分（满分100分）

${interestEntries}

**平均分**：${avgInterest}分`
}

/**
 * 格式化详细答题记录
 */
function formatDetailedAnswers(
    answerRecords: AnswerRecord[],
    intelligenceQuestions: QuestionEnhanced[],
    interestQuestions: InterestQuestionEnhanced[]
): string {
    const intelligenceAnswers = answerRecords.filter(a => a.questionType === 'intelligence')
    const interestAnswers = answerRecords.filter(a => a.questionType === 'interest')

    // 构建问题ID到问题内容的映射
    const questionMap = new Map<string, string>()
    intelligenceQuestions.forEach(q => questionMap.set(q.id, q.text))
    interestQuestions.forEach(q => questionMap.set(q.id, q.text))

    // 格式化多元智能答题
    const intelligenceSection = intelligenceAnswers
        .map(answer => {
            const questionText = questionMap.get(answer.questionId) || '未知问题'
            const scoreLabel = scoreLabels[answer.score] || `${answer.score}分`
            return `| ${questionText} | ${answer.score} (${scoreLabel}) |`
        })
        .join('\n')

    // 格式化职业兴趣答题
    const interestSection = interestAnswers
        .map(answer => {
            const questionText = questionMap.get(answer.questionId) || '未知问题'
            const scoreLabel = scoreLabels[answer.score] || `${answer.score}分`
            return `| ${questionText} | ${answer.score} (${scoreLabel}) |`
        })
        .join('\n')

    return `# 详细答题记录

## 多元智能问卷（共${intelligenceAnswers.length}题）

| 题目内容 | 作答 |
|---------|------|
${intelligenceSection}

## 职业兴趣问卷（共${interestAnswers.length}题）

| 题目内容 | 作答 |
|---------|------|
${interestSection}`
}

/**
 * 格式化游戏测试结果
 */
function formatGameResults(
    gameResults: GameResults,
    cognitiveScores: { attention: number; memory: number; logic: number; creativity: number }
): string {
    // 舒尔特方格详情
    const schulteDetails = gameResults.schulte.times.length > 0
        ? gameResults.schulte.times.map((time, i) =>
            `第${i + 1}次：${time.toFixed(1)}秒，错误${gameResults.schulte.errors[i] || 0}次`
        ).join('；')
        : '未完成'

    // 记忆力详情
    const memoryDetails = gameResults.memory.scores.length > 0
        ? gameResults.memory.scores.map((score, i) =>
            `第${i + 1}次：${score}分`
        ).join('；')
        : '未完成'

    // 逻辑推理详情
    const logicDetails = gameResults.logic.answers.length > 0
        ? gameResults.logic.answers.map((correct, i) =>
            `第${i + 1}题：${correct ? '正确' : '错误'}（用时${gameResults.logic.times[i]?.toFixed(1) || 0}秒）`
        ).join('；')
        : '未完成'

    // 创造力详情 - 使用完整数据格式
    let creativeDetails = '未完成'
    const creativeRounds = gameResults.creative.rounds
    
    if (creativeRounds && creativeRounds.length > 0) {
        // 新格式：包含完整题目信息
        creativeDetails = creativeRounds.map((round, i) => {
            const userAnswersStr = round.userAnswers.length > 0 
                ? round.userAnswers.join('、') 
                : '（无）'
            const refAnswersStr = round.referenceAnswers.join('、')
            const categoryStr = round.promptCategory || '生活物品'
            return `**第${i + 1}轮【${categoryStr}】**
- 题目：${round.promptItem}
- 问题：${round.promptQuestion}
- 用户答案（${round.userAnswers.length}个）：${userAnswersStr}
- 参考答案：${refAnswersStr}`
        }).join('\n\n')
    } else if (gameResults.creative.answers.length > 0) {
        // 兼容旧格式
        creativeDetails = gameResults.creative.answers.map((answers, i) =>
            `第${i + 1}题：${answers.length}个答案 - ${answers.join('、')}`
        ).join('；')
    }

    return `# 认知能力游戏测试结果

## 测试汇总（满分100分）

| 能力维度 | 得分 | 说明 |
|---------|------|------|
| 注意力 | ${cognitiveScores.attention}分 | 舒尔特方格测试 |
| 记忆力 | ${cognitiveScores.memory}分 | 图形记忆测试 |
| 逻辑思维 | ${cognitiveScores.logic}分 | 规律推理测试 |
| 创造力 | ${cognitiveScores.creativity}分 | 发散思维测试 |

## 详细测试数据

### 舒尔特方格（注意力测试）
${schulteDetails}

### 图形记忆（记忆力测试）
${memoryDetails}

### 规律推理（逻辑思维测试）
${logicDetails}

### 发散思维（创造力测试）
${creativeDetails}`
}

/**
 * 格式化一致性分析结果
 */
function formatConsistencyAnalysis(consistency: ConsistencyAnalysis): string {
    const dimensionDetails = Object.entries(consistency.byDimension)
        .map(([key, data]) => {
            const name = intelligenceNameMap[key] || key
            return `| ${name} | ${data.questionnaireScore} | ${data.gameScore} | ${data.consistency}% | ${data.interpretation} |`
        })
        .join('\n')

    const reliableList = consistency.reliableDimensions
        .map(d => intelligenceNameMap[d] || d)
        .join('、') || '无'

    const alertList = consistency.alertDimensions
        .map(d => intelligenceNameMap[d] || d)
        .join('、') || '无'

    return `# 问卷-游戏一致性分析

## 总体一致性：${consistency.overall}%

- **可信维度**（问卷与游戏一致）：${reliableList}
- **需关注维度**（存在差异）：${alertList}

## 各维度详细对比

| 智能维度 | 问卷分数 | 游戏分数 | 一致性 | 解读 |
|---------|---------|---------|--------|------|
${dimensionDetails}`
}
