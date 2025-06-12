import React, { useState, useRef } from 'react';
import type { DoubtQuery, DoubtSolution } from '../../types';
import Card from '../ui/Card';
import InteractiveButton from '../ui/InteractiveButton';
import LoadingSpinner from '../core/LoadingSpinner';

interface DoubtSolverPanelProps {
  onSubmitDoubt: (doubtText: string, subject?: string, attachedImage?: string) => Promise<void>;
  doubtQueries: DoubtQuery[];
  isLoading: boolean;
  usageLimit: number;
  currentUsage: number;
  userSubscription: 'free' | 'premium' | 'pro';
  onUpgradeRequired?: () => void;
}

const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'General Science',
  'Other'
];

export const DoubtSolverPanel: React.FC<DoubtSolverPanelProps> = ({
  onSubmitDoubt,
  doubtQueries,
  isLoading,
  usageLimit,
  currentUsage,
  userSubscription,
  onUpgradeRequired
}) => {
  const [doubtText, setDoubtText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAttachedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;

    await onSubmitDoubt(doubtText.trim(), selectedSubject, attachedImage || undefined);
    setDoubtText('');
    setAttachedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const canSubmit = usageLimit === -1 || currentUsage < usageLimit;

  return (
    <div className="space-y-8">
      {/* Usage Indicator */}
      <Card variant="glass" padding="md">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-slate-700">Daily Usage</h3>
            <p className="text-slate-600">
              {usageLimit === -1 ? 'Unlimited doubts' : `${currentUsage} / ${usageLimit} doubts used today`}
            </p>
          </div>
          {userSubscription === 'free' && (
            <InteractiveButton
              onClick={onUpgradeRequired}
              variant="accent"
              size="sm"
            >
              Upgrade for More
            </InteractiveButton>
          )}
        </div>
        {usageLimit !== -1 && (
          <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-accent-500 to-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (currentUsage / usageLimit) * 100)}%` }}
            />
          </div>
        )}
      </Card>

      {/* Doubt Submission Form */}
      <Card variant="elevated" padding="lg">
        <h2 className="text-2xl font-bold text-primary-700 mb-6 flex items-center space-x-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Ask Your Doubt</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject Selection */}
          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
              Subject
            </label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="interactive-input w-full p-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 bg-white shadow-sm"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* Question Text */}
          <div>
            <label htmlFor="doubtText" className="block text-sm font-semibold text-slate-700 mb-2">
              Your Question
            </label>
            <textarea
              id="doubtText"
              value={doubtText}
              onChange={(e) => setDoubtText(e.target.value)}
              rows={6}
              className="interactive-input w-full p-4 border-2 border-slate-200 rounded-xl focus:border-primary-500 bg-white shadow-sm resize-none"
              placeholder="Describe your doubt in detail. Be specific about what you're struggling with..."
              disabled={isLoading}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Attach Image (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <InteractiveButton
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Image
              </InteractiveButton>
              {attachedImage && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-600">✓ Image attached</span>
                  <button
                    type="button"
                    onClick={() => setAttachedImage(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Image Preview */}
          {attachedImage && (
            <div className="mt-4">
              <img 
                src={attachedImage} 
                alt="Attached" 
                className="max-w-xs max-h-48 rounded-lg border border-slate-200 shadow-sm"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <InteractiveButton
              type="submit"
              disabled={!doubtText.trim() || isLoading || !canSubmit}
              loading={isLoading}
              variant="primary"
              size="lg"
              className="w-full"
            >
              {isLoading ? 'Solving Your Doubt...' : 'Get Solution'}
            </InteractiveButton>
            
            {!canSubmit && (
              <p className="text-sm text-red-600 mt-2 text-center">
                You've reached your daily limit. {userSubscription === 'free' ? 'Upgrade to continue!' : 'Try again tomorrow.'}
              </p>
            )}
          </div>
        </form>
      </Card>

      {/* Previous Doubts */}
      {doubtQueries.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-700">Your Previous Doubts</h3>
          {doubtQueries.map(doubt => (
            <Card key={doubt.id} variant="default" padding="lg" className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                      {doubt.subject}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      doubt.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      doubt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {doubt.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-700 mb-2">{doubt.question}</h4>
                  <p className="text-sm text-slate-500">{doubt.timestamp.toLocaleString()}</p>
                </div>
              </div>

              {doubt.attachedImage && (
                <div className="mt-3">
                  <img 
                    src={doubt.attachedImage} 
                    alt="Question attachment" 
                    className="max-w-xs max-h-32 rounded-lg border border-slate-200"
                  />
                </div>
              )}

              {doubt.solution && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                  <h5 className="font-semibold text-slate-700 mb-3">Solution:</h5>
                  
                  <div className="space-y-4">
                    <div>
                      <h6 className="font-medium text-slate-600 mb-2">Explanation:</h6>
                      <p className="text-slate-700 leading-relaxed">{doubt.solution.explanation}</p>
                    </div>

                    {doubt.solution.steps && doubt.solution.steps.length > 0 && (
                      <div>
                        <h6 className="font-medium text-slate-600 mb-2">Step-by-step Solution:</h6>
                        <ol className="list-decimal list-inside space-y-2">
                          {doubt.solution.steps.map((step, index) => (
                            <li key={index} className="text-slate-700">{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {doubt.solution.relatedConcepts && doubt.solution.relatedConcepts.length > 0 && (
                      <div>
                        <h6 className="font-medium text-slate-600 mb-2">Related Concepts:</h6>
                        <div className="flex flex-wrap gap-2">
                          {doubt.solution.relatedConcepts.map((concept, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {doubt.solution.diagramData && (
                      <div>
                        <h6 className="font-medium text-slate-600 mb-2">Visual Explanation:</h6>
                        <div className="p-3 bg-white rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-600">Diagram: {doubt.solution.diagramData.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {doubtQueries.length === 0 && (
        <Card variant="glass" padding="lg" className="text-center">
          <div className="py-8">
            <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No doubts yet</h3>
            <p className="text-slate-500">Ask your first question to get started with AI-powered doubt resolution!</p>
          </div>
        </Card>
      )}
    </div>
  );
};