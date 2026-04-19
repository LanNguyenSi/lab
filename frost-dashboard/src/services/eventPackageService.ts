// services/eventPackageService.ts
import type { StructuredBreakthroughEvent, EventPackage } from '../types/structuredEvent';

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateEvent(event: StructuredBreakthroughEvent): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!event.id || event.id.trim() === '') issues.push('id is required');
  if (!event.trigger || event.trigger.trim() === '') issues.push('trigger is required');
  if (!event.insight || event.insight.trim() === '') issues.push('insight is required');
  if (!event.behavioralChange || event.behavioralChange.trim() === '')
    issues.push('behavioralChange is required');
  if (!event.domains || event.domains.length === 0)
    issues.push('at least one domain is required');
  if (event.confidence == null) {
    issues.push('confidence is required');
  } else if (event.confidence < 0 || event.confidence > 1) {
    issues.push('confidence must be between 0 and 1');
  }
  if (!event.createdAt || event.createdAt.trim() === '') issues.push('createdAt is required');

  return { valid: issues.length === 0, issues };
}

// ─── Conflict Detection ───────────────────────────────────────────────────────

// Pairs of keywords that imply opposing behavioural philosophies
const CONFLICT_PAIRS: Array<[string, string]> = [
  ['plan first', 'build first'],
  ['test first', 'build first'],
  ['document first', 'code first'],
  ['ask first', 'assume first'],
  ['slow down', 'move fast'],
  ['simplify', 'expand'],
  ['delegate', 'own everything'],
];

function hasKeyword(text: string, keyword: string): boolean {
  return text.toLowerCase().includes(keyword.toLowerCase());
}

function sharesAnyDomain(
  a: StructuredBreakthroughEvent,
  b: StructuredBreakthroughEvent
): string | null {
  for (const domain of a.domains) {
    if (b.domains.includes(domain)) return domain;
  }
  return null;
}

/**
 * Detect conflicting event pairs.
 * Returns [id1, id2, reason] tuples.
 */
export function detectConflicts(
  events: StructuredBreakthroughEvent[]
): Array<[string, string, string]> {
  const conflicts: Array<[string, string, string]> = [];

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i];
      const b = events[j];

      const sharedDomain = sharesAnyDomain(a, b);
      if (!sharedDomain) continue;

      for (const [kw1, kw2] of CONFLICT_PAIRS) {
        const aHas1 = hasKeyword(a.behavioralChange, kw1);
        const aHas2 = hasKeyword(a.behavioralChange, kw2);
        const bHas1 = hasKeyword(b.behavioralChange, kw1);
        const bHas2 = hasKeyword(b.behavioralChange, kw2);

        if ((aHas1 && bHas2) || (aHas2 && bHas1)) {
          const reason = `Both in domain '${sharedDomain}' but behavioralChange conflicts: '${kw1}' vs '${kw2}'`;
          conflicts.push([a.id, b.id, reason]);
          break; // one conflict reason per pair is enough
        }
      }

      // Also honour explicit contradicts lists
      if (a.contradicts?.includes(b.id) || b.contradicts?.includes(a.id)) {
        const reason = `Explicit contradiction declared between events`;
        // Avoid duplicate if already added
        const alreadyAdded = conflicts.some(
          ([x, y]) => (x === a.id && y === b.id) || (x === b.id && y === a.id)
        );
        if (!alreadyAdded) conflicts.push([a.id, b.id, reason]);
      }
    }
  }

  return conflicts;
}

// ─── IQS ─────────────────────────────────────────────────────────────────────

/**
 * Import Quality Score: behavioralChange tokens / sourceText tokens
 * Falls back to 0.5 when sourceText is absent.
 */
export function calculateIQS(event: StructuredBreakthroughEvent): number {
  const bcTokens = event.behavioralChange.split(/\s+/).filter(Boolean).length;
  const srcTokens = event.sourceText?.split(/\s+/).filter(Boolean).length ?? 0;
  if (srcTokens === 0) return 0.5;
  return Math.min(1, bcTokens / srcTokens);
}

// ─── Export / Import ──────────────────────────────────────────────────────────

/**
 * Trigger a browser download of the event package as `.eventpackage.json`.
 */
export function exportEventPackage(pkg: EventPackage): void {
  const json = JSON.stringify(pkg, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${pkg.agentId}-${pkg.id}.eventpackage.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parse and validate an `.eventpackage.json` file uploaded by the user.
 */
export async function importEventPackage(file: File): Promise<EventPackage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const raw = e.target?.result as string;
        const parsed = JSON.parse(raw) as Partial<EventPackage>;

        // Schema validation
        if (parsed.schema !== 'eventpackage.v1') {
          return reject(new Error(`Invalid schema: expected 'eventpackage.v1', got '${parsed.schema}'`));
        }
        if (!parsed.id) return reject(new Error('Missing required field: id'));
        if (!parsed.agentId) return reject(new Error('Missing required field: agentId'));
        if (!parsed.agentName) return reject(new Error('Missing required field: agentName'));
        if (!Array.isArray(parsed.events)) return reject(new Error('Missing required field: events (array)'));
        if (!parsed.createdAt) return reject(new Error('Missing required field: createdAt'));

        // Validate each event
        const allIssues: string[] = [];
        for (const event of parsed.events) {
          const { issues } = validateEvent(event as StructuredBreakthroughEvent);
          if (issues.length > 0) {
            allIssues.push(`Event ${(event as StructuredBreakthroughEvent).id ?? '?'}: ${issues.join(', ')}`);
          }
        }
        if (allIssues.length > 0) {
          return reject(new Error(`Event validation failed:\n${allIssues.join('\n')}`));
        }

        resolve(parsed as EventPackage);
      } catch (err) {
        reject(new Error(`Failed to parse event package: ${(err as Error).message}`));
      }
    };

    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsText(file);
  });
}
