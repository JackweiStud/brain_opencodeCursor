# 童智星探 (KidPotential) 实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 构建一个基于 Vue 3 的儿童发展潜力综合评估系统 MVP

**Architecture:** 采用 Vue 3 + TypeScript + Tailwind CSS + Pinia 架构，分为问卷测评和互动游戏两大模块，使用 LocalStorage 存储数据，支持 PDF 导出报告。UI 采用 Claymorphism 粘土风格（测评过程）和专业蓝风格（报告页面）。

**Tech Stack:** Vue 3.4+, TypeScript, Vite 5+, Tailwind CSS 3.4+, Pinia 2.1+, Vue Router 4.2+, ECharts 5.4+, html2canvas, jsPDF

---

## 阶段 P1：项目初始化 + 路由 + 基础组件

### Task 1: 初始化 Vue 3 + TypeScript + Vite 项目

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/App.vue`

**Step 1: 创建 Vue 项目**

Run:
```bash
cd D:\CODE\brain_opencodeCursor
npm create vite@latest . -- --template vue-ts
```

Expected: 项目文件生成成功

**Step 2: 安装依赖**

Run:
```bash
npm install
```

Expected: node_modules 生成，无报错

**Step 3: 验证项目运行**

Run:
```bash
npm run dev
```

Expected: 显示 Local: http://localhost:5173/

**Step 4: 提交**

```bash
git init
git add .
git commit -m "chore: init Vue 3 + TypeScript + Vite project"
```

---

### Task 2: 安装和配置 Tailwind CSS

**Files:**
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Modify: `src/style.css`

**Step 1: 安装 Tailwind CSS**

Run:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Expected: 生成 tailwind.config.js 和 postcss.config.js

**Step 2: 配置 tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 测评过程 - Claymorphism 粉彩系
        'clay': {
          peach: '#FDBCB4',
          'peach-dark': '#F5A898',
          'peach-shadow': '#E89A8A',
          blue: '#ADD8E6',
          mint: '#98FF98',
          lilac: '#E6E6FA',
          bg: '#FFFAF5',
          text: '#4A4A4A',
        },
        // 结果报告 - 专业信任蓝系
        'report': {
          primary: '#2563EB',
          secondary: '#3B82F6',
          cta: '#F97316',
          bg: '#F8FAFC',
          text: '#1E293B',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        heading: ['Fredoka', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        'clay': '20px',
        'clay-lg': '24px',
      },
    },
  },
  plugins: [],
}
```

**Step 3: 配置 src/style.css**

```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Claymorphism 基础样式 */
@layer components {
  .clay-card {
    @apply bg-clay-bg rounded-clay-lg border-4 border-clay-peach-dark;
    box-shadow: 
      6px 6px 0 0 theme('colors.clay.peach-shadow'),
      inset 0 2px 4px rgba(255, 255, 255, 0.6);
  }

  .clay-button {
    @apply px-6 py-3 bg-clay-peach rounded-clay border-4 border-clay-peach-dark font-heading font-semibold text-clay-text;
    box-shadow: 
      4px 4px 0 0 theme('colors.clay.peach-shadow'),
      inset 0 2px 4px rgba(255, 255, 255, 0.5);
    transition: all 200ms ease-out;
  }

  .clay-button:hover {
    box-shadow: 
      2px 2px 0 0 theme('colors.clay.peach-shadow'),
      inset 0 2px 4px rgba(255, 255, 255, 0.5);
    transform: translate(2px, 2px);
  }

  .clay-button:active {
    box-shadow: 
      0 0 0 0 theme('colors.clay.peach-shadow'),
      inset 0 2px 4px rgba(255, 255, 255, 0.5);
    transform: translate(4px, 4px);
  }
}
```

**Step 4: 更新 src/main.ts 引入样式**

```typescript
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
```

**Step 5: 验证 Tailwind 生效**

修改 `src/App.vue`:
```vue
<template>
  <div class="min-h-screen bg-clay-bg flex items-center justify-center">
    <button class="clay-button text-xl">
      童智星探
    </button>
  </div>
</template>
```

Run:
```bash
npm run dev
```

Expected: 看到粉桃色的粘土风格按钮

**Step 6: 提交**

```bash
git add .
git commit -m "feat: add Tailwind CSS with Claymorphism theme"
```

---

### Task 3: 安装和配置 Vue Router

**Files:**
- Create: `src/router/index.ts`
- Create: `src/views/HomePage.vue`
- Create: `src/views/ProfilePage.vue`
- Create: `src/views/QuestionnaireFlow.vue`
- Create: `src/views/GameFlow.vue`
- Create: `src/views/ReportPage.vue`
- Modify: `src/main.ts`
- Modify: `src/App.vue`

**Step 1: 安装 Vue Router**

Run:
```bash
npm install vue-router@4
```

Expected: 安装成功

**Step 2: 创建路由配置 src/router/index.ts**

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomePage.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfilePage.vue'),
    meta: { title: '信息录入' }
  },
  {
    path: '/questionnaire',
    name: 'questionnaire',
    component: () => import('../views/QuestionnaireFlow.vue'),
    meta: { title: '问卷测评' }
  },
  {
    path: '/games',
    name: 'games',
    component: () => import('../views/GameFlow.vue'),
    meta: { title: '互动测评' }
  },
  {
    path: '/report',
    name: 'report',
    component: () => import('../views/ReportPage.vue'),
    meta: { title: '评估报告' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：更新页面标题
router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title} - 童智星探` || '童智星探'
  next()
})

export default router
```

**Step 3: 创建页面占位组件**

`src/views/HomePage.vue`:
```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const startAssessment = () => {
  router.push('/profile')
}
</script>

<template>
  <div class="min-h-screen bg-clay-bg flex flex-col items-center justify-center p-8">
    <h1 class="font-heading text-5xl text-clay-text mb-4">童智星探</h1>
    <p class="font-body text-xl text-clay-text/70 mb-8 text-center max-w-md">
      发现孩子的无限潜能，科学评估，快乐成长
    </p>
    <button @click="startAssessment" class="clay-button text-xl">
      开始探索 →
    </button>
  </div>
</template>
```

`src/views/ProfilePage.vue`:
```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-clay-bg flex items-center justify-center">
    <div class="clay-card p-8">
      <h2 class="font-heading text-3xl text-clay-text mb-4">信息录入</h2>
      <p class="font-body text-clay-text/70">（待实现）</p>
    </div>
  </div>
</template>
```

`src/views/QuestionnaireFlow.vue`:
```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-clay-bg flex items-center justify-center">
    <div class="clay-card p-8">
      <h2 class="font-heading text-3xl text-clay-text mb-4">问卷测评</h2>
      <p class="font-body text-clay-text/70">（待实现）</p>
    </div>
  </div>
</template>
```

`src/views/GameFlow.vue`:
```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-clay-bg flex items-center justify-center">
    <div class="clay-card p-8">
      <h2 class="font-heading text-3xl text-clay-text mb-4">互动测评</h2>
      <p class="font-body text-clay-text/70">（待实现）</p>
    </div>
  </div>
</template>
```

`src/views/ReportPage.vue`:
```vue
<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-report-bg flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-lg p-8">
      <h2 class="font-heading text-3xl text-report-text mb-4">评估报告</h2>
      <p class="font-body text-report-text/70">（待实现）</p>
    </div>
  </div>
</template>
```

**Step 4: 更新 src/main.ts**

```typescript
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

**Step 5: 更新 src/App.vue**

```vue
<script setup lang="ts">
</script>

<template>
  <RouterView />
</template>
```

**Step 6: 验证路由工作**

Run:
```bash
npm run dev
```

Expected: 
- 访问 http://localhost:5173/ 显示首页
- 点击"开始探索"跳转到 /profile
- 手动访问 /questionnaire, /games, /report 都能显示对应页面

**Step 7: 提交**

```bash
git add .
git commit -m "feat: add Vue Router with 5 page routes"
```

---

### Task 4: 安装和配置 Pinia 状态管理

**Files:**
- Create: `src/stores/profile.ts`
- Create: `src/stores/questionnaire.ts`
- Create: `src/stores/games.ts`
- Create: `src/stores/report.ts`
- Modify: `src/main.ts`

**Step 1: 安装 Pinia**

Run:
```bash
npm install pinia
```

Expected: 安装成功

**Step 2: 创建 Profile Store**

`src/stores/profile.ts`:
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Profile {
  name: string
  age: number
  gender: 'male' | 'female' | ''
  createdAt: string
}

export const useProfileStore = defineStore('profile', () => {
  // State
  const profile = ref<Profile>({
    name: '',
    age: 0,
    gender: '',
    createdAt: ''
  })

  // Getters
  const isProfileComplete = computed(() => {
    return profile.value.name !== '' && 
           profile.value.age > 0 && 
           profile.value.gender !== ''
  })

  const ageGroup = computed(() => {
    const age = profile.value.age
    if (age >= 7 && age <= 9) return 'young'
    if (age >= 10 && age <= 12) return 'middle'
    if (age >= 13 && age <= 15) return 'teen'
    return 'unknown'
  })

  // Actions
  function setProfile(data: Partial<Profile>) {
    profile.value = { 
      ...profile.value, 
      ...data,
      createdAt: new Date().toISOString()
    }
    saveToStorage()
  }

  function resetProfile() {
    profile.value = {
      name: '',
      age: 0,
      gender: '',
      createdAt: ''
    }
    localStorage.removeItem('kidpotential_profile')
  }

  function saveToStorage() {
    localStorage.setItem('kidpotential_profile', JSON.stringify(profile.value))
  }

  function loadFromStorage() {
    const saved = localStorage.getItem('kidpotential_profile')
    if (saved) {
      profile.value = JSON.parse(saved)
    }
  }

  // 初始化时加载
  loadFromStorage()

  return {
    profile,
    isProfileComplete,
    ageGroup,
    setProfile,
    resetProfile,
    loadFromStorage
  }
})
```

**Step 3: 创建 Questionnaire Store**

`src/stores/questionnaire.ts`:
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface QuestionnaireAnswers {
  multipleIntelligence: Record<string, number[]>  // 每种智能3道题的答案
  hollandInterest: Record<string, number[]>       // 每种兴趣3道题的答案
}

export const useQuestionnaireStore = defineStore('questionnaire', () => {
  // State
  const answers = ref<QuestionnaireAnswers>({
    multipleIntelligence: {
      linguistic: [],
      logical: [],
      spatial: [],
      musical: [],
      bodily: [],
      interpersonal: [],
      intrapersonal: [],
      naturalistic: []
    },
    hollandInterest: {
      realistic: [],
      investigative: [],
      artistic: [],
      social: [],
      enterprising: [],
      conventional: []
    }
  })

  const currentSection = ref<'intelligence' | 'interest'>('intelligence')
  const currentQuestionIndex = ref(0)

  // Getters
  const intelligenceScores = computed(() => {
    const scores: Record<string, number> = {}
    for (const [key, values] of Object.entries(answers.value.multipleIntelligence)) {
      scores[key] = values.length > 0 
        ? Math.round(values.reduce((a, b) => a + b, 0) / values.length * 20) 
        : 0
    }
    return scores
  })

  const interestScores = computed(() => {
    const scores: Record<string, number> = {}
    for (const [key, values] of Object.entries(answers.value.hollandInterest)) {
      scores[key] = values.length > 0 
        ? Math.round(values.reduce((a, b) => a + b, 0) / values.length * 20) 
        : 0
    }
    return scores
  })

  const totalQuestions = computed(() => 24 + 18) // 42道题

  const answeredCount = computed(() => {
    let count = 0
    for (const values of Object.values(answers.value.multipleIntelligence)) {
      count += values.length
    }
    for (const values of Object.values(answers.value.hollandInterest)) {
      count += values.length
    }
    return count
  })

  const progress = computed(() => {
    return Math.round((answeredCount.value / totalQuestions.value) * 100)
  })

  // Actions
  function answerIntelligence(type: string, score: number) {
    if (!answers.value.multipleIntelligence[type]) {
      answers.value.multipleIntelligence[type] = []
    }
    answers.value.multipleIntelligence[type].push(score)
    saveToStorage()
  }

  function answerInterest(type: string, score: number) {
    if (!answers.value.hollandInterest[type]) {
      answers.value.hollandInterest[type] = []
    }
    answers.value.hollandInterest[type].push(score)
    saveToStorage()
  }

  function resetAnswers() {
    answers.value = {
      multipleIntelligence: {
        linguistic: [],
        logical: [],
        spatial: [],
        musical: [],
        bodily: [],
        interpersonal: [],
        intrapersonal: [],
        naturalistic: []
      },
      hollandInterest: {
        realistic: [],
        investigative: [],
        artistic: [],
        social: [],
        enterprising: [],
        conventional: []
      }
    }
    currentSection.value = 'intelligence'
    currentQuestionIndex.value = 0
    localStorage.removeItem('kidpotential_questionnaire')
  }

  function saveToStorage() {
    localStorage.setItem('kidpotential_questionnaire', JSON.stringify({
      answers: answers.value,
      currentSection: currentSection.value,
      currentQuestionIndex: currentQuestionIndex.value
    }))
  }

  function loadFromStorage() {
    const saved = localStorage.getItem('kidpotential_questionnaire')
    if (saved) {
      const data = JSON.parse(saved)
      answers.value = data.answers
      currentSection.value = data.currentSection
      currentQuestionIndex.value = data.currentQuestionIndex
    }
  }

  loadFromStorage()

  return {
    answers,
    currentSection,
    currentQuestionIndex,
    intelligenceScores,
    interestScores,
    totalQuestions,
    answeredCount,
    progress,
    answerIntelligence,
    answerInterest,
    resetAnswers,
    loadFromStorage
  }
})
```

**Step 4: 创建 Games Store**

`src/stores/games.ts`:
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface GameResults {
  schulte: {
    times: number[]      // 3次完成时间（秒）
    errors: number[]     // 3次错误次数
  }
  memory: {
    scores: number[]     // 3次正确率（0-100）
  }
  logic: {
    answers: boolean[]   // 3道题对错
    times: number[]      // 3道题用时
  }
  creative: {
    answers: string[][]  // 2道题的答案列表
  }
}

export const useGamesStore = defineStore('games', () => {
  // State
  const results = ref<GameResults>({
    schulte: { times: [], errors: [] },
    memory: { scores: [] },
    logic: { answers: [], times: [] },
    creative: { answers: [] }
  })

  const currentGame = ref<'schulte' | 'memory' | 'logic' | 'creative'>('schulte')
  const currentRound = ref(0)

  // Getters
  const schulteScore = computed(() => {
    const times = results.value.schulte.times
    if (times.length === 0) return 0
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length
    // 评分：60秒以内100分，每多10秒减10分，最低0分
    return Math.max(0, Math.round(100 - (avgTime - 60) / 10 * 10))
  })

  const memoryScore = computed(() => {
    const scores = results.value.memory.scores
    if (scores.length === 0) return 0
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  })

  const logicScore = computed(() => {
    const answers = results.value.logic.answers
    if (answers.length === 0) return 0
    const correct = answers.filter(a => a).length
    return Math.round((correct / answers.length) * 100)
  })

  const creativeScore = computed(() => {
    const answers = results.value.creative.answers
    if (answers.length === 0) return 0
    // 评分：答案数量 + 多样性
    let totalAnswers = 0
    let uniqueCategories = new Set<string>()
    for (const round of answers) {
      totalAnswers += round.length
      round.forEach(a => uniqueCategories.add(a.charAt(0))) // 简化的多样性计算
    }
    const quantityScore = Math.min(50, totalAnswers * 5)
    const diversityScore = Math.min(50, uniqueCategories.size * 10)
    return quantityScore + diversityScore
  })

  const allGamesCompleted = computed(() => {
    return results.value.schulte.times.length >= 3 &&
           results.value.memory.scores.length >= 3 &&
           results.value.logic.answers.length >= 3 &&
           results.value.creative.answers.length >= 2
  })

  // Actions
  function recordSchulte(time: number, errors: number) {
    results.value.schulte.times.push(time)
    results.value.schulte.errors.push(errors)
    saveToStorage()
  }

  function recordMemory(score: number) {
    results.value.memory.scores.push(score)
    saveToStorage()
  }

  function recordLogic(correct: boolean, time: number) {
    results.value.logic.answers.push(correct)
    results.value.logic.times.push(time)
    saveToStorage()
  }

  function recordCreative(answers: string[]) {
    results.value.creative.answers.push(answers)
    saveToStorage()
  }

  function resetGames() {
    results.value = {
      schulte: { times: [], errors: [] },
      memory: { scores: [] },
      logic: { answers: [], times: [] },
      creative: { answers: [] }
    }
    currentGame.value = 'schulte'
    currentRound.value = 0
    localStorage.removeItem('kidpotential_games')
  }

  function saveToStorage() {
    localStorage.setItem('kidpotential_games', JSON.stringify({
      results: results.value,
      currentGame: currentGame.value,
      currentRound: currentRound.value
    }))
  }

  function loadFromStorage() {
    const saved = localStorage.getItem('kidpotential_games')
    if (saved) {
      const data = JSON.parse(saved)
      results.value = data.results
      currentGame.value = data.currentGame
      currentRound.value = data.currentRound
    }
  }

  loadFromStorage()

  return {
    results,
    currentGame,
    currentRound,
    schulteScore,
    memoryScore,
    logicScore,
    creativeScore,
    allGamesCompleted,
    recordSchulte,
    recordMemory,
    recordLogic,
    recordCreative,
    resetGames,
    loadFromStorage
  }
})
```

**Step 5: 创建 Report Store**

`src/stores/report.ts`:
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProfileStore } from './profile'
import { useQuestionnaireStore } from './questionnaire'
import { useGamesStore } from './games'

export const useReportStore = defineStore('report', () => {
  const profileStore = useProfileStore()
  const questionnaireStore = useQuestionnaireStore()
  const gamesStore = useGamesStore()

  // State
  const generatedAt = ref('')

  // Getters - 综合报告数据
  const reportData = computed(() => ({
    profile: profileStore.profile,
    ageGroup: profileStore.ageGroup,
    intelligence: questionnaireStore.intelligenceScores,
    interest: questionnaireStore.interestScores,
    cognitive: {
      attention: gamesStore.schulteScore,
      memory: gamesStore.memoryScore,
      logic: gamesStore.logicScore,
      creativity: gamesStore.creativeScore
    }
  }))

  // 优势智能（前3名）
  const topIntelligences = computed(() => {
    const scores = questionnaireStore.intelligenceScores
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([key, value]) => ({ type: key, score: value }))
  })

  // 职业兴趣倾向（前2名）
  const topInterests = computed(() => {
    const scores = questionnaireStore.interestScores
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([key, value]) => ({ type: key, score: value }))
  })

  // 认知能力综合得分
  const cognitiveOverall = computed(() => {
    const { attention, memory, logic, creativity } = reportData.value.cognitive
    return Math.round((attention + memory + logic + creativity) / 4)
  })

  // Actions
  function generateReport() {
    generatedAt.value = new Date().toISOString()
    saveToStorage()
  }

  function resetAll() {
    profileStore.resetProfile()
    questionnaireStore.resetAnswers()
    gamesStore.resetGames()
    generatedAt.value = ''
    localStorage.removeItem('kidpotential_report')
  }

  function saveToStorage() {
    localStorage.setItem('kidpotential_report', JSON.stringify({
      generatedAt: generatedAt.value
    }))
  }

  function loadFromStorage() {
    const saved = localStorage.getItem('kidpotential_report')
    if (saved) {
      const data = JSON.parse(saved)
      generatedAt.value = data.generatedAt
    }
  }

  loadFromStorage()

  return {
    generatedAt,
    reportData,
    topIntelligences,
    topInterests,
    cognitiveOverall,
    generateReport,
    resetAll,
    loadFromStorage
  }
})
```

**Step 6: 更新 src/main.ts 配置 Pinia**

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
```

**Step 7: 验证 Store 工作**

修改 `src/views/HomePage.vue` 测试 store:
```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useProfileStore } from '../stores/profile'
import { useReportStore } from '../stores/report'

const router = useRouter()
const profileStore = useProfileStore()
const reportStore = useReportStore()

const startAssessment = () => {
  router.push('/profile')
}

const continueAssessment = () => {
  // 根据已有数据决定跳转位置
  if (!profileStore.isProfileComplete) {
    router.push('/profile')
  } else {
    router.push('/questionnaire')
  }
}
</script>

<template>
  <div class="min-h-screen bg-clay-bg flex flex-col items-center justify-center p-8">
    <h1 class="font-heading text-5xl text-clay-text mb-4">童智星探</h1>
    <p class="font-body text-xl text-clay-text/70 mb-8 text-center max-w-md">
      发现孩子的无限潜能，科学评估，快乐成长
    </p>
    
    <div class="flex gap-4">
      <button @click="startAssessment" class="clay-button text-xl">
        开始探索 →
      </button>
      
      <button 
        v-if="profileStore.isProfileComplete"
        @click="continueAssessment" 
        class="clay-button text-xl bg-clay-blue border-clay-blue"
      >
        继续测评
      </button>
    </div>

    <!-- 调试信息（开发时显示） -->
    <div v-if="profileStore.profile.name" class="mt-8 text-sm text-clay-text/50">
      已有记录: {{ profileStore.profile.name }}
    </div>
  </div>
</template>
```

Run:
```bash
npm run dev
```

Expected: 页面正常显示，无控制台错误

**Step 8: 提交**

```bash
git add .
git commit -m "feat: add Pinia stores for profile, questionnaire, games, report"
```

---

### Task 5: 创建基础通用组件

**Files:**
- Create: `src/components/common/ClayButton.vue`
- Create: `src/components/common/ClayCard.vue`
- Create: `src/components/common/ProgressBar.vue`
- Create: `src/components/common/AgeSelector.vue`

**Step 1: 创建 ClayButton 组件**

`src/components/common/ClayButton.vue`:
```vue
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'success'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
})

const variantClasses = {
  primary: 'bg-clay-peach border-clay-peach-dark shadow-clay-peach-shadow',
  secondary: 'bg-clay-blue border-[#8BC4D6] shadow-[#7AB4C6]',
  success: 'bg-clay-mint border-[#7AE07A] shadow-[#6AD06A]'
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-xl'
}
</script>

<template>
  <button
    :class="[
      'font-heading font-semibold text-clay-text rounded-clay border-4 transition-all duration-200 ease-out cursor-pointer',
      variantClasses[props.variant],
      sizeClasses[props.size],
      props.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:translate-x-[2px] hover:translate-y-[2px]'
    ]"
    :style="{
      boxShadow: props.disabled 
        ? 'none' 
        : `4px 4px 0 0 var(--tw-shadow-color, currentColor), inset 0 2px 4px rgba(255,255,255,0.5)`
    }"
    :disabled="props.disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
button:hover:not(:disabled) {
  box-shadow: 2px 2px 0 0 var(--tw-shadow-color, currentColor), inset 0 2px 4px rgba(255,255,255,0.5) !important;
}
button:active:not(:disabled) {
  box-shadow: 0 0 0 0 var(--tw-shadow-color, currentColor), inset 0 2px 4px rgba(255,255,255,0.5) !important;
  transform: translate(4px, 4px);
}
</style>
```

**Step 2: 创建 ClayCard 组件**

`src/components/common/ClayCard.vue`:
```vue
<script setup lang="ts">
interface Props {
  variant?: 'default' | 'highlight' | 'game'
  padding?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md'
})

const variantClasses = {
  default: 'bg-white border-clay-peach-dark',
  highlight: 'bg-clay-lilac border-[#D0D0E8]',
  game: 'bg-clay-mint/30 border-[#7AE07A]'
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}
</script>

<template>
  <div
    :class="[
      'rounded-clay-lg border-4',
      variantClasses[props.variant],
      paddingClasses[props.padding]
    ]"
    :style="{
      boxShadow: '6px 6px 0 0 #E89A8A, inset 0 2px 4px rgba(255,255,255,0.6)'
    }"
  >
    <slot />
  </div>
</template>
```

**Step 3: 创建 ProgressBar 组件**

`src/components/common/ProgressBar.vue`:
```vue
<script setup lang="ts">
interface Props {
  progress: number  // 0-100
  showLabel?: boolean
  color?: 'peach' | 'blue' | 'mint'
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: true,
  color: 'peach'
})

const colorClasses = {
  peach: 'bg-clay-peach',
  blue: 'bg-clay-blue',
  mint: 'bg-clay-mint'
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-2" v-if="showLabel">
      <span class="font-body text-sm text-clay-text/70">完成进度</span>
      <span class="font-heading text-sm text-clay-text">{{ progress }}%</span>
    </div>
    <div class="h-4 bg-clay-bg rounded-full border-2 border-clay-peach-dark overflow-hidden">
      <div
        :class="['h-full rounded-full transition-all duration-500 ease-out', colorClasses[props.color]]"
        :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }"
      />
    </div>
  </div>
</template>
```

**Step 4: 创建 AgeSelector 组件**

`src/components/common/AgeSelector.vue`:
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const ages = Array.from({ length: 9 }, (_, i) => i + 7) // 7-15岁

const selectedAge = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const getAgeGroupLabel = (age: number) => {
  if (age <= 9) return '低龄段'
  if (age <= 12) return '中龄段'
  return '青少年'
}

const getAgeGroupColor = (age: number) => {
  if (age <= 9) return 'bg-clay-peach'
  if (age <= 12) return 'bg-clay-blue'
  return 'bg-clay-mint'
}
</script>

<template>
  <div class="space-y-4">
    <label class="block font-heading text-lg text-clay-text">选择年龄</label>
    <div class="grid grid-cols-3 gap-3">
      <button
        v-for="age in ages"
        :key="age"
        @click="selectedAge = age"
        :class="[
          'relative py-4 px-2 rounded-clay border-4 font-heading text-2xl transition-all duration-200',
          selectedAge === age 
            ? 'border-clay-peach-dark bg-clay-peach text-clay-text scale-105' 
            : 'border-clay-peach-dark/30 bg-white text-clay-text/70 hover:bg-clay-bg'
        ]"
      >
        {{ age }}
        <span 
          v-if="selectedAge === age"
          :class="['absolute -top-2 -right-2 text-xs px-2 py-1 rounded-full text-white', getAgeGroupColor(age)]"
        >
          {{ getAgeGroupLabel(age) }}
        </span>
      </button>
    </div>
    <p class="text-sm text-clay-text/60 font-body">
      {{ selectedAge > 0 ? `已选择 ${selectedAge} 岁（${getAgeGroupLabel(selectedAge)}）` : '请选择孩子的年龄' }}
    </p>
  </div>
</template>
```

**Step 5: 创建组件导出索引**

`src/components/common/index.ts`:
```typescript
export { default as ClayButton } from './ClayButton.vue'
export { default as ClayCard } from './ClayCard.vue'
export { default as ProgressBar } from './ProgressBar.vue'
export { default as AgeSelector } from './AgeSelector.vue'
```

**Step 6: 验证组件**

创建测试页面或修改 HomePage 使用这些组件:

Run:
```bash
npm run dev
```

Expected: 组件正常渲染，无控制台错误

**Step 7: 提交**

```bash
git add .
git commit -m "feat: add common components (ClayButton, ClayCard, ProgressBar, AgeSelector)"
```

---

## P1 阶段完成检查清单

- [ ] Vue 3 + TypeScript + Vite 项目初始化
- [ ] Tailwind CSS 配置 + Claymorphism 主题
- [ ] Vue Router 5个页面路由
- [ ] Pinia 4个状态管理 Store
- [ ] 4个基础通用组件

---

## 阶段 P2：问卷系统（后续实施计划）

> 待 P1 完成后继续...

### Task 6: 创建多元智能题库
### Task 7: 创建职业兴趣题库  
### Task 8: 创建问卷组件 (QuestionCard, LikertScale)
### Task 9: 实现问卷流程页面

---

## 阶段 P3：互动游戏（后续实施计划）

### Task 10: 实现舒尔特方格游戏
### Task 11: 实现图形记忆游戏
### Task 12: 实现逻辑推理游戏
### Task 13: 实现发散思维游戏
### Task 14: 实现游戏流程页面

---

## 阶段 P4：结果报告（后续实施计划）

### Task 15: 集成 ECharts 雷达图
### Task 16: 实现报告分析模块
### Task 17: 实现 PDF 导出功能

---

## 阶段 P5：联调测试（后续实施计划）

### Task 18: 端到端流程测试
### Task 19: 样式优化和响应式适配
### Task 20: 性能优化和最终检查
