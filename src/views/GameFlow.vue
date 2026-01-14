<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ClayButton, ClayCard } from '../components/common'
import { SchulteGrid, MemoryGame, LogicGame, CreativeGame } from '../components/games'
import { useGamesStore } from '../stores/games'
import { useProfileStore } from '../stores/profile'
import { useQuestionnaireEnhancedStore } from '../stores/questionnaireEnhanced'

const router = useRouter()
const gamesStore = useGamesStore()
const profileStore = useProfileStore()
const questionnaireStore = useQuestionnaireEnhancedStore()

// 游戏类型
type GameType = 'schulte' | 'memory' | 'logic' | 'creative'

// 游戏配置
const gameConfigs = {
  schulte: { name: '舒尔特方格', icon: '🎯', rounds: 3, description: '测试注意力集中能力' },
  memory: { name: '图形记忆', icon: '🧠', rounds: 3, description: '测试短期记忆能力' },
  logic: { name: '逻辑推理', icon: '🧩', rounds: 3, description: '测试逻辑思维能力' },
  creative: { name: '发散思维', icon: '💡', rounds: 2, description: '测试创造力和想象力' }
}

// 游戏顺序
const gameOrder: GameType[] = ['schulte', 'memory', 'logic', 'creative']

// 状态
const phase = ref<'intro' | 'playing' | 'transition' | 'complete'>('intro')
const currentGameIndex = ref(0)
const currentRound = ref(1)
const showGameResult = ref(false)

// 当前游戏
const currentGame = computed(() => gameOrder[currentGameIndex.value])
const currentGameConfig = computed(() => gameConfigs[currentGame.value])

// 总进度
const totalGames = gameOrder.length
const progress = computed(() => {
  return Math.round((currentGameIndex.value / totalGames) * 100)
})

// 开始游戏流程
const startGames = () => {
  currentGameIndex.value = 0
  currentRound.value = 1
  phase.value = 'playing'
}

// 舒尔特方格完成
const onSchulteComplete = (time: number, errors: number) => {
  gamesStore.recordSchulte(time, errors)
  showGameResult.value = true
}

// 记忆游戏完成 - 延迟显示继续按钮，让用户看到结果
const onMemoryComplete = (score: number) => {
  gamesStore.recordMemory(score)
  // 延迟2秒后显示继续按钮，让用户看清结果
  setTimeout(() => {
    showGameResult.value = true
  }, 2000)
}

// 逻辑游戏完成 - 延迟显示继续按钮，让用户看到结果
const onLogicComplete = (correct: boolean, time: number) => {
  gamesStore.recordLogic(correct, time)
  // 延迟2秒后显示继续按钮，让用户看清结果
  setTimeout(() => {
    showGameResult.value = true
  }, 2000)
}

// 创意游戏完成
const onCreativeComplete = (answers: string[]) => {
  gamesStore.recordCreative(answers)
  showGameResult.value = true
}

// 下一轮/下一个游戏
const nextRound = () => {
  showGameResult.value = false
  
  const maxRounds = currentGameConfig.value.rounds
  
  if (currentRound.value < maxRounds) {
    // 继续下一轮
    currentRound.value++
  } else {
    // 切换到下一个游戏
    if (currentGameIndex.value < gameOrder.length - 1) {
      currentGameIndex.value++
      currentRound.value = 1
      phase.value = 'transition'
    } else {
      // 全部完成
      phase.value = 'complete'
    }
  }
}

// 继续下一个游戏
const continueToNextGame = () => {
  phase.value = 'playing'
}

// 前往报告
const goToReport = () => {
  router.push('/report')
}

// 检查前置条件
onMounted(() => {
  if (!profileStore.isProfileComplete) {
    router.push('/profile')
    return
  }
  // 可以检查问卷是否完成
})
</script>

<template>
  <div class="min-h-screen bg-clay-bg">
    <!-- 介绍页面 -->
    <div v-if="phase === 'intro'" class="flex flex-col items-center justify-center min-h-screen p-8">
      <ClayCard padding="lg" class="max-w-md w-full text-center">
        <div class="text-6xl mb-4">🎮</div>
        <h1 class="font-heading text-3xl text-clay-text mb-4">互动测评</h1>
        <p class="font-body text-clay-text/70 mb-6 leading-relaxed">
          接下来通过 4 个有趣的小游戏，<br>
          测试你的认知能力！
        </p>
        
        <div class="bg-clay-lilac/30 rounded-clay p-4 mb-6 text-left">
          <p class="font-body text-sm text-clay-text/70 mb-3">🎮 游戏项目：</p>
          <div class="space-y-2">
            <div v-for="(config, key) in gameConfigs" :key="key" class="flex items-center gap-2">
              <span class="text-xl">{{ config.icon }}</span>
              <span class="font-body text-sm text-clay-text">{{ config.name }}</span>
              <span class="font-body text-xs text-clay-text/50">· {{ config.rounds }}轮</span>
            </div>
          </div>
        </div>

        <p class="font-body text-sm text-clay-text/50 mb-6">
          预计用时：10-15 分钟
        </p>

        <ClayButton size="lg" class="w-full" @click="startGames">
          开始游戏 →
        </ClayButton>
      </ClayCard>

      <button 
        @click="router.push('/questionnaire')"
        class="mt-6 text-clay-text/50 hover:text-clay-text font-body transition-colors"
      >
        ← 返回问卷
      </button>
    </div>

    <!-- 游戏进行中 -->
    <div v-else-if="phase === 'playing'" class="flex flex-col items-center justify-center min-h-screen p-8">
      <!-- 游戏标题栏 -->
      <div class="w-full max-w-md mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="font-heading text-lg text-clay-text">
            {{ currentGameConfig.icon }} {{ currentGameConfig.name }}
          </span>
          <span class="font-body text-sm text-clay-text/50">
            游戏 {{ currentGameIndex + 1 }}/{{ totalGames }}
          </span>
        </div>
        <div class="h-2 bg-clay-bg rounded-full border border-clay-peach-dark/30 overflow-hidden">
          <div 
            class="h-full bg-clay-mint rounded-full transition-all duration-500"
            :style="{ width: `${progress}%` }"
          />
        </div>
      </div>

      <!-- 游戏组件 - 使用 key 强制重新渲染 -->
      <SchulteGrid 
        v-if="currentGame === 'schulte'"
        :key="`schulte-${currentRound}`"
        :round="currentRound"
        @complete="onSchulteComplete"
      />

      <MemoryGame 
        v-else-if="currentGame === 'memory'"
        :key="`memory-${currentRound}`"
        :round="currentRound"
        @complete="onMemoryComplete"
      />

      <LogicGame 
        v-else-if="currentGame === 'logic'"
        :key="`logic-${currentRound}`"
        :round="currentRound"
        @complete="onLogicComplete"
      />

      <CreativeGame 
        v-else-if="currentGame === 'creative'"
        :key="`creative-${currentRound}`"
        :round="currentRound"
        @complete="onCreativeComplete"
      />

      <!-- 轮次结果后的继续按钮 -->
      <div v-if="showGameResult" class="w-full max-w-md mt-6 animate-fade-in">
        <ClayButton size="lg" class="w-full" @click="nextRound">
          {{ currentRound < currentGameConfig.rounds ? '下一轮 →' : '继续 →' }}
        </ClayButton>
      </div>
    </div>

    <!-- 游戏切换过渡 -->
    <div v-else-if="phase === 'transition'" class="flex flex-col items-center justify-center min-h-screen p-8">
      <ClayCard padding="lg" class="max-w-md w-full text-center">
        <div class="text-5xl mb-4">✨</div>
        <h2 class="font-heading text-2xl text-clay-text mb-4">
          {{ gameConfigs[gameOrder[currentGameIndex - 1]].name }} 完成！
        </h2>
        <p class="font-body text-clay-text/70 mb-6">
          接下来进入：<br>
          <span class="font-heading text-xl text-clay-text">
            {{ currentGameConfig.icon }} {{ currentGameConfig.name }}
          </span>
        </p>
        <p class="font-body text-sm text-clay-text/50 mb-6">
          {{ currentGameConfig.description }}
        </p>
        <ClayButton size="lg" class="w-full" variant="secondary" @click="continueToNextGame">
          开始 →
        </ClayButton>
      </ClayCard>
    </div>

    <!-- 全部完成 -->
    <div v-else-if="phase === 'complete'" class="flex flex-col items-center justify-center min-h-screen p-8">
      <ClayCard padding="lg" class="max-w-md w-full text-center">
        <div class="text-6xl mb-4">🏆</div>
        <h2 class="font-heading text-2xl text-clay-text mb-4">
          全部测评完成！
        </h2>
        <p class="font-body text-clay-text/70 mb-6">
          太棒了 {{ profileStore.profile.name }}！<br>
          你已经完成了所有测评项目。
        </p>

        <div class="bg-clay-lilac/30 rounded-clay p-4 mb-6 text-left">
          <p class="font-body text-sm text-clay-text/70 mb-2">✅ 测评完成：</p>
          <ul class="font-body text-sm text-clay-text/70 space-y-1">
            <li>• 多元智能问卷 ✓</li>
            <li>• 职业兴趣问卷 ✓</li>
            <li>• 注意力测试 ✓</li>
            <li>• 记忆力测试 ✓</li>
            <li>• 逻辑思维测试 ✓</li>
            <li>• 创造力测试 ✓</li>
          </ul>
        </div>

        <ClayButton size="lg" class="w-full" variant="success" @click="goToReport">
          查看评估报告 →
        </ClayButton>
      </ClayCard>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
