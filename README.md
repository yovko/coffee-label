# Coffee Label Generator

A lightweight, browser-based tool for generating and printing professional coffee roast labels. Built with vanilla HTML, CSS, and JavaScript, this application requires no backend and runs directly in your browser.

## Features

* **Real-time Preview:** See the label update instantly as you type.
* **Smart Validation:** Automatically validates composition percentages (e.g., ensures Blends are mixed and Single Origins are 100% of one type).
* **Print-Ready Layout:** Optimized CSS for standard 4" x 6" label printers.
* **Local History:** Automatically saves the last 10 printed labels to your browser's Local Storage for quick reloading.
* **Dynamic Layouts:** Adjusts the visual arrangement based on whether the coffee is a Blend or Single Origin.
* **Detailed Attributes:** Support for SCA Score, Roast Level, Processing Method (with mutual exclusivity logic), Profile, Body, Acidity, and Tasting Notes.
* **QR Code Generation:** Integrated QR code generator for product links.

## How to Use

1.  Open `label.html` in any modern web browser.
2.  Fill in the coffee details in the control panel.
3.  Click **"Print & Save Label"** to generate a PDF or print directly to your label printer.
4.  Use the **History** dropdown at the top to reload previously printed labels.

## License

MIT License
