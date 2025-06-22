import { create } from 'zustand'
import { Theme } from '@/types/game'

interface UIState {
  theme: Theme
  soundEnabled: boolean
  musicEnabled: boolean
  showTutorial: boolean
  activeModal: string | null
  
  // Actions
  setTheme: (theme: Theme) => void
  toggleSound: () => void
  toggleMusic: () => void
  showModal: (modal: string) => void
  hideModal: () => void
  setShowTutorial: (show: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'classic',
  soundEnabled: true,
  musicEnabled: true,
  showTutorial: true,
  activeModal: null,
  
  setTheme: (theme: Theme) => set({ theme }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),
  showModal: (modal: string) => set({ activeModal: modal }),
  hideModal: () => set({ activeModal: null }),
  setShowTutorial: (show: boolean) => set({ showTutorial: show })
})) 