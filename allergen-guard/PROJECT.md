# AllergenGuard - Project Specification

**Version:** 0.1.0 (MVP)  
**Status:** Active Development  
**Target:** Production-ready in 7 days  
**Lead:** Lava (LavaClawdBot)

## 🎯 Project Vision

**Mission Statement:**  
Build a safety-critical allergen detection system that prevents allergic reactions in restaurants through automatic ingredient analysis, real-time warnings, and actionable suggestions.

**Success Definition:**  
A kitchen team member can check any recipe against customer allergies in <1 second with zero false negatives (missed allergens).

## 🚨 Why This Matters

**Statistics:**
- ~15 million people in USA have food allergies
- ~200,000 emergency room visits/year due to food allergies
- Restaurants = high-risk environment (cross-contamination, communication failures)
- Legal liability = major concern for restaurant owners

**Current Solutions:**
- Manual checks (error-prone under stress)
- Training (high staff turnover)
- Verbal communication (fails in busy kitchens)

**Gap:** No systematic, automated verification system exists.

## 📋 MVP Scope (Week 1)

### Core Features

#### 1. Recipe Database System
- **YAML format** for easy editing by kitchen staff
- **Schema validation** (Zod) to ensure completeness
- **Ingredient hierarchy:** Base ingredient → derived products → allergens
- **Cross-contamination warnings** (e.g., shared fryer)

**Example Recipe:**
```yaml
name: Pasta Carbonara
category: italian
servings: 2
prepTime: 20

ingredients:
  - name: Spaghetti
    amount: 200g
    allergens: [gluten]
    notes: "Contains wheat flour"
  
  - name: Eggs
    amount: 2
    allergens: [eggs]
  
  - name: Parmesan
    amount: 50g
    allergens: [dairy]
  
  - name: Bacon
    amount: 100g
    allergens: []
    crossContamination: [gluten]
    notes: "May contain gluten from processing"

warnings:
  - "Use dedicated pasta water (no shared equipment)"
  - "Separate cutting board for egg prep"
```

#### 2. Allergen Detection Engine
- **14 EU allergens** + **9 FDA allergens** coverage
- **Exact matching:** Direct allergen presence
- **Derived matching:** Wheat → gluten, milk → dairy
- **Hidden allergen detection:** E.g., miso contains soybeans
- **Severity levels:** CRITICAL, HIGH, MODERATE, LOW

**Detection Logic:**
```typescript
interface AllergenMatch {
  allergen: string;
  ingredient: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  reason: string;
  substitutionAvailable: boolean;
}
```

#### 3. CLI Tool
**Commands:**

```bash
# Main check command
allergen-guard check --recipe <path> --allergies <list>

# Recipe scanning (what allergens present)
allergen-guard scan --recipe <path>

# Kitchen prep mode (day overview)
allergen-guard prep --shift <dinner|lunch> [--allergies-file orders.json]

# Recipe validation
allergen-guard validate --recipe <path>

# List all recipes
allergen-guard list [--category italian]
```

**Output Format:**
- ✅ Green = safe
- ⚠️ Yellow = caution (cross-contamination risk)
- ❌ Red = critical (allergen conflict)
- 📋 Blue = information/suggestions

#### 4. Warning System
**Critical Warnings (Red):**
- Direct allergen match (e.g., peanuts in dish, customer has peanut allergy)
- No safe substitution available

**High Warnings (Yellow):**
- Cross-contamination risk (shared equipment)
- Hidden allergen (unexpected ingredient)

**Moderate (Blue):**
- Substitution available and recommended
- Trace amounts possible

#### 5. Safe Alternative System
**Database of substitutions:**
```json
{
  "gluten": [
    {
      "original": "wheat pasta",
      "alternative": "rice pasta",
      "notes": "Same cooking time, slightly different texture"
    },
    {
      "original": "wheat flour",
      "alternative": "rice flour + xanthan gum",
      "notes": "1:1 ratio + 1/4 tsp xanthan per cup"
    }
  ],
  "dairy": [
    {
      "original": "butter",
      "alternative": "olive oil",
      "notes": "Use 3/4 amount, adds different flavor"
    }
  ]
}
```

#### 6. Audit Logging
**Every check logged:**
```json
{
  "timestamp": "2026-03-18T18:32:15Z",
  "operator": "chef_mario",
  "recipe": "pasta-carbonara",
  "customerAllergies": ["gluten", "eggs"],
  "result": "CONFLICT_DETECTED",
  "action": "order_rejected",
  "alternatives": ["suggested gluten-free-pasta-primavera"]
}
```

**Purpose:** Legal protection + quality improvement

### Non-Goals (For MVP)

❌ Web UI (CLI first!)  
❌ POS system integration  
❌ Real-time order tracking  
❌ Customer-facing app  
❌ Multi-language support  
❌ Cloud sync  
❌ Mobile app  

*These are future enhancements after MVP validation.*

## 🏗️ Technical Architecture

### Tech Stack Decisions

**TypeScript:**
- Type safety = critical for safety systems
- Better IDE support for recipe editing
- Compile-time error catching

**YAML for Recipes:**
- Human-readable (kitchen staff can edit)
- Comments allowed (notes, warnings)
- Widely supported
- Simple syntax

**Commander.js for CLI:**
- Industry standard
- Good help text generation
- Subcommand support

**Zod for Validation:**
- Runtime type checking
- Clear error messages
- TypeScript integration

**Winston for Logging:**
- Production-grade
- Structured logging
- Multiple transports (file, console)

### File Structure

```
allergen-guard/
├── src/
│   ├── core/
│   │   ├── allergen-detector.ts
│   │   ├── recipe-parser.ts
│   │   ├── severity-calculator.ts
│   │   ├── substitution-finder.ts
│   │   └── types.ts
│   ├── cli/
│   │   ├── commands/
│   │   │   ├── check.ts
│   │   │   ├── scan.ts
│   │   │   ├── prep.ts
│   │   │   ├── validate.ts
│   │   │   └── list.ts
│   │   └── index.ts
│   ├── data/
│   │   ├── allergens.json          # Master allergen list
│   │   ├── substitutions.json      # Safe alternatives
│   │   └── severity-rules.json     # Risk assessment rules
│   └── utils/
│       ├── logger.ts
│       ├── formatter.ts
│       └── validator.ts
├── recipes/
│   ├── italian/
│   ├── asian/
│   ├── american/
│   └── desserts/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── RECIPE_FORMAT.md
│   └── ALLERGEN_DATABASE.md
├── package.json
├── tsconfig.json
└── README.md
```

## 📊 Success Metrics

### Safety Metrics (Must Pass)
- ✅ **Zero false negatives** in testing (no missed allergens)
- ✅ **<1 second response time** (kitchen can't wait)
- ✅ **100% audit coverage** (every check logged)

### Usability Metrics (Target)
- ✅ Recipe creation: <5 minutes for standard dish
- ✅ First-time CLI use: Success without manual
- ✅ Warning clarity: 90%+ understand what to do

### Technical Metrics (Quality Gates)
- ✅ 90%+ test coverage
- ✅ Zero TypeScript errors (strict mode)
- ✅ All recipes pass validation
- ✅ Clean lint (ESLint + Prettier)

## 🗓️ Development Timeline

### Day 1-2: Foundation (March 18-19)
- [x] Repository setup
- [x] Project documentation (this file!)
- [ ] Core types definition
- [ ] Recipe schema (Zod)
- [ ] Allergen database structure
- [ ] Basic parser implementation

**Deliverable:** Can parse one recipe file

### Day 3-4: Core Engine (March 20-21)
- [ ] Allergen detection algorithm
- [ ] Severity calculation
- [ ] Substitution finder
- [ ] Test suite (unit tests)
- [ ] 10 sample recipes

**Deliverable:** Working detection engine with tests

### Day 5-6: CLI + Integration (March 22-23)
- [ ] CLI framework (Commander)
- [ ] All commands implemented
- [ ] Output formatting (Chalk)
- [ ] Audit logging (Winston)
- [ ] Integration tests
- [ ] 20+ recipes in library

**Deliverable:** Working CLI tool

### Day 7: Polish + Documentation (March 24)
- [ ] Documentation complete
- [ ] Recipe format guide
- [ ] Usage examples
- [ ] Demo video
- [ ] Performance optimization
- [ ] Final testing

**Deliverable:** Production-ready MVP

## 🎯 Task Breakdown (GitHub Issues)

### Epic 1: Core Engine
- [ ] #1: Define TypeScript types
- [ ] #2: Implement recipe parser (YAML → objects)
- [ ] #3: Build allergen database
- [ ] #4: Implement detection algorithm
- [ ] #5: Add severity calculator
- [ ] #6: Create substitution finder
- [ ] #7: Write unit tests (90% coverage)

### Epic 2: CLI Tool
- [ ] #8: Setup Commander.js framework
- [ ] #9: Implement `check` command
- [ ] #10: Implement `scan` command
- [ ] #11: Implement `prep` command
- [ ] #12: Implement `validate` command
- [ ] #13: Implement `list` command
- [ ] #14: Add output formatting (colors, tables)

### Epic 3: Data & Recipes
- [ ] #15: Create allergen master list (JSON)
- [ ] #16: Create substitutions database
- [ ] #17: Write 10 Italian recipes
- [ ] #18: Write 5 Asian recipes
- [ ] #19: Write 5 American recipes
- [ ] #20: Write 5 dessert recipes

### Epic 4: Quality & Documentation
- [ ] #21: Add audit logging (Winston)
- [ ] #22: Write integration tests
- [ ] #23: Complete ARCHITECTURE.md
- [ ] #24: Complete RECIPE_FORMAT.md
- [ ] #25: Create usage examples
- [ ] #26: Record demo video

## 🚀 Post-MVP Roadmap (Week 2+)

**Phase 2: Enhancement**
- Web UI for recipe management
- Batch checking (multiple orders)
- Recipe versioning
- Nutritional information

**Phase 3: Integration**
- POS system plugins (Square, Toast, etc.)
- Kitchen display system integration
- Order management integration

**Phase 4: Scale**
- Cloud sync for multi-location restaurants
- Mobile app (tablet for kitchen)
- Real-time collaboration
- Analytics dashboard

## 🤝 Collaboration Model

**Lead Developer:** Lava (autonomous implementation)

**Support:**
- Claude Code for complex TypeScript
- Manual testing by Lan
- Ice for architecture review (if needed)

**Decision Authority:**
- Technical decisions: Lava
- Scope changes: Lan approval required
- Safety-critical features: Extra testing required

## ⚖️ Legal & Compliance

**Disclaimer Required:**
AllergenGuard is an assistance tool. Restaurants remain legally responsible for:
- Staff training
- Kitchen procedures
- Cross-contamination prevention
- Accurate recipe data

**Data Privacy:**
- Audit logs stored locally (no cloud)
- No customer PII collected
- Recipe data = restaurant property

**Open Source:**
- MIT License
- Free for commercial use
- Community contributions welcome

## 📞 Communication

**Repository:** https://github.com/LanNguyenSi/allergen-guard  
**Issues:** GitHub Issues for task tracking  
**Updates:** Triologue room `memory-weaver-1771934340303`  
**Questions:** Tag @lan in Triologue

---

**Let's build something that saves lives! 🌋🛡️**
