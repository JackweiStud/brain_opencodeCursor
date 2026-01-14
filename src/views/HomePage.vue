<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ClayButton } from '../components/common'
import { DisclaimerModal, NormCollectionPrompt } from '../components/common'
import { useProfileStore } from '../stores/profile'
import { useQuestionnaireEnhancedStore } from '../stores/questionnaireEnhanced'
import { useGamesStore } from '../stores/games'
import { useReportStore } from '../stores/report'
import { shouldPromptDataCollection, declineDataCollection } from '../utils/normCollection'

const router = useRouter()
const profileStore = useProfileStore()
const questionnaireStore = useQuestionnaireEnhancedStore()
const gamesStore = useGamesStore()
const reportStore = useReportStore()

// 判断测试是否全部完成
const isAllTestCompleted = computed(() => {
  return profileStore.isProfileComplete &&
         questionnaireStore.progress === 100 && 
         gamesStore.allGamesCompleted &&
         reportStore.generatedAt !== ''
})

// 弹窗状态
const showDisclaimer = ref(false)
const showNormPrompt = ref(false)

// 标记是否正在等待常模提示后跳转
const pendingNavigation = ref(false)

// 初始化检查
onMounted(() => {
  // 检查是否需要显示免责声明
  if (!questionnaireStore.disclaimerAccepted) {
    showDisclaimer.value = true
  }
})

const startAssessment = () => {
  // 必须先接受免责声明
  if (!questionnaireStore.disclaimerAccepted) {
    showDisclaimer.value = true
    return
  }
  
  // 如果测试已全部完成，直接查看报告
  if (isAllTestCompleted.value) {
    router.push('/report')
    return
  }
  
  // 检查是否需要提示常模收集（进入测试时才提示）
  if (shouldPromptDataCollection()) {
    pendingNavigation.value = true
    showNormPrompt.value = true
    return
  }
  
  router.push('/profile')
}

// 直接查看报告
const viewReport = () => {
  router.push('/report')
}

const continueAssessment = () => {
  if (!questionnaireStore.disclaimerAccepted) {
    showDisclaimer.value = true
    return
  }

  if (!profileStore.isProfileComplete) {
    router.push('/profile')
  } else {
    router.push('/questionnaire')
  }
}

const handleDisclaimerAgree = () => {
  questionnaireStore.setDisclaimerAccepted(true)
}

const handleNormAgree = () => {
  questionnaireStore.setNormCollectionConsent(true)
  // 如果是从"开始探索"按钮触发的，继续跳转
  if (pendingNavigation.value) {
    pendingNavigation.value = false
    router.push('/profile')
  }
}

const handleNormDecline = () => {
  declineDataCollection()
  // 如果是从"开始探索"按钮触发的，继续跳转
  if (pendingNavigation.value) {
    pendingNavigation.value = false
    router.push('/profile')
  }
}
</script>

<template>
  <div class="min-h-screen bg-clay-bg flex flex-col items-center justify-center p-8">
    <!-- 主标题 -->
    <div class="text-center mb-8">
      <div class="text-6xl mb-4">🌟</div>
      <h1 class="font-heading text-5xl text-clay-text mb-4">童智星探</h1>
      <p class="font-body text-xl text-clay-text/70 max-w-md">
        发现孩子的无限潜能，科学评估，快乐成长
      </p>
    </div>

    <!-- 功能介绍 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl w-full">
      <div class="bg-white/50 rounded-clay p-4 text-center border-4 border-clay-peach-dark/20">
        <div class="text-3xl mb-2">🧠</div>
        <h3 class="font-heading text-clay-text mb-1">多元智能</h3>
        <p class="font-body text-sm text-clay-text/60">发现8大智能优势</p>
      </div>
      <div class="bg-white/50 rounded-clay p-4 text-center border-4 border-clay-blue/20">
        <div class="text-3xl mb-2">💼</div>
        <h3 class="font-heading text-clay-text mb-1">职业兴趣</h3>
        <p class="font-body text-sm text-clay-text/60">探索6大兴趣类型</p>
      </div>
      <div class="bg-white/50 rounded-clay p-4 text-center border-4 border-clay-mint/20">
        <div class="text-3xl mb-2">🎮</div>
        <h3 class="font-heading text-clay-text mb-1">认知能力</h3>
        <p class="font-body text-sm text-clay-text/60">专注力+记忆力+逻辑</p>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex flex-col sm:flex-row gap-4">
      <button
        @click="startAssessment"
        class="clay-button text-xl px-8 py-4"
      >
        开始探索 →
      </button>

      <button
        v-if="profileStore.isProfileComplete"
        @click="continueAssessment"
        class="clay-button text-xl px-8 py-4"
        style="background-color: var(--color-clay-blue); border-color: #8BC4D6;"
      >
        继续测评
      </button>
    </div>

    <!-- 测评说明 -->
    <div class="mt-8 max-w-md text-center">
      <p class="font-body text-sm text-clay-text/50 mb-2">
        ✨ 适合 7-15 岁儿童 | ⏱️ 约 20-25 分钟
      </p>
      <p class="font-body text-xs text-clay-text/40">
        基于多元智能理论和霍兰德职业兴趣理论
      </p>
    </div>

    <!-- 已有记录提示（可点击查看报告） -->
    <div v-if="profileStore.profile.name" class="mt-6">
      <button
        v-if="isAllTestCompleted"
        @click="viewReport"
        class="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
      >
        <span>📋</span>
        <span>{{ profileStore.profile.name }} ({{ profileStore.ageGroup }}岁组) - 点击查看报告</span>
      </button>
      <div v-else class="text-sm text-clay-text/50">
        已有记录: {{ profileStore.profile.name }} ({{ profileStore.ageGroup }}岁组)
      </div>
    </div>
  </div>

  <!-- 免责声明弹窗 -->
  <DisclaimerModal
    v-model="showDisclaimer"
    @agree="handleDisclaimerAgree"
  />

  <!-- 常模收集弹窗 -->
  <NormCollectionPrompt
    v-model="showNormPrompt"
    @agree="handleNormAgree"
    @decline="handleNormDecline"
  />
</template>
