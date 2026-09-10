# CAN Protocol Simulator

A professional, interactive web-based learning and simulation platform for Controller Area Network (CAN) protocol.

## Features

- **Interactive CAN Frame Builder** - Build and visualize CAN 2.0A, CAN 2.0B, and CAN FD frames
- **Bit-Level Analyzer** - Analyze bit stuffing, CRC calculations, and frame structure
- **Arbitration Simulator** - Watch non-destructive bit-wise arbitration in action
- **Physical Layer Visualization** - Understand CAN_H, CAN_L, and differential signaling
- **CAN Fundamentals** - Learn CAN basics with interactive lessons
- **Real-time Dashboard** - Monitor bus load, error counters, and network status
- **Message Database** - DBC-inspired signal decoding and message definition
- **Error Simulation** - Inject and analyze CAN errors
- **Practical Labs** - Hands-on challenges to test your knowledge
- **Interactive Quizzes** - Test your understanding of CAN concepts

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd can-simulator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## Project Structure

```
can-simulator/
├── src/
│   ├── pages/           # Main application pages
│   │   ├── Dashboard.tsx
│   │   ├── CANFundamentals.tsx
│   │   ├── FrameExplorer.tsx
│   │   ├── BitLevelAnalyzer.tsx
│   │   ├── ArbitrationSimulator.tsx
│   │   └── ... (other pages)
│   ├── simulator/       # CAN protocol engine
│   │   ├── CanProtocol.ts     # Core CAN algorithms
│   │   └── CANBusSimulator.ts # Main simulation engine
│   ├── types/          # TypeScript interfaces
│   │   └── index.ts
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── public/             # Static assets
└── package.json        # Dependencies and scripts
```

## Technology Stack

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **React Router** - Navigation

## Key Implementations

### CAN Protocol Implementation
- **Frame Generation**: Supports standard, extended, and CAN FD frames
- **CRC Calculation**: Implements actual CAN CRC-15 algorithm
- **Bit Stuffing**: Accurate bit stuffing simulation
- **Arbitration**: Non-destructive bit-wise arbitration
- **Error Detection**: Bit, stuff, CRC, form, and ACK errors
- **Signal Decoding**: DBC-inspired signal extraction

### Simulation Engine
- Deterministic CAN bus simulation
- Real-time message scheduling
- Error counter management (TEC/REC)
- Node state tracking (Error Active/Passive/Bus-Off)
- Acceptance filtering
- Bus load calculation

### Educational Features
- Progressive learning path (Beginner → Expert)
- Interactive visualizations
- Practical labs and quizzes
- Professional tool-like interface
- Detailed technical explanations

## Demo Mode

When the application starts, it loads a working automotive network with:
- Engine ECU
- Transmission ECU
- ABS Module
- Dashboard
- Body Controller

Each node transmits realistic CAN messages that you can analyze in real-time.

## Usage Examples

### 1. Understanding CAN Frames
Navigate to **Frame Explorer** to build and analyze CAN frames. Learn about:
- Identifier fields (11-bit vs 29-bit)
- Data Length Code (DLC)
- Remote Transmission Request (RTR)
- CRC calculation
- Bit stuffing

### 2. Learning Arbitration
Go to **Arbitration Simulator** to:
- Watch multiple nodes compete for bus access
- See how dominant bits (0) win over recessive bits (1)
- Understand why lower IDs have higher priority
- Step through arbitration bit-by-bit

### 3. Signal Decoding
Use the **Signal Decoder** to:
- Define signals with start bit, length, factor, offset
- Decode raw CAN data into physical values
- Understand endianness and signed/unsigned handling

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Testing
The project includes unit tests for core CAN algorithms:
- Frame generation
- CRC calculation
- Bit stuffing
- Arbitration logic
- Error detection

### Adding Features
1. New pages should be added to `src/pages/`
2. Core CAN logic belongs in `src/simulator/`
3. Types and interfaces in `src/types/`
4. Reusable components can be added to `src/components/`

## Educational Focus

This simulator emphasizes:
- **Accuracy**: Uses actual CAN specification algorithms
- **Clarity**: Explains concepts with interactive examples
- **Practicality**: Real-world automotive examples
- **Progression**: Builds from basic concepts to advanced topics

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT

## Acknowledgments

This project is an educational tool designed to help engineers and students understand CAN protocol. It's not a certified CAN analyzer tool for production use.

Created with ❤️ for the embedded systems community.