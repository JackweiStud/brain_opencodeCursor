# 童智星探 (KidPotential)

<div align="center">

🌟 **儿童发展潜力综合评估系统** 🌟

*发现孩子的无限潜能，科学评估，快乐成长*

![Vue.js](https://img.shields.io/badge/Vue.js-3.4-4FC08D?style=flat-square&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat-square&logo=tailwindcss)

</div>

---

## 项目目标与价值

### 核心目标

为 **7-15 岁儿童** 提供科学、全面、专业的发展潜力评估，帮助家长：

- **发现孩子的独特优势** - 每个孩子都有闪光点
- **了解多元智能分布** - 突破单一智力评价局限
- **探索职业兴趣倾向** - 为未来规划提供参考
- **评估认知能力水平** - 专注力、记忆力、逻辑推理、创造力

### 项目价值

| 价值维度 | 描述 |
|---------|------|
| **科学性** | 基于国际权威心理学理论，非商业化娱乐测试 |
| **全面性** | 多元智能 + 职业兴趣 + 认知能力三维度综合评估 |
| **个性化** | 年龄差异化题目，AI智能分析个性化报告 |
| **易用性** | 儿童友好的粘土风格界面，约20-25分钟完成 |
| **专业性** | 标准分转换、信度检验、异常检测等专业算法 |

---

## 科学理论基础

本系统评估体系基于以下国际权威心理学理论：

### 1. Howard Gardner 多元智能理论

> *《心智的架构》(Frames of Mind)，1983年*

美国哈佛大学教育学家 Howard Gardner 提出，人类智能是多元的，包含 **8 种智能类型**：

| 智能类型 | 描述 | 典型特征 |
|---------|------|---------|
| 📝 语言智能 | 善于语言表达和文字理解 | 阅读、写作、演讲 |
| 🔢 逻辑数学智能 | 善于推理、计算、模式识别 | 数学、编程、策略游戏 |
| 🎨 空间智能 | 善于视觉想象和空间感知 | 绘画、设计、建筑 |
| 🎵 音乐智能 | 善于感知和创作音乐 | 演奏、作曲、音乐鉴赏 |
| ⚽ 身体运动智能 | 善于身体协调和运动技能 | 运动、舞蹈、手工 |
| 👥 人际智能 | 善于理解他人和社交 | 领导、合作、沟通 |
| 🧘 内省智能 | 善于自我认识和反思 | 情绪管理、自我规划 |
| 🌿 自然观察智能 | 善于观察和理解自然 | 生物、环保、户外探索 |

### 2. John Holland RIASEC 职业兴趣理论

> *职业选择理论，1959年*

美国心理学家 John Holland 提出的职业兴趣六角形模型，被全球广泛应用于职业指导：

| 类型 | 英文 | 特点 | 适合职业方向 |
|-----|------|-----|-------------|
| R | Realistic | 动手、实践 | 工程师、技工、运动员 |
| I | Investigative | 分析、探索 | 科学家、研究员、医生 |
| A | Artistic | 创造、表达 | 设计师、艺术家、作家 |
| S | Social | 助人、教导 | 教师、医护、社工 |
| E | Enterprising | 领导、说服 | 企业家、销售、律师 |
| C | Conventional | 组织、细节 | 会计、行政、程序员 |

### 3. 认知能力评估标准

参考国际标准化心理测验：
- **WISC-IV** (韦氏儿童智力量表第四版)
- **CPT** (持续注意力测试)
- **D-KEFS** (执行功能测评系统)

---

## 功能特性

### 三维度评估体系

```
┌─────────────────────────────────────────────────────┐
│                  童智星探评估体系                     │
├─────────────────┬─────────────────┬─────────────────┤
│   多元智能问卷   │   职业兴趣问卷   │   认知能力游戏   │
│    (85题)       │    (64题)       │    (4个游戏)     │
├─────────────────┼─────────────────┼─────────────────┤
│ • 语言智能      │ • 现实型 (R)    │ • 舒尔特方格    │
│ • 逻辑数学智能  │ • 研究型 (I)    │   (专注力)      │
│ • 空间智能      │ • 艺术型 (A)    │ • 图形记忆      │
│ • 音乐智能      │ • 社会型 (S)    │   (记忆力)      │
│ • 身体运动智能  │ • 企业型 (E)    │ • 图形规律      │
│ • 人际智能      │ • 常规型 (C)    │   (逻辑推理)    │
│ • 内省智能      │                 │ • 发散思维      │
│ • 自然观察智能  │                 │   (创造力)      │
└─────────────────┴─────────────────┴─────────────────┘
```

### 核心功能

| 功能 | 描述 |
|-----|------|
| **年龄差异化** | 自动适配 7-9岁/10-12岁/13-15岁 题目难度和表述 |
| **AI智能分析** | 集成 Gemini API，生成个性化深度分析报告 |
| **专业评分算法** | T分数转换、百分等级、95%置信区间、信度系数 |
| **异常检测** | 检测直线作答、社会期望偏差等异常模式 |
| **常模收集** | 支持数据收集以建立本地化常模 |
| **报告导出** | 支持打印专业评估报告 |

---

## 软件安装指导 (Windows)

### 环境要求

| 软件 | 版本要求 | 下载地址 |
|-----|---------|---------|
| Node.js | 18.0+ | https://nodejs.org/ |
| npm | 9.0+ | 随 Node.js 安装 |
| Git | 任意版本 | https://git-scm.com/ |

### 安装步骤

#### 1. 安装 Node.js

1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载 **LTS 版本** (推荐)
3. 运行安装程序，保持默认选项
4. 验证安装：

```powershell
# 打开 PowerShell 或命令提示符
node --version    # 应显示 v18.x.x 或更高
npm --version     # 应显示 9.x.x 或更高
```

#### 2. 克隆项目

```powershell
# 选择一个目录存放项目
cd D:\CODE

# 克隆仓库 (如果有Git地址)
git clone <repository-url> brain_opencodeCursor

# 或者直接下载并解压到 D:\CODE\brain_opencodeCursor
```

#### 3. 安装依赖

```powershell
# 进入项目目录
cd D:\CODE\brain_opencodeCursor

# 安装依赖包
npm install
```

#### 4. 配置 AI 功能 (可选)

如需使用 AI 深度分析功能，需配置 Gemini API Key：

**方式一：环境变量配置**

1. 复制环境变量模板：
```powershell
copy .env.example .env
```

2. 编辑 `.env` 文件，填入你的 API Key：
```
VITE_GEMINI_API_KEY=your_api_key_here
```

**方式二：运行时配置**

在应用内的报告页面点击"配置 API Key"按钮进行设置。

#### 5. 启动项目

```powershell
# 开发模式启动
npm run dev
```

启动成功后，在浏览器访问：**http://localhost:5173**

#### 6. 构建生产版本 (可选)

```powershell
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### 常见问题

| 问题 | 解决方案 |
|-----|---------|
| `npm install` 速度慢 | 使用镜像源：`npm config set registry https://registry.npmmirror.com` |
| 端口 5173 被占用 | Vite 会自动切换端口，或手动修改 `vite.config.ts` |
| TypeScript 编译错误 | 运行 `npm install` 确保依赖完整 |

---

## 软件架构

### 技术栈

| 类别 | 技术 | 版本 | 用途 |
|-----|------|-----|------|
| **前端框架** | Vue 3 | 3.4+ | 响应式UI框架 |
| **开发语言** | TypeScript | 5.4+ | 类型安全 |
| **构建工具** | Vite | 5.2+ | 快速构建 |
| **样式框架** | Tailwind CSS | 4.1+ | 原子化CSS |
| **状态管理** | Pinia | 3.0+ | 状态管理 |
| **路由** | Vue Router | 4.6+ | 页面路由 |
| **图表** | ECharts | 6.0+ | 数据可视化 |
| **AI集成** | Gemini API | latest | AI分析生成 |

### 项目结构

```
brain_opencodeCursor/
├── docs/                          # 文档目录
│   ├── plans/                     # 设计文档和计划
│   ├── ENHANCEMENT_GUIDE.md       # 增强功能使用指南
│   └── INTEGRATION_SUMMARY.md     # 集成总结
├── src/
│   ├── components/
│   │   ├── common/                # 通用组件
│   │   │   ├── ClayButton.vue     # 粘土风格按钮
│   │   │   ├── ClayCard.vue       # 粘土风格卡片
│   │   │   ├── DisclaimerModal.vue # 免责声明弹窗
│   │   │   └── ...
│   │   ├── games/                 # 游戏组件
│   │   │   ├── SchulteGrid.vue    # 舒尔特方格
│   │   │   ├── MemoryGame.vue     # 记忆力游戏
│   │   │   ├── LogicGame.vue      # 逻辑推理游戏
│   │   │   └── CreativeGame.vue   # 创造力游戏
│   │   ├── questionnaire/         # 问卷组件
│   │   │   ├── QuestionCard.vue   # 题目卡片
│   │   │   └── LikertScale.vue    # 李克特量表
│   │   └── report/                # 报告组件
│   │       ├── RadarChart.vue     # 雷达图
│   │       ├── AIDeepAnalysis.vue # AI深度分析
│   │       └── ...
│   ├── views/                     # 页面视图
│   │   ├── HomePage.vue           # 首页
│   │   ├── ProfilePage.vue        # 信息录入
│   │   ├── QuestionnaireFlow.vue  # 问卷流程
│   │   ├── GameFlow.vue           # 游戏流程
│   │   └── ReportPage.vue         # 报告页面
│   ├── stores/                    # Pinia状态管理
│   │   ├── profile.ts             # 用户信息
│   │   ├── questionnaireEnhanced.ts # 问卷状态
│   │   ├── games.ts               # 游戏状态
│   │   └── report.ts              # 报告状态
│   ├── data/                      # 题库数据
│   │   ├── intelligenceQuestionsEnhanced.ts  # 多元智能题库
│   │   └── interestQuestionsEnhanced.ts      # 职业兴趣题库
│   ├── utils/                     # 工具函数
│   │   ├── scoringEnhanced.ts     # 增强评分算法
│   │   ├── aiAssessment.ts        # AI评估生成
│   │   ├── normCollection.ts      # 常模收集
│   │   └── reportAnalysis.ts      # 报告分析
│   ├── router/                    # 路由配置
│   └── main.ts                    # 应用入口
├── package.json
├── vite.config.ts
└── README.md
```

### 数据流设计

```
用户操作流程
─────────────────────────────────────────────────────────────────►
   首页          信息录入       问卷测评        游戏测评        报告页面
     │              │             │              │              │
     ▼              ▼             ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Pinia Store Layer                         │
├──────────┬──────────────┬────────────┬────────────┬─────────────┤
│ profile  │ questionnaire │   games    │   report   │ testHistory │
│  Store   │    Store      │   Store    │   Store    │    Store    │
└────┬─────┴───────┬───────┴─────┬──────┴─────┬──────┴──────┬──────┘
     │             │             │            │             │
     └─────────────┴─────────────┴────────────┴─────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   LocalStorage    │
                    └─────────┬─────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        数据持久化       AI分析生成       报告打印导出
```

---

## 技术亮点

### 1. Claymorphism 设计风格

采用儿童友好的"粘土风格"设计，降低测评焦虑：

- **柔和圆角** - 16-24px 大圆角
- **厚重边框** - 3-4px 边框强调
- **双重阴影** - 内外阴影营造立体感
- **粉彩配色** - 温暖舒适的色彩系统

```css
/* 粘土风格示例 */
.clay-button {
  background: linear-gradient(145deg, #FDBCB4, #F5A89A);
  border: 4px solid #E89A8C;
  border-radius: 16px;
  box-shadow: 
    6px 6px 12px rgba(0,0,0,0.1),
    inset 2px 2px 4px rgba(255,255,255,0.5);
}
```

### 2. 专业评分算法

```typescript
// T分数转换 - 国际标准评分方法
T分数 = (原始分 - 平均分) / 标准差 × 10 + 50

// 百分等级计算 - 基于正态分布
percentile = normalCDF(zScore) × 100

// 95%置信区间
CI = 分数 ± 1.96 × 标准误

// 信度系数 (Cronbach's α)
α = (k / (k-1)) × (1 - Σσᵢ² / σₜ²)
```

### 3. 异常检测系统

| 检测类型 | 描述 | 处理方式 |
|---------|------|---------|
| 直线作答 | 所有题目选同一选项 | 标记警告 |
| 锯齿作答 | 规律性高低波动 | 标记警告 |
| 社会期望偏差 | 测谎题分数过高 | 提示可能不真实 |
| 作答时间异常 | 时间过短/过长 | 记录分析 |

### 4. AI 智能分析

集成 Google Gemini API，基于儿童发展心理学理论生成：

- **个性化优势分析** - 识别孩子的 Top 3 优势
- **学习风格建议** - VARK 学习风格匹配
- **发展建议** - 具体可执行的培养方案
- **职业探索方向** - 基于兴趣的未来规划

### 5. 年龄差异化系统

| 年龄组 | 题目特点 | 游戏难度 |
|-------|---------|---------|
| 7-9岁 (young) | 语言简单、具体情境 | 更多提示、鼓励反馈 |
| 10-12岁 (middle) | 标准表述、可自主完成 | 标准难度 |
| 13-15岁 (teen) | 包含抽象概念 | 增加挑战性 |

---

## 使用流程

```
1. 首页
   └── 阅读免责声明 → 同意后继续

2. 信息录入
   └── 填写姓名、年龄、性别

3. 问卷测评 (约14分钟)
   ├── 多元智能问卷
   └── 职业兴趣问卷

4. 游戏测评 (约10分钟)
   ├── 舒尔特方格 (3×3 → 4×4 → 5×5)
   ├── 图形记忆 (难度递进)
   ├── 图形规律 (逻辑推理)
   └── 发散思维 (创造力)

5. 查看报告
   ├── 多元智能雷达图
   ├── 职业兴趣分析
   ├── 认知能力评估
   ├── AI深度分析 (需配置API Key)
   └── 打印/导出报告
```

---

## 免责声明

本系统仅作为 **教育参考工具**，评估结果供家长了解孩子发展情况参考使用，**不能替代专业的心理诊断或教育评估**。

如发现孩子存在明显的学习困难、行为问题或情绪问题，建议寻求专业机构的帮助。

---

## 许可证

本项目仅供学习和个人使用。

---

## 致谢

- [Howard Gardner](https://www.multipleintelligencesoasis.org/) - 多元智能理论
- [John Holland](https://www.careers.govt.nz/resources/career-practice/career-theory-models/hollands-theory/) - 职业兴趣理论
- [Vue.js](https://vuejs.org/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [ECharts](https://echarts.apache.org/) - 图表库
