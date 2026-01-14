import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 单次测试历史记录
export interface TestHistoryRecord {
    id: string                      // 唯一ID（时间戳）
    name: string                    // 用户姓名
    age: number                     // 年龄
    gender: string                  // 性别
    ageGroup: string                // 年龄组
    testDate: string                // 测试日期（ISO格式）
    intelligenceScores: Record<string, number>  // 多元智能得分
    interestScores: Record<string, number>      // 职业兴趣得分
    cognitiveScores: {              // 认知能力得分
        attention: number
        memory: number
        logic: number
        creativity: number
    }
}

const STORAGE_KEY = 'kidpotential_history'
const MAX_RECORDS = 20  // 最多保存20条历史记录

export const useTestHistoryStore = defineStore('testHistory', () => {
    // State
    const records = ref<TestHistoryRecord[]>([])

    // Getters
    // 按名字分组的历史记录
    const recordsByName = computed(() => {
        const grouped: Record<string, TestHistoryRecord[]> = {}
        for (const record of records.value) {
            if (!grouped[record.name]) {
                grouped[record.name] = []
            }
            grouped[record.name].push(record)
        }
        // 每组按日期降序排列
        for (const name in grouped) {
            grouped[name].sort((a, b) =>
                new Date(b.testDate).getTime() - new Date(a.testDate).getTime()
            )
        }
        return grouped
    })

    // 获取某个用户的历史记录
    function getHistoryByName(name: string): TestHistoryRecord[] {
        return recordsByName.value[name] || []
    }

    // 获取所有历史记录（按日期降序）
    function getAllHistory(): TestHistoryRecord[] {
        return [...records.value].sort((a, b) =>
            new Date(b.testDate).getTime() - new Date(a.testDate).getTime()
        )
    }

    // Actions
    // 保存测试记录
    function saveTestRecord(record: Omit<TestHistoryRecord, 'id' | 'testDate'>): TestHistoryRecord {
        const newRecord: TestHistoryRecord = {
            ...record,
            id: Date.now().toString(),
            testDate: new Date().toISOString()
        }

        records.value.push(newRecord)

        // 限制记录数量
        if (records.value.length > MAX_RECORDS) {
            // 删除最早的记录
            records.value.sort((a, b) =>
                new Date(a.testDate).getTime() - new Date(b.testDate).getTime()
            )
            records.value = records.value.slice(-MAX_RECORDS)
        }

        saveToStorage()
        return newRecord
    }

    // 删除单条历史
    function deleteHistory(id: string): boolean {
        const index = records.value.findIndex(r => r.id === id)
        if (index !== -1) {
            records.value.splice(index, 1)
            saveToStorage()
            return true
        }
        return false
    }

    // 清空所有历史
    function clearAllHistory() {
        records.value = []
        localStorage.removeItem(STORAGE_KEY)
    }

    // 存储到本地
    function saveToStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records.value))
    }

    // 从本地加载
    function loadFromStorage() {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                records.value = JSON.parse(saved)
            } catch (e) {
                console.error('Failed to load test history:', e)
                records.value = []
            }
        }
    }

    // 初始化时加载
    loadFromStorage()

    return {
        records,
        recordsByName,
        getHistoryByName,
        getAllHistory,
        saveTestRecord,
        deleteHistory,
        clearAllHistory,
        loadFromStorage
    }
})
