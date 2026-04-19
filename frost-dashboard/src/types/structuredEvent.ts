// types/structuredEvent.ts

export interface StructuredBreakthroughEvent {
  id: string;
  trigger: string;          // What caused this breakthrough?
  insight: string;          // What was understood/learned?
  behavioralChange: string; // What changes concretely?
  domains: Array<'coding' | 'philosophy' | 'collaboration' | 'debugging' | 'architecture' | 'communication' | 'other'>;
  confidence: number;       // 0-1, how confident is this event's impact?
  createdAt: string;
  sourceText?: string;      // Original raw text this was extracted from
  contradicts?: string[];   // IDs of events this contradicts
  iqScore?: number;         // Import Quality Score: behavioral_change_tokens / total_tokens
}

export interface EventPackage {
  schema: 'eventpackage.v1';
  id: string;
  agentId: string;
  agentName: string;
  events: StructuredBreakthroughEvent[];
  createdAt: string;
  totalIQScore: number;     // Average IQS across events
}
