import { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { CANBusSimulator } from './simulator/CANBusSimulator';
import { CANNode, CANFrame, CANMessage } from './types';
import Dashboard from './pages/Dashboard';
import CANFundamentals from './pages/CANFundamentals';
import FrameExplorer from './pages/FrameExplorer';
import BitLevelAnalyzer from './pages/BitLevelAnalyzer';
import ArbitrationSimulator from './pages/ArbitrationSimulator';
import ErrorSimulation from './pages/ErrorSimulation';
import BusSimulator from './pages/BusSimulator';
import MessageDatabase from './pages/MessageDatabase';
import SignalDecoder from './pages/SignalDecoder';
import FiltersPage from './pages/FiltersPage';
import BitTiming from './pages/BitTiming';
import CANFD from './pages/CANFD';
import Diagnostics from './pages/Diagnostics';
import PracticalLabs from './pages/PracticalLabs';
import QuizPage from './pages/QuizPage';
import Playground from './pages/Playground';
import {
  Activity,
  Book,
  Layers,
  Zap,
  GitBranch,
  AlertTriangle,
  Network,
  Database,
  Signal,
  Filter,
  Clock,
  Rocket,
  Stethoscope,
  FlaskConical,
  HelpCircle,
  Play
} from 'lucide-react';

// Global simulation context
interface SimulationContextType {
  simulator: CANBusSimulator;
  nodes: CANNode[];
  messageDatabase: CANMessage[];
  addNode: (node: CANNode) => void;
  removeNode: (id: string) => void;
  queueFrame: (nodeId: string, frame: CANFrame) => void;
  updateNode: (id: string, updates: Partial<CANNode>) => void;
  addMessageToDatabase: (message: CANMessage) => void;
  removeMessageFromDatabase: (id: number) => void;
}

const SimulationContext = createContext<SimulationContextType | null>(null);

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within SimulationProvider');
  }
  return context;
};

// Navigation items
const navItems = [
  { path: '/', label: 'Dashboard', icon: Activity },
  { path: '/fundamentals', label: 'CAN Fundamentals', icon: Book },
  { path: '/frame-explorer', label: 'Frame Explorer', icon: Layers },
  { path: '/bit-level', label: 'Bit Analyzer', icon: Zap },
  { path: '/arbitration', label: 'Arbitration', icon: GitBranch },
  { path: '/error-simulation', label: 'Error Simulation', icon: AlertTriangle },
  { path: '/bus-simulator', label: 'Bus Simulator', icon: Network },
  { path: '/message-database', label: 'Message Database', icon: Database },
  { path: '/signal-decoder', label: 'Signal Decoder', icon: Signal },
  { path: '/filters', label: 'CAN Filters', icon: Filter },
  { path: '/bit-timing', label: 'Bit Timing', icon: Clock },
  { path: '/can-fd', label: 'CAN FD', icon: Rocket },
  { path: '/diagnostics', label: 'Diagnostics/UDS', icon: Stethoscope },
  { path: '/labs', label: 'Practical Labs', icon: FlaskConical },
  { path: '/quiz', label: 'Quiz', icon: HelpCircle },
  { path: '/playground', label: 'Playground', icon: Play },
];

function App() {
  const [simulator] = useState(() => new CANBusSimulator());
  const [nodes, setNodes] = useState<CANNode[]>([]);
  const [messageDatabase, setMessageDatabase] = useState<CANMessage[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initialize demo mode on first load
  useEffect(() => {
    initializeDemoMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeDemoMode = () => {
    // Create demo nodes (automotive ECUs)
    const engineECU: CANNode = {
      id: 'ecu-engine',
      name: 'Engine ECU',
      nodeState: 'error-active',
      txErrorCounter: 0,
      rxErrorCounter: 0,
      txQueue: [],
      rxQueue: [],
      filters: [],
      lastTransmissionTime: 0,
      canController: {
        bitRate: 500000,
        prescaler: 16,
        timeQuanta: 1,
        propagationSegment: 2,
        phaseSegment1: 4,
        phaseSegment2: 3,
        sjw: 1,
        samplePoint: 87.5,
        totalTimeQuanta: 10,
      },
      signals: [],
    };

    const transmissionECU: CANNode = {
      id: 'ecu-transmission',
      name: 'Transmission ECU',
      nodeState: 'error-active',
      txErrorCounter: 0,
      rxErrorCounter: 0,
      txQueue: [],
      rxQueue: [],
      filters: [],
      lastTransmissionTime: 0,
      canController: {
        bitRate: 500000,
        prescaler: 16,
        timeQuanta: 1,
        propagationSegment: 2,
        phaseSegment1: 4,
        phaseSegment2: 3,
        sjw: 1,
        samplePoint: 87.5,
        totalTimeQuanta: 10,
      },
      signals: [],
    };

    const absECU: CANNode = {
      id: 'ecu-abs',
      name: 'ABS Module',
      nodeState: 'error-active',
      txErrorCounter: 0,
      rxErrorCounter: 0,
      txQueue: [],
      rxQueue: [],
      filters: [],
      lastTransmissionTime: 0,
      canController: {
        bitRate: 500000,
        prescaler: 16,
        timeQuanta: 1,
        propagationSegment: 2,
        phaseSegment1: 4,
        phaseSegment2: 3,
        sjw: 1,
        samplePoint: 87.5,
        totalTimeQuanta: 10,
      },
      signals: [],
    };

    const dashboardECU: CANNode = {
      id: 'ecu-dashboard',
      name: 'Dashboard',
      nodeState: 'error-active',
      txErrorCounter: 0,
      rxErrorCounter: 0,
      txQueue: [],
      rxQueue: [],
      filters: [],
      lastTransmissionTime: 0,
      canController: {
        bitRate: 500000,
        prescaler: 16,
        timeQuanta: 1,
        propagationSegment: 2,
        phaseSegment1: 4,
        phaseSegment2: 3,
        sjw: 1,
        samplePoint: 87.5,
        totalTimeQuanta: 10,
      },
      signals: [],
    };

    const bodyController: CANNode = {
      id: 'ecu-body',
      name: 'Body Controller',
      nodeState: 'error-active',
      txErrorCounter: 0,
      rxErrorCounter: 0,
      txQueue: [],
      rxQueue: [],
      filters: [],
      lastTransmissionTime: 0,
      canController: {
        bitRate: 500000,
        prescaler: 16,
        timeQuanta: 1,
        propagationSegment: 2,
        phaseSegment1: 4,
        phaseSegment2: 3,
        sjw: 1,
        samplePoint: 87.5,
        totalTimeQuanta: 10,
      },
      signals: [],
    };

    setNodes([engineECU, transmissionECU, absECU, dashboardECU, bodyController]);

    // Add nodes to simulator
    simulator.addNode(engineECU);
    simulator.addNode(transmissionECU);
    simulator.addNode(absECU);
    simulator.addNode(dashboardECU);
    simulator.addNode(bodyController);

    // Create demo message database
    const demoMessages: CANMessage[] = [
      {
        id: 0x100,
        name: 'EngineStatus',
        dlc: 8,
        cycleTime: 10,
        signals: [
          {
            name: 'EngineSpeed',
            messageId: 0x100,
            startBit: 0,
            length: 16,
            byteOrder: 'little-endian',
            isSigned: false,
            factor: 0.125,
            offset: 0,
            minValue: 0,
            maxValue: 16383.875,
            unit: 'rpm',
            description: 'Engine speed in RPM',
          },
          {
            name: 'CoolantTemp',
            messageId: 0x100,
            startBit: 16,
            length: 8,
            byteOrder: 'little-endian',
            isSigned: true,
            factor: 1,
            offset: -40,
            minValue: -40,
            maxValue: 215,
            unit: '°C',
            description: 'Engine coolant temperature',
          },
          {
            name: 'ThrottlePosition',
            messageId: 0x100,
            startBit: 24,
            length: 8,
            byteOrder: 'little-endian',
            isSigned: false,
            factor: 0.4,
            offset: 0,
            minValue: 0,
            maxValue: 100,
            unit: '%',
            description: 'Throttle pedal position',
          },
        ],
        description: 'Engine status message',
        transmitterNodeId: 'ecu-engine',
      },
      {
        id: 0x200,
        name: 'TransmissionStatus',
        dlc: 8,
        cycleTime: 20,
        signals: [
          {
            name: 'GearPosition',
            messageId: 0x200,
            startBit: 0,
            length: 4,
            byteOrder: 'little-endian',
            isSigned: false,
            factor: 1,
            offset: 0,
            minValue: 0,
            maxValue: 15,
            unit: '',
            description: 'Current gear (0=P, 1=R, 2=N, 3=D, etc.)',
          },
          {
            name: 'TransmissionTemp',
            messageId: 0x200,
            startBit: 8,
            length: 8,
            byteOrder: 'little-endian',
            isSigned: true,
            factor: 1,
            offset: -40,
            minValue: -40,
            maxValue: 215,
            unit: '°C',
            description: 'Transmission fluid temperature',
          },
        ],
        description: 'Transmission status message',
        transmitterNodeId: 'ecu-transmission',
      },
      {
        id: 0x300,
        name: 'ABSStatus',
        dlc: 8,
        cycleTime: 5,
        signals: [
          {
            name: 'WheelSpeedFL',
            messageId: 0x300,
            startBit: 0,
            length: 16,
            byteOrder: 'little-endian',
            isSigned: false,
            factor: 0.01,
            offset: 0,
            minValue: 0,
            maxValue: 655.35,
            unit: 'km/h',
            description: 'Front left wheel speed',
          },
          {
            name: 'WheelSpeedFR',
            messageId: 0x300,
            startBit: 16,
            length: 16,
            byteOrder: 'little-endian',
            isSigned: false,
            factor: 0.01,
            offset: 0,
            minValue: 0,
            maxValue: 655.35,
            unit: 'km/h',
            description: 'Front right wheel speed',
          },
        ],
        description: 'ABS wheel speed message',
        transmitterNodeId: 'ecu-abs',
      },
      {
        id: 0x400,
        name: 'DashboardDisplay',
        dlc: 8,
        cycleTime: 50,
        signals: [
          {
            name: 'VehicleSpeed',
            messageId: 0x400,
            startBit: 0,
            length: 16,
            byteOrder: 'little-endian',
            isSigned: false,
            factor: 0.01,
            offset: 0,
            minValue: 0,
            maxValue: 655.35,
            unit: 'km/h',
            description: 'Vehicle speed for speedometer',
          },
          {
            name: 'FuelLevel',
            messageId: 0x400,
            startBit: 16,
            length: 8,
            byteOrder: 'little-endian',
            isSigned: false,
            factor: 0.4,
            offset: 0,
            minValue: 0,
            maxValue: 100,
            unit: '%',
            description: 'Fuel tank level percentage',
          },
        ],
        description: 'Dashboard display data',
        transmitterNodeId: 'ecu-dashboard',
      },
    ];

    setMessageDatabase(demoMessages);
  };

  const addNode = (node: CANNode) => {
    setNodes(prev => [...prev, node]);
    simulator.addNode(node);
  };

  const removeNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    simulator.removeNode(id);
  };

  const queueFrame = (nodeId: string, frame: CANFrame) => {
    simulator.queueFrame(nodeId, frame);
  };

  const updateNode = (id: string, updates: Partial<CANNode>) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const addMessageToDatabase = (message: CANMessage) => {
    setMessageDatabase(prev => [...prev, message]);
  };

  const removeMessageFromDatabase = (id: number) => {
    setMessageDatabase(prev => prev.filter(m => m.id !== id));
  };

  return (
    <SimulationContext.Provider value={{
      simulator,
      nodes,
      messageDatabase,
      addNode,
      removeNode,
      queueFrame,
      updateNode,
      addMessageToDatabase,
      removeMessageFromDatabase,
    }}>
      <div className="flex min-h-screen bg-can-darker">
        {/* Sidebar */}
        <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-can-dark border-r border-can-border flex flex-col transition-all duration-300`}>
          {/* Logo */}
          <div className="p-4 border-b border-can-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-can-accent flex items-center justify-center">
              <Network className="w-6 h-6 text-can-dark" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-can-text">CAN Lab</h1>
                <p className="text-xs text-can-muted">Protocol Simulator</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {navItems.map(item => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-can-accent text-can-dark font-medium'
                          : 'text-can-muted hover:text-can-text hover:bg-can-card'
                      }`
                    }
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Collapse button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-4 border-t border-can-border text-can-muted hover:text-can-text transition-colors"
          >
            {sidebarCollapsed ? '→' : '← Collapse'}
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/fundamentals" element={<CANFundamentals />} />
            <Route path="/frame-explorer" element={<FrameExplorer />} />
            <Route path="/bit-level" element={<BitLevelAnalyzer />} />
            <Route path="/arbitration" element={<ArbitrationSimulator />} />
            <Route path="/error-simulation" element={<ErrorSimulation />} />
            <Route path="/bus-simulator" element={<BusSimulator />} />
            <Route path="/message-database" element={<MessageDatabase />} />
            <Route path="/signal-decoder" element={<SignalDecoder />} />
            <Route path="/filters" element={<FiltersPage />} />
            <Route path="/bit-timing" element={<BitTiming />} />
            <Route path="/can-fd" element={<CANFD />} />
            <Route path="/diagnostics" element={<Diagnostics />} />
            <Route path="/labs" element={<PracticalLabs />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/playground" element={<Playground />} />
          </Routes>
        </main>
      </div>
    </SimulationContext.Provider>
  );
}

export default App;