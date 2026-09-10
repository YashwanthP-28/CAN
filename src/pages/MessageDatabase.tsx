import React from 'react';
import { Database } from 'lucide-react';

export default function MessageDatabase() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-can-text mb-2">Message Database</h1>
        <p className="text-can-muted">Manage CAN messages and signals</p>
      </div>
      <div className="can-card p-6">
        <h2 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-can-accent" /> DBC Editor
        </h2>
        <p className="text-can-muted">Message database management coming soon...</p>
      </div>
    </div>
  );
}