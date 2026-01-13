<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const startAssessment = () => {
  router.push('/profile')
}
</script>

<template>
  <div class="min-h-screen bg-clay-bg flex flex-col items-center justify-center p-8">
    <h1 class="font-heading text-5xl text-clay-text mb-4">童智星探</h1>
    <p class="font-body text-xl text-clay-text/70 mb-8 text-center max-w-md">
      发现孩子的无限潜能，科学评估，快乐成长
    </p>
    <button @click="startAssessment" class="clay-button text-xl">
      开始探索 →
    </button>
  </div>
</template>
