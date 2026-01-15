<script setup lang="ts">
import { computed } from 'vue'
import { getIntelligenceChineseName } from '@/utils/gameQuestionnaireIntegration'
import { intelligenceTypesEnhanced } from '@/data/intelligenceQuestionsEnhanced'

interface Props {
  integratedScores: Record<string, { questionnaireScore: number; gameScore: number; weightedScore: number; confidence: 'high' | 'medium' | 'low' }>
  hideHeader?: boolean
}

const props = defineProps<Props>()

const sortedScores = computed(() => {
  return Object.entries(props.integratedScores)
    .sort(([, a], [, b]) => b.weightedScore - a.weightedScore)
    .map(([key, data]) => ({ key, type: intelligenceTypesEnhanced.find(t => t.key === key), ...data }))
})

const confCfg = {
  high: { text: '高', color: 'conf-h', icon: '✓' },
  medium: { text: '中', color: 'conf-m', icon: '~' },
  low: { text: '低', color: 'conf-l', icon: '-' }
}

const getScoreColor = (s: number) => s >= 75 ? 'sc-green' : s >= 50 ? 'sc-yellow' : 'sc-gray'
const getRankClass = (i: number) => ['rank-gold', 'rank-silver', 'rank-bronze'][i] || 'rank-bronze'
</script>

<template>
  <div :class="hideHeader ? 'p-6' : 'isc-box'">
    <h2 v-if="!hideHeader" class="isc-title">
      <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
      综合智能评分
    </h2>

    <div class="info-box">
      <svg class="info-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
      <p><b>综合评分说明：</b>综合评分结合了问卷自评和游戏测试结果。当两者一致时，游戏验证会提高评分的置信度。</p>
    </div>

    <div class="top3">
      <h3 class="sub-title">
        <svg class="ic-s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        综合优势 TOP3
      </h3>
      <div class="top3-list">
        <span v-for="(item, i) in sortedScores.slice(0, 3)" :key="item.key" class="top3-item" :class="getRankClass(i)">
          <span class="rank-num">#{{ i + 1 }}</span>
          {{ getIntelligenceChineseName(item.key) }}
          <span class="top3-sc">{{ item.weightedScore }}</span>
        </span>
      </div>
    </div>

    <div class="score-list">
      <div v-for="item in sortedScores" :key="item.key" class="score-card">
        <div class="sc-head">
          <div class="sc-name">
            <div class="sc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></div>
            <span>{{ getIntelligenceChineseName(item.key) }}</span>
          </div>
          <div class="sc-right">
            <span class="conf" :class="confCfg[item.confidence].color">{{ confCfg[item.confidence].icon }} 置信度{{ confCfg[item.confidence].text }}</span>
            <span class="sc-val" :class="getScoreColor(item.weightedScore)">{{ item.weightedScore }}</span>
          </div>
        </div>
        <div class="bars">
          <div class="bar-row"><span class="bar-lbl">问卷 {{ item.questionnaireScore }}</span><span class="bar-mid">综合评分</span><span class="bar-lbl">游戏 {{ item.gameScore }}</span></div>
          <div class="bar-track">
            <div class="bar-q" :style="{ width: `${item.questionnaireScore * 0.6}%` }"></div>
            <div class="bar-g" :style="{ width: `${item.gameScore * 0.4}%` }"></div>
          </div>
          <div class="bar-ind" :style="{ left: `${item.weightedScore}%` }"></div>
        </div>
        <p class="sc-note">{{ item.gameScore > 0 ? `问卷自评 ${item.questionnaireScore}分 + 游戏验证 ${item.gameScore}分` : '仅问卷自评（该类型暂无对应游戏测试）' }}</p>
      </div>
    </div>

    <div class="legend">
      <div class="leg-item"><div class="leg-dot bg-blue"></div><span>问卷自评</span></div>
      <div class="leg-item"><div class="leg-dot bg-purple"></div><span>游戏验证</span></div>
      <div class="leg-item"><div class="leg-line"></div><span>综合评分</span></div>
    </div>
  </div>
</template>

<style scoped>
.isc-box{background:linear-gradient(135deg,rgba(255,255,255,.95),rgba(248,250,252,.95));backdrop-filter:blur(20px);border-radius:1.25rem;border:1px solid rgba(226,232,240,.8);box-shadow:0 4px 6px -1px rgba(0,0,0,.05),0 10px 15px -3px rgba(0,0,0,.08);padding:1.5rem;margin-bottom:1.5rem}
.isc-title{font-size:1.25rem;font-weight:700;color:#1e293b;display:flex;align-items:center;gap:.5rem;margin-bottom:1rem}
.ic{width:1.375rem;height:1.375rem;color:#3b82f6}
.ic-s{width:1rem;height:1rem}
.info-box{display:flex;align-items:flex-start;gap:.75rem;background:linear-gradient(135deg,rgba(59,130,246,.06),rgba(96,165,250,.1));border:1px solid rgba(59,130,246,.15);border-radius:.75rem;padding:1rem;margin-bottom:1rem}
.info-ic{width:1.25rem;height:1.25rem;color:#3b82f6;flex-shrink:0;margin-top:.125rem}
.info-box p{font-size:.875rem;color:#1e40af;line-height:1.5}
.info-box b{font-weight:600}
.top3{margin-bottom:1rem}
.sub-title{font-size:.875rem;font-weight:600;color:#475569;display:flex;align-items:center;gap:.375rem;margin-bottom:.625rem}
.sub-title svg{color:#f59e0b}
.top3-list{display:flex;flex-wrap:wrap;gap:.5rem}
.top3-item{display:inline-flex;align-items:center;gap:.5rem;padding:.5rem .875rem;border-radius:.625rem;font-size:.875rem;font-weight:500;transition:all .2s}
.top3-item:hover{transform:translateY(-2px)}
.rank-num{font-weight:700;font-size:.75rem}
.rank-gold{background:linear-gradient(135deg,rgba(251,191,36,.15),rgba(245,158,11,.2));border:1px solid rgba(251,191,36,.3);color:#92400e}
.rank-silver{background:linear-gradient(135deg,rgba(148,163,184,.15),rgba(203,213,225,.2));border:1px solid rgba(148,163,184,.3);color:#475569}
.rank-bronze{background:linear-gradient(135deg,rgba(251,146,60,.15),rgba(234,88,12,.2));border:1px solid rgba(251,146,60,.3);color:#9a3412}
.top3-sc{font-weight:700}
.score-list{display:flex;flex-direction:column;gap:.75rem}
.score-card{background:#fff;border:1px solid rgba(226,232,240,.8);border-radius:.875rem;padding:1rem;transition:all .2s}
.score-card:hover{border-color:#cbd5e1;box-shadow:0 4px 12px rgba(0,0,0,.04)}
.sc-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem}
.sc-name{display:flex;align-items:center;gap:.5rem;font-size:.9375rem;font-weight:600;color:#334155}
.sc-icon{width:1.75rem;height:1.75rem;background:linear-gradient(135deg,rgba(59,130,246,.1),rgba(96,165,250,.15));border-radius:.375rem;display:flex;align-items:center;justify-content:center}
.sc-icon svg{width:1rem;height:1rem;color:#3b82f6}
.sc-right{display:flex;align-items:center;gap:.625rem}
.conf{font-size:.6875rem;padding:.25rem .5rem;border-radius:9999px;font-weight:600}
.conf-h{background:rgba(16,185,129,.12);color:#059669}
.conf-m{background:rgba(245,158,11,.12);color:#d97706}
.conf-l{background:rgba(148,163,184,.12);color:#64748b}
.sc-val{font-size:1.25rem;font-weight:800}
.sc-green{color:#059669}
.sc-yellow{color:#d97706}
.sc-gray{color:#64748b}
.bars{position:relative;margin-bottom:.5rem}
.bar-row{display:flex;align-items:center;font-size:.6875rem;color:#94a3b8;margin-bottom:.375rem}
.bar-lbl{width:4rem}
.bar-mid{flex:1;text-align:center}
.bar-track{height:.625rem;background:#f1f5f9;border-radius:9999px;overflow:hidden;display:flex}
.bar-q{background:linear-gradient(90deg,#3b82f6,#60a5fa);height:100%;border-radius:9999px 0 0 9999px;transition:width .5s}
.bar-g{background:linear-gradient(90deg,#8b5cf6,#a78bfa);height:100%;transition:width .5s}
.bar-ind{position:absolute;top:.875rem;width:2px;height:.5rem;background:#1e293b;border-radius:1px;transition:left .5s}
.sc-note{font-size:.75rem;color:#94a3b8}
.legend{display:flex;align-items:center;gap:1.25rem;padding-top:1rem;margin-top:1rem;border-top:1px solid rgba(226,232,240,.6)}
.leg-item{display:flex;align-items:center;gap:.375rem;font-size:.75rem;color:#64748b}
.leg-dot{width:.75rem;height:.75rem;border-radius:.25rem}
.bg-blue{background:linear-gradient(135deg,#3b82f6,#60a5fa)}
.bg-purple{background:linear-gradient(135deg,#8b5cf6,#a78bfa)}
.leg-line{width:2px;height:.625rem;background:#1e293b;border-radius:1px}
</style>
