<script setup lang="ts">
interface Props {
  progress: number  // 0-100
  showLabel?: boolean
  color?: 'peach' | 'blue' | 'mint'
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: true,
  color: 'peach'
})

const colorMap = {
  peach: 'var(--color-clay-peach)',
  blue: 'var(--color-clay-blue)',
  mint: 'var(--color-clay-mint)'
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-2" v-if="showLabel">
      <span class="font-body text-sm text-clay-text/70">完成进度</span>
      <span class="font-heading text-sm text-clay-text">{{ progress }}%</span>
    </div>
    <div 
      class="h-4 bg-clay-bg rounded-full border-2 overflow-hidden"
      style="border-color: var(--color-clay-peach-dark);"
    >
      <div
        class="h-full rounded-full transition-all duration-500 ease-out"
        :style="{ 
          width: `${Math.min(100, Math.max(0, progress))}%`,
          backgroundColor: colorMap[props.color]
        }"
      />
    </div>
  </div>
</template>
