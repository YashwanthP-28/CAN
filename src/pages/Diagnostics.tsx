import React from 'react';
import { Stethoscope } from 'lucide-react';

export default function Diagnostics() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-can-text mb-2">CAN Diagnostics & UDS</h1>
        <p className="text-can-muted">Introduction to automotive diagnostics</p>
      </div>
      <div className="can-card p-6">
        <h2 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-can-accent" /> UDS Protocol
        </h2>
        <p className="text-can-muted">UDS diagnostic protocol simulator coming soon...</p>
      </div>
    </div>
  );
}
