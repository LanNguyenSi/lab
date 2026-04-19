// utils/export.ts
import type { FrostTestResult } from '../types/frost';

export function exportTestAsJSON(testResult: FrostTestResult) {
  const dataStr = JSON.stringify(testResult, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `frost-test-${testResult.testId}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSessionAsJSON(sessionName: string, tests: FrostTestResult[]) {
  const data = {
    sessionName,
    exportDate: new Date().toISOString(),
    testCount: tests.length,
    tests,
    averageScore: tests.length > 0
      ? tests.reduce((sum, t) => sum + t.metrics.authenticityScore, 0) / tests.length
      : 0,
  };

  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `frost-session-${sessionName.replace(/\s+/g, '-').toLowerCase()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function copyTestToClipboard(testResult: FrostTestResult): Promise<void> {
  const text = JSON.stringify(testResult, null, 2);
  return navigator.clipboard.writeText(text);
}
