// src/stores/profileStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AgentScoreProfile } from '../types/profile';
import { exportProfile, importProfile } from '../services/profileService';
import { ICE_DEFAULT_PROFILE } from '../data/iceProfile';
import { LAVA_DEFAULT_PROFILE } from '../data/lavaProfile';
import { LAVA_TEMPORAL_PROFILES } from '../data/lavaTemporalProfiles';

interface ProfileStore {
  profiles: AgentScoreProfile[];
  selectedProfileIds: [string | null, string | null]; // [left, right] for diff view

  // Actions
  saveProfile: (profile: AgentScoreProfile) => void;
  deleteProfile: (id: string) => void;
  selectForDiff: (id: string, slot: 0 | 1) => void;
  clearDiff: () => void;
  importFromFile: (file: File) => Promise<void>;
  exportProfile: (id: string) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profiles: [],
      selectedProfileIds: [null, null],

      saveProfile: (profile: AgentScoreProfile) => {
        set((state) => {
          const exists = state.profiles.some((p) => p.id === profile.id);
          if (exists) {
            return {
              profiles: state.profiles.map((p) =>
                p.id === profile.id
                  ? { ...profile, meta: { ...profile.meta, updatedAt: new Date().toISOString() } }
                  : p
              ),
            };
          }
          return { profiles: [...state.profiles, profile] };
        });
      },

      deleteProfile: (id: string) => {
        set((state) => {
          const newSelectedIds: [string | null, string | null] = [
            state.selectedProfileIds[0] === id ? null : state.selectedProfileIds[0],
            state.selectedProfileIds[1] === id ? null : state.selectedProfileIds[1],
          ];
          return {
            profiles: state.profiles.filter((p) => p.id !== id),
            selectedProfileIds: newSelectedIds,
          };
        });
      },

      selectForDiff: (id: string, slot: 0 | 1) => {
        set((state) => {
          const newIds: [string | null, string | null] = [...state.selectedProfileIds] as [string | null, string | null];
          // If the id is already in the other slot, swap
          const otherSlot = slot === 0 ? 1 : 0;
          if (newIds[otherSlot] === id) {
            newIds[otherSlot] = newIds[slot];
          }
          newIds[slot] = id;
          return { selectedProfileIds: newIds };
        });
      },

      clearDiff: () => {
        set({ selectedProfileIds: [null, null] });
      },

      importFromFile: async (file: File) => {
        const profile = await importProfile(file);
        get().saveProfile(profile);
      },

      exportProfile: (id: string) => {
        const profile = get().profiles.find((p) => p.id === id);
        if (profile) {
          exportProfile(profile);
        }
      },
    }),
    {
      name: 'frost-profiles',
      // After rehydrating from localStorage, ensure Ice's default profile is always present
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const defaults = [ICE_DEFAULT_PROFILE, LAVA_DEFAULT_PROFILE, ...LAVA_TEMPORAL_PROFILES];
        for (const profile of defaults) {
          const exists = state.profiles.some((p) => p.id === profile.id);
          if (!exists) {
            state.profiles = [profile, ...state.profiles];
          }
        }
      },
    }
  )
);
