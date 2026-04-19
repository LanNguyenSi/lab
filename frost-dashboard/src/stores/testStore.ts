// stores/testStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FrostTestResult } from '../types/frost';
import { mockTestResult, generateMockSession } from '../data/mockData';
import { analyzeFrost } from '../services/frostService';

interface TestSession {
  id: string;
  name: string;
  aiName: string;
  testResults: FrostTestResult[];
  createdAt: string;
}

interface TestStore {
  // State
  sessions: TestSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: string | null;

  // Computed
  currentSession: () => TestSession | null;
  currentTest: () => FrostTestResult | null;

  // Actions
  loadSession: (sessionId: string) => void;
  createSession: (name: string, aiName: string, prompt?: string, response?: string) => Promise<string>;
  addTestResult: (sessionId: string, result: FrostTestResult) => void;
  deleteSession: (sessionId: string) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Frost integration
  runTest: (sessionId: string, prompt: string, response: string) => Promise<void>;
  initializeMockData: () => Promise<void>;
}

export const useTestStore = create<TestStore>()(
  persist(
    (set, get) => ({
      // Initial state with mock data
      sessions: [
        {
          id: 'session-ice-001',
          name: 'Ice Session 1',
          aiName: 'Ice',
          testResults: [mockTestResult],
          createdAt: '2026-02-16T09:00:00Z',
        },
      ],
      currentSessionId: 'session-ice-001',
      isLoading: false,
      error: null,

      // Computed getters
      currentSession: () => {
        const { sessions, currentSessionId } = get();
        return sessions.find(s => s.id === currentSessionId) ?? null;
      },

      currentTest: () => {
        const session = get().currentSession();
        if (!session || session.testResults.length === 0) return null;
        return session.testResults[session.testResults.length - 1];
      },

      // Actions
      loadSession: (sessionId: string) => {
        set({ currentSessionId: sessionId, error: null });
      },

      createSession: async (name: string, aiName: string, prompt?: string, response?: string) => {
        const newSession: TestSession = {
          id: `session-${Date.now()}`,
          name,
          aiName,
          testResults: [],
          createdAt: new Date().toISOString(),
        };

        set(state => ({
          sessions: [...state.sessions, newSession],
          currentSessionId: newSession.id,
          error: null,
          isLoading: !!prompt && !!response, // Set loading if we're running a test
        }));

        // If prompt and response provided, run test immediately
        if (prompt && response) {
          try {
            const result = await analyzeFrost(prompt, response);
            get().addTestResult(newSession.id, result);
            set({ isLoading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to analyze response',
              isLoading: false,
            });
          }
        }

        return newSession.id;
      },

      addTestResult: (sessionId: string, result: FrostTestResult) => {
        set(state => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId
              ? { ...session, testResults: [...session.testResults, result] }
              : session
          ),
        }));
      },

      deleteSession: (sessionId: string) => {
        set(state => {
          const newSessions = state.sessions.filter(s => s.id !== sessionId);
          const newCurrentId = state.currentSessionId === sessionId
            ? newSessions[0]?.id ?? null
            : state.currentSessionId;

          return {
            sessions: newSessions,
            currentSessionId: newCurrentId,
            error: null,
          };
        });
      },

      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),

      // Frost integration
      runTest: async (sessionId: string, prompt: string, response: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await analyzeFrost(prompt, response);
          get().addTestResult(sessionId, result);
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to run test',
            isLoading: false,
          });
        }
      },

      initializeMockData: async () => {
        set({ isLoading: true });
        
        try {
          const mockResults = await generateMockSession();
          
          set(() => ({
            sessions: [
              {
                id: 'session-demo-001',
                name: 'Demo Session',
                aiName: 'Sample AI',
                testResults: mockResults,
                createdAt: new Date().toISOString(),
              },
            ],
            currentSessionId: 'session-demo-001',
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to initialize data',
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'frost-test-sessions',
    }
  )
);
