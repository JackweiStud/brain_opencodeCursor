<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'success'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
})

const variantStyles = {
  primary: {
    bg: 'var(--color-clay-peach)',
    border: 'var(--color-clay-peach-dark)',
    shadow: 'var(--color-clay-peach-shadow)'
  },
  secondary: {
    bg: 'var(--color-clay-blue)',
    border: '#8BC4D6',
    shadow: '#7AB4C6'
  },
  success: {
    bg: 'var(--color-clay-mint)',
    border: '#7AE07A',
    shadow: '#6AD06A'
  }
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-xl'
}
</script>

<template>
  <button
    :class="[
      'font-heading font-semibold text-clay-text rounded-clay border-4 transition-all duration-200 ease-out cursor-pointer',
      sizeClasses[props.size],
      props.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:translate-x-[2px] hover:translate-y-[2px]'
    ]"
    :style="{
      backgroundColor: variantStyles[props.variant].bg,
      borderColor: variantStyles[props.variant].border,
      boxShadow: props.disabled 
        ? 'none' 
        : `4px 4px 0 0 ${variantStyles[props.variant].shadow}, inset 0 2px 4px rgba(255,255,255,0.5)`
    }"
    :disabled="props.disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
button:hover:not(:disabled) {
  box-shadow: 2px 2px 0 0 var(--tw-shadow-color, currentColor), inset 0 2px 4px rgba(255,255,255,0.5) !important;
}
button:active:not(:disabled) {
  box-shadow: 0 0 0 0 var(--tw-shadow-color, currentColor), inset 0 2px 4px rgba(255,255,255,0.5) !important;
  transform: translate(4px, 4px);
}
</style>
