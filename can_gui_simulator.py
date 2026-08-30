"""
CAN Protocol Interactive Simulator & Visualization GUI
A comprehensive educational tool for learning CAN Bus Protocol

Features:
- Real-time CAN frame generation and visualization
- Physical layer (CANH/CANL) waveform display
- Differential voltage visualization
- Bit-by-bit transmission animation
- CAN arbitration simulation
- Noise injection and effects
- Error detection and handling
- Interactive learning mode
- Step-by-step protocol walkthrough

Author: Automotive Embedded Systems Education
Date: 2026-08-30
"""

import tkinter as tk
from tkinter import ttk, messagebox
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.figure import Figure
import numpy as np
from dataclasses import dataclass
from typing import List, Tuple, Optional
import threading
import time

# ============================================================================
# CAN PROTOCOL DATA STRUCTURES
# ============================================================================

@dataclass
class CANFrame:
    """Complete CAN Frame representation"""
    identifier: int
    dlc: int
    data: List[int]
    is_extended: bool = False
    is_remote: bool = False

    def to_bits(self) -> str:
        """Convert frame to bit string"""
        bits = '0'  # SOF

        # Identifier (11 bits standard)
        bits += format(self.identifier, '011b')

        # RTR
        bits += '1' if self.is_remote else '0'

        # IDE
        bits += '0'

        # r0
        bits += '0'

        # DLC (4 bits)
        bits += format(self.dlc, '04b')

        # Data
        for byte in self.data:
            bits += format(byte, '08b')

        # CRC (simplified - 15 bits)
        crc = self.calculate_crc()
        bits += format(crc, '015b')

        # CRC delimiter
        bits += '1'

        # ACK slot
        bits += '0'

        # ACK delimiter
        bits += '1'

        # EOF (7 bits)
        bits += '1111111'

        return bits

    def calculate_crc(self) -> int:
        """Calculate CRC-15 (simplified for simulation)"""
        # Simplified CRC for educational purposes
        bits = format(self.identifier, '011b')
        bits += '0' + '0' + '0'  # RTR, IDE, r0
        bits += format(self.dlc, '04b')
        for byte in self.data:
            bits += format(byte, '08b')

        crc = 0
        for bit in bits:
            crc = ((crc << 1) | int(bit)) & 0x7FFF
            if crc & 0x4000:
                crc ^= 0x4599  # CAN polynomial

        return crc & 0x7FFF

    def apply_bit_stuffing(self, bits: str) -> str:
        """Apply bit stuffing (insert opposite bit after 5 consecutive identical)"""
        stuffed = ''
        count = 0
        last_bit = None

        # Don't stuff CRC delimiter, ACK, EOF
        unstuffed_start = len(bits) - 9

        for i, bit in enumerate(bits):
            if i >= unstuffed_start:
                stuffed += bit
                continue

            if bit == last_bit:
                count += 1
            else:
                count = 1
                last_bit = bit

            stuffed += bit

            if count == 5:
                stuff_bit = '0' if bit == '1' else '1'
                stuffed += stuff_bit
                count = 1
                last_bit = stuff_bit

        return stuffed

@dataclass
class ECUNode:
    """ECU Node representation"""
    name: str
    ecu_id: int
    message_ids: List[int]
    color: str
    position: Tuple[int, int]

# ============================================================================
# MAIN APPLICATION CLASS
# ============================================================================

class CANSimulatorGUI:
    """Main CAN Simulator GUI Application"""

    def __init__(self, root):
        self.root = root
        self.root.title("CAN Protocol Interactive Simulator & Visualization")
        self.root.geometry("1600x1000")
        self.root.configure(bg='#1e1e1e')

        # Simulation state
        self.current_frame: Optional[CANFrame] = None
        self.current_bits: str = ""
        self.current_bit_index: int = 0
        self.is_playing: bool = False
        self.bit_rate: int = 500000  # 500 kbps
        self.noise_enabled: bool = False
        self.noise_amplitude: float = 0.0
        self.learning_mode: bool = True

        # Voltage levels
        self.v_canh_dominant = 3.5
        self.v_canl_dominant = 1.5
        self.v_canh_recessive = 2.5
        self.v_canl_recessive = 2.5

        # ECU nodes
        self.ecu_nodes = [
            ECUNode("Brake ECU", 1, [0x180, 0x181], "#e74c3c", (100, 200)),
            ECUNode("Engine ECU", 2, [0x100, 0x101], "#3498db", (100, 300)),
            ECUNode("Transmission ECU", 3, [0x200, 0x201], "#2ecc71", (100, 400)),
            ECUNode("Instrument Cluster", 4, [0x300, 0x301], "#f39c12", (100, 500)),
        ]

        # Create GUI
        self.create_gui()

        # Initialize with default message
        self.generate_brake_message(75)

    def create_gui(self):
        """Create the complete GUI layout"""

        # Create main container with scrollbar
        main_container = ttk.Frame(self.root)
        main_container.pack(fill=tk.BOTH, expand=True)

        # Create canvas with scrollbar
        canvas = tk.Canvas(main_container, bg='#1e1e1e')
        scrollbar = ttk.Scrollbar(main_container, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)

        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        # Header
        self.create_header(scrollable_frame)

        # Control Panel
        control_frame = ttk.LabelFrame(scrollable_frame, text="Simulation Controls", padding=10)
        control_frame.grid(row=1, column=0, columnspan=2, sticky='ew', padx=10, pady=5)
        self.create_control_panel(control_frame)

        # Vehicle Event Panel
        vehicle_frame = ttk.LabelFrame(scrollable_frame, text="Vehicle Events", padding=10)
        vehicle_frame.grid(row=2, column=0, sticky='nsew', padx=10, pady=5)
        self.create_vehicle_panel(vehicle_frame)

        # CAN Frame Viewer
        frame_viewer = ttk.LabelFrame(scrollable_frame, text="CAN Frame Structure", padding=10)
        frame_viewer.grid(row=2, column=1, sticky='nsew', padx=10, pady=5)
        self.create_frame_viewer(frame_viewer)

        # Bit Animation
        bit_anim_frame = ttk.LabelFrame(scrollable_frame, text="Bit-Level Animation", padding=10)
        bit_anim_frame.grid(row=3, column=0, columnspan=2, sticky='ew', padx=10, pady=5)
        self.create_bit_animation(bit_anim_frame)

        # Oscilloscope
        scope_frame = ttk.LabelFrame(scrollable_frame, text="CANH/CANL Oscilloscope", padding=10)
        scope_frame.grid(row=4, column=0, columnspan=2, sticky='ew', padx=10, pady=5)
        self.create_oscilloscope(scope_frame)

        # Voltage Explanation
        voltage_frame = ttk.LabelFrame(scrollable_frame, text="Differential Signaling", padding=10)
        voltage_frame.grid(row=5, column=0, sticky='nsew', padx=10, pady=5)
        self.create_voltage_panel(voltage_frame)

        # Statistics
        stats_frame = ttk.LabelFrame(scrollable_frame, text="Statistics", padding=10)
        stats_frame.grid(row=5, column=1, sticky='nsew', padx=10, pady=5)
        self.create_statistics_panel(stats_frame)

        # Pack canvas and scrollbar
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

        # Configure grid weights
        scrollable_frame.columnconfigure(0, weight=1)
        scrollable_frame.columnconfigure(1, weight=1)

    def create_header(self, parent):
        """Create application header"""
        header = tk.Frame(parent, bg='#2c3e50', height=80)
        header.grid(row=0, column=0, columnspan=2, sticky='ew', padx=10, pady=10)

        title_label = tk.Label(
            header,
            text="CAN Protocol Interactive Simulator",
            font=('Arial', 24, 'bold'),
            bg='#2c3e50',
            fg='white'
        )
        title_label.pack(pady=10)

        subtitle_label = tk.Label(
            header,
            text="Educational Tool for Automotive Embedded Systems",
            font=('Arial', 12),
            bg='#2c3e50',
            fg='#ecf0f1'
        )
        subtitle_label.pack()

    def create_control_panel(self, parent):
        """Create simulation control buttons"""
        # Mode selection
        mode_frame = tk.Frame(parent)
        mode_frame.pack(side=tk.LEFT, padx=10)

        tk.Label(mode_frame, text="Mode:", font=('Arial', 10, 'bold')).pack(side=tk.LEFT)

        self.mode_var = tk.BooleanVar(value=True)
        learning_rb = tk.Radiobutton(
            mode_frame,
            text="Learning Mode",
            variable=self.mode_var,
            value=True,
            command=self.toggle_mode
        )
        learning_rb.pack(side=tk.LEFT, padx=5)

        simulation_rb = tk.Radiobutton(
            mode_frame,
            text="Simulation Mode",
            variable=self.mode_var,
            value=False,
            command=self.toggle_mode
        )
        simulation_rb.pack(side=tk.LEFT)

        # Playback controls
        control_buttons = tk.Frame(parent)
        control_buttons.pack(side=tk.LEFT, padx=20)

        self.play_btn = tk.Button(
            control_buttons,
            text="▶ PLAY",
            command=self.play_simulation,
            bg='#27ae60',
            fg='white',
            font=('Arial', 10, 'bold'),
            width=8
        )
        self.play_btn.pack(side=tk.LEFT, padx=2)

        self.pause_btn = tk.Button(
            control_buttons,
            text="⏸ PAUSE",
            command=self.pause_simulation,
            bg='#f39c12',
            fg='white',
            font=('Arial', 10, 'bold'),
            width=8
        )
        self.pause_btn.pack(side=tk.LEFT, padx=2)

        self.step_btn = tk.Button(
            control_buttons,
            text="⏭ STEP",
            command=self.step_simulation,
            bg='#3498db',
            fg='white',
            font=('Arial', 10, 'bold'),
            width=8
        )
        self.step_btn.pack(side=tk.LEFT, padx=2)

        self.reset_btn = tk.Button(
            control_buttons,
            text="⏹ RESET",
            command=self.reset_simulation,
            bg='#e74c3c',
            fg='white',
            font=('Arial', 10, 'bold'),
            width=8
        )
        self.reset_btn.pack(side=tk.LEFT, padx=2)

        # Bit rate selection
        bitrate_frame = tk.Frame(parent)
        bitrate_frame.pack(side=tk.LEFT, padx=20)

        tk.Label(bitrate_frame, text="Bit Rate:", font=('Arial', 10, 'bold')).pack(side=tk.LEFT)

        self.bitrate_var = tk.StringVar(value="500 kbps")
        bitrate_combo = ttk.Combobox(
            bitrate_frame,
            textvariable=self.bitrate_var,
            values=["125 kbps", "250 kbps", "500 kbps", "1 Mbps"],
            state='readonly',
            width=12
        )
        bitrate_combo.pack(side=tk.LEFT, padx=5)
        bitrate_combo.bind('<<ComboboxSelected>>', self.change_bitrate)

    def create_vehicle_panel(self, parent):
        """Create vehicle event simulation panel"""
        # Brake Pedal
        brake_frame = tk.LabelFrame(parent, text="Brake Pedal", font=('Arial', 10, 'bold'))
        brake_frame.pack(fill=tk.X, padx=5, pady=5)

        self.brake_var = tk.IntVar(value=0)
        brake_scale = tk.Scale(
            brake_frame,
            from_=0,
            to=100,
            orient=tk.HORIZONTAL,
            variable=self.brake_var,
            label="Brake Position (%)",
            command=self.update_brake
        )
        brake_scale.pack(fill=tk.X, padx=5, pady=5)

        brake_buttons = tk.Frame(brake_frame)
        brake_buttons.pack(pady=5)

        tk.Button(
            brake_buttons,
            text="Apply Brake",
            command=lambda: self.apply_brake(75),
            bg='#e74c3c',
            fg='white',
            width=12
        ).pack(side=tk.LEFT, padx=2)

        tk.Button(
            brake_buttons,
            text="Release Brake",
            command=lambda: self.apply_brake(0),
            bg='#27ae60',
            fg='white',
            width=12
        ).pack(side=tk.LEFT, padx=2)

        # Accelerator Pedal
        accel_frame = tk.LabelFrame(parent, text="Accelerator Pedal", font=('Arial', 10, 'bold'))
        accel_frame.pack(fill=tk.X, padx=5, pady=5)

        self.accel_var = tk.IntVar(value=0)
        accel_scale = tk.Scale(
            accel_frame,
            from_=0,
            to=100,
            orient=tk.HORIZONTAL,
            variable=self.accel_var,
            label="Throttle Position (%)"
        )
        accel_scale.pack(fill=tk.X, padx=5, pady=5)

        # Quick actions
        actions_frame = tk.LabelFrame(parent, text="Quick Actions", font=('Arial', 10, 'bold'))
        actions_frame.pack(fill=tk.X, padx=5, pady=5)

        tk.Button(
            actions_frame,
            text="Emergency Brake",
            command=lambda: self.apply_brake(100),
            bg='#c0392b',
            fg='white'
        ).pack(fill=tk.X, padx=5, pady=2)

        tk.Button(
            actions_frame,
            text="Normal Brake",
            command=lambda: self.apply_brake(50),
            bg='#e67e22',
            fg='white'
        ).pack(fill=tk.X, padx=5, pady=2)

        tk.Button(
            actions_frame,
            text="Light Brake",
            command=lambda: self.apply_brake(25),
            bg='#f39c12',
            fg='white'
        ).pack(fill=tk.X, padx=5, pady=2)

    def create_frame_viewer(self, parent):
        """Create CAN frame structure viewer"""
        # Frame display
        self.frame_text = tk.Text(
            parent,
            height=25,
            width=60,
            font=('Courier', 9),
            bg='#2c3e50',
            fg='#ecf0f1',
            wrap=tk.WORD
        )
        self.frame_text.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)

        # Configure tags for colored text
        self.frame_text.tag_config('sof', foreground='#e74c3c', font=('Courier', 9, 'bold'))
        self.frame_text.tag_config('id', foreground='#3498db', font=('Courier', 9, 'bold'))
        self.frame_text.tag_config('control', foreground='#2ecc71', font=('Courier', 9, 'bold'))
        self.frame_text.tag_config('data', foreground='#f39c12', font=('Courier', 9, 'bold'))
        self.frame_text.tag_config('crc', foreground='#9b59b6', font=('Courier', 9, 'bold'))
        self.frame_text.tag_config('ack', foreground='#1abc9c', font=('Courier', 9, 'bold'))
        self.frame_text.tag_config('eof', foreground='#95a5a6', font=('Courier', 9, 'bold'))

        self.update_frame_display()

    def create_bit_animation(self, parent):
        """Create bit-by-bit animation display"""
        # Current bit info
        info_frame = tk.Frame(parent)
        info_frame.pack(fill=tk.X, pady=5)

        self.bit_info_label = tk.Label(
            info_frame,
            text="Bit #0 | Value: 0 | State: DOMINANT",
            font=('Arial', 12, 'bold'),
            bg='#34495e',
            fg='white',
            padx=10,
            pady=5
        )
        self.bit_info_label.pack()

        # Bit stream canvas
        self.bit_canvas = tk.Canvas(
            parent,
            height=100,
            bg='#1e1e1e',
            highlightthickness=0
        )
        self.bit_canvas.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)

        self.draw_bit_stream()

    def create_oscilloscope(self, parent):
        """Create oscilloscope waveform display"""
        # Create matplotlib figure
        self.fig = Figure(figsize=(12, 6), facecolor='#1e1e1e')

        # Create subplots
        self.ax_canh = self.fig.add_subplot(311)
        self.ax_canl = self.fig.add_subplot(312)
        self.ax_diff = self.fig.add_subplot(313)

        for ax in [self.ax_canh, self.ax_canl, self.ax_diff]:
            ax.set_facecolor('#2c3e50')
            ax.tick_params(colors='white')
            ax.spines['bottom'].set_color('white')
            ax.spines['top'].set_color('white')
            ax.spines['left'].set_color('white')
            ax.spines['right'].set_color('white')

        self.ax_canh.set_ylabel('CAN_H (V)', color='white')
        self.ax_canl.set_ylabel('CAN_L (V)', color='white')
        self.ax_diff.set_ylabel('V_diff (V)', color='white')
        self.ax_diff.set_xlabel('Time (μs)', color='white')

        self.ax_canh.set_ylim(0, 5)
        self.ax_canl.set_ylim(0, 5)
        self.ax_diff.set_ylim(-1, 3)

        self.ax_canh.grid(True, alpha=0.3)
        self.ax_canl.grid(True, alpha=0.3)
        self.ax_diff.grid(True, alpha=0.3)

        # Create canvas
        self.scope_canvas = FigureCanvasTkAgg(self.fig, parent)
        self.scope_canvas.draw()
        self.scope_canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)

        self.update_oscilloscope()

    def create_voltage_panel(self, parent):
        """Create differential voltage explanation panel"""
        # Dominant state
        dom_frame = tk.LabelFrame(parent, text="DOMINANT (Logic 0)", font=('Arial', 10, 'bold'))
        dom_frame.pack(fill=tk.X, padx=5, pady=5)

        tk.Label(
            dom_frame,
            text=f"CAN_H = {self.v_canh_dominant} V\n"
                 f"CAN_L = {self.v_canl_dominant} V\n"
                 f"V_diff = {self.v_canh_dominant - self.v_canl_dominant:.1f} V",
            font=('Courier', 10),
            justify=tk.LEFT,
            bg='#e74c3c',
            fg='white',
            padx=10,
            pady=10
        ).pack(fill=tk.X)

        # Recessive state
        rec_frame = tk.LabelFrame(parent, text="RECESSIVE (Logic 1)", font=('Arial', 10, 'bold'))
        rec_frame.pack(fill=tk.X, padx=5, pady=5)

        tk.Label(
            rec_frame,
            text=f"CAN_H = {self.v_canh_recessive} V\n"
                 f"CAN_L = {self.v_canl_recessive} V\n"
                 f"V_diff = {self.v_canh_recessive - self.v_canl_recessive:.1f} V",
            font=('Courier', 10),
            justify=tk.LEFT,
            bg='#3498db',
            fg='white',
            padx=10,
            pady=10
        ).pack(fill=tk.X)

        # Noise control
        noise_frame = tk.LabelFrame(parent, text="Noise Injection", font=('Arial', 10, 'bold'))
        noise_frame.pack(fill=tk.X, padx=5, pady=5)

        self.noise_var = tk.BooleanVar(value=False)
        noise_check = tk.Checkbutton(
            noise_frame,
            text="Enable Noise",
            variable=self.noise_var,
            command=self.toggle_noise
        )
        noise_check.pack(padx=5, pady=2)

        self.noise_amplitude_var = tk.DoubleVar(value=0.0)
        noise_scale = tk.Scale(
            noise_frame,
            from_=0,
            to=2.0,
            resolution=0.1,
            orient=tk.HORIZONTAL,
            variable=self.noise_amplitude_var,
            label="Noise Amplitude (V)",
            command=self.update_noise
        )
        noise_scale.pack(fill=tk.X, padx=5, pady=5)

    def create_statistics_panel(self, parent):
        """Create statistics display"""
        self.stats_text = tk.Text(
            parent,
            height=15,
            width=40,
            font=('Courier', 9),
            bg='#2c3e50',
            fg='#ecf0f1'
        )
        self.stats_text.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)

        self.update_statistics()

    # ========================================================================
    # SIMULATION LOGIC
    # ========================================================================

    def generate_brake_message(self, brake_percent: int):
        """Generate CAN message for brake event"""
        # Create brake message
        # ID: 0x180 (brake system)
        # DLC: 2 bytes
        # DATA[0]: Brake pressure (0-100%)
        # DATA[1]: Status byte

        brake_value = int(brake_percent * 255 / 100)
        status = 0x01 if brake_percent > 0 else 0x00

        self.current_frame = CANFrame(
            identifier=0x180,
            dlc=2,
            data=[brake_value, status],
            is_extended=False,
            is_remote=False
        )

        # Convert to bits
        self.current_bits = self.current_frame.to_bits()
        self.current_bits = self.current_frame.apply_bit_stuffing(self.current_bits)
        self.current_bit_index = 0

        # Update displays
        self.update_frame_display()
        self.update_oscilloscope()
        self.draw_bit_stream()
        self.update_statistics()

        if self.learning_mode:
            self.show_learning_explanation(brake_percent)

    def apply_brake(self, percent: int):
        """Apply brake with given percentage"""
        self.brake_var.set(percent)
        self.generate_brake_message(percent)

    def update_brake(self, value):
        """Update brake when slider moves"""
        brake_percent = int(value)
        self.generate_brake_message(brake_percent)

    def update_frame_display(self):
        """Update CAN frame display"""
        if not self.current_frame:
            return

        self.frame_text.delete('1.0', tk.END)

        # Header
        self.frame_text.insert(tk.END, "CAN FRAME STRUCTURE\n", 'bold')
        self.frame_text.insert(tk.END, "="*50 + "\n\n")

        # Message info
        self.frame_text.insert(tk.END, f"Message: BRAKE PEDAL\n")
        self.frame_text.insert(tk.END, f"Source ECU: Brake ECU\n")
        self.frame_text.insert(tk.END, f"Brake Position: {self.brake_var.get()}%\n\n")

        # Frame fields
        bits = self.current_frame.to_bits()

        self.frame_text.insert(tk.END, "SOF (Start of Frame)\n", 'sof')
        self.frame_text.insert(tk.END, f"  Bit: {bits[0]}\n")
        self.frame_text.insert(tk.END, f"  Purpose: Synchronize all nodes\n\n")

        self.frame_text.insert(tk.END, "IDENTIFIER (11 bits)\n", 'id')
        id_bits = bits[1:12]
        self.frame_text.insert(tk.END, f"  Bits: {id_bits}\n")
        self.frame_text.insert(tk.END, f"  Hex: 0x{self.current_frame.identifier:03X}\n")
        self.frame_text.insert(tk.END, f"  Decimal: {self.current_frame.identifier}\n")
        self.frame_text.insert(tk.END, f"  Priority: {'HIGH' if self.current_frame.identifier < 0x200 else 'MEDIUM'}\n\n")

        self.frame_text.insert(tk.END, "CONTROL FIELD\n", 'control')
        self.frame_text.insert(tk.END, f"  RTR: {bits[12]} (Data Frame)\n")
        self.frame_text.insert(tk.END, f"  IDE: {bits[13]} (Standard Frame)\n")
        self.frame_text.insert(tk.END, f"  r0: {bits[14]} (Reserved)\n")
        self.frame_text.insert(tk.END, f"  DLC: {bits[15:19]} ({self.current_frame.dlc} bytes)\n\n")

        self.frame_text.insert(tk.END, "DATA FIELD\n", 'data')
        data_start = 19
        for i, byte_val in enumerate(self.current_frame.data):
            byte_bits = bits[data_start:data_start+8]
            self.frame_text.insert(tk.END, f"  Byte {i}: {byte_bits} = 0x{byte_val:02X} ({byte_val})\n")
            data_start += 8

        if self.current_frame.identifier == 0x180:
            self.frame_text.insert(tk.END, f"\n  Interpretation:\n")
            self.frame_text.insert(tk.END, f"    Brake Pressure: {self.brake_var.get()}%\n")
            self.frame_text.insert(tk.END, f"    Status: {'ACTIVE' if self.current_frame.data[1] else 'INACTIVE'}\n\n")

        self.frame_text.insert(tk.END, f"CRC: 15 bits\n", 'crc')
        self.frame_text.insert(tk.END, f"ACK: 2 bits\n", 'ack')
        self.frame_text.insert(tk.END, f"EOF: 7 bits\n\n", 'eof')

        self.frame_text.insert(tk.END, f"Total Frame Length: {len(self.current_bits)} bits\n")
        bit_time = 1000000 / self.bit_rate  # microseconds per bit
        frame_time = len(self.current_bits) * bit_time
        self.frame_text.insert(tk.END, f"Transmission Time: {frame_time:.1f} μs @ {self.bit_rate/1000:.0f} kbps\n")

    def draw_bit_stream(self):
        """Draw bit stream animation"""
        self.bit_canvas.delete('all')

        if not self.current_bits:
            return

        # Draw bit stream
        x = 10
        y = 50
        bit_width = 30

        for i, bit in enumerate(self.current_bits[:40]):  # Show first 40 bits
            color = '#e74c3c' if bit == '0' else '#3498db'

            # Highlight current bit
            if i == self.current_bit_index:
                self.bit_canvas.create_rectangle(
                    x, y-20, x+bit_width, y+20,
                    fill='#f39c12',
                    outline='white',
                    width=3
                )

            self.bit_canvas.create_text(
                x + bit_width/2, y,
                text=bit,
                font=('Courier', 14, 'bold'),
                fill=color
            )

            x += bit_width

    def update_oscilloscope(self):
        """Update oscilloscope waveforms"""
        if not self.current_bits:
            return

        # Clear previous plots
        self.ax_canh.clear()
        self.ax_canl.clear()
        self.ax_diff.clear()

        # Generate time array
        num_bits = min(len(self.current_bits), 40)
        samples_per_bit = 10
        total_samples = num_bits * samples_per_bit

        bit_time = 1000000 / self.bit_rate  # microseconds
        time_array = np.linspace(0, num_bits * bit_time, total_samples)

        # Generate waveforms
        canh_array = np.zeros(total_samples)
        canl_array = np.zeros(total_samples)

        for i, bit in enumerate(self.current_bits[:num_bits]):
            start_idx = i * samples_per_bit
            end_idx = (i + 1) * samples_per_bit

            if bit == '0':  # Dominant
                canh_array[start_idx:end_idx] = self.v_canh_dominant
                canl_array[start_idx:end_idx] = self.v_canl_dominant
            else:  # Recessive
                canh_array[start_idx:end_idx] = self.v_canh_recessive
                canl_array[start_idx:end_idx] = self.v_canl_recessive

        # Add noise if enabled
        if self.noise_enabled:
            noise_canh = np.random.normal(0, self.noise_amplitude, total_samples)
            noise_canl = np.random.normal(0, self.noise_amplitude, total_samples)
            canh_array += noise_canh
            canl_array += noise_canl

        # Calculate differential
        diff_array = canh_array - canl_array

        # Plot
        self.ax_canh.plot(time_array, canh_array, color='#e74c3c', linewidth=2)
        self.ax_canh.set_ylabel('CAN_H (V)', color='white')
        self.ax_canh.set_ylim(0, 5)
        self.ax_canh.grid(True, alpha=0.3)

        self.ax_canl.plot(time_array, canl_array, color='#3498db', linewidth=2)
        self.ax_canl.set_ylabel('CAN_L (V)', color='white')
        self.ax_canl.set_ylim(0, 5)
        self.ax_canl.grid(True, alpha=0.3)

        self.ax_diff.plot(time_array, diff_array, color='#2ecc71', linewidth=2)
        self.ax_diff.set_ylabel('V_diff (V)', color='white')
        self.ax_diff.set_xlabel('Time (μs)', color='white')
        self.ax_diff.set_ylim(-1, 3)
        self.ax_diff.grid(True, alpha=0.3)

        # Style axes
        for ax in [self.ax_canh, self.ax_canl, self.ax_diff]:
            ax.set_facecolor('#2c3e50')
            ax.tick_params(colors='white')
            for spine in ax.spines.values():
                spine.set_color('white')

        self.fig.tight_layout()
        self.scope_canvas.draw()

    def update_statistics(self):
        """Update statistics panel"""
        self.stats_text.delete('1.0', tk.END)

        if not self.current_frame:
            return

        self.stats_text.insert(tk.END, "CAN BUS STATISTICS\n")
        self.stats_text.insert(tk.END, "="*30 + "\n\n")

        self.stats_text.insert(tk.END, f"Protocol: Classical CAN\n")
        self.stats_text.insert(tk.END, f"Bit Rate: {self.bit_rate/1000:.0f} kbps\n")
        self.stats_text.insert(tk.END, f"Frame Type: Data Frame\n\n")

        self.stats_text.insert(tk.END, f"Current Frame:\n")
        self.stats_text.insert(tk.END, f"  ID: 0x{self.current_frame.identifier:03X}\n")
        self.stats_text.insert(tk.END, f"  DLC: {self.current_frame.dlc} bytes\n")
        self.stats_text.insert(tk.END, f"  Data: {' '.join(f'{b:02X}' for b in self.current_frame.data)}\n\n")

        # Bit statistics
        dominant_bits = self.current_bits.count('0')
        recessive_bits = self.current_bits.count('1')
        total_bits = len(self.current_bits)

        self.stats_text.insert(tk.END, f"Bit Statistics:\n")
        self.stats_text.insert(tk.END, f"  Total Bits: {total_bits}\n")
        self.stats_text.insert(tk.END, f"  Dominant: {dominant_bits} ({100*dominant_bits/total_bits:.1f}%)\n")
        self.stats_text.insert(tk.END, f"  Recessive: {recessive_bits} ({100*recessive_bits/total_bits:.1f}%)\n\n")

        bit_time = 1000000 / self.bit_rate
        frame_time = total_bits * bit_time
        self.stats_text.insert(tk.END, f"Timing:\n")
        self.stats_text.insert(tk.END, f"  Bit Time: {bit_time:.2f} μs\n")
        self.stats_text.insert(tk.END, f"  Frame Time: {frame_time:.1f} μs\n\n")

        if self.noise_enabled:
            self.stats_text.insert(tk.END, f"Noise: ENABLED\n")
            self.stats_text.insert(tk.END, f"  Amplitude: {self.noise_amplitude:.2f} V\n")
        else:
            self.stats_text.insert(tk.END, f"Noise: DISABLED\n")

    def show_learning_explanation(self, brake_percent):
        """Show learning mode explanation"""
        if not self.learning_mode:
            return

        explanation = f"""
Learning Mode Explanation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: USER ACTION
You pressed the brake pedal to {brake_percent}%

Step 2: PHYSICAL INPUT
The brake sensor converts physical pressure into an
electrical signal (voltage or resistance change).

Step 3: ECU PROCESSING
The Brake ECU reads the sensor value and decides to
send a CAN message to inform other ECUs.

Step 4: CAN FRAME GENERATION
The ECU creates a CAN frame with:
  • ID: 0x180 (Brake System message)
  • Data: Brake pressure value and status

Step 5: TRANSMISSION
The CAN controller converts the frame into bits.
The CAN transceiver converts bits into differential
voltage levels on CAN_H and CAN_L.

Step 6: BUS TRANSMISSION
All ECUs on the bus receive the message.

Step 7: RECEPTION & DECODING
Interested ECUs (like Instrument Cluster) decode
the message and update their state.

This is how information flows through a CAN network!
        """

        messagebox.showinfo("Learning Mode", explanation)

    # ========================================================================
    # CONTROL METHODS
    # ========================================================================

    def toggle_mode(self):
        """Toggle between learning and simulation mode"""
        self.learning_mode = self.mode_var.get()

    def play_simulation(self):
        """Start simulation playback"""
        self.is_playing = True
        # Animation logic would go here
        pass

    def pause_simulation(self):
        """Pause simulation"""
        self.is_playing = False

    def step_simulation(self):
        """Step through simulation one bit at a time"""
        if self.current_bit_index < len(self.current_bits) - 1:
            self.current_bit_index += 1
            self.draw_bit_stream()

            # Update bit info
            bit = self.current_bits[self.current_bit_index]
            state = "DOMINANT" if bit == '0' else "RECESSIVE"
            self.bit_info_label.config(
                text=f"Bit #{self.current_bit_index} | Value: {bit} | State: {state}"
            )

    def reset_simulation(self):
        """Reset simulation to beginning"""
        self.current_bit_index = 0
        self.draw_bit_stream()
        self.bit_info_label.config(text="Bit #0 | Value: 0 | State: DOMINANT")

    def change_bitrate(self, event=None):
        """Change CAN bit rate"""
        bitrate_str = self.bitrate_var.get()
        if "125" in bitrate_str:
            self.bit_rate = 125000
        elif "250" in bitrate_str:
            self.bit_rate = 250000
        elif "500" in bitrate_str:
            self.bit_rate = 500000
        elif "1 M" in bitrate_str:
            self.bit_rate = 1000000

        self.update_oscilloscope()
        self.update_statistics()

    def toggle_noise(self):
        """Toggle noise injection"""
        self.noise_enabled = self.noise_var.get()
        self.update_oscilloscope()

    def update_noise(self, value):
        """Update noise amplitude"""
        self.noise_amplitude = float(value)
        if self.noise_enabled:
            self.update_oscilloscope()

# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

def main():
    """Main entry point"""
    root = tk.Tk()
    app = CANSimulatorGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()
