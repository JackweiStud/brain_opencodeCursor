# 童智星探 - 增强版使用指南

本文档说明如何使用增强版功能，包括扩充的题目库、改进的评分算法、免责声明和常模收集系统。

---

## 📋 目录

1. [增强题目库使用](#1-增强题目库使用)
2. [年龄差异化功能](#2-年龄差异化功能)
3. [改进的评分算法](#3-改进的评分算法)
4. [法律免责声明](#4-法律免责声明)
5. [常模数据收集](#5-常模数据收集)

---

## 1. 增强题目库使用

### 1.1 题目数量对比

| 类型 | 原版 | 增强版 | 改进 |
|------|------|--------|------|
| 多元智能 | 每类 3 题 | 每类 10-12 ��� | +233% |
| 职业兴趣 | 每类 3 题 | 每类 10-12 题 | +233% |
| 反向题 | 0 | 约30% | ✓ |
| 测谎题 | 0 | 有 | ✓ |

### 1.2 导入增强题目库

```typescript
// 替换原来的导入
// import { intelligenceQuestions } from '@/data/intelligenceQuestions'
// import { interestQuestions } from '@/data/interestQuestions'

// 改用增强版
import {
  intelligenceQuestionsEnhanced,
  getShuffledIntelligenceQuestions,
  getIntelligenceQuestionsByType,
  reverseScore
} from '@/data/intelligenceQuestionsEnhanced'

import {
  interestQuestionsEnhanced,
  getShuffledInterestQuestions,
  getInterestQuestionsByType
} from '@/data/interestQuestionsEnhanced'
```

### 1.3 获取年龄适配的题目

```typescript
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()
const ageGroup = profileStore.ageGroup // 'young' | 'middle' | 'teen'

// 获取适合该年龄的题目
const questions = getShuffledIntelligenceQuestions(ageGroup)
```

---

## 2. 年龄差异化功能

### 2.1 年龄分组定义

| 组别 | 年龄范围 | 认知特点 | 题目风格 |
|------|----------|----------|----------|
| young | 7-9岁 | 具体形象思维 | 语言简单、具体、有图片辅助 |
| middle | 10-12岁 | 抽象思维发展 | 可以包含一些抽象概念 |
| teen | 13-15岁 | 抽象逻辑思维成熟 | 可以处理复杂问题 |

### 2.2 获取年龄适配的描述

```typescript
import { getIntelligenceTypeEnhanced } from '@/data/intelligenceQuestionsEnhanced'

const typeInfo = getIntelligenceTypeEnhanced('linguistic', 'young')
// young 会返回 "喜欢听故事、讲故事，说话清楚"
// teen 会返回 "擅长语言表达和文字理解，善于沟通"
```

---

## 3. 改进的评分算法

### 3.1 评分算法增强功能

| 功能 | 说明 |
|------|------|
| 标准分转换 | 原始分转换为T分数（均值50，标准差10） |
| 百分等级 | 基于正态分布的百分位计算 |
| 置信区间 | 95%置信区间，显示结果的不确定性 |
| 信度检验 | Cronbach's α系数计算 |
| 异常检测 | 检测随意作答、社会期望偏差 |
| 反向计分 | 自动处理反向题 |

### 3.2 使用增强评分

```typescript
import { scoreQuestionnaire } from '@/utils/scoringEnhanced'

// 对问卷进行评分
const result = scoreQuestionnaire(
  answers,                    // 答案数组 { questionId, score }
  'intelligence',             // 题目类型
  'young',                    // 年龄组
  10,                         // 题目数量
  ['ling-07', 'ling-08'],     // 反向题ID列表
  ['sds-01', 'sds-02']        // 测谎题ID列表
)

console.log(result)
// {
//   rawScore: 72,
//   standardScore: 55,
//   percentile: 69,
//   confidenceInterval: { lower: 48, upper: 62 },
//   reliability: 0.82,
//   warnings: [],
//   reliabilityFlag: false
// }
```

### 3.3 处理评分警告

```typescript
if (result.warnings.length > 0) {
  console.warn('评分警告：', result.warnings)
  // 可能的警告：
  // - "检测到异常作答模式：所有题目都选择了5分"
  // - "可能存在社会期望偏差（moderate级）"
  // - "题目数量较少，结果可靠性可能较低"
}

if (result.reliabilityFlag) {
  // 建议用户重新作答或谨慎解读结果
}
```

---

## 4. 法律免责声明

### 4.1 免责声明组件使用

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DisclaimerModal } from '@/components/common'

const showDisclaimer = ref(true)

const handleAgree = () => {
  // 用户已同意免责声明，开始测评
  console.log('用户已同意免责声明')
}
</script>

<template>
  <DisclaimerModal
    v-model="showDisclaimer"
    @agree="handleAgree"
  />
</template>
```

### 4.2 免责声明要点

1. **测评性质说明**：明确这是教育参考工具，非专业诊断
2. **结果解读指南**：说明结果的局限性和适用范围
3. **禁止用途列表**：列出不当使用的场景
4. **专业建议时机**：告诉用户何时寻求专业帮助
5. **隐私保护承诺**：说明数据存储方式和隐私保护措施
6. **法律免责条款**：明确开发者的责任范围

---

## 5. 常模数据收集

### 5.1 常模收集组件使用

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { NormCollectionPrompt } from '@/components/common'
import { addNormRecord, shouldPromptDataCollection } from '@/utils/normCollection'

const showPrompt = ref(false)

// 检查是否应该提示
onMounted(() => {
  if (shouldPromptDataCollection()) {
    showPrompt.value = true
  }
})

const handleAgree = () => {
  // 记录用户同意，在测评完成后收集数据
  localStorage.setItem('kidpotential_norm_consent', 'true')
}

const handleDecline = () => {
  // 用户不同意，不再提示
  declineDataCollection()
}

// 测评完成后收集数据
const collectNormData = () => {
  const consent = localStorage.getItem('kidpotential_norm_consent')
  if (consent === 'true') {
    addNormRecord(
      profileStore.profile,
      questionnaireStore.intelligenceScores,
      questionnaireStore.interestScores,
      gamesStore.results
    )
  }
}
</script>

<template>
  <NormCollectionPrompt
    v-model="showPrompt"
    @agree="handleAgree"
    @decline="handleDecline"
  />
</template>
```

### 5.2 常模收集API

```typescript
import {
  addNormRecord,              // 添加一条数据记录
  loadCollectedData,          // 加载已收集的数据
  calculateCurrentNorms,      // 计算当前统计
  exportNormData,             // 导出数据
  isSampleSizeSufficient,     // 检查样本量是否足够
  assessDataQuality           // 评估数据质量
} from '@/utils/normCollection'

// 计算当前收集的统计数据
const norms = calculateCurrentNorms()
console.log(norms.overallSummary)
// {
//   totalRecords: 156,
//   goodQuality: 142,
//   fairQuality: 12,
//   poorQuality: 2,
//   byAgeGroup: { young: 48, middle: 62, teen: 46 },
//   byGender: { male: 82, female: 72, other: 2 }
// }
```

### 5.3 常模数据质量标准

| 质量等级 | 标准 | 说明 |
|----------|------|------|
| good | 评分≥80 | 作答时间合理，无异常模式 |
| fair | 评分≥50 | 存在一些问题，但可使用 |
| poor | 评分<50 | 作答异常，不纳入统计 |

### 5.4 常模建立目标

- **最小样本量**：每个年龄段 ≥ 100 例（高质量）
- **推荐样本量**：每个年龄段 ≥ 500 例
- **理想样本量**：每个年龄段 ≥ 1000 例

### 5.5 数据上传（未来实现）

当建立后端服务后，可以通过以下方式上传数据：

```typescript
// 导出数据
const jsonData = exportNormData()

// 上传到服务器（需要实现API）
fetch('https://your-api.com/norm-data/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: jsonData
})
```

---

## 🔄 迁移指南

### 从原版迁移到增强版

#### Step 1: 更新导入

```typescript
// 旧版
import { intelligenceQuestions } from '@/data/intelligenceQuestions'
import { interestQuestions } from '@/data/interestQuestions'

// 新版
import { intelligenceQuestionsEnhanced } from '@/data/intelligenceQuestionsEnhanced'
import { interestQuestionsEnhanced } from '@/data/interestQuestionsEnhanced'
```

#### Step 2: 更新题目获取

```typescript
// 旧版
const questions = getShuffledQuestions()

// 新版（需要传入年龄组）
const ageGroup = profileStore.ageGroup
const questions = getShuffledIntelligenceQuestions(ageGroup)
```

#### Step 3: 更新评分逻辑

```typescript
// 旧版（简单平均）
const score = Math.round(values.reduce((a, b) => a + b, 0) / values.length * 20)

// 新版（使用增强评分算法）
const result = scoreQuestionnaire(answers, 'intelligence', ageGroup, itemCount, reverseQuestions)
const standardScore = result.standardScore  // 使用标准分而非原始分
```

#### Step 4: 添加免责声明

```vue
<template>
  <DisclaimerModal v-model="showDisclaimer" @agree="startAssessment" />
</template>
```

#### Step 5: 添加常模收集

```vue
<template>
  <NormCollectionPrompt v-model="showPrompt" @agree="enableDataCollection" />
</template>
```

---

## ⚠️ 重要注意事项

1. **临时常模**：当前使用的是基于理论推测的临时常模，需要用实际收集的数据替换
2. **免责声明**：必须在使用前向用户展示免责声明并获得同意
3. **数据隐私**：常模收集必须经过用户同意，且数据需要脱敏处理
4. **专业审核**：建议请儿童心理学家审核题目和结果解读

---

## 📞 技术支持

如有问题或建议，请通过以下方式联系：
- GitHub Issues: [项目地址]
- 邮箱: [联系邮箱]

---

**最后更新**: 2024年
**版本**: 1.0 Enhanced
