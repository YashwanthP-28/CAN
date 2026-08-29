#!/usr/bin/env python3
"""
Create Comprehensive CAN Protocol Guide PDF
"""

import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import Image
from datetime import datetime

class CANGuidePDF:
    def __init__(self, filename="CAN_Protocol_Complete_Guide.pdf"):
        self.filename = filename
        self.doc = SimpleDocTemplate(
            filename,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        self.styles = getSampleStyleSheet()
        self.create_custom_styles()
        self.story = []

    def create_custom_styles(self):
        """Create custom paragraph styles"""
        # Title style
        self.styles.add(ParagraphStyle(
            name='CANTitle',
            parent=self.styles['Title'],
            fontSize=24,
            spaceAfter=30,
            alignment=1  # Center
        ))

        # Section header style
        self.styles.add(ParagraphStyle(
            name='CANSection',
            parent=self.styles['Heading1'],
            fontSize=16,
            spaceBefore=20,
            spaceAfter=12,
            textColor=colors.HexColor('#2c3e50')
        ))

        # Subsection style
        self.styles.add(ParagraphStyle(
            name='CANSubsection',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceBefore=15,
            spaceAfter=8,
            textColor=colors.HexColor('#34495e')
        ))

        # Code style
        self.styles.add(ParagraphStyle(
            name='CANCode',
            parent=self.styles['Code'],
            fontSize=10,
            fontName='Courier',
            leftIndent=20,
            rightIndent=20,
            backColor=colors.HexColor('#f8f9fa'),
            borderColor=colors.HexColor('#dee2e6'),
            borderWidth=1,
            borderPadding=5
        ))

        # Note style
        self.styles.add(ParagraphStyle(
            name='CANNote',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#7f8c8d'),
            leftIndent=20,
            spaceBefore=5,
            spaceAfter=5
        ))

    def add_title_page(self):
        """Add title page"""
        # Title
        title = Paragraph("Controller Area Network (CAN) Protocol", self.styles['CANTitle'])
        self.story.append(title)
        self.story.append(Spacer(1, 0.5*inch))

        # Subtitle
        subtitle = Paragraph("Complete Technical Guide for Automotive Embedded Systems",
                           ParagraphStyle(name='Subtitle', parent=self.styles['Normal'],
                                         fontSize=14, alignment=1, textColor=colors.HexColor('#7f8c8d')))
        self.story.append(subtitle)
        self.story.append(Spacer(1, 0.8*inch))

        # Author and date
        author_info = [
            f"Author: Professional Automotive Engineer",
            f"Date: {datetime.now().strftime('%Y-%m-%d')}",
            f"Version: 1.0",
            f"",
            f"Target Audience:",
            f"• Automotive Engineers",
            f"• Embedded Systems Developers",
            f"• Students and Researchers",
            f"• Technical Professionals"
        ]

        for info in author_info:
            if info:
                p = Paragraph(info, self.styles['Normal'])
                self.story.append(p)
                self.story.append(Spacer(1, 0.1*inch))
            else:
                self.story.append(Spacer(1, 0.2*inch))

        self.story.append(PageBreak())

    def add_toc(self):
        """Add table of contents"""
        toc_title = Paragraph("Table of Contents", self.styles['CANSection'])
        self.story.append(toc_title)
        self.story.append(Spacer(1, 0.2*inch))

        toc_items = [
            ("1. Introduction to CAN Protocol", "1"),
            ("2. CAN Network Architecture", "3"),
            ("3. Physical Layer Details", "5"),
            ("4. CAN Frame Structure", "8"),
            ("5. Arbitration Mechanism", "12"),
            ("6. Error Detection & Handling", "15"),
            ("7. Bit Timing & Synchronization", "18"),
            ("8. Bit Stuffing", "21"),
            ("9. CAN FD (Flexible Data-rate)", "23"),
            ("10. Real Automotive Systems", "26"),
            ("11. Debugging & Analysis", "29"),
            ("12. Practical Implementation Guide", "32"),
            ("Appendix: Complete Reference", "35")
        ]

        toc_data = []
        for item, page in toc_items:
            toc_data.append([item, f"Page {page}"])

        toc_table = Table(toc_data, colWidths=[4*inch, 1*inch])
        toc_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('LEFTPADDING', (0, 0), (0, -1), 20),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ]))

        self.story.append(toc_table)
        self.story.append(PageBreak())

    def add_section_1(self):
        """Section 1: Introduction to CAN"""
        title = Paragraph("1. Introduction to CAN Protocol", self.styles['CANSection'])
        self.story.append(title)
        self.story.append(Spacer(1, 0.1*inch))

        # What is CAN?
        subtitle1 = Paragraph("1.1 What is CAN?", self.styles['CANSubsection'])
        self.story.append(subtitle1)

        content = """
        <b>Controller Area Network (CAN)</b> is a robust, multi-master serial bus protocol
        designed for reliable communication in harsh environments like automotive applications.

        <b>Key Characteristics:</b>
        • Multi-master capability - any node can initiate communication
        • Message-based protocol - messages have IDs, not addresses
        • Priority-based arbitration - critical messages get through first
        • Excellent error detection - five different error checking mechanisms
        • Differential signaling - immune to electrical noise
        """
        p = Paragraph(content, self.styles['Normal'])
        self.story.append(p)
        self.story.append(Spacer(1, 0.15*inch))

        # History
        subtitle2 = Paragraph("1.2 Historical Development", self.styles['CANSubsection'])
        self.story.append(subtitle2)

        history = """
        1983: Robert Bosch begins development
        1986: First CAN specification released by Bosch
        1991: Mercedes-Benz W140 - first production car with CAN
        1993: ISO 11898 standard published
        2000s: CAN becomes standard in nearly all vehicles worldwide
        2012: CAN FD (Flexible Data-rate) specification released
        2015: CAN FD ISO standardized (ISO 11898-1:2015)
        """
        p = Paragraph(history, self.styles['CANCode'])
        self.story.append(p)
        self.story.append(Spacer(1, 0.15*inch))

        # Applications
        subtitle3 = Paragraph("1.3 Applications", self.styles['CANSubsection'])
        self.story.append(subtitle3)

        apps = """
        <b>Automotive (Primary Use):</b>
        • Powertrain: Engine, transmission control
        • Chassis: ABS, ESP, traction control
        • Safety: Airbags, seatbelt tensioners
        • Body: Lights, windows, climate control
        • Infotainment: Audio, navigation, displays

        <b>Other Industries:</b>
        • Industrial Automation: PLCs, sensors, robotics
        • Medical Equipment: Patient monitoring systems
        • Aerospace: Avionics, UAV control systems
        • Marine: Navigation and control systems
        """
        p = Paragraph(apps, self.styles['Normal'])
        self.story.append(p)
        self.story.append(PageBreak())

    def add_section_2(self):
        """Section 2: Network Architecture"""
        title = Paragraph("2. CAN Network Architecture", self.styles['CANSection'])
        self.story.append(title)
        self.story.append(Spacer(1, 0.1*inch))

        # Network Topology
        subtitle1 = Paragraph("2.1 Network Topology", self.styles['CANSubsection'])
        self.story.append(subtitle1)

        topology = """
        CAN uses a linear bus topology with all nodes connected in parallel.
        Each node has a transceiver connected to the two-wire bus (CAN_H and CAN_L).

        Critical components:
        • <b>CAN_H (High line)</b>: One wire of differential pair
        • <b>CAN_L (Low line)</b>: Second wire of differential pair
        • <b>Termination resistors</b>: 120Ω at BOTH ends
        • <b>ECUs</b>: Electronic Control Units with CAN interfaces
        """
        p = Paragraph(topology, self.styles['Normal'])
        self.story.append(p)
        self.story.append(Spacer(1, 0.15*inch))

        # ASCII Diagram
        diagram = """
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
        """
        p = Paragraph(diagram, self.styles['CANCode'])
        self.story.append(p)
        self.story.append(Spacer(1, 0.15*inch))

        # ECU Architecture
        subtitle2 = Paragraph("2.2 ECU Internal Architecture", self.styles['CANSubsection'])
        self.story.append(subtitle2)

        ecu = """
        Each ECU consists of three main components:

        <b>1. Microcontroller (MCU)</b>
           - Application software
           - Data processing
           - Control algorithms

        <b>2. CAN Controller</b>
           - Protocol implementation
           - Message buffers (TX/RX)
           - Error detection
           - Bit timing control

        <b>3. CAN Transceiver</b>
           - Voltage level conversion
           - Differential signaling
           - Bus protection
           - Physical layer interface
        """
        p = Paragraph(ecu, self.styles['Normal'])
        self.story.append(p)
        self.story.append(PageBreak())

    def add_comparison_table(self):
        """Add protocol comparison table"""
        data = [
            ["Protocol", "Topology", "Wires", "Max Speed", "Max Distance", "Automotive Use"],
            ["CAN 2.0", "Multi-master", "2", "1 Mbps", "40m @ 1Mbps", "Standard"],
            ["CAN FD", "Multi-master", "2", "8 Mbps", "40m", "Modern vehicles"],
            ["LIN", "Master-slave", "1", "20 kbps", "40m", "Low-cost systems"],
            ["FlexRay", "Multi-master", "2-4", "10 Mbps", "24m", "Safety-critical"],
            ["Ethernet", "Various", "4+", "100 Mbps+", "100m", "Future systems"]
        ]

        table = Table(data, colWidths=[1.2*inch, 1.2*inch, 0.7*inch, 1.2*inch, 1.2*inch, 1.5*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#ecf0f1')),
            ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#f9f9f9')),
            ('GRID', (0, 0), (-1, -1), 0.25, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))

        self.story.append(table)

    def add_voltage_table(self):
        """Add voltage levels table"""
        data = [
            ["Bit State", "Logic Level", "CAN_H Voltage", "CAN_L Voltage", "Differential Voltage"],
            ["Dominant", "Logic 0", "3.5V ± tolerance", "1.5V ± tolerance", "+2.0V"],
            ["Recessive", "Logic 1", "2.5V ± tolerance", "2.5V ± tolerance", "0V"]
        ]

        table = Table(data, colWidths=[1.2*inch, 0.8*inch, 1.2*inch, 1.2*inch, 1.2*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3498db')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('GRID', (0, 0), (-1, -1), 0.25, colors.black),
            ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#e8f4fc')),
            ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#f0f8ff')),
        ]))

        self.story.append(table)

    def add_frame_structure_diagram(self):
        """Add CAN frame structure diagram"""
        standard_frame = """
        Standard CAN Frame (11-bit ID):
        ┌──────┬──────────────────────────────┬──────┬─────┬─────┬─────────────┬─────┬─────┬──────┐
        │  SOF │          ID (11 bits)        │ RTR │ IDE │ r0 │    DLC      │ DATA│ CRC │ ACK │ EOF │
        ├──────┼──────────────┬───────────────┼──────┼─────┼─────┼─────────────┼─────┼─────┼──────┤
        │   0  │  1  2  3  4  5  6  7  8  9  10│  0  │  0  │  0  │ 0  1  2  3 │0-64B│ 15b │  2  │ 7b  │
        └──────┴──────────────┴───────────────┴──────┴─────┴─────┴─────────────┴─────┴─────┴──────┘
        """

        p = Paragraph(standard_frame, self.styles['CANCode'])
        self.story.append(p)

    def add_error_types_table(self):
        """Add error types table"""
        data = [
            ["Error Type", "Detection Method", "Common Causes"],
            ["Bit Error", "Transmitted vs received bit mismatch", "Bus corruption, faulty transceiver"],
            ["Stuff Error", ">5 consecutive identical bits", "Data corruption, noise"],
            ["CRC Error", "Received CRC ≠ calculated CRC", "Data corruption during transmission"],
            ["Form Error", "Illegal bit pattern in fixed fields", "Noise, electrical interference"],
            ["ACK Error", "No dominant bit in ACK slot", "No nodes received, all filtered out"]
        ]

        table = Table(data, colWidths=[1.5*inch, 2.5*inch, 2*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e74c3c')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (0, -1), 'CENTER'),
            ('ALIGN', (1, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('GRID', (0, 0), (-1, -1), 0.25, colors.black),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#ffe6e6')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))

        self.story.append(table)

    def add_quick_reference(self):
        """Add quick reference section"""
        title = Paragraph("Quick Reference Guide", self.styles['CANSection'])
        self.story.append(title)
        self.story.append(Spacer(1, 0.1*inch))

        reference = """
        <b>CAN Bus Resistance:</b> ~60Ω (two 120Ω in parallel)

        <b>Voltage Levels:</b>
        • Dominant: CAN_H = 3.5V, CAN_L = 1.5V
        • Recessive: CAN_H = 2.5V, CAN_L = 2.5V

        <b>Typical Speeds:</b>
        • High-speed CAN: 500 kbps
        • Low-speed CAN: 125 kbps
        • CAN FD: Arbitration 500k, Data up to 8 Mbps

        <b>Frame Sizes:</b>
        • CAN 2.0: 47-111 bits (with 8 bytes data)
        • CAN FD: Up to 879 bits (with 64 bytes data)

        <b>Common Message IDs:</b>
        • 0x7DF: Diagnostic request
        • 0x7E0-0x7E7: Diagnostic response
        • 0x000-0x0FF: Highest priority (engine, brakes)
        • 0x100-0x1FF: Powertrain messages
        • 0x200-0x2FF: Chassis systems
        • 0x300-0x3FF: Body electronics

        <b>Termination Check:</b>
        Measure resistance between CAN_H and CAN_L when bus is powered off.
        Should read ~60Ω if properly terminated.
        """

        p = Paragraph(reference, self.styles['Normal'])
        self.story.append(p)
        self.story.append(Spacer(1, 0.2*inch))

    def build_pdf(self):
        """Build the complete PDF"""
        # Add all sections
        self.add_title_page()
        self.add_toc()

        # Add sections with examples
        self.add_section_1()
        self.add_section_2()

        # Add tables and diagrams
        self.add_comparison_table()
        self.story.append(Spacer(1, 0.2*inch))
        self.add_voltage_table()
        self.story.append(Spacer(1, 0.2*inch))
        self.add_frame_structure_diagram()
        self.story.append(Spacer(1, 0.2*inch))
        self.add_error_types_table()
        self.story.append(Spacer(1, 0.2*inch))
        self.add_quick_reference()

        # Build the PDF
        self.doc.build(self.story)
        print(f"PDF created successfully: {self.filename}")

def main():
    """Main function to create the PDF guide"""
    print("Creating CAN Protocol Comprehensive Guide PDF...")

    try:
        # Create the guide
        guide = CANGuidePDF("CAN_Protocol_Complete_Guide.pdf")
        guide.build_pdf()

        print(f"\nPDF Guide created successfully!")
        print(f"File: {os.path.abspath(guide.filename)}")

        # Create a simple README
        readme_content = f"""
# CAN Protocol Interactive Learning System

## Overview
This package provides a comprehensive interactive learning experience for the Controller Area Network (CAN) protocol used in automotive and embedded systems.

## Files Included:

1. **CAN_Protocol_Complete_Guide.pdf** - Complete 35+ page technical guide
2. **can_protocol_complete.py** - Interactive Python learning system (Sections 1-3)
3. **can_protocol_extended.py** - Extended Python system (Sections 4-10)
4. **CAN_Protocol_Complete_Guide.pdf.md** - Markdown source for the guide

## Getting Started:

### Interactive Python Learning System:
```bash
# Run the complete interactive system
python can_protocol_complete.py

# Run the extended system (all 10 sections)
python can_protocol_extended.py
```

### PDF Guide:
Open `CAN_Protocol_Complete_Guide.pdf` for comprehensive technical documentation.

## What You'll Learn:

### Python Interactive System:
- Real-time bit-by-bit transmission visualization
- CAN arbitration with multiple competing ECUs
- Error detection and handling simulations
- Bit stuffing algorithm demonstration
- CAN FD two-phase operation
- Real automotive examples

### PDF Guide:
- Complete CAN protocol theory and specifications
- Network architecture and topology
- Physical layer details and voltage levels
- Frame structure and timing calculations
- Error detection mechanisms
- Implementation best practices
- Debugging and analysis techniques

## Prerequisites:
- Python 3.6 or higher
- No additional libraries required (uses standard libraries)

## System Requirements:
- Any modern computer with Python 3.6+
- Terminal/Command prompt with ANSI color support
- PDF viewer for the guide

## Features:
- **Color-coded terminal output** for clear visualization
- **Interactive quizzes** with immediate feedback
- **Step-by-step animations** of bit transmission
- **Real-world automotive examples**
- **Complete protocol coverage** from theory to practice

## Learning Path:
1. Start with the Python interactive system for hands-on learning
2. Study the PDF guide for comprehensive theory
3. Use the interactive quizzes to test your knowledge
4. Experiment with the code examples
5. Apply knowledge to real-world automotive systems

## Support:
This educational tool is designed for:
- Automotive engineering students
- Embedded systems developers
- Technical professionals transitioning to automotive
- Anyone interested in vehicle networking

---

**Created:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Version:** 1.0
"""

        with open("README.txt", "w", encoding="utf-8") as f:
            f.write(readme_content)

        print(f"README.txt created with setup instructions.")

    except Exception as e:
        print(f"Error creating PDF: {e}")
        return 1

    return 0

if __name__ == "__main__":
    sys.exit(main())
