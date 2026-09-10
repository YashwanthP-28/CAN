import React, { useState } from 'react';
import {
  BookOpen,
  Wifi,
  Zap,
  Activity,
  Cpu,
  Layers,
  Signal,
  Radio,
  ShieldAlert
} from 'lucide-react';

export default function CANFundamentals() {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: BookOpen,
      content: OverviewContent,
    },
    {
      id: 'what-is-can',
      title: 'What is CAN?',
      icon: Activity,
      content: WhatIsCANContent,
    },
    {
      id: 'why-can',
      title: 'Why CAN?',
      icon: Zap,
      content: WhyCANContent,
    },
    {
      id: 'comparisons',
      title: 'CAN vs Others',
      icon: Layers,
      content: ComparisonsContent,
    },
    {
      id: 'physical-layer',
      title: 'Physical Layer',
      icon: Wifi,
      content: PhysicalLayerContent,
    },
    {
      id: 'nodes',
      title: 'CAN Nodes',
      icon: Cpu,
      content: NodesContent,
    },
  ];

  const OverviewContent = () => (
    <div className="space-y-6">
      <div className="can-card p-6">
        <h2 className="text-2xl font-bold text-can-text mb-4">Welcome to CAN Fundamentals</h2>
        <p className="text-can-text mb-4">
          Controller Area Network (CAN) is a robust vehicle bus standard designed to allow
          microcontrollers and devices to communicate with each other within a vehicle without
          a host computer.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="can-card p-4">
            <h3 className="font-semibold text-can-text mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-can-accent" /> Key Features
            </h3>
            <ul className="space-y-2 text-sm text-can-muted">
              <li className="flex items-start gap-2">
                <span className="text-can-success mt-1">✓</span>
                <span><strong>Multi-master:</strong> No single point of failure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-can-success mt-1">✓</span>
                <span><strong>Message priority:</strong> Non-destructive arbitration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-can-success mt-1">✓</span>
                <span><strong>Error detection:</strong> Built-in fault confinement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-can-success mt-1">✓</span>
                <span><strong>High speed:</strong> Up to 1 Mbps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-can-success mt-1">✓</span>
                <span><strong>Cost-effective:</strong> Simple two-wire bus</span>
              </li>
            </ul>
          </div>
          <div className="can-card p-4">
            <h3 className="font-semibold text-can-text mb-2 flex items-center gap-2">
              <Radio className="w-5 h-5 text-can-accent" /> Applications
            </h3>
            <ul className="space-y-2 text-sm text-can-muted">
              <li className="flex items-start gap-2">
                <span className="text-can-accent mt-1">•</span>
                <span><strong>Automotive:</strong> Engine, transmission, ABS controllers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-can-accent mt-1">•</span>
                <span><strong>Industrial:</strong> Factory automation, robotics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-can-accent mt-1">•</span>
                <span><strong>Medical:</strong> Patient monitoring equipment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-can-accent mt-1">•</span>
                <span><strong>Aviation:</strong> Cabin systems, navigation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-can-accent mt-1">•</span>
                <span><strong>Marine:</strong> Engine management, navigation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const WhatIsCANContent = () => (
    <div className="space-y-6">
      <div className="can-card p-6">
        <h2 className="text-2xl font-bold text-can-text mb-4">What is CAN?</h2>
        <p className="text-can-text mb-4">
          CAN is a message-based protocol designed for automotive applications, but widely used
          in industrial automation and other embedded systems. It was developed by Bosch in the
          mid-1980s to reduce wiring harness complexity in vehicles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="can-card p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-can-accent/20 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-can-accent" />
            </div>
            <h3 className="font-semibold text-can-text mb-2">Message-Based</h3>
            <p className="text-sm text-can-muted">Communication happens via messages with identifiers, not addresses</p>
          </div>
          <div className="can-card p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-can-success/20 flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-can-success" />
            </div>
            <h3 className="font-semibold text-can-text mb-2">Multi-Master</h3>
            <p className="text-sm text-can-muted">Any node can transmit, no central controller required</p>
          </div>
          <div className="can-card p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-can-warning/20 flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-6 h-6 text-can-warning" />
            </div>
            <h3 className="font-semibold text-can-text mb-2">Highly Reliable</h3>
            <p className="text-sm text-can-muted">Built-in error detection and fault confinement</p>
          </div>
        </div>
      </div>

      <div className="can-card p-6">
        <h3 className="text-lg font-semibold text-can-text mb-4">How CAN Works</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-can-border" />
          <div className="space-y-6 pl-12">
            <div className="relative">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-can-dark border-4 border-can-accent flex items-center justify-center z-10">
                <span className="font-bold text-can-accent">1</span>
              </div>
              <h4 className="font-medium text-can-text">Transmit Request</h4>
              <p className="text-sm text-can-muted mt-1">A node wants to send a message to all other nodes</p>
            </div>
            <div className="relative">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-can-dark border-4 border-can-accent flex items-center justify-center z-10">
                <span className="font-bold text-can-accent">2</span>
              </div>
              <h4 className="font-medium text-can-text">Arbitration</h4>
              <p className="text-sm text-can-muted mt-1">If multiple nodes transmit, the one with lower ID wins</p>
            </div>
            <div className="relative">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-can-dark border-4 border-can-accent flex items-center justify-center z-10">
                <span className="font-bold text-can-accent">3</span>
              </div>
              <h4 className="font-medium text-can-text">Transmission</h4>
              <p className="text-sm text-can-muted mt-1">The winning node transmits its message on the bus</p>
            </div>
            <div className="relative">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-can-dark border-4 border-can-accent flex items-center justify-center z-10">
                <span className="font-bold text-can-accent">4</span>
              </div>
              <h4 className="font-medium text-can-text">Reception</h4>
              <p className="text-sm text-can-muted mt-1">All nodes receive the message, but only interested ones process it</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const WhyCANContent = () => (
    <div className="space-y-6">
      <div className="can-card p-6">
        <h2 className="text-2xl font-bold text-can-text mb-4">Why CAN?</h2>
        <p className="text-can-text mb-6">
          Before CAN, vehicles used point-to-point wiring which was expensive, heavy, and difficult
          to maintain. CAN revolutionized automotive electronics by providing a simple, reliable
          communication bus.
        </p>

        <div className="overflow-x-auto">
          <table className="can-table w-full">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Point-to-Point</th>
                <th>CAN Bus</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-can-text">Wiring Complexity</td>
                <td className="text-can-muted">High (many wires)</td>
                <td className="text-can-success">Low (2 wires)</td>
              </tr>
              <tr>
                <td className="text-can-text">Weight</td>
                <td className="text-can-muted">Heavy</td>
                <td className="text-can-success">Light</td>
              </tr>
              <tr>
                <td className="text-can-text">Cost</td>
                <td className="text-can-muted">High</td>
                <td className="text-can-success">Low</td>
              </tr>
              <tr>
                <td className="text-can-text">Reliability</td>
                <td className="text-can-muted">Medium</td>
                <td className="text-can-success">High</td>
              </tr>
              <tr>
                <td className="text-can-text">Expandability</td>
                <td className="text-can-muted">Poor</td>
                <td className="text-can-success">Easy (just add node)</td>
              </tr>
              <tr>
                <td className="text-can-text">Real-time</td>
                <td className="text-can-muted">Variable</td>
                <td className="text-can-success">Yes (deterministic)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="can-card p-6">
        <h3 className="text-lg font-semibold text-can-text mb-4">Real-World Example</h3>
        <p className="text-can-text mb-4">
          In a modern car, the Engine ECU sends engine speed data on the CAN bus. The Dashboard,
          Transmission ECU, and ABS Module all listen for this data. Without CAN, each component
          would need individual wiring to every other component it needs to communicate with.
        </p>
        <div className="bg-can-dark p-4 rounded border border-can-border">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="w-12 h-12 rounded bg-can-accent/20 flex items-center justify-center mx-auto mb-2">
                <Cpu className="w-6 h-6 text-can-accent" />
              </div>
              <div className="font-medium text-can-text">Engine ECU</div>
            </div>
            <div className="col-span-2 flex items-center">
              <div className="w-full h-2 bg-can-border rounded overflow-hidden">
                <div className="h-full bg-can-accent animate-pulse" />
              </div>
            </div>
            <div>
              <div className="w-12 h-12 rounded bg-can-success/20 flex items-center justify-center mx-auto mb-2">
                <Radio className="w-6 h-6 text-can-success" />
              </div>
              <div className="font-medium text-can-text">Dashboard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ComparisonsContent = () => (
    <div className="space-y-6">
      <div className="can-card p-6">
        <h2 className="text-2xl font-bold text-can-text mb-4">CAN vs Other Protocols</h2>
        <p className="text-can-muted mb-6">
          Understanding where CAN fits compared to other common communication protocols.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CAN vs UART */}
          <div className="can-card p-4">
            <h3 className="font-semibold text-can-text mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-can-accent" /> CAN vs UART
            </h3>
            <ul className="space-y-2 text-sm text-can-muted">
              <li><strong>CAN:</strong> Multi-master, differential signaling, built-in arbitration, error detection</li>
              <li><strong>UART:</strong> Point-to-point, single-ended, no arbitration, limited error detection</li>
              <li className="text-can-success mt-2"><strong>When to use CAN:</strong> Multiple controllers, noisy environments</li>
            </ul>
          </div>

          {/* CAN vs SPI */}
          <div className="can-card p-4">
            <h3 className="font-semibold text-can-text mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-can-warning" /> CAN vs SPI
            </h3>
            <ul className="space-y-2 text-sm text-can-muted">
              <li><strong>CAN:</strong> Long distance (40m@1Mbps), multi-master, wireless-friendly</li>
              <li><strong>SPI:</strong> Short distance, master-slave only, high speed (tens of MHz)</li>
              <li className="text-can-success mt-2"><strong>When to use CAN:</strong> Distributed systems, vehicles</li>
            </ul>
          </div>

          {/* CAN vs I2C */}
          <div className="can-card p-4">
            <h3 className="font-semibold text-can-text mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-can-warning" /> CAN vs I2C
            </h3>
            <ul className="space-y-2 text-sm text-can-muted">
              <li><strong>CAN:</strong> Longer distance, higher speed, 2 wires, differential</li>
              <li><strong>I2C:</strong> Short distance, slower, address-based, open-drain</li>
              <li className="text-can-success mt-2"><strong>When to use CAN:</strong> Automotive, industrial</li>
            </ul>
          </div>

          {/* CAN vs Ethernet */}
          <div className="can-card p-4">
            <h3 className="font-semibold text-can-text mb-3 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-can-warning" /> CAN vs Ethernet
            </h3>
            <ul className="space-y-2 text-sm text-can-muted">
              <li><strong>CAN:</strong> Low cost, simple, deterministic, 1Mbps max</li>
              <li><strong>Ethernet:</strong> High bandwidth, complex, non-deterministic, 100Mbps+</li>
              <li className="text-can-success mt-2"><strong>When to use CAN:</strong> Real-time control, cost-sensitive</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const PhysicalLayerContent = () => (
    <div className="space-y-6">
      <div className="can-card p-6">
        <h2 className="text-2xl font-bold text-can-text mb-4">Physical Layer</h2>
        <p className="text-can-text mb-6">
          CAN uses differential signaling over two wires: CAN_H (CAN High) and CAN_L (CAN Low).
          This provides excellent noise immunity and allows communication over long distances.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="can-card p-4">
            <h3 className="font-semibold text-can-text mb-3">CAN Wires</h3>
            <div className="space-y-4">
              <div className="p-3 bg-can-dark rounded border-l-4 border-can-accent">
                <div className="font-medium text-can-text">CAN_H (CAN High)</div>
                <p className="text-sm text-can-muted mt-1">Carries the positive half of the differential signal</p>
              </div>
              <div className="p-3 bg-can-dark rounded border-l-4 border-can-error">
                <div className="font-medium text-can-text">CAN_L (CAN Low)</div>
                <p className="text-sm text-can-muted mt-1">Carries the negative half of the differential signal</p>
              </div>
            </div>
          </div>

          <div className="can-card p-4">
            <h3 className="font-semibold text-can-text mb-3">Bus Topology</h3>
            <div className="flex items-center justify-center p-6 bg-can-dark rounded">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 rounded-lg bg-can-card border border-can-border flex items-center justify-center">
                    <Cpu className="w-8 h-8 text-can-accent" />
                  </div>
                  <div className="w-24 h-2 bg-can-border rounded">
                    <div className="h-full bg-can-accent" />
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-can-card border border-can-border flex items-center justify-center">
                    <Cpu className="w-8 h-8 text-can-accent" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 rounded-lg bg-can-card border border-can-border flex items-center justify-center">
                    <Cpu className="w-8 h-8 text-can-accent" />
                  </div>
                  <div className="w-24 h-2 bg-can-border rounded">
                    <div className="h-full bg-can-accent" />
                  </div>
                  <div className="w-16 h-16 rounded-lg bg-can-card border border-can-border flex items-center justify-center">
                    <Cpu className="w-8 h-8 text-can-accent" />
                  </div>
                </div>
                <div className="text-xs text-can-muted">CAN Bus (Terminated at both ends)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="can-card p-4 mt-4">
          <h3 className="font-semibold text-can-text mb-3">Differential Signaling</h3>
          <p className="text-sm text-can-muted mb-4">
            In CAN, data is transmitted as a voltage difference between CAN_H and CAN_L.
            This cancels out common-mode noise, making CAN very robust.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm text-can-muted">Dominant (0):</div>
              <div className="flex-1 h-8 bg-can-dark rounded flex items-center justify-between px-4">
                <span className="text-can-accent font-bold">CAN_H: 3.5V</span>
                <span className="text-can-error font-bold">CAN_L: 1.5V</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm text-can-muted">Recessive (1):</div>
              <div className="flex-1 h-8 bg-can-dark rounded flex items-center justify-between px-4">
                <span className="text-can-muted">CAN_H: 2.5V</span>
                <span className="text-can-muted">CAN_L: 2.5V</span>
              </div>
            </div>
          </div>
        </div>

        <div className="can-card p-4 mt-4">
          <h3 className="font-semibold text-can-text mb-3">Termination</h3>
          <p className="text-sm text-can-muted mb-4">
            The CAN bus must be terminated with 120Ω resistors at both ends to prevent signal reflections.
          </p>
          <div className="bg-can-dark p-4 rounded">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-can-accent/20 flex items-center justify-center">
                  <span className="font-bold text-can-accent">R</span>
                </div>
                <span className="text-sm text-can-muted">120Ω</span>
              </div>
              <div className="flex-1 h-1 bg-can-border" />
              <div className="text-xs text-can-muted">Node</div>
              <div className="flex-1 h-1 bg-can-border" />
              <div className="flex items-center gap-2">
                <div className="text-xs text-can-muted">Node</div>
                <div className="flex-1 h-1 bg-can-border" />
                <div className="w-8 h-8 rounded bg-can-accent/20 flex items-center justify-center">
                  <span className="font-bold text-can-accent">R</span>
                </div>
                <span className="text-sm text-can-muted">120Ω</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const NodesContent = () => (
    <div className="space-y-6">
      <div className="can-card p-6">
        <h2 className="text-2xl font-bold text-can-text mb-4">CAN Nodes</h2>
        <p className="text-can-text mb-6">
          A CAN node is any device connected to the CAN bus. Each node consists of:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="can-card p-4 text-center">
            <div className="w-16 h-16 rounded-lg bg-can-accent/20 flex items-center justify-center mx-auto mb-3">
              <Cpu className="w-8 h-8 text-can-accent" />
            </div>
            <h3 className="font-semibold text-can-text mb-2">CAN Controller</h3>
            <p className="text-sm text-can-muted">
              Handles protocol features: frame generation, arbitration, error detection
            </p>
          </div>
          <div className="can-card p-4 text-center">
            <div className="w-16 h-16 rounded-lg bg-can-success/20 flex items-center justify-center mx-auto mb-3">
              <Radio className="w-8 h-8 text-can-success" />
            </div>
            <h3 className="font-semibold text-can-text mb-2">CAN Transceiver</h3>
            <p className="text-sm text-can-muted">
              Converts controller signals to differential signals for the bus
            </p>
          </div>
          <div className="can-card p-4 text-center">
            <div className="w-16 h-16 rounded-lg bg-can-warning/20 flex items-center justify-center mx-auto mb-3">
              <Activity className="w-8 h-8 text-can-warning" />
            </div>
            <h3 className="font-semibold text-can-text mb-2">Microcontroller</h3>
            <p className="text-sm text-can-muted">
              Runs the application that generates/uses CAN messages
            </p>
          </div>
        </div>

        <div className="can-card p-4 mt-6">
          <h3 className="font-semibold text-can-text mb-4">Node Configuration</h3>
          <div className="overflow-x-auto">
            <table className="can-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Description</th>
                  <th>Common Values</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-can-text">Bit Rate</td>
                  <td className="text-can-muted">Data rate on the bus</td>
                  <td className="font-mono text-can-muted">125k, 250k, 500k, 1M</td>
                </tr>
                <tr>
                  <td className="text-can-text">CAN ID</td>
                  <td className="text-can-muted">Message identifier (11 or 29 bits)</td>
                  <td className="font-mono text-can-muted">0x000-0x7FF (Std)</td>
                </tr>
                <tr>
                  <td className="text-can-text">DLC</td>
                  <td className="text-can-muted">Data Length Code (0-8 bytes)</td>
                  <td className="font-mono text-can-muted">0-8</td>
                </tr>
                <tr>
                  <td className="text-can-text">Filters</td>
                  <td className="text-can-muted">Acceptance filter configuration</td>
                  <td className="font-mono text-can-muted">ID, Mask, Range</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-can-text mb-2">CAN Fundamentals</h1>
        <p className="text-can-muted">Learn the basics of Controller Area Network</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="can-card p-2 sticky top-6">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-can-accent text-can-dark'
                    : 'text-can-muted hover:bg-can-card hover:text-can-text'
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{section.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {sections.map(section => (
            activeSection === section.id && <section.content key={section.id} />
          ))}
        </div>
      </div>

      {/* Interactive Quiz Section */}
      <div className="can-card p-6 mt-6">
        <h2 className="text-xl font-bold text-can-text mb-4">Quick Quiz</h2>
        <div className="space-y-4">
          <QuizQuestion
            question="What does CAN stand for?"
            options={["Control Area Network", "Controller Area Network", "Central Area Network", "Computer Area Network"]}
            correctAnswer="Controller Area Network"
            explanation="CAN stands for Controller Area Network, developed by Bosch in the 1980s."
          />
          <QuizQuestion
            question="What is the maximum data payload size in classical CAN?"
            options={["4 bytes", "8 bytes", "16 bytes", "64 bytes"]}
            correctAnswer="8 bytes"
            explanation="Classical CAN supports up to 8 bytes of data per frame."
          />
          <QuizQuestion
            question="How are CAN_H and CAN_L at rest (recessive state)?"
            options={["CAN_H: 3.5V, CAN_L: 1.5V", "CAN_H: 2.5V, CAN_L: 2.5V", "CAN_H: 0V, CAN_L: 5V", "CAN_H: 5V, CAN_L: 0V"]}
            correctAnswer="CAN_H: 2.5V, CAN_L: 2.5V"
            explanation="At rest, both lines are at 2.5V, creating 0V differential (recessive)."
          />
        </div>
      </div>
    </div>
  );
}

// Quiz Question Component
function QuizQuestion({ question, options, correctAnswer, explanation }: {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="can-card p-4">
      <p className="font-medium text-can-text mb-3">{question}</p>
      <div className="space-y-2">
        {options.map(option => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            className={`w-full text-left px-4 py-2 rounded border transition-colors ${
              selected === option
                ? 'border-can-accent bg-can-accent/10'
                : 'border-can-border bg-can-dark hover:bg-can-card'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {showAnswer && (
        <div className="mt-4 p-3 rounded border-l-4 border-can-success bg-can-success/10">
          <div className="font-medium text-can-success">Correct!</div>
          <p className="text-sm text-can-muted mt-1">{explanation}</p>
        </div>
      )}
      {selected && !showAnswer && selected !== correctAnswer && (
        <div className="mt-4 p-3 rounded border-l-4 border-can-error bg-can-error/10">
          <div className="font-medium text-can-error">Incorrect</div>
          <p className="text-sm text-can-muted mt-1">Try again!</p>
        </div>
      )}
      {selected === correctAnswer && (
        <button
          onClick={() => setShowAnswer(true)}
          className="mt-3 px-4 py-2 bg-can-success text-can-dark rounded font-medium text-sm hover:bg-can-success/90"
        >
          Show Explanation
        </button>
      )}
    </div>
  );
}