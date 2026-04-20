import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useApplyStore = create(
  persist(
    (set, get) => ({
      currentStep: 1,
      formData: {
        category: null,
        service: null, 
        company: {
          name: '',
          registrationNumber: '',
          country: '',
          industry: ''
        },
        documents: []
      },

      setStep: (step) => set({ currentStep: step }),

      updateForm: (data) => set((state) => ({ 
        formData: { ...state.formData, ...data } 
      })),

      resetFlow: () => set({ 
        currentStep: 1, 
        formData: { 
          category: null, 
          service: null, 
          company: { name: '', registrationNumber: '', country: '', industry: '' }, 
          documents: [] 
        } 
      })
    }),
    {
      name: 'dice-apply-storage', // name of the item in the storage (must be unique)
      getStorage: () => localStorage, // default is localStorage
    }
  )
);
