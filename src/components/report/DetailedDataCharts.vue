<script setup lang="ts">
import { ref } from 'vue'
import { RadarChart, ScoreCard, ConsistencyAnalysisCard, IntegratedScoresCard } from './index'

interface Props {
  // 基础数据
  intelligenceScores: Record<string, number>
  intelligenceChartData: any[]
  interestScores: Record<string, number>
  interestChartData: any[]
  cognitiveScores: { attention: number; memory: number; logic: number; creativity: number }
  
  // 综合分析数据（可选）
  integratedAssessment: any | null
  showIntegrationAnalysis: boolean
}

defineProps<Props>()

const cognitiveNameMap = {
  attention: '注意力',
  memory: '记忆力',
  logic: '逻辑思维',
  creativity: '创造力'
}

// 折叠状态（默认折叠）
const isIntegratedScoresExpanded = ref(false)
const isConsistencyExpanded = ref(false)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4 mb-2">
      <div class="h-px bg-gray-200 flex-1"></div>
      <span class="text-sm text-gray-400 font-medium tracking-wider">详细测评数据</span>
      <div class="h-px bg-gray-200 flex-1"></div>
    </div>

    <!-- 游戏-问卷关联分析（仅在游戏完成后显示） -->
    <template v-if="showIntegrationAnalysis && integratedAssessment">
      <!-- 综合智能评分（可折叠） -->
      <div class="bg-white rounded-xl shadow-sm border border-report-border overflow-hidden mb-6">
        <div 
          @click="isIntegratedScoresExpanded = !isIntegratedScoresExpanded"
          class="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <h2 class="font-heading text-lg text-report-text flex items-center gap-2">
            📊 综合智能评分
            <span class="text-xs text-gray-400 font-normal">（问卷+游戏加权）</span>
          </h2>
          <button 
            class="text-gray-400 hover:text-gray-600 transition-transform duration-300"
            :class="{ 'rotate-180': isIntegratedScoresExpanded }"
          >
            ▼
          </button>
        </div>
        <div v-show="isIntegratedScoresExpanded" class="border-t border-gray-100">
          <IntegratedScoresCard
            :integrated-scores="integratedAssessment.integratedScores"
            :hide-header="true"
          />
        </div>
      </div>

      <!-- 一致性分析（可折叠） -->
      <div class="bg-white rounded-xl shadow-sm border border-report-border overflow-hidden mb-6">
        <div 
          @click="isConsistencyExpanded = !isConsistencyExpanded"
          class="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <h2 class="font-heading text-lg text-report-text flex items-center gap-2">
            🔍 问卷-游戏一致性分析
            <span class="text-xs text-gray-400 font-normal">（数据可信度验证）</span>
          </h2>
          <button 
            class="text-gray-400 hover:text-gray-600 transition-transform duration-300"
            :class="{ 'rotate-180': isConsistencyExpanded }"
          >
            ▼
          </button>
        </div>
        <div v-show="isConsistencyExpanded" class="border-t border-gray-100">
          <ConsistencyAnalysisCard
            :consistency="integratedAssessment.consistency"
            :hide-header="true"
          />
        </div>
      </div>
    </template>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 多元智能维度 -->
      <div class="bg-white rounded-xl shadow-sm border border-report-border p-6 chart-container">
        <h2 class="font-heading text-xl text-report-text mb-6 flex items-center gap-2">
          🧠 多元智能维度
        </h2>
        <div class="h-64 flex items-center justify-center mb-6">
          <RadarChart :data="intelligenceChartData" title="多元智能分布" />
        </div>
        <div class="grid grid-cols-1 gap-2">
          <!-- 这里使用传入的 intelligenceScores 做列表展示，逻辑简化 -->
          <!-- 实际项目中可能需要更复杂的列表逻辑，这里仅做占位或简化展示 -->
        </div>
      </div>

      <!-- 职业兴趣倾向 -->
      <div class="bg-white rounded-xl shadow-sm border border-report-border p-6 chart-container">
        <h2 class="font-heading text-xl text-report-text mb-6 flex items-center gap-2">
          🎯 职业兴趣倾向 (霍兰德)
        </h2>
        <div class="h-64 flex items-center justify-center mb-6">
          <RadarChart :data="interestChartData" type="interest" title="职业兴趣分布" />
        </div>
      </div>
    </div>

    <!-- 认知能力维度 -->
    <div class="bg-white rounded-xl shadow-sm border border-report-border p-6">
      <h2 class="font-heading text-xl text-report-text mb-6 flex items-center gap-2">
        🎮 认知能力维度
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCard
          v-for="(score, key) in cognitiveScores"
          :key="key"
          :title="cognitiveNameMap[key as keyof typeof cognitiveNameMap]"
          :score="score"
          :type="key as 'attention' | 'memory' | 'logic'"
        />
      </div>
    </div>
  </div>
</template>
