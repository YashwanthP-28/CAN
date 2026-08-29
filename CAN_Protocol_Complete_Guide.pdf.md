# CAN PROTOCOL COMPLETE GUIDE
## Automotive Embedded Systems Engineering

**Author:** Professional Automotive Engineer  
**Date:** August 29, 2026  
**Version:** 1.0  
**Target Audience:** Automotive Engineers, Embedded Systems Developers, Students

---

## TABLE OF CONTENTS

1. **INTRODUCTION TO CAN**
   - 1.1 What is CAN?
   - 1.2 Historical Context
   - 1.3 CAN Advantages
   - 1.4 Applications

2. **CAN NETWORK ARCHITECTURE**
   - 2.1 Network Topology
   - 2.2 Physical Layer
   - 2.3 CAN Node Architecture
   - 2.4 Termination Resistors

3. **PHYSICAL LAYER DETAILS**
   - 3.1 Differential Signaling
   - 3.2 Voltage Levels
   - 3.3 Noise Rejection
   - 3.4 Bus States

4. **CAN FRAME STRUCTURE**
   - 4.1 Standard Frame Format
   - 4.2 Extended Frame Format
   - 4.3 Frame Fields Breakdown
   - 4.4 Timing Calculations

5. **ARBITRATION MECHANISM**
   - 5.1 Priority-Based Arbitration
   - 5.2 Non-Destructive Operation
   - 5.3 Arbitration Examples
   - 5.4 Importance in Automotive

6. **ERROR DETECTION & HANDLING**
   - 6.1 Five Error Types
   - 6.2 Error Frames
   - 6.3 Fault Confinement
   - 6.4 Recovery Mechanisms

7. **BIT TIMING & SYNCHRONIZATION**
   - 7.1 Bit Time Segments
   - 7.2 Sample Point
   - 7.3 Synchronization Mechanisms
   - 7.4 Baud Rate Calculation

8. **BIT STUFFING**
   - 8.1 Purpose and Mechanism
   - 8.2 Stuff Bit Insertion
   - 8.3 De-stuffing
   - 8.4 Synchronization Maintenance

9. **CAN FD (FLEXIBLE DATA-RATE)**
   - 9.1 Improvements Over CAN 2.0
   - 9.2 Two-Phase Operation
   - 9.3 Bit Rate Switching
   - 9.4 Payload Capacity

10. **REAL AUTOMOTIVE SYSTEMS**
    - 10.1 Typical Automotive Network
    - 10.2 Message Types and IDs
    - 10.3 Diagnostic Systems
    - 10.4 Gateway ECUs

11. **DEBUGGING & ANALYSIS**
    - 11.1 Oscilloscope Views
    - 11.2 Logic Analyzer Setup
    - 11.3 CAN Analyzer Software
    - 11.4 Common Issues and Solutions

12. **IMPLEMENTATION GUIDE**
    - 12.1 Hardware Selection
    - 12.2 Software Design
    - 12.3 Testing Procedures
    - 12.4 Best Practices

---

## 1. INTRODUCTION TO CAN

### 1.1 What is CAN?

**Controller Area Network (CAN)** is a multi-master serial bus standard designed for robust communication between microcontrollers in harsh environments like automotive applications.

**Key Features:**
- Multi-master capability (any node can initiate transmission)
- Message-based protocol (not address-based)
- Priority-based arbitration (lower ID = higher priority)
- Excellent error detection capabilities
- Differential signaling for noise immunity

### 1.2 Historical Context

```
1983: Robert Bosch begins development
1986: First CAN specification released
1991: Mercedes-Benz W140 first production car with CAN
1993: ISO 11898 standardized
2000s: CAN becomes standard in nearly all vehicles
2012: CAN FD specification released
2015: CAN FD ISO standardized
```

### 1.3 CAN vs Other Protocols

| Protocol | Topology | Wires | Speed | Distance | Automotive Use |
|----------|----------|-------|-------|----------|----------------|
| **CAN** | Multi-master | 2 | 1 Mbps | 40m @ 1Mbps | **Standard** |
| CAN FD | Multi-master | 2 | 8 Mbps | 40m | **Modern** |
| LIN | Master-slave | 1 | 20 kbps | 40m | **Low-cost** |
| FlexRay | Multi-master | 2-4 | 10 Mbps | 24m | **Safety-critical** |
| Ethernet | Various | 4 | 100 Mbps+ | 100m | **Future** |

### 1.4 Applications

```
AUTOMOTIVE:
├── Powertrain: Engine, transmission control
├── Chassis: ABS, ESP, steering
├── Body: Lights, windows, locks
├── Infotainment: Audio, navigation, displays
├── Safety: Airbags, seatbelts, ADAS
└── Diagnostics: OBD-II, fault codes

OTHER INDUSTRIES:
├── Industrial Automation
├── Medical Equipment
├── Aerospace Systems
└── Marine Electronics
```

---

## 2. CAN NETWORK ARCHITECTURE

### 2.1 Network Topology

```
120Ω                                                        120Ω
┌──┤├──┐                                                    ┌──┤├──┐
│      │                 CAN_H                             │      │
│      ╞════════════════════════════════════════════════════╡      │
│      │                                                    │      │
│      │    │           │           │           │          │      │
│      │    ▼           ▼           ▼           ▼          │      │
│      │  ┌───┐       ┌───┐       ┌───┐       ┌───┐      │      │
│      │  │ECU│       │ECU│       │ECU│       │ECU│      │      │
│      │  │ 1 │       │ 2 │       │ 3 │       │ 4 │      │      │
│      │  └─┬─┘       └─┬─┘       └─┬─┘       └─┬─┘      │      │
│      │    │           │           │           │         │      │
│      ╞════════════════════════════════════════════════════╡      │
│      │                 CAN_L                             │      │
└──────┘                                                    └──────┘
```

### 2.2 Inside a CAN Node (ECU)

```
┌───────────────────────────────────────────────────────────┐
│                          ECU                              │
│                                                           │
│  ┌──────────────┐         ┌─────────────────────┐       │
│  │   MCU/CPU    │◄───────►│  CAN Controller      │       │
│  │  (Software)  │         │  (Protocol Handler)  │       │
│  │              │         │                      │       │
│  │  - Process   │         │  - TX/RX Buffers     │       │
│  │    data      │         │  - Message Filters   │       │
│  │  - Control   │         │  - Bit Timing        │       │
│  │    logic     │         │  - Error Detection   │       │
│  └──────────────┘         └──────────┬──────────┘       │
│                                       │                   │
│                           ┌───────────▼──────────┐       │
│                           │  CAN Transceiver     │       │
│                           │  (Physical Layer)    │       │
│                           │                      │       │
│                           │  - Voltage Driver    │       │
│                           │  - Differential RX   │       │
│                           │  - Bus Protection    │       │
│                           └───────┬───────┬──────┘       │
└───────────────────────────────────┼───────┼──────────────┘
                                    │       │
                                CAN_H   CAN_L
                                    │       │
                                    ▼       ▼
                        ════════════════════════════
                                CAN BUS
```

### 2.3 Physical Layer Specifications

```
Cable: Twisted pair, shielded optional
Wires: CAN_H (High), CAN_L (Low)
Impedance: 120Ω characteristic
Termination: 120Ω at BOTH ends
Wire Colors: 
  • CAN_H: Yellow (ISO 11898-2)
  • CAN_L: Green
  • Often: CAN_H = white/black, CAN_L = white/brown
Connectors: 
  • 9-pin D-SUB (OBD-II)
  • 2-pin AMP
  • Various automotive connectors
```

### 2.4 Why Two Termination Resistors?

```
Formula: Total Bus Impedance = 1/(1/120 + 1/120) = 60Ω

1. Signal travels down the bus line
2. Hits termination resistor at end
3. Energy absorbed, no reflection
4. Clean signals maintained

Problem: If unterminated → Signal reflects → Communication errors
Check: Measure between CAN_H and CAN_L → Should be ~60Ω
```

---

## 3. PHYSICAL LAYER DETAILS

### 3.1 Differential Signaling

```
SINGLE-ENDED (e.g., UART):
  Signal measured relative to GROUND
  Noise affects signal directly

DIFFERENTIAL (CAN):
  Signal = CAN_H - CAN_L (difference)
  Noise affects BOTH wires equally
  Noise cancels in subtraction!
```

### 3.2 Voltage Levels

```
RECESSIVE (Logic 1 - Bus Idle):
  CAN_H = 2.5V ± tolerance
  CAN_L = 2.5V ± tolerance
  Difference = 0V
  This is the "weak" state

DOMINANT (Logic 0 - Active):
  CAN_H = 3.5V ± tolerance
  CAN_L = 1.5V ± tolerance
  Difference = 2.0V
  This is the "strong" state
```

### 3.3 Bit-by-Bit Example

```
Bit Stream: 1 0 1 1 0 1 0

Time:   t0   t1   t2   t3   t4   t5   t6
Bit:    1    0    1    1    0    1    0
CAN_H:  2.5  3.5  2.5  2.5  3.5  2.5  3.5  [V]
CAN_L:  2.5  1.5  2.5  2.5  1.5  2.5  1.5  [V]
Diff:   0.0  2.0  0.0  0.0  2.0  0.0  2.0  [V]
State:  R    D    R    R    D    R    D

R = Recessive (1), D = Dominant (0)
```

### 3.4 Wired-AND Logic

```
Rule: DOMINANT (0) always overrides RECESSIVE (1)

Example:
  Node A transmits: 1 1 0 1 1
  Node B transmits: 1 0 0 1 0
  Result:          1 0 0 1 0  ← Bus shows dominant wherever ANY node sends 0

This is key to arbitration!
```

---

## 4. CAN FRAME STRUCTURE

### 4.1 Standard CAN Frame (11-bit ID)

```
┌──────┬──────────────────────────────┬──────┬─────┬──────┬─────────────┬─────┬─────┬──────┐
│  SOF │          ID (11 bits)        │ RTR │ IDE │ r0  │    DLC      │ DATA│ CRC │ ACK │ EOF │
├──────┼──────────────┬───────────────┼──────┼─────┼─────┼─────────────┼─────┼─────┼──────┤
│   0  │  1  2  3  4  5  6  7  8  9  10│  0  │  0  │  0  │ 0  1  2  3 │0-64B│ 15b │  2  │ 7b  │
└──────┴──────────────┴───────────────┴──────┴─────┴─────┴─────────────┴─────┴─────┴──────┘
```

### 4.2 Extended CAN Frame (29-bit ID)

```
┌──────┬────────────────────────────────────────────────────┬─────┬─────┬──────┬─────┬─────┬──────┐
│  SOF │              ID Base (11 bits)                     │ RTR │ IDE │  ID  │ r0 │ DLC │ DATA │
├──────┼────────────────────────────────────────────────────┼─────┼─────┼──────┼─────┼─────┼──────┤
│   0  │  1  2  3  4  5  6  7  8  9  10  │0 1 2 3 4 5 6 7 8│  1  │  1  │...   │  0  │4bits│0-64B │
└──────┴─────────────────────────────────┴─────────────────┴─────┴─────┴──────┴─────┴─────┴──────┘
                                       ID Extension (18 bits)
```

### 4.3 Field Definitions

```
1. SOF (Start of Frame): Single dominant bit (0)
   • Synchronizes all nodes
   • Marks frame beginning

2. Identifier (ID): 11 or 29 bits
   • Determines message priority (lower = higher priority)
   • Identifies message type/content

3. RTR (Remote Transmission Request): 1 bit
   • 0 = Data Frame (sender provides data)
   • 1 = Remote Frame (request data from another node)

4. IDE (Identifier Extension): 1 bit
   • 0 = Standard frame (11-bit ID)
   • 1 = Extended frame (29-bit ID)

5. r0 (Reserved bit): 1 bit
   • Must be dominant (0) in standard frames
   • Used differently in extended frames

6. DLC (Data Length Code): 4 bits
   • CAN 2.0: 0-8 bytes (0000-1000 binary)
   • CAN FD: 0-64 bytes (special encoding)

7. Data Field: 0-8 (CAN 2.0) or 0-64 (CAN FD) bytes
   • Actual message payload
   • CAN FD has different encoding for >8 bytes

8. CRC (Cyclic Redundancy Check): 15 bits
   • Error detection with polynomial
   • Calculated over SOF, ID, control, and data fields

9. CRC Delimiter: 1 recessive bit (1)
   • Separates CRC field from ACK field

10. ACK (Acknowledgment): 2 bits
    • ACK Slot: Receivers write dominant (0) if CRC OK
    • ACK Delimiter: Recessive (1) bit

11. EOF (End of Frame): 7 recessive bits (1111111)
    • Marks end of frame
    • Allows bus to return to idle
```

### 4.4 Example: Engine RPM Message

```
Message: Engine RPM = 8000
ID: 0x123 (binary: 00100100011)
Data: 2 bytes = 0x1F40 (8000 decimal)
Frame construction:

SOF:       0
ID:        00100100011
RTR:       0 (Data Frame)
IDE:       0 (Standard)
r0:        0 (Reserved)
DLC:       0010 (2 bytes)
DATA[0]:   00011111 (0x1F)
DATA[1]:   01000000 (0x40)
CRC:       101010101010101 (15 bits)
CRC Delim: 1
ACK:       01 (Slot: 0, Delim: 1)
EOF:       1111111

Total bits: 64 bits
At 500 kbps: 128 microseconds
```

---

## 5. ARBITRATION MECHANISM

### 5.1 How Arbitration Works

```
Key Principle: Lower ID = Higher Priority

Process:
1. Multiple nodes start transmitting simultaneously
2. Nodes transmit ID bits while monitoring bus
3. If node transmits recessive (1) but sees dominant (0) → LOSES
4. Winner continues transmitting
5. Losers wait for bus idle and retry
```

### 5.2 Arbitration Example

```
Three nodes transmitting:
  Engine ECU:   ID = 0x100 (00100000000)
  ABS ECU:      ID = 0x200 (01000000000)
  Dashboard:    ID = 0x300 (01100000000)

Bit-by-bit arbitration:
Bit 1: All transmit 0 → All continue
Bit 2: Engine:0, ABS:1, Dash:1 → Engine WINS (bus shows 0)
       ABS and Dashboard detect they lost (sent 1, saw 0)
       ABS and Dashboard stop transmitting
Bit 3-11: Engine ECU completes transmission alone
Result: Engine ECU wins, its message gets through
```

### 5.3 Non-Destructive Nature

```
Critical Feature: No data lost during arbitration!

Why:
• All nodes transmit ID bits simultaneously
• All nodes read bus state
• Only winner continues transmitting actual data
• Losers back off gracefully
• No collisions, no retries needed
• This is why CAN is so robust
```

---

## 6. ERROR DETECTION & HANDLING

### 6.1 Five Types of Errors

```
1. BIT ERROR
   • Node transmits bit but reads different bit back
   • Detected during: ID, control, data, CRC fields
   • Causes: Electrical issues, interference

2. STUFF ERROR
   • More than 5 consecutive identical bits detected
   • Violates bit stuffing rule
   • Causes: Corruption, node malfunction

3. CRC ERROR
   • Received CRC doesn't match calculated CRC
   • Detected by ALL receiving nodes
   • Most common error detection

4. FORM ERROR
   • Fixed-form field contains illegal bit pattern
   • Examples: CRC delimiter not recessive, EOF not 7 recessive
   • Causes: Corruption, noise

5. ACK ERROR
   • No receiver acknowledged the message
   • Transmitter expected dominant in ACK slot
   • Causes: No node accepts message, all filtered out
```

### 6.2 Error Frame Format

```
When error detected:
1. Transmitting node sends ERROR FLAG
   • 6 consecutive dominant bits
   • Violates bit stuffing rule!

2. All other nodes see error flag
3. All nodes transmit ERROR DELIMITER
   • 8 consecutive recessive bits
4. Bus returns to idle
5. Original sender retransmits message

Error Frame: [ERROR FLAG][ERROR DELIMITER]
            DDDDDD11111111
```

### 6.3 Fault Confinement

```
Three Error States:
1. ACTIVE: Normal operation
2. PASSIVE: High error rate detected
   • Can still communicate
   • Cannot cause errors for others
3. BUS OFF: Too many errors
   • Disconnected from bus
   • Cannot transmit or receive
   • Requires reset

Error Counters:
• Each node maintains two counters:
  - Transmit Error Counter (TEC)
  - Receive Error Counter (REC)
• Counters increase on errors
• Decrease on successful transmissions
• BUS OFF when TEC > 255
```

---

## 7. BIT TIMING & SYNCHRONIZATION

### 7.1 Bit Time Segments

```
Bit Time = 1 / Baud Rate

Example: 500 kbps = 2 µs per bit

Bit Time Segments:
┌───────┬────────────┬──────────────┬──────────────┐
│ SYNC  │ PROPAGATION│ PHASE SEG 1  │ PHASE SEG 2  │
├───────┼────────────┼──────────────┼──────────────┤
│ 1 tq  │ 1-8 tq     │ 1-8 tq       │ 2-8 tq       │
└───────┴────────────┴──────────────┴──────────────┘

tq = Time Quantum (smallest time unit)
Sample Point = End of Phase Segment 1
```

### 7.2 Synchronization Types

```
1. HARD SYNCHRONIZATION
   • At SOF bit (dominant 0 after idle)
   • Reset bit timer to start of bit

2. RESYNCHRONIZATION
   • During frame reception
   • Adjust bit timing based on edge detection
   • Compensates for oscillator differences

Edge: Recessive→Dominant or Dominant→Recessive transition
```

---

## 8. BIT STUFFING

### 8.1 Purpose

```
1. Ensure enough edges for synchronization
2. Prevent long sequences of identical bits
3. Allow error detection (stuff errors)
```

### 8.2 Rule

```
After 5 consecutive identical bits,
insert OPPOSITE bit as stuff bit.

Examples:
Original:  111110111111
Stuffed:   1111100111101
           │    ││    │
           Stuff Stuff

Stuff bits are removed at receiver.
```

---

## 9. CAN FD (FLEXIBLE DATA-RATE)

### 9.1 Improvements Over CAN 2.0

```
FEATURE          CAN 2.0        CAN FD
─────────────    ─────────────  ─────────────
Data Bytes       0-8            0-64 (8×)
Speed (Arbitration) Up to 1 Mbps  Up to 1 Mbps
Speed (Data)      Same as arb    Up to 8+ Mbps
CRC              15-bit         17/21-bit
```

### 9.2 Two-Phase Operation

```
Arbitration Phase:
  • Lower speed (500 kbps typical)
  • Compatible with CAN 2.0
  • Determines which node wins

Data Phase:
  • Higher speed (2-8 Mbps)
  • Triggered by BRS (Bit Rate Switch)
  • Transmits actual data fast
```

### 9.3 CAN FD Frame Format

```
┌──────┬──────────────┬──────────────────┬──────────────────────────────┐
│ SOF  │ ID + Control │  DLC + BRS + ESI │         DATA (0-64B)        │
├──────┼──────────────┼──────────────────┼──────────────────────────────┤
│ 1bit │  11/29 bits  │    Special       │     Fast speed!             │
└──────┴──────────────┴──────────────────┴──────────────────────────────┘
           │              │                     │
           │              │                     └── Up to 8× faster!
           │              └── BRS (Bit Rate Switch)
           └── Arbitration at normal speed
```

---

## 10. REAL AUTOMOTIVE SYSTEMS

### 10.1 Typical Automotive Network

```
High-Speed CAN (500 kbps):
  • Engine control
  • Transmission
  • ABS/ESP
  • Airbags

Low-Speed CAN (125 kbps):
  • Body control
  • Doors, windows
  • Lights
  • Climate control

Diagnostics CAN:
  • OBD-II port
  • Diagnostic tools
  • Service interfaces
```

### 10.2 Common Message IDs

```
Higher Priority (Lower ID):
0x000-0x0FF: Critical systems (engine, brakes)
0x100-0x1FF: Powertrain messages
0x200-0x2FF: Chassis systems
0x300-0x3FF: Body electronics
0x400-0x4FF: Infotainment
0x500-0x5FF: Diagnostics
0x600-0x7FF: Manufacturer-specific
```

---

## 11. DEBUGGING & ANALYSIS

### 11.1 Oscilloscope View

```
CAN_H: ____▔▔▔▔▔▔____▔▔▔▔▔▔____▔▔▔▔▔▔____
         │    │    │    │    │    │
CAN_L: ____└─────┴─────┴─────┴─────┴──
         │    │    │    │    │    │
Interpretation:
▔▔▔▔▔▔ = Dominant (0) = CAN_H=3.5V, CAN_L=1.5V
______ = Recessive (1) = CAN_H=2.5V, CAN_L=2.5V
```

### 11.2 Logic Analyzer Setup

```
Setup:
1. Connect CAN_H and CAN_L probes
2. Set threshold ~2.0V
3. Configure CAN decoder
4. Capture traffic
5. Analyze messages

Common Issues Found:
• Missing termination (ringing)
• Signal reflections (improper wiring)
• Ground offsets (different grounds)
• Noise (poor shielding)
```

### 11.3 Diagnostic Tools

```
1. Vector CANalyzer/CANoe
2. PCAN-USB/CANalyzer
3. BusMaster
4. Wireshark with CAN plugin
5. Arduino/CAN shields for testing
```

---

## 12. PRACTICAL IMPLEMENTATION

### 12.1 Hardware Selection

```
Microcontrollers with CAN:
• STM32 series (F0, F1, F2, F3, F4, F7)
• NXP (formerly Freescale) MPC, S32K
• Infineon Aurix/TriCore
• Texas Instruments C2000
• Microchip PIC32, dsPIC

CAN Transceivers:
• NXP TJA1040/TJA1050/TJA1051
• Texas Instruments SN65HVD230
• Microchip MCP2551
• STMicroelectronics L9616

Development Boards:
• Arduino + MCP2515 + MCP2551
• STM32 Nucleo with CAN
• Raspberry Pi + CAN hat
```

### 12.2 Software Architecture

```
Three-Layer Model:
1. Hardware Layer (CAN Controller)
   • Register configuration
   • Bit timing setup
   • Interrupt handling

2. Protocol Layer
   • Frame assembly/disassembly
   • Error handling
   • State machine

3. Application Layer
   • Message interpretation
   • Control logic
   • Diagnostics
```

### 12.3 Testing Procedures

```
1. Hardware Test:
   • Verify termination (60Ω measurement)
   • Check voltage levels
   • Test with loopback

2. Protocol Test:
   • Send/receive basic messages
   • Test arbitration
   • Inject errors

3. System Integration:
   • Multiple node communication
   • Stress testing
   • Real-world conditions
```

### 12.4 Best Practices

```
1. Always use proper termination (120Ω at ends)
2. Use twisted pair cables
3. Keep cables short (<40m for 1 Mbps)
4. Avoid star topologies
5. Implement proper error handling
6. Use message filtering efficiently
7. Test with worst-case scenarios
8. Document message IDs thoroughly
```

---

## GLOSSARY

```
ACK: Acknowledgment field
Arbitration: Priority-based message competition
Bit Stuffing: Inserting opposite bits after 5 identical bits
Bus: The communication medium (two wires)
CAN: Controller Area Network
CRC: Cyclic Redundancy Check (error detection)
Differential Signaling: Using voltage difference between two wires
Dominant: Logic 0 (3.5V/1.5V), overrides recessive
ECU: Electronic Control Unit
EOF: End Of Frame
Error Frame: Signal indicating error detected
ID: Identifier (determines priority)
Recessive: Logic 1 (2.5V/2.5V), weaker state
RTR: Remote Transmission Request
SOF: Start Of Frame
Termination Resistor: 120Ω resistor at bus ends
Transceiver: Physical layer device
```

---

## QUICK REFERENCE

```
CAN Bus Resistance: ~60Ω (two 120Ω in parallel)
Voltage Levels:
  • Dominant: CAN_H=3.5V, CAN_L=1.5V
  • Recessive: CAN_H=2.5V, CAN_L=2.5V
Typical Speeds:
  • High-speed: 500 kbps
  • Low-speed: 125 kbps
  • CAN FD: Arbitration 500k, Data up to 8 Mbps
Frame Sizes:
  • CAN 2.0: 47-111 bits (8 bytes data)
  • CAN FD: Up to 879 bits (64 bytes data)
Common IDs:
  • 0x7DF: Diagnostic request
  • 0x7E0-0x7E7: Diagnostic response
  • Many manufacturer-specific
```

---

## APPENDIX: COMPLETE CAN NETWORK EXAMPLE

```
AUTOMOTIVE CAN NETWORK EXAMPLE:
───────────────────────────────────────

HIGH-SPEED CAN (500 kbps):
├── Engine Control Module (ECM)
│   ├── ID: 0x100-0x1FF
│   ├── Messages: RPM, throttle, fuel
│   └── Priority: HIGHEST
├── Transmission Control Module (TCM)
│   ├── ID: 0x200-0x2FF
│   ├── Messages: Gear, temperature
│   └── Priority: HIGH
├── Anti-lock Braking System (ABS)
│   ├── ID: 0x300-0x3FF
│   ├── Messages: Wheel speed, pressure
│   └── Priority: HIGH
└── Electronic Stability Program (ESP)
    ├── ID: 0x400-0x4FF
    ├── Messages: Yaw rate, steering
    └── Priority: HIGH

LOW-SPEED CAN (125 kbps):
├── Body Control Module (BCM)
│   ├── ID: 0x500-0x5FF
│   ├── Messages: Lights, locks, windows
│   └── Priority: MEDIUM
├── Climate Control
│   ├── ID: 0x600-0x6FF
│   ├── Messages: Temperature, fan speed
│   └── Priority: LOW
└── Instrument Cluster
    ├── ID: 0x700-0x7FF
    ├── Messages: Speed, fuel, warnings
    └── Priority: LOW

GATEWAY ECU:
• Bridges High-Speed and Low-Speed networks
• Translates messages between networks
• Manages network separation
```

---

## FINAL NOTES

This guide provides comprehensive coverage of CAN protocol from theory to practical implementation. The accompanying Python interactive learning system provides hands-on experience with real-time simulations and visualizations.

For further learning:
1. Run the Python interactive system for hands-on experience
2. Study the CAN specifications (ISO 11898)
3. Work with real CAN hardware (development boards)
4. Analyze real automotive CAN traffic
5. Stay updated with CAN FD and CAN XL developments

Remember: CAN's robustness comes from its simple yet powerful design. Understanding both the theoretical concepts and practical implementation details is essential for automotive embedded systems engineering.

---

**END OF DOCUMENT**
