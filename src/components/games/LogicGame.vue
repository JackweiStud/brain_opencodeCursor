<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ClayButton, ClayCard } from '../common'

interface Props {
  round: number  // 当前轮次 1-3
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'complete': [correct: boolean, time: number]
}>()

// 题目库 - 按难度分组，确保每轮不重复
const questionsByRound = [
  // 第1轮 - 简单（基础规律识别）
  [
    {
      sequence: ['🔴', '🔵', '🔴', '🔵', '🔴', '?'],
      options: ['🔵', '🔴', '🟢', '🟡'],
      answer: 0,
      hint: '红蓝交替'
    },
    {
      sequence: ['🐱', '🐱🐱', '🐱🐱🐱', '?'],
      options: ['🐱🐱🐱🐱', '🐱', '🐶', '🐱🐱'],
      answer: 0,
      hint: '数量递增'
    },
    {
      sequence: ['⬜', '⬛', '⬜', '⬛', '⬜', '?'],
      options: ['⬛', '⬜', '🟫', '🟪'],
      answer: 0,
      hint: '黑白交替'
    },
    {
      sequence: ['🍎', '🍎', '🍎', '🍎', '🍎', '?'],
      options: ['🍎', '🍊', '🍋', '🍇'],
      answer: 0,
      hint: '相同重复'
    },
    {
      sequence: ['➡️', '➡️', '➡️', '➡️', '?'],
      options: ['➡️', '⬅️', '⬆️', '⬇️'],
      answer: 0,
      hint: '方向相同'
    },
    {
      sequence: ['🌕', '🌖', '🌗', '🌘', '?'],
      options: ['🌑', '🌕', '🌙', '☀️'],
      answer: 0,
      hint: '月相变化'
    },
    {
      sequence: ['🐶', '🐱', '🐶', '🐱', '🐶', '?'],
      options: ['🐱', '🐶', '🐰', '🐭'],
      answer: 0,
      hint: '猫狗交替'
    },
    {
      sequence: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '?'],
      options: ['5️⃣', '6️⃣', '1️⃣', '4️⃣'],
      answer: 0,
      hint: '数字递增'
    }
  ],
  // 第2轮 - 中等（复杂规律识别）
  [
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
      sequence: ['🍎', '🍊', '🍋', '🍎', '🍊', '?'],
      options: ['🍋', '🍎', '🍊', '🍇'],
      answer: 0,
      hint: '三种水果循环'
    },
    {
      sequence: ['🔺', '🔻', '🔺', '🔻', '🔺', '?'],
      options: ['🔻', '🔺', '⬛', '🔷'],
      answer: 0,
      hint: '三角形上下交替'
    },
    {
      sequence: ['🐕', '🐈', '🐦', '🐕', '🐈', '?'],
      options: ['🐦', '🐕', '🐈', '🐟'],
      answer: 0,
      hint: '三种动物循环'
    },
    {
      sequence: ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐', '⭐', '?'],
      options: ['⭐⭐', '⭐', '⭐⭐⭐', '⭐⭐⭐⭐'],
      answer: 0,
      hint: '数量先增后减循环'
    },
    {
      sequence: ['🌸', '🌺', '🌸', '🌺', '🌸', '?'],
      options: ['🌺', '🌸', '🌹', '🌷'],
      answer: 0,
      hint: '两种花交替'
    },
    {
      sequence: ['🔵', '🔵', '🔴', '🔵', '🔵', '?'],
      options: ['🔴', '🔵', '🟢', '🟡'],
      answer: 0,
      hint: '两蓝一红循环'
    }
  ],
  // 第3轮 - 困难（复杂逻辑规律）
  [
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
      sequence: ['🔴', '🔴', '🔵', '🔴', '🔴', '🔵', '🔵', '🔴', '🔴', '🔵', '🔵', '?'],
      options: ['🔵', '🔴', '🟢', '🟡'],
      answer: 0,
      hint: '蓝色数量递增'
    },
    {
      sequence: ['🐟', '🐟', '🐠', '🐟', '🐟', '🐠', '🐠', '?'],
      options: ['🐟', '🐠', '🐡', '🦈'],
      answer: 0,
      hint: '两鱼后加一热带鱼循环'
    },
    {
      sequence: ['⬆️', '➡️', '⬇️', '⬅️', '⬆️', '?'],
      options: ['➡️', '⬆️', '⬇️', '⬅️'],
      answer: 0,
      hint: '顺时针方向旋转'
    },
    {
      sequence: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '?'],
      options: ['🌘', '🌑', '🌕', '🌙'],
      answer: 0,
      hint: '月相完整周期'
    },
    {
      sequence: ['2️⃣', '4️⃣', '6️⃣', '8️⃣', '?'],
      options: ['1️⃣0️⃣', '9️⃣', '1️⃣1️⃣', '1️⃣2️⃣'],
      answer: 0,
      hint: '偶数递增'
    },
    {
      sequence: ['🔷', '🔷', '🔶', '🔷', '🔷', '🔷', '🔶', '🔷', '🔷', '🔷', '🔷', '?'],
      options: ['🔶', '🔷', '🔸', '🔹'],
      answer: 0,
      hint: '蓝色数量每轮加一'
    }
  ]
]

// 游戏初始化时，从每个难度等级随机抽取2题，形成6题序列
const selectedQuestions = ref<Array<typeof questionsByRound[0][0]>>([])

// Fisher-Yates 洗牌算法 - 确保真正随机且不重复
const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// 初始化题目序列 - 从每个难度等级抽取2题
const initializeQuestions = () => {
  const selected: Array<typeof questionsByRound[0][0]> = []
  
  questionsByRound.forEach(difficultyQuestions => {
    // 使用 Fisher-Yates 洗牌确保随机不重复
    const shuffled = shuffleArray(difficultyQuestions)
    selected.push(...shuffled.slice(0, 2))
  })
  
  selectedQuestions.value = selected
}

// 游戏状态
const phase = ref<'playing' | 'result'>('playing')
const currentQuestion = ref(questionsByRound[0][0])
const selectedOption = ref<number | null>(null)
const startTime = ref(0)
const elapsedTime = ref(0)

// 根据当前轮次选择题目
const selectQuestion = () => {
  const index = props.round - 1
  if (index >= 0 && index < selectedQuestions.value.length) {
    currentQuestion.value = selectedQuestions.value[index]
  }
}

// 开始游戏
const startGame = () => {
  selectQuestion()
  selectedOption.value = null
  startTime.value = Date.now()
  phase.value = 'playing'
}

// 组件挂载后先初始化题目序列，再开始游戏
onMounted(() => {
  initializeQuestions()
  startGame()
})

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

// 当前题目的难度级别
const difficulty = computed(() => {
  const index = props.round - 1
  if (index < 2) return '简单'
  if (index < 4) return '中等'
  return '困难'
})
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <!-- 游戏进行中 -->
    <div v-if="phase === 'playing'">
      <ClayCard padding="lg" class="mb-6">
        <!-- 难度标签 -->
        <div class="text-center mb-3">
          <span 
            class="inline-block px-3 py-1 rounded-full font-body text-xs"
            :class="{
              'bg-green-100 text-green-700': difficulty === '简单',
              'bg-yellow-100 text-yellow-700': difficulty === '中等',
              'bg-red-100 text-red-700': difficulty === '困难'
            }"
          >
            难度：{{ difficulty }}
          </span>
        </div>
        
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
