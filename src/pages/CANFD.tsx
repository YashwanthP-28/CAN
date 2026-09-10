import React from 'react';
import { Rocket } from 'lucide-react';

export default function CANFD() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-can-text mb-2">CAN FD</h1>
        <p className="text-can-muted">CAN Flexible Data-rate protocol</p>
      </div>
      <div className="can-card p-6">
        <h2 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-can-accent" /> CAN FD Features
        </h2>
        <p className="text-can-muted">CAN FD simulator and comparison coming soon...</p>
      </div>
    </div>
  );
}
