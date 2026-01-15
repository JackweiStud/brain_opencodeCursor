<template>
  <div class="report-footer">
    <!-- 免责声明 -->
    <div class="disclaimer">
      <div class="disclaimer-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
      </div>
      <div class="disclaimer-content">
        <h3 class="disclaimer-title">免责声明</h3>
        <p class="disclaimer-text">
          本报告基于儿童的发展潜力和兴趣倾向进行评估，结果仅供参考。
          测评结果不代表儿童的智力水平或未来定论，而是为了帮助家长更好地了解孩子的特点。
          儿童的发展是动态变化的，建议结合实际观察和教育专家的建议进行综合判断。
          如需专业评估或建议，请咨询合格的心理咨询师或教育评估专家。
        </p>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="copyright">
      <div class="brand">
        <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span class="brand-name">童智星探</span>
      </div>
      <p class="copyright-text">© 2026 童智星探 · 儿童发展潜力评估系统（增强版）</p>
    </div>
  </div>
</template>

<style scoped>
.report-footer {
  margin-top: 2.5rem;
}

.disclaimer {
  display: flex;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.9) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.disclaimer-icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, rgba(148, 163, 184, 0.15) 0%, rgba(100, 116, 139, 0.2) 100%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.disclaimer-icon svg {
  width: 1.25rem;
  height: 1.25rem;
  color: #64748b;
}

.disclaimer-content {
  flex: 1;
}

.disclaimer-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #475569;
  margin-bottom: 0.5rem;
}

.disclaimer-text {
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.7;
}

.copyright {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #f59e0b;
}

.brand-name {
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.copyright-text {
  font-size: 0.8125rem;
  color: #94a3b8;
}
</style>
