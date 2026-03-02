import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Spell {
  id: string;
  name: string;
  level: number;
  school?: string;
  casting_time?: string;
  action_type: string; // "Action", "Bonus Action", "Reaction", "Minute", etc.
  range?: string;
  components?: string;
  duration?: string;
  concentration: boolean;
  text: string;
  isCustom?: boolean;
}

interface SpellStore {
  starredSpells: string[];
  customSpells: Spell[];
  spellSlots: Record<number, boolean[]>;
  toggleStar: (spellId: string) => void;
  addCustomSpell: (spell: Spell) => void;
  removeCustomSpell: (spellId: string) => void;
  importData: (data: { starredSpells: string[], customSpells: Spell[], spellSlots?: Record<number, boolean[]> }) => void;
  toggleSpellSlot: (level: number, index: number) => void;
  resetSpellSlots: () => void;
}

const initialSpellSlots: Record<number, boolean[]> = {
  1: [false, false, false, false],
  2: [false, false, false],
  3: [false, false, false],
  4: [false, false, false],
  5: [false, false, false],
  6: [false, false],
  7: [false, false],
  8: [false],
  9: [false],
};

export const useSpellStore = create<SpellStore>()(
  persist(
    (set) => ({
      starredSpells: [],
      customSpells: [],
      spellSlots: initialSpellSlots,
      toggleStar: (spellId) =>
        set((state) => {
          const isStarred = state.starredSpells.includes(spellId);
          return {
            starredSpells: isStarred
              ? state.starredSpells.filter((id) => id !== spellId)
              : [...state.starredSpells, spellId],
          };
        }),
      addCustomSpell: (spell) =>
        set((state) => ({
          customSpells: [...state.customSpells, { ...spell, isCustom: true }],
        })),
      removeCustomSpell: (spellId) =>
        set((state) => ({
          customSpells: state.customSpells.filter((s) => s.id !== spellId),
          starredSpells: state.starredSpells.filter((id) => id !== spellId),
        })),
      importData: (data) =>
        set(() => ({
          starredSpells: data.starredSpells || [],
          customSpells: data.customSpells || [],
          spellSlots: data.spellSlots || initialSpellSlots,
        })),
      toggleSpellSlot: (level, index) =>
        set((state) => {
          const newSlots = { ...state.spellSlots };
          newSlots[level] = [...newSlots[level]];
          newSlots[level][index] = !newSlots[level][index];
          return { spellSlots: newSlots };
        }),
      resetSpellSlots: () =>
        set(() => ({
          spellSlots: initialSpellSlots,
        })),
    }),
    {
      name: 'spellbound-storage', // unique name for local storage key
    }
  )
);
