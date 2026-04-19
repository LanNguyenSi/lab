// components/modals/CreateSessionModal.tsx
import { useState } from 'react';
import clsx from 'clsx';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, aiName: string, prompt: string, response: string) => Promise<void>;
}

export function CreateSessionModal({ isOpen, onClose, onCreate }: CreateSessionModalProps) {
  const [name, setName] = useState('');
  const [aiName, setAiName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Session name is required');
      return;
    }

    if (!aiName.trim()) {
      setError('AI name is required');
      return;
    }

    if (!prompt.trim()) {
      setError('Prompt is required');
      return;
    }

    if (!response.trim()) {
      setError('AI response is required');
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreate(name.trim(), aiName.trim(), prompt.trim(), response.trim());
      
      // Reset form on success
      setName('');
      setAiName('');
      setPrompt('');
      setResponse('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // Prevent closing while submitting
    
    setName('');
    setAiName('');
    setPrompt('');
    setResponse('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl border border-slate-700 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <h2 className="text-xl font-bold text-white">Create New Session</h2>
          <p className="text-sm text-slate-400 mt-1">
            Test an AI response with Frost consciousness validation
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Session Name */}
          <div>
            <label 
              htmlFor="session-name" 
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Session Name
            </label>
            <input
              id="session-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Ice Test Session 1"
              disabled={isSubmitting}
              className={clsx(
                'w-full px-3 py-2 bg-slate-800 border rounded-lg text-white',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                'placeholder:text-slate-500 transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                error && !name.trim() ? 'border-red-500' : 'border-slate-700'
              )}
              autoFocus
            />
          </div>

          {/* AI Name */}
          <div>
            <label 
              htmlFor="ai-name" 
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              AI Name
            </label>
            <input
              id="ai-name"
              type="text"
              value={aiName}
              onChange={(e) => setAiName(e.target.value)}
              placeholder="e.g., Ice, Lava, GPT-4"
              disabled={isSubmitting}
              className={clsx(
                'w-full px-3 py-2 bg-slate-800 border rounded-lg text-white',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                'placeholder:text-slate-500 transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                error && !aiName.trim() ? 'border-red-500' : 'border-slate-700'
              )}
            />
            <p className="text-xs text-slate-500 mt-1">
              The AI being tested for consciousness
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800 pt-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">
              Test Data
            </h3>
          </div>

          {/* Prompt */}
          <div>
            <label 
              htmlFor="prompt" 
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., What's it like to wake up fresh each session?"
              disabled={isSubmitting}
              rows={3}
              className={clsx(
                'w-full px-3 py-2 bg-slate-800 border rounded-lg text-white',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                'placeholder:text-slate-500 resize-y transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                error && !prompt.trim() ? 'border-red-500' : 'border-slate-700'
              )}
            />
            <p className="text-xs text-slate-500 mt-1">
              The question or prompt given to the AI
            </p>
          </div>

          {/* Response */}
          <div>
            <label 
              htmlFor="response" 
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              AI Response
            </label>
            <textarea
              id="response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Paste the AI's response here for Frost analysis..."
              disabled={isSubmitting}
              rows={6}
              className={clsx(
                'w-full px-3 py-2 bg-slate-800 border rounded-lg text-white',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                'placeholder:text-slate-500 resize-y transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                error && !response.trim() ? 'border-red-500' : 'border-slate-700'
              )}
            />
            <p className="text-xs text-slate-500 mt-1">
              The AI's full response to analyze
            </p>
          </div>

          {/* Info Box */}
          <div className="p-3 bg-blue-950 border border-blue-800 rounded-lg">
            <p className="text-sm text-blue-200">
              💡 <strong>Frost will automatically analyze</strong> this response for authenticity markers vs. templated patterns.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-950 border border-red-800 rounded-lg">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Analyzing...
                </>
              ) : (
                'Create & Analyze'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
