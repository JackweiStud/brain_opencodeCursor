<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  result: any // AIAssessmentResult
  loading: boolean
}

const props = defineProps<Props>()
const isExpanded = ref(true)

// Holland Code 解释映射
const hollandCodeMap: Record<string, { name: string; desc: string }> = {
  'R': { name: '现实型', desc: '喜欢动手操作、机械和户外活动' },
  'I': { name: '研究型', desc: '喜欢探索、分析和解决问题' },
  'A': { name: '艺术型', desc: '喜欢创造、表达和想象' },
  'S': { name: '社会型', desc: '喜欢帮助他人、合作和交流' },
  'E': { name: '企业型', desc: '喜欢领导、说服和竞争' },
  'C': { name: '常规型', desc: '喜欢组织、规划和细节工作' }
}

const activeTooltip = ref<string | null>(null)

const getLearningStyleIcon = (type: string | undefined): string => {
  if (!type) return 'kinesthetic'
  if (type.includes('视觉')) return 'visual'
  if (type.includes('听觉')) return 'auditory'
  if (type.includes('读写')) return 'reading'
  return 'kinesthetic'
}

const getSafeHollandCode = (code: string | undefined): string[] => {
  return code ? code.split('') : []
}

// 排名角标颜色
const getRankGradient = (index: number): string => {
  const gradients = [
    'from-amber-400 via-yellow-300 to-amber-500', // 金牌
    'from-slate-300 via-gray-200 to-slate-400',   // 银牌
    'from-orange-400 via-amber-600 to-orange-500' // 铜牌
  ]
  return gradients[index] || gradients[2]
}

const getRankTextColor = (index: number): string => {
  const colors = ['text-amber-900', 'text-slate-700', 'text-orange-900']
  return colors[index] || colors[2]
}

// 确保 safeResult 总是可用的，并做字段映射适配 AI 返回的数据结构
const safeResult = computed(() => {
  if (!props.result) return null
  
  const r = props.result
  
  // 映射 strengthAnalysis
  const topStrengths = (r.strengthAnalysis?.topThree || r.strengthAnalysis?.topStrengths || []).map((item: any) => ({
    name: item.name || '',
    score: item.score || 0,
    percentile: item.percentile || 0,
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
  const strengthEnhancement = r.developmentSuggestions?.strengthNurturing || []
  const weaknessImprovement = r.developmentSuggestions?.explorationAreas || []
  
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
  <div v-if="safeResult" class="ai-analysis-container">
    <!-- 标题栏 (可点击折叠) -->
    <div 
      @click="isExpanded = !isExpanded"
      class="header-bar"
    >
      <h2 class="header-title">
        <!-- AI 图标 SVG -->
        <svg class="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2a4 4 0 0 1 4 4v1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2V6a4 4 0 0 1 4-4z"/>
          <circle cx="9" cy="9" r="1" fill="currentColor"/>
          <circle cx="15" cy="9" r="1" fill="currentColor"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <path d="M9 18h6"/>
          <path d="M10 22h4"/>
        </svg>
        AI 深度分析
        <span class="pro-badge">Pro</span>
      </h2>
      <button class="expand-btn" :class="{ 'is-expanded': isExpanded }">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper" :class="{ 'is-visible': isExpanded }">
      <div class="content-inner">
      
        <!-- 1. 优势智能 TOP3 -->
        <section class="section">
          <h3 class="section-title section-title--strength">
            <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            核心天赋优势
          </h3>
          <div class="strengths-grid">
            <div 
              v-for="(item, index) in safeResult.strengthAnalysis?.topStrengths || []" 
              :key="index"
              class="strength-card"
            >
              <!-- 排名角标 -->
              <div class="rank-badge" :class="getRankGradient(index)">
                <span :class="getRankTextColor(index)">#{{ index + 1 }}</span>
              </div>
              
              <h4 class="strength-name">{{ item.name }}</h4>
              <div class="score-display">
                <span class="score-value">{{ item.score }}</span>
                <span class="score-unit">分</span>
              </div>
              <div v-if="item.percentile > 0" class="percentile-badge">
                <svg class="percentile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
                超过 {{ item.percentile }}% 同龄人
              </div>
              <p class="strength-desc">{{ item.description }}</p>
            </div>
          </div>
        </section>

        <!-- 2. 学习风格与职业兴趣 -->
        <section class="dual-section">
          <!-- 学习风格 -->
          <div class="info-card info-card--learning">
            <h3 class="card-title card-title--learning">
              <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              最佳学习方式 (VARK)
            </h3>
            <div class="learning-type-display">
              <div class="learning-icon-wrapper" :data-type="getLearningStyleIcon(safeResult.learningStyle.type)">
                <!-- 视觉型图标 -->
                <svg v-if="getLearningStyleIcon(safeResult.learningStyle.type) === 'visual'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <!-- 听觉型图标 -->
                <svg v-else-if="getLearningStyleIcon(safeResult.learningStyle.type) === 'auditory'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
                <!-- 读写型图标 -->
                <svg v-else-if="getLearningStyleIcon(safeResult.learningStyle.type) === 'reading'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                </svg>
                <!-- 动觉型图标 -->
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                  <line x1="6" y1="1" x2="6" y2="4"/>
                  <line x1="10" y1="1" x2="10" y2="4"/>
                  <line x1="14" y1="1" x2="14" y2="4"/>
                </svg>
              </div>
              <div class="learning-type-info">
                <div class="learning-type-name">{{ safeResult.learningStyle.type }}</div>
                <div class="learning-type-hint">此风格学习效率最高</div>
              </div>
            </div>
            <p class="card-description">{{ safeResult.learningStyle.suggestion }}</p>
          </div>

          <!-- 职业兴趣 -->
          <div class="info-card info-card--career">
            <h3 class="card-title card-title--career">
              <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              潜在职业兴趣 (霍兰德)
            </h3>
            <div class="holland-codes">
              <div 
                v-for="code in getSafeHollandCode(safeResult.careerInterests.hollandCode)" 
                :key="code"
                class="holland-code-badge"
                @mouseenter="activeTooltip = code"
                @mouseleave="activeTooltip = null"
              >
                {{ code }}
                <!-- Tooltip -->
                <div v-show="activeTooltip === code" class="holland-tooltip">
                  <div class="tooltip-title">{{ hollandCodeMap[code]?.name || code }}</div>
                  <div class="tooltip-desc">{{ hollandCodeMap[code]?.desc || '' }}</div>
                </div>
              </div>
              <span class="interests-text">
                {{ safeResult.careerInterests.topInterests.join(' + ') }}
              </span>
            </div>
            <p class="card-description">{{ safeResult.careerInterests.analysis }}</p>
            <div class="career-recommendations">
              <span class="recommendations-label">推荐职业方向:</span>
              <div class="career-tags">
                <span 
                  v-for="job in safeResult.careerInterests.recommendedCareers" 
                  :key="job"
                  class="career-tag"
                >
                  {{ job }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- 3. 个性化发展建议 -->
        <section class="section">
          <h3 class="section-title section-title--growth">
            <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="20" x2="12" y2="10"/>
              <line x1="18" y1="20" x2="18" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="16"/>
            </svg>
            个性化成长指南
          </h3>
          <div class="growth-sections">
            <!-- 优势培养 -->
            <div class="growth-card growth-card--enhance">
              <div class="growth-card-header">
                <svg class="growth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <h4 class="growth-card-title">优势如何强化？</h4>
              </div>
              <div class="growth-items">
                <div 
                  v-for="(item, i) in safeResult.developmentSuggestions?.strengthEnhancement || []" 
                  :key="i"
                  class="growth-item"
                >
                  <div class="growth-item-number growth-item-number--blue">
                    {{ i + 1 }}
                  </div>
                  <div class="growth-item-content">
                    <div class="growth-item-area">{{ item.area }}</div>
                    <p class="growth-item-how">{{ item.how }}</p>
                    <span class="growth-item-frequency">{{ item.frequency }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 弱项提升 -->
            <div class="growth-card growth-card--improve">
              <div class="growth-card-header">
                <svg class="growth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                <h4 class="growth-card-title">短板如何补充？</h4>
              </div>
              <div class="growth-items">
                <div 
                  v-for="(item, i) in safeResult.developmentSuggestions?.weaknessImprovement || []" 
                  :key="i"
                  class="growth-item"
                >
                  <div class="growth-item-number growth-item-number--green">
                    {{ i + 1 }}
                  </div>
                  <div class="growth-item-content">
                    <div class="growth-item-area">{{ item.area }}</div>
                    <p class="growth-item-how">{{ item.startingPoint }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 亲子活动 -->
            <div class="family-activity-card">
              <svg class="family-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <div class="family-content">
                <h4 class="family-title">亲子活动推荐</h4>
                <ul class="family-activities">
                  <li v-for="(activity, i) in safeResult.developmentSuggestions?.dailyActivities || []" :key="i">
                    {{ activity }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        <!-- 4. 注意事项 -->
        <section v-if="safeResult.attentionPoints && safeResult.attentionPoints.length > 0" class="section">
          <div class="attention-card">
            <svg class="attention-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div class="attention-content">
              <h4 class="attention-title">家长特别注意</h4>
              <ul class="attention-list">
                <li v-for="(point, i) in safeResult.attentionPoints" :key="i">{{ point }}</li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== 容器与布局 ===== */
.ai-analysis-container {
  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 1.25rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 10px 15px -3px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  overflow: hidden;
  margin-bottom: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ai-analysis-container:hover {
  box-shadow: 
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 20px 40px -10px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.6) inset;
}

/* ===== 头部栏 ===== */
.header-bar {
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.08) 0%, 
    rgba(139, 92, 246, 0.08) 50%,
    rgba(236, 72, 153, 0.05) 100%
  );
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: between;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
}

.header-bar:hover {
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.12) 0%, 
    rgba(139, 92, 246, 0.12) 50%,
    rgba(236, 72, 153, 0.08) 100%
  );
}

.header-title {
  flex: 1;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  letter-spacing: -0.01em;
}

.header-icon {
  width: 1.75rem;
  height: 1.75rem;
  color: #3b82f6;
}

.pro-badge {
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.expand-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  border: none;
  cursor: pointer;
}

.expand-btn:hover {
  background: rgba(100, 116, 139, 0.1);
  color: #475569;
}

.expand-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-btn.is-expanded svg {
  transform: rotate(180deg);
}

/* ===== 内容区域 ===== */
.content-wrapper {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-wrapper.is-visible {
  max-height: 5000px;
}

.content-inner {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ===== 通用区块标题 ===== */
.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: -0.01em;
}

.section-title--strength { color: #3b82f6; }
.section-title--growth { color: #10b981; }

.section-icon {
  width: 1.375rem;
  height: 1.375rem;
  flex-shrink: 0;
}

/* ===== 优势卡片网格 ===== */
.strengths-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

@media (max-width: 768px) {
  .strengths-grid {
    grid-template-columns: 1fr;
  }
}

.strength-card {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.04) 0%, rgba(96, 165, 250, 0.06) 100%);
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid rgba(59, 130, 246, 0.15);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.strength-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 12px 24px -8px rgba(59, 130, 246, 0.2),
    0 4px 8px -2px rgba(0, 0, 0, 0.06);
  border-color: rgba(59, 130, 246, 0.3);
}

.rank-badge {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.875rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.rank-badge.from-amber-400 { background: linear-gradient(135deg, #fbbf24 0%, #fcd34d 50%, #f59e0b 100%); }
.rank-badge.from-slate-300 { background: linear-gradient(135deg, #cbd5e1 0%, #e2e8f0 50%, #94a3b8 100%); }
.rank-badge.from-orange-400 { background: linear-gradient(135deg, #fb923c 0%, #d97706 50%, #ea580c 100%); }

.strength-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.625rem;
  padding-right: 2.5rem;
}

.score-display {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.score-value {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.score-unit {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

.percentile-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #059669;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
}

.percentile-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.strength-desc {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
}

/* ===== 双栏信息卡片 ===== */
.dual-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

@media (max-width: 768px) {
  .dual-section {
    grid-template-columns: 1fr;
  }
}

.info-card {
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-card:hover {
  transform: translateY(-3px);
}

.info-card--learning {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.06) 0%, rgba(245, 158, 11, 0.08) 100%);
  border: 1px solid rgba(251, 191, 36, 0.2);
}

.info-card--learning:hover {
  box-shadow: 0 8px 24px -8px rgba(251, 191, 36, 0.25);
}

.info-card--career {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.06) 0%, rgba(124, 58, 237, 0.08) 100%);
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.info-card--career:hover {
  box-shadow: 0 8px 24px -8px rgba(139, 92, 246, 0.25);
}

.card-title {
  font-size: 1.0625rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-title--learning { color: #b45309; }
.card-title--career { color: #7c3aed; }

.learning-type-display {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1rem;
}

.learning-icon-wrapper {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.learning-icon-wrapper:hover {
  transform: scale(1.05);
}

.learning-icon-wrapper svg {
  width: 1.75rem;
  height: 1.75rem;
  color: #b45309;
}

.learning-type-name {
  font-weight: 700;
  color: #1e293b;
  font-size: 1rem;
}

.learning-type-hint {
  font-size: 0.75rem;
  color: #94a3b8;
}

.card-description {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.7;
}

/* ===== 霍兰德代码 ===== */
.holland-codes {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
}

.holland-code-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  cursor: help;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.holland-code-badge:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.holland-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0.5rem;
  background: #1e293b;
  color: white;
  padding: 0.625rem 0.875rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 50;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}

.holland-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #1e293b;
}

.tooltip-title {
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.tooltip-desc {
  color: #94a3b8;
  font-weight: 400;
}

.interests-text {
  font-size: 0.875rem;
  color: #64748b;
  margin-left: 0.25rem;
}

.career-recommendations {
  margin-top: 0.875rem;
}

.recommendations-label {
  font-size: 0.75rem;
  color: #94a3b8;
  display: block;
  margin-bottom: 0.5rem;
}

.career-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.career-tag {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background: white;
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 9999px;
  font-size: 0.75rem;
  color: #6d28d9;
  font-weight: 500;
  transition: all 0.2s ease;
}

.career-tag:hover {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.3);
}

/* ===== 成长建议 ===== */
.growth-sections {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.growth-card {
  background: #f8fafc;
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.growth-card:hover {
  border-color: #cbd5e1;
}

.growth-card-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1rem;
}

.growth-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.growth-card--enhance .growth-icon { color: #3b82f6; }
.growth-card--improve .growth-icon { color: #10b981; }

.growth-card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

.growth-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.growth-item {
  display: flex;
  gap: 0.875rem;
  padding: 1rem;
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.growth-item:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.growth-item-number {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}

.growth-item-number--blue {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(96, 165, 250, 0.2) 100%);
  color: #2563eb;
}

.growth-item-number--green {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.2) 100%);
  color: #059669;
}

.growth-item-content {
  flex: 1;
  min-width: 0;
}

.growth-item-area {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.375rem;
}

.growth-item-how {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.growth-item-frequency {
  display: inline-block;
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  background: rgba(59, 130, 246, 0.08);
  color: #3b82f6;
  border-radius: 9999px;
  font-weight: 500;
}

/* ===== 亲子活动 ===== */
.family-activity-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(52, 211, 153, 0.08) 100%);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.family-activity-card:hover {
  box-shadow: 0 8px 24px -8px rgba(16, 185, 129, 0.2);
}

.family-icon {
  width: 2rem;
  height: 2rem;
  color: #059669;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.family-title {
  font-weight: 700;
  color: #065f46;
  margin-bottom: 0.625rem;
}

.family-activities {
  list-style: disc;
  list-style-position: inside;
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.family-activities li::marker {
  color: #10b981;
}

/* ===== 注意事项 ===== */
.attention-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.08) 0%, rgba(249, 115, 22, 0.1) 100%);
  border: 1px solid rgba(251, 146, 60, 0.25);
  border-radius: 1rem;
}

.attention-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #ea580c;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.attention-title {
  font-weight: 700;
  color: #c2410c;
  font-size: 0.9375rem;
  margin-bottom: 0.5rem;
}

.attention-list {
  list-style: disc;
  list-style-position: inside;
  font-size: 0.8125rem;
  color: rgba(194, 65, 12, 0.85);
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.attention-list li::marker {
  color: #ea580c;
}
</style>
