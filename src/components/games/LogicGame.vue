<script setup lang="ts">
import { ref, computed } from 'vue'
import { ClayButton, ClayCard } from '../common'

interface Props {
  round: number  // 当前轮次 1-3
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'complete': [correct: boolean, time: number]
}>()

// 题目库
const questions = [
  {
    sequence: ['🔴', '🔵', '🔴', '🔵', '🔴', '?'],
    options: ['🔵', '🔴', '🟢', '🟡'],
    answer: 0,
    hint: '红蓝交替'
  },
  {
    sequence: ['⭐', '⭐', '🌙', '⭐', '⭐', '🌙', '⭐', '⭐', '?'],
    options: ['⭐', '🌙', '☀️', '🌟'],
    answer: 1,
    hint: '两星一月循环'
  },
  {
    sequence: ['1️⃣', '2️⃣', '3️⃣', '5️⃣', '8️⃣', '?'],
    options: ['1️⃣1️⃣', '1️⃣2️⃣', '1️⃣3️⃣', '1️⃣0️⃣'],
    answer: 2,
    hint: '斐波那契数列'
  },
  {
    sequence: ['🟥', '🟧', '🟨', '🟩', '?'],
    options: ['🟦', '🟥', '🟪', '⬜'],
    answer: 0,
    hint: '彩虹色顺序'
  },
  {
    sequence: ['😀', '😃', '😄', '😁', '?'],
    options: ['😆', '😀', '😢', '😎'],
    answer: 0,
    hint: '表情逐渐变化'
  },
  {
    sequence: ['🐱', '🐱🐱', '🐱🐱🐱', '?'],
    options: ['🐱🐱🐱🐱', '🐱', '🐶', '🐱🐱'],
    answer: 0,
    hint: '数量递增'
  }
]

// 游戏状态
const phase = ref<'ready' | 'playing' | 'result'>('ready')
const currentQuestion = ref(questions[0])
const selectedOption = ref<number | null>(null)
const startTime = ref(0)
const elapsedTime = ref(0)

// 根据轮次选择题目
const selectQuestion = () => {
  // 简单随机选择，实际可以根据难度
  const index = (props.round - 1 + Math.floor(Math.random() * 2)) % questions.length
  currentQuestion.value = questions[index]
}

// 开始游戏
const startGame = () => {
  selectQuestion()
  selectedOption.value = null
  startTime.value = Date.now()
  phase.value = 'playing'
}

// 选择答案
const selectAnswer = (index: number) => {
  if (phase.value !== 'playing') return
  selectedOption.value = index
}

// 提交答案
const submitAnswer = () => {
  if (selectedOption.value === null) return
  
  elapsedTime.value = Math.round((Date.now() - startTime.value) / 100) / 10
  phase.value = 'result'
  
  const isCorrect = selectedOption.value === currentQuestion.value.answer
  emit('complete', isCorrect, elapsedTime.value)
}

// 是否正确
const isCorrect = computed(() => {
  return selectedOption.value === currentQuestion.value.answer
})
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <!-- 准备阶段 -->
    <div v-if="phase === 'ready'" class="text-center">
      <ClayCard padding="lg">
        <div class="text-5xl mb-4">🧩</div>
        <h3 class="font-heading text-2xl text-clay-text mb-4">
          第 {{ round }} 轮
        </h3>
        <p class="font-body text-clay-text/70 mb-6">
          观察图形规律<br>
          选择下一个应该是什么
        </p>
        <ClayButton size="lg" @click="startGame">
          开始 →
        </ClayButton>
      </ClayCard>
    </div>

    <!-- 游戏进行中 -->
    <div v-else-if="phase === 'playing'">
      <ClayCard padding="lg" class="mb-6">
        <p class="font-body text-sm text-clay-text/50 mb-4 text-center">
          找出规律，选择 ? 应该是什么
        </p>

        <!-- 序列展示 -->
        <div class="flex flex-wrap justify-center items-center gap-2 mb-8 min-h-[80px]">
          <span 
            v-for="(item, index) in currentQuestion.sequence" 
            :key="index"
            class="text-4xl"
            :class="item === '?' ? 'bg-clay-lilac px-4 py-2 rounded-clay' : ''"
          >
            {{ item }}
          </span>
        </div>

        <!-- 选项 -->
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            @click="selectAnswer(index)"
            class="py-6 rounded-clay border-4 text-4xl transition-all"
            :class="selectedOption === index 
              ? 'bg-clay-blue border-[#8BC4D6] scale-95' 
              : 'bg-white border-clay-peach-dark/30 hover:bg-clay-bg'"
          >
            {{ option }}
          </button>
        </div>
      </ClayCard>

      <ClayButton 
        size="lg" 
        class="w-full"
        :disabled="selectedOption === null"
        @click="submitAnswer"
      >
        确认答案
      </ClayButton>
    </div>

    <!-- 结果阶段 -->
    <div v-else-if="phase === 'result'" class="text-center">
      <ClayCard padding="lg" :variant="isCorrect ? 'game' : 'default'">
        <div class="text-5xl mb-4">
          {{ isCorrect ? '🎉' : '🤔' }}
        </div>
        <h3 class="font-heading text-2xl text-clay-text mb-4">
          {{ isCorrect ? '答对了！' : '再想想~' }}
        </h3>
        
        <div class="space-y-2 mb-6">
          <p class="font-body text-clay-text">
            你的答案: 
            <span class="text-2xl">{{ currentQuestion.options[selectedOption!] }}</span>
            <span :class="isCorrect ? 'text-green-500' : 'text-red-500'">
              {{ isCorrect ? ' ✓' : ' ✗' }}
            </span>
          </p>
          <p v-if="!isCorrect" class="font-body text-clay-text">
            正确答案: 
            <span class="text-2xl">{{ currentQuestion.options[currentQuestion.answer] }}</span>
          </p>
          <p class="font-body text-clay-text/70 text-sm">
            用时: {{ elapsedTime }} 秒
          </p>
        </div>

        <div class="bg-clay-lilac/30 rounded-clay p-3">
          <p class="font-body text-sm text-clay-text/70">
            💡 规律提示: {{ currentQuestion.hint }}
          </p>
        </div>
      </ClayCard>
    </div>
  </div>
</template>
