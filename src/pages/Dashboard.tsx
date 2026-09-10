import React, { useState, useEffect, useCallback } from 'react';
import { useSimulation } from '../App';
import { CANFrame, CANNode } from '../types';
import { CANFrameGenerator } from '../simulator/CanProtocol';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Trash2,
  Activity,
  Network,
  AlertTriangle,
  Gauge,
  MessageSquare,
  Clock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { simulator, nodes, messageDatabase, queueFrame } = useSimulation();
  const [isRunning, setIsRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [messageLog, setMessageLog] = useState<any[]>([]);
  const [busLoad, setBusLoad] = useState(0);
  const [txCount, setTxCount] = useState(0);
  const [rxCount, setRxCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [trafficHistory, setTrafficHistory] = useState<{ time: number; tx: number; rx: number }[]>([]);
  const [autoTransmit, setAutoTransmit] = useState(true);

  // Subscribe to simulation updates
  useEffect(() => {
    const unsubscribe = simulator.subscribe((state, bus) => {
      setSimulationTime(state.simulationTime);
      setMessageLog(bus.messageLog.slice(-50)); // Keep last 50 messages
      setErrorCount(bus.errorFrameCount);

      // Calculate bus load
      const activeNodes = Array.from(bus.nodes.values()).filter(n => n.txQueue.length > 0);
      setBusLoad(Math.min(100, activeNodes.length * 20));
    });

    return unsubscribe;
  }, [simulator]);

  // Auto-transmit demo messages
  useEffect(() => {
    if (!isRunning || !autoTransmit) return;

    const interval = setInterval(() => {
      // Transmit from each node periodically
      nodes.forEach((node, index) => {
        if (Math.random() > 0.7) { // 30% chance each tick
          const msg = messageDatabase[index % messageDatabase.length];
          if (msg) {
            try {
              const frame = CANFrameGenerator.generateStandardFrame(
                msg.id,
                msg.dlc,
                generateRandomData(msg.dlc),
                node.id
              );
              queueFrame(node.id, frame);
              setTxCount(prev => prev + 1);
            } catch (e) {
              console.error('Frame generation error:', e);
            }
          }
        }
      });

      // Step simulation
      simulator.stepBit();

      // Update traffic history
      setTrafficHistory(prev => {
        const newHistory = [...prev, { time: simulationTime, tx: txCount, rx: rxCount }];
        return newHistory.slice(-100); // Keep last 100 points
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, autoTransmit, nodes, messageDatabase, simulator, queueFrame, simulationTime, txCount, rxCount]);

  const generateRandomData = (dlc: number): number[] => {
    const data: number[] = [];
    for (let i = 0; i < dlc; i++) {
      data.push(Math.floor(Math.random() * 256));
    }
    return data;
  };

  const handleStart = () => {
    simulator.start();
    setIsRunning(true);
  };

  const handlePause = () => {
    simulator.pause();
    setIsRunning(false);
  };

  const handleReset = () => {
    simulator.reset();
    setIsRunning(false);
    setSimulationTime(0);
    setTxCount(0);
    setRxCount(0);
    setErrorCount(0);
    setMessageLog([]);
    setTrafficHistory([]);
  };

  const handleStep = () => {
    if (!isRunning) {
      simulator.start();
    }
    simulator.stepBit();
  };

  const handleClearBus = () => {
    simulator.clearLog();
    setMessageLog([]);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const formatHex = (value: number, padding: number = 3) => {
    return '0x' + value.toString(16).toUpperCase().padStart(padding, '0');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-can-text">CAN Bus Dashboard</h1>
          <p className="text-can-muted">Real-time CAN network monitoring and simulation</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-can-card border border-can-border">
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-can-success animate-pulse' : 'bg-can-recessive'}`} />
            <span className="text-sm text-can-muted">{isRunning ? 'Running' : 'Stopped'}</span>
          </div>
          <div className="font-mono text-can-accent">
            {formatTime(simulationTime)}
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="can-card p-4">
        <div className="flex items-center gap-4">
          {!isRunning ? (
            <button onClick={handleStart} className="can-button can-button-primary flex items-center gap-2">
              <Play className="w-4 h-4" /> Start
            </button>
          ) : (
            <button onClick={handlePause} className="can-button can-button-secondary flex items-center gap-2">
              <Pause className="w-4 h-4" /> Pause
            </button>
          )}
          <button onClick={handleStep} className="can-button can-button-secondary flex items-center gap-2">
            <StepForward className="w-4 h-4" /> Step
          </button>
          <button onClick={handleReset} className="can-button can-button-secondary flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={handleClearBus} className="can-button can-button-secondary flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Clear
          </button>
          <div className="flex-1" />
          <label className="flex items-center gap-2 text-sm text-can-muted">
            <input
              type="checkbox"
              checked={autoTransmit}
              onChange={(e) => setAutoTransmit(e.target.checked)}
              className="rounded border-can-border bg-can-dark"
            />
            Auto-transmit demo messages
          </label>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatusCard
          icon={<Network className="w-5 h-5" />}
          label="Nodes"
          value={nodes.length.toString()}
          color="blue"
        />
        <StatusCard
          icon={<Gauge className="w-5 h-5" />}
          label="Bus Load"
          value={`${busLoad.toFixed(0)}%`}
          color={busLoad > 70 ? 'red' : busLoad > 50 ? 'yellow' : 'green'}
        />
        <StatusCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="TX Frames"
          value={txCount.toString()}
          color="blue"
        />
        <StatusCard
          icon={<TrendingDown className="w-5 h-5" />}
          label="RX Frames"
          value={rxCount.toString()}
          color="blue"
        />
        <StatusCard
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Errors"
          value={errorCount.toString()}
          color={errorCount > 0 ? 'red' : 'green'}
        />
        <StatusCard
          icon={<Clock className="w-5 h-5" />}
          label="Bit Rate"
          value="500 kbit/s"
          color="blue"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bus Visualization */}
        <div className="lg:col-span-2 can-card p-4">
          <h2 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" /> Bus Activity
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis dataKey="time" stroke="#8b949e" fontSize={10} />
                <YAxis stroke="#8b949e" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: '4px',
                  }}
                />
                <Line type="monotone" dataKey="tx" stroke="#58a6ff" dot={false} name="TX" />
                <Line type="monotone" dataKey="rx" stroke="#3fb950" dot={false} name="RX" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Node Status */}
        <div className="can-card p-4">
          <h2 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
            <Network className="w-5 h-5" /> Active Nodes
          </h2>
          <div className="space-y-2">
            {nodes.map(node => (
              <div key={node.id} className="flex items-center justify-between p-3 bg-can-dark rounded border border-can-border">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    node.nodeState === 'error-active' ? 'bg-can-success' :
                    node.nodeState === 'error-passive' ? 'bg-can-warning' : 'bg-can-error'
                  }`} />
                  <span className="font-medium text-can-text">{node.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-can-muted font-mono">
                  <span>TEC: {node.txErrorCounter}</span>
                  <span>REC: {node.rxErrorCounter}</span>
                  <span className={`px-2 py-0.5 rounded ${
                    node.nodeState === 'error-active' ? 'bg-can-success/20 text-can-success' :
                    node.nodeState === 'error-passive' ? 'bg-can-warning/20 text-can-warning' :
                    'bg-can-error/20 text-can-error'
                  }`}>
                    {node.nodeState.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Log */}
      <div className="can-card p-4">
        <h2 className="text-lg font-semibold text-can-text mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" /> Message Log
        </h2>
        <div className="overflow-x-auto">
          <table className="can-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Dir</th>
                <th>Node</th>
                <th>ID</th>
                <th>DLC</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              {messageLog.map((entry, index) => (
                <tr key={index} className="hover:bg-can-card transition-colors">
                  <td className="text-can-muted">{entry.timestamp}</td>
                  <td>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      entry.direction === 'tx' ? 'bg-can-accent/20 text-can-accent' :
                      entry.direction === 'rx' ? 'bg-can-success/20 text-can-success' :
                      'bg-can-error/20 text-can-error'
                    }`}>
                      {entry.direction.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-can-text">{entry.nodeId}</td>
                  <td className="text-can-accent">{formatHex(entry.frame.id)}</td>
                  <td className="text-can-text">{entry.frame.dlc}</td>
                  <td className="text-can-muted">
                    {entry.frame.data.map((b: number) => b.toString(16).padStart(2, '0').toUpperCase()).join(' ')}
                  </td>
                  <td>
                    <span className={`text-xs ${
                      entry.status === 'success' ? 'text-can-success' : 'text-can-error'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {messageLog.length === 0 && (
          <div className="text-center py-8 text-can-muted">
            No messages yet. Click "Start" to begin simulation.
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="can-card p-4">
        <h2 className="text-lg font-semibold text-can-text mb-4">Quick Start Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickAction
            title="Learn CAN Basics"
            description="Understand the fundamentals of CAN protocol"
            link="/fundamentals"
          />
          <QuickAction
            title="Explore CAN Frames"
            description="Build and analyze CAN frames interactively"
            link="/frame-explorer"
          />
          <QuickAction
            title="Try Arbitration"
            description="See how CAN arbitration works in real-time"
            link="/arbitration"
          />
        </div>
      </div>
    </div>
  );
}

// Status Card Component
function StatusCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colorClasses = {
    blue: 'border-can-accent/50 text-can-accent',
    green: 'border-can-success/50 text-can-success',
    yellow: 'border-can-warning/50 text-can-warning',
    red: 'border-can-error/50 text-can-error',
  };

  return (
    <div className={`can-card p-4 border-l-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="text-can-muted">{icon}</div>
        <span className="text-sm text-can-muted">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${colorClasses[color as keyof typeof colorClasses].split(' ')[1]}`}>
        {value}
      </div>
    </div>
  );
}

// Quick Action Component
function QuickAction({ title, description, link }: { title: string; description: string; link: string }) {
  return (
    <a
      href={link}
      className="block p-4 bg-can-dark rounded-lg border border-can-border hover:border-can-accent transition-colors group"
    >
      <h3 className="font-medium text-can-text group-hover:text-can-accent transition-colors">{title}</h3>
      <p className="text-sm text-can-muted mt-1">{description}</p>
    </a>
  );
}