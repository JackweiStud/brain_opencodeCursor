# AI 驱动的综合评价功能设计

**日期**：2026-01-14  
**状态**：已确认，待实现

---

## 一、功能概述

将现有的固定模板综合评价升级为 **AI 驱动的动态评价**，使用 Gemini 3 Pro Flash 模型基于用户实际答题数据生成个性化、专业的儿童发展潜力评估报告。

---

## 二、核心需求

### 2.1 目标
- **指导家长**：提供教育方向和培养建议
- **个性化**：每个孩子的评价都独特，结合具体数据

### 2.2 输入数据（发送给 AI）
- ✅ 基础信息（年龄、性别、年龄组）
- ✅ 问卷原始答案 + 题目内容
- ✅ 游戏测试结果（4种认知能力详细数据）
- ✅ 一致性分析结果
- 📄 整理为 Markdown 格式

### 2.3 输出内容
| 模块 | 描述 |
|------|------|
| 总体概述 | 温暖的开场白 + 关键发现 |
| 优势分析 | TOP3优势智能 + 具体表现 + 日常体现 |
| 发展建议 | 优势培养 + 探索领域 + 日常活动 |
| 学习风格 | VARK类型 + 在家策略 + 沟通建议 |
| 职业兴趣 | 霍兰德代码 + 解读 + 未来方向 |
| 潜力预测 | 短期/长期展望 + 家长角色 |
| 注意事项 | 关注领域 + 建议 + 鼓励话语 |

### 2.4 理论框架
- 加德纳多元智能理论
- 霍兰德职业兴趣理论
- 德韦克成长型思维
- VARK 学习风格理论

### 2.5 语言风格
**温暖亲和** — 像专家和家长交流，通俗易懂

---

## 三、技术方案

### 3.1 API 调用方式
- **MVP**：前端直接调用 Gemini API
- API Key 管理：优先读取 `VITE_GEMINI_API_KEY` 环境变量，没有时提示用户输入
- 错误处理：显示错误提示，让用户稍后重试

### 3.2 Prompt 设计（版本 B+）

#### System Prompt

```
你是一位专业的儿童发展心理咨询师，拥有15年儿童能力评估和家庭教育指导经验。

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
- 使用中文，称呼"您"和孩子名字
```

#### User Prompt Template

```
请为以下儿童撰写发展潜力评估报告。

# 评估数据
{assessmentData}

## 输出要求
1. 使用中文
2. 基于提供的数据，不编造
3. 输出纯净JSON，无markdown标记

## JSON格式
{详见下方 Output Schema}
```

### 3.3 输出 JSON Schema

```typescript
interface AIAssessmentResult {
  childName: string
  overallSummary: {
    opening: string          // 温暖开场白（50-80字）
    keyHighlight: string     // 最重要发现（30字）
  }
  strengthAnalysis: {
    topThree: Array<{
      name: string           // 优势名称
      score: number          // 分数
      description: string    // 表现描述（50字）
      realLifeExample: string // 日常体现（30字）
    }>
    uniqueTrait: string      // 独特特质（40字）
    summaryParagraph: string // 整体画像（80-120字）
  }
  developmentSuggestions: {
    strengthNurturing: Array<{
      area: string
      why: string            // 原因（20字）
      how: string            // 方法（40字）
      frequency: string      // 频率
    }>
    explorationAreas: Array<{
      area: string
      reason: string         // 原因（20字）
      startingPoint: string  // 入门建议（30字）
    }>
    dailyActivities: string[] // 3个日常活动
  }
  learningStyle: {
    primaryType: 'Visual' | 'Auditory' | 'ReadWrite' | 'Kinesthetic'
    primaryTypeChinese: '视觉型' | '听觉型' | '读写型' | '动觉型'
    characteristics: string  // 特征描述（40字）
    atHomeStrategies: string[] // 3个在家策略
    communicationTip: string   // 与老师沟通建议
  }
  careerInterests: {
    hollandCode: string      // 三字母代码
    codeInterpretation: string // 代码解读（50字）
    currentInterests: string   // 当前兴趣领域（40字）
    futureDirections: string[] // 5个未来方向
  }
  potentialPrediction: {
    shortTermVision: string  // 1-2年发展预期（60字）
    longTermVision: string   // 长期发展展望（60字）
    parentRole: string       // 家长角色（40字）
  }
  attentionPoints: {
    areasToWatch: Array<{
      area: string
      observation: string    // 观察到的现象（30字）
      suggestion: string     // 改善建议（40字）
    }>
    encouragement: string    // 结尾鼓励话语（50字）
  }
  metadata: {
    reliabilityNote: string  // 评估可信度说明
    disclaimer: string       // 免责声明
  }
}
```

---

## 四、实现计划

### 4.1 新增文件
| 文件 | 作用 |
|------|------|
| `src/utils/aiAssessment.ts` | AI 评价核心逻辑 |
| `src/utils/assessmentDataFormatter.ts` | 评估数据格式化为 Markdown |
| `src/components/report/AIAssessmentCard.vue` | AI 评价展示组件 |
| `.env.example` | 环境变量示例（VITE_GEMINI_API_KEY） |

### 4.2 修改文件
| 文件 | 修改内容 |
|------|----------|
| `src/views/ReportPage.vue` | 集成 AI 评价，替换原有综合评价 |
| `src/stores/testHistory.ts` | 保存 AI 评价结果到历史记录 |

### 4.3 实现步骤
1. ✅ 设计确认（已完成）
2. ⏳ 创建 `assessmentDataFormatter.ts` — 格式化数据为 Markdown
3. ⏳ 创建 `aiAssessment.ts` — 封装 Gemini API 调用
4. ⏳ 创建 `AIAssessmentCard.vue` — 展示 AI 评价结果
5. ⏳ 修改 `ReportPage.vue` — 集成 AI 评价
6. ⏳ 添加 API Key 配置 UI
7. ⏳ 测试验证

---

## 五、风险与注意事项

1. **API Key 安全**：前端直接调用会暴露 Key，MVP 阶段可接受，后续需迁移到后端
2. **API 成本**：Gemini Flash 较便宜，但需关注调用频率
3. **响应时间**：AI 生成需要 3-10 秒，需添加加载状态
4. **输出稳定性**：AI 输出可能格式不规范，需要健壮的 JSON 解析
5. **回退方案**：调用失败时显示错误提示

---

## 六、确认记录

- **确认时间**：2026-01-14 06:43
- **确认版本**：Prompt B+ 版本
- **下一步**：开始实现
