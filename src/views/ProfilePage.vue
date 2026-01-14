<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ClayButton, ClayCard, ProgressBar, AgeSelector } from '../components/common'
import { useProfileStore } from '../stores/profile'
import { useQuestionnaireEnhancedStore } from '../stores/questionnaireEnhanced'
import { useGamesStore } from '../stores/games'
import { useReportStore } from '../stores/report'

const router = useRouter()
const profileStore = useProfileStore()
const questionnaireStore = useQuestionnaireEnhancedStore()
const gamesStore = useGamesStore()
const reportStore = useReportStore()

const name = ref(profileStore.profile.name || '')
const age = ref(profileStore.profile.age || 0)
const gender = ref<'male' | 'female' | ''>(profileStore.profile.gender || '')

const progress = ref(0)

// 确认弹窗状态
const showConfirmDialog = ref(false)

// 检测用户是否变化（姓名不同视为不同用户）
const isUserChanged = computed(() => {
  const stored = profileStore.profile
  if (!stored.name) return false  // 没有旧用户，不算变化
  return name.value.trim() !== stored.name.trim()
})

// 检测是否有旧的测试数据
const hasExistingData = computed(() => {
  return questionnaireStore.answeredCount > 0 || 
         gamesStore.results.schulte.times.length > 0 ||
         gamesStore.results.memory.scores.length > 0 ||
         gamesStore.results.logic.answers.length > 0 ||
         gamesStore.results.creative.answers.length > 0
})

// 旧用户姓名（用于弹窗显示）
const previousUserName = computed(() => profileStore.profile.name)

// 计算进度
const updateProgress = () => {
  let p = 0
  if (name.value) p += 33
  if (age.value > 0) p += 33
  if (gender.value) p += 34
  progress.value = p
}

// 提交前检查
const handleSubmit = () => {
  if (!name.value || age.value === 0 || !gender.value) return

  // 检测用户变化且有旧数据
  if (isUserChanged.value && hasExistingData.value) {
    showConfirmDialog.value = true
    return
  }

  // 无变化或无旧数据，直接提交
  saveAndProceed()
}

// 确认清空旧数据并继续
const confirmClearData = () => {
  // 清空问卷和游戏数据（保留历史记录）
  questionnaireStore.resetAnswers()
  gamesStore.resetGames()
  reportStore.generatedAt = ''
  localStorage.removeItem('kidpotential_report')
  
  showConfirmDialog.value = false
  saveAndProceed()
}

// 取消操作
const cancelSubmit = () => {
  showConfirmDialog.value = false
}

// 保存profile并跳转
const saveAndProceed = () => {
  profileStore.setProfile({
    name: name.value.trim(),
    age: age.value,
    gender: gender.value
  })
  router.push('/questionnaire')
}
</script>

<template>
  <div class="min-h-screen bg-clay-bg flex flex-col items-center justify-center p-8">
    <ClayCard padding="lg" class="w-full max-w-md">
      <h2 class="font-heading text-3xl text-clay-text mb-6 text-center">信息录入</h2>
      
      <ProgressBar :progress="progress" class="mb-6" />
      
      <!-- 姓名输入 -->
      <div class="mb-6">
        <label class="block font-heading text-lg text-clay-text mb-2">孩子姓名</label>
        <input
          v-model="name"
          @input="updateProgress"
          type="text"
          placeholder="请输入姓名"
          class="w-full px-4 py-3 rounded-clay border-4 border-clay-peach-dark/30 font-body text-clay-text focus:border-clay-peach-dark focus:outline-none transition-colors"
        />
      </div>

      <!-- 年龄选择 -->
      <div class="mb-6">
        <AgeSelector v-model="age" @update:model-value="updateProgress" />
      </div>

      <!-- 性别选择 -->
      <div class="mb-8">
        <label class="block font-heading text-lg text-clay-text mb-2">性别</label>
        <div class="flex gap-4">
          <button
            @click="gender = 'male'; updateProgress()"
            :class="[
              'flex-1 py-3 rounded-clay border-4 font-heading text-lg transition-all',
              gender === 'male' 
                ? 'border-clay-blue bg-clay-blue text-clay-text' 
                : 'border-clay-peach-dark/30 bg-white text-clay-text/70 hover:bg-clay-bg'
            ]"
          >
            👦 男孩
          </button>
          <button
            @click="gender = 'female'; updateProgress()"
            :class="[
              'flex-1 py-3 rounded-clay border-4 font-heading text-lg transition-all',
              gender === 'female' 
                ? 'border-clay-peach bg-clay-peach text-clay-text' 
                : 'border-clay-peach-dark/30 bg-white text-clay-text/70 hover:bg-clay-bg'
            ]"
          >
            👧 女孩
          </button>
        </div>
      </div>

      <!-- 提交按钮 -->
      <ClayButton 
        size="lg" 
        class="w-full"
        :disabled="!name || age === 0 || !gender"
        @click="handleSubmit"
      >
        开始测评 →
      </ClayButton>
    </ClayCard>

    <!-- 返回首页 -->
    <button 
      @click="router.push('/')"
      class="mt-6 text-clay-text/50 hover:text-clay-text font-body transition-colors"
    >
      ← 返回首页
    </button>

    <!-- 用户变化确认弹窗 -->
    <Teleport to="body">
      <div 
        v-if="showConfirmDialog"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white rounded-clay border-4 border-clay-peach-dark/30 p-6 max-w-md w-full shadow-xl">
          <div class="text-center mb-4">
            <div class="text-4xl mb-2">🔄</div>
            <h3 class="font-heading text-xl text-clay-text">检测到新用户</h3>
          </div>
          
          <p class="font-body text-clay-text/80 text-center mb-6">
            当前输入的姓名 <strong class="text-clay-text">「{{ name }}」</strong> 与之前的用户 
            <strong class="text-clay-text">「{{ previousUserName }}」</strong> 不同。
            <br /><br />
            是否清空之前的测试记录，开始新的测评？
          </p>
          
          <div class="flex gap-3">
            <button
              @click="cancelSubmit"
              class="flex-1 py-3 rounded-clay border-4 border-clay-peach-dark/30 bg-white font-heading text-clay-text/70 hover:bg-clay-bg transition-colors"
            >
              取消
            </button>
            <button
              @click="confirmClearData"
              class="flex-1 py-3 rounded-clay border-4 border-clay-blue bg-clay-blue font-heading text-clay-text hover:opacity-90 transition-opacity"
            >
              确认清空
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
