import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function QuizPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-can-text mb-2">CAN Knowledge Quiz</h1>
        <p className="text-can-muted">Test your understanding of CAN protocol</p>
      </div>
      <div className="can-card p-6">
        <h2 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-can-accent" /> Interactive Quizzes
        </h2>
        <p className="text-can-muted">Quiz system with scoring coming soon...</p>
      </div>
    </div>
  );
}
