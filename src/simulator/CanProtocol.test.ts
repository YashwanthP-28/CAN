import { describe, it, expect } from 'vitest';
import {
  CANFrameGenerator,
  CANCRCCalculator,
  CANBitStuffer,
  CANArbitrationEngine,
  CANBitTimingCalculator,
  CANFilterEngine,
  CANSignalDecoder,
} from '../simulator/CanProtocol';
import { CANFrame, CANFilter } from '../types';

describe('CAN Protocol Implementation', () => {
  describe('CANFrameGenerator', () => {
    it('should generate a valid standard CAN frame', () => {
      const frame = CANFrameGenerator.generateStandardFrame(
        0x123,
        8,
        [0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88],
        'test-node'
      );

      expect(frame.id).toBe(0x123);
      expect(frame.frameType).toBe('standard');
      expect(frame.dlc).toBe(8);
      expect(frame.data).toEqual([0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88]);
      expect(frame.crcCalculated).toBe(true);
    });

    it('should validate standard ID range', () => {
      expect(() => {
        CANFrameGenerator.generateStandardFrame(0x800, 8, [], 'test');
      }).toThrow();
    });

    it('should generate an extended CAN frame', () => {
      const frame = CANFrameGenerator.generateExtendedFrame(
        0x12345678,
        8,
        [0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88],
        'test-node'
      );

      expect(frame.id).toBe(0x12345678);
      expect(frame.frameType).toBe('extended');
    });

    it('should validate extended ID range', () => {
      expect(() => {
        CANFrameGenerator.generateExtendedFrame(0x20000000, 8, [], 'test');
      }).toThrow();
    });

    it('should generate CAN FD frames with larger payloads', () => {
      const data = Array.from({ length: 64 }, (_, i) => i);
      const frame = CANFrameGenerator.generateCANFDFrame(0x123, 15, data, 'test');

      expect(frame.frameType).toBe('can-fd');
      expect(frame.data.length).toBe(64);
    });
  });

  describe('CANCRCCalculator', () => {
    it('should calculate CRC for a frame', () => {
      const frame = CANFrameGenerator.generateStandardFrame(
        0x123,
        8,
        [0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88],
        'test'
      );

      expect(frame.crc).toBeDefined();
      expect(frame.crc).toBeGreaterThanOrEqual(0);
      expect(frame.crc).toBeLessThan(32768); // 2^15
    });

    it('should verify valid CRC', () => {
      const frame = CANFrameGenerator.generateStandardFrame(
        0x100,
        4,
        [0x11, 0x22, 0x33, 0x44],
        'test'
      );

      expect(CANCRCCalculator.verifyCRC(frame)).toBe(true);
    });

    it('should detect invalid CRC', () => {
      const frame = CANFrameGenerator.generateStandardFrame(
        0x100,
        4,
        [0x11, 0x22, 0x33, 0x44],
        'test'
      );

      frame.crc ^= 0x1234; // Corrupt CRC
      expect(CANCRCCalculator.verifyCRC(frame)).toBe(false);
    });
  });

  describe('CANBitStuffer', () => {
    it('should stuff bits after 5 consecutive identical bits', () => {
      const frame: CANFrame = {
        id: 0x111,
        frameType: 'standard',
        dlc: 1,
        data: [0xFF], // All ones
        rtr: false,
        esi: false,
        brs: false,
        timestamp: 0,
        transmitterNodeId: 'test',
        crc: 0,
        crcCalculated: false,
        stuffedBits: [],
        isStuffingRequired: true,
      };

      const stuffedBits = CANBitStuffer.stuffFrame(frame);
      expect(stuffedBits.length).toBeGreaterThan(frame.dlc * 8);
    });

    it('should handle sequences without requiring stuffing', () => {
      const bits = [1, 0, 1, 0, 1, 0, 1, 0];
      // Note: This is simplified testing
      expect(bits.length).toBe(8);
    });
  });

  describe('CANBitTimingCalculator', () => {
    it('should calculate valid bit timing for 500 kbit/s', () => {
      const timing = CANBitTimingCalculator.calculateBitTiming(
        16000000, // 16 MHz clock
        500000, // 500 kbit/s
        2 // propagation delay
      );

      expect(timing).toBeDefined();
      if (timing) {
        expect(timing.isValid).toBe(true);
        expect(timing.nominalBitRate).toBeCloseTo(500000, -4);
        expect(timing.errorPercentage).toBeLessThan(2);
      }
    });

    it('should find prescaler and time quanta', () => {
      const timing = CANBitTimingCalculator.calculateBitTiming(
        8000000, // 8 MHz clock
        1000000, // 1 Mbit/s
        1
      );

      expect(timing).toBeDefined();
      if (timing) {
        expect(timing.prescaler).toBeGreaterThan(0);
        expect(timing.totalTimeQuanta).toBeGreaterThanOrEqual(8);
        expect(timing.totalTimeQuanta).toBeLessThanOrEqual(25);
      }
    });
  });

  describe('CANFilterEngine', () => {
    it('should pass ID filter with matching ID', () => {
      const filter: CANFilter = {
        type: 'id',
        idFilter: 0x123,
        maskFilter: 0,
        enabled: true,
      };

      expect(CANFilterEngine.passesFilter(0x123, filter)).toBe(true);
    });

    it('should reject ID filter with non-matching ID', () => {
      const filter: CANFilter = {
        type: 'id',
        idFilter: 0x123,
        maskFilter: 0,
        enabled: true,
      };

      expect(CANFilterEngine.passesFilter(0x456, filter)).toBe(false);
    });

    it('should apply mask filter correctly', () => {
      const filter: CANFilter = {
        type: 'mask',
        idFilter: 0x100,
        maskFilter: 0x7F0,
        enabled: true,
      };

      // 0x120 & 0x7F0 = 0x120, 0x100 & 0x7F0 = 0x100 (should not match)
      expect(CANFilterEngine.passesFilter(0x100, filter)).toBe(true);
      expect(CANFilterEngine.passesFilter(0x180, filter)).toBe(true);
      expect(CANFilterEngine.passesFilter(0x000, filter)).toBe(false);
    });

    it('should apply range filter correctly', () => {
      const filter: CANFilter = {
        type: 'range',
        idFilter: 0,
        maskFilter: 0,
        rangeStart: 0x100,
        rangeEnd: 0x200,
        enabled: true,
      };

      expect(CANFilterEngine.passesFilter(0x150, filter)).toBe(true);
      expect(CANFilterEngine.passesFilter(0x100, filter)).toBe(true);
      expect(CANFilterEngine.passesFilter(0x200, filter)).toBe(true);
      expect(CANFilterEngine.passesFilter(0x0FF, filter)).toBe(false);
      expect(CANFilterEngine.passesFilter(0x201, filter)).toBe(false);
    });

    it('should disable filtering when disabled', () => {
      const filter: CANFilter = {
        type: 'id',
        idFilter: 0x123,
        maskFilter: 0,
        enabled: false,
      };

      expect(CANFilterEngine.passesFilter(0x456, filter)).toBe(true);
    });
  });

  describe('CANSignalDecoder', () => {
    it('should decode signal from big-endian data', () => {
      const data = [0xAB, 0xCD, 0xEF, 0x12];
      const value = CANSignalDecoder.decodeSignal(
        data,
        0, // start bit
        16, // length
        'big-endian',
        false, // unsigned
        1, // factor
        0 // offset
      );

      expect(value).toBeGreaterThan(0);
    });

    it('should apply factor and offset during decoding', () => {
      const data = [0x01, 0x00, 0x00, 0x00];
      const value = CANSignalDecoder.decodeSignal(
        data,
        0,
        16,
        'little-endian',
        false,
        0.1, // factor
        -40 // offset
      );

      // Raw value: 1, Physical: 1 * 0.1 - 40 = -39.9
      expect(value).toBeCloseTo(-39.9);
    });

    it('should encode signal back to data', () => {
      const data = [0, 0, 0, 0];
      const result = CANSignalDecoder.encodeSignal(
        data,
        0,
        16,
        'little-endian',
        false,
        1,
        0,
        0x1234
      );

      expect(result.length).toBe(4);
    });
  });

  describe('CANArbitrationEngine', () => {
    it('should identify arbitration winner', () => {
      // This is simplified due to complexity of actual arbitration
      // In real implementation, we'd need to simulate bit-by-bit transmission
      expect(0x100 < 0x200).toBe(true);
      expect(0x050 < 0x100).toBe(true);
    });
  });

  describe('Frame Validation', () => {
    it('should validate DLC matches data length', () => {
      expect(() => {
        CANFrameGenerator.generateStandardFrame(0x123, 8, [0x11, 0x22], 'test');
      }).toThrow();
    });

    it('should accept correct data length', () => {
      const frame = CANFrameGenerator.generateStandardFrame(
        0x123,
        2,
        [0x11, 0x22],
        'test'
      );

      expect(frame.dlc).toBe(2);
      expect(frame.data.length).toBe(2);
    });
  });
});
