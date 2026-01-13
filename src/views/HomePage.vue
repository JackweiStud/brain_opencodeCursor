<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useProfileStore } from '../stores/profile'

const router = useRouter()
const profileStore = useProfileStore()

const startAssessment = () => {
  router.push('/profile')
}

const continueAssessment = () => {
  // 根据已有数据决定跳转位置
  if (!profileStore.isProfileComplete) {
    router.push('/profile')
  } else {
    router.push('/questionnaire')
  }
}
</script>

<template>
  <div class="min-h-screen bg-clay-bg flex flex-col items-center justify-center p-8">
    <h1 class="font-heading text-5xl text-clay-text mb-4">童智星探</h1>
    <p class="font-body text-xl text-clay-text/70 mb-8 text-center max-w-md">
      发现孩子的无限潜能，科学评估，快乐成长
    </p>
    
    <div class="flex gap-4">
      <button @click="startAssessment" class="clay-button text-xl">
        开始探索 →
      </button>
      
      <button 
        v-if="profileStore.isProfileComplete"
        @click="continueAssessment" 
        class="clay-button text-xl"
        style="background-color: var(--color-clay-blue); border-color: #8BC4D6;"
      >
        继续测评
      </button>
    </div>

    <!-- 调试信息（开发时显示） -->
    <div v-if="profileStore.profile.name" class="mt-8 text-sm text-clay-text/50">
      已有记录: {{ profileStore.profile.name }}
    </div>
  </div>
</template>
