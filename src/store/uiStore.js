import { create } from 'zustand';

export const useUIStore = create((set, get) => ({
  // State
  sidebarOpen: false,
  activeModal: null,
  notifications: [],
  loading: false,

  // Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  openSidebar: () => set({ sidebarOpen: true }),
  
  closeSidebar: () => set({ sidebarOpen: false }),

  openModal: (modalName) => set({ activeModal: modalName }),

  closeModal: () => set({ activeModal: null }),

  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, { ...notification, id: Date.now() }]
  })),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  clearNotifications: () => set({ notifications: [] }),

  setLoading: (loading) => set({ loading }),
}));
