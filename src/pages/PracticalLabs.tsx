import React from 'react';
import { FlaskConical } from 'lucide-react';

export default function PracticalLabs() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-can-text mb-2">Practical Labs</h1>
        <p className="text-can-muted">Hands-on CAN learning challenges</p>
      </div>
      <div className="can-card p-6">
        <h2 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-can-accent" /> Lab Challenges
        </h2>
        <p className="text-can-muted">Interactive practical labs coming soon...</p>
      </div>
    </div>
  );
}
