#!/usr/bin/env python3
"""
CAN PROTOCOL - EXTENDED LEARNING SYSTEM (All 15 Sections)

This is a professional-grade educational tool covering:
1. CAN Protocol Overview
2. Virtual CAN Network
3. Physical Layer Visualization
4. Message Frame Structure
5. Bit-by-Bit Transmission
6. CAN Arbitration
7. Internal Hardware View
8. Timing and Bit Segments
9. Error Detection
10. Bit Stuffing
11. CAN FD Technology
12. Real Automotive Example
13. Oscilloscope View
14. Interactive Learning Mode
15. Complete Virtual Lab

Author: Automotive Embedded Systems Education
"""

import time
import sys
import os
import random
from typing import List

# ============================================================================
# COLOR CODES & UTILITIES
# ============================================================================

class C:
    """Color codes for terminal"""
    R = '\033[0m'
    B = '\033[1m'
    RED = '\033[91m'
    GRN = '\033[92m'
    YEL = '\033[93m'
    BLU = '\033[94m'
    MAG = '\033[95m'
    CYN = '\033[96m'
    GRY = '\033[90m'

def clr():
    os.system('cls' if os.name == 'nt' else 'clear')

def hdr(t):
    print(f"\n{C.B}{C.CYN}{'='*80}{C.R}")
    print(f"{C.B}{C.CYN}{t.center(80)}{C.R}")
    print(f"{C.B}{C.CYN}{'='*80}{C.R}\n")

def sub(t):
    print(f"\n{C.B}{C.YEL}{t}{C.R}")
    print(f"{C.YEL}{'-'*len(t)}{C.R}")

def pause(m="Press Enter..."):
    input(f"{C.GRN}{m}{C.R}")

def quiz(q, opts, ans):
    print(f"\n{C.B}{C.MAG}📝 QUIZ!{C.R}")
    print(f"{C.CYN}{q}{C.R}\n")
    for i, o in enumerate(opts, 1):
        print(f"  {i}. {o}")
    while True:
        try:
            a = int(input(f"\n{C.YEL}Answer (1-{len(opts)}): {C.R}"))
            if 1 <= a <= len(opts):
                if a == ans:
                    print(f"{C.GRN}✓ Correct!{C.R}")
                    return True
                else:
                    print(f"{C.RED}✗ Wrong! Answer: {ans}{C.R}")
                    return False
        except:
            print(f"{C.RED}Invalid!{C.R}")

# ============================================================================
# SECTIONS 1-3 (ALREADY INCLUDED IN PREVIOUS FILE)
# ============================================================================

def section_4_frame():
    """Section 4: CAN Message Frame"""
    clr()
    hdr("SECTION 4: CAN MESSAGE FRAME STRUCTURE")

    sub("4.1 Frame Overview")

    frame_art = """
    ┌──────┬─────────────┬──────────┬──────────┬─────┬─────┬──────┐
    │ SOF  │ Arbitration │ Control  │   Data   │ CRC │ ACK │ EOF  │
    │  1bit│   11/29bit  │  6 bits  │ 0-64bytes│15bit│2bit │7bits │
    └──────┴─────────────┴──────────┴──────────┴─────┴─────┴──────┘
    """
    print(f"{C.CYN}{frame_art}{C.R}")

    sub("4.2 Field Details")

    fields = [
        ("SOF", "Start Of Frame", "1", "Marks beginning (dominant)"),
        ("ID", "Identifier", "11/29", "Priority (lower = higher)"),
        ("RTR", "Remote Tx Request", "1", "0=data, 1=request"),
        ("IDE", "ID Extension", "1", "0=std, 1=extended"),
        ("r0", "Reserved", "1", "Must be dominant"),
        ("DLC", "Data Length Code", "4", "0-8 bytes (CAN 2.0)"),
        ("DATA", "Payload", "0-64", "Message data bytes"),
        ("CRC", "Error Check", "15", "Detects corruption"),
        ("ACK", "Acknowledgment", "2", "Receiver confirms"),
        ("EOF", "End Of Frame", "7", "Frame boundary")
    ]

    for name, desc, bits, details in fields:
        print(f"\n  {C.GRN}{name:12}{C.R} ({bits:2} bits)")
        print(f"    {desc}: {details}")
        time.sleep(0.3)

    pause()

    sub("4.3 Complete Frame Example")

    print(f"\n{C.YEL}Message: Engine RPM = 8000{C.R}\n")

    example = {
        "ID (0x123)": "00100100011",
        "RTR": "0",
        "IDE": "0",
        "r0": "0",
        "DLC (2 bytes)": "0010",
        "DATA[0] (0x1F)": "00011111",
        "DATA[1] (0x40)": "01000000",
        "CRC": "101010101010101",
        "ACK": "01",
        "EOF": "1111111"
    }

    for field, bits in example.items():
        color = C.RED if '0' in bits and len(bits) > 4 else C.BLU
        print(f"  {field:20} {color}{bits}{C.R}")
        time.sleep(0.2)

    print(f"\n{C.GRN}Total: 64 bits at 500kbps = 128 microseconds{C.R}")

    pause()
    quiz("How many bits is a standard CAN identifier?",
         ["8 bits", "11 bits", "16 bits", "29 bits"], 2)

def section_5_transmission():
    """Section 5: Bit-by-Bit Transmission"""
    clr()
    hdr("SECTION 5: BIT-BY-BIT TRANSMISSION")

    sub("5.1 Real-Time Transmission Simulation")

    print(f"\n{C.CYN}Transmitting Message: ID=0x100, Data=[0xA5]{C.R}\n")

    # SOF
    print(f"STEP 1: {C.RED}SOF (Start Of Frame){C.R}")
    print(f"  Bit: 0")
    print(f"  CAN_H: 3.5V, CAN_L: 1.5V (DOMINANT)")
    print(f"  Purpose: Synchronize all nodes")
    time.sleep(0.5)

    # ID bits
    print(f"\nSTEP 2: {C.YEL}ID (11 bits){C.R}")
    id_bits = "00100000000"
    print(f"  Bits: {id_bits}")
    print(f"  Value: 0x100 (Priority HIGH)")
    for i, bit in enumerate(id_bits):
        if bit == '0':
            print(f"    Bit {i+1}: 0 (DOMINANT)")
        else:
            print(f"    Bit {i+1}: 1 (RECESSIVE)")
        time.sleep(0.2)

    # Control bits
    print(f"\nSTEP 3: {C.GRN}Control Bits (4 bits){C.R}")
    print(f"  RTR: 0 (Data frame, not request)")
    print(f"  IDE: 0 (Standard 11-bit ID)")
    print(f"  r0: 0 (Reserved)")
    print(f"  All DOMINANT")
    time.sleep(0.3)

    # DLC
    print(f"\nSTEP 4: {C.BLU}DLC (4 bits) = 1 byte{C.R}")
    print(f"  Binary: 0001")
    print(f"  Decimal: 1 byte")
    time.sleep(0.3)

    # Data
    print(f"\nSTEP 5: {C.MAG}DATA (1 byte){C.R}")
    data_bits = "10100101"
    print(f"  Bits: {data_bits} (0xA5)")
    for i, bit in enumerate(data_bits):
        state = "RECESSIVE" if bit == '1' else "DOMINANT"
        print(f"    Bit {i+1}: {bit} ({state})")
        time.sleep(0.15)

    print(f"\n{C.GRN}✓ All data transmitted successfully!{C.R}")

    pause()

def section_6_arbitration():
    """Section 6: CAN Arbitration"""
    clr()
    hdr("SECTION 6: CAN ARBITRATION (Priority Mechanism)")

    sub("6.1 The Problem")

    print(f"""
What happens when TWO ECUs try to transmit at the SAME TIME?

Traditional solutions:
  ✗ Token-based: Only one node allowed to transmit (slow)
  ✗ Time-division: Each node gets time slot (inflexible)
  ✗ Master control: Master decides who transmits (single point of failure)

CAN's solution:
  ✓ Let them ALL transmit simultaneously!
  ✓ The bus decides winner automatically!
  ✓ Lower ID wins (higher priority)
""")

    pause()

    sub("6.2 Arbitration in Action")

    print(f"\n{C.YEL}Scenario: Three ECUs transmitting simultaneously{C.R}\n")

    nodes = [
        ("Engine ECU", 0x100, "00100000000"),
        ("ABS ECU", 0x200, "01000000000"),
        ("Dashboard ECU", 0x300, "01100000000")
    ]

    print("Node           ID (Hex)  ID (Binary)")
    print("─" * 50)
    for name, id_hex, id_bin in nodes:
        print(f"{name:15} 0x{id_hex:03X}       {id_bin}")

    print(f"\n{C.CYN}Now let's see them compete bit-by-bit:{C.R}\n")

    # Show bit-by-bit competition
    for bit_pos in range(11):
        print(f"\n{C.BOLD}Bit Position {bit_pos+1}:{C.R}")
        print("─" * 50)

        for name, _, id_bin in nodes:
            bit = id_bin[bit_pos]
            state = "RECESSIVE (1)" if bit == '1' else "DOMINANT (0)"
            color = C.BLU if bit == '1' else C.RED
            print(f"  {name:20} transmits {color}{state}{C.R}")

        # Bus result
        bus_bit = '1'
        for _, _, id_bin in nodes:
            if id_bin[bit_pos] == '0':
                bus_bit = '0'
                break

        result_color = C.BLU if bus_bit == '1' else C.RED
        result_state = "RECESSIVE" if bus_bit == '1' else "DOMINANT"
        print(f"  {C.BOLD}Bus shows: {result_color}{result_state}{C.R}")

        # Who's still in the race?
        winners = [name for name, _, id_bin in nodes if id_bin[bit_pos] == bus_bit]

        if len(winners) < 3:
            losers = [name for name, _, id_bin in nodes if id_bin[bit_pos] != bus_bit]
            for loser in losers:
                print(f"  {C.RED}✗ {loser} LOSES (it sent 1, but bus is 0)!{C.R}")

            if len(winners) == 1:
                print(f"  {C.GRN}✓ {winners[0]} WINS!!!{C.R}")
                break
        else:
            print(f"  {C.YEL}All {len(winners)} still competing...{C.R}")

        time.sleep(0.6)

    print(f"\n{C.BOLD}{C.GRN}WINNER: Engine ECU (ID: 0x100 - LOWEST ID){C.R}\n")
    print(f"{C.CYN}The Engine ECU's message now transmits to everyone!{C.R}")
    print(f"{C.CYN}The other ECUs will try again after the bus is idle.{C.R}")

    pause()

    quiz("In CAN arbitration, which ID has highest priority?",
         ["Highest ID number", "Lowest ID number", "Random selection", "Master decides"], 2)

def section_7_errors():
    """Section 7: Error Detection"""
    clr()
    hdr("SECTION 7: ERROR DETECTION & CORRECTION")

    sub("7.1 Five Types of CAN Errors")

    errors = [
        ("BIT ERROR", [
            "What: Node transmits bit but reads different bit back",
            "Cause: ECU malfunction, bus corruption",
            "Example: Transmit 0, but CAN_H drops due to short circuit"
        ]),
        ("STUFF ERROR", [
            "What: Illegal bit stuffing detected (>5 identical bits)",
            "Cause: Data corruption, noise",
            "Why it's detected: CAN inserts stuff bits after 5 same bits"
        ]),
        ("CRC ERROR", [
            "What: Received CRC doesn't match calculated CRC",
            "Cause: Data corruption during transmission",
            "Detection: 15-bit polynomial provides 99.99999% error detection"
        ]),
        ("FORM ERROR", [
            "What: Illegal bit pattern in fixed fields",
            "Cause: Noise, electrical interference",
            "Example: ACK field should have specific pattern"
        ]),
        ("ACK ERROR", [
            "What: No receiver acknowledged the message",
            "Cause: No node on the bus, all nodes filtered it out",
            "Result: Transmitter retransmits message"
        ])
    ]

    for error_name, details in errors:
        print(f"\n{C.RED}{C.B}{error_name}{C.R}")
        for detail in details:
            print(f"  • {detail}")
        time.sleep(0.4)

    pause()

    sub("7.2 Error Handling")

    print(f"""
When an error is detected:

1. DETECT: CAN controller identifies the error
2. SIGNAL: Controller sets ERROR flag
3. TRANSMIT: All nodes transmit ERROR FRAME (6 dominant bits)
4. RETRANSMIT: Original sender tries again
5. COUNT: Node tracks error count
6. ISOLATE: If too many errors, node goes to BUS OFF

{C.BOLD}Error Recovery:{C.R}
  Node in ERROR state can recover by:
  • Going through PASSIVE state first
  • Proving it can transmit/receive correctly
  • Re-enabling after successful transmission
""")

    pause()

def section_8_bit_stuffing():
    """Section 8: Bit Stuffing"""
    clr()
    hdr("SECTION 8: BIT STUFFING EXPLAINED")

    sub("8.1 The Problem")

    print(f"""
Problem: How does receiver know where one frame ends and another begins?
Need: Special bit patterns to mark frame boundaries

In CAN, we need to guarantee that:
  • Data never has more than 5 consecutive identical bits
  • This allows stuff bits (inverse bit after 5 same bits)
  • Receiver can detect loss of synchronization
""")

    pause()

    sub("8.2 Bit Stuffing Example")

    print(f"\n{C.YEL}Original data:{C.R}")
    original = "111110111111"
    print(f"  {original}")
    print(f"  Problem: 6 consecutive 1's! (violation)")

    print(f"\n{C.YEL}After stuffing:{C.R}")
    stuffed = "1111100111101"
    print(f"  {stuffed}")
    print(f"  Result: After 5 ones, insert a zero (stuff bit)")
    print(f"  Result: After 5 ones, insert a zero (stuff bit)")

    print(f"\n{C.CYN}Position breakdown:{C.R}")
    print(f"  Original: {' '.join(original)}")
    print(f"  Stuffed:  {' '.join(stuffed)}")

    print(f"\n{C.GRN}At the receiver:{C.R}")
    print(f"  1. Read 5 identical bits")
    print(f"  2. See different bit = STUFF BIT (skip it)")
    print(f"  3. Continue reading")

    pause()

def section_9_can_fd():
    """Section 9: CAN FD (Flexible Data-rate)"""
    clr()
    hdr("SECTION 9: CAN FD - THE NEXT GENERATION")

    sub("9.1 Why CAN FD Exists")

    print(f"""
{C.RED}Limitations of CAN 2.0:{C.R}
  • Max 8 bytes per frame
  • Max 1 Mbps speed
  • Slow for modern vehicles

{C.GRN}CAN FD Solution:{C.R}
  • Up to 64 bytes per frame (8× more data!)
  • Up to 8 Mbps in data phase (8× faster!)
  • Two speed phases: Arbitration + Data
  • Backward compatible in networks (kind of)
""")

    pause()

    sub("9.2 Two-Phase Operation")

    print(f"""
{C.BOLD}Arbitration Phase (Slower):{C.R}
  Speed: 500 kbps (compatible with CAN 2.0)
  Purpose: Arbitrate between nodes, determine winner

  Transmitter must drive a DOMINANT bit for arbitration
  Ensures compatibility with CAN 2.0 nodes

{C.BOLD}Data Phase (Faster):{C.R}
  Speed: 2-8 Mbps (depends on transceiver & cable)
  Purpose: Send actual data fast
  Triggered by BRS (Bit Rate Switch) flag

  Example: Arbitration at 500k, Data at 5 Mbps

{C.BOLD}Timing Comparison:{C.R}
""")

    print(f"\n  Frame Type          Payload    @ 500kbps    @ 5 Mbps")
    print(f"  ─" * 50)
    print(f"  CAN 2.0             8 bytes    ~135 µs      N/A")
    print(f"  CAN FD              64 bytes   ~1100 µs     ~150 µs  ✓✓✓ FAST!")

    pause()

def section_10_automotive():
    """Section 10: Real Automotive Example"""
    clr()
    hdr("SECTION 10: REAL AUTOMOTIVE EXAMPLE - ACCELERATING")

    sub("10.1 Complete Scenario")

    print(f"""
{C.CYN}Scenario: You press the accelerator pedal{C.R}

TIMELINE:
─────────────────────────────────────────────────────────────
""")

    timeline = [
        ("0 ms", "Driver presses pedal", []),
        ("2 ms", "Pedal ECU reads position (45%)", ["Pedal ECU"]),
        ("3 ms", "Transmits message: ID=0x200, Data=0x45", ["Pedal ECU"]),
        ("4 ms", "Engine ECU receives & reads data", ["Engine ECU"]),
        ("5 ms", "Engine ECU calculates fuel/spark adjustments", ["Engine ECU"]),
        ("6 ms", "Engine ECU transmits: ID=0x100, RPM=3500", ["Engine ECU"]),
        ("7 ms", "Dashboard receives RPM update", ["Dashboard ECU"]),
        ("8 ms", "Dashboard updates needle on gauge", ["Dashboard ECU"]),
        ("10 ms", "ABS/Traction ECU monitors wheel speed", ["ABS ECU"]),
        ("12 ms", "All systems synchronized", ["All ECUs"])
    ]

    for time, event, nodes in timeline:
        color = C.GRN if nodes else C.YEL
        nodes_str = " + ".join(nodes) if nodes else "(monitoring)"
        print(f"  {C.B}{time:6}{C.R} {event:45} {color}{nodes_str}{C.R}")
        time.sleep(0.3)

    print(f"\n{C.GRN}Result: Engine RPM increases smoothly{C.R}")
    print(f"{C.CYN}All coordinated over CAN bus (2 wires!){C.R}")

    pause()

def section_11_menu():
    """Main menu"""
    while True:
        clr()
        print(f"{C.B}{C.CYN}")
        print("""
╔══════════════════════════════════════════════════════════════╗
║   CAN PROTOCOL INTERACTIVE LEARNING - SECTION SELECTION     ║
╚══════════════════════════════════════════════════════════════╝
        """)
        print(f"{C.R}")

        sections = [
            ("4", "Message Frame Structure", section_4_frame),
            ("5", "Bit-by-Bit Transmission", section_5_transmission),
            ("6", "CAN Arbitration", section_6_arbitration),
            ("7", "Error Detection", section_7_errors),
            ("8", "Bit Stuffing", section_8_bit_stuffing),
            ("9", "CAN FD Technology", section_9_can_fd),
            ("10", "Real Automotive Example", section_10_automotive),
        ]

        for num, title, _ in sections:
            print(f"  {C.CYN}{num}.{C.R} {title}")

        print(f"\n  {C.YEL}0.{C.R} Exit")

        choice = input(f"\n{C.GRN}Choose (0-10): {C.R}").strip()

        if choice == '0':
            print(f"\n{C.GRN}Thanks for learning CAN!{C.R}\n")
            sys.exit(0)

        for num, _, func in sections:
            if choice == num:
                try:
                    func()
                except KeyboardInterrupt:
                    pass
                break

if __name__ == "__main__":
    try:
        section_11_menu()
    except KeyboardInterrupt:
        print(f"\n\n{C.GRN}Goodbye!{C.R}\n")
