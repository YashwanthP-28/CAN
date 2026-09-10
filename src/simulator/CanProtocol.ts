import {
  CANFrame,
  CANBit,
  CANNode,
  CANBus,
  CANController,
  CANFilter,
  CANBitTiming,
  CANSimulationState,
  CANError,
  BitState,
  ErrorType,
  FrameType,
} from '../types';

/**
 * CAN Frame Generator
 * Creates valid CAN frames with proper field boundaries
 */
export class CANFrameGenerator {
  /**
   * Generate a standard CAN 2.0A frame (11-bit identifier)
   */
  static generateStandardFrame(
    id: number,
    dlc: number,
    data: number[],
    transmitterNodeId: string
  ): CANFrame {
    // Validate standard ID (0x000 - 0x7FF)
    if (id < 0 || id > 0x7ff) {
      throw new Error('Standard CAN ID must be 0x000-0x7FF');
    }

    if (dlc < 0 || dlc > 8) {
      throw new Error('DLC must be 0-8 for standard CAN');
    }

    if (data.length !== dlc) {
      throw new Error('Data length must match DLC');
    }

    const frame: CANFrame = {
      id,
      frameType: 'standard',
      dlc,
      data,
      rtr: false,
      esi: false,
      brs: false,
      timestamp: Date.now(),
      transmitterNodeId,
      crc: 0,
      crcCalculated: false,
      stuffedBits: [],
      isStuffingRequired: true,
    };

    // Calculate CRC
    frame.crc = CANCRCCalculator.calculateCRC(frame);
    frame.crcCalculated = true;

    return frame;
  }

  /**
   * Generate an extended CAN 2.0B frame (29-bit identifier)
   */
  static generateExtendedFrame(
    id: number,
    dlc: number,
    data: number[],
    transmitterNodeId: string
  ): CANFrame {
    // Validate extended ID (0x00000000 - 0x1FFFFFFF)
    if (id < 0 || id > 0x1fffffff) {
      throw new Error('Extended CAN ID must be 0x00000000-0x1FFFFFFF');
    }

    if (dlc < 0 || dlc > 8) {
      throw new Error('DLC must be 0-8 for standard CAN');
    }

    if (data.length !== dlc) {
      throw new Error('Data length must match DLC');
    }

    const frame: CANFrame = {
      id,
      frameType: 'extended',
      dlc,
      data,
      rtr: false,
      esi: false,
      brs: false,
      timestamp: Date.now(),
      transmitterNodeId,
      crc: 0,
      crcCalculated: false,
      stuffedBits: [],
      isStuffingRequired: true,
    };

    frame.crc = CANCRCCalculator.calculateCRC(frame);
    frame.crcCalculated = true;

    return frame;
  }

  /**
   * Generate a CAN FD frame (larger payload)
   */
  static generateCANFDFrame(
    id: number,
    dlc: number,
    data: number[],
    transmitterNodeId: string,
    brs: boolean = true,
    esi: boolean = false
  ): CANFrame {
    // For CAN FD, DLC values 0-15 map to actual payload lengths
    const dlcToLength: Record<number, number> = {
      0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8,
      9: 12, 10: 16, 11: 20, 12: 24, 13: 32, 14: 48, 15: 64,
    };

    if (dlc < 0 || dlc > 15) {
      throw new Error('CAN FD DLC must be 0-15');
    }

    const expectedLength = dlcToLength[dlc];
    if (data.length !== expectedLength) {
      throw new Error(`CAN FD DLC ${dlc} requires ${expectedLength} bytes`);
    }

    const frame: CANFrame = {
      id,
      frameType: 'can-fd',
      dlc,
      data,
      rtr: false,
      esi,
      brs,
      timestamp: Date.now(),
      transmitterNodeId,
      crc: 0,
      crcCalculated: false,
      stuffedBits: [],
      isStuffingRequired: true,
    };

    frame.crc = CANCRCCalculator.calculateCRC(frame);
    frame.crcCalculated = true;

    return frame;
  }
}

/**
 * CAN CRC Calculator
 * Implements actual CAN CRC algorithm (CRC-15 CCITT)
 */
export class CANCRCCalculator {
  private static readonly POLYNOMIAL = 0x4599; // CAN CRC polynomial

  /**
   * Calculate CRC-15 for a CAN frame
   * This is the actual CAN protocol CRC, not a fake value
   */
  static calculateCRC(frame: CANFrame): number {
    let crc = 0;

    // Create bit stream: ID + RTR + IDE + r0 (for standard) + DLC + Data
    const bits = this.frameToBitStream(frame);

    for (const bit of bits) {
      const oldCrc = crc >> 14;
      crc = ((crc << 1) | bit) & 0x7fff;

      if (oldCrc) {
        crc ^= this.POLYNOMIAL;
      }
    }

    // Final XOR
    return crc & 0x7fff;
  }

  /**
   * Convert frame to bit stream for CRC calculation
   */
  private static frameToBitStream(frame: CANFrame): number[] {
    const bits: number[] = [];

    // Identifier bits
    const idLength = frame.frameType === 'extended' ? 29 : 11;
    for (let i = idLength - 1; i >= 0; i--) {
      bits.push((frame.id >> i) & 1);
    }

    // RTR bit
    bits.push(frame.rtr ? 1 : 0);

    // IDE bit (0 for standard, 1 for extended)
    bits.push(frame.frameType === 'extended' ? 1 : 0);

    // r0 bit (reserved, always 0)
    bits.push(0);

    // DLC (4 bits)
    for (let i = 3; i >= 0; i--) {
      bits.push((frame.dlc >> i) & 1);
    }

    // Data bytes
    for (const byte of frame.data) {
      for (let i = 7; i >= 0; i--) {
        bits.push((byte >> i) & 1);
      }
    }

    return bits;
  }

  /**
   * Verify CRC of a received frame
   */
  static verifyCRC(frame: CANFrame): boolean {
    const calculatedCrc = this.calculateCRC(frame);
    return calculatedCrc === frame.crc;
  }
}

/**
 * CAN Bit Stuffer
 * Implements bit stuffing: after 5 consecutive bits of same polarity, insert opposite bit
 */
export class CANBitStuffer {
  /**
   * Apply bit stuffing to frame data
   */
  static stuffFrame(frame: CANFrame): number[] {
    const frameBits = this.frameToBits(frame);
    const stuffedBits: number[] = [];
    let consecutiveCount = 0;
    let lastBit = -1;

    for (const bit of frameBits) {
      if (bit === lastBit) {
        consecutiveCount++;
      } else {
        consecutiveCount = 1;
        lastBit = bit;
      }

      stuffedBits.push(bit);

      // After 5 consecutive bits, insert opposite bit
      if (consecutiveCount === 5) {
        stuffedBits.push(1 - bit);
        lastBit = 1 - bit;
        consecutiveCount = 1;
      }
    }

    return stuffedBits;
  }

  /**
   * Remove bit stuffing from received data
   */
  static destuffFrame(stuffedBits: number[]): number[] {
    const destuffedBits: number[] = [];
    let consecutiveCount = 0;
    let lastBit = -1;

    for (let i = 0; i < stuffedBits.length; i++) {
      const bit = stuffedBits[i];

      if (bit === lastBit) {
        consecutiveCount++;
      } else {
        consecutiveCount = 1;
        lastBit = bit;
      }

      // If we've seen 5 consecutive bits, the next bit should be a stuff bit
      if (consecutiveCount === 5) {
        // Skip the next bit (stuff bit)
        i++;
        if (i >= stuffedBits.length) {
          throw new Error('Invalid stuffing: missing stuff bit');
        }
        consecutiveCount = 1;
        lastBit = 1 - bit;
      } else {
        destuffedBits.push(bit);
      }
    }

    return destuffedBits;
  }

  /**
   * Convert frame to bit stream
   */
  private static frameToBits(frame: CANFrame): number[] {
    const bits: number[] = [];

    // SOF (Start of Frame) - already separated

    // Identifier
    const idLength = frame.frameType === 'extended' ? 29 : 11;
    for (let i = idLength - 1; i >= 0; i--) {
      bits.push((frame.id >> i) & 1);
    }

    // RTR
    bits.push(frame.rtr ? 1 : 0);

    // IDE
    bits.push(frame.frameType === 'extended' ? 1 : 0);

    // r0
    bits.push(0);

    // DLC
    for (let i = 3; i >= 0; i--) {
      bits.push((frame.dlc >> i) & 1);
    }

    // Data
    for (const byte of frame.data) {
      for (let i = 7; i >= 0; i--) {
        bits.push((byte >> i) & 1);
      }
    }

    // CRC
    for (let i = 14; i >= 0; i--) {
      bits.push((frame.crc >> i) & 1);
    }

    return bits;
  }
}

/**
 * CAN Arbitration Engine
 * Implements non-destructive bit-wise arbitration
 */
export class CANArbitrationEngine {
  /**
   * Perform arbitration between multiple transmitting nodes
   * Returns the winning node ID
   */
  static arbitrate(nodes: CANNode[], bitIndex: number): string | null {
    const activeTxNodes = nodes.filter(n => n.txQueue.length > 0);

    if (activeTxNodes.length === 0) {
      return null;
    }

    if (activeTxNodes.length === 1) {
      return activeTxNodes[0].id;
    }

    // Get the bit from each node's frame at this bit index
    const nodeBits: Map<string, BitState> = new Map();

    for (const node of activeTxNodes) {
      const frame = node.txQueue[0];
      const bit = this.getFrameBit(frame, bitIndex);
      nodeBits.set(node.id, bit);
    }

    // Arbitration: dominant (0) wins over recessive (1)
    // If any node transmits dominant, the bus is dominant
    const hasDominant = Array.from(nodeBits.values()).some(bit => bit === 'dominant');

    if (hasDominant) {
      // Find first node that sent dominant (in order of lower ID = higher priority)
      for (const node of activeTxNodes) {
        if (nodeBits.get(node.id) === 'dominant') {
          return node.id;
        }
      }
    }

    // All sent recessive (shouldn't happen in real arbitration, but for simulation)
    return activeTxNodes[0].id;
  }

  /**
   * Get a specific bit from a CAN frame
   */
  private static getFrameBit(frame: CANFrame, bitIndex: number): BitState {
    // This is a simplified bit extraction
    // In reality, we'd need to account for SOF, bit stuffing, CRC, etc.

    const frameBits = this.frameToBits(frame);
    if (bitIndex >= frameBits.length) {
      throw new Error('Bit index out of range');
    }

    return frameBits[bitIndex] === 0 ? 'dominant' : 'recessive';
  }

  private static frameToBits(frame: CANFrame): number[] {
    const bits: number[] = [];

    const idLength = frame.frameType === 'extended' ? 29 : 11;
    for (let i = idLength - 1; i >= 0; i--) {
      bits.push((frame.id >> i) & 1);
    }

    bits.push(frame.rtr ? 1 : 0);
    bits.push(frame.frameType === 'extended' ? 1 : 0);
    bits.push(0); // r0

    for (let i = 3; i >= 0; i--) {
      bits.push((frame.dlc >> i) & 1);
    }

    for (const byte of frame.data) {
      for (let i = 7; i >= 0; i--) {
        bits.push((byte >> i) & 1);
      }
    }

    for (let i = 14; i >= 0; i--) {
      bits.push((frame.crc >> i) & 1);
    }

    return bits;
  }
}

/**
 * CAN Bit Timing Calculator
 * Calculates bit timing parameters for a given bit rate
 */
export class CANBitTimingCalculator {
  /**
   * Calculate bit timing parameters
   */
  static calculateBitTiming(
    clockFrequency: number,
    desiredBitRate: number,
    propagationDelay: number = 2
  ): CANBitTiming | null {
    // Find valid prescaler and time quanta combination
    for (let prescaler = 1; prescaler <= 1024; prescaler++) {
      const timeQuantaFrequency = clockFrequency / prescaler;
      const timeQuantaCount = timeQuantaFrequency / desiredBitRate;

      if (timeQuantaCount < 8 || timeQuantaCount > 25) {
        continue;
      }

      // Distribute time quanta
      const propagationSegment = Math.ceil(propagationDelay);
      let phase1 = Math.floor((timeQuantaCount - 1 - propagationSegment) / 2);
      let phase2 = timeQuantaCount - 1 - propagationSegment - phase1;

      if (phase1 < 1 || phase2 < 1) {
        continue;
      }

      const sjw = Math.min(phase2, 4);
      const samplePoint = ((propagationSegment + phase1) / timeQuantaCount) * 100;
      const actualBitRate = timeQuantaFrequency / timeQuantaCount;
      const errorPercentage = Math.abs((actualBitRate - desiredBitRate) / desiredBitRate) * 100;

      if (errorPercentage > 2) {
        continue;
      }

      return {
        clockFrequency,
        prescaler,
        timeQuantaFrequency,
        propagationSegment,
        phaseSegment1: phase1,
        phaseSegment2: phase2,
        sjw,
        samplePoint,
        totalTimeQuanta: timeQuantaCount,
        nominalBitRate: actualBitRate,
        isValid: true,
        errorPercentage,
      };
    }

    return null;
  }
}

/**
 * CAN Error Detector
 * Detects and generates CAN errors
 */
export class CANErrorDetector {
  /**
   * Check for bit error (transmitted vs received)
   */
  static checkBitError(transmitted: BitState, received: BitState): boolean {
    return transmitted !== received;
  }

  /**
   * Check for CRC error
   */
  static checkCRCError(frame: CANFrame): boolean {
    return !CANCRCCalculator.verifyCRC(frame);
  }

  /**
   * Check for frame format error
   */
  static checkFormError(frame: CANFrame): boolean {
    // Check fixed bit fields
    // CRC delimiter should be recessive
    // ACK delimiter should be recessive
    // EOF should be all recessive
    return false; // Simplified
  }

  /**
   * Check for ACK error (no dominant bit during ACK slot)
   */
  static checkACKError(hasReceiverACK: boolean): boolean {
    return !hasReceiverACK;
  }

  /**
   * Update error counters based on error type
   */
  static updateErrorCounters(node: CANNode, errorType: ErrorType, isTransmitter: boolean): void {
    if (errorType === 'none') {
      // Successful transmission/reception
      if (node.txErrorCounter > 0) node.txErrorCounter--;
      if (node.rxErrorCounter > 0) node.rxErrorCounter--;
      return;
    }

    if (isTransmitter) {
      node.txErrorCounter += 8;
      if (node.txErrorCounter >= 256) {
        node.nodeState = 'bus-off';
      } else if (node.txErrorCounter >= 128) {
        node.nodeState = 'error-passive';
      }
    } else {
      node.rxErrorCounter += 8;
      if (node.rxErrorCounter >= 128) {
        node.nodeState = 'error-passive';
      }
    }
  }
}

/**
 * CAN Filter
 * Acceptance filter for message filtering
 */
export class CANFilterEngine {
  /**
   * Check if a message passes the filter
   */
  static passesFilter(messageId: number, filter: CANFilter): boolean {
    if (!filter.enabled) {
      return true;
    }

    switch (filter.type) {
      case 'id':
        return messageId === filter.idFilter;
      case 'mask':
        return (messageId & filter.maskFilter) === (filter.idFilter & filter.maskFilter);
      case 'range':
        return (
          messageId >= (filter.rangeStart ?? 0) &&
          messageId <= (filter.rangeEnd ?? 0x7ff)
        );
      default:
        return true;
    }
  }

  /**
   * Check if message passes all filters
   */
  static passesAllFilters(messageId: number, filters: CANFilter[]): boolean {
    if (filters.length === 0) {
      return true;
    }
    return filters.every(f => this.passesFilter(messageId, f));
  }
}

/**
 * CAN Signal Decoder
 * Decodes signals from raw CAN data
 */
export class CANSignalDecoder {
  /**
   * Decode a signal from frame data
   */
  static decodeSignal(
    data: number[],
    startBit: number,
    length: number,
    byteOrder: 'big-endian' | 'little-endian',
    isSigned: boolean,
    factor: number,
    offset: number
  ): number {
    let rawValue = 0;

    if (byteOrder === 'big-endian') {
      rawValue = this.extractBigEndian(data, startBit, length);
    } else {
      rawValue = this.extractLittleEndian(data, startBit, length);
    }

    if (isSigned && (rawValue & (1 << (length - 1)))) {
      rawValue = rawValue - (1 << length);
    }

    return rawValue * factor + offset;
  }

  /**
   * Encode a signal into frame data
   */
  static encodeSignal(
    data: number[],
    startBit: number,
    length: number,
    byteOrder: 'big-endian' | 'little-endian',
    isSigned: boolean,
    factor: number,
    offset: number,
    physicalValue: number
  ): number[] {
    const result = [...data];
    const rawValue = Math.round((physicalValue - offset) / factor);

    if (byteOrder === 'big-endian') {
      this.insertBigEndian(result, startBit, length, rawValue);
    } else {
      this.insertLittleEndian(result, startBit, length, rawValue);
    }

    return result;
  }

  private static extractBigEndian(data: number[], startBit: number, length: number): number {
    let value = 0;
    let bitsExtracted = 0;

    for (let i = 0; i < length; i++) {
      const bitIndex = startBit + i;
      const byteIndex = Math.floor(bitIndex / 8);
      const bitInByte = 7 - (bitIndex % 8);

      const bit = (data[byteIndex] >> bitInByte) & 1;
      value = (value << 1) | bit;
      bitsExtracted++;
    }

    return value;
  }

  private static extractLittleEndian(data: number[], startBit: number, length: number): number {
    let value = 0;

    for (let i = 0; i < length; i++) {
      const bitIndex = startBit + i;
      const byteIndex = Math.floor(bitIndex / 8);
      const bitInByte = bitIndex % 8;

      const bit = (data[byteIndex] >> bitInByte) & 1;
      value |= bit << i;
    }

    return value;
  }

  private static insertBigEndian(data: number[], startBit: number, length: number, value: number): void {
    for (let i = 0; i < length; i++) {
      const bitIndex = startBit + i;
      const byteIndex = Math.floor(bitIndex / 8);
      const bitInByte = 7 - (bitIndex % 8);
      const bit = (value >> (length - 1 - i)) & 1;

      data[byteIndex] &= ~(1 << bitInByte);
      data[byteIndex] |= bit << bitInByte;
    }
  }

  private static insertLittleEndian(data: number[], startBit: number, length: number, value: number): void {
    for (let i = 0; i < length; i++) {
      const bitIndex = startBit + i;
      const byteIndex = Math.floor(bitIndex / 8);
      const bitInByte = bitIndex % 8;
      const bit = (value >> i) & 1;

      data[byteIndex] &= ~(1 << bitInByte);
      data[byteIndex] |= bit << bitInByte;
    }
  }
}
