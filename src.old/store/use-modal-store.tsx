import { create } from 'zustand';

type ModalType = 'alert' | 'confirm' | 'prompt';

interface ModalOptions {
  title: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
}

interface ModalState {
  visible: boolean;
  type: ModalType;
  title: string;
  message: string;
  placeholder: string;
  inputValue: string;
  confirmText: string;
  cancelText: string;
  
  // Dynamic action resolvers
  onConfirm: (value?: string) => void;
  onCancel: () => void;
  
  setInputValue: (val: string) => void;
  showAlert: (options: ModalOptions) => void;
  showConfirm: (options: ModalOptions) => Promise<boolean>;
  showPrompt: (options: ModalOptions) => Promise<string | null>;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  visible: false,
  type: 'alert',
  title: '',
  message: '',
  placeholder: '',
  inputValue: '',
  confirmText: 'OK',
  cancelText: 'Cancel',
  onConfirm: () => {},
  onCancel: () => {},

  setInputValue: (inputValue) => set({ inputValue }),

  // 1. ALERT ENGINE
  showAlert: (options) => set({
    visible: true,
    type: 'alert',
    title: options.title,
    message: options.message,
    confirmText: options.confirmText || 'OK',
    onConfirm: () => set({ visible: false }),
  }),

  // 2. CONFIRM ENGINE (Returns a Promise resolving to true/false)
  showConfirm: (options) => {
    return new Promise((resolve) => {
      set({
        visible: true,
        type: 'confirm',
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        onConfirm: () => {
          set({ visible: false });
          resolve(true);
        },
        onCancel: () => {
          set({ visible: false });
          resolve(false);
        }
      });
    });
  },

  // 3. PROMPT ENGINE (Returns a Promise resolving to string or null)
  showPrompt: (options) => {
    return new Promise((resolve) => {
      set({
        visible: true,
        type: 'prompt',
        title: options.title,
        message: options.message,
        placeholder: options.placeholder || 'Type here...',
        inputValue: options.defaultValue || '',
        confirmText: options.confirmText || 'Submit',
        cancelText: options.cancelText || 'Cancel',
        onConfirm: (value) => {
          set({ visible: false });
          resolve(value || '');
        },
        onCancel: () => {
          set({ visible: false });
          resolve(null);
        }
      });
    });
  },

  closeModal: () => set({ visible: false, inputValue: '' })
}));

// Functional singleton wrapper for programmatic calls anywhere
export const dialog = {
  alert: (title: string, message: string, confirmText?: string) => 
    useModalStore.getState().showAlert({ title, message, confirmText }),
    
  confirm: (title: string, message: string, confirmText?: string, cancelText?: string) => 
    useModalStore.getState().showConfirm({ title, message, confirmText, cancelText }),
    
  prompt: (title: string, message: string, placeholder?: string, defaultValue?: string) => 
    useModalStore.getState().showPrompt({ title, message, placeholder, defaultValue }),
};