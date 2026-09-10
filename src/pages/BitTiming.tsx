import React from 'react';
import { Clock } from 'lucide-react';

export default function BitTiming() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-can-text mb-2">CAN Bit Timing</h1>
        <p className="text-can-muted">Calculate and configure bit timing</p>
      </div>
      <div className="can-card p-6">
        <h2 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-can-accent" /> Bit Timing Calculator
        </h2>
        <p className="text-can-muted">Bit timing calculation and analysis coming soon...</p>
      </div>
    </div>
  );
}
