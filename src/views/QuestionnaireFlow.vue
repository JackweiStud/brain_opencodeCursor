<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { QuestionCard } from '../components/questionnaire'
import { ClayButton, ClayCard } from '../components/common'
import { useQuestionnaireStore } from '../stores/questionnaire'
import { useProfileStore } from '../stores/profile'
import { intelligenceQuestions, getIntelligenceType } from '../data/intelligenceQuestions'
import { interestQuestions, getInterestType } from '../data/interestQuestions'

const router = useRouter()
const questionnaireStore = useQuestionnaireStore()
const profileStore = useProfileStore()

// 状态
const phase = ref<'intro' | 'intelligence' | 'transition' | 'interest' | 'complete'>('intro')
const currentIndex = ref(0)
const currentAnswer = ref<number | null>(null)

// 合并所有问题
const allIntelligenceQuestions = intelligenceQuestions
const allInterestQuestions = interestQuestions

// 当前问题
const currentQuestion = computed(() => {
  if (phase.value === 'intelligence') {
    return allIntelligenceQuestions[currentIndex.value]
  } else if (phase.value === 'interest') {
    return allInterestQuestions[currentIndex.value]
  }
  return null
})

// 当前问题的类型信息
const currentTypeInfo = computed(() => {
  if (!currentQuestion.value) return null
  
  if (phase.value === 'intelligence') {
    return getIntelligenceType(currentQuestion.value.type)
  } else if (phase.value === 'interest') {
    return getInterestType(currentQuestion.value.type)
  }
  return null
})

// 总进度
const totalProgress = computed(() => {
  const intelligenceAnswered = questionnaireStore.answeredCount
  const total = allIntelligenceQuestions.length + allInterestQuestions.length
  return Math.round((intelligenceAnswered / total) * 100)
})

// 当前阶段问题序号
const currentQuestionNumber = computed(() => {
  if (phase.value === 'intelligence') {
    return currentIndex.value + 1
  } else if (phase.value === 'interest') {
    return allIntelligenceQuestions.length + currentIndex.value + 1
  }
  return 0
})

// 总题数
const totalQuestions = computed(() => {
  return allIntelligenceQuestions.length + allInterestQuestions.length
})

// 开始测评
const startQuestionnaire = () => {
  phase.value = 'intelligence'
  currentIndex.value = 0
  currentAnswer.value = null
}

// 处理答案选择
const handleAnswer = (value: number) => {
  currentAnswer.value = value
}

// 下一题
const nextQuestion = () => {
  if (currentAnswer.value === null || !currentQuestion.value) return

  // 保存答案
  if (phase.value === 'intelligence') {
    questionnaireStore.answerIntelligence(currentQuestion.value.type, currentAnswer.value)
    
    if (currentIndex.value < allIntelligenceQuestions.length - 1) {
      currentIndex.value++
      currentAnswer.value = null
    } else {
      // 智能测评完成，进入过渡
      phase.value = 'transition'
    }
  } else if (phase.value === 'interest') {
    questionnaireStore.answerInterest(currentQuestion.value.type, currentAnswer.value)
    
    if (currentIndex.value < allInterestQuestions.length - 1) {
      currentIndex.value++
      currentAnswer.value = null
    } else {
      // 全部完成
      phase.value = 'complete'
    }
  }
}

// 继续兴趣测评
const continueToInterest = () => {
  phase.value = 'interest'
  currentIndex.value = 0
  currentAnswer.value = null
}

// 前往游戏测评
const goToGames = () => {
  router.push('/games')
}

// 检查是否需要恢复进度
onMounted(() => {
  // 如果没有完成个人信息，返回填写
  if (!profileStore.isProfileComplete) {
    router.push('/profile')
    return
  }

  // 恢复进度（简化版：从头开始）
  // 实际项目中可以根据 store 中的进度恢复
})
</script>

<template>
  <div class="min-h-screen bg-clay-bg">
    <!-- 介绍页面 -->
    <div v-if="phase === 'intro'" class="flex flex-col items-center justify-center min-h-screen p-8">
      <ClayCard padding="lg" class="max-w-md w-full text-center">
        <div class="text-6xl mb-4">📋</div>
        <h1 class="font-heading text-3xl text-clay-text mb-4">问卷测评</h1>
        <p class="font-body text-clay-text/70 mb-6 leading-relaxed">
          接下来我们将通过一系列问题，了解 
          <span class="font-semibold text-clay-text">{{ profileStore.profile.name }}</span> 
          的多元智能和职业兴趣倾向。
        </p>
        
        <div class="bg-clay-lilac/30 rounded-clay p-4 mb-6 text-left">
          <p class="font-body text-sm text-clay-text/70 mb-2">📝 测评包含：</p>
          <ul class="font-body text-sm text-clay-text/70 space-y-1">
            <li>• 多元智能评估：{{ allIntelligenceQuestions.length }} 道题</li>
            <li>• 职业兴趣评估：{{ allInterestQuestions.length }} 道题</li>
            <li>• 预计用时：10-15 分钟</li>
          </ul>
        </div>

        <p class="font-body text-sm text-clay-text/50 mb-6">
          请根据自己的真实感受作答，没有对错之分
        </p>

        <ClayButton size="lg" class="w-full" @click="startQuestionnaire">
          开始测评 →
        </ClayButton>
      </ClayCard>

      <button 
        @click="router.push('/profile')"
        class="mt-6 text-clay-text/50 hover:text-clay-text font-body transition-colors"
      >
        ← 返回上一步
      </button>
    </div>

    <!-- 多元智能测评 -->
    <div v-else-if="phase === 'intelligence'" class="flex flex-col items-center justify-center min-h-screen p-8">
      <div class="w-full max-w-lg">
        <!-- 阶段标题 -->
        <div class="text-center mb-6">
          <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-clay-peach/30 font-heading text-clay-text">
            🧠 多元智能评估
          </span>
        </div>

        <QuestionCard
          :question-number="currentQuestionNumber"
          :total-questions="totalQuestions"
          :question-text="currentQuestion?.text || ''"
          :type-icon="currentTypeInfo?.icon"
          :type-name="currentTypeInfo?.name"
          v-model="currentAnswer"
          @next="nextQuestion"
        />
      </div>
    </div>

    <!-- 过渡页面 -->
    <div v-else-if="phase === 'transition'" class="flex flex-col items-center justify-center min-h-screen p-8">
      <ClayCard padding="lg" class="max-w-md w-full text-center">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="font-heading text-2xl text-clay-text mb-4">多元智能评估完成！</h2>
        <p class="font-body text-clay-text/70 mb-6">
          太棒了！接下来我们进行职业兴趣评估，<br>
          了解你喜欢的活动类型。
        </p>

        <div class="bg-clay-mint/30 rounded-clay p-4 mb-6">
          <p class="font-body text-sm text-clay-text/70">
            🎯 还剩 {{ allInterestQuestions.length }} 道题
          </p>
        </div>

        <ClayButton size="lg" class="w-full" variant="secondary" @click="continueToInterest">
          继续测评 →
        </ClayButton>
      </ClayCard>
    </div>

    <!-- 职业兴趣测评 -->
    <div v-else-if="phase === 'interest'" class="flex flex-col items-center justify-center min-h-screen p-8">
      <div class="w-full max-w-lg">
        <!-- 阶段标题 -->
        <div class="text-center mb-6">
          <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-clay-blue/30 font-heading text-clay-text">
            💼 职业兴趣评估
          </span>
        </div>

        <QuestionCard
          :question-number="currentQuestionNumber"
          :total-questions="totalQuestions"
          :question-text="currentQuestion?.text || ''"
          :type-icon="currentTypeInfo?.icon"
          :type-name="currentTypeInfo?.name"
          v-model="currentAnswer"
          @next="nextQuestion"
        />
      </div>
    </div>

    <!-- 完成页面 -->
    <div v-else-if="phase === 'complete'" class="flex flex-col items-center justify-center min-h-screen p-8">
      <ClayCard padding="lg" class="max-w-md w-full text-center">
        <div class="text-6xl mb-4">🏆</div>
        <h2 class="font-heading text-2xl text-clay-text mb-4">问卷测评完成！</h2>
        <p class="font-body text-clay-text/70 mb-6">
          非常棒！你已经完成了所有问卷题目。<br>
          接下来进入互动游戏环节，测试你的认知能力。
        </p>

        <div class="bg-clay-lilac/30 rounded-clay p-4 mb-6">
          <p class="font-body text-sm text-clay-text/70 mb-2">✅ 已完成测评：</p>
          <ul class="font-body text-sm text-clay-text/70">
            <li>• 多元智能评估 ✓</li>
            <li>• 职业兴趣评估 ✓</li>
          </ul>
        </div>

        <ClayButton size="lg" class="w-full" variant="success" @click="goToGames">
          进入互动测评 →
        </ClayButton>
      </ClayCard>
    </div>
  </div>
</template>
