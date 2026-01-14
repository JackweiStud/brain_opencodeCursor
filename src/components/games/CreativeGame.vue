<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ClayButton, ClayCard } from '../common'

interface Props {
  round: number  // 当前轮次 1-2
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'complete': [answers: string[]]
}>()

// 题目库
const prompts = [
  {
    item: '📎 回形针',
    question: '回形针除了夹纸，还能用来做什么？',
    examples: ['开锁', '做书签', '挂装饰品', '疏通管道', '做首饰']
  },
  {
    item: '🧱 砖头',
    question: '一块砖头可以有哪些用途？',
    examples: ['盖房子', '压纸', '健身器材', '敲核桃', '做凳子']
  },
  {
    item: '📰 报纸',
    question: '旧报纸可以用来做什么？',
    examples: ['擦玻璃', '包东西', '折纸', '垫桌子', '做工艺品']
  },
  {
    item: '🥤 塑料瓶',
    question: '空塑料瓶可以变成什么？',
    examples: ['花瓶', '存钱罐', '浇水器', '笔筒', '小船']
  }
]

// 游戏状态
const phase = ref<'thinking' | 'result'>('thinking')
const currentPrompt = ref(prompts[0])
const answers = ref<string[]>([])
const currentInput = ref('')
const timeLeft = ref(60)
const timer = ref<number | null>(null)

// 选择题目
const selectPrompt = () => {
  const index = (props.round - 1) % prompts.length
  currentPrompt.value = prompts[index]
}

// 开始游戏
const startGame = () => {
  selectPrompt()
  answers.value = []
  currentInput.value = ''
  timeLeft.value = 60
  phase.value = 'thinking'

  // 启动倒计时
  timer.value = window.setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      finishGame()
    }
  }, 1000)
}

// 添加答案
const addAnswer = () => {
  const answer = currentInput.value.trim()
  if (answer && !answers.value.includes(answer)) {
    answers.value.push(answer)
    currentInput.value = ''
  }
}

// 删除答案
const removeAnswer = (index: number) => {
  answers.value.splice(index, 1)
}

// 完成游戏
const finishGame = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
  phase.value = 'result'
  emit('complete', [...answers.value])
}

// 提前提交
const submitEarly = () => {
  if (answers.value.length >= 3) {
    finishGame()
  }
}

// 格式化时间
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 组件挂载后自动开始游戏
onMounted(() => {
  startGame()
})

// 清理
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <!-- 思考阶段 -->
    <div v-if="phase === 'thinking'">
      <!-- 计时器 -->
      <div class="text-center mb-4">
        <span 
          class="font-heading text-3xl"
          :class="timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-clay-text'"
        >
          {{ formatTime(timeLeft) }}
        </span>
      </div>

      <ClayCard padding="md" class="mb-4">
        <!-- 题目 -->
        <div class="text-center mb-4">
          <span class="text-4xl">{{ currentPrompt.item }}</span>
        </div>
        <p class="font-heading text-lg text-clay-text text-center mb-4">
          {{ currentPrompt.question }}
        </p>

        <!-- 输入框 -->
        <div class="flex gap-2 mb-4">
          <input
            v-model="currentInput"
            @keyup.enter="addAnswer"
            type="text"
            placeholder="输入你的想法..."
            class="flex-1 px-4 py-3 rounded-clay border-4 border-clay-peach-dark/30 font-body text-clay-text focus:border-clay-peach-dark focus:outline-none"
          />
          <ClayButton @click="addAnswer" :disabled="!currentInput.trim()">
            添加
          </ClayButton>
        </div>

        <!-- 已添加的答案 -->
        <div class="space-y-2">
          <div 
            v-for="(answer, index) in answers" 
            :key="index"
            class="flex items-center justify-between bg-clay-mint/20 rounded-clay px-4 py-2"
          >
            <span class="font-body text-clay-text">{{ index + 1 }}. {{ answer }}</span>
            <button 
              @click="removeAnswer(index)"
              class="text-clay-text/50 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        </div>

        <p v-if="answers.length === 0" class="text-center text-clay-text/50 font-body py-4">
          还没有添加答案，快想想吧！
        </p>
      </ClayCard>

      <!-- 提交按钮 -->
      <div class="flex gap-3">
        <ClayButton 
          class="flex-1"
          variant="secondary"
          :disabled="answers.length < 3"
          @click="submitEarly"
        >
          提前提交 ({{ answers.length }}个)
        </ClayButton>
      </div>
      <p class="text-center text-xs text-clay-text/50 mt-2">
        至少需要 3 个答案才能提前提交
      </p>
    </div>

    <!-- 结果阶段 -->
    <div v-else-if="phase === 'result'" class="text-center">
      <ClayCard padding="lg" variant="game">
        <div class="text-5xl mb-4">🎨</div>
        <h3 class="font-heading text-2xl text-clay-text mb-4">
          第 {{ round }} 轮完成！
        </h3>
        
        <div class="space-y-2 mb-6">
          <p class="font-body text-clay-text">
            你想到了 
            <span class="font-heading text-3xl text-clay-peach-dark">{{ answers.length }}</span> 
            个创意！
          </p>
        </div>

        <!-- 答案列表 -->
        <div class="bg-white/50 rounded-clay p-4 text-left mb-4">
          <p class="font-body text-sm text-clay-text/70 mb-2">你的答案:</p>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(answer, index) in answers" 
              :key="index"
              class="px-3 py-1 bg-clay-mint/30 rounded-full font-body text-sm text-clay-text"
            >
              {{ answer }}
            </span>
          </div>
        </div>

        <!-- 参考答案 -->
        <div class="bg-clay-lilac/30 rounded-clay p-4 text-left">
          <p class="font-body text-sm text-clay-text/70 mb-2">💡 参考答案:</p>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(example, index) in currentPrompt.examples" 
              :key="index"
              class="px-3 py-1 bg-white/50 rounded-full font-body text-sm text-clay-text/70"
            >
              {{ example }}
            </span>
          </div>
        </div>
      </ClayCard>
    </div>
  </div>
</template>
