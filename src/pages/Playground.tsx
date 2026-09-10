import React from 'react';
import { Play } from 'lucide-react';

export default function Playground() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-can-text mb-2">Interactive Playground</h1>
        <p className="text-can-muted">Experiment with CAN protocol</p>
      </div>
      <div className="can-card p-6">
        <h2 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-can-accent" /> Sandbox Environment
        </h2>
        <p className="text-can-muted">Free-form CAN experimentation playground coming soon...</p>
      </div>
    </div>
  );
}
