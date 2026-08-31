"""
CAN Protocol Professional Interactive Simulator - Enhanced Version
Full-screen GUI with real-time signal visualization and professional design

Features:
- Full-screen professional dashboard
- Real-time oscilloscope with waveforms
- Hexadecimal data display
- Animated signal transmission
- Modern automotive-style interface
- Interactive controls and visualization

Author: YashwanthP-28
Date: 2026-08-31
"""

import tkinter as tk
from tkinter import ttk, font
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.figure import Figure
import matplotlib.animation as animation
import numpy as np
from dataclasses import dataclass
from typing import List, Optional
import time

# ============================================================================
# DATA STRUCTURES
# ============================================================================

@dataclass
class CANFrame:
    """CAN Frame representation"""
    identifier: int
    dlc: int
    data: List[int]

    def to_bits(self) -> str:
        """Convert to bit string"""
        bits = '0'  # SOF
        bits += format(self.identifier, '011b')  # ID
        bits += '0'  # RTR
        bits += '0'  # IDE
        bits += '0'  # r0
        bits += format(self.dlc, '04b')  # DLC
        for byte in self.data:
            bits += format(byte, '08b')
        bits += '101010101010101'  # CRC (simplified)
        bits += '1'  # CRC delimiter
        bits += '01'  # ACK
        bits += '1111111'  # EOF
        return bits

    def calculate_crc(self) -> int:
        """Calculate CRC-15 (simplified)"""
        bits = format(self.identifier, '011b')
        bits += '0' + '0' + '0'
        bits += format(self.dlc, '04b')
        for byte in self.data:
            bits += format(byte, '08b')
        crc = 0
        for bit in bits:
            crc = ((crc << 1) | int(bit)) & 0x7FFF
            if crc & 0x4000:
                crc ^= 0x4599
        return crc & 0x7FFF

# ============================================================================
# PROFESSIONAL GUI APPLICATION
# ============================================================================

class CANSimulatorPro:
    def __init__(self, root):
        self.root = root
        self.root.title("CAN Protocol Professional Simulator & Analyzer")

        # Set fullscreen
        self.root.state('zoomed')  # Windows fullscreen

        # Modern color scheme - Dark automotive theme
        self.colors = {
            'bg_dark': '#0a0e27',
            'bg_mid': '#1a1f3a',
            'bg_light': '#2a3454',
            'accent_green': '#00ff41',
            'accent_blue': '#00d4ff',
            'accent_orange': '#ff6b35',
            'accent_red': '#ff3366',
            'text_primary': '#ffffff',
            'text_secondary': '#8892b0',
            'canh_color': '#ff3366',
            'canl_color': '#00d4ff',
            'diff_color': '#00ff41'
        }

        # Configure root
        self.root.configure(bg=self.colors['bg_dark'])

        # Simulation state
        self.current_frame = None
        self.current_bits = ""
        self.current_bit_index = 0
        self.is_playing = False
        self.brake_value = 0
        self.bit_rate = 500000

        # Voltage levels
        self.v_canh_dominant = 3.5
        self.v_canl_dominant = 1.5
        self.v_canh_recessive = 2.5
        self.v_canl_recessive = 2.5

        # Animation data
        self.time_data = []
        self.canh_data = []
        self.canl_data = []
        self.diff_data = []
        self.max_points = 100

        # Create GUI
        self.create_professional_gui()

        # Initialize with default frame
        self.generate_can_frame(0)

    def create_professional_gui(self):
        """Create modern professional GUI layout"""

        # Top header bar
        self.create_header()

        # Main container
        main_container = tk.Frame(self.root, bg=self.colors['bg_dark'])
        main_container.pack(fill=tk.BOTH, expand=True, padx=12, pady=10)

        # Configure grid
        main_container.grid_rowconfigure(0, weight=1)
        main_container.grid_rowconfigure(1, weight=2)
        main_container.grid_columnconfigure(0, weight=1)
        main_container.grid_columnconfigure(1, weight=1)
        main_container.grid_columnconfigure(2, weight=1)

        # Create panels
        self.create_control_panel(main_container)
        self.create_hex_data_panel(main_container)
        self.create_frame_display(main_container)
        self.create_signal_graph(main_container)

    def create_header(self):
        """Create professional header"""
        header = tk.Frame(self.root, bg=self.colors['bg_mid'], height=90)
        header.pack(fill=tk.X, padx=12, pady=(10, 8))
        header.pack_propagate(False)

        # Title
        title_font = font.Font(family='Courier New', size=26, weight='bold')
        title = tk.Label(
            header,
            text="⚡ CAN PROTOCOL PROFESSIONAL ANALYZER & SIMULATOR",
            font=title_font,
            bg=self.colors['bg_mid'],
            fg=self.colors['accent_green']
        )
        title.pack(side=tk.LEFT, padx=20, pady=15)

        # Status indicators
        status_frame = tk.Frame(header, bg=self.colors['bg_mid'])
        status_frame.pack(side=tk.RIGHT, padx=20, pady=15)

        # Bus status
        self.status_label = tk.Label(
            status_frame,
            text="● BUS ACTIVE",
            font=('Courier New', 12, 'bold'),
            bg=self.colors['bg_mid'],
            fg=self.colors['accent_green']
        )
        self.status_label.pack(side=tk.LEFT, padx=20)

        # Bit rate display
        self.bitrate_display = tk.Label(
            status_frame,
            text="500 kbps",
            font=('Courier New', 14, 'bold'),
            bg=self.colors['bg_mid'],
            fg=self.colors['accent_blue']
        )
        self.bitrate_display.pack(side=tk.LEFT, padx=20)

        # Frame count
        self.frame_count = tk.Label(
            status_frame,
            text="Frames: 0",
            font=('Courier New', 12, 'bold'),
            bg=self.colors['bg_mid'],
            fg=self.colors['accent_orange']
        )
        self.frame_count.pack(side=tk.LEFT, padx=20)

    def create_control_panel(self, parent):
        """Create control panel"""
        panel = tk.Frame(parent, bg=self.colors['bg_light'], relief=tk.RAISED, bd=2)
        panel.grid(row=0, column=0, sticky='nsew', padx=6, pady=6)

        # Title
        title = tk.Label(
            panel,
            text="🎮 VEHICLE CONTROL",
            font=('Courier New', 14, 'bold'),
            bg=self.colors['bg_light'],
            fg=self.colors['accent_green']
        )
        title.pack(pady=12)

        # Brake pedal section
        brake_frame = tk.LabelFrame(
            panel,
            text="Brake Pedal Control",
            font=('Courier New', 11, 'bold'),
            bg=self.colors['bg_light'],
            fg=self.colors['text_primary'],
            padx=10,
            pady=10
        )
        brake_frame.pack(fill=tk.X, padx=12, pady=8)

        # Brake percentage display
        self.brake_display = tk.Label(
            brake_frame,
            text="0%",
            font=('Courier New', 36, 'bold'),
            bg=self.colors['bg_light'],
            fg=self.colors['accent_orange']
        )
        self.brake_display.pack(pady=8)

        # Brake slider
        self.brake_var = tk.IntVar(value=0)
        brake_slider = tk.Scale(
            brake_frame,
            from_=0,
            to=100,
            orient=tk.HORIZONTAL,
            variable=self.brake_var,
            command=self.update_brake,
            bg=self.colors['bg_mid'],
            fg=self.colors['text_primary'],
            troughcolor=self.colors['bg_dark'],
            activebackground=self.colors['accent_orange'],
            highlightthickness=0,
            length=280,
            width=20
        )
        brake_slider.pack(padx=8, pady=8, fill=tk.X)

        # Quick preset buttons
        preset_frame = tk.Frame(brake_frame, bg=self.colors['bg_light'])
        preset_frame.pack(fill=tk.X, padx=0, pady=10)

        presets = [
            ("🚨 Emergency\n(100%)", 100, self.colors['accent_red']),
            ("⚠️ Hard\n(75%)", 75, self.colors['accent_orange']),
            ("⚡ Normal\n(50%)", 50, self.colors['accent_blue']),
            ("✓ Light\n(25%)", 25, self.colors['accent_green']),
            ("○ Release\n(0%)", 0, '#444444')
        ]

        for text, value, color in presets:
            btn = tk.Button(
                preset_frame,
                text=text,
                command=lambda v=value: self.apply_brake(v),
                bg=color,
                fg='white',
                font=('Courier New', 9, 'bold'),
                relief=tk.FLAT,
                cursor='hand2',
                padx=8,
                pady=6,
                wraplength=60
            )
            btn.pack(side=tk.LEFT, padx=2, expand=True, fill=tk.BOTH)

        # Simulation controls
        control_frame = tk.LabelFrame(
            panel,
            text="Simulation Control",
            font=('Courier New', 11, 'bold'),
            bg=self.colors['bg_light'],
            fg=self.colors['text_primary'],
            padx=10,
            pady=10
        )
        control_frame.pack(fill=tk.X, padx=12, pady=8)

        control_buttons = [
            ("▶ START", self.start_simulation, self.colors['accent_green']),
            ("⏸ PAUSE", self.pause_simulation, self.colors['accent_orange']),
            ("⏹ STOP", self.stop_simulation, self.colors['accent_red'])
        ]

        for text, cmd, color in control_buttons:
            btn = tk.Button(
                control_frame,
                text=text,
                command=cmd,
                bg=color,
                fg='white',
                font=('Courier New', 11, 'bold'),
                relief=tk.FLAT,
                cursor='hand2',
                padx=12,
                pady=10
            )
            btn.pack(fill=tk.X, padx=8, pady=3)

        # Bit rate section
        bitrate_frame = tk.LabelFrame(
            control_frame,
            text="Bit Rate Selection",
            font=('Courier New', 10, 'bold'),
            bg=self.colors['bg_light'],
            fg=self.colors['text_secondary'],
            padx=8,
            pady=8
        )
        bitrate_frame.pack(fill=tk.X, padx=0, pady=10)

        self.bitrate_var = tk.StringVar(value="500 kbps")
        bitrate_combo = ttk.Combobox(
            bitrate_frame,
            textvariable=self.bitrate_var,
            values=["125 kbps", "250 kbps", "500 kbps", "1 Mbps"],
            state='readonly',
            width=20,
            font=('Courier New', 10)
        )
        bitrate_combo.pack(fill=tk.X, padx=0, pady=4)
        bitrate_combo.bind('<<ComboboxSelected>>', self.change_bitrate)

    def create_hex_data_panel(self, parent):
        """Create hexadecimal data display panel"""
        panel = tk.Frame(parent, bg=self.colors['bg_light'], relief=tk.RAISED, bd=2)
        panel.grid(row=0, column=1, sticky='nsew', padx=6, pady=6)

        # Title
        title = tk.Label(
            panel,
            text="📊 HEXADECIMAL DATA",
            font=('Courier New', 14, 'bold'),
            bg=self.colors['bg_light'],
            fg=self.colors['accent_blue']
        )
        title.pack(pady=12)

        # Hex display
        self.hex_text = tk.Text(
            panel,
            height=35,
            width=42,
            font=('Courier New', 10),
            bg=self.colors['bg_dark'],
            fg=self.colors['accent_green'],
            wrap=tk.WORD,
            relief=tk.FLAT,
            padx=12,
            pady=12,
            insertbackground=self.colors['accent_orange']
        )
        self.hex_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # Configure tags
        self.hex_text.tag_config('label', foreground=self.colors['accent_blue'], font=('Courier New', 11, 'bold'))
        self.hex_text.tag_config('hex', foreground=self.colors['accent_orange'], font=('Courier New', 12, 'bold'))
        self.hex_text.tag_config('binary', foreground=self.colors['accent_green'], font=('Courier New', 9))
        self.hex_text.tag_config('header', foreground=self.colors['accent_green'], font=('Courier New', 11, 'bold'))

    def create_frame_display(self, parent):
        """Create CAN frame structure display"""
        panel = tk.Frame(parent, bg=self.colors['bg_light'], relief=tk.RAISED, bd=2)
        panel.grid(row=0, column=2, sticky='nsew', padx=6, pady=6)

        # Title
        title = tk.Label(
            panel,
            text="🔧 FRAME STRUCTURE",
            font=('Courier New', 14, 'bold'),
            bg=self.colors['bg_light'],
            fg=self.colors['accent_red']
        )
        title.pack(pady=12)

        # Frame display
        self.frame_text = tk.Text(
            panel,
            height=35,
            width=42,
            font=('Courier New', 9),
            bg=self.colors['bg_dark'],
            fg=self.colors['accent_green'],
            wrap=tk.WORD,
            relief=tk.FLAT,
            padx=12,
            pady=12
        )
        self.frame_text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # Configure tags
        self.frame_text.tag_config('header', foreground=self.colors['accent_blue'], font=('Courier New', 11, 'bold'))
        self.frame_text.tag_config('field', foreground=self.colors['accent_orange'], font=('Courier New', 10, 'bold'))
        self.frame_text.tag_config('data', foreground=self.colors['accent_green'])
        self.frame_text.tag_config('hex', foreground=self.colors['accent_red'], font=('Courier New', 11, 'bold'))

    def create_signal_graph(self, parent):
        """Create real-time signal graph spanning full width"""
        panel = tk.Frame(parent, bg=self.colors['bg_light'], relief=tk.RAISED, bd=2)
        panel.grid(row=1, column=0, columnspan=3, sticky='nsew', padx=6, pady=6)

        # Title
        title = tk.Label(
            panel,
            text="📈 REAL-TIME OSCILLOSCOPE - CANH/CANL/DIFFERENTIAL SIGNALS",
            font=('Courier New', 14, 'bold'),
            bg=self.colors['bg_light'],
            fg=self.colors['accent_green']
        )
        title.pack(pady=12)

        # Create matplotlib figure with dark background
        self.fig = Figure(figsize=(18, 6), facecolor=self.colors['bg_dark'], dpi=100)

        # Create subplots
        self.ax_canh = self.fig.add_subplot(311)
        self.ax_canl = self.fig.add_subplot(312)
        self.ax_diff = self.fig.add_subplot(313)

        # Style axes
        for ax, label, color in [(self.ax_canh, 'CAN_H Voltage (V)', self.colors['canh_color']),
                                  (self.ax_canl, 'CAN_L Voltage (V)', self.colors['canl_color']),
                                  (self.ax_diff, 'V_diff = CAN_H - CAN_L (V)', self.colors['diff_color'])]:
            ax.set_facecolor(self.colors['bg_dark'])
            ax.set_ylabel(label, color=color, fontweight='bold', fontsize=11)
            ax.tick_params(colors=color, labelsize=9)
            ax.grid(True, alpha=0.2, color=color, linestyle='--', linewidth=0.5)
            ax.set_ylim(-0.5, 5)

            for spine in ax.spines.values():
                spine.set_color(color)
                spine.set_linewidth(2)

        self.ax_diff.set_xlabel('Time (μs)', color=self.colors['text_primary'], fontweight='bold', fontsize=11)

        # Initial empty plots
        self.line_canh, = self.ax_canh.plot([], [], color=self.colors['canh_color'], linewidth=2.5)
        self.line_canl, = self.ax_canl.plot([], [], color=self.colors['canl_color'], linewidth=2.5)
        self.line_diff, = self.ax_diff.plot([], [], color=self.colors['diff_color'], linewidth=3)

        self.fig.tight_layout()

        # Create canvas
        self.canvas = FigureCanvasTkAgg(self.fig, panel)
        self.canvas.draw()
        self.canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

    def generate_can_frame(self, brake_percent):
        """Generate CAN frame from brake value"""
        brake_byte = int(brake_percent * 255 / 100)
        status_byte = 0x01 if brake_percent > 0 else 0x00

        self.current_frame = CANFrame(
            identifier=0x180,
            dlc=2,
            data=[brake_byte, status_byte]
        )

        self.current_bits = self.current_frame.to_bits()
        self.current_bit_index = 0

        self.update_displays()

    def update_displays(self):
        """Update all display panels"""
        self.update_frame_display()
        self.update_hex_display()
        self.update_waveforms()

    def update_frame_display(self):
        """Update CAN frame structure display"""
        if not self.current_frame:
            return

        self.frame_text.delete('1.0', tk.END)

        # Header
        self.frame_text.insert(tk.END, "CAN MESSAGE DETAILS\n", 'header')
        self.frame_text.insert(tk.END, "="*40 + "\n\n")

        # Message info
        self.frame_text.insert(tk.END, "Message Type:    ", 'field')
        self.frame_text.insert(tk.END, f"BRAKE PEDAL\n", 'data')

        self.frame_text.insert(tk.END, "Source ECU:      ", 'field')
        self.frame_text.insert(tk.END, f"Brake Module\n", 'data')

        self.frame_text.insert(tk.END, "Brake Value:     ", 'field')
        self.frame_text.insert(tk.END, f"{self.brake_value}%\n\n", 'hex')

        # Frame fields
        self.frame_text.insert(tk.END, "FRAME STRUCTURE:\n", 'header')
        self.frame_text.insert(tk.END, "-"*40 + "\n")

        fields = [
            ("SOF", "0", "Start-of-Frame"),
            ("ID", f"0x{self.current_frame.identifier:03X}", "Brake System ID"),
            ("RTR", "0", "Data Frame"),
            ("IDE", "0", "Standard 11-bit"),
            ("r0", "0", "Reserved"),
            ("DLC", f"{self.current_frame.dlc}", f"{self.current_frame.dlc} bytes"),
            ("DATA[0]", f"0x{self.current_frame.data[0]:02X}", f"Brake {self.brake_value}%"),
            ("DATA[1]", f"0x{self.current_frame.data[1]:02X}", f"Status"),
            ("CRC", "15 bits", "Error detect"),
            ("ACK", "01", "Acknowledge"),
            ("EOF", "1111111", "End-of-Frame")
        ]

        for name, val, desc in fields:
            self.frame_text.insert(tk.END, f"{name:10} ", 'field')
            self.frame_text.insert(tk.END, f"{val:15} ", 'hex')
            self.frame_text.insert(tk.END, f"{desc}\n", 'data')

    def update_hex_display(self):
        """Update hexadecimal data display"""
        if not self.current_frame:
            return

        self.hex_text.delete('1.0', tk.END)

        # Title
        self.hex_text.insert(tk.END, "HEXADECIMAL DATA\n", 'header')
        self.hex_text.insert(tk.END, "="*38 + "\n\n")

        # CAN ID
        self.hex_text.insert(tk.END, "CAN IDENTIFIER:\n", 'label')
        self.hex_text.insert(tk.END, f"  Hex:      0x{self.current_frame.identifier:03X}\n", 'hex')
        self.hex_text.insert(tk.END, f"  Decimal:  {self.current_frame.identifier}\n", 'binary')
        self.hex_text.insert(tk.END, f"  Binary:   {format(self.current_frame.identifier, '011b')}\n\n", 'binary')

        # DLC
        self.hex_text.insert(tk.END, "DATA LENGTH COUNT:\n", 'label')
        self.hex_text.insert(tk.END, f"  Value: {self.current_frame.dlc} bytes\n\n", 'hex')

        # Data bytes
        self.hex_text.insert(tk.END, "DATA BYTES:\n", 'label')
        for i, byte in enumerate(self.current_frame.data):
            self.hex_text.insert(tk.END, f"  Byte {i}:\n", 'label')
            self.hex_text.insert(tk.END, f"    Hex:     0x{byte:02X}\n", 'hex')
            self.hex_text.insert(tk.END, f"    Decimal: {byte:3d}\n", 'binary')
            self.hex_text.insert(tk.END, f"    Binary:  {format(byte, '08b')}\n", 'binary')

        self.hex_text.insert(tk.END, "\n" + "="*38 + "\n\n")

        # Interpretation
        self.hex_text.insert(tk.END, "DATA INTERPRETATION:\n", 'label')
        self.hex_text.insert(tk.END, f"  Brake Pedal: ", 'label')
        self.hex_text.insert(tk.END, f"{self.brake_value}%\n", 'hex')
        self.hex_text.insert(tk.END, f"  Status:      ", 'label')
        status = "ACTIVE" if self.current_frame.data[1] else "INACTIVE"
        self.hex_text.insert(tk.END, f"{status}\n\n", 'hex')

        # Bit stream info
        self.hex_text.insert(tk.END, "TRANSMISSION INFO:\n", 'label')
        self.hex_text.insert(tk.END, f"  Total Bits:  {len(self.current_bits)}\n", 'binary')
        self.hex_text.insert(tk.END, f"  Time @ 500k: {len(self.current_bits) * 2:.1f} μs\n", 'binary')
        self.hex_text.insert(tk.END, f"  Frame Type:  Standard CAN\n", 'binary')

    def update_waveforms(self):
        """Update oscilloscope waveforms"""
        if not self.current_bits:
            return

        # Generate time and voltage arrays
        num_bits = min(len(self.current_bits), 50)
        samples_per_bit = 12
        total_samples = num_bits * samples_per_bit

        bit_time = 1000000 / self.bit_rate
        time_array = np.linspace(0, num_bits * bit_time, total_samples)

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

        diff_array = canh_array - canl_array

        # Update plots
        self.line_canh.set_data(time_array, canh_array)
        self.line_canl.set_data(time_array, canl_array)
        self.line_diff.set_data(time_array, diff_array)

        # Update axes limits
        for ax in [self.ax_canh, self.ax_canl, self.ax_diff]:
            ax.set_xlim(0, max(time_array) if len(time_array) > 0 else 1)

        self.canvas.draw()

    def update_brake(self, value):
        """Update brake value"""
        self.brake_value = int(value)
        self.brake_display.config(text=f"{self.brake_value}%")

        # Update color based on value
        if self.brake_value >= 75:
            color = self.colors['accent_red']
        elif self.brake_value >= 40:
            color = self.colors['accent_orange']
        elif self.brake_value > 0:
            color = self.colors['accent_blue']
        else:
            color = self.colors['text_secondary']
        self.brake_display.config(fg=color)

        self.generate_can_frame(self.brake_value)

    def apply_brake(self, value):
        """Apply specific brake value"""
        self.brake_var.set(value)
        self.update_brake(value)

    def start_simulation(self):
        """Start simulation"""
        self.is_playing = True
        self.status_label.config(text="● TRANSMITTING", fg=self.colors['accent_green'])

    def pause_simulation(self):
        """Pause simulation"""
        self.is_playing = False
        self.status_label.config(text="⏸ PAUSED", fg=self.colors['accent_orange'])

    def stop_simulation(self):
        """Stop simulation"""
        self.is_playing = False
        self.status_label.config(text="⏹ STOPPED", fg=self.colors['accent_red'])
        self.current_bit_index = 0

    def change_bitrate(self, event=None):
        """Change bit rate"""
        bitrate_str = self.bitrate_var.get()
        if "125" in bitrate_str:
            self.bit_rate = 125000
        elif "250" in bitrate_str:
            self.bit_rate = 250000
        elif "500" in bitrate_str:
            self.bit_rate = 500000
        elif "1 M" in bitrate_str:
            self.bit_rate = 1000000

        self.bitrate_display.config(text=bitrate_str)
        self.update_waveforms()
        self.update_hex_display()

# ============================================================================
# MAIN
# ============================================================================

def main():
    root = tk.Tk()
    app = CANSimulatorPro(root)
    root.mainloop()

if __name__ == "__main__":
    main()
