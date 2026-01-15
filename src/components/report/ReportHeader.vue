<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  profile: {
    name: string
    age: number
    gender: string
    ageGroup: string
  }
}

const props = defineProps<Props>()

const genderIcon = computed(() => {
  return props.profile.gender === 'male' ? 'male' : props.profile.gender === 'female' ? 'female' : 'child'
})

const genderText = computed(() => {
  return props.profile.gender === 'male' ? '男生' : props.profile.gender === 'female' ? '女生' : '未知'
})

const ageGroupText = computed(() => {
  const map: Record<string, string> = {
    young: '低年级 (7-9岁)',
    middle: '高年级 (10-12岁)',
    teen: '初中 (13-15岁)'
  }
  return map[props.profile.ageGroup] || props.profile.ageGroup
})

const currentDate = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})
</script>

<template>
  <div class="report-header">
    <div class="header-top">
      <div class="header-info">
        <h1 class="report-title">
          儿童发展潜力评估报告
          
        </h1>
        <p class="report-date">
          <svg class="date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          测评时间：{{ currentDate }}
        </p>
      </div>
      <div class="brand-logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
        </div>
        <div class="brand-name">童智星探</div>
      </div>
    </div>

    <!-- 基础信息卡片 -->
    <div class="profile-cards">
      <div class="profile-card">
        <div class="card-icon card-icon--name">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="card-content">
          <span class="card-label">姓名</span>
          <span class="card-value">{{ profile.name }}</span>
        </div>
      </div>
      
      <div class="profile-card">
        <div class="card-icon card-icon--age">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="card-content">
          <span class="card-label">年龄</span>
          <span class="card-value">{{ profile.age }}岁</span>
        </div>
      </div>
      
      <div class="profile-card">
        <div class="card-icon card-icon--gender">
          <!-- 男生图标 -->
          <svg v-if="genderIcon === 'male'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="10" cy="14" r="5"/>
            <line x1="19" y1="5" x2="13.5" y2="10.5"/>
            <line x1="19" y1="5" x2="14" y2="5"/>
            <line x1="19" y1="5" x2="19" y2="10"/>
          </svg>
          <!-- 女生图标 -->
          <svg v-else-if="genderIcon === 'female'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="8" r="5"/>
            <line x1="12" y1="13" x2="12" y2="21"/>
            <line x1="9" y1="18" x2="15" y2="18"/>
          </svg>
          <!-- 默认图标 -->
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a4 4 0 0 1 4 4v1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2V6a4 4 0 0 1 4-4z"/>
            <circle cx="9" cy="9" r="1" fill="currentColor"/>
            <circle cx="15" cy="9" r="1" fill="currentColor"/>
          </svg>
        </div>
        <div class="card-content">
          <span class="card-label">性别</span>
          <span class="card-value">{{ genderText }}</span>
        </div>
      </div>
      
      <div class="profile-card">
        <div class="card-icon card-icon--group">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="card-content">
          <span class="card-label">年龄组</span>
          <span class="card-value">{{ ageGroupText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.report-header {
  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 1.25rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 10px 15px -3px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  padding: 2rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.report-header:hover {
  box-shadow: 
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 20px 40px -10px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.6) inset;
}

.header-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.75rem;
}

.report-title {
  font-size: 1.875rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.enhanced-badge {
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.report-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.9375rem;
}

.date-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.brand-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
  transition: all 0.3s ease;
}

.logo-icon:hover {
  transform: scale(1.05) rotate(5deg);
}

.logo-icon svg {
  width: 2rem;
  height: 2rem;
  color: white;
}

.brand-name {
  font-size: 0.875rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 个人信息卡片 */
.profile-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%);
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid rgba(226, 232, 240, 0.6);
}

@media (max-width: 768px) {
  .profile-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .profile-cards {
    grid-template-columns: 1fr;
  }
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem;
  background: white;
  border-radius: 0.75rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.2s ease;
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.card-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.card-icon--name {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(96, 165, 250, 0.2) 100%);
  color: #2563eb;
}

.card-icon--age {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.2) 100%);
  color: #059669;
}

.card-icon--gender {
  background: linear-gradient(135deg, rgba(244, 114, 182, 0.15) 0%, rgba(251, 113, 133, 0.2) 100%);
  color: #db2777;
}

.card-icon--group {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(167, 139, 250, 0.2) 100%);
  color: #7c3aed;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.card-label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

.card-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
