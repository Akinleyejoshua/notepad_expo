import { create } from 'zustand';
import { ToastType } from '../components/toast';

interface ToastState {
  visible: boolean;
  type: ToastType;
  message: string;
  description?: string;
  showToast: (type: ToastType, message: string, description?: string) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  type: 'success',
  message: '',
  description: '',

  showToast: (type, message, description) => 
    set({ visible: true, type, message, description }),

  hideToast: () => 
    set({ visible: false }),
}));

// Export a clean, direct functional wrapper for use outside of components
export const toast = {
  show: (type: ToastType, message: string, description?: string) =>
    useToastStore.getState().showToast(type, message, description),
};