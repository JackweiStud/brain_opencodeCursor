<script setup lang="ts">
import { computed } from 'vue'
import type { AIAssessmentResult } from '@/utils/aiAssessment'

interface Props {
  result: AIAssessmentResult
  loading?: boolean
}

const props = defineProps<Props>()

// 学习风格图标
const learningStyleIcons: Record<string, string> = {
  Visual: '👁️',
  Auditory: '👂',
  ReadWrite: '📖',
  Kinesthetic: '🖐️'
}

// 获取学习风格图标
const learningStyleIcon = computed(() => {
  return learningStyleIcons[props.result.learningStyle.primaryType] || '📚'
})

// 优势智能排序
const sortedStrengths = computed(() => {
  return [...props.result.strengthAnalysis.topThree].sort((a, b) => b.score - a.score)
})
</script>

<template>
  <div class="space-y-6">
    <!-- 总体概述 -->
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
      <h2 class="font-heading text-xl text-gray-800 mb-4 flex items-center gap-2">
        <span>🌟</span>
        <span>AI 综合评价</span>
      </h2>
      
      <p class="font-body text-gray-700 leading-relaxed mb-4">
        {{ result.overallSummary.opening }}
      </p>
      
      <div class="bg-white/60 backdrop-blur rounded-lg p-4 border border-blue-200/50">
        <span class="font-body text-sm text-blue-600 font-medium">💡 关键发现：</span>
        <p class="font-body text-gray-800 mt-1">{{ result.overallSummary.keyHighlight }}</p>
      </div>
    </div>

    <!-- 优势分析 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="font-heading text-xl text-gray-800 mb-4 flex items-center gap-2">
        <span>💪</span>
        <span>优势分析</span>
      </h2>

      <!-- TOP3 优势 -->
      <div class="grid gap-4 mb-6">
        <div
          v-for="(strength, index) in sortedStrengths"
          :key="strength.name"
          class="p-4 rounded-lg border-2"
          :class="{
            'bg-yellow-50 border-yellow-200': index === 0,
            'bg-gray-50 border-gray-200': index === 1,
            'bg-orange-50 border-orange-100': index === 2
          }"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-2xl">{{ index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉' }}</span>
              <span class="font-heading text-lg text-gray-800">{{ strength.name }}</span>
            </div>
            <span class="font-heading text-xl" :class="{
              'text-yellow-600': index === 0,
              'text-gray-600': index === 1,
              'text-orange-600': index === 2
            }">{{ strength.score }}分</span>
          </div>
          <p class="font-body text-sm text-gray-600 mb-2">{{ strength.description }}</p>
          <p class="font-body text-xs text-gray-500 italic">
            📌 日常体现：{{ strength.realLifeExample }}
          </p>
        </div>
      </div>

      <!-- 独特特质 -->
      <div class="bg-purple-50 rounded-lg p-4 mb-4">
        <span class="font-body text-sm text-purple-600 font-medium">✨ 独特之处：</span>
        <p class="font-body text-gray-700 mt-1">{{ result.strengthAnalysis.uniqueTrait }}</p>
      </div>

      <!-- 整体画像 -->
      <p class="font-body text-gray-700 leading-relaxed">
        {{ result.strengthAnalysis.summaryParagraph }}
      </p>
    </div>

    <!-- 发展建议 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="font-heading text-xl text-gray-800 mb-4 flex items-center gap-2">
        <span>🚀</span>
        <span>发展建议</span>
      </h2>

      <!-- 优势培养 -->
      <div class="mb-6">
        <h3 class="font-heading text-md text-gray-700 mb-3">🌱 优势培养</h3>
        <div class="space-y-3">
          <div
            v-for="item in result.developmentSuggestions.strengthNurturing"
            :key="item.area"
            class="p-4 bg-green-50 rounded-lg border border-green-100"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-heading text-green-700">{{ item.area }}</span>
              <span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                {{ item.frequency }}
              </span>
            </div>
            <p class="font-body text-sm text-gray-600 mb-1">
              <span class="text-green-600">为什么：</span>{{ item.why }}
            </p>
            <p class="font-body text-sm text-gray-600">
              <span class="text-green-600">怎么做：</span>{{ item.how }}
            </p>
          </div>
        </div>
      </div>

      <!-- 探索领域 -->
      <div class="mb-6">
        <h3 class="font-heading text-md text-gray-700 mb-3">🔍 值得探索的新领域</h3>
        <div class="grid md:grid-cols-2 gap-3">
          <div
            v-for="item in result.developmentSuggestions.explorationAreas"
            :key="item.area"
            class="p-3 bg-blue-50 rounded-lg border border-blue-100"
          >
            <span class="font-heading text-blue-700">{{ item.area }}</span>
            <p class="font-body text-xs text-gray-600 mt-1">{{ item.reason }}</p>
            <p class="font-body text-xs text-blue-600 mt-1">
              入门：{{ item.startingPoint }}
            </p>
          </div>
        </div>
      </div>

      <!-- 日常活动 -->
      <div>
        <h3 class="font-heading text-md text-gray-700 mb-3">📅 每天可以做的小事</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="activity in result.developmentSuggestions.dailyActivities"
            :key="activity"
            class="px-3 py-2 bg-orange-50 text-orange-700 rounded-full font-body text-sm border border-orange-100"
          >
            {{ activity }}
          </span>
        </div>
      </div>
    </div>

    <!-- 学习风格 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="font-heading text-xl text-gray-800 mb-4 flex items-center gap-2">
        <span>📚</span>
        <span>学习风格</span>
      </h2>

      <div class="flex items-center gap-4 mb-4">
        <span class="text-4xl">{{ learningStyleIcon }}</span>
        <div>
          <span class="font-heading text-lg text-gray-800">
            {{ result.learningStyle.primaryTypeChinese }}学习者
          </span>
          <p class="font-body text-sm text-gray-600">{{ result.learningStyle.characteristics }}</p>
        </div>
      </div>

      <div class="mb-4">
        <h3 class="font-heading text-md text-gray-700 mb-2">🏠 在家学习策略</h3>
        <ul class="space-y-2">
          <li
            v-for="strategy in result.learningStyle.atHomeStrategies"
            :key="strategy"
            class="font-body text-sm text-gray-600 flex items-start gap-2"
          >
            <span class="text-blue-500">•</span>
            <span>{{ strategy }}</span>
          </li>
        </ul>
      </div>

      <div class="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
        <span class="font-body text-sm text-yellow-700">
          💬 与老师沟通时可以说：{{ result.learningStyle.communicationTip }}
        </span>
      </div>
    </div>

    <!-- 职业兴趣 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="font-heading text-xl text-gray-800 mb-4 flex items-center gap-2">
        <span>💼</span>
        <span>职业兴趣分析</span>
      </h2>

      <div class="flex items-center gap-4 mb-4">
        <div class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
          <span class="font-heading text-2xl">{{ result.careerInterests.hollandCode }}</span>
        </div>
        <p class="font-body text-sm text-gray-600 flex-1">
          {{ result.careerInterests.codeInterpretation }}
        </p>
      </div>

      <p class="font-body text-gray-700 mb-4">
        {{ result.careerInterests.currentInterests }}
      </p>

      <h3 class="font-heading text-md text-gray-700 mb-2">🎯 未来可探索的方向</h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="direction in result.careerInterests.futureDirections"
          :key="direction"
          class="px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-body text-sm border border-purple-100"
        >
          {{ direction }}
        </span>
      </div>
    </div>

    <!-- 潜力预测 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="font-heading text-xl text-gray-800 mb-4 flex items-center gap-2">
        <span>🔮</span>
        <span>发展展望</span>
      </h2>

      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <span class="font-body text-sm text-blue-600 font-medium">📅 未来1-2年</span>
          <p class="font-body text-gray-700 mt-2">{{ result.potentialPrediction.shortTermVision }}</p>
        </div>
        <div class="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <span class="font-body text-sm text-purple-600 font-medium">🌈 长期发展</span>
          <p class="font-body text-gray-700 mt-2">{{ result.potentialPrediction.longTermVision }}</p>
        </div>
      </div>

      <div class="bg-green-50 rounded-lg p-4 border border-green-100">
        <span class="font-body text-sm text-green-600 font-medium">👨‍👩‍👧 家长的角色</span>
        <p class="font-body text-gray-700 mt-2">{{ result.potentialPrediction.parentRole }}</p>
      </div>
    </div>

    <!-- 注意事项 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="font-heading text-xl text-gray-800 mb-4 flex items-center gap-2">
        <span>⚠️</span>
        <span>需要关注</span>
      </h2>

      <div class="space-y-3 mb-4">
        <div
          v-for="item in result.attentionPoints.areasToWatch"
          :key="item.area"
          class="p-4 bg-amber-50 rounded-lg border border-amber-100"
        >
          <span class="font-heading text-amber-700">{{ item.area }}</span>
          <p class="font-body text-sm text-gray-600 mt-1">
            <span class="text-amber-600">观察到：</span>{{ item.observation }}
          </p>
          <p class="font-body text-sm text-gray-600 mt-1">
            <span class="text-amber-600">建议：</span>{{ item.suggestion }}
          </p>
        </div>
      </div>

      <!-- 鼓励话语 -->
      <div class="bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg p-4 border border-pink-100 text-center">
        <p class="font-body text-gray-700 text-lg">
          💝 {{ result.attentionPoints.encouragement }}
        </p>
      </div>
    </div>

    <!-- 元数据 -->
    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <p class="font-body text-xs text-gray-500 mb-1">
        📊 {{ result.metadata.reliabilityNote }}
      </p>
      <p class="font-body text-xs text-gray-400">
        ⚠️ {{ result.metadata.disclaimer }}
      </p>
    </div>
  </div>
</template>
