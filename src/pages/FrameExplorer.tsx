import React, { useState, useMemo } from 'react';
import { CANFrameGenerator, CANBitStuffer, CANCRCCalculator } from '../simulator/CanProtocol';
import { CANFrame, FrameType } from '../types';
import { Info, Code, FileText, Calculator, Play, CheckCircle } from 'lucide-react';

export default function FrameExplorer() {
  const [frameType, setFrameType] = useState<FrameType>('standard');
  const [id, setId] = useState<string>('123');
  const [dlc, setDlc] = useState<number>(8);
  const [data, setData] = useState<string>('11 22 33 44 55 66 77 88');
  const [frame, setFrame] = useState<CANFrame | null>(null);

  const parseId = (value: string, type: FrameType): number => {
    const num = parseInt(value, 16);
    if (type === 'standard') {
      return Math.max(0, Math.min(0x7ff, num));
    }
    return Math.max(0, Math.min(0x1fffffff, num));
  };

  const handleGenerate = () => {
    const parsedId = parseId(id, frameType);
    const dataBytes = data.split(/\s+/).map(b => parseInt(b, 16) || 0).slice(0, dlc);

    // Pad with zeros if needed
    while (dataBytes.length < dlc) {
      dataBytes.push(0);
    }

    let generatedFrame: CANFrame;
    try {
      if (frameType === 'standard') {
        generatedFrame = CANFrameGenerator.generateStandardFrame(
          parsedId,
          dlc,
          dataBytes,
          'test-node'
        );
      } else if (frameType === 'extended') {
        generatedFrame = CANFrameGenerator.generateExtendedFrame(
          parsedId,
          dlc,
          dataBytes,
          'test-node'
        );
      } else {
        generatedFrame = CANFrameGenerator.generateCANFDFrame(
          parsedId,
          dlc,
          dataBytes,
          'test-node'
        );
      }
      setFrame(generatedFrame);
    } catch (e) {
      console.error('Frame generation error:', e);
    }
  };

  // Get frame fields for display
  const frameFields = useMemo(() => {
    if (!frame) return null;

    const fields = [
      { name: 'SOF', start: 0, length: 1, description: 'Start of Frame bit' },
    ];

    // Identifier (11 bits for standard, 29 for extended)
    const idLength = frameType === 'extended' ? 29 : 11;
    fields.push({ name: 'ID', start: 1, length: idLength, description: 'Identifier' });

    // RTR
    fields.push({ name: 'RTR', start: 1 + idLength, length: 1, description: 'Remote Transmission Request' });

    // IDE
    fields.push({ name: 'IDE', start: 1 + idLength + 1, length: 1, description: 'Identifier Extension' });

    // r0
    fields.push({ name: 'r0', start: 1 + idLength + 1 + 1, length: 1, description: 'Reserved bit' });

    // DLC
    fields.push({ name: 'DLC', start: 1 + idLength + 1 + 1 + 1, length: 4, description: 'Data Length Code' });

    // Data (DLC * 8 bits)
    fields.push({ name: 'DATA', start: 1 + idLength + 1 + 1 + 1 + 4, length: dlc * 8, description: 'Data payload' });

    // CRC
    fields.push({ name: 'CRC', start: 1 + idLength + 1 + 1 + 1 + 4 + dlc * 8, length: 15, description: 'CRC-15' });

    // CRC delimiter
    fields.push({ name: 'CRC Delim', start: 1 + idLength + 1 + 1 + 1 + 4 + dlc * 8 + 15, length: 1, description: 'CRC delimiter (recessive)' });

    // ACK
    fields.push({ name: 'ACK', start: 1 + idLength + 1 + 1 + 1 + 4 + dlc * 8 + 15 + 1, length: 2, description: 'ACK slot and ACK delimiter' });

    // EOF
    fields.push({ name: 'EOF', start: 1 + idLength + 1 + 1 + 1 + 4 + dlc * 8 + 15 + 2, length: 7, description: 'End of Frame' });

    // IFS
    fields.push({ name: 'IFS', start: 1 + idLength + 1 + 1 + 1 + 4 + dlc * 8 + 15 + 2 + 7, length: 3, description: 'Interframe Space' });

    return fields;
  }, [frame, frameType, dlc]);

  // Get stuffed bit positions
  const stuffedInfo = useMemo(() => {
    if (!frame) return null;

    const originalBits: number[] = [];
    const idLength = frameType === 'extended' ? 29 : 11;

    // SOF
    originalBits.push(0);

    // ID
    for (let i = idLength - 1; i >= 0; i--) {
      originalBits.push((frame.id >> i) & 1);
    }

    // RTR
    originalBits.push(frame.rtr ? 1 : 0);

    // IDE
    originalBits.push(frameType === 'extended' ? 1 : 0);

    // r0
    originalBits.push(0);

    // DLC
    for (let i = 3; i >= 0; i--) {
      originalBits.push((frame.dlc >> i) & 1);
    }

    // Data
    for (const byte of frame.data) {
      for (let i = 7; i >= 0; i--) {
        originalBits.push((byte >> i) & 1);
      }
    }

    // CRC
    for (let i = 14; i >= 0; i--) {
      originalBits.push((frame.crc >> i) & 1);
    }

    const stuffedBits = CANBitStuffer.stuffFrame(frame);

    return { originalBits, stuffedBits };
  }, [frame, frameType]);

  const formatHex = (value: number) => '0x' + value.toString(16).toUpperCase().padStart(3, '0');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-can-text mb-2">CAN Frame Explorer</h1>
        <p className="text-can-muted">Build, visualize, and analyze CAN frames</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Frame Builder */}
        <div className="lg:col-span-1 space-y-6">
          <div className="can-card p-4">
            <h2 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-can-accent" /> Build Frame
            </h2>

            <div className="space-y-4">
              <div>
                <label className="can-label">Frame Type</label>
                <select
                  value={frameType}
                  onChange={(e) => setFrameType(e.target.value as FrameType)}
                  className="can-select w-full"
                >
                  <option value="standard">Standard (11-bit ID)</option>
                  <option value="extended">Extended (29-bit ID)</option>
                  <option value="can-fd">CAN FD (up to 64 bytes)</option>
                </select>
                <p className="text-xs text-can-muted mt-1">
                  {frameType === 'standard' && 'CAN 2.0A - 11-bit identifier'}
                  {frameType === 'extended' && 'CAN 2.0B - 29-bit identifier'}
                  {frameType === 'can-fd' && 'CAN FD - Larger payload, optional BRS'}
                </p>
              </div>

              <div>
                <label className="can-label">CAN ID (hex)</label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="can-input w-full font-mono"
                  placeholder="000"
                />
                <p className="text-xs text-can-muted mt-1">
                  {frameType === 'standard' ? '0x000 - 0x7FF' : '0x00000000 - 0x1FFFFFFF'}
                </p>
              </div>

              <div>
                <label className="can-label">Data Length Code</label>
                <input
                  type="number"
                  min={0}
                  max={frameType === 'can-fd' ? 15 : 8}
                  value={dlc}
                  onChange={(e) => setDlc(parseInt(e.target.value) || 0)}
                  className="can-input w-full"
                />
                <p className="text-xs text-can-muted mt-1">
                  {frameType === 'can-fd' ? '0-15 (maps to 0,1,2,3,4,5,6,7,8,12,16,20,24,32,48,64 bytes)' : '0-8 bytes'}
                </p>
              </div>

              <div>
                <label className="can-label">Data Bytes (space-separated hex)</label>
                <input
                  type="text"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="can-input w-full font-mono"
                  placeholder="11 22 33 44 55 66 77 88"
                />
              </div>

              <button
                onClick={handleGenerate}
                className="w-full can-button can-button-primary"
              >
                Generate Frame
              </button>
            </div>
          </div>

          {frame && (
            <div className="can-card p-4">
              <h3 className="text-lg font-semibold text-can-text mb-3">Frame Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-can-muted">ID:</span>
                  <span className="text-can-accent font-mono">{formatHex(frame.id)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-can-muted">Type:</span>
                  <span className="text-can-text uppercase">{frame.frameType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-can-muted">DLC:</span>
                  <span className="text-can-text">{frame.dlc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-can-muted">Data:</span>
                  <span className="font-mono text-can-muted">
                    {frame.data.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-can-muted">CRC:</span>
                  <span className="text-can-warning font-mono">0x{frame.crc.toString(16).padStart(4, '0').toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Frame Visualization */}
        <div className="lg:col-span-2 space-y-6">
          {!frame ? (
            <div className="can-card p-8 text-center text-can-muted">
              <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Enter frame parameters and click "Generate Frame" to see the structure</p>
            </div>
          ) : (
            <>
              {/* Bit Timeline */}
              <div className="can-card p-4">
                <h3 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-can-accent" /> Bit Timeline
                </h3>

                <div className="space-y-4">
                  {/* Field Visualization */}
                  <div className="can-card border-2 border-can-border p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-can-dominant" />
                      <span className="text-xs text-can-muted">Dominant (0)</span>
                      <div className="w-3 h-3 bg-can-recessive ml-3" />
                      <span className="text-xs text-can-muted">Recessive (1)</span>
                    </div>

                    <div className="space-y-1">
                      {frameFields?.map((field, index) => {
                        const startBit = frameFields[index - 1] ? frameFields[index - 1].start + frameFields[index - 1].length : 0;
                        const bitCount = field.length;

                        return (
                          <div key={field.name}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs font-bold text-can-accent w-12">{field.name}</span>
                              <span className="text-xs text-can-muted">
                                Bits {startBit}-{startBit + bitCount - 1} ({bitCount} bits)
                              </span>
                              <Info
                                className="w-4 h-4 text-can-warning ml-auto cursor-help"
                                title={field.description}
                              />
                            </div>
                            <div className="flex flex-wrap gap-0.5 min-h-[30px]">
                              {Array.from({ length: bitCount }).map((_, bitIndex) => {
                                const globalBitIndex = startBit + bitIndex;
                                return (
                                  <div
                                    key={bitIndex}
                                    className={`w-6 h-8 rounded text-xs flex items-center justify-center font-mono
                                      ${frame.fields[field.name]?.[bitIndex] === 0 ? 'bg-can-dominant text-can-dark' : 'bg-can-recessive text-can-dark'}
                                    `}
                                  >
                                    {frame.fields?.[field.name]?.[bitIndex] ?? '-'}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bit-by-Bit Details */}
              <div className="can-card p-4">
                <h3 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-can-accent" /> Bit-by-Bit Analysis
                </h3>

                {stuffedInfo && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-can-text mb-2">Original Bits (before stuffing)</h4>
                      <div className="bg-can-dark p-2 rounded font-mono text-xs text-can-muted break-all">
                        {stuffedInfo.originalBits.join(' ')}
                      </div>
                      <p className="text-xs text-can-muted mt-1">
                        Total: {stuffedInfo.originalBits.length} bits
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-can-text mb-2">Stuffed Bits (after bit stuffing)</h4>
                      <div className="bg-can-dark p-2 rounded font-mono text-xs text-can-muted break-all">
                        {stuffedInfo.stuffedBits.join(' ')}
                      </div>
                      <p className="text-xs text-can-muted mt-1">
                        Total: {stuffedInfo.stuffedBits.length} bits
                        {' | '}
                        Stuffed bits added: {stuffedInfo.stuffedBits.length - stuffedInfo.originalBits.length}
                      </p>
                    </div>
                  </div>
                )}

                <div className="can-card p-4 mt-4">
                  <h4 className="font-medium text-can-text mb-3">CRC Calculation</h4>
                  <div className="text-sm text-can-muted space-y-2">
                    <p>CRC Polynomial: x^15 + x^14 + x^10 + x^8 + x^7 + x^4 + x^3 + 1 (0x4599)</p>
                    <p>Initial CRC value: 0xFFFF</p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="px-3 py-1 bg-can-accent/20 rounded text-can-accent font-mono">
                        Calculated CRC: 0x{frame.crc.toString(16).toUpperCase().padStart(4, '0')}
                      </div>
                      <CheckCircle className="w-5 h-5 text-can-success" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Field Reference */}
      <div className="can-card p-6">
        <h2 className="text-xl font-bold text-can-text mb-4">CAN Frame Field Reference</h2>
        <div className="overflow-x-auto">
          <table className="can-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Length (bits)</th>
                <th>Direction</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-mono text-can-accent">SOF</td>
                <td className="text-can-muted">1</td>
                <td className="text-can-muted">Tx only</td>
                <td className="text-can-muted">Start of Frame - marks beginning of frame</td>
              </tr>
              <tr>
                <td className="font-mono text-can-accent">ID</td>
                <td className="text-can-muted">11 or 29</td>
                <td className="text-can-muted">Tx only</td>
                <td className="text-can-muted">Identifier for message priority and message type</td>
              </tr>
              <tr>
                <td className="font-mono text-can-accent">RTR</td>
                <td className="text-can-muted">1</td>
                <td className="text-can-muted">Tx only</td>
                <td className="text-can-muted">Remote Transmission Request (data frame = 0)</td>
              </tr>
              <tr>
                <td className="font-mono text-can-accent">IDE</td>
                <td className="text-can-muted">1</td>
                <td className="text-can-muted">Tx only</td>
                <td className="text-can-muted">Identifier Extension (0=standard, 1=extended)</td>
              </tr>
              <tr>
                <td className="font-mono text-can-accent">r0</td>
                <td className="text-can-muted">1</td>
                <td className="text-can-muted">Tx only</td>
                <td className="text-can-muted">Reserved bit (must be dominant)</td>
              </tr>
              <tr>
                <td className="font-mono text-can-accent">DLC</td>
                <td className="text-can-muted">4</td>
                <td className="text-can-muted">Tx only</td>
                <td className="text-can-muted">Data Length Code (0-8 for CAN, 0-15 for CAN FD)</td>
              </tr>
              <tr>
                <td className="font-mono text-can-accent">DATA</td>
                <td className="text-can-muted">0-64</td>
                <td className="text-can-muted">Tx only</td>
                <td className="text-can-muted">Data payload (0-8 bytes for CAN, 0-64 for CAN FD)</td>
              </tr>
              <tr>
                <td className="font-mono text-can-accent">CRC</td>
                <td className="text-can-muted">15</td>
                <td className="text-can-muted">Tx only</td>
                <td className="text-can-muted">Cyclic Redundancy Check (CRC-15)</td>
              </tr>
              <tr>
                <td className="font-mono text-can-accent">CRC Delim</td>
                <td className="text-can-muted">1</td>
                <td className="text-can-muted">Tx only</td>
                <td className="text-can-muted">CRC delimiter (recessive bit)</td>
              </tr>
              <tr>
                <td className="font-mono text-can-accent">ACK</td>
                <td className="text-can-muted">2</td>
                <td className="text-can-muted">Rx only</td>
                <td className="text-can-muted">ACK slot and ACK delimiter</td>
              </tr>
              <tr>
                <td className="font-mono text-can-accent">EOF</td>
                <td className="text-can-muted">7</td>
                <td className="text-can-muted">Tx only</td>
                <td className="text-can-muted">End of Frame (7 recessive bits)</td>
              </tr>
              <tr>
                <td className="font-mono text-can-accent">IFS</td>
                <td className="text-can-muted">3</td>
                <td className="text-can-muted">Both</td>
                <td className="text-can-muted">Interframe Space (minimum 3 recessive bits)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}