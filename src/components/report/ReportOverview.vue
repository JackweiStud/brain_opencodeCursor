<script setup lang="ts">
import type { IntegratedAssessment } from '@/utils/gameQuestionnaireIntegration'
import { computed } from 'vue'

interface Props {
  integratedAssessment: IntegratedAssessment | null
  ruleAssessment: { avgIntelligence: number; avgCognitive: number; assessment: string }
  aiResult: any | null
  aiLoading: boolean
  showAiTrigger?: boolean
}

const props = defineProps<Props>()
defineEmits<{ (e: 'generate-ai'): void; (e: 'configure-api'): void }>()

const intelligenceScore = computed(() => {
  if (props.integratedAssessment) {
    const scores = Object.values(props.integratedAssessment.integratedScores)
    if (scores.length === 0) return 0
    return Math.round(scores.reduce((sum, item) => sum + item.weightedScore, 0) / scores.length)
  }
  return props.ruleAssessment.avgIntelligence
})

const cognitiveScore = computed(() => {
  if (props.integratedAssessment) {
    const v = props.integratedAssessment.cognitiveValidation
    return Math.round((v.attention.score + v.memory.score + v.logic.score + v.creativity.score) / 4)
  }
  return props.ruleAssessment.avgCognitive
})

const getLevel = (s: number) => s >= 80 ? { t: '优秀', c: 'lvl-ex' } : s >= 60 ? { t: '良好', c: 'lvl-good' } : { t: '需关注', c: 'lvl-att' }
</script>

<template>
  <div class="ov-box">
    <div class="ov-head">
      <h2 class="ov-title">
        <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        快速概览
      </h2>
      <div v-if="showAiTrigger" class="ai-btns">
        <button v-if="!aiResult && !aiLoading" @click="$emit('generate-ai')" class="ai-gen">
          <svg class="ic-s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          生成 AI 深度解读
        </button>
        <button @click="$emit('configure-api')" class="ai-set">
          <svg class="ic-s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.18V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3 15.09V15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 2.36-.64V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0 .64 2.36H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
      </div>
    </div>
    <div class="metrics">
      <div class="m-card m-blue">
        <div class="m-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 1 4 4v1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2V6a4 4 0 0 1 4-4z"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/></svg></div>
        <span class="m-lbl">智能发展指数</span>
        <div class="m-sc"><span class="sc blue">{{ intelligenceScore }}</span><span class="lvl" :class="getLevel(intelligenceScore).c">{{ getLevel(intelligenceScore).t }}</span></div>
      </div>
      <div class="m-card m-green">
        <div class="m-ic green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></div>
        <span class="m-lbl">认知能力指数</span>
        <div class="m-sc"><span class="sc green">{{ cognitiveScore }}</span><span class="lvl" :class="getLevel(cognitiveScore).c">{{ getLevel(cognitiveScore).t }}</span></div>
      </div>
      <div v-if="integratedAssessment" class="m-card" :class="integratedAssessment.overallAssessment.reliabilityLevel.includes('高') ? 'm-green' : 'm-yellow'">
        <div class="m-ic" :class="integratedAssessment.overallAssessment.reliabilityLevel.includes('高') ? 'green' : 'yellow'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg></div>
        <span class="m-lbl">评估可靠性</span>
        <div class="rel" :class="integratedAssessment.overallAssessment.reliabilityLevel.includes('高') ? 'green' : 'yellow'">{{ integratedAssessment.overallAssessment.reliabilityLevel }}</div>
        <div class="m-hint">基于问卷与游戏一致性</div>
      </div>
    </div>
    <div class="assess">
      <div v-if="aiLoading" class="loading"><svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg><span>AI 正在生成深度解读...</span></div>
      <div class="a-card">
        <div class="a-head">
          <div class="a-ic" :class="aiResult ? 'ai' : 'rule'">
            <svg v-if="aiResult" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 1 4 4v1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2V6a4 4 0 0 1 4-4z"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <span class="a-title">{{ aiResult ? 'AI 综合画像' : '初评结论' }}</span>
        </div>
        <div class="a-content">
          <template v-if="aiResult?.overallSummary">
            <p>{{ aiResult.overallSummary.opening }}</p>
            <p v-if="aiResult.overallSummary.keyHighlight" class="highlight">
              <svg class="ic-s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
              {{ aiResult.overallSummary.keyHighlight }}
            </p>
          </template>
          <template v-else><p>{{ ruleAssessment.assessment }}</p></template>
        </div>
        <div v-if="aiResult?.potentialPrediction?.shortTermVision" class="tags">
          <span class="tag"><svg class="ic-s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>长期潜力大</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ov-box{background:linear-gradient(135deg,rgba(255,255,255,.95),rgba(248,250,252,.95));backdrop-filter:blur(20px);border-radius:1.25rem;border:1px solid rgba(226,232,240,.8);box-shadow:0 4px 6px -1px rgba(0,0,0,.05),0 10px 15px -3px rgba(0,0,0,.08);padding:1.5rem;margin-bottom:1.5rem}
.ov-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem}
.ov-title{font-size:1.25rem;font-weight:700;color:#1e293b;display:flex;align-items:center;gap:.5rem}
.ic{width:1.375rem;height:1.375rem;color:#3b82f6}
.ic-s{width:1rem;height:1rem}
.ai-btns{display:flex;gap:.5rem}
.ai-gen{display:flex;align-items:center;gap:.5rem;padding:.625rem 1rem;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff;border-radius:.75rem;font-size:.875rem;font-weight:600;border:none;cursor:pointer;transition:all .2s;box-shadow:0 2px 8px rgba(59,130,246,.3)}
.ai-gen:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(59,130,246,.4)}
.ai-set{display:flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:.75rem;color:#64748b;cursor:pointer;transition:all .2s}
.ai-set:hover{background:#e2e8f0;color:#475569}
.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.5rem}
@media(max-width:768px){.metrics{grid-template-columns:1fr}}
.m-card{display:flex;flex-direction:column;align-items:center;padding:1.25rem;border-radius:1rem;transition:all .3s}
.m-card:hover{transform:translateY(-4px)}
.m-blue{background:linear-gradient(135deg,rgba(59,130,246,.08),rgba(96,165,250,.12));border:1px solid rgba(59,130,246,.2)}
.m-blue:hover{box-shadow:0 8px 24px -8px rgba(59,130,246,.3)}
.m-green{background:linear-gradient(135deg,rgba(16,185,129,.08),rgba(52,211,153,.12));border:1px solid rgba(16,185,129,.2)}
.m-green:hover{box-shadow:0 8px 24px -8px rgba(16,185,129,.3)}
.m-yellow{background:linear-gradient(135deg,rgba(251,191,36,.08),rgba(245,158,11,.12));border:1px solid rgba(251,191,36,.2)}
.m-ic{width:2.5rem;height:2.5rem;background:#fff;border-radius:.75rem;display:flex;align-items:center;justify-content:center;margin-bottom:.75rem;box-shadow:0 2px 8px rgba(0,0,0,.06)}
.m-ic svg{width:1.25rem;height:1.25rem;color:#3b82f6}
.m-ic.green svg{color:#10b981}
.m-ic.yellow svg{color:#f59e0b}
.m-lbl{font-size:.875rem;color:#64748b;margin-bottom:.5rem}
.m-sc{display:flex;align-items:baseline;gap:.5rem}
.sc{font-size:2.25rem;font-weight:800;line-height:1;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.sc.blue{background:linear-gradient(135deg,#3b82f6,#2563eb)}
.sc.green{background:linear-gradient(135deg,#10b981,#059669)}
.lvl{font-size:.75rem;font-weight:600;padding:.25rem .5rem;border-radius:9999px}
.lvl-ex{background:rgba(16,185,129,.15);color:#059669}
.lvl-good{background:rgba(59,130,246,.15);color:#2563eb}
.lvl-att{background:rgba(251,146,60,.15);color:#ea580c}
.rel{font-size:1.25rem;font-weight:700}
.rel.green{color:#059669}
.rel.yellow{color:#d97706}
.m-hint{font-size:.75rem;color:#94a3b8;margin-top:.25rem}
.assess{position:relative}
.loading{position:absolute;inset:0;background:rgba(255,255,255,.9);backdrop-filter:blur(4px);z-index:10;display:flex;align-items:center;justify-content:center;gap:.75rem;color:#3b82f6;border-radius:1rem}
.spin{width:1.5rem;height:1.5rem;animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.a-card{background:linear-gradient(135deg,rgba(248,250,252,.8),rgba(241,245,249,.8));border:1px solid rgba(226,232,240,.6);border-radius:1rem;padding:1.25rem}
.a-head{display:flex;align-items:center;gap:.625rem;margin-bottom:.875rem}
.a-ic{width:2rem;height:2rem;border-radius:.5rem;display:flex;align-items:center;justify-content:center}
.a-ic svg{width:1.125rem;height:1.125rem}
.a-ic.ai{background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff}
.a-ic.rule{background:#e2e8f0;color:#64748b}
.a-title{font-size:1rem;font-weight:700;color:#1e293b}
.a-content{color:#475569;line-height:1.7}
.a-content p{margin-bottom:.75rem}
.highlight{display:flex;align-items:flex-start;gap:.5rem;font-size:.9375rem;font-weight:600;color:#3b82f6;background:rgba(59,130,246,.08);padding:.75rem 1rem;border-radius:.75rem;border-left:3px solid #3b82f6}
.tags{display:flex;gap:.5rem;margin-top:1rem}
.tag{display:inline-flex;align-items:center;gap:.375rem;padding:.5rem .875rem;background:linear-gradient(135deg,rgba(139,92,246,.1),rgba(124,58,237,.15));color:#7c3aed;font-size:.8125rem;font-weight:600;border-radius:9999px;border:1px solid rgba(139,92,246,.2)}
</style>
