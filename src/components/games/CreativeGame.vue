<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ClayButton, ClayCard } from '../common'

interface Props {
  round: number  // 当前轮次 1-2
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'complete': [answers: string[], promptInfo: { item: string; question: string; examples: string[]; category: string }]
}>()

// 题目库 - 四大类别
const prompts = [
  // ========== 生活物品类（6题）==========
  {
    item: '📎 回形针',
    question: '回形针除了夹纸，还能用来做什么？',
    examples: ['开锁', '做书签', '挂装饰品', '疏通管道', '做首饰'],
    category: '生活物品'
  },
  {
    item: '🧱 砖头',
    question: '一块砖头可以有哪些用途？',
    examples: ['盖房子', '压纸', '健身器材', '敲核桃', '做凳子'],
    category: '生活物品'
  },
  {
    item: '📰 报纸',
    question: '旧报纸可以用来做什么？',
    examples: ['擦玻璃', '包东西', '折纸', '垫桌子', '做工艺品'],
    category: '生活物品'
  },
  {
    item: '🥤 塑料瓶',
    question: '空塑料瓶可以变成什么？',
    examples: ['花瓶', '存钱罐', '浇水器', '笔筒', '小船'],
    category: '生活物品'
  },
  {
    item: '📦 纸盒',
    question: '快递纸盒可以用来做什么？',
    examples: ['收纳盒', '猫窝', '书架', '垃圾桶', '玩具屋', '画架'],
    category: '生活物品'
  },
  {
    item: '🎈 气球',
    question: '气球除了玩耍装饰，还能用来做什么？',
    examples: ['做压力球', '水枪', '保护手机', '科学实验', '发声器'],
    category: '生活物品'
  },

  // ========== 科学探索类（5题）==========
  {
    item: '🔬 显微镜',
    question: '如果你有一台显微镜，你想观察什么？',
    examples: ['蚂蚁腿', '头发', '树叶细胞', '水滴里的微生物', '糖晶体', '蝴蝶翅膀'],
    category: '科学探索'
  },
  {
    item: '⚡ 电',
    question: '电可以用来做什么？除了照明和驱动机器，还能想到什么？',
    examples: ['治疗疾病', '种植植物', '制造音乐', '烹饪食物', '通讯', '艺术装置'],
    category: '科学探索'
  },
  {
    item: '🧲 磁铁',
    question: '磁铁除了吸铁，还有哪些有趣的用途？',
    examples: ['做指南针', '找钥匙', '磁悬浮', '冰箱贴画', '科学玩具', '发电'],
    category: '科学探索'
  },
  {
    item: '💧 水',
    question: '水除了喝和洗东西，还能用来做什么？',
    examples: ['发电', '灭火', '做实验', '运输船只', '养鱼', '做冰雕', '治病'],
    category: '科学探索'
  },
  {
    item: '🌱 种子',
    question: '一颗种子除了种在土里，还能怎么利用？',
    examples: ['做项链', '喂小鸟', '做画', '观察发芽实验', '做乐器', '榨油'],
    category: '科学探索'
  },

  // ========== 天文宇宙类（5题）==========
  {
    item: '🌙 月亮',
    question: '如果人类可以去月球生活，月球上可以做什么？',
    examples: ['建太空基地', '观星', '采矿', '做实验', '开酒店', '种菜', '拍电影'],
    category: '天文宇宙'
  },
  {
    item: '⭐ 星星',
    question: '看着星星，你能想到哪些与星星有关的事情？',
    examples: ['导航', '许愿', '写诗', '画画', '讲故事', '研究天文', '取名字'],
    category: '天文宇宙'
  },
  {
    item: '🚀 火箭',
    question: '火箭除了把人送上太空，还能用来做什么？',
    examples: ['发射卫星', '运送物资', '太空旅游', '清理太空垃圾', '研究宇宙', '快递'],
    category: '天文宇宙'
  },
  {
    item: '🛸 外星人',
    question: '如果真的遇到外星人，你会和他们做什么？',
    examples: ['交朋友', '学语言', '交换礼物', '一起探险', '问问题', '玩游戏', '分享音乐'],
    category: '天文宇宙'
  },
  {
    item: '🌍 地球',
    question: '如果你是地球的守护者，你会做哪些事情保护地球？',
    examples: ['种树', '清理垃圾', '节约用水', '保护动物', '使用新能源', '宣传环保'],
    category: '天文宇宙'
  },

  // ========== 哲学思辨类（4题）==========
  {
    item: '⏰ 时间',
    question: '如果你能控制时间，你会用它来做什么？',
    examples: ['回到过去', '看未来', '暂停精彩瞬间', '延长快乐时光', '多睡一会', '帮助别人'],
    category: '哲学思辨'
  },
  {
    item: '💭 梦',
    question: '梦是什么？梦可以用来做什么？',
    examples: ['预知未来', '解决问题', '创作灵感', '练习技能', '冒险', '见想见的人'],
    category: '哲学思辨'
  },
  {
    item: '🪞 镜子',
    question: '镜子除了照自己，还能"照"出什么？',
    examples: ['心情', '性格', '未来', '平行世界', '真相', '另一个自己', '回忆'],
    category: '哲学思辨'
  },
  {
    item: '🎁 幸福',
    question: '什么东西可以让人感到幸福？',
    examples: ['家人陪伴', '完成目标', '帮助别人', '学到新知识', '美食', '大自然', '好朋友'],
    category: '哲学思辨'
  }
]

// 游戏状态
const phase = ref<'thinking' | 'result'>('thinking')
const currentPrompt = ref(prompts[0])
const answers = ref<string[]>([])
const currentInput = ref('')
const timeLeft = ref(60)
const timer = ref<number | null>(null)

// 选择题目
const selectPrompt = () => {
  const index = (props.round - 1) % prompts.length
  currentPrompt.value = prompts[index]
}

// 开始游戏
const startGame = () => {
  selectPrompt()
  answers.value = []
  currentInput.value = ''
  timeLeft.value = 60
  phase.value = 'thinking'

  // 启动倒计时
  timer.value = window.setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      finishGame()
    }
  }, 1000)
}

// 添加答案
const addAnswer = () => {
  const answer = currentInput.value.trim()
  if (answer && !answers.value.includes(answer)) {
    answers.value.push(answer)
    currentInput.value = ''
  }
}

// 删除答案
const removeAnswer = (index: number) => {
  answers.value.splice(index, 1)
}

// 完成游戏
const finishGame = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
  phase.value = 'result'
  // 传递答案和题目信息
  emit('complete', [...answers.value], {
    item: currentPrompt.value.item,
    question: currentPrompt.value.question,
    examples: currentPrompt.value.examples,
    category: currentPrompt.value.category
  })
}

// 提前提交
const submitEarly = () => {
  if (answers.value.length >= 3) {
    finishGame()
  }
}

// 格式化时间
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 组件挂载后自动开始游戏
onMounted(() => {
  startGame()
})

// 清理
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <!-- 思考阶段 -->
    <div v-if="phase === 'thinking'">
      <!-- 计时器 -->
      <div class="text-center mb-4">
        <span 
          class="font-heading text-3xl"
          :class="timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-clay-text'"
        >
          {{ formatTime(timeLeft) }}
        </span>
      </div>

      <ClayCard padding="md" class="mb-4">
        <!-- 题目 -->
        <div class="text-center mb-4">
          <span class="text-4xl">{{ currentPrompt.item }}</span>
        </div>
        <p class="font-heading text-lg text-clay-text text-center mb-4">
          {{ currentPrompt.question }}
        </p>

        <!-- 输入框 -->
        <div class="flex gap-2 mb-4">
          <input
            v-model="currentInput"
            @keyup.enter="addAnswer"
            type="text"
            placeholder="输入你的想法..."
            class="flex-1 px-4 py-3 rounded-clay border-4 border-clay-peach-dark/30 font-body text-clay-text focus:border-clay-peach-dark focus:outline-none"
          />
          <ClayButton @click="addAnswer" :disabled="!currentInput.trim()">
            添加
          </ClayButton>
        </div>

        <!-- 已添加的答案 -->
        <div class="space-y-2">
          <div 
            v-for="(answer, index) in answers" 
            :key="index"
            class="flex items-center justify-between bg-clay-mint/20 rounded-clay px-4 py-2"
          >
            <span class="font-body text-clay-text">{{ index + 1 }}. {{ answer }}</span>
            <button 
              @click="removeAnswer(index)"
              class="text-clay-text/50 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        </div>

        <p v-if="answers.length === 0" class="text-center text-clay-text/50 font-body py-4">
          还没有添加答案，快想想吧！
        </p>
      </ClayCard>

      <!-- 提交按钮 -->
      <div class="flex gap-3">
        <ClayButton 
          class="flex-1"
          variant="secondary"
          :disabled="answers.length < 3"
          @click="submitEarly"
        >
          提前提交 ({{ answers.length }}个)
        </ClayButton>
      </div>
      <p class="text-center text-xs text-clay-text/50 mt-2">
        至少需要 3 个答案才能提前提交
      </p>
    </div>

    <!-- 结果阶段 -->
    <div v-else-if="phase === 'result'" class="text-center">
      <ClayCard padding="lg" variant="game">
        <div class="text-5xl mb-4">🎨</div>
        <h3 class="font-heading text-2xl text-clay-text mb-4">
          第 {{ round }} 轮完成！
        </h3>
        
        <div class="space-y-2 mb-6">
          <p class="font-body text-clay-text">
            你想到了 
            <span class="font-heading text-3xl text-clay-peach-dark">{{ answers.length }}</span> 
            个创意！
          </p>
        </div>

        <!-- 答案列表 -->
        <div class="bg-white/50 rounded-clay p-4 text-left mb-4">
          <p class="font-body text-sm text-clay-text/70 mb-2">你的答案:</p>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(answer, index) in answers" 
              :key="index"
              class="px-3 py-1 bg-clay-mint/30 rounded-full font-body text-sm text-clay-text"
            >
              {{ answer }}
            </span>
          </div>
        </div>

        <!-- 参考答案 -->
        <div class="bg-clay-lilac/30 rounded-clay p-4 text-left">
          <p class="font-body text-sm text-clay-text/70 mb-2">💡 参考答案:</p>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(example, index) in currentPrompt.examples" 
              :key="index"
              class="px-3 py-1 bg-white/50 rounded-full font-body text-sm text-clay-text/70"
            >
              {{ example }}
            </span>
          </div>
        </div>
      </ClayCard>
    </div>
  </div>
</template>
