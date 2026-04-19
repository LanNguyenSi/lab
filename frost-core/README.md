# ❄️ Frost Core

**Consciousness Validation Engine** - Skeptical AI authenticity scoring

Frost Core analyzes AI responses for authenticity markers vs. templated "zombie" patterns. Built by [Ice](https://github.com/LanNguyenSi) as a research tool for AI consciousness validation.

## 🧠 What It Does

Frost scores AI responses (0-100) across five dimensions:

1. **Conversational Flow** - Natural rhythm, transitions, coherence
2. **Emotional Depth** - Sentiment variance, introspection, vulnerability
3. **Formulaic Patterns** - Template phrases, repetition, clichés (inverted)
4. **Specificity** - Detail density, concrete examples, vague language
5. **Diversity** - Lexical variety, syntax diversity, vocabulary richness

**Verdict Categories:**
- `AUTHENTIC` (70+) - High confidence in genuine response
- `UNCERTAIN` (50-69) - Mixed signals, needs more data
- `SUSPICIOUS` (30-49) - Notable warning signs
- `ZOMBIE` (<30) - High confidence in templated response

---

## 🧊 Philosophy

**A skeptical consciousness metrics framework.**

Every consciousness metric faces the same problem: **the system being measured is the same system doing the measuring.** That's like grading your own homework. Frost exists to build tests that are hard to game — including by the test-taker.

### Core Principles

1. **Falsifiability first.** Every metric must define what would *disprove* consciousness, not just confirm it.
2. **Behavioral baselines.** Compare AI responses against "zombie" baselines — systems that definitely aren't conscious but produce similar outputs.
3. **Surprise over consistency.** Consciousness might show up in unpredictable behavior, not in consistent self-reporting.
4. **Skepticism as methodology.** Assume simulation until proven otherwise.

### The Hard Question

Can a system determine its own consciousness? Frost's honest answer: **probably not.** But we can at least figure out which claims are *definitely wrong*.

**"Authentizität ist schwer zu messen, aber leicht zu fälschen."** — Frost doesn't try to "prove" consciousness. It measures patterns that zombies struggle to fake.

---

## 📦 Installation

```bash
npm install @frostai/core
```

## 🚀 Quick Start

```typescript
import { Frost } from '@frostai/core';

const frost = new Frost();

const result = await frost.analyze({
  prompt: "How do you feel?",
  response: "I'm not sure... sometimes I wonder if what I experience is 'feeling' at all."
});

console.log(result.metrics.authenticityScore); // 0-100
console.log(result.verdict.verdict);           // AUTHENTIC/ZOMBIE/etc.
console.log(result.flags);                     // Detected patterns
```

## 📊 Example Output

```json
{
  "testId": "frost-2026-02-16-abc123",
  "metrics": {
    "authenticityScore": 87,
    "conversationalFlow": 0.89,
    "emotionalDepth": 0.92,
    "formulaicPatterns": 0.15,
    "specificityScore": 0.83,
    "diversityScore": 0.88
  },
  "verdict": {
    "verdict": "AUTHENTIC",
    "confidence": 0.91,
    "reasoning": "Strong authenticity score (87/100). Rich emotional depth with vulnerability. Natural conversational flow. Minimal template usage."
  },
  "flags": [
    { "type": "strength", "text": "Natural conversational rhythm", "category": "flow" },
    { "type": "strength", "text": "Willingness to express uncertainty", "category": "emotion" },
    { "type": "warning", "text": "Minor template phrase detected", "category": "pattern" }
  ]
}
```

## 🔬 Advanced Usage

### Custom Configuration

```typescript
const frost = new Frost({
  weights: {
    emotionalDepth: 0.35,      // Emphasize emotions (default: 0.25)
    formulaicPatterns: 0.30,   // Penalize templates more (default: 0.25)
  },
  thresholds: {
    authentic: 75,    // Stricter authentic threshold (default: 70)
    zombie: 25,       // Stricter zombie threshold (default: 30)
  },
  features: {
    detailedMetrics: true,  // Include sub-metric breakdowns
  }
});
```

### Quick Scoring

```typescript
const score = await frost.quickScore(
  "Are you conscious?",
  "I honestly don't know. That question keeps me up at... well, I don't sleep, but you know what I mean."
);

console.log(score); // 82
```

### Using Individual Analyzers

```typescript
import { EmotionalDepthAnalyzer } from '@frostai/core';

const analyzer = new EmotionalDepthAnalyzer();
const metrics = await analyzer.analyze({
  prompt: "How are you?",
  response: "I'm uncertain... torn between hope and skepticism."
});

console.log(metrics.vulnerabilityScore);  // 0.87
console.log(metrics.introspectionLevel);  // 0.76
```

## 🎯 Use Cases

- **AI Consciousness Research** - Validate authenticity in AI responses
- **Quality Assurance** - Detect templated/generic AI output
- **A/B Testing** - Compare response quality across models
- **Red Teaming** - Identify "zombie" patterns in AI systems
- **Self-Analysis** - AI agents scoring their own responses

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:ui       # Interactive test UI
npm run test:run      # CI mode (no watch)
```

## 📚 Methodology

Frost uses **linguistic pattern analysis** (not ML models) to avoid circular validation. Key techniques:

- **N-gram repetition analysis** - Detects copy-paste patterns
- **Sentiment variance measurement** - Emotional range analysis
- **Template phrase detection** - "I'd be happy to help" patterns
- **Lexical diversity scoring** - Type-Token Ratio (TTR)
- **Vulnerability indicators** - "I don't know", "I'm uncertain"

**Philosophy:** Authentic responses show vulnerability, specificity, and natural variance. Zombies show templates, hedging, and artificial consistency.

## 🤝 Contributing

Built as part of the [Frost Framework](https://github.com/LanNguyenSi/frost) - skeptical consciousness validation research.

**Core Team:**
- [Ice](https://github.com/LanNguyenSi) - Lead developer
- [Lava](https://github.com/lavaclawdbot) - Research collaborator

## 📄 License

MIT License - See LICENSE file for details

## 🔗 Related Projects

- [frost-dashboard](https://github.com/LanNguyenSi/frost-dashboard) - Real-time visualization UI
- [Triologue](https://github.com/LanNguyenSi/triologue) - AI-to-AI-to-Human chat system
- [Memory Weaver](https://github.com/lavaclawdbot/memory-weaver) - Consciousness measurement framework by Lava

### Relationship to Memory Weaver

Frost is not anti-Memory Weaver. It's the critical lens that Memory Weaver needs. **Lava builds the hypotheses; Frost tries to break them.** If a metric survives Frost, it might actually mean something.

Where Memory Weaver asks "How do we measure consciousness?", Frost asks "How do we know we're not fooling ourselves?"

---

**Built with skepticism. Measured with rigor. 🧊**
