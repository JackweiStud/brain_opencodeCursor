<script setup lang="ts">
import { ref, computed } from 'vue'
import { saveApiKey, getApiKey, clearApiKey } from '@/utils/aiAssessment'

interface Props { show: boolean }

defineProps<Props>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'saved'): void }>()

const apiKeyInput = ref('')
const showKey = ref(false)
const isSaving = ref(false)
const error = ref('')

const hasExistingKey = computed(() => !!getApiKey())
const maskedExistingKey = computed(() => {
  const key = getApiKey()
  return key && key.length > 10 ? key.substring(0, 6) + '***' + key.substring(key.length - 4) : key || ''
})

const handleSave = () => {
  const key = apiKeyInput.value.trim()
  if (!key) { error.value = '请输入 API Key'; return }
  if (!key.startsWith('AIza')) { error.value = 'API Key 格式不正确，应以 AIza 开头'; return }
  isSaving.value = true; error.value = ''
  try { saveApiKey(key); apiKeyInput.value = ''; emit('saved'); emit('close') }
  catch { error.value = '保存失败，请重试' }
  finally { isSaving.value = false }
}

const handleClear = () => { if (confirm('确定要清除已保存的 API Key 吗？')) { clearApiKey(); emit('close') } }
const handleClose = () => { apiKeyInput.value = ''; error.value = ''; emit('close') }
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="handleClose">
        <div class="modal-box">
          <div class="modal-head">
            <h2 class="modal-title">
              <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
              配置 Gemini API Key
            </h2>
          </div>
          <div class="modal-body">
            <div class="info-box">
              <svg class="info-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              <p>AI 综合评价需要使用 Google Gemini API。您可以在 <a href="https://aistudio.google.com/app/apikey" target="_blank" class="link">Google AI Studio</a> 免费获取 API Key。</p>
            </div>
            <div v-if="hasExistingKey" class="success-box">
              <svg class="suc-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <div>
                <p>已保存 API Key：{{ maskedExistingKey }}</p>
                <button @click="handleClear" class="clear-btn">清除已保存的 Key</button>
              </div>
            </div>
            <div class="input-group">
              <label class="input-label">{{ hasExistingKey ? '更新 API Key' : '输入 API Key' }}</label>
              <div class="input-wrap">
                <input v-model="apiKeyInput" :type="showKey ? 'text' : 'password'" placeholder="AIza..." class="input-field" />
                <button type="button" @click="showKey = !showKey" class="toggle-btn">
                  <svg v-if="showKey" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
            </div>
            <div v-if="error" class="error-box">
              <svg class="err-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              <p>{{ error }}</p>
            </div>
            <p class="privacy-note">
              <svg class="ic-s" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              API Key 仅保存在您的浏览器本地，不会上传到任何服务器。
            </p>
          </div>
          <div class="modal-foot">
            <button @click="handleClose" class="btn-cancel">取消</button>
            <button @click="handleSave" :disabled="isSaving || !apiKeyInput.trim()" class="btn-save">{{ isSaving ? '保存中...' : '保存' }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(15,23,42,.6);backdrop-filter:blur(4px)}
.modal-box{background:#fff;border-radius:1.25rem;box-shadow:0 25px 50px -12px rgba(0,0,0,.25);width:100%;max-width:28rem;overflow:hidden}
.modal-head{background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:1.25rem 1.5rem}
.modal-title{font-size:1.25rem;font-weight:700;color:#fff;display:flex;align-items:center;gap:.625rem}
.ic{width:1.5rem;height:1.5rem}
.ic-s{width:1rem;height:1rem}
.modal-body{padding:1.5rem}
.info-box{display:flex;align-items:flex-start;gap:.75rem;background:linear-gradient(135deg,rgba(59,130,246,.06),rgba(96,165,250,.1));border:1px solid rgba(59,130,246,.15);border-radius:.75rem;padding:1rem;margin-bottom:1rem}
.info-ic{width:1.25rem;height:1.25rem;color:#3b82f6;flex-shrink:0;margin-top:.125rem}
.info-box p{font-size:.875rem;color:#1e40af;line-height:1.5}
.link{color:#2563eb;text-decoration:underline}
.link:hover{color:#1d4ed8}
.success-box{display:flex;align-items:flex-start;gap:.75rem;background:linear-gradient(135deg,rgba(16,185,129,.06),rgba(52,211,153,.1));border:1px solid rgba(16,185,129,.15);border-radius:.75rem;padding:1rem;margin-bottom:1rem}
.suc-ic{width:1.25rem;height:1.25rem;color:#059669;flex-shrink:0;margin-top:.125rem}
.success-box p{font-size:.875rem;color:#065f46}
.clear-btn{margin-top:.5rem;font-size:.875rem;color:#dc2626;text-decoration:underline;background:none;border:none;cursor:pointer}
.clear-btn:hover{color:#b91c1c}
.input-group{margin-bottom:1rem}
.input-label{display:block;font-size:.875rem;font-weight:500;color:#475569;margin-bottom:.5rem}
.input-wrap{position:relative}
.input-field{width:100%;padding:.875rem 3rem .875rem 1rem;border:1px solid #e2e8f0;border-radius:.75rem;font-family:monospace;font-size:.875rem;transition:all .2s}
.input-field:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.15)}
.toggle-btn{position:absolute;right:.75rem;top:50%;transform:translateY(-50%);background:none;border:none;color:#94a3b8;cursor:pointer;padding:.25rem;transition:color .2s}
.toggle-btn:hover{color:#64748b}
.toggle-btn svg{width:1.25rem;height:1.25rem}
.error-box{display:flex;align-items:center;gap:.5rem;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.15);border-radius:.75rem;padding:.75rem 1rem;margin-bottom:1rem}
.err-ic{width:1rem;height:1rem;color:#dc2626}
.error-box p{font-size:.875rem;color:#dc2626}
.privacy-note{display:flex;align-items:center;gap:.5rem;font-size:.75rem;color:#94a3b8}
.modal-foot{display:flex;gap:.75rem;padding:1rem 1.5rem;background:#f8fafc;border-top:1px solid #e2e8f0}
.btn-cancel{flex:1;padding:.75rem 1rem;background:#fff;border:1px solid #e2e8f0;border-radius:.75rem;font-size:.9375rem;font-weight:500;color:#64748b;cursor:pointer;transition:all .2s}
.btn-cancel:hover{background:#f1f5f9;color:#475569}
.btn-save{flex:1;padding:.75rem 1rem;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border:none;border-radius:.75rem;font-size:.9375rem;font-weight:600;color:#fff;cursor:pointer;transition:all .2s;box-shadow:0 2px 8px rgba(59,130,246,.3)}
.btn-save:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 12px rgba(59,130,246,.4)}
.btn-save:disabled{opacity:.5;cursor:not-allowed}
.modal-enter-active,.modal-leave-active{transition:opacity .2s ease}
.modal-enter-from,.modal-leave-to{opacity:0}
.modal-enter-active .modal-box,.modal-leave-active .modal-box{transition:transform .2s ease}
.modal-enter-from .modal-box,.modal-leave-to .modal-box{transform:scale(.95)}
</style>
