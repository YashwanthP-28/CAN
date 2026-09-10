import {
  CANFrame,
  CANNode,
  CANBus,
  CANSimulationState,
  CANMessageLogEntry,
  NodeState,
  ErrorType,
} from '../types';
import {
  CANFrameGenerator,
  CANArbitrationEngine,
  CANErrorDetector,
  CANFilterEngine,
  CANCRCCalculator,
} from './CanProtocol';

/**
 * Main CAN Bus Simulator
 * Orchestrates the simulation of a CAN network
 */
export class CANBusSimulator {
  private bus: CANBus;
  private simulationState: CANSimulationState;
  private simulationSpeed: number = 1.0;
  private frameTransmissionTime: number = 0;
  private currentBitTime: number = 0;
  private observers: Set<(state: CANSimulationState, bus: CANBus) => void> = new Set();

  constructor() {
    this.bus = {
      nodes: new Map(),
      busLoad: 0,
      txFramesPerSec: 0,
      rxFramesPerSec: 0,
      errorFrameCount: 0,
      messageLog: [],
      currentArbitrationWinner: null,
      busState: 'idle',
    };

    this.simulationState = {
      isRunning: false,
      isPaused: false,
      simulationTime: 0,
      busState: 'idle',
      arbitrationInProgress: false,
      currentTransmittingNode: null,
      frameBeingTransmitted: null,
      currentBitIndex: 0,
      simulationSpeed: 1.0,
      errorInjectionActive: false,
      errorInjectionType: 'none',
      errorInjectionBitIndex: -1,
    };
  }

  /**
   * Add a CAN node to the bus
   */
  addNode(node: CANNode): void {
    this.bus.nodes.set(node.id, node);
  }

  /**
   * Remove a CAN node from the bus
   */
  removeNode(nodeId: string): void {
    this.bus.nodes.delete(nodeId);
  }

  /**
   * Get a node by ID
   */
  getNode(nodeId: string): CANNode | undefined {
    return this.bus.nodes.get(nodeId);
  }

  /**
   * Queue a frame for transmission from a node
   */
  queueFrame(nodeId: string, frame: CANFrame): boolean {
    const node = this.bus.nodes.get(nodeId);
    if (!node) {
      console.error(`Node ${nodeId} not found`);
      return false;
    }

    if (node.nodeState === 'bus-off') {
      console.error(`Node ${nodeId} is in bus-off state`);
      return false;
    }

    node.txQueue.push(frame);
    return true;
  }

  /**
   * Start the simulation
   */
  start(): void {
    this.simulationState.isRunning = true;
    this.simulationState.isPaused = false;
  }

  /**
   * Pause the simulation
   */
  pause(): void {
    this.simulationState.isPaused = true;
  }

  /**
   * Resume the simulation
   */
  resume(): void {
    this.simulationState.isPaused = false;
  }

  /**
   * Reset the simulation
   */
  reset(): void {
    this.simulationState = {
      isRunning: false,
      isPaused: false,
      simulationTime: 0,
      busState: 'idle',
      arbitrationInProgress: false,
      currentTransmittingNode: null,
      frameBeingTransmitted: null,
      currentBitIndex: 0,
      simulationSpeed: 1.0,
      errorInjectionActive: false,
      errorInjectionType: 'none',
      errorInjectionBitIndex: -1,
    };

    // Reset all nodes
    for (const node of this.bus.nodes.values()) {
      node.txQueue = [];
      node.rxQueue = [];
      node.txErrorCounter = 0;
      node.rxErrorCounter = 0;
      node.nodeState = 'error-active';
    }

    this.bus.messageLog = [];
    this.bus.errorFrameCount = 0;
    this.currentBitTime = 0;
  }

  /**
   * Advance simulation by one bit time
   */
  stepBit(): void {
    if (!this.simulationState.isRunning || this.simulationState.isPaused) {
      return;
    }

    // Check if any node wants to transmit
    const nodesWithFrames = Array.from(this.bus.nodes.values()).filter(
      n => n.txQueue.length > 0 && n.nodeState !== 'bus-off'
    );

    if (nodesWithFrames.length > 0 && !this.simulationState.arbitrationInProgress) {
      this.startArbitration(nodesWithFrames);
    }

    if (this.simulationState.arbitrationInProgress) {
      this.processArbitrationBit();
    } else if (this.simulationState.currentTransmittingNode) {
      this.processTransmissionBit();
    }

    this.simulationState.simulationTime += 1; // 1 bit time
    this.currentBitTime++;
    this.notifyObservers();
  }

  /**
   * Start arbitration phase
   */
  private startArbitration(contentionNodes: CANNode[]): void {
    this.simulationState.arbitrationInProgress = true;
    this.simulationState.currentBitIndex = 0;
    this.bus.busState = 'arbitration';
  }

  /**
   * Process one bit during arbitration
   */
  private processArbitrationBit(): void {
    const nodes = Array.from(this.bus.nodes.values());
    const nodesWithFrames = nodes.filter(n => n.txQueue.length > 0 && n.nodeState !== 'bus-off');

    if (nodesWithFrames.length === 0) {
      this.simulationState.arbitrationInProgress = false;
      return;
    }

    // Get the identifier being arbitrated (from first frame in each queue)
    const ids = nodesWithFrames.map(n => n.txQueue[0].id);
    const maxBits = Math.max(...ids.map(id => id.toString(2).length));

    if (this.simulationState.currentBitIndex >= maxBits) {
      // Arbitration complete - one node won
      const winner = nodesWithFrames.reduce((a, b) =>
        a.txQueue[0].id < b.txQueue[0].id ? a : b
      );

      this.simulationState.currentTransmittingNode = winner.id;
      this.simulationState.arbitrationInProgress = false;
      this.simulationState.frameBeingTransmitted = winner.txQueue.shift() || null;
      this.simulationState.currentBitIndex = 0;
      this.bus.busState = 'transmission';
    }

    this.simulationState.currentBitIndex++;
  }

  /**
   * Process one bit during transmission
   */
  private processTransmissionBit(): void {
    const frame = this.simulationState.frameBeingTransmitted;
    const txNode = this.bus.nodes.get(this.simulationState.currentTransmittingNode || '');

    if (!frame || !txNode) {
      this.simulationState.currentTransmittingNode = null;
      this.simulationState.frameBeingTransmitted = null;
      return;
    }

    // Calculate total bits in frame (simplified)
    const totalBits = this.calculateFrameBitCount(frame);

    if (this.simulationState.currentBitIndex >= totalBits) {
      // Frame transmission complete
      this.completeFrameTransmission(frame, txNode);
      this.simulationState.currentTransmittingNode = null;
      this.simulationState.frameBeingTransmitted = null;
      this.bus.busState = 'idle';
    }

    // Check for error injection
    if (
      this.simulationState.errorInjectionActive &&
      this.simulationState.errorInjectionBitIndex === this.simulationState.currentBitIndex
    ) {
      this.injectError(frame, txNode);
    }

    this.simulationState.currentBitIndex++;
  }

  /**
   * Complete frame transmission
   */
  private completeFrameTransmission(frame: CANFrame, txNode: CANNode): void {
    // Add to transmitter's log
    const logEntry: CANMessageLogEntry = {
      timestamp: this.simulationState.simulationTime,
      direction: 'tx',
      nodeId: txNode.id,
      frame,
      status: 'success',
      errorType: 'none',
    };
    this.bus.messageLog.push(logEntry);

    // Distribute to all other nodes (if they pass filtering)
    for (const node of this.bus.nodes.values()) {
      if (node.id !== txNode.id) {
        if (CANFilterEngine.passesAllFilters(frame.id, node.filters)) {
          node.rxQueue.push(frame);

          const rxLogEntry: CANMessageLogEntry = {
            timestamp: this.simulationState.simulationTime,
            direction: 'rx',
            nodeId: node.id,
            frame,
            status: 'success',
            errorType: 'none',
          };
          this.bus.messageLog.push(rxLogEntry);
        }
      }
    }

    // Update error counters (successful transmission)
    CANErrorDetector.updateErrorCounters(txNode, 'none', true);
  }

  /**
   * Inject an error into the frame
   */
  private injectError(frame: CANFrame, txNode: CANNode): void {
    const errorType = this.simulationState.errorInjectionType;

    const logEntry: CANMessageLogEntry = {
      timestamp: this.simulationState.simulationTime,
      direction: 'error',
      nodeId: txNode.id,
      frame,
      status: 'error',
      errorType,
    };
    this.bus.messageLog.push(logEntry);

    CANErrorDetector.updateErrorCounters(txNode, errorType, true);
    this.bus.errorFrameCount++;

    this.simulationState.errorInjectionActive = false;
    this.simulationState.currentTransmittingNode = null;
    this.simulationState.frameBeingTransmitted = null;
    this.bus.busState = 'idle';
  }

  /**
   * Calculate total bits in a frame
   */
  private calculateFrameBitCount(frame: CANFrame): number {
    // Simplified: SOF(1) + ID + RTR + IDE + r0 + DLC(4) + Data + CRC(15) + CRC_delim(1) + ACK(1) + ACK_delim(1) + EOF(7) + IFS(3)
    const idBits = frame.frameType === 'extended' ? 29 : 11;
    const dataBits = frame.dlc * 8;
    return 1 + idBits + 1 + 1 + 1 + 4 + dataBits + 15 + 1 + 1 + 1 + 7 + 3;
  }

  /**
   * Inject an error at a specific bit
   */
  injectErrorAt(errorType: ErrorType, bitIndex: number): void {
    this.simulationState.errorInjectionActive = true;
    this.simulationState.errorInjectionType = errorType;
    this.simulationState.errorInjectionBitIndex = bitIndex;
  }

  /**
   * Get the current bus state
   */
  getBus(): CANBus {
    return this.bus;
  }

  /**
   * Get the current simulation state
   */
  getSimulationState(): CANSimulationState {
    return this.simulationState;
  }

  /**
   * Get message log
   */
  getMessageLog(): CANMessageLogEntry[] {
    return this.bus.messageLog;
  }

  /**
   * Clear message log
   */
  clearLog(): void {
    this.bus.messageLog = [];
  }

  /**
   * Subscribe to simulation state changes
   */
  subscribe(observer: (state: CANSimulationState, bus: CANBus) => void): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  /**
   * Notify all observers
   */
  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer(this.simulationState, this.bus);
    }
  }

  /**
   * Set simulation speed (1.0 = real-time)
   */
  setSimulationSpeed(speed: number): void {
    this.simulationSpeed = Math.max(0.1, Math.min(10, speed));
    this.simulationState.simulationSpeed = this.simulationSpeed;
  }
}
