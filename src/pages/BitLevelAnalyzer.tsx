import React, { useState } from 'react';
import { Zap, Eye, Layers, ChevronRight } from 'lucide-react';

export default function BitLevelAnalyzer() {
  const [bitSequence, setBitSequence] = useState('111111');
  const [stuffedBits, setStuffedBits] = useState<number[]>([]);

  const analyzeBitStuffing = () => {
    const bits = bitSequence.split('').map(b => parseInt(b));
    const stuffed: number[] = [];
    let consecutiveCount = 0;
    let lastBit = -1;

    for (const bit of bits) {
      if (bit === lastBit) {
        consecutiveCount++;
      } else {
        consecutiveCount = 1;
        lastBit = bit;
      }

      stuffed.push(bit);

      if (consecutiveCount === 5) {
        stuffed.push(1 - bit);
        lastBit = 1 - bit;
        consecutiveCount = 1;
      }
    }

    setStuffedBits(stuffed);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-can-text mb-2">Bit-Level Analyzer</h1>
        <p className="text-can-muted">Analyze CAN bit stuffing and bit timing</p>
      </div>

      <div className="can-card p-6">
        <h2 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-can-accent" /> Bit Stuffing Visualizer
        </h2>

        <div className="space-y-4">
          <div>
            <label className="can-label">Enter bit sequence (0s and 1s)</label>
            <input
              type="text"
              value={bitSequence}
              onChange={(e) => setBitSequence(e.target.value.replace(/[^01]/g, ''))}
              className="can-input w-full font-mono text-lg"
              placeholder="111111"
            />
            <p className="text-xs text-can-muted mt-1">
              CAN protocol: After 5 consecutive bits of the same value, insert an opposite bit
            </p>
          </div>

          <button onClick={analyzeBitStuffing} className="can-button can-button-primary">
            Analyze Bit Stuffing
          </button>

          {stuffedBits.length > 0 && (
            <div className="space-y-4 mt-6">
              <div>
                <h3 className="font-medium text-can-text mb-2">Original Sequence</h3>
                <div className="flex flex-wrap gap-1">
                  {bitSequence.split('').map((bit, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 flex items-center justify-center rounded font-mono font-bold ${
                        bit === '0' ? 'bg-can-dominant text-can-dark' : 'bg-can-recessive text-can-dark'
                      }`}
                    >
                      {bit}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-can-muted mt-2">Length: {bitSequence.length} bits</p>
              </div>

              <ChevronRight className="w-6 h-6 text-can-accent mx-auto" />

              <div>
                <h3 className="font-medium text-can-text mb-2">After Bit Stuffing</h3>
                <div className="flex flex-wrap gap-1">
                  {stuffedBits.map((bit, i) => {
                    const isStuffBit = i > 0 && stuffedBits[i - 1] === stuffedBits[i - 2] &&
                      stuffedBits[i - 2] === stuffedBits[i - 3] &&
                      stuffedBits[i - 3] === stuffedBits[i - 4] &&
                      stuffedBits[i - 4] === stuffedBits[i - 5] &&
                      bit !== stuffedBits[i - 1];

                    return (
                      <div
                        key={i}
                        className={`w-10 h-10 flex items-center justify-center rounded font-mono font-bold ${
                          isStuffBit
                            ? 'bg-can-warning text-can-dark border-2 border-can-warning'
                            : bit === 0
                            ? 'bg-can-dominant text-can-dark'
                            : 'bg-can-recessive text-can-dark'
                        }`}
                        title={isStuffBit ? 'Stuff bit' : undefined}
                      >
                        {bit}
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-can-muted mt-2">
                  Length: {stuffedBits.length} bits | Stuffed bits added: {stuffedBits.length - bitSequence.length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="can-card p-6">
        <h2 className="text-lg font-semibold text-can-text mb-4">Bit Stuffing Rules</h2>
        <div className="space-y-3 text-sm text-can-muted">
          <p><strong>Rule:</strong> After 5 consecutive bits of the same polarity, the transmitter inserts one bit of opposite polarity</p>
          <p><strong>Why:</strong> Bit stuffing ensures sufficient signal transitions for clock synchronization</p>
          <p><strong>Example:</strong> 11111 → 111110 (stuff bit inserted)</p>
          <p><strong>Detection:</strong> If receiver sees 6 consecutive identical bits, it's a stuff error</p>
        </div>
      </div>
    </div>
  );
}