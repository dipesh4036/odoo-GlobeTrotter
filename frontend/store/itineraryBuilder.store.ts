import { create } from 'zustand';

export interface Activity {
  id: string;
  name: string;
  description: string;
  cost: number;
  durationMin: number;
  // Expand as needed based on API
}

export interface Section {
  id: string;
  cityId: string;
  cityName: string;
  startDate: string;
  endDate: string;
  budget: number;
  activities: Activity[];
}

interface ItineraryBuilderState {
  sections: Section[];
  setSections: (sections: Section[]) => void;
  addSection: (section: Section) => void;
  updateSection: (id: string, data: Partial<Section>) => void;
  removeSection: (id: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  reorderActivities: (sectionId: string, fromIndex: number, toIndex: number) => void;
}

export const useItineraryBuilderStore = create<ItineraryBuilderState>((set) => ({
  sections: [],
  
  setSections: (sections) => set({ sections }),
  
  addSection: (section) => 
    set((state) => ({ sections: [...state.sections, section] })),
  
  updateSection: (id, data) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === id ? { ...section, ...data } : section
      ),
    })),
    
  removeSection: (id) =>
    set((state) => ({
      sections: state.sections.filter((section) => section.id !== id),
    })),
    
  reorderSections: (fromIndex, toIndex) =>
    set((state) => {
      const newSections = [...state.sections];
      const [movedSection] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, movedSection);
      return { sections: newSections };
    }),

  reorderActivities: (sectionId, fromIndex, toIndex) =>
    set((state) => {
      return {
        sections: state.sections.map((section) => {
          if (section.id !== sectionId) return section;
          const newActivities = [...(section.activities || [])];
          const [movedActivity] = newActivities.splice(fromIndex, 1);
          newActivities.splice(toIndex, 0, movedActivity);
          return { ...section, activities: newActivities };
        }),
      };
    }),
}));
