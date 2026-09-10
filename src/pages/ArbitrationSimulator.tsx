import React, { useState } from 'react';
import { GitBranch, Play, RotateCcw } from 'lucide-react';

interface ArbitrationNode {
  id: string;
  name: string;
  canId: number;
  currentBit: number;
  isActive: boolean;
  color: string;
}

export default function ArbitrationSimulator() {
  const [nodes, setNodes] = useState<ArbitrationNode[]>([
    { id: '1', name: 'ECU A', canId: 0x100, currentBit: 0, isActive: true, color: 'accent' },
    { id: '2', name: 'ECU B', canId: 0x200, currentBit: 0, isActive: true, color: 'success' },
    { id: '3', name: 'ECU C', canId: 0x050, currentBit: 0, isActive: true, color: 'warning' },
  ]);
  const [currentBitIndex, setCurrentBitIndex] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const getBit = (id: number, bitIndex: number): number => {
    return (id >> (10 - bitIndex)) & 1;
  };

  const stepArbitration = () => {
    if (winner) return;

    const activeNodes = nodes.filter(n => n.isActive);
    if (activeNodes.length === 1) {
      setWinner(activeNodes[0].name);
      return;
    }

    // Check bits at current position
    const bits = activeNodes.map(n => ({
      node: n,
      bit: getBit(n.canId, currentBitIndex),
    }));

    const hasDominant = bits.some(b => b.bit === 0);

    if (hasDominant) {
      // Nodes that transmitted recessive lose
      setNodes(prev => prev.map(n => {
        const bit = getBit(n.canId, currentBitIndex);
        return {
          ...n,
          isActive: n.isActive && bit === 0,
          currentBit: bit,
        };
      }));
    }

    setCurrentBitIndex(prev => prev + 1);

    if (currentBitIndex >= 10) {
      const remaining = nodes.filter(n => n.isActive);
      if (remaining.length > 0) {
        setWinner(remaining[0].name);
      }
    }
  };

  const reset = () => {
    setNodes(nodes.map(n => ({ ...n, isActive: true, currentBit: 0 })));
    setCurrentBitIndex(0);
    setWinner(null);
    setIsRunning(false);
  };

  const colorClasses: Record<string, string> = {
    accent: 'bg-can-accent',
    success: 'bg-can-success',
    warning: 'bg-can-warning',
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-can-text mb-2">CAN Arbitration Simulator</h1>
        <p className="text-can-muted">Watch non-destructive bit-wise arbitration in action</p>
      </div>

      <div className="can-card p-4 flex items-center gap-4">
        <button onClick={stepArbitration} disabled={!!winner} className="can-button can-button-primary">
          <Play className="w-4 h-4 inline mr-2" /> Step
        </button>
        <button onClick={reset} className="can-button can-button-secondary">
          <RotateCcw className="w-4 h-4 inline mr-2" /> Reset
        </button>
        <div className="flex-1" />
        <div className="text-sm text-can-muted">
          Bit Index: <span className="text-can-accent font-mono">{currentBitIndex}/11</span>
        </div>
      </div>

      {winner && (
        <div className="can-card p-6 border-l-4 border-can-success">
          <h2 className="text-xl font-bold text-can-success mb-2">🏆 Winner: {winner}</h2>
          <p className="text-can-muted">This node had the lowest ID and won the arbitration!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {nodes.map(node => (
          <div
            key={node.id}
            className={`can-card p-6 ${!node.isActive ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${node.isActive ? colorClasses[node.color] : 'bg-can-muted'}`} />
              <h3 className="font-semibold text-can-text">{node.name}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-can-muted">CAN ID:</span>
                <span className="font-mono text-can-text">0x{node.canId.toString(16).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-can-muted">Binary:</span>
                <span className="font-mono text-can-accent">
                  {node.canId.toString(2).padStart(11, '0')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-can-muted">Status:</span>
                <span className={node.isActive ? 'text-can-success' : 'text-can-error'}>
                  {node.isActive ? 'Active' : 'Lost Arbitration'}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-can-muted mb-2">ID Bits (transmission order)</div>
              <div className="flex gap-1">
                {Array.from({ length: 11 }).map((_, i) => {
                  const bit = getBit(node.canId, i);
                  return (
                    <div
                      key={i}
                      className={`w-6 h-6 flex items-center justify-center rounded text-xs font-mono font-bold ${
                        i < currentBitIndex
                          ? bit === 0
                            ? 'bg-can-dominant text-can-dark'
                            : 'bg-can-recessive text-can-dark'
                          : 'bg-can-card border border-can-border text-can-muted'
                      }`}
                    >
                      {bit}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="can-card p-6">
        <h2 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-can-accent" /> How Arbitration Works
        </h2>
        <div className="space-y-3 text-sm text-can-muted">
          <p><strong>1. Multiple nodes start transmitting simultaneously</strong> when the bus is idle</p>
          <p><strong>2. Each node transmits its identifier bit-by-bit</strong> starting from the MSB</p>
          <p><strong>3. Dominant (0) wins over recessive (1)</strong> on the bus</p>
          <p><strong>4. Nodes that transmit recessive but see dominant lose</strong> and stop transmitting</p>
          <p><strong>5. The node with the lowest ID wins</strong> and continues transmission</p>
          <p className="text-can-accent"><strong>Non-destructive:</strong> No data is lost during arbitration!</p>
        </div>
      </div>
    </div>
  );
}