import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Profile {
  name: string
  age: number
  gender: 'male' | 'female' | ''
  createdAt: string
}

export const useProfileStore = defineStore('profile', () => {
  // State
  const profile = ref<Profile>({
    name: '',
    age: 0,
    gender: '',
    createdAt: ''
  })

  // Getters
  const isProfileComplete = computed(() => {
    return profile.value.name !== '' && 
           profile.value.age > 0 && 
           profile.value.gender !== ''
  })

  const ageGroup = computed(() => {
    const age = profile.value.age
    if (age >= 7 && age <= 9) return 'young'
    if (age >= 10 && age <= 12) return 'middle'
    if (age >= 13 && age <= 15) return 'teen'
    return 'unknown'
  })

  // Actions
  function setProfile(data: Partial<Profile>) {
    profile.value = { 
      ...profile.value, 
      ...data,
      createdAt: new Date().toISOString()
    }
    saveToStorage()
  }

  function resetProfile() {
    profile.value = {
      name: '',
      age: 0,
      gender: '',
      createdAt: ''
    }
    localStorage.removeItem('kidpotential_profile')
  }

  function saveToStorage() {
    localStorage.setItem('kidpotential_profile', JSON.stringify(profile.value))
  }

  function loadFromStorage() {
    const saved = localStorage.getItem('kidpotential_profile')
    if (saved) {
      profile.value = JSON.parse(saved)
    }
  }

  // 初始化时加载
  loadFromStorage()

  return {
    profile,
    isProfileComplete,
    ageGroup,
    setProfile,
    resetProfile,
    loadFromStorage
  }
})
