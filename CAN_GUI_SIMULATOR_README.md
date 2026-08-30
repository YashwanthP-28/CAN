# CAN Protocol Interactive GUI Simulator

## 🚀 Professional Educational Tool for Automotive CAN Protocol Learning

A comprehensive, interactive GUI-based simulator that visualizes the complete CAN (Controller Area Network) protocol from physical electrical signals through application-layer data.

---

## 📋 Features Overview

### 1. **Vehicle Event Simulation**
- Brake pedal control (0-100%)
- Accelerator pedal simulation
- Quick action buttons (Emergency Brake, Normal Brake, Light Brake)
- Real-time ECU processing visualization

### 2. **CAN Frame Visualization**
- Complete frame structure breakdown
- All fields explained: SOF, ID, RTR, IDE, DLC, Data, CRC, ACK, EOF
- Hex and decimal representations
- Message interpretation

### 3. **Bit-Level Animation**
- Real-time bit stream display
- Current bit highlighting
- Bit state indicator (DOMINANT/RECESSIVE)
- Step-by-step bit traversal

### 4. **Oscilloscope Display**
- **Channel 1**: CAN_H voltage waveform
- **Channel 2**: CAN_L voltage waveform
- **Channel 3**: Differential voltage (V_diff = CAN_H - CAN_L)
- Real-time waveform updates
- Dynamic time scaling

### 5. **Differential Signaling Explanation**
- Visual representation of DOMINANT vs RECESSIVE states
- Voltage level tables
- Differential voltage calculation
- Why CAN uses differential signaling

### 6. **Noise Injection & Analysis**
- Enable/disable noise simulation
- Adjustable noise amplitude (0-2V)
- Common-mode noise visualization
- Signal integrity indicators
- Noise immunity demonstration

### 7. **CAN Protocol Information**
- Protocol version (Classical CAN)
- Selectable bit rates (125 kbps, 250 kbps, 500 kbps, 1 Mbps)
- Frame type identification
- Message statistics

### 8. **Statistics Dashboard**
- Bus load percentage
- Frames sent/received count
- Error count
- Retransmission count
- Dominant/Recessive bit percentages
- Timing calculations

### 9. **Learning Mode**
- Educational explanations for every action
- Step-by-step protocol walkthrough
- Interactive guidance
- Conceptual understanding reinforcement

### 10. **Simulation Controls**
- **PLAY**: Start animation
- **PAUSE**: Pause simulation
- **STEP**: Advance one bit at a time
- **RESET**: Return to beginning

---

## 🎯 Main Use Cases

### **Scenario 1: User Presses Brake**
```
1. User moves brake slider to 75%
2. "Apply Brake" button clicked
3. Brake ECU creates CAN message (ID: 0x180)
4. Message data: Brake position (75%), Status (ACTIVE)
5. CAN frame generated with all fields
6. Frame converted to bit stream
7. Bits converted to CANH/CANL voltage levels
8. Optional noise added
9. Oscilloscope shows waveforms in real-time
10. Statistics updated
11. Receiving ECU decodes message
12. Vehicle state updated
```

### **Scenario 2: Learn Differential Signaling**
```
1. Select Learning Mode
2. Press brake
3. Step through each bit
4. See bit value (0 or 1)
5. Observe CANH and CANL voltages
6. See differential voltage calculation
7. Understand why difference matters
8. Enable noise and see immunity
9. Understand why CAN is robust
```

### **Scenario 3: Understand Bit Timing**
```
1. Select different bit rates
2. Observe time axis changes on oscilloscope
3. See frame transmission time update
4. Understand bit timing calculations
5. Learn why higher speeds need shorter distances
```

---

## 🔧 Technical Architecture

### **Data Flow**
```
Application Layer
    ↓
Vehicle Event (Brake Pedal = 75%)
    ↓
ECU Processing
    ↓
CAN Data Structure
    ↓
CAN Frame Construction
    ↓
Bit Stream Generation
    ↓
Bit Stuffing Application
    ↓
Digital Logic Conversion
    ↓
CAN Transceiver Simulation
    ↓
CANH/CANL Voltage Levels
    ↓
Noise Injection (optional)
    ↓
Oscilloscope Display
    ↓
Statistics Calculation
    ↓
GUI Update
```

### **CAN Frame Structure (as implemented)**
```
SOF (1 bit)
│
Identifier (11 bits)
├── RTR (1 bit)
├── IDE (1 bit)
├── r0 (1 bit)
│
DLC (4 bits)
│
Data (0-64 bytes, shown as 0-8 for Classical CAN)
│
CRC (15 bits)
├── CRC Delimiter (1 bit)
│
ACK (2 bits)
├── ACK Slot (1 bit)
├── ACK Delimiter (1 bit)
│
EOF (7 bits)
```

### **Voltage Levels (Educational Simulation)**
```
DOMINANT (Logic 0):
  CAN_H = 3.5V
  CAN_L = 1.5V
  V_diff = 2.0V

RECESSIVE (Logic 1):
  CAN_H = 2.5V
  CAN_L = 2.5V
  V_diff = 0V
```

---

## 📦 Installation & Setup

### **Requirements**
- Python 3.6 or higher
- tkinter (usually included with Python)
- matplotlib
- numpy

### **Installation**
```bash
# Install required packages
pip install matplotlib numpy

# Run the simulator
python can_gui_simulator.py
```

### **Troubleshooting**

**Issue**: `ModuleNotFoundError: No module named 'matplotlib'`
```bash
pip install matplotlib --upgrade
```

**Issue**: `No module named 'tkinter'`

Windows:
```bash
# Reinstall Python with tcl/tk support
# Re-run Python installer and check "tcl/tk and IDLE"
```

Linux (Ubuntu/Debian):
```bash
sudo apt-get install python3-tk
```

macOS:
```bash
brew install python-tk@3.9
```

---

## 🎮 User Interface Guide

### **Main Window Sections**

#### **1. Control Panel**
- **Mode Selection**: Choose between Learning Mode or Simulation Mode
- **Playback Controls**: PLAY, PAUSE, STEP, RESET buttons
- **Bit Rate Selection**: Choose CAN bus speed (125k/250k/500k/1M bps)

#### **2. Vehicle Events Panel**
- **Brake Pedal Slider**: Adjust brake percentage (0-100%)
- **Quick Action Buttons**: Emergency/Normal/Light brake presets
- **Accelerator Pedal**: Optional throttle simulation

#### **3. CAN Frame Structure Viewer**
- Complete frame breakdown
- All fields color-coded
- Values in hex and decimal
- Field explanations
- Timing calculations

#### **4. Bit-Level Animation**
- Displays first 40 bits of frame
- Current bit highlighted in gold
- Color-coded bit values (red=0, blue=1)
- Real-time bit counter

#### **5. Oscilloscope View**
- Three synchronized waveforms
- CAN_H (red): High line voltage
- CAN_L (blue): Low line voltage
- V_diff (green): Differential voltage
- Grid overlay for precise reading

#### **6. Differential Signaling Panel**
- DOMINANT state explanation
- RECESSIVE state explanation
- Voltage level comparison table
- Noise injection controls

#### **7. Statistics Dashboard**
- Protocol information
- Current frame details
- Bit statistics
- Timing information
- Noise status

---

## 📊 Example Workflows

### **Workflow 1: Understanding CAN Basics (10 minutes)**

1. Open the application
2. Ensure Learning Mode is selected
3. Click "Apply Brake"
4. Read the learning explanation popup
5. Click "STEP" button repeatedly
6. Watch bit stream advance
7. Observe CANH/CANL waveforms change
8. Notice V_diff changes between 0V and 2.0V
9. Read CAN Frame Structure panel
10. Understand complete data flow

### **Workflow 2: Noise Immunity Study (15 minutes)**

1. Start with "Apply Brake" message
2. Enable noise injection
3. Set noise amplitude to 0.5V
4. Observe oscilloscope waveforms
5. Notice common-mode noise on both lines
6. See that V_diff remains clear
7. Increase noise amplitude
8. Observe degradation of signal
9. Understand CAN's noise immunity
10. Disable noise and observe clean signal

### **Workflow 3: Bit Rate Effects (10 minutes)**

1. Generate brake message
2. Set bit rate to 125 kbps
3. Note frame transmission time
4. Change to 250 kbps
5. Observe time decreases
6. Change to 500 kbps
7. Change to 1 Mbps
8. Understand relationship: higher speed = shorter transmission time
9. See bit time change on oscilloscope

### **Workflow 4: Frame Structure Analysis (15 minutes)**

1. Apply brake at 75%
2. Click on CAN Frame Structure panel
3. Read SOF explanation
4. Read Identifier explanation (0x180 = brake system)
5. Understand RTR, IDE, r0 fields
6. Read DLC (2 bytes in this case)
7. Analyze Data bytes (pressure + status)
8. See CRC field
9. Understand ACK field
10. See EOF field
11. Calculate total frame length
12. Understand why this structure exists

---

## 🎓 Educational Content

### **Topics Covered**

**CAN Protocol Fundamentals**
- What is CAN and why it exists
- Multi-master communication
- Priority-based arbitration
- Message broadcasting

**Physical Layer**
- CAN transceiver operation
- CANH/CANL differential pair
- Voltage levels and signaling
- Why differential signaling

**Bit-Level Communication**
- DOMINANT vs RECESSIVE states
- How bits are represented
- Bit timing and synchronization
- Bit stuffing

**Frame Structure**
- Every CAN frame field
- Field purposes
- Data encoding
- CRC calculation

**Error Handling**
- Error detection mechanisms
- CRC validation
- ACK field usage
- Retransmission

**Automotive Application**
- ECU communication
- Message prioritization
- Sensor data transmission
- Vehicle system integration

---

## 🔍 Advanced Features

### **Customization Options**

Users can modify in code:
- Voltage levels (for different transceiver types)
- CAN node IDs and priorities
- Message payloads
- Error injection scenarios
- Noise models

### **Extension Possibilities**

The architecture supports:
- CAN FD protocol addition
- Multiple simultaneous messages
- Full arbitration simulation
- Error frame generation
- Bus topology visualization
- Real CAN hardware integration

---

## 📝 Technical Notes

### **Simulation Accuracy**

- **Protocol Simulation**: Fully accurate per ISO 11898 Classical CAN
- **Physical Layer**: Educational approximation
  - Voltages shown are representative
  - Not meant to replace oscilloscope measurements
  - Illustrates concepts, not exact hardware behavior
  
- **Noise Model**: Simplified Gaussian noise
  - Shows concept of noise immunity
  - Not comprehensive EMI/RFI simulation

### **Performance**

- Smooth real-time updates
- Responsive UI controls
- No external dependencies except matplotlib/numpy
- Runs on standard consumer hardware
- No CAN hardware required

---

## 🎯 Learning Objectives

After using this simulator, you will understand:

1. ✅ How a brake pedal press becomes a CAN message
2. ✅ Every bit in a CAN frame and its purpose
3. ✅ How digital bits become electrical signals
4. ✅ Why CANH and CANL are different voltages
5. ✅ What differential voltage means
6. ✅ Why CAN is immune to common-mode noise
7. ✅ How bit timing works
8. ✅ Message prioritization through ID
9. ✅ Error detection mechanisms
10. ✅ Why automotive systems use CAN
11. ✅ How ECUs communicate on same network
12. ✅ Complete end-to-end data flow

---

## 🤝 Contributing

This is an educational tool. Suggestions for improvements:
- Additional message types
- CAN FD implementation
- Arbitration visualization
- Error injection scenarios
- Multi-node simulation
- Real hardware integration

---

## 📄 License

This educational tool is provided as-is for learning purposes.

---

## 📧 Support & Questions

For questions or issues:
1. Check the learning mode explanations
2. Review the documentation
3. Study the CAN protocol standard (ISO 11898)
4. Experiment with different scenarios

---

## 🎓 Recommended Study Sequence

### **Beginner** (30 minutes)
1. Run simulator
2. Enable Learning Mode
3. Apply brake
4. Read all explanations
5. Step through frame
6. Understand basic flow

### **Intermediate** (1 hour)
1. Study each CAN frame field
2. Enable noise and observe effects
3. Try different bit rates
4. Understand timing
5. Review statistics

### **Advanced** (2+ hours)
1. Deep dive into CRC calculation
2. Study bit stuffing rules
3. Analyze frame timing at bit level
4. Experiment with noise models
5. Modify source code for customization

---

## 🚀 Future Enhancements

Planned features:
- [ ] CAN FD support
- [ ] Multiple simultaneous messages
- [ ] Full arbitration simulation
- [ ] Error injection (BIT, STUFF, CRC, FORM, ACK)
- [ ] Bus topology visualization
- [ ] Real CAN hardware interface
- [ ] Message logging and playback
- [ ] Thermal noise modeling
- [ ] EMI/RFI effects
- [ ] Performance analysis tools

---

## ✨ This Simulator Makes CAN Protocol Visual

Instead of just reading about CAN, you can now **SEE** how it works!

**From theoretical understanding to practical visualization** - that's the power of this simulator.

---

**Happy Learning! 🎓**

Made with ❤️ for Automotive Embedded Systems Education
