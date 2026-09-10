import React from 'react';
import { Signal, Filter, Clock, Rocket, Stethoscope, FlaskConical, HelpCircle, Play } from 'lucide-react';

export default function SignalDecoder() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-can-text mb-2">Signal Decoder</h1>
        <p className="text-can-muted">Decode CAN signals from raw data</p>
      </div>
      <div className="can-card p-6">
        <h2 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
          <Signal className="w-5 h-5 text-can-accent" /> Signal Definitions
        </h2>
        <p className="text-can-muted">Signal decoder and physical value conversion coming soon...</p>
      </div>
    </div>
  );
}
