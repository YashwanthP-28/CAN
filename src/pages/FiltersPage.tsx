import React from 'react';
import { Filter } from 'lucide-react';

export default function FiltersPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-can-text mb-2">CAN Filters</h1>
        <p className="text-can-muted">Configure acceptance filters</p>
      </div>
      <div className="can-card p-6">
        <h2 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-can-accent" /> Acceptance Filters
        </h2>
        <p className="text-can-muted">Filter configuration and testing coming soon...</p>
      </div>
    </div>
  );
}
