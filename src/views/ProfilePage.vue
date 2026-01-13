<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ClayButton, ClayCard, ProgressBar, AgeSelector } from '../components/common'
import { useProfileStore } from '../stores/profile'

const router = useRouter()
const profileStore = useProfileStore()

const name = ref(profileStore.profile.name || '')
const age = ref(profileStore.profile.age || 0)
const gender = ref<'male' | 'female' | ''>(profileStore.profile.gender || '')

const progress = ref(0)

// 计算进度
const updateProgress = () => {
  let p = 0
  if (name.value) p += 33
  if (age.value > 0) p += 33
  if (gender.value) p += 34
  progress.value = p
}

const handleSubmit = () => {
  if (name.value && age.value > 0 && gender.value) {
    profileStore.setProfile({
      name: name.value,
      age: age.value,
      gender: gender.value
    })
    router.push('/questionnaire')
  }
}
</script>

<template>
  <div class="min-h-screen bg-clay-bg flex flex-col items-center justify-center p-8">
    <ClayCard padding="lg" class="w-full max-w-md">
      <h2 class="font-heading text-3xl text-clay-text mb-6 text-center">信息录入</h2>
      
      <ProgressBar :progress="progress" class="mb-6" />
      
      <!-- 姓名输入 -->
      <div class="mb-6">
        <label class="block font-heading text-lg text-clay-text mb-2">孩子姓名</label>
        <input
          v-model="name"
          @input="updateProgress"
          type="text"
          placeholder="请输入姓名"
          class="w-full px-4 py-3 rounded-clay border-4 border-clay-peach-dark/30 font-body text-clay-text focus:border-clay-peach-dark focus:outline-none transition-colors"
        />
      </div>

      <!-- 年龄选择 -->
      <div class="mb-6">
        <AgeSelector v-model="age" @update:model-value="updateProgress" />
      </div>

      <!-- 性别选择 -->
      <div class="mb-8">
        <label class="block font-heading text-lg text-clay-text mb-2">性别</label>
        <div class="flex gap-4">
          <button
            @click="gender = 'male'; updateProgress()"
            :class="[
              'flex-1 py-3 rounded-clay border-4 font-heading text-lg transition-all',
              gender === 'male' 
                ? 'border-clay-blue bg-clay-blue text-clay-text' 
                : 'border-clay-peach-dark/30 bg-white text-clay-text/70 hover:bg-clay-bg'
            ]"
          >
            👦 男孩
          </button>
          <button
            @click="gender = 'female'; updateProgress()"
            :class="[
              'flex-1 py-3 rounded-clay border-4 font-heading text-lg transition-all',
              gender === 'female' 
                ? 'border-clay-peach bg-clay-peach text-clay-text' 
                : 'border-clay-peach-dark/30 bg-white text-clay-text/70 hover:bg-clay-bg'
            ]"
          >
            👧 女孩
          </button>
        </div>
      </div>

      <!-- 提交按钮 -->
      <ClayButton 
        size="lg" 
        class="w-full"
        :disabled="!name || age === 0 || !gender"
        @click="handleSubmit"
      >
        开始测评 →
      </ClayButton>
    </ClayCard>

    <!-- 返回首页 -->
    <button 
      @click="router.push('/')"
      class="mt-6 text-clay-text/50 hover:text-clay-text font-body transition-colors"
    >
      ← 返回首页
    </button>
  </div>
</template>
