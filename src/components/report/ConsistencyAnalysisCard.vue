<script setup lang="ts">
import { computed } from 'vue'
import { getIntelligenceChineseName, getConsistencyInterpretation, getConsistencyColor } from '@/utils/gameQuestionnaireIntegration'

interface Props {
  consistency: {
    overall: number
    byDimension: Record<string, { questionnaireScore: number; gameScore: number; consistency: number; gap: number; interpretation: string }>
    reliableDimensions: string[]
    alertDimensions: string[]
  }
  hideHeader?: boolean
}

const props = defineProps<Props>()

const sortedDimensions = computed(() => Object.entries(props.consistency.byDimension).sort(([, a], [, b]) => b.consistency - a.consistency))

const overallLevel = computed(() => {
  const s = props.consistency.overall
  if (s >= 70) return { text: '高度一致', cls: 'lvl-high' }
  if (s >= 50) return { text: '基本一致', cls: 'lvl-mid' }
  return { text: '存在差异', cls: 'lvl-low' }
})

const getBarWidth = (s: number) => `${Math.min(100, s)}%`
</script>

<template>
  <div :class="hideHeader ? 'p-6' : 'cac-box'">
    <h2 v-if="!hideHeader" class="cac-title">
      <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      问卷-游戏一致性分析
    </h2>

    <div class="overall" :class="overallLevel.cls">
      <div class="ov-left">
        <span class="ov-lbl">总体一致性</span>
        <p class="ov-val">{{ consistency.overall }}%</p>
      </div>
      <div class="ov-right">
        <span class="ov-badge">{{ overallLevel.text }}</span>
      </div>
      <p class="ov-desc">
        <template v-if="consistency.overall >= 70">
          <svg class="ic-s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          问卷自评与游戏测试结果高度吻合，评估结果可信度高
        </template>
        <template v-else-if="consistency.overall >= 50">
          <svg class="ic-s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          问卷与游戏结果基本一致，部分维度存在正常差异
        </template>
        <template v-else>
          <svg class="ic-s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          问卷自评与实际表现差异较大，建议结合两者综合解读
        </template>
      </p>
    </div>

    <div v-if="consistency.reliableDimensions.length > 0" class="dims">
      <h3 class="dim-title reliable">
        <svg class="ic-s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        可信维度（两者一致）
      </h3>
      <div class="dim-tags">
        <span v-for="dim in consistency.reliableDimensions" :key="dim" class="dim-tag reliable">{{ getIntelligenceChineseName(dim) }}</span>
      </div>
    </div>

    <div v-if="consistency.alertDimensions.length > 0" class="dims">
      <h3 class="dim-title alert">
        <svg class="ic-s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        需关注维度（存在差异）
      </h3>
      <div class="dim-tags">
        <span v-for="dim in consistency.alertDimensions" :key="dim" class="dim-tag alert">{{ getIntelligenceChineseName(dim) }}</span>
      </div>
    </div>

    <div class="detail">
      <h3 class="det-title">
        <svg class="ic-s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        维度详细对比
      </h3>
      <div class="det-list">
        <div v-for="[key, data] in sortedDimensions" :key="key" class="det-card">
          <div class="det-head">
            <span class="det-name">{{ getIntelligenceChineseName(key) }}</span>
            <span class="det-badge" :style="{ backgroundColor: getConsistencyColor(data.consistency) + '20', color: getConsistencyColor(data.consistency) }">
              {{ getConsistencyInterpretation(data.consistency) }} ({{ data.consistency }}%)
            </span>
          </div>
          <div class="bars">
            <div class="bar-row"><span class="bar-lbl">问卷</span><div class="bar-track"><div class="bar-q" :style="{ width: getBarWidth(data.questionnaireScore) }"></div></div><span class="bar-val">{{ data.questionnaireScore }}</span></div>
            <div class="bar-row"><span class="bar-lbl">游戏</span><div class="bar-track"><div class="bar-g" :style="{ width: getBarWidth(data.gameScore) }"></div></div><span class="bar-val">{{ data.gameScore }}</span></div>
          </div>
          <p class="det-note">{{ data.interpretation }} <span :class="data.gap > 30 ? 'gap-alert' : 'gap-normal'">(差距: {{ data.gap }}分)</span></p>
        </div>
      </div>
    </div>

    <div class="legend">
      <div class="leg-item"><div class="leg-dot bg-blue"></div><span>问卷自评分数</span></div>
      <div class="leg-item"><div class="leg-dot bg-purple"></div><span>游戏测试分数</span></div>
    </div>
  </div>
</template>

<style scoped>
.cac-box{background:linear-gradient(135deg,rgba(255,255,255,.95),rgba(248,250,252,.95));backdrop-filter:blur(20px);border-radius:1.25rem;border:1px solid rgba(226,232,240,.8);box-shadow:0 4px 6px -1px rgba(0,0,0,.05),0 10px 15px -3px rgba(0,0,0,.08);padding:1.5rem;margin-bottom:1.5rem}
.cac-title{font-size:1.25rem;font-weight:700;color:#1e293b;display:flex;align-items:center;gap:.5rem;margin-bottom:1rem}
.ic{width:1.375rem;height:1.375rem;color:#3b82f6}
.ic-s{width:1rem;height:1rem;flex-shrink:0}
.overall{border-radius:1rem;padding:1.25rem;margin-bottom:1rem;display:grid;grid-template-columns:1fr auto;gap:.75rem}
.lvl-high{background:linear-gradient(135deg,rgba(16,185,129,.08),rgba(52,211,153,.12));border:1px solid rgba(16,185,129,.2)}
.lvl-mid{background:linear-gradient(135deg,rgba(251,191,36,.08),rgba(245,158,11,.12));border:1px solid rgba(251,191,36,.2)}
.lvl-low{background:linear-gradient(135deg,rgba(239,68,68,.08),rgba(248,113,113,.12));border:1px solid rgba(239,68,68,.2)}
.ov-lbl{font-size:.875rem;color:#64748b}
.ov-val{font-size:2rem;font-weight:800;margin-top:.25rem}
.lvl-high .ov-val{color:#059669}
.lvl-mid .ov-val{color:#d97706}
.lvl-low .ov-val{color:#dc2626}
.ov-badge{display:inline-flex;padding:.5rem 1rem;border-radius:9999px;font-size:.875rem;font-weight:600}
.lvl-high .ov-badge{background:rgba(16,185,129,.15);color:#059669}
.lvl-mid .ov-badge{background:rgba(251,191,36,.15);color:#d97706}
.lvl-low .ov-badge{background:rgba(239,68,68,.15);color:#dc2626}
.ov-desc{grid-column:1/-1;display:flex;align-items:center;gap:.5rem;font-size:.875rem;color:#64748b;margin-top:.5rem}
.dims{margin-bottom:1rem}
.dim-title{font-size:.875rem;font-weight:600;display:flex;align-items:center;gap:.375rem;margin-bottom:.5rem}
.dim-title.reliable{color:#059669}
.dim-title.alert{color:#ea580c}
.dim-tags{display:flex;flex-wrap:wrap;gap:.375rem}
.dim-tag{padding:.375rem .75rem;border-radius:9999px;font-size:.8125rem;font-weight:500}
.dim-tag.reliable{background:rgba(16,185,129,.1);color:#059669;border:1px solid rgba(16,185,129,.2)}
.dim-tag.alert{background:rgba(239,68,68,.1);color:#dc2626;border:1px solid rgba(239,68,68,.2)}
.detail{margin-top:1.5rem}
.det-title{font-size:.875rem;font-weight:600;color:#475569;display:flex;align-items:center;gap:.375rem;margin-bottom:.75rem}
.det-title svg{color:#3b82f6}
.det-list{display:flex;flex-direction:column;gap:.75rem}
.det-card{background:#fff;border:1px solid rgba(226,232,240,.8);border-radius:.875rem;padding:1rem;transition:all .2s}
.det-card:hover{border-color:#cbd5e1;box-shadow:0 4px 12px rgba(0,0,0,.04)}
.det-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem}
.det-name{font-size:.9375rem;font-weight:600;color:#334155}
.det-badge{font-size:.6875rem;padding:.25rem .625rem;border-radius:9999px;font-weight:600}
.bars{display:flex;flex-direction:column;gap:.5rem}
.bar-row{display:flex;align-items:center;gap:.5rem}
.bar-lbl{width:2.5rem;font-size:.75rem;color:#94a3b8}
.bar-track{flex:1;height:.625rem;background:#f1f5f9;border-radius:9999px;overflow:hidden}
.bar-q{background:linear-gradient(90deg,#3b82f6,#60a5fa);height:100%;border-radius:9999px;transition:width .5s}
.bar-g{background:linear-gradient(90deg,#8b5cf6,#a78bfa);height:100%;border-radius:9999px;transition:width .5s}
.bar-val{width:2rem;text-align:right;font-size:.75rem;color:#64748b;font-weight:600}
.det-note{font-size:.75rem;color:#94a3b8;margin-top:.5rem}
.gap-alert{color:#dc2626}
.gap-normal{color:#94a3b8}
.legend{display:flex;align-items:center;gap:1.25rem;padding-top:1rem;margin-top:1rem;border-top:1px solid rgba(226,232,240,.6)}
.leg-item{display:flex;align-items:center;gap:.375rem;font-size:.75rem;color:#64748b}
.leg-dot{width:.75rem;height:.75rem;border-radius:9999px}
.bg-blue{background:linear-gradient(135deg,#3b82f6,#60a5fa)}
.bg-purple{background:linear-gradient(135deg,#8b5cf6,#a78bfa)}
</style>
