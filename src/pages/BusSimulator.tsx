import React from 'react';
import { Network } from 'lucide-react';

export default function BusSimulator() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-can-text mb-2">CAN Bus Simulator</h1>
        <p className="text-can-muted">Configure and simulate CAN networks</p>
      </div>
      <div className="can-card p-6">
        <h2 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
          <Network className="w-5 h-5 text-can-accent" /> Network Configuration
        </h2>
        <p className="text-can-muted">CAN network simulation with dynamic nodes coming soon...</p>
      </div>
    </div>
  );
}