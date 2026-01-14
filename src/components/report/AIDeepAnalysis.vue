<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  result: any // AIAssessmentResult
  loading: boolean
}

const props = defineProps<Props>()
const isExpanded = ref(true)

const getLearningStyleEmoji = (type: string | undefined): string => {
  if (!type) return '🖐️'
  if (type.includes('视觉')) return '👁️'
  if (type.includes('听觉')) return '👂'
  if (type.includes('读写')) return '📖'
  return '🖐️'
}

const getSafeHollandCode = (code: string | undefined): string[] => {
  return code ? code.split('') : []
}

// 确保 safeResult 总是可用的，并做字段映射适配 AI 返回的数据结构
const safeResult = computed(() => {
  if (!props.result) return null
  
  const r = props.result
  
  // 映射 strengthAnalysis
  const topStrengths = (r.strengthAnalysis?.topThree || r.strengthAnalysis?.topStrengths || []).map((item: any) => ({
    name: item.name || '',
    score: item.score || 0,
    percentile: item.percentile || 0, // AI 可能不返回此字段
    description: item.description || item.realLifeExample || ''
  }))
  
  // 映射 learningStyle
  const learningStyleType = r.learningStyle?.primaryTypeChinese || r.learningStyle?.type || '未知'
  const learningStyleSuggestion = r.learningStyle?.characteristics || 
    r.learningStyle?.suggestion || 
    (r.learningStyle?.atHomeStrategies || []).join('；')
  
  // 映射 careerInterests
  const topInterests = r.careerInterests?.topInterests || 
    (r.careerInterests?.currentInterests ? [r.careerInterests.currentInterests] : [])
  const recommendedCareers = r.careerInterests?.futureDirections || 
    r.careerInterests?.recommendedCareers || []
  const careerAnalysis = r.careerInterests?.codeInterpretation || 
    r.careerInterests?.analysis || ''
  
  // 映射 developmentSuggestions
  const strengthEnhancement = r.developmentSuggestions?.strengthEnhancement ||
    (r.developmentSuggestions?.strengthNurturing || [])
      .map((s: any) => `【${s.area}】${s.how}（${s.frequency}）`)
      .join(' ') || ''
  const weaknessImprovement = r.developmentSuggestions?.weaknessImprovement ||
    (r.developmentSuggestions?.explorationAreas || [])
      .map((s: any) => `【${s.area}】${s.startingPoint}`)
      .join(' ') || ''
  
  // 映射 attentionPoints
  let attentionPointsArray: string[] = []
  if (Array.isArray(r.attentionPoints)) {
    attentionPointsArray = r.attentionPoints
  } else if (r.attentionPoints?.areasToWatch) {
    attentionPointsArray = r.attentionPoints.areasToWatch.map((p: any) => 
      `${p.area}：${p.observation} → ${p.suggestion}`
    )
  }
  
  return {
    ...r,
    strengthAnalysis: {
      ...r.strengthAnalysis,
      topStrengths
    },
    learningStyle: {
      type: learningStyleType,
      suggestion: learningStyleSuggestion
    },
    careerInterests: {
      hollandCode: r.careerInterests?.hollandCode || '',
      topInterests,
      analysis: careerAnalysis,
      recommendedCareers
    },
    developmentSuggestions: {
      ...r.developmentSuggestions,
      strengthEnhancement,
      weaknessImprovement,
      dailyActivities: r.developmentSuggestions?.dailyActivities || []
    },
    attentionPoints: attentionPointsArray
  }
})
</script>

<template>
  <div v-if="safeResult" class="bg-white rounded-xl shadow-sm border border-report-border overflow-hidden mb-6 transition-all duration-300">
    <!-- 标题栏 (可点击折叠) -->
    <div 
      @click="isExpanded = !isExpanded"
      class="bg-gradient-to-r from-blue-500/5 to-purple-500/5 p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <h2 class="font-heading text-xl text-report-text flex items-center gap-2">
        🤖 AI 深度分析
        <span class="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-0.5 rounded-full">Pro</span>
      </h2>
      <button class="text-gray-400 hover:text-gray-600 transition-transform duration-300" :class="{ 'rotate-180': isExpanded }">
        ▼
      </button>
    </div>

    <!-- 内容区域 -->
    <div v-show="isExpanded" class="p-6 space-y-8">
      
      <!-- 1. 优势智能 TOP3 -->
      <section>
        <h3 class="font-heading text-lg mb-4 flex items-center gap-2 text-report-primary">
          <span>💪</span> 核心天赋优势
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            v-for="(item, index) in safeResult.strengthAnalysis?.topStrengths || []" 
            :key="index"
            class="bg-blue-50/50 rounded-lg p-4 border border-blue-100 relative overflow-hidden group hover:shadow-md transition-shadow"
          >
            <!-- 排名角标 -->
            <div class="absolute -right-3 -top-3 w-12 h-12 bg-blue-100 rounded-full flex items-end justify-start p-2 opacity-50">
              <span class="font-bold text-blue-600 text-lg ml-2 mb-1">#{{ index + 1 }}</span>
            </div>
            
            <h4 class="font-heading text-base text-report-text mb-2 relative z-10">{{ item.name }}</h4>
            <div class="flex items-baseline gap-1 mb-2">
              <span class="text-2xl font-bold text-blue-600">{{ item.score }}</span>
              <span class="text-xs text-gray-400">分</span>
            </div>
            <!-- 百分比显示优化：如果有真实数据则显示，否则隐藏 -->
            <div v-if="item.percentile > 0" class="text-xs text-green-600 font-medium mb-3">
              超过 {{ item.percentile }}% 同龄人
            </div>
            <div v-else class="text-xs text-gray-400 mb-3">
              (待常模数据积累)
            </div>
            <p class="text-sm text-gray-600 leading-snug">{{ item.description }}</p>
          </div>
        </div>
      </section>

      <!-- 2. 学习风格与习惯 -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 学习风格 -->
        <div class="bg-yellow-50/50 rounded-lg p-5 border border-yellow-100">
          <h3 class="font-heading text-lg mb-3 flex items-center gap-2 text-yellow-800">
            <span>📚</span> 最佳学习方式 (VARK)
          </h3>
          <div class="flex items-center gap-3 mb-3">
            <div class="text-3xl bg-white w-12 h-12 flex items-center justify-center rounded-full shadow-sm">
              {{ getLearningStyleEmoji(safeResult.learningStyle.type) }}
            </div>
            <div>
              <div class="font-bold text-report-text">{{ safeResult.learningStyle.type }}</div>
              <div class="text-xs text-gray-500">此风格更高效</div>
            </div>
          </div>
          <p class="text-sm text-gray-600 leading-relaxed">{{ safeResult.learningStyle.suggestion }}</p>
        </div>

        <!-- 职业兴趣 -->
        <div class="bg-purple-50/50 rounded-lg p-5 border border-purple-100">
          <h3 class="font-heading text-lg mb-3 flex items-center gap-2 text-purple-800">
            <span>💼</span> 潜在职业兴趣 (霍兰德)
          </h3>
          <div class="flex flex-wrap gap-2 mb-3">
            <span 
              v-for="code in getSafeHollandCode(safeResult.careerInterests.hollandCode)" 
              :key="code"
              class="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold border border-purple-200"
            >
              {{ code }}
            </span>
            <span class="text-sm text-gray-600 self-center ml-1">
              {{ safeResult.careerInterests.topInterests.join(' + ') }}
            </span>
          </div>
          <p class="text-sm text-gray-600 leading-relaxed mb-2">{{ safeResult.careerInterests.analysis }}</p>
          <div class="mt-2">
            <span class="text-xs text-gray-400 mr-2">推荐职业方向:</span>
            <div class="flex flex-wrap gap-1 mt-1">
              <span 
                v-for="job in safeResult.careerInterests.recommendedCareers" 
                :key="job"
                class="px-2 py-0.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600"
              >
                {{ job }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. 个性化发展建议 -->
      <section>
        <h3 class="font-heading text-lg mb-4 flex items-center gap-2 text-green-700">
          <span>🚀</span> 个性化成长指南
        </h3>
        <div class="space-y-4">
          <!-- 优势培养 -->
          <div class="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl mt-1">🌟</div>
            <div>
              <h4 class="font-bold text-gray-800 mb-1">优势如何强化？</h4>
              <p class="text-sm text-gray-600 leading-relaxed">{{ safeResult.developmentSuggestions?.strengthEnhancement }}</p>
            </div>
          </div>
          <!-- 弱项提升 -->
          <div class="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl mt-1">🌱</div>
            <div>
              <h4 class="font-bold text-gray-800 mb-1">短板如何补充？</h4>
              <p class="text-sm text-gray-600 leading-relaxed">{{ safeResult.developmentSuggestions?.weaknessImprovement }}</p>
            </div>
          </div>
          <!-- 亲子活动 -->
          <div class="flex gap-4 p-4 bg-green-50/50 border border-green-100 rounded-lg">
            <div class="text-2xl mt-1">👨‍👩‍👧</div>
            <div>
              <h4 class="font-bold text-green-800 mb-1">本周亲子活动推荐</h4>
              <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li v-for="(activity, i) in safeResult.developmentSuggestions?.dailyActivities || []" :key="i">
                  {{ activity }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 4. 注意事项 -->
      <section v-if="safeResult.attentionPoints && safeResult.attentionPoints.length > 0">
         <div class="p-4 bg-orange-50 border border-orange-100 rounded-lg flex gap-3">
           <div class="text-xl">⚠️</div>
           <div>
             <h4 class="font-bold text-orange-800 text-sm mb-1">家长特别注意</h4>
             <ul class="list-disc list-inside text-xs text-orange-700/80 space-y-1">
               <li v-for="(point, i) in safeResult.attentionPoints" :key="i">{{ point }}</li>
             </ul>
           </div>
         </div>
      </section>

    </div>
  </div>
</template>
