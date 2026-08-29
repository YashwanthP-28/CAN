# CAN Protocol Interactive Learning System 🚗

A comprehensive visual simulation of Controller Area Network (CAN) protocol for automotive embedded systems education.

![CAN Protocol](https://img.shields.io/badge/Protocol-CAN-blue)
![Python](https://img.shields.io/badge/Python-3.6+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📖 Overview

This project provides a complete interactive learning experience for understanding the CAN protocol used in automotive and embedded systems. It includes:

- **Interactive Python simulations** with real-time visualizations
- **Bit-by-bit transmission animations**
- **CAN arbitration demonstrations**
- **Comprehensive PDF technical guide**
- **Interactive quizzes** to test your knowledge

## 🎯 What You'll Learn

### 1. CAN Protocol Fundamentals
- What is CAN and why it was created
- History and evolution (CAN 2.0A, 2.0B, CAN FD)
- Applications in automotive, EVs, industrial automation, robotics, and aerospace

### 2. Network Architecture
- CAN topology and node architecture
- Physical layer components
- Termination resistors and why they matter

### 3. Physical Layer Visualization
- Differential signaling explained
- Voltage levels (Dominant/Recessive bits)
- Noise rejection mechanism
- Wired-AND logic

### 4. Message Frame Structure
- Complete frame breakdown (SOF, ID, RTR, IDE, DLC, Data, CRC, ACK, EOF)
- Standard vs Extended frames
- Bit-by-bit frame construction

### 5. Arbitration Mechanism
- Priority-based arbitration
- Non-destructive bit-wise arbitration
- Why lower ID = higher priority

### 6. Error Detection & Handling
- Five types of CAN errors
- Error frames and fault confinement
- Recovery mechanisms

### 7. Bit Timing & Synchronization
- Bit time segments
- Sample point calculation
- Baud rate configuration

### 8. Bit Stuffing
- Purpose and mechanism
- Stuff bit insertion and removal

### 9. CAN FD (Flexible Data-rate)
- Improvements over CAN 2.0
- Two-phase operation
- Higher speeds and larger payloads

### 10. Real Automotive Examples
- Complete vehicle network simulation
- Message flow between ECUs

## 🚀 Getting Started

### Prerequisites
- Python 3.6 or higher
- Terminal with ANSI color support

### Installation

```bash
# Clone the repository
git clone https://github.com/YashwanthP-28/CAN-Protocol-Learning-System.git

# Navigate to the directory
cd CAN-Protocol-Learning-System

# Run the interactive learning system
python can_protocol_complete.py
```

## 📁 Project Structure

```
CAN-Protocol-Learning-System/
├── can_protocol_complete.py      # Main interactive system (Sections 1-3)
├── can_protocol_extended.py      # Extended system (Sections 4-10)
├── CAN_Protocol_Complete_Guide.pdf  # Technical documentation
├── CAN_Protocol_Complete_Guide.pdf.md  # Markdown source
├── create_can_guide_pdf.py       # PDF generation script
└── README.md                     # This file
```

## 🎮 Features

### Interactive Visualizations
```
    ┌─────────────────┐
    │   ECU 1         │
    │   (Engine)      │  ← Engine RPM, Temperature, Load
    │   ID: 0x100     │
    └────────┬────────┘
             │
             ├───────────────────────────────────────────────────────┐
             │                    CAN BUS                            │
             │               (CAN_H & CAN_L)                         │
             ├───────────────────────────────────────────────────────┤
```

### Bit-by-Bit Transmission
```
STEP 1: SOF (Start Of Frame)
  Bit: 0
  CAN_H: 3.5V, CAN_L: 1.5V (DOMINANT)
  Purpose: Synchronize all nodes

STEP 2: ID (11 bits)
  Bits: 00100000000
  Value: 0x100 (Priority HIGH)
```

### Arbitration Simulation
```
Bit Position 1:
  Engine ECU          transmits DOMINANT (0)
  ABS ECU             transmits RECESSIVE (1)
  Dashboard ECU       transmits RECESSIVE (1)
  Bus shows: DOMINANT
  ✓ Engine ECU WINS!!!
```

## 📊 CAN vs Other Protocols

| Protocol | Topology | Wires | Max Speed | Automotive Use |
|----------|----------|-------|-----------|----------------|
| CAN 2.0 | Multi-master | 2 | 1 Mbps | Standard |
| CAN FD | Multi-master | 2 | 8 Mbps | Modern vehicles |
| LIN | Master-slave | 1 | 20 kbps | Low-cost systems |
| FlexRay | Multi-master | 2-4 | 10 Mbps | Safety-critical |

## 🔧 Technical Specifications

### Voltage Levels
| State | Logic | CAN_H | CAN_L | Differential |
|-------|-------|-------|-------|--------------|
| Dominant | 0 | 3.5V | 1.5V | +2.0V |
| Recessive | 1 | 2.5V | 2.5V | 0V |

### Frame Structure
```
┌──────┬─────────────┬──────────┬──────────┬─────┬─────┬──────┐
│ SOF  │ Arbitration │ Control  │   Data   │ CRC │ ACK │ EOF  │
│ 1bit │   11/29bit  │  6 bits  │ 0-64bytes│15bit│2bit │7bits │
└──────┴─────────────┴──────────┴──────────┴─────┴─────┴──────┘
```

## 🎓 Learning Path

1. **Start with Python interactive system** - Hands-on learning with visualizations
2. **Study the PDF guide** - Comprehensive theory and specifications
3. **Complete the quizzes** - Test your understanding
4. **Experiment with code** - Modify and learn
5. **Apply to real projects** - Build automotive systems

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

**Yashwanth P** - [GitHub Profile](https://github.com/YashwanthP-28)

## 🙏 Acknowledgments

- Robert Bosch GmbH for creating CAN protocol
- Automotive engineering community
- Open source contributors

---

⭐ Star this repository if you found it helpful!

Made with ❤️ for Automotive Embedded Systems Education
