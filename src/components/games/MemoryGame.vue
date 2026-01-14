<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ClayButton, ClayCard } from '../common'

interface Props {
  round: number  // 当前轮次 1-3
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'complete': [score: number]
}>()

// 游戏配置（根据轮次增加难度）
const gridSize = computed(() => props.round + 2)  // 3x3, 4x4, 5x5
const targetCount = computed(() => props.round + 2)  // 需要记忆的数量 3, 4, 5

// 图形符号
const symbols = ['🌟', '❤️', '🔷', '🟢', '🔶', '💜', '🟠', '🔵']

// 游戏状态
const phase = ref<'memorize' | 'recall' | 'result'>('memorize')
const targetCells = ref<number[]>([])  // 需要记忆的位置
const selectedCells = ref<number[]>([])  // 玩家选择的位置
const memorizeTimer = ref<number | null>(null)
const countdown = ref(3)

// 总格子数
const totalCells = computed(() => gridSize.value * gridSize.value)

// 生成随机目标位置
const generateTargets = () => {
  const positions: number[] = []
  while (positions.length < targetCount.value) {
    const pos = Math.floor(Math.random() * totalCells.value)
    if (!positions.includes(pos)) {
      positions.push(pos)
    }
  }
  return positions
}

// 开始游戏
const startGame = () => {
  targetCells.value = generateTargets()
  selectedCells.value = []
  countdown.value = 3
  phase.value = 'memorize'

  // 倒计时
  memorizeTimer.value = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (memorizeTimer.value) {
        clearInterval(memorizeTimer.value)
        memorizeTimer.value = null
      }
      phase.value = 'recall'
    }
  }, 1000)
}

// 点击格子（回忆阶段）
const clickCell = (index: number) => {
  if (phase.value !== 'recall') return
  
  if (selectedCells.value.includes(index)) {
    // 取消选择
    selectedCells.value = selectedCells.value.filter(i => i !== index)
  } else if (selectedCells.value.length < targetCount.value) {
    // 添加选择
    selectedCells.value.push(index)
  }
}

// 提交答案
const submitAnswer = () => {
  phase.value = 'result'
  
  // 计算得分
  const correct = selectedCells.value.filter(c => targetCells.value.includes(c)).length
  const score = Math.round((correct / targetCount.value) * 100)
  
  emit('complete', score)
}

// 获取格子状态
const getCellState = (index: number) => {
  if (phase.value === 'memorize') {
    return targetCells.value.includes(index) ? 'target' : 'empty'
  }
  if (phase.value === 'recall') {
    return selectedCells.value.includes(index) ? 'selected' : 'empty'
  }
  if (phase.value === 'result') {
    const isTarget = targetCells.value.includes(index)
    const isSelected = selectedCells.value.includes(index)
    if (isTarget && isSelected) return 'correct'
    if (isTarget && !isSelected) return 'missed'
    if (!isTarget && isSelected) return 'wrong'
    return 'empty'
  }
  return 'empty'
}

// 正确数量
const correctCount = computed(() => {
  return selectedCells.value.filter(c => targetCells.value.includes(c)).length
})

// 组件挂载后自动开始游戏
onMounted(() => {
  startGame()
})

// 清理
onUnmounted(() => {
  if (memorizeTimer.value) {
    clearInterval(memorizeTimer.value)
  }
})
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <!-- 记忆阶段 -->
    <div v-if="phase === 'memorize'">
      <div class="text-center mb-4">
        <span class="font-heading text-3xl text-clay-text">
          记住位置！ {{ countdown }}
        </span>
      </div>

      <div 
        class="grid gap-2"
        :style="{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }"
      >
        <div
          v-for="i in totalCells"
          :key="i"
          class="aspect-square rounded-clay border-4 flex items-center justify-center text-3xl transition-all"
          :class="getCellState(i - 1) === 'target' 
            ? 'bg-clay-peach border-clay-peach-dark animate-pulse' 
            : 'bg-white border-clay-peach-dark/30'"
        >
          <span v-if="getCellState(i - 1) === 'target'">🌟</span>
        </div>
      </div>
    </div>

    <!-- 回忆阶段 -->
    <div v-else-if="phase === 'recall'">
      <div class="text-center mb-4">
        <span class="font-body text-clay-text/70">
          选择 {{ targetCount }} 个位置
        </span>
        <span class="font-heading text-lg text-clay-text ml-2">
          ({{ selectedCells.length }}/{{ targetCount }})
        </span>
      </div>

      <div 
        class="grid gap-2 mb-6"
        :style="{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }"
      >
        <button
          v-for="i in totalCells"
          :key="i"
          @click="clickCell(i - 1)"
          class="aspect-square rounded-clay border-4 flex items-center justify-center text-3xl transition-all cursor-pointer"
          :class="getCellState(i - 1) === 'selected' 
            ? 'bg-clay-blue border-[#8BC4D6] scale-95' 
            : 'bg-white border-clay-peach-dark/30 hover:bg-clay-bg'"
        >
          <span v-if="getCellState(i - 1) === 'selected'">✓</span>
        </button>
      </div>

      <ClayButton 
        size="lg" 
        class="w-full"
        :disabled="selectedCells.length !== targetCount"
        @click="submitAnswer"
      >
        确认答案
      </ClayButton>
    </div>

    <!-- 结果阶段 -->
    <div v-else-if="phase === 'result'" class="text-center">
      <ClayCard padding="lg" variant="game">
        <div class="text-5xl mb-4">
          {{ correctCount === targetCount ? '🎉' : '💪' }}
        </div>
        <h3 class="font-heading text-2xl text-clay-text mb-4">
          第 {{ round }} 轮完成！
        </h3>
        <p class="font-body text-clay-text mb-2">
          正确: <span class="font-heading text-xl text-green-500">{{ correctCount }}</span> / {{ targetCount }}
        </p>
        <p class="font-body text-clay-text">
          得分: <span class="font-heading text-2xl">{{ Math.round((correctCount / targetCount) * 100) }}</span> 分
        </p>
      </ClayCard>

      <!-- 结果展示 -->
      <div class="mt-4">
        <p class="text-sm text-clay-text/50 mb-2">结果对照：</p>
        <div 
          class="grid gap-1"
          :style="{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }"
        >
          <div
            v-for="i in totalCells"
            :key="i"
            class="aspect-square rounded-lg border-2 flex items-center justify-center text-lg"
            :class="{
              'bg-green-200 border-green-400': getCellState(i - 1) === 'correct',
              'bg-red-200 border-red-400': getCellState(i - 1) === 'wrong',
              'bg-yellow-200 border-yellow-400': getCellState(i - 1) === 'missed',
              'bg-gray-100 border-gray-200': getCellState(i - 1) === 'empty'
            }"
          >
            <span v-if="getCellState(i - 1) === 'correct'">✓</span>
            <span v-else-if="getCellState(i - 1) === 'wrong'">✗</span>
            <span v-else-if="getCellState(i - 1) === 'missed'">○</span>
          </div>
        </div>
        <div class="flex justify-center gap-4 mt-2 text-xs text-clay-text/50">
          <span>✓ 正确</span>
          <span>✗ 错选</span>
          <span>○ 漏选</span>
        </div>
      </div>
    </div>
  </div>
</template>
