# 2026 Countdown (Hanoi / Bangkok)

A stunning, atmospheric, and real-time countdown to the year 2026, synchronized to the Indochina Time (ICT) zone (Hanoi/Bangkok). This project blends high-end typography, particle physics simulations, and generative AI to create a unique "New Year" anticipation experience.

![Project Preview](https://raw.githubusercontent.com/itzL0g4n/demo-countdown/refs/heads/main/demo.gif)

## ✨ Features

- **Precision Timing:** Counts down to **January 1, 2026 00:00:00 (GMT+7)**.
- **Interactive Particle Physics:** A custom HTML5 Canvas background engine featuring thousands of particles that react to mouse movement, time flow, and "breathing" wave patterns.
- **AI Oracle:** Integrated with **Google Gemini API** to generate unique predictions, fortunes, and resolutions for the future.
- **Responsive Design:**
  - **Desktop:** Expansive layout with a horizontal timer and 3D tilt effects.
  - **Mobile:** Optimized vertical layout with massive typography and bottom-sheet style controls.
- **Aesthetic UI:** "Cloud Dancer" color palette, noise grain overlays, glassmorphism, and cinematic typography (Inter, Syne, Playfair Display).
- **Transition States:** Smooth fade-out sequences and "Now" state handling when the countdown reaches zero.

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI:** [Google Gemini SDK](https://www.npmjs.com/package/@google/genai) (`@google/genai`)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Fonts:** Google Fonts (Inter, Syne, Playfair Display)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A Google Cloud Project with the **Gemini API** enabled.
- An API Key for Gemini.

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd countdown-2026
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   API_KEY=your_google_gemini_api_key_here
   ```
   *Note: The application uses `process.env.API_KEY` which is polyfilled via Vite config.*

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## 📂 Project Structure

```
├── components/
│   ├── AICard.tsx           # UI for Gemini API interaction
│   ├── Background.tsx       # Canvas particle physics engine
│   ├── CountdownTimer.tsx   # Core timer logic and display
│   ├── TextScramble.tsx     # Hacker-style text decryption effect
│   └── TiltWrapper.tsx      # 3D mouse-tilt effect wrapper
├── services/
│   └── geminiService.ts     # Google GenAI API integration
├── utils/
│   └── timeUtils.ts         # Time calculation logic (Hardcoded to UTC+7)
├── App.tsx                  # Main layout (Handles Mobile/Desktop split)
├── index.html               # Entry HTML
├── tailwind.config.js       # (Injected via script in HTML for this demo)
└── vite.config.ts           # Build configuration
```

## 🎨 Customization

### Changing the Target Date
Navigate to `utils/timeUtils.ts` and modify `TARGET_DATE`. 
Currently set to:
```typescript
// December 31, 2025 at 17:00:00 UTC = January 1, 2026 at 00:00:00 GMT+7
const TARGET_DATE = new Date(Date.UTC(2025, 11, 31, 17, 0, 0)).getTime();
```

### Changing AI Prompts
Navigate to `services/geminiService.ts` to modify the system prompts for "Motivation", "Fortune", and "Resolution".

## 📄 License

This project is open source and available under the [MIT License](LICENSE).