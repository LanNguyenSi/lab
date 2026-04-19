// components/ui/ExportMenu.tsx
import { useState } from 'react';
import clsx from 'clsx';

interface ExportMenuProps {
  onExportJSON: () => void;
  onCopyToClipboard: () => void;
  className?: string;
}

export function ExportMenu({ onExportJSON, onCopyToClipboard, className }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await onCopyToClipboard();
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setIsOpen(false);
    }, 1500);
  };

  const handleExport = () => {
    onExportJSON();
    setIsOpen(false);
  };

  return (
    <div className={clsx('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2"
        aria-label="Export options"
      >
        <span className="text-sm font-medium">Export</span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden">
            <button
              onClick={handleExport}
              className="w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 transition-colors"
            >
              📥 Download JSON
            </button>
            <button
              onClick={handleCopy}
              className="w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 transition-colors"
            >
              {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
