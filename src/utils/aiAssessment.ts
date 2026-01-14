/**
 * AI 综合评价生成器
 * 使用 Gemini API 基于评估数据生成个性化的发展潜力评估报告
 */

import { ref } from 'vue'

// ========== 类型定义 ==========

export interface AIAssessmentResult {
    childName: string
    overallSummary: {
        opening: string
        keyHighlight: string
    }
    strengthAnalysis: {
        topThree: Array<{
            name: string
            score: number
            description: string
            realLifeExample: string
        }>
        uniqueTrait: string
        summaryParagraph: string
    }
    developmentSuggestions: {
        strengthNurturing: Array<{
            area: string
            why: string
            how: string
            frequency: string
        }>
        explorationAreas: Array<{
            area: string
            reason: string
            startingPoint: string
        }>
        dailyActivities: string[]
    }
    learningStyle: {
        primaryType: 'Visual' | 'Auditory' | 'ReadWrite' | 'Kinesthetic'
        primaryTypeChinese: '视觉型' | '听觉型' | '读写型' | '动觉型'
        characteristics: string
        atHomeStrategies: string[]
        communicationTip: string
    }
    careerInterests: {
        hollandCode: string
        codeInterpretation: string
        currentInterests: string
        futureDirections: string[]
    }
    potentialPrediction: {
        shortTermVision: string
        longTermVision: string
        parentRole: string
    }
    attentionPoints: {
        areasToWatch: Array<{
            area: string
            observation: string
            suggestion: string
        }>
        encouragement: string
    }
    metadata: {
        reliabilityNote: string
        disclaimer: string
    }
}

export interface AIAssessmentState {
    loading: boolean
    result: AIAssessmentResult | null
    error: string | null
    generatedAt: string | null
}

// ========== Prompt 配置 ==========

const SYSTEM_PROMPT = `你是一位专业的儿童发展心理咨询师，拥有15年儿童能力评估和家庭教育指导经验。

## 理论基础（内化使用，报告中不直接引用）
1. 加德纳多元智能理论：8种智能各有价值
2. 霍兰德职业兴趣理论：RIASEC六型
3. 德韦克成长型思维：能力可发展
4. VARK学习风格：找到适合的学习方式

## 写作原则
1. 基于数据说话，不编造信息
2. 用"发现"代替"判断"
3. 建议要具体可执行
4. 积极但诚实
5. 尊重个体差异
6. 年龄适配

## 语言风格
- 温暖专业，像老师与家长交谈
- 使用中文，称呼"您"和孩子名字`

const USER_PROMPT_TEMPLATE = `请为以下儿童撰写发展潜力评估报告。

# 评估数据
{assessmentData}

## 输出要求
1. 使用中文
2. 基于提供的数据，不编造
3. 输出纯净JSON，无markdown标记
4. 每个字段都必须填写

## JSON格式
{
  "childName": "姓名",
  "overallSummary": {
    "opening": "温暖开场白（50-80字）",
    "keyHighlight": "最重要发现（30字）"
  },
  "strengthAnalysis": {
    "topThree": [{"name": "优势名称", "score": 85, "description": "表现描述（50字）", "realLifeExample": "日常体现（30字）"}],
    "uniqueTrait": "独特特质（40字）",
    "summaryParagraph": "整体画像（80-120字）"
  },
  "developmentSuggestions": {
    "strengthNurturing": [{"area": "领域", "why": "原因（20字）", "how": "方法（40字）", "frequency": "频率"}],
    "explorationAreas": [{"area": "领域", "reason": "原因（20字）", "startingPoint": "入门建议（30字）"}],
    "dailyActivities": ["活动1", "活动2", "活动3"]
  },
  "learningStyle": {
    "primaryType": "Visual/Auditory/ReadWrite/Kinesthetic",
    "primaryTypeChinese": "视觉型/听觉型/读写型/动觉型",
    "characteristics": "特征描述（40字）",
    "atHomeStrategies": ["策略1", "策略2", "策略3"],
    "communicationTip": "与老师沟通建议"
  },
  "careerInterests": {
    "hollandCode": "RIA",
    "codeInterpretation": "代码解读（50字）",
    "currentInterests": "当前兴趣领域（40字）",
    "futureDirections": ["方向1", "方向2", "方向3", "方向4", "方向5"]
  },
  "potentialPrediction": {
    "shortTermVision": "1-2年发展预期（60字）",
    "longTermVision": "长期发展展望（60字）",
    "parentRole": "家长角色（40字）"
  },
  "attentionPoints": {
    "areasToWatch": [{"area": "关注领域", "observation": "观察到的现象（30字）", "suggestion": "改善建议（40字）"}],
    "encouragement": "结尾鼓励话语（50字）"
  },
  "metadata": {
    "reliabilityNote": "评估可信度说明",
    "disclaimer": "报告仅供参考，不能替代专业诊断"
  }
}`

// ========== API Key 管理 ==========

const STORAGE_KEY = 'kidpotential_gemini_api_key'

/**
 * 获取 Gemini API Key
 * 优先读取环境变量，其次读取本地存储
 */
export function getApiKey(): string | null {
    // 1. 尝试从环境变量读取
    const envKey = import.meta.env.VITE_GEMINI_API_KEY
    if (envKey) {
        return envKey
    }

    // 2. 从本地存储读取
    const storedKey = localStorage.getItem(STORAGE_KEY)
    return storedKey
}

/**
 * 保存 API Key 到本地存储
 */
export function saveApiKey(apiKey: string): void {
    localStorage.setItem(STORAGE_KEY, apiKey)
}

/**
 * 清除本地存储的 API Key
 */
export function clearApiKey(): void {
    localStorage.removeItem(STORAGE_KEY)
}

/**
 * 检查是否有可用的 API Key
 */
export function hasApiKey(): boolean {
    return !!getApiKey()
}

// ========== AI 评估生成 ==========

/**
 * 调用 Gemini API 生成综合评价
 */
export async function generateAIAssessment(
    assessmentDataMarkdown: string
): Promise<AIAssessmentResult> {
    const apiKey = getApiKey()
    if (!apiKey) {
        throw new Error('请先配置 Gemini API Key')
    }

    // 构建用户 prompt
    const userPrompt = USER_PROMPT_TEMPLATE.replace('{assessmentData}', assessmentDataMarkdown)

    // 调用 Gemini API
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: SYSTEM_PROMPT + '\n\n' + userPrompt }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.5,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 4096,
                    responseMimeType: 'application/json'
                }
            })
        }
    )

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData?.error?.message || `API 请求失败: ${response.status}`
        throw new Error(errorMessage)
    }

    const data = await response.json()

    // 解析响应
    const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!textContent) {
        throw new Error('AI 响应为空，请重试')
    }

    // 尝试解析 JSON
    try {
        // 清理可能的 markdown 标记
        let jsonStr = textContent.trim()
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.slice(7)
        }
        if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.slice(3)
        }
        if (jsonStr.endsWith('```')) {
            jsonStr = jsonStr.slice(0, -3)
        }
        jsonStr = jsonStr.trim()

        const result = JSON.parse(jsonStr) as AIAssessmentResult
        return result
    } catch (parseError) {
        console.error('JSON 解析失败:', parseError, 'Raw:', textContent)
        throw new Error('AI 输出格式异常，请重试')
    }
}

// ========== Vue Composable ==========

/**
 * 创建 AI 评估状态管理 composable
 */
export function useAIAssessment() {
    const state = ref<AIAssessmentState>({
        loading: false,
        result: null,
        error: null,
        generatedAt: null
    })

    const generate = async (assessmentDataMarkdown: string) => {
        state.value.loading = true
        state.value.error = null

        try {
            const result = await generateAIAssessment(assessmentDataMarkdown)
            state.value.result = result
            state.value.generatedAt = new Date().toISOString()

            // 保存到本地存储
            saveResultToStorage(result)
        } catch (error) {
            state.value.error = error instanceof Error ? error.message : '生成失败，请稍后重试'
            console.error('AI 评估生成失败:', error)
        } finally {
            state.value.loading = false
        }
    }

    const reset = () => {
        state.value = {
            loading: false,
            result: null,
            error: null,
            generatedAt: null
        }
    }

    // 尝试从本地存储加载
    const loadFromStorage = () => {
        try {
            const saved = localStorage.getItem('kidpotential_ai_assessment')
            if (saved) {
                const data = JSON.parse(saved)
                state.value.result = data.result
                state.value.generatedAt = data.generatedAt
            }
        } catch (e) {
            console.error('加载 AI 评估结果失败:', e)
        }
    }

    // 初始化时加载
    loadFromStorage()

    return {
        state,
        generate,
        reset,
        hasApiKey,
        saveApiKey,
        getApiKey,
        clearApiKey
    }
}

/**
 * 保存结果到本地存储
 */
function saveResultToStorage(result: AIAssessmentResult): void {
    try {
        localStorage.setItem('kidpotential_ai_assessment', JSON.stringify({
            result,
            generatedAt: new Date().toISOString()
        }))
    } catch (e) {
        console.error('保存 AI 评估结果失败:', e)
    }
}

/**
 * 清除存储的 AI 评估结果
 */
export function clearAIAssessmentStorage(): void {
    localStorage.removeItem('kidpotential_ai_assessment')
}
