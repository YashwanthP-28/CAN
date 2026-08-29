#!/usr/bin/env python3
"""
CAN Protocol Interactive Learning System - Part 1 (Sections 1-4)
A comprehensive visual simulation of Controller Area Network protocol
"""

import time
import sys
import os
from typing import List, Tuple, Dict
from dataclasses import dataclass
from enum import Enum

# ANSI Color codes for terminal visualization
class Color:
    RESET = '\033[0m'
    BOLD = '\033[1m'
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    MAGENTA = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BG_RED = '\033[101m'
    BG_GREEN = '\033[102m'

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def print_header(text: str):
    print(f"\n{Color.BOLD}{Color.CYAN}{'='*80}{Color.RESET}")
    print(f"{Color.BOLD}{Color.CYAN}{text.center(80)}{Color.RESET}")
    print(f"{Color.BOLD}{Color.CYAN}{'='*80}{Color.RESET}\n")

def print_subheader(text: str):
    print(f"\n{Color.BOLD}{Color.YELLOW}{text}{Color.RESET}")
    print(f"{Color.YELLOW}{'-'*len(text)}{Color.RESET}")

def animate_text(text: str, delay: float = 0.03):
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    print()

def pause(message: str = "\nPress Enter to continue..."):
    input(f"{Color.GREEN}{message}{Color.RESET}")

def quiz_question(question: str, options: List[str], correct: int) -> bool:
    print(f"\n{Color.BOLD}{Color.MAGENTA}📝 QUIZ TIME!{Color.RESET}")
    print(f"{Color.CYAN}{question}{Color.RESET}\n")

    for i, option in enumerate(options, 1):
        print(f"  {i}. {option}")

    while True:
        try:
            answer = int(input(f"\n{Color.YELLOW}Your answer (1-{len(options)}): {Color.RESET}"))
            if 1 <= answer <= len(options):
                if answer == correct:
                    print(f"{Color.GREEN}✓ Correct! Well done!{Color.RESET}")
                    return True
                else:
                    print(f"{Color.RED}✗ Incorrect. The correct answer was {correct}.{Color.RESET}")
                    return False
        except ValueError:
            print(f"{Color.RED}Please enter a number.{Color.RESET}")

# ============================================================================
# SECTION 1: CAN PROTOCOL OVERVIEW
# ============================================================================

def section_1_overview():
    clear_screen()
    print_header("SECTION 1: CAN PROTOCOL OVERVIEW")

    print_subheader("1.1 What is CAN?")

    print("""
CAN (Controller Area Network) is a robust vehicle bus standard designed to allow
microcontrollers and devices to communicate with each other without a host computer.
""")

    print(f"\n{Color.BOLD}Key Features:{Color.RESET}")
    features = [
        "Multi-master serial bus",
        "Message-based protocol (not address-based)",
        "Priority-based arbitration",
        "Excellent error detection",
        "Data rate: up to 1 Mbps (CAN 2.0), 5+ Mbps (CAN FD)"
    ]
    for feature in features:
        print(f"  {Color.GREEN}✓{Color.RESET} {feature}")
        time.sleep(0.3)

    pause()

    print_subheader("1.2 Why was CAN Created?")

    print(f"""
{Color.YELLOW}The Problem (1980s):{Color.RESET}
Modern vehicles had increasingly complex electrical systems with dozens of ECUs
(Electronic Control Units). Traditional point-to-point wiring was becoming:
  • Too heavy (kg of copper wires)
  • Too expensive
  • Too unreliable
  • Impossible to maintain

{Color.GREEN}The Solution (1986 - Bosch develops CAN):{Color.RESET}
A single two-wire bus that all ECUs share, with intelligent message prioritization.
""")

    print(f"\n{Color.CYAN}Before CAN:{Color.RESET}")
    print("""
    ECU1 ────────── ECU2
      │  \\______/   │
      │   \\___      │
      │       \\     │
    ECU3 ────────── ECU4
    (Messy point-to-point connections)
""")

    print(f"\n{Color.GREEN}After CAN:{Color.RESET}")
    print("""
    ECU1 ---|
            |
    ECU2 ---|--- CAN BUS (2 wires)
            |
    ECU3 ---|
            |
    ECU4 ---|
    (Clean, simple topology)
""")

    pause()

    print_subheader("1.3 Where is CAN Used?")

    applications = {
        "🚗 Automotive": [
            "Engine Control Units",
            "Anti-lock Braking Systems (ABS)",
            "Airbag Controllers",
            "Infotainment Systems",
            "Body Control Modules"
        ],
        "⚡ Electric Vehicles": [
            "Battery Management Systems (BMS)",
            "Motor Controllers",
            "Charging Systems",
            "Thermal Management"
        ],
        "🏭 Industrial Automation": [
            "PLCs (Programmable Logic Controllers)",
            "Sensors and Actuators",
            "Machine Control",
            "Building Automation"
        ],
        "🤖 Robotics": [
            "Multi-axis Motor Control",
            "Sensor Networks",
            "Collaborative Robots"
        ],
        "✈️ Aerospace": [
            "Avionics Systems",
            "UAV Control",
            "Ground Support Equipment"
        ]
    }

    for category, items in applications.items():
        print(f"\n{Color.BOLD}{category}{Color.RESET}")
        for item in items:
            print(f"  • {item}")
            time.sleep(0.2)

    pause()

    print_subheader("1.4 CAN vs Other Protocols")

    print(f"\n{'Protocol':<12} {'Topology':<15} {'Speed':<20} {'Distance':<15} {'Use Case':<25}")
    print("─" * 87)

    protocols = [
        ("UART", "Point-to-Point", "Up to 1 Mbps", "< 15m", "Simple serial comm"),
        ("I2C", "Multi-master", "Up to 3.4 Mbps", "< 1m", "Short-distance sensors"),
        ("SPI", "Master-Slave", "Up to 50 Mbps", "< 1m", "High-speed peripherals"),
        ("CAN", "Multi-master", "Up to 1 Mbps", "Up to 1 km", "Automotive, robust"),
        ("CAN FD", "Multi-master", "Up to 5-8 Mbps", "Up to 1 km", "Modern automotive")
    ]

    for proto, topo, speed, dist, use in protocols:
        color = Color.GREEN if proto.startswith("CAN") else Color.WHITE
        print(f"{color}{proto:<12}{Color.RESET} {topo:<15} {speed:<20} {dist:<15} {use:<25}")
        time.sleep(0.3)

    print(f"\n{Color.BOLD}Why CAN Wins in Automotive:{Color.RESET}")
    print(f"  {Color.GREEN}✓{Color.RESET} Multi-master (any ECU can transmit)")
    print(f"  {Color.GREEN}✓{Color.RESET} Priority-based arbitration (critical messages first)")
    print(f"  {Color.GREEN}✓{Color.RESET} Excellent noise immunity (differential signaling)")
    print(f"  {Color.GREEN}✓{Color.RESET} Built-in error detection (5 types of errors)")
    print(f"  {Color.GREEN}✓{Color.RESET} No node addresses needed (broadcast-based)")

    pause()

    print_subheader("1.5 CAN Versions")

    print(f"\n{Color.BOLD}{Color.CYAN}CAN 2.0A (Standard CAN){Color.RESET}")
    print(f"  • 11-bit identifier (2048 unique IDs)")
    print(f"  • Data: 0-8 bytes per frame")
    print(f"  • Speed: up to 1 Mbps")
    print(f"  • Released: 1991")

    print(f"\n{Color.BOLD}{Color.CYAN}CAN 2.0B (Extended CAN){Color.RESET}")
    print(f"  • 29-bit identifier (536 million unique IDs)")
    print(f"  • Data: 0-8 bytes per frame")
    print(f"  • Speed: up to 1 Mbps")
    print(f"  • Backward compatible with 2.0A")

    print(f"\n{Color.BOLD}{Color.GREEN}CAN FD (Flexible Data-rate){Color.RESET}")
    print(f"  • 11-bit or 29-bit identifier")
    print(f"  • Data: up to 64 bytes per frame")
    print(f"  • Speed: up to 8 Mbps in data phase")
    print(f"  • Two bit rates: arbitration phase (slower) + data phase (faster)")
    print(f"  • Released: 2012, ISO standardized: 2015")

    print(f"\n{Color.YELLOW}Frame Size Comparison:{Color.RESET}")
    print(f"  CAN 2.0:  [{'█'*8}]  8 bytes max")
    print(f"  CAN FD:   [{'█'*64}]  64 bytes max")

    pause()

    quiz_question(
        "Which CAN version allows up to 64 bytes of data per frame?",
        ["CAN 2.0A", "CAN 2.0B", "CAN FD", "All versions support 64 bytes"],
        3
    )

    quiz_question(
        "What is the main advantage of CAN over point-to-point wiring?",
        ["Higher data rate", "Reduced wiring complexity", "Lower cost ECUs", "Better graphics support"],
        2
    )

# ============================================================================
# SECTION 2: VIRTUAL CAN NETWORK
# ============================================================================

def section_2_network():
    clear_screen()
    print_header("SECTION 2: VIRTUAL CAN NETWORK")

    print_subheader("2.1 Complete Network Topology")

    print(f"\n{Color.CYAN}Let's build a typical automotive CAN network:{Color.RESET}\n")
    time.sleep(1)

    network = """
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
             │                                                       │
    ┌────────┴────────┐     ┌──────────────┐     ┌────────────────┐
    │   ECU 2         │     │   ECU 3      │     │   ECU 4        │
    │   (ABS)         │     │  (Dashboard) │     │  (BMS)         │
    │   ID: 0x200     │     │  ID: 0x300   │     │  ID: 0x400     │
    └─────────────────┘     └──────────────┘     └────────────────┘
         ↑                       ↑                      ↑
         │                       │                      │
    Wheel Speed            Display Data           Battery Voltage
    Brake Pressure         RPM Gauge              State of Charge
                           Speed                  Temperature
"""

    for line in network.split('\n'):
        print(f"{Color.GREEN}{line}{Color.RESET}")
        time.sleep(0.1)

    pause()

    print_subheader("2.2 CAN Node Architecture")

    print(f"\n{Color.YELLOW}Inside Each ECU:{Color.RESET}\n")

    node_architecture = """
    ┌───────────────────────────────────────────────────────────┐
    │                       ECU (Node)                          │
    │                                                           │
    │  ┌──────────────┐         ┌─────────────────────┐       │
    │  │   MCU/CPU    │◄───────►│  CAN Controller     │       │
    │  │  (Software)  │         │  (Protocol Logic)   │       │
    │  │              │         │                     │       │
    │  │  - Process   │         │  - TX Buffer        │       │
    │  │    messages  │         │  - RX Buffer        │       │
    │  │  - Generate  │         │  - Bit Timing       │       │
    │  │    data      │         │  - Error Detection  │       │
    │  │  - Control   │         │  - Arbitration      │       │
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
                            ════════════════════════════
"""

    for line in node_architecture.split('\n'):
        print(f"{Color.CYAN}{line}{Color.RESET}")
        time.sleep(0.05)

    pause()

    print_subheader("2.3 CAN Bus Physical Layer")

    print(f"\n{Color.YELLOW}The Two-Wire Bus:{Color.RESET}\n")

    bus_diagram = """
    120Ω                                                        120Ω
    Termination                                          Termination
    Resistor                                              Resistor
       ┃                                                      ┃
       ┃════════════════════════════════════════════════════┃  CAN_H (High)
       ┃                                                      ┃
       ┃        │            │            │            │      ┃
       ┃        ▼            ▼            ▼            ▼      ┃
       ┃      ECU1         ECU2         ECU3         ECU4    ┃
       ┃        │            │            │            │      ┃
       ┃════════════════════════════════════════════════════┃  CAN_L (Low)
       ┃                                                      ┃
      GND                                                    GND
"""

    print(f"{Color.GREEN}{bus_diagram}{Color.RESET}")

    print(f"\n{Color.BOLD}Key Components:{Color.RESET}")
    print(f"\n  {Color.CYAN}CAN_H (CAN High):{Color.RESET}")
    print(f"    • One wire of the differential pair")
    print(f"    • Voltage: 2.5V (recessive) to 3.5V (dominant)")

    print(f"\n  {Color.CYAN}CAN_L (CAN Low):{Color.RESET}")
    print(f"    • Second wire of the differential pair")
    print(f"    • Voltage: 2.5V (recessive) to 1.5V (dominant)")

    print(f"\n  {Color.CYAN}Termination Resistors (120Ω):{Color.RESET}")
    print(f"    • Placed at BOTH ends of the bus")
    print(f"    • Prevents signal reflections")
    print(f"    • Provides proper impedance matching")
    print(f"    • Total bus impedance: 60Ω (120Ω || 120Ω)")

    pause()

    quiz_question(
        "What is the purpose of the 120Ω termination resistors?",
        ["To increase bus voltage", "To prevent signal reflections", "To filter noise", "To increase data rate"],
        2
    )

# Continue in next file...
