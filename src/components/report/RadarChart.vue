<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

interface Props {
  title: string
  data: { name: string; value: number; max?: number }[]
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: '#2563EB'
})

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  
  const indicator = props.data.map(item => ({
    name: item.name,
    max: item.max || 100
  }))

  const values = props.data.map(item => item.value)

  const option: echarts.EChartsOption = {
    title: {
      text: props.title,
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#1E293B'
      }
    },
    radar: {
      indicator,
      shape: 'polygon',
      splitNumber: 5,
      axisName: {
        color: '#64748B',
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: ['#E2E8F0']
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['#F8FAFC', '#F1F5F9']
        }
      },
      axisLine: {
        lineStyle: {
          color: '#E2E8F0'
        }
      }
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: values,
            name: props.title,
            areaStyle: {
              color: echarts.color.modifyAlpha(props.color, 0.2)
            },
            lineStyle: {
              color: props.color,
              width: 2
            },
            itemStyle: {
              color: props.color
            }
          }
        ]
      }
    ]
  }

  chartInstance.setOption(option)
}

// 响应式更新
watch(() => props.data, () => {
  if (chartInstance) {
    initChart()
  }
}, { deep: true })

onMounted(() => {
  initChart()
  
  // 响应窗口变化
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})
</script>

<template>
  <div ref="chartRef" class="w-full h-[300px]"></div>
</template>
