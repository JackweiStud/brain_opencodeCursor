<script setup lang="ts">
import { ref, computed } from 'vue'
import { ClayButton, ClayCard } from './index'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'agree': []
  'decline': []
}>()

const agreed = ref(false)

const benefits = [
  { icon: '📊', title: '帮助建立中国儿童常模', desc: '让评估结果更准确、更有参考价值' },
  { icon: '🔬', title: '推动科学教育发展', desc: '为儿童发展研究提供有价值的数据' },
  { icon: '🎁', title: '获得完整测评报告', desc: '参与即可解锁所有评估功能' },
  { icon: '🔒', title: '隐私完全保护', desc: '数据经过脱敏处理，不包含任何个人信息' }
]

const privacyPoints = [
  '仅收集年龄、性别、地区等匿名信息',
  '测评数据经过脱敏处理，无法追溯个人',
  '数据仅用于统计分析，不作其他用途',
  '可随时撤回参与，数据将被删除'
]
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click.self="emit('update:modelValue', false)"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <!-- 标题 -->
          <div class="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4 rounded-t-2xl">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <span class="text-2xl">🙏</span>
              邀请您参与常模数据收集
            </h2>
          </div>

          <!-- 内容 -->
          <div class="p-6 space-y-4">
            <!-- 说明 -->
            <p class="text-gray-700">
              为了让测评结果更准确、更有参考价值，我们正在建立<strong>中国儿童发展常模</strong>。
              您的匿名参与将帮助我们：
            </p>

            <!-- 好处列表 -->
            <div class="grid grid-cols-1 gap-3">
              <div
                v-for="benefit in benefits"
                :key="benefit.title"
                class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <span class="text-2xl">{{ benefit.icon }}</span>
                <div>
                  <h3 class="font-semibold text-gray-800 text-sm">{{ benefit.title }}</h3>
                  <p class="text-xs text-gray-600">{{ benefit.desc }}</p>
                </div>
              </div>
            </div>

            <!-- 隐私保护 -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 class="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <span>🔒</span> 隐私保护承诺
              </h3>
              <ul class="text-xs text-blue-900 space-y-1">
                <li v-for="point in privacyPoints" :key="point" class="flex items-start gap-2">
                  <span class="text-blue-500">✓</span>
                  <span>{{ point }}</span>
                </li>
              </ul>
            </div>

            <!-- 数据预览 -->
            <div class="bg-gray-100 rounded-lg p-4">
              <h3 class="font-semibold text-gray-800 mb-2 text-sm">收集的数据内容：</h3>
              <div class="text-xs text-gray-600 space-y-1">
                <p>• 年龄段（7-9岁 / 10-12岁 / 13-15岁）</p>
                <p>• 性别（男/女/其他）</p>
                <p>• 所在地区（仅记录大区，如华东/华北等）</p>
                <p>• 测评原始分数（多元智能、职业兴趣、认知游戏）</p>
              </div>
              <p class="text-xs text-gray-500 mt-2">
                ⚠️ 不收集姓名、学校、联系方式等任何身份信息
              </p>
            </div>

            <!-- 当前样本量 -->
            <div class="text-center py-2">
              <p class="text-xs text-gray-500">
                当前已收集样本：<span class="font-semibold text-teal-600">{{ 0 }}</span> 例
                <br>
                目标样本量：每个年龄段 ≥ 100 例
              </p>
            </div>
          </div>

          <!-- 底部操作 -->
          <div class="border-t bg-gray-50 px-6 py-4 rounded-b-2xl space-y-3">
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                v-model="agreed"
                type="checkbox"
                class="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <span class="text-sm text-gray-700">
                我已了解数据收集的目的和隐私保护措施，<strong>同意匿名参与</strong>数据收集。
              </span>
            </label>

            <div class="flex gap-3">
              <button
                @click="emit('decline'); emit('update:modelValue', false)"
                class="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                暂不参与
              </button>
              <button
                :disabled="!agreed"
                @click="emit('agree'); emit('update:modelValue', false)"
                class="flex-1 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-green-500 hover:bg-green-600"
              >
                我同意参与
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
