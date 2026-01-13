<script setup lang="ts">
interface Props {
  variant?: 'default' | 'highlight' | 'game'
  padding?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md'
})

const variantStyles = {
  default: {
    bg: 'white',
    border: 'var(--color-clay-peach-dark)',
    shadow: 'var(--color-clay-peach-shadow)'
  },
  highlight: {
    bg: 'var(--color-clay-lilac)',
    border: '#D0D0E8',
    shadow: '#C0C0D8'
  },
  game: {
    bg: 'rgba(152, 255, 152, 0.3)',
    border: '#7AE07A',
    shadow: '#6AD06A'
  }
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}
</script>

<template>
  <div
    :class="[
      'rounded-clay-lg border-4',
      paddingClasses[props.padding]
    ]"
    :style="{
      backgroundColor: variantStyles[props.variant].bg,
      borderColor: variantStyles[props.variant].border,
      boxShadow: `6px 6px 0 0 ${variantStyles[props.variant].shadow}, inset 0 2px 4px rgba(255,255,255,0.6)`
    }"
  >
    <slot />
  </div>
</template>
