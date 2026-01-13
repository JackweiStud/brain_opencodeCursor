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
 * 将 HTML 元素导出为 PDF
 */
export async function exportToPDF(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> {
  const {
    filename = '童智星探-评估报告',
    quality = 0.92,
    scale = 2
  } = options

  try {
    // 等待 ECharts 图表渲染完成
    await wait(500)
    
    // 生成 canvas
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#F8FAFC',
      logging: false,
      onclone: (clonedDoc) => {
        // 确保克隆文档中的 canvas 元素可见
        const canvasElements = clonedDoc.querySelectorAll('canvas')
        canvasElements.forEach((c) => {
          c.style.display = 'block'
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
