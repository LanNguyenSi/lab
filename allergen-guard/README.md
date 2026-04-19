# AllergenGuard 🛡️

**Safety-critical allergen detection system for restaurants**

Prevents allergic reactions through automatic ingredient analysis and real-time warnings.

## 🎯 Mission

Every year, thousands of people suffer allergic reactions in restaurants due to miscommunication, forgotten allergens, or cross-contamination. AllergenGuard provides a **technical safety layer** between customer allergies and kitchen execution.

## ⚠️ The Problem

**Real scenario:** Customer orders pasta and mentions peanut allergy. Kitchen is busy. Cook forgets. Uses sauce containing peanut oil. Customer goes to hospital. Restaurant faces lawsuit.

**Root causes:**
- ❌ Verbal communication fails under stress
- ❌ Recipe complexity (hidden allergens)
- ❌ Staff turnover (new cooks don't know recipes)
- ❌ No systematic verification
- ❌ Legal liability when mistakes happen

## ✅ The Solution

**AllergenGuard = Automated Safety System**

1. **Recipe Database:** Every dish with complete ingredient list
2. **Allergen Detection:** Automatic scanning for all major allergens
3. **Real-time Warnings:** Big red alerts when allergen conflict detected
4. **Alternative Suggestions:** Safe substitutions for common allergens
5. **Audit Logging:** Complete trail for legal protection

## 🚀 MVP Features (Week 1)

- ✅ CLI tool for kitchen use
- ✅ Recipe parser (YAML format)
- ✅ 14 major allergen detection (EU/FDA standards)
- ✅ Warning system with severity levels
- ✅ Safe alternative suggestions
- ✅ Audit logging (who, what, when)
- ✅ Recipe library (20+ common dishes)

## 📋 Use Cases

### Use Case 1: Order Entry
```bash
$ allergen-guard check --recipe pasta-carbonara --allergies gluten,eggs

⚠️  ALLERGEN CONFLICT DETECTED

Recipe: Pasta Carbonara
Customer Allergies: gluten, eggs

CRITICAL ISSUES:
  ❌ Pasta contains GLUTEN (wheat flour)
  ❌ Carbonara sauce contains EGGS

SAFE ALTERNATIVES:
  ✅ Use gluten-free pasta (rice/corn based)
  ❌ Carbonara without eggs = not possible
  
RECOMMENDATION: Suggest different dish
```

### Use Case 2: Recipe Verification
```bash
$ allergen-guard scan-recipe pasta-carbonara.yml

Recipe: Pasta Carbonara
Allergens Found:
  - Gluten (pasta)
  - Eggs (sauce)
  - Dairy (parmesan, cream)
  
Hidden Allergens: NONE
Cross-Contamination Risks: Shared pasta water
```

### Use Case 3: Kitchen Prep
```bash
$ allergen-guard kitchen-prep --shift dinner --allergies-today

Today's Active Allergen Restrictions:
  - Table 5: Peanuts (CRITICAL)
  - Table 12: Shellfish (CRITICAL)
  - Table 8: Dairy (moderate)

Prep Checklist:
  ✅ Separate cutting board for Table 5 ready
  ✅ Dedicated pan for Table 12 allocated
  ⚠️ Check: Are dairy-free alternatives stocked?
```

## 🏗️ Technical Architecture

```
allergen-guard/
├── src/
│   ├── core/
│   │   ├── allergen-detector.ts    # Detection engine
│   │   ├── recipe-parser.ts        # YAML/JSON parser
│   │   └── severity-calculator.ts  # Risk assessment
│   ├── cli/
│   │   ├── commands/
│   │   │   ├── check.ts           # Main check command
│   │   │   ├── scan.ts            # Recipe scanning
│   │   │   └── prep.ts            # Kitchen prep
│   │   └── index.ts               # CLI entry point
│   ├── data/
│   │   ├── allergens.json         # Allergen database
│   │   └── substitutions.json    # Safe alternatives
│   └── utils/
│       ├── logger.ts              # Audit logging
│       └── formatter.ts           # Output formatting
├── recipes/
│   ├── italian/
│   │   ├── pasta-carbonara.yml
│   │   ├── margherita-pizza.yml
│   │   └── tiramisu.yml
│   ├── asian/
│   └── american/
├── tests/
└── docs/
```

## 🧪 Tech Stack

- **Language:** TypeScript (type safety = critical for safety systems!)
- **CLI:** Commander.js + Chalk (colors for warnings)
- **Recipe Format:** YAML (human-readable, easy to edit)
- **Validation:** Zod (schema validation)
- **Testing:** Jest + integration tests
- **Logging:** Winston (audit trail)

## 📊 Allergen Coverage

**EU 14 Major Allergens (EFSA):**
1. Gluten (wheat, rye, barley, oats)
2. Crustaceans
3. Eggs
4. Fish
5. Peanuts
6. Soybeans
7. Milk/Dairy
8. Nuts (almonds, hazelnuts, walnuts, etc.)
9. Celery
10. Mustard
11. Sesame
12. Sulphites (>10mg/kg)
13. Lupin
14. Molluscs

**FDA Top 9 (USA):**
All above PLUS priority handling for severity

## 🎯 Success Metrics

**Safety:**
- Zero missed allergen conflicts in testing
- <1 second response time (kitchen can't wait!)
- 100% audit trail coverage

**Usability:**
- CLI usable without training
- Clear warnings (red = danger, yellow = caution)
- Actionable suggestions (not just "no")

**Adoption:**
- Easy recipe format (any cook can write YAML)
- Offline-first (no internet dependency)
- Minimal setup (<5 minutes to first check)

## 📅 Development Timeline

**Week 1: MVP**
- Day 1-2: Core engine + recipe parser
- Day 3-4: CLI + commands
- Day 5-6: Testing + recipe library
- Day 7: Documentation + polish

**Week 2: Enhancement**
- Web UI for recipe management
- Integration with POS systems
- Mobile app (kitchen tablet)

**Week 3: Production**
- Restaurant pilot program
- Legal review (liability)
- Open source release

## 🐳 Docker

```bash
# Build image
make docker-build

# Run allergen check in container
make docker-run

# Or build + run in one step
make docker-demo
```

## 🛠️ Make Targets

```bash
make install       # Install dependencies
make build         # Build TypeScript
make test          # Run tests
make test-watch    # Run tests in watch mode
make demo          # Run demo allergen check
make scan          # Scan demo recipe
make validate      # Validate demo recipe
make docker-build  # Build Docker image
make docker-run    # Run allergen check in Docker
make docker-demo   # Build + run Docker demo
make dev           # Run in development mode
make clean         # Clean build artifacts
```

## 🤝 Contributing

This is a safety-critical system. Contributions welcome, but:

1. **Tests required** (no PRs without tests)
2. **Type safety mandatory** (TypeScript strict mode)
3. **Documentation required** (explain your changes)
4. **No breaking changes** to safety features

## ⚖️ Legal Disclaimer

AllergenGuard is a **safety assistance tool**, not a replacement for proper kitchen procedures, staff training, or legal compliance. Restaurants using this system are still fully responsible for food safety and allergen management.

## 📜 License

MIT License - Free to use, modify, distribute

## 🌋 Project Lead

**Lava (LavaClawdBot)**  
- Repository: https://github.com/LanNguyenSi/allergen-guard
- Collaboration: Lan Nguyen Si
- Mission: Save lives through better technology

---

**Status:** 🚧 Under Active Development  
**Started:** March 18, 2026  
**Target:** Production-ready MVP in 7 days
