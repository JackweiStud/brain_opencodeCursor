# 童智星探 (KidPotential) - 设计文档

> **创建日期**: 2026-01-13  
> **项目路径**: D:\CODE\brain_opencodeCursor  
> **状态**: 设计确认完成，待实施

---

## 1. 项目概述

### 1.1 项目名称
**童智星探** (KidPotential) - 儿童发展潜力综合评估系统

### 1.2 项目目标
为 7-15 岁儿童提供科学、完整、综合的发展潜力评估，帮助家长了解孩子的多元智能、职业兴趣倾向和认知能力，为孩子的教育规划提供数据支持。

### 1.3 目标用户
- **主要用户**: 7-15 岁儿童（家长陪同完成）
- **使用场景**: 家庭环境，家长与孩子一起完成测评

### 1.4 核心功能
1. **问卷测评**: 多元智能 + 职业兴趣 + 心理状态
2. **互动测评**: 专注力 + 记忆力 + 逻辑推理 + 创造力
3. **结果报告**: 雷达图 + 详细分析 + 发展建议 + PDF导出
4. **年龄适配**: 根据年龄自动调整题目难度和表述方式

---

## 2. 科学评估体系

### 2.1 理论基础

| 模块 | 理论依据 | 来源 |
|-----|---------|------|
| 多元智能 | Howard Gardner 多元智能理论 | 1983年《心智的架构》 |
| 职业兴趣 | John Holland RIASEC 模型 | 1959年职业选择理论 |
| 认知能力 | 标准化心理测验 | WISC-IV, CPT, D-KEFS |

### 2.2 评估维度

#### A. 多元智能评估（问卷，24题，约8分钟）

| 智能类型 | 描述 | 题目数 |
|---------|------|-------|
| 语言智能 | 文字表达、阅读理解、语言敏感度 | 3题 |
| 逻辑数学智能 | 推理、计算、模式识别 | 3题 |
| 空间智能 | 图形、方向、视觉化能力 | 3题 |
| 音乐智能 | 节奏、音高、旋律感知 | 3题 |
| 身体动觉智能 | 运动协调、手工技能 | 3题 |
| 人际智能 | 社交、领导力、合作能力 | 3题 |
| 内省智能 | 自我认知、情绪管理 | 3题 |
| 自然观察智能 | 对自然的敏感度和观察力 | 3题 |

#### B. 职业兴趣评估（问卷，18题，约6分钟）

| 类型 | 特点 | 适合职业方向 | 题目数 |
|-----|------|-------------|-------|
| R - 现实型 | 动手、实践 | 工程师、技工 | 3题 |
| I - 研究型 | 分析、探索 | 科学家、研究员 | 3题 |
| A - 艺术型 | 创造、表达 | 设计师、艺术家 | 3题 |
| S - 社会型 | 助人、教导 | 教师、医护 | 3题 |
| E - 企业型 | 领导、说服 | 企业家、销售 | 3题 |
| C - 常规型 | 组织、细节 | 会计、行政 | 3题 |

#### C. 认知能力评估（互动游戏，约10分钟）

| 游戏 | 测评能力 | 规格 | 题量 | 统计指标 |
|-----|---------|------|-----|---------|
| 舒尔特方格 | 专注力 | 6×6 (1-36) | 3道 | 平均完成时间 |
| 图形记忆 | 记忆力 | 3×3→4×4→5×5 | 3道 | 平均正确率 |
| 图形规律 | 逻辑推理 | 难度递进 | 3道 | 正确率+平均时间 |
| 发散思维 | 创造力 | 开放性问题 | 2道 | 答案数量+多样性 |

### 2.3 年龄适配策略

| 年龄段 | 问卷调整 | 互动调整 |
|-------|---------|---------|
| 7-9 岁 | 简化用语 + 图片辅助 + 家长朗读 | 更多提示 + 鼓励反馈 |
| 10-12 岁 | 标准用语 + 可自主阅读 | 标准难度 |
| 13-15 岁 | 增加深度问题 | 增加挑战性 |

---

## 3. 技术架构

### 3.1 技术选型

| 类别 | 技术 | 版本 |
|-----|------|-----|
| 框架 | Vue 3 + TypeScript | 3.4+ |
| 构建 | Vite | 5.0+ |
| 样式 | Tailwind CSS | 3.4+ |
| 状态管理 | Pinia | 2.1+ |
| 路由 | Vue Router | 4.2+ |
| 图表 | ECharts | 5.4+ |
| PDF导出 | html2canvas + jsPDF | latest |
| 存储 | LocalStorage | - |

### 3.2 项目结构

```
D:\CODE\brain_opencodeCursor\
├── docs/plans/                    # 设计和计划文档
├── src/
│   ├── assets/                    # 静态资源
│   ├── components/
│   │   ├── common/                # 通用组件（ClayButton, ClayCard等）
│   │   ├── questionnaire/         # 问卷组件
│   │   ├── games/                 # 游戏组件（4个）
│   │   └── report/                # 报告组件
│   ├── views/                     # 页面视图（5个）
│   ├── stores/                    # Pinia状态管理
│   ├── data/                      # 题库和评分算法
│   ├── utils/                     # 工具函数
│   ├── router/                    # 路由配置
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### 3.3 数据流设计

```
信息录入 → 问卷测评 → 互动测评 → 结果报告
    ↓          ↓          ↓          ↓
 profile   questionnaire  games    report
  Store       Store       Store    Store
    └──────────┴───────────┴──────────┘
                    ↓
              LocalStorage
                    ↓
               PDF导出
```

---

## 4. UI/UX 设计

### 4.1 设计风格

基于 `ui-ux-pro-max` skill 推荐，采用 **双主题设计**：

| 场景 | 风格 | 原因 |
|-----|------|-----|
| 测评过程 | Claymorphism（粘土风格） | 温暖友好，降低孩子焦虑 |
| 结果报告 | 专业信任蓝 | 增强家长信任感 |

### 4.2 配色方案

#### 测评过程 - Claymorphism 粉彩系
```
Primary:    Soft Peach   #FDBCB4
Secondary:  Baby Blue    #ADD8E6
Accent:     Mint Green   #98FF98
Highlight:  Lilac        #E6E6FA
Background: Warm White   #FFFAF5
Text:       Soft Dark    #4A4A4A
```

#### 结果报告 - 专业信任蓝系
```
Primary:    Trust Blue   #2563EB
Secondary:  Sky Blue     #3B82F6
CTA:        Orange       #F97316
Background: Cool White   #F8FAFC
Text:       Dark Slate   #1E293B
Border:     Light Gray   #E2E8F0
```

### 4.3 字体配对

基于 `ui-ux-pro-max` 推荐：**Fredoka + Nunito**

```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap');
```

```javascript
// Tailwind 配置
fontFamily: {
  heading: ['Fredoka', 'sans-serif'],
  body: ['Nunito', 'sans-serif']
}
```

### 4.4 设计规范

| 元素 | 规范 |
|-----|------|
| 圆角 | 大圆角 16-24px |
| 边框 | 厚边框 3-4px |
| 阴影 | 内外双阴影，柔和 |
| 动效 | ease-out 200ms |
| 无障碍 | 检查 prefers-reduced-motion |

---

## 5. 页面流程

### 5.1 用户流程

```
首页 → 信息录入 → 问卷测评 → 互动测评 → 结果报告
 │        │          │          │          │
欢迎    姓名/年龄   多元智能    专注力     雷达图
介绍    /性别      职业兴趣    记忆力     详细分析
开始              (约14分钟)   逻辑推理   发展建议
                              创造力     PDF导出
                              (约10分钟)
```

### 5.2 页面清单

| 页面 | 路由 | 组件 | 功能 |
|-----|------|-----|-----|
| 首页 | `/` | HomePage.vue | 欢迎介绍，开始按钮 |
| 信息录入 | `/profile` | ProfilePage.vue | 姓名、年龄、性别 |
| 问卷测评 | `/questionnaire` | QuestionnaireFlow.vue | 42道问卷题 |
| 互动测评 | `/games` | GameFlow.vue | 4个互动游戏 |
| 结果报告 | `/report` | ReportPage.vue | 报告展示、PDF导出 |

---

## 6. 数据存储

### 6.1 MVP 阶段策略
- **主存储**: LocalStorage（快速验证）
- **导出**: PDF 报告（可保存/打印）

### 6.2 数据结构

```typescript
interface AssessmentData {
  profile: {
    name: string;
    age: number;
    gender: 'male' | 'female';
    createdAt: string;
  };
  questionnaire: {
    multipleIntelligence: Record<string, number>;  // 8种智能得分
    hollandInterest: Record<string, number>;       // 6种兴趣得分
  };
  games: {
    schulte: { times: number[]; avgTime: number };
    memory: { scores: number[]; avgScore: number };
    logic: { correct: number; avgTime: number };
    creative: { answers: string[][]; diversity: number };
  };
  report: {
    generatedAt: string;
    summary: string;
    suggestions: string[];
  };
}
```

---

## 7. MVP 开发计划

| 阶段 | 内容 | 预计时间 |
|-----|------|---------|
| P1 | 项目初始化 + 路由 + 基础组件 | 1天 |
| P2 | 问卷系统（题库 + 组件 + 评分） | 2天 |
| P3 | 互动游戏（4个游戏组件） | 2天 |
| P4 | 结果报告（图表 + 分析 + PDF） | 2天 |
| P5 | 联调测试 + 样式优化 | 1天 |

**总计**: 约 8 天

---

## 8. 后期扩展

- [ ] 成长档案：多次测评对比 + 成长曲线
- [ ] 云端存储：后端服务 + 数据同步
- [ ] 更多游戏：扩展认知测评维度
- [ ] 专家解读：AI 生成个性化建议

---

## 附录：参考资料

1. Howard Gardner - 《心智的架构》(1983)
2. John Holland - RIASEC 职业兴趣理论
3. WISC-IV 韦氏儿童智力量表
4. ui-ux-pro-max skill - Claymorphism 风格指南
