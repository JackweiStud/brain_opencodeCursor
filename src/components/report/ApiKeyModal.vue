<script setup lang="ts">
import { ref, computed } from 'vue'
import { saveApiKey, getApiKey, clearApiKey } from '@/utils/aiAssessment'

interface Props {
  show: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const apiKeyInput = ref('')
const showKey = ref(false)
const isSaving = ref(false)
const error = ref('')

// 检查是否已有 Key
const hasExistingKey = computed(() => !!getApiKey())

// 显示已保存的 Key（部分隐藏）
const maskedExistingKey = computed(() => {
  const key = getApiKey()
  if (key && key.length > 10) {
    return key.substring(0, 6) + '***' + key.substring(key.length - 4)
  }
  return key || ''
})

// 保存 API Key
const handleSave = () => {
  const key = apiKeyInput.value.trim()
  
  if (!key) {
    error.value = '请输入 API Key'
    return
  }
  
  if (!key.startsWith('AIza')) {
    error.value = 'API Key 格式不正确，应以 AIza 开头'
    return
  }
  
  isSaving.value = true
  error.value = ''
  
  try {
    saveApiKey(key)
    apiKeyInput.value = ''
    emit('saved')
    emit('close')
  } catch (e) {
    error.value = '保存失败，请重试'
  } finally {
    isSaving.value = false
  }
}

// 清除 API Key
const handleClear = () => {
  if (confirm('确定要清除已保存的 API Key 吗？')) {
    clearApiKey()
    emit('close')
  }
}

// 关闭弹窗
const handleClose = () => {
  apiKeyInput.value = ''
  error.value = ''
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="handleClose"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <!-- 头部 -->
          <div class="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
            <h2 class="font-heading text-xl text-white flex items-center gap-2">
              <span>🔑</span>
              <span>配置 Gemini API Key</span>
            </h2>
          </div>

          <!-- 内容 -->
          <div class="p-6">
            <!-- 说明 -->
            <div class="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p class="font-body text-sm text-blue-700">
                AI 综合评价需要使用 Google Gemini API。您可以在
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  class="underline text-blue-600 hover:text-blue-800"
                >
                  Google AI Studio
                </a>
                免费获取 API Key。
              </p>
            </div>

            <!-- 已有 Key 提示 -->
            <div v-if="hasExistingKey" class="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
              <p class="font-body text-sm text-green-700">
                ✅ 已保存 API Key：{{ maskedExistingKey }}
              </p>
              <button
                @click="handleClear"
                class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                清除已保存的 Key
              </button>
            </div>

            <!-- 输入框 -->
            <div class="mb-4">
              <label class="block font-body text-sm text-gray-700 mb-2">
                {{ hasExistingKey ? '更新 API Key' : '输入 API Key' }}
              </label>
              <div class="relative">
                <input
                  v-model="apiKeyInput"
                  :type="showKey ? 'text' : 'password'"
                  placeholder="AIza..."
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
                <button
                  type="button"
                  @click="showKey = !showKey"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {{ showKey ? '👁️' : '🙈' }}
                </button>
              </div>
            </div>

            <!-- 错误提示 -->
            <div v-if="error" class="mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
              <p class="font-body text-sm text-red-700">❌ {{ error }}</p>
            </div>

            <!-- 隐私说明 -->
            <p class="font-body text-xs text-gray-500 mb-4">
              🔒 API Key 仅保存在您的浏览器本地，不会上传到任何服务器。
            </p>
          </div>

          <!-- 底部按钮 -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
            <button
              @click="handleClose"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-body text-gray-700 hover:bg-gray-100 transition-colors"
            >
              取消
            </button>
            <button
              @click="handleSave"
              :disabled="isSaving || !apiKeyInput.trim()"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-body hover:from-blue-600 hover:to-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSaving ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.2s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}
</style>
