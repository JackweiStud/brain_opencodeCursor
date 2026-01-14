<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue: boolean
  age?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'agree': []
}>()

const agreed = ref(false)

const handleAgree = () => {
  if (agreed.value) {
    emit('agree')
    emit('update:modelValue', false)
  }
}
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
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <!-- 标题 -->
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-t-2xl">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <span class="text-2xl">⚠️</span>
              重要声明与使用须知
            </h2>
          </div>

          <!-- 内容 -->
          <div class="p-6 space-y-4 text-sm text-gray-700">
            <!-- 第一部分：测评性质 -->
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <h3 class="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                <span>🔍</span> 关于本测评的性质
              </h3>
              <p class="text-yellow-900">
                <strong>本测评仅供教育参考和探索娱乐，</strong>不是专业心理诊断或职业规划工具。
                测评结果基于 Howard Gardner 多元智能理论和 John Holland 职业兴趣理论（RIASEC），
                但未经临床验证和标准化程序审定。
              </p>
            </div>

            <!-- 第二部分：结果解读 -->
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <h3 class="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <span>📊</span> 如何理解测评结果
              </h3>
              <ul class="list-disc list-inside space-y-1 text-blue-900">
                <li>结果反映孩子<strong>当前的兴趣倾向和自我认知</strong>，而非固定不变的能力</li>
                <li>儿童处于<strong>快速发展阶段</strong>，测评结果会随年龄和经历变化</li>
                <li>本测评<strong>未建立中国儿童常模</strong>，分数仅作相对比较参考</li>
                <li>游戏化测评仅作为<strong>筛查工具</strong>，不能替代专业认知能力评估</li>
              </ul>
            </div>

            <!-- 第三部分：使用限制 -->
            <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <h3 class="font-bold text-red-800 mb-2 flex items-center gap-2">
                <span>🚫</span> 禁止用于以下用途
              </h3>
              <ul class="list-disc list-inside space-y-1 text-red-900">
                <li><strong>禁止作为入学、分班或选拔依据</strong></li>
                <li><strong>禁止给孩子贴标签或定性评价</strong></li>
                <li><strong>禁止替代专业心理咨询或教育评估</strong></li>
                <li><strong>禁止用于商业目的的资质证明</strong></li>
              </ul>
            </div>

            <!-- 第四部分：专业建议 -->
            <div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
              <h3 class="font-bold text-green-800 mb-2 flex items-center gap-2">
                <span>💡</span> 何时需要寻求专业帮助
              </h3>
              <p class="text-green-900 mb-2">如果出现以下情况，建议咨询专业心理咨询师或教育评估专家：</p>
              <ul class="list-disc list-inside space-y-1 text-green-900">
                <li>孩子表现出明显的学习困难或注意力问题</li>
                <li>需要专业的职业规划或升学指导</li>
                <li>希望获得更深入、更准确的能力评估</li>
                <li>孩子有情绪或行为方面的困扰</li>
              </ul>
            </div>

            <!-- 第五部分：年龄适配说明 -->
            <div class="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
              <h3 class="font-bold text-purple-800 mb-2 flex items-center gap-2">
                <span>👶</span> 关于年龄适配
              </h3>
              <p class="text-purple-900">
                本测评针对 <strong>7-15岁</strong> 儿童设计，分为三个年龄段：
                <span class="font-medium">7-9岁（低龄段）</span>、
                <span class="font-medium">10-12岁（中龄段）</span>、
                <span class="font-medium">13-15岁（青少年段）</span>。
                不同年龄段的题目表述和评估标准有所调整，但仍需家长协助解读。
              </p>
            </div>

            <!-- 第六部分：隐私保护 -->
            <div class="bg-gray-100 border-l-4 border-gray-400 p-4 rounded-r-lg">
              <h3 class="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span>🔒</span> 隐私保护声明
              </h3>
              <p class="text-gray-700">
                所有测评数据仅存储在您的本地设备中，不会上传至任何服务器。
                您可以随时删除或清除这些数据。我们不会收集、存储或分享任何个人信息。
              </p>
            </div>

            <!-- 法律免责 -->
            <div class="border-t pt-4 mt-4">
              <p class="text-xs text-gray-500 leading-relaxed">
                <strong>免责声明：</strong>本测评结果仅供参考，不构成任何专业建议、诊断或承诺。
                使用本测评所产生的任何决策或后果，由使用者自行承担。
                本测评开发者不对因使用本测评而产生的任何直接或间接损失承担责任。
                如有争议，以开发者最终解释为准。
              </p>
            </div>
          </div>

          <!-- 底部操作 -->
          <div class="border-t bg-gray-50 px-6 py-4 rounded-b-2xl">
            <label class="flex items-start gap-3 cursor-pointer mb-4">
              <input
                v-model="agreed"
                type="checkbox"
                class="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700">
                我已仔细阅读并理解以上声明，<strong>同意仅将本测评结果作为教育参考</strong>，
                不将其用于任何正式评估或选拔目的。
              </span>
            </label>

            <button
              :disabled="!agreed"
              class="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :class="agreed ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300'"
              @click="handleAgree"
            >
              我已了解并同意，开始测评
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 自定义滚动条 */
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
