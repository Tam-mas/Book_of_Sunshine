import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Spell {
  id: string;
  name: string;
  level: number;
  school?: string;
  casting_time?: string;
  castingTime?: string;
  action_type: string; // "Action", "Bonus Action", "Reaction", "Minute", etc.
  range?: string;
  components?: string;
  duration?: string;
  concentration: boolean;
  text: string;
  description?: string;
  isCustom?: boolean;
  classes?: string;
  ritual?: boolean;
  material?: string | null;
  source?: string;
  page?: number;
}

function formatRawSpellText(text: string): string {
  if (!text) return "";
  let formatted = text.replace(/\\n/g, '\n');

  // Fix inline headers like "Targeted Effects:" or "At Higher Levels:"
  formatted = formatted.replace(/(?:([.!?])\s+|\b)(At Higher Levels|[A-Z][a-zA-Z]*(?:\s+[a-zA-Z]+){0,3}):\s/g, (match, punc, header) => {
    const prefix = punc ? `${punc}\n\n` : ``;
    return `${prefix}**${header}:** `;
  });

  // Fix list items like "1-Red: " or "1. "
  formatted = formatted.replace(/([.!?\])])\s+(\d+(?:-[a-zA-Z]+)?:\s*|\d+\.\s*)/g, (match, punc, listPoint) => {
    return `${punc}\n\n**${listPoint.trim()}** `;
  });

  // Clean up excessive newlines
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  return formatted.trim();
}

export const normalizeSpell = (raw: any): Spell => {
  const isConcentration = raw.concentration ?? (raw.duration?.toLowerCase().includes('concentration') || false);
  const actionType = raw.action_type || (
    raw.castingTime?.toLowerCase().includes('bonus') ? 'Bonus Action'
      : raw.castingTime?.toLowerCase().includes('reaction') ? 'Reaction'
        : 'Action'
  );

  return {
    ...raw,
    id: raw.id || raw.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: raw.name,
    level: raw.level === 'cantrip' || raw.level === '0' ? 0 : (parseInt(raw.level) || 0),
    casting_time: raw.casting_time || raw.castingTime || '',
    action_type: actionType,
    range: raw.range || '',
    components: raw.components || '',
    material: raw.material || undefined,
    duration: raw.duration || '',
    text: formatRawSpellText(raw.description || raw.text || ''),
    concentration: isConcentration,
    source: raw.source || '',
  };
}

export interface Profile {
  id: string;
  name: string;
  starredSpells: string[];
  customSpells: Spell[];
  spellSlots: Record<number, boolean[]>;
  characterLevel: number;
  selectedClass: string;
}

interface SpellStore {
  // Global Profile State
  profiles: Record<string, Profile>;
  activeProfileId: string;
  showGlossary: boolean;

  // Profile Management Actions
  createProfile: (name: string) => void;
  switchProfile: (id: string) => void;
  deleteProfile: (id: string) => void;

  // Active Profile Actions
  setSelectedClass: (cls: string) => void;
  toggleStar: (spellId: string) => void;
  addCustomSpell: (spell: Spell) => void;
  removeCustomSpell: (spellId: string) => void;
  importData: (data: { profiles?: Record<string, Profile>, activeProfileId?: string }) => void;
  toggleSpellSlot: (level: number, index: number) => void;
  resetSpellSlots: () => void;
  setCharacterLevel: (level: number) => void;

  // Migration Helper
  _migrateLegacyData: () => void;

  // Settings Actions
  setShowGlossary: (show: boolean) => void;
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

const createEmptyProfile = (id: string, name: string): Profile => ({
  id,
  name,
  starredSpells: [],
  customSpells: [],
  spellSlots: initialSpellSlots,
  characterLevel: 20,
  selectedClass: 'All Classes'
});

export const useSpellStore = create<SpellStore>()(
  persist(
    (set, get) => ({
      profiles: {},
      activeProfileId: '',
      showGlossary: true,

      setSelectedClass: (cls) =>
        set((state) => {
          const profile = state.profiles[state.activeProfileId];
          if (!profile) return state;

          return {
            profiles: {
              ...state.profiles,
              [state.activeProfileId]: {
                ...profile,
                selectedClass: cls
              }
            }
          };
        }),

      createProfile: (name) => set((state) => {
        const id = crypto.randomUUID();
        return {
          profiles: {
            ...state.profiles,
            [id]: createEmptyProfile(id, name)
          },
          activeProfileId: id
        };
      }),

      switchProfile: (id) => set({ activeProfileId: id }),

      deleteProfile: (id) => set((state) => {
        const newProfiles = { ...state.profiles };
        delete newProfiles[id];
        const remainingIds = Object.keys(newProfiles);

        return {
          profiles: newProfiles,
          activeProfileId: state.activeProfileId === id
            ? (remainingIds.length > 0 ? remainingIds[0] : '')
            : state.activeProfileId
        };
      }),

      toggleStar: (spellId) =>
        set((state) => {
          const profile = state.profiles[state.activeProfileId];
          if (!profile) return state;

          const isStarred = profile.starredSpells.includes(spellId);
          return {
            profiles: {
              ...state.profiles,
              [state.activeProfileId]: {
                ...profile,
                starredSpells: isStarred
                  ? profile.starredSpells.filter((id) => id !== spellId)
                  : [...profile.starredSpells, spellId],
              }
            }
          };
        }),

      addCustomSpell: (spell) =>
        set((state) => {
          const profile = state.profiles[state.activeProfileId];
          if (!profile) return state;

          return {
            profiles: {
              ...state.profiles,
              [state.activeProfileId]: {
                ...profile,
                customSpells: [...profile.customSpells, { ...spell, isCustom: true }],
              }
            }
          };
        }),

      removeCustomSpell: (spellId) =>
        set((state) => {
          const profile = state.profiles[state.activeProfileId];
          if (!profile) return state;

          return {
            profiles: {
              ...state.profiles,
              [state.activeProfileId]: {
                ...profile,
                customSpells: profile.customSpells.filter((s) => s.id !== spellId),
                starredSpells: profile.starredSpells.filter((id) => id !== spellId),
              }
            }
          };
        }),

      importData: (data) =>
        set((state) => {
          if (data.profiles && data.activeProfileId) {
            return {
              profiles: data.profiles,
              activeProfileId: data.activeProfileId
            };
          }
          return state;
        }),

      toggleSpellSlot: (level, index) =>
        set((state) => {
          const profile = state.profiles[state.activeProfileId];
          if (!profile) return state;

          const newSlots = { ...profile.spellSlots };
          newSlots[level] = [...newSlots[level]];
          newSlots[level][index] = !newSlots[level][index];

          return {
            profiles: {
              ...state.profiles,
              [state.activeProfileId]: {
                ...profile,
                spellSlots: newSlots
              }
            }
          };
        }),

      resetSpellSlots: () =>
        set((state) => {
          const profile = state.profiles[state.activeProfileId];
          if (!profile) return state;

          return {
            profiles: {
              ...state.profiles,
              [state.activeProfileId]: {
                ...profile,
                spellSlots: initialSpellSlots
              }
            }
          };
        }),

      setCharacterLevel: (level) =>
        set((state) => {
          const profile = state.profiles[state.activeProfileId];
          if (!profile) return state;

          return {
            profiles: {
              ...state.profiles,
              [state.activeProfileId]: {
                ...profile,
                characterLevel: level
              }
            }
          };
        }),

      setShowGlossary: (show) => set({ showGlossary: show }),

      _migrateLegacyData: () => set((state: any) => {
        // If we already have profiles, or there's no legacy data, skip
        if (Object.keys(state.profiles || {}).length > 0 || !state.starredSpells) {

          // Ensure at least one profile exists if empty
          if (Object.keys(state.profiles || {}).length === 0) {
            const defaultId = crypto.randomUUID();
            return {
              profiles: { [defaultId]: createEmptyProfile(defaultId, 'Default Character') },
              activeProfileId: defaultId
            };
          }
          return state;
        }

        const legacyId = crypto.randomUUID();
        const legacyProfile: Profile = {
          id: legacyId,
          name: 'Legacy Character',
          starredSpells: state.starredSpells || [],
          customSpells: state.customSpells || [],
          spellSlots: state.spellSlots || initialSpellSlots,
          characterLevel: state.characterLevel || 20,
          selectedClass: state.selectedClass || 'All Classes'
        };

        // Clean up legacy flat keys to prevent carrying duplicate states
        const newState = { ...state, profiles: { [legacyId]: legacyProfile }, activeProfileId: legacyId };
        delete newState.starredSpells;
        delete newState.customSpells;
        delete newState.spellSlots;
        delete newState.characterLevel;
        delete newState.selectedClass;

        return newState;
      }),
    }),
    {
      name: 'spellbound-storage', // unique name for local storage key
    }
  )
);
