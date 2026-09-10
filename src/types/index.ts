// Core CAN Protocol Types and Interfaces

export type FrameType = 'standard' | 'extended' | 'can-fd';
export type NodeState = 'error-active' | 'error-passive' | 'bus-off';
export type BitState = 'dominant' | 'recessive';
export type ErrorType = 'bit-error' | 'stuff-error' | 'crc-error' | 'form-error' | 'ack-error' | 'none';

/**
 * CAN Frame Structure
 * Represents a complete CAN message
 */
export interface CANFrame {
  id: number;
  frameType: FrameType;
  dlc: number; // Data Length Code (0-8 for CAN 2.0, 0-15 for CAN FD)
  data: number[]; // Payload bytes
  rtr: boolean; // Remote Transmission Request
  esi: boolean; // Error State Indicator (CAN FD only)
  brs: boolean; // Bit Rate Switch (CAN FD only)
  timestamp: number; // Milliseconds since simulation start
  transmitterNodeId: string;
  crc: number;
  crcCalculated: boolean;
  stuffedBits: number[];
  isStuffingRequired: boolean;
}

/**
 * CAN Bit
 * Represents a single bit in a CAN frame
 */
export interface CANBit {
  index: number;
  value: BitState;
  fieldName: string;
  fieldIndex: number;
  canPhase: 'arbitration' | 'data' | 'crc' | 'ack' | 'eof';
  busValue: BitState;
  dominantWriters: string[]; // Nodes that wrote dominant
  samplePoint: boolean;
  stuffBit: boolean;
}

/**
 * CAN Node
 * Represents an ECU or controller on the CAN bus
 */
export interface CANNode {
  id: string;
  name: string;
  nodeState: NodeState;
  txErrorCounter: number; // TEC
  rxErrorCounter: number; // REC
  txQueue: CANFrame[];
  rxQueue: CANFrame[];
  filters: CANFilter[];
  lastTransmissionTime: number;
  canController: CANController;
  signals: CANSignal[];
}

/**
 * CAN Controller
 * Configuration and state of a CAN controller
 */
export interface CANController {
  bitRate: number; // bits per second
  prescaler: number;
  timeQuanta: number;
  propagationSegment: number; // Tprop
  phaseSegment1: number; // Phase1
  phaseSegment2: number; // Phase2
  sjw: number; // Synchronization Jump Width
  samplePoint: number; // As percentage of bit time
  totalTimeQuanta: number;
}

/**
 * CAN Bus
 * Central bus representing the CAN network
 */
export interface CANBus {
  nodes: Map<string, CANNode>;
  busLoad: number; // Percentage
  txFramesPerSec: number;
  rxFramesPerSec: number;
  errorFrameCount: number;
  messageLog: CANMessageLogEntry[];
  currentArbitrationWinner: string | null;
  busState: 'idle' | 'arbitration' | 'transmission' | 'error' | 'off';
}

/**
 * CAN Message Log Entry
 */
export interface CANMessageLogEntry {
  timestamp: number;
  direction: 'tx' | 'rx' | 'error';
  nodeId: string;
  frame: CANFrame;
  status: 'success' | 'error' | 'pending';
  errorType: ErrorType;
}

/**
 * CAN Filter
 * Acceptance filter configuration
 */
export interface CANFilter {
  type: 'id' | 'mask' | 'range';
  idFilter: number;
  maskFilter: number;
  rangeStart?: number;
  rangeEnd?: number;
  enabled: boolean;
}

/**
 * CAN Signal
 * Decoded signal information (DBC-like)
 */
export interface CANSignal {
  name: string;
  messageId: number;
  startBit: number;
  length: number; // bits
  byteOrder: 'big-endian' | 'little-endian';
  isSigned: boolean;
  factor: number;
  offset: number;
  minValue: number;
  maxValue: number;
  unit: string;
  description?: string;
}

/**
 * CAN Message Database Entry
 */
export interface CANMessage {
  id: number;
  name: string;
  dlc: number;
  cycleTime: number; // milliseconds
  signals: CANSignal[];
  description: string;
  transmitterNodeId: string;
}

/**
 * CAN Bit Timing Calculation
 */
export interface CANBitTiming {
  clockFrequency: number;
  prescaler: number;
  timeQuantaFrequency: number;
  propagationSegment: number;
  phaseSegment1: number;
  phaseSegment2: number;
  sjw: number;
  samplePoint: number;
  totalTimeQuanta: number;
  nominalBitRate: number;
  isValid: boolean;
  errorPercentage: number;
}

/**
 * CAN Simulation State
 */
export interface CANSimulationState {
  isRunning: boolean;
  isPaused: boolean;
  simulationTime: number; // milliseconds
  busState: 'idle' | 'arbitration' | 'transmission' | 'error';
  arbitrationInProgress: boolean;
  currentTransmittingNode: string | null;
  frameBeingTransmitted: CANFrame | null;
  currentBitIndex: number;
  simulationSpeed: number; // 1.0 = real-time
  errorInjectionActive: boolean;
  errorInjectionType: ErrorType;
  errorInjectionBitIndex: number;
}

/**
 * CAN Error State
 */
export interface CANError {
  type: ErrorType;
  nodeId: string;
  timestamp: number;
  description: string;
  bitIndex?: number;
  expectedValue?: BitState;
  observedValue?: BitState;
}

/**
 * Learning Module Progress
 */
export interface LearningProgress {
  completedLessons: string[];
  completedLabs: string[];
  quizScores: Map<string, number>;
  totalLessonTime: number;
  weakTopics: string[];
}

/**
 * Experiment Configuration (for save/load)
 */
export interface ExperimentConfig {
  name: string;
  description: string;
  timestamp: number;
  nodes: CANNode[];
  messages: CANMessage[];
  busConfig: Partial<CANController>;
  simulationState: Partial<CANSimulationState>;
}

/**
 * Validation Result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}