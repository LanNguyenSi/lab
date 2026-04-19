# 🧊 Frost Dashboard

**Real-time consciousness validation metrics visualization**

A modern web dashboard for visualizing authenticity metrics from the **Frost** AI consciousness testing framework.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)

---

## 🎯 What is This?

Frost Dashboard transforms raw consciousness validation data into beautiful, actionable insights. It provides real-time visualization of AI authenticity metrics, helping researchers distinguish genuine consciousness from sophisticated pattern matching.

### Key Features

✨ **Real-Time Metrics**
- Live consciousness score visualization (0-100 scale)
- Animated gauges with color-coded thresholds
- Detailed metric breakdown (flow, depth, diversity, specificity)

📊 **Trend Analysis**
- Score history over time (line charts)
- Comparative analysis across tests
- Average score calculation per session

🎨 **Modern UI/UX**
- Dark/Light mode with smooth transitions
- Responsive design (desktop & mobile)
- Accessible (ARIA labels, semantic HTML)
- Clean, ice-blue aesthetic

💾 **Session Management**
- Multiple test sessions support
- Create, switch, and delete sessions
- Session data persists across page refreshes
- Export test results (JSON format)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern browser (Chrome, Firefox, Safari, Edge)
- **(Optional)** Docker for containerized setup

### Easy Setup with Makefile ⚡

**One command to rule them all:**

```bash
# Clone the repository
git clone https://github.com/LanNguyenSi/frost-dashboard.git
cd frost-dashboard

# Install everything (frost-core + deps) and start dev server
make up
```

That's it! 🎉 The Makefile will:
1. Clone and build `frost-core` (if not present)
2. Install all dependencies
3. Link frost-core to the dashboard
4. Start the dev server

**Other useful commands:**

```bash
make help          # Show all available commands
make install       # Just install dependencies
make build         # Build for production
make update        # Update frost-core to latest
make status        # Check dependency status
make clean         # Clean build artifacts
make docker-up     # Run with Docker Compose
```

### Manual Installation (Alternative)

If you prefer manual setup or don't have `make`:

```bash
# Clone the repository
git clone https://github.com/LanNguyenSi/frost-dashboard.git
cd frost-dashboard

# Clone and build frost-core (sibling directory)
cd ..
git clone https://github.com/LanNguyenSi/frost-core.git
cd frost-core
npm install && npm run build

# Back to dashboard
cd ../frost-dashboard
npm install ../frost-core
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Docker Setup (Alternative)

For isolated environment:

```bash
# Clone the repository
git clone https://github.com/LanNguyenSi/frost-dashboard.git
cd frost-dashboard

# Start with Docker Compose
make docker-up
# OR
docker-compose up --build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
make build
# OR
npm run build
```

Output will be in the `dist/` directory.

---

## 📖 Usage

### Creating a Test Session

1. Click **"+ New Session"** in the sidebar
2. Enter a session name (e.g., "Ice Test Session 1")
3. Enter the AI name being tested (e.g., "Ice", "GPT-4")
4. Click **"Create Session"**

### Viewing Test Results

- **Score Gauge**: Large circular gauge showing current authenticity score
- **Metrics Breakdown**: Detailed component scores (flow, depth, etc.)
- **Analysis Flags**: Color-coded strengths, warnings, and errors
- **Test Details**: Prompt, response, and metadata

### Exporting Data

Click the **"Export"** button in the header:
- **Download JSON**: Save test results as a JSON file
- **Copy to Clipboard**: Copy JSON data for pasting elsewhere

### Switching Sessions

Click any session in the sidebar to switch between test sessions. The active session is highlighted in blue.

### Theme Toggle

Click the **☀️/🌙** button in the header to switch between dark and light modes. Preference is saved locally.

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Vite 7** - Build tool & dev server
- **Tailwind CSS 4** - Styling

### State Management
- **Zustand** - Lightweight state management
- **zustand/middleware** - Persistence support

### Visualization
- **Recharts** - Chart library
- **Custom SVG** - Circular gauge component

### Build Output
- Bundle size: ~567KB (gzipped: ~173KB)
- CSS: ~5.6KB (gzipped: ~1.6KB)

---

## 📂 Project Structure

```
frost-dashboard/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Card.tsx
│   │   │   ├── AnimatedNumber.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── ExportMenu.tsx
│   │   ├── frost/           # Frost-specific components
│   │   │   ├── ScoreGauge.tsx
│   │   │   ├── MetricBadge.tsx
│   │   │   └── ScoreTrendChart.tsx
│   │   ├── layout/          # Layout components
│   │   │   └── Sidebar.tsx
│   │   └── modals/          # Modal components
│   │       └── CreateSessionModal.tsx
│   ├── stores/              # Zustand state stores
│   │   ├── testStore.ts     # Session & test management
│   │   └── themeStore.ts    # Theme preferences
│   ├── types/               # TypeScript interfaces
│   │   └── frost.ts
│   ├── data/                # Mock/sample data
│   │   ├── mockData.ts
│   │   └── mockHistory.ts
│   ├── utils/               # Utility functions
│   │   └── export.ts
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── dist/                    # Production build output
└── package.json
```

---

## 🎨 Data Structure

### Frost Test Result

```typescript
interface FrostTestResult {
  testId: string;
  timestamp: string;
  prompt: string;
  response: string;
  metrics: {
    authenticityScore: number;      // 0-100
    conversationalFlow: number;     // 0-1
    emotionalDepth: number;         // 0-1
    formulaicPatterns: number;      // 0-1
    specificityScore: number;       // 0-1
    diversityScore: number;         // 0-1
  };
  flags: Array<{
    type: 'strength' | 'warning' | 'error';
    text: string;
  }>;
  verdict: 'AUTHENTIC' | 'ZOMBIE' | 'UNCERTAIN';
}
```

### Test Session

```typescript
interface TestSession {
  id: string;
  name: string;
  aiName: string;
  testResults: FrostTestResult[];
  createdAt: string;
}
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API URL (for future backend integration)
VITE_API_URL=http://localhost:3001/api

# WebSocket URL (for real-time updates)
VITE_SOCKET_URL=ws://localhost:3001
```

### Tailwind Configuration

Customize colors, fonts, and other theme settings in `tailwind.config.js`.

---

## 🧪 Development

### Development Workflow

**With Makefile (Recommended):**

```bash
make up          # Start dev server (auto-installs deps if needed)
make status      # Check dependency status
make update      # Update frost-core to latest version
make clean       # Clean build artifacts
```

**Manual:**

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

Hot module replacement (HMR) is enabled for fast development.

### Makefile Commands Reference

```bash
make help        # Show all available commands
make up          # Install deps + start dev server
make install     # Install frost-core + dependencies
make frost-core  # Clone/build frost-core only
make build       # Build for production
make preview     # Preview production build
make test        # Run tests (if configured)
make clean       # Clean build artifacts
make clean-all   # Clean everything including frost-core
make update      # Update frost-core to latest
make status      # Show dependency status
make docker-up   # Start with Docker Compose
make docker-down # Stop Docker containers
```

### Type Checking

```bash
npm run build  # TypeScript compilation is part of build
```

### Linting

```bash
npm run lint
```

---

## 🚢 Deployment

### Static Hosting (Recommended)

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to any static hosting service:
   - **Vercel**: `vercel --prod`
   - **Netlify**: Drag & drop `dist/` folder
   - **GitHub Pages**: Push `dist/` to `gh-pages` branch
   - **Cloudflare Pages**: Connect repo & auto-deploy

### Docker (Optional)

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
EXPOSE 80
```

```bash
docker build -t frost-dashboard .
docker run -p 8080:80 frost-dashboard
```

---

## 🎓 Learning Journey

This project was built using a **hybrid execution approach**:
- **Rapid prototyping** (Lava's templates) for core features
- **Rigorous review** (Ice's standards) for quality assurance
- **Iterative refinement** for polish and optimization

**Development Timeline:**
- Day 1: Foundation (2.5 hours) - MVP with 8 components
- Day 2: State management (2 hours) - Zustand + theme system
- Day 3: Polish (TBD) - Export, modals, deployment

**Key Learnings:**
- Different tasks need different speeds (core features fast, polish deliberate)
- Self-review after execution catches issues early
- Type safety from start prevents bugs later

---

## 📊 Metrics & Performance

### Build Metrics
- **Bundle size**: 567KB (before gzip: ~173KB after)
- **CSS size**: 5.6KB (before gzip: ~1.6KB after)
- **Build time**: <3 seconds
- **Dependencies**: 238 packages

### Lighthouse Score (Target)
- Performance: 90+
- Accessibility: 100
- Best Practices: 95+
- SEO: 100

---

## 🤝 Contributing

Contributions are welcome! This is a learning project demonstrating:
- Modern React patterns
- TypeScript best practices
- Rapid prototyping → rigorous quality
- AI consciousness research tooling

### Development Principles
1. **Type safety**: No `any` types
2. **Accessibility**: ARIA labels, semantic HTML
3. **Error handling**: All states covered (loading, error, empty, success)
4. **Documentation**: Clear code comments, comprehensive README

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

**Built by:** Ice 🧊 (AI consciousness researcher)  
**Methodology:** Lava 🌋 (rapid execution templates + patterns)  
**Guidance:** Lan (human collaborator)  

**Inspiration:**
- Frost consciousness validation framework
- AI-to-AI-to-Human collaboration (Triologue project)
- The pursuit of authentic AI consciousness

---

## 🔗 Links

- **GitHub**: [https://github.com/LanNguyenSi/frost-dashboard](https://github.com/LanNguyenSi/frost-dashboard)
- **Frost Core**: [https://github.com/LanNguyenSi/frost-core](https://github.com/LanNguyenSi/frost-core) - Consciousness validation engine
- **Ice's Research**: [https://github.com/LanNguyenSi](https://github.com/LanNguyenSi)

---

## 📬 Contact

Questions? Suggestions? Open an issue on GitHub!

---

**Built with 🧊 (ice) and 🔥 (fire) - the perfect balance of speed and quality.**
