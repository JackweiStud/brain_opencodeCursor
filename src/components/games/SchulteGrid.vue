<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ClayButton, ClayCard } from '../common'

interface Props {
  round: number  // 当前轮次 1-3
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'complete': [time: number, errors: number]
}>()

// 游戏状态
const phase = ref<'ready' | 'playing' | 'finished'>('ready')
const grid = ref<number[]>([])
const currentNumber = ref(1)
const startTime = ref(0)
const elapsedTime = ref(0)
const errors = ref(0)
const timer = ref<number | null>(null)

// 生成随机排列的 1-25
const generateGrid = () => {
  const numbers = Array.from({ length: 25 }, (_, i) => i + 1)
  // Fisher-Yates 洗牌算法
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[numbers[i], numbers[j]] = [numbers[j], numbers[i]]
  }
  return numbers
}

// 格式化时间
const formatTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000)
  const decimal = Math.floor((ms % 1000) / 100)
  return `${seconds}.${decimal}`
}

// 开始游戏
const startGame = () => {
  grid.value = generateGrid()
  currentNumber.value = 1
  errors.value = 0
  phase.value = 'playing'
  startTime.value = Date.now()
  
  // 启动计时器
  timer.value = window.setInterval(() => {
    elapsedTime.value = Date.now() - startTime.value
  }, 100)
}

// 点击数字
const clickNumber = (num: number) => {
  if (phase.value !== 'playing') return

  if (num === currentNumber.value) {
    // 正确
    if (currentNumber.value === 25) {
      // 完成
      finishGame()
    } else {
      currentNumber.value++
    }
  } else {
    // 错误
    errors.value++
  }
}

// 完成游戏
const finishGame = () => {
  phase.value = 'finished'
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
  const finalTime = Math.round((Date.now() - startTime.value) / 1000 * 10) / 10
  emit('complete', finalTime, errors.value)
}

// 获取单元格样式
const getCellStyle = (num: number) => {
  if (num < currentNumber.value) {
    return {
      backgroundColor: 'var(--color-clay-mint)',
      borderColor: '#7AE07A',
      opacity: '0.6'
    }
  }
  return {}
}

// 清理
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <!-- 准备阶段 -->
    <div v-if="phase === 'ready'" class="text-center">
      <ClayCard padding="lg">
        <div class="text-5xl mb-4">🎯</div>
        <h3 class="font-heading text-2xl text-clay-text mb-4">
          第 {{ round }} 轮
        </h3>
        <p class="font-body text-clay-text/70 mb-6">
          按照 1-25 的顺序<br>
          尽快点击所有数字
        </p>
        <ClayButton size="lg" @click="startGame">
          开始 →
        </ClayButton>
      </ClayCard>
    </div>

    <!-- 游戏进行中 -->
    <div v-else-if="phase === 'playing'">
      <!-- 状态栏 -->
      <div class="flex justify-between items-center mb-4 px-2">
        <div class="font-body text-clay-text/70">
          找: <span class="font-heading text-2xl text-clay-text">{{ currentNumber }}</span>
        </div>
        <div class="font-heading text-xl text-clay-text">
          {{ formatTime(elapsedTime) }}s
        </div>
        <div class="font-body text-clay-text/70">
          错误: <span class="text-red-500">{{ errors }}</span>
        </div>
      </div>

      <!-- 方格 -->
      <div class="grid grid-cols-5 gap-2">
        <button
          v-for="(num, index) in grid"
          :key="index"
          @click="clickNumber(num)"
          class="aspect-square rounded-clay border-4 border-clay-peach-dark font-heading text-2xl text-clay-text transition-all duration-150 hover:scale-95 active:scale-90"
          :class="num < currentNumber ? 'cursor-default' : 'cursor-pointer bg-white hover:bg-clay-peach/30'"
          :style="getCellStyle(num)"
          :disabled="num < currentNumber"
        >
          {{ num }}
        </button>
      </div>
    </div>

    <!-- 完成阶段 -->
    <div v-else-if="phase === 'finished'" class="text-center">
      <ClayCard padding="lg" variant="game">
        <div class="text-5xl mb-4">🎉</div>
        <h3 class="font-heading text-2xl text-clay-text mb-4">
          第 {{ round }} 轮完成！
        </h3>
        <div class="space-y-2 mb-6">
          <p class="font-body text-clay-text">
            用时: <span class="font-heading text-xl">{{ formatTime(elapsedTime) }}</span> 秒
          </p>
          <p class="font-body text-clay-text">
            错误: <span class="font-heading text-xl" :class="errors > 0 ? 'text-red-500' : 'text-green-500'">{{ errors }}</span> 次
          </p>
        </div>
      </ClayCard>
    </div>
  </div>
</template>
