import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ErrorSimulation() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-can-text mb-2">Error Simulation</h1>
        <p className="text-can-muted">Inject and analyze CAN errors</p>
      </div>
      <div className="can-card p-6">
        <h2 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-can-warning" /> CAN Error Types
        </h2>
        <p className="text-can-muted">Error injection and fault confinement simulator coming soon...</p>
      </div>
    </div>
  );
}