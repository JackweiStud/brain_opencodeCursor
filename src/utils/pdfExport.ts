import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export interface ExportOptions {
  filename?: string
  quality?: number
  scale?: number
}

/**
 * 等待一段时间
 */
function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 检查并修复 oklab/oklch 颜色
 */
function fixColorProperties(element: HTMLElement): void {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_ELEMENT,
    null
  )

  let el: HTMLElement | null = walker.currentNode as HTMLElement
  while (el) {
    const computed = window.getComputedStyle(el)
    const propertiesToFix = [
      'color',
      'background-color',
      'border-color',
      'border-top-color',
      'border-bottom-color',
      'border-left-color',
      'border-right-color'
    ]

    propertiesToFix.forEach(prop => {
      const value = computed.getPropertyValue(prop)
      if (value && (value.includes('oklab') || value.includes('oklch') || value.includes('color-mix'))) {
        // 设置为安全的默认颜色
        if (prop.includes('background')) {
          const bgValue = computed.getPropertyValue('background-color')
          if (bgValue.includes('rgb') && !bgValue.includes('okl')) {
            el.style.setProperty(prop, bgValue, 'important')
          } else {
            el.style.setProperty(prop, '#ffffff', 'important')
          }
        } else if (prop.includes('border')) {
          el.style.setProperty(prop, '#e5e7eb', 'important')
        } else {
          const colorValue = computed.getPropertyValue('color')
          if (colorValue.includes('rgb') && !colorValue.includes('okl')) {
            el.style.setProperty(prop, colorValue, 'important')
          } else {
            el.style.setProperty(prop, '#111827', 'important')
          }
        }
      }
    })

    el = walker.nextNode() as HTMLElement
  }
}

/**
 * 将 HTML 元素导出为 PDF
 */
export async function exportToPDF(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  const {
    filename = '童智星探-评估报告',
    quality = 0.95,
    scale = 2
  } = options

  try {
    // 等待 ECharts 图表渲染完成
    await wait(1000)

    // 检查元素是否存在
    if (!element || element.children.length === 0) {
      throw new Error('报告内容为空，无法导出')
    }

    // 创建一个克隆元素来处理
    const clone = element.cloneNode(true) as HTMLElement
    clone.style.position = 'absolute'
    clone.style.left = '-9999px'
    clone.style.width = element.scrollWidth + 'px'
    clone.style.background = '#ffffff'
    document.body.appendChild(clone)

    // 修复克隆元素中的颜色
    fixColorProperties(clone)

    // 添加内联样式确保颜色正确
    const styleSheet = document.createElement('style')
    styleSheet.textContent = `
      .bg-white { background-color: #ffffff !important; }
      .bg-blue-50 { background-color: #eff6ff !important; }
      .bg-green-50 { background-color: #f0fdf4 !important; }
      .bg-orange-50 { background-color: #fff7ed !important; }
      .bg-yellow-50 { background-color: #fefce8 !important; }
      .bg-gray-50, .bg-gray-100 { background-color: #f9fafb !important; }
      .text-blue-600, .text-report-primary { color: #2563eb !important; }
      .text-green-600 { color: #16a34a !important; }
      .text-orange-600, .text-orange-700, .text-report-cta { color: #ea580c !important; }
      .text-report-text { color: #1f2937 !important; }
      .border-gray-200, .border-report-border { border-color: #e5e7eb !important; }
    `
    clone.appendChild(styleSheet)

    try {
      // 生成 canvas
      const canvas = await html2canvas(clone, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // 在克隆文档中进一步清理颜色
          const allElements = clonedDoc.querySelectorAll('*')
          allElements.forEach((el: any) => {
            // 移除所有包含 oklch/oklab 的内联样式
            if (el.style) {
              for (let i = el.style.length - 1; i >= 0; i--) {
                const prop = el.style[i]
                const value = el.style.getPropertyValue(prop)
                if (value && (value.includes('oklab') || value.includes('oklch') || value.includes('color-mix'))) {
                  el.style.removeProperty(prop)
                }
              }
            }
          })
        }
      })

      // 计算 PDF 尺寸
      const imgWidth = 210 // A4 宽度 (mm)
      const pageHeight = 297 // A4 高度 (mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      // 创建 PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/jpeg', quality)

      // 添加第一页
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // 如果内容超过一页，添加更多页
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // 保存 PDF
      pdf.save(`${filename}.pdf`)

      console.log('PDF 导出成功:', filename)
    } finally {
      // 移除克隆元素
      document.body.removeChild(clone)
    }
  } catch (error) {
    console.error('PDF 导出失败:', error)
    throw error
  }
}

/**
 * 将 HTML 元素导出为图片
 */
export async function exportToImage(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  const {
    filename = '童智星探-评估报告',
    scale = 2
  } = options

  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#F8FAFC',
      logging: false
    })

    // 创建下载链接
    const link = document.createElement('a')
    link.download = `${filename}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (error) {
    console.error('图片导出失败:', error)
    throw error
  }
}
