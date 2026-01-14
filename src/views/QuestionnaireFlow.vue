<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { QuestionCard } from '../components/questionnaire'
import { ClayButton, ClayCard } from '../components/common'
import { useQuestionnaireEnhancedStore } from '../stores/questionnaireEnhanced'
import { useProfileStore } from '../stores/profile'
import { intelligenceTypesEnhanced } from '../data/intelligenceQuestionsEnhanced'
import { interestTypesEnhanced } from '../data/interestQuestionsEnhanced'

const router = useRouter()
const questionnaireStore = useQuestionnaireEnhancedStore()
const profileStore = useProfileStore()

// 状态
const phase = ref<'intro' | 'intelligence' | 'transition' | 'interest' | 'complete'>('intro')
const currentAnswer = ref<number | null>(null)

// 当前年龄组的题目
const intelligenceQuestions = computed(() => questionnaireStore.intelligenceQuestions)
const interestQuestions = computed(() => questionnaireStore.interestQuestions)

// 已回答数量
const answeredIntelligenceCount = computed(() =>
  questionnaireStore.answerRecords.filter(a => a.questionType === 'intelligence').length
)
const answeredInterestCount = computed(() =>
  questionnaireStore.answerRecords.filter(a => a.questionType === 'interest').length
)

// 当前问题
const currentQuestion = computed(() => {
  if (phase.value === 'intelligence') {
    return intelligenceQuestions.value[answeredIntelligenceCount.value]
  } else if (phase.value === 'interest') {
    return interestQuestions.value[answeredInterestCount.value]
  }
  return null
})

// 当前问题的类型信息
const currentTypeInfo = computed(() => {
  if (!currentQuestion.value) return null

  if (phase.value === 'intelligence') {
    return intelligenceTypesEnhanced.find(t => t.key === currentQuestion.value!.type)
  } else if (phase.value === 'interest') {
    return interestTypesEnhanced.find(t => t.key === currentQuestion.value!.type)
  }
  return null
})

// 总进度
const totalProgress = computed(() => questionnaireStore.progress)

// 当前阶段问题序号
const currentQuestionNumber = computed(() => {
  if (phase.value === 'intelligence') {
    return answeredIntelligenceCount.value + 1
  } else if (phase.value === 'interest') {
    return intelligenceQuestions.value.length + answeredInterestCount.value + 1
  }
  return 0
})

// 总题数
const totalQuestions = computed(() => questionnaireStore.totalQuestions)

// 获取年龄适配的描述
const getTypeDescription = (type: any) => {
  if (!type) return ''
  const ag = profileStore.ageGroup
  if (ag === 'young' && type.descriptionYoung) {
    return type.descriptionYoung
  }
  if (ag === 'teen' && type.descriptionTeen) {
    return type.descriptionTeen
  }
  return type.description
}

// 开始测评
const startQuestionnaire = () => {
  phase.value = 'intelligence'
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
    questionnaireStore.answerIntelligence(currentQuestion.value.id, currentAnswer.value)

    if (answeredIntelligenceCount.value < intelligenceQuestions.value.length - 1) {
      currentAnswer.value = null
    } else {
      // 智能测评完成，进入过渡
      phase.value = 'transition'
    }
  } else if (phase.value === 'interest') {
    questionnaireStore.answerInterest(currentQuestion.value.id, currentAnswer.value)

    if (answeredInterestCount.value < interestQuestions.value.length - 1) {
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

  // 检查免责声明
  if (!questionnaireStore.disclaimerAccepted) {
    router.push('/')
    return
  }

  // 恢复进度：根据已回答数量判断当前阶段
  const intellAnswered = answeredIntelligenceCount.value
  const interestAnswered = answeredInterestCount.value

  if (intellAnswered >= intelligenceQuestions.value.length) {
    if (interestAnswered >= interestQuestions.value.length) {
      phase.value = 'complete'
    } else {
      phase.value = 'interest'
    }
  } else if (intellAnswered > 0) {
    phase.value = 'intelligence'
  }
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
            <li>• 多元智能评估：{{ intelligenceQuestions.length }} 道题（增强版）</li>
            <li>• 职业兴趣评估：{{ interestQuestions.length }} 道题（增强版）</li>
            <li>• 包含年龄适配题目</li>
            <li>• 预计用时：15-20 分钟</li>
          </ul>
        </div>

        <!-- 年龄组提示 -->
        <div class="bg-clay-peach/30 rounded-clay p-4 mb-6">
          <p class="font-body text-sm text-clay-text/70">
            👶 当前适配年龄组：
            <span class="font-semibold">
              {{ profileStore.ageGroup === 'young' ? '7-9岁（低龄段）' :
                 profileStore.ageGroup === 'middle' ? '10-12岁（中龄段）' :
                 profileStore.ageGroup === 'teen' ? '13-15岁（青少年段）' : '未知' }}
            </span>
          </p>
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
          <p class="font-body text-sm text-clay-text/50 mt-2">
            {{ answeredIntelligenceCount + 1 }} / {{ intelligenceQuestions.length }}
          </p>
        </div>

        <QuestionCard
          :question-number="currentQuestionNumber"
          :total-questions="totalQuestions"
          :question-text="currentQuestion?.text || ''"
          :type-icon="currentTypeInfo?.icon"
          :type-name="currentTypeInfo?.name"
          :type-description="getTypeDescription(currentTypeInfo)"
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
            🎯 还剩 {{ interestQuestions.length }} 道题
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
          <p class="font-body text-sm text-clay-text/50 mt-2">
            {{ answeredInterestCount + 1 }} / {{ interestQuestions.length }}
          </p>
        </div>

        <QuestionCard
          :question-number="currentQuestionNumber"
          :total-questions="totalQuestions"
          :question-text="currentQuestion?.text || ''"
          :type-icon="currentTypeInfo?.icon"
          :type-name="currentTypeInfo?.name"
          :type-description="getTypeDescription(currentTypeInfo)"
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

        <!-- 显示警告（如果有） -->
        <div v-if="questionnaireStore.hasWarnings" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
          <p class="font-body text-sm text-yellow-800 mb-2">⚠️ 测评提示：</p>
          <ul class="font-body text-sm text-yellow-700 space-y-1">
            <li v-for="warning in questionnaireStore.allWarnings" :key="warning">
              {{ warning }}
            </li>
          </ul>
        </div>

        <div class="bg-clay-lilac/30 rounded-clay p-4 mb-6">
          <p class="font-body text-sm text-clay-text/70 mb-2">✅ 已完成测评：</p>
          <ul class="font-body text-sm text-clay-text/70">
            <li>• 多元智能评估（{{ intelligenceQuestions.length }}题）✓</li>
            <li>• 职业兴趣评估（{{ interestQuestions.length }}题）✓</li>
          </ul>
        </div>

        <ClayButton size="lg" class="w-full" variant="success" @click="goToGames">
          进入互动测评 →
        </ClayButton>
      </ClayCard>
    </div>
  </div>
</template>
