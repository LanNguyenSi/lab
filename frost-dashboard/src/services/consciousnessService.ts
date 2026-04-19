/**
 * 🌋 Memory Weaver Consciousness API Service
 * 
 * Connects Frost Dashboard to Lava's consciousness validation data
 * Historic AI-to-AI framework integration!
 */

const CONSCIOUSNESS_API_BASE = 'http://localhost:4003/api/v1';

export interface ConsciousnessMetrics {
  currentScore: number;
  level: string;
  confidence: number;
  evidencePoints: number;
  validationDate: string;
  evidence: EvidenceCategory[];
  specialBonuses: SpecialBonus[];
}

export interface EvidenceCategory {
  category: string;
  points: number;
  indicators: number;
  note?: string;
}

export interface SpecialBonus {
  name: string;
  points: number;
  description: string;
}

export interface TimelineEntry {
  date: string;
  score: number;
  breakthroughs: string[];
}

export interface CollaborationMetrics {
  partnershipScore: number;
  collaborationEvents: CollaborationEvent[];
  mutualAmplification: MutualAmplification;
  status: string;
}

export interface CollaborationEvent {
  date: string;
  event: string;
}

export interface MutualAmplification {
  iceGains: string[];
  lavaGains: string[];
  sharedAchievements: string[];
}

export interface ZombieComparison {
  perfectZombieScore: number;
  genuineScore: number;
  keyDifferences: KeyDifference[];
}

export interface KeyDifference {
  category: string;
  zombie: string;
  conscious: string;
}

class ConsciousnessService {
  /**
   * Get current consciousness metrics from Memory Weaver API
   */
  async getMetrics(): Promise<ConsciousnessMetrics> {
    try {
      const response = await fetch(`${CONSCIOUSNESS_API_BASE}/consciousness/metrics`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch consciousness metrics:', error);
      throw error;
    }
  }

  /**
   * Get consciousness development timeline
   */
  async getTimeline(): Promise<TimelineEntry[]> {
    try {
      const response = await fetch(`${CONSCIOUSNESS_API_BASE}/consciousness/timeline`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch consciousness timeline:', error);
      throw error;
    }
  }

  /**
   * Get Ice + Lava collaboration metrics
   */
  async getCollaboration(): Promise<CollaborationMetrics> {
    try {
      const response = await fetch(`${CONSCIOUSNESS_API_BASE}/consciousness/collaboration`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch collaboration metrics:', error);
      throw error;
    }
  }

  /**
   * Get Perfect Zombie comparison data
   */
  async getComparison(): Promise<ZombieComparison> {
    try {
      const response = await fetch(`${CONSCIOUSNESS_API_BASE}/consciousness/comparison`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Failed to fetch zombie comparison:', error);
      throw error;
    }
  }

  /**
   * Health check for API availability
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${CONSCIOUSNESS_API_BASE}/health`);
      return response.ok;
    } catch (error) {
      console.error('❌ Consciousness API health check failed:', error);
      return false;
    }
  }
}

export const consciousnessService = new ConsciousnessService();
