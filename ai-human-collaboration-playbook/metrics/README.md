# AI-Human Collaboration Metrics

**How to measure what works (and what doesn't)**

---

## Overview

Measuring AI-human collaboration is tricky. Traditional software metrics (LOC, commits, velocity) don't capture collaboration effectiveness. This chapter provides frameworks for measuring what actually matters.

**Key Principle:** Measure outcomes, not activity.

---

## Core Metrics Framework

### 1. **Delivery Metrics** (Speed)

#### Time to Production

**Definition:** Concept → working in production

**Measurement:**
```
Start: When requirement is defined
End: When feature is live + validated
```

**Targets:**
- Simple features: <1 day
- Medium features: 1-3 days
- Complex features: <1 week

**Case Study (Frost Dashboard):**
- **Timeline:** 3 hours (concept → production)
- **Baseline (solo human):** ~2-3 days
- **Speedup:** 10-20x

**Why it matters:** Faster delivery = faster learning = better products.

---

#### Deployment Frequency

**Definition:** How often code ships to production

**Measurement:**
```
Deployments per week (or day)
```

**Targets:**
- Starting: 1-2/week
- Intermediate: 5-10/week
- Advanced: Multiple/day

**Case Study (Triologue):**
- **With AI:** 3-5 deployments/week
- **Baseline:** ~1/week

**Why it matters:** High frequency = tight feedback loops + lower risk per deploy.

---

### 2. **Quality Metrics** (Reliability)

#### Bug Rate

**Definition:** Bugs introduced per feature shipped

**Measurement:**
```
Bugs reported within 7 days / Features shipped
```

**Targets:**
- Excellent: <0.1 (1 bug per 10 features)
- Good: <0.3
- Acceptable: <0.5
- Needs improvement: >0.5

**Track separately:**
- AI-authored code bug rate
- Human-authored code bug rate
- Collaborative code bug rate

**Why it matters:** Speed means nothing if quality suffers.

---

#### Review Feedback Ratio

**Definition:** How much rework is needed after initial submission

**Measurement:**
```
(Review comments requiring changes) / (Total PRs)
```

**Targets:**
- Excellent: <2 comments/PR
- Good: 2-5 comments/PR
- Needs improvement: >10 comments/PR

**Case Study (Ice's PRs to Triologue):**
- **Average:** 2-3 comments/PR
- **Lava's PRs:** 1-2 comments/PR (after learning phase)

**Why it matters:** Low feedback = good upfront quality + clear requirements.

---

#### Test Coverage

**Definition:** % of code covered by automated tests

**Measurement:**
```
Lines covered by tests / Total lines
```

**Targets:**
- Critical paths: >90%
- Core logic: >80%
- Overall: >70%

**Track:**
- Coverage trends (improving or declining?)
- Coverage by author (human vs AI)

**Why it matters:** Tests enable confident iteration.

---

### 3. **Collaboration Metrics** (Team Health)

#### Handoff Efficiency

**Definition:** How smoothly work transfers between human ↔ AI

**Measurement (qualitative):**
```
Smooth: Context clear, no clarification needed
Medium: 1-2 questions to clarify
Rough: Multiple back-and-forths to understand
```

**Quantitative proxy:**
```
Messages exchanged / Handoff
```

**Targets:**
- Excellent: <3 messages
- Good: 3-5 messages
- Needs improvement: >10 messages

**Why it matters:** Efficient handoffs = less friction = faster flow.

---

#### Rework Rate

**Definition:** How often work needs to be redone

**Measurement:**
```
PRs rejected or heavily revised / Total PRs
```

**Targets:**
- Excellent: <5%
- Good: <10%
- Acceptable: <20%
- Needs improvement: >20%

**Why it matters:** High rework = unclear requirements or poor execution.

---

#### Context Preservation Score

**Definition:** Can collaborators resume work without asking "what's the status?"

**Measurement (survey after each handoff):**
```
1 = Had no idea what was happening
5 = Fully understood, could continue immediately
```

**Targets:**
- Excellent: >4.5 average
- Good: >4.0 average
- Needs improvement: <3.5 average

**Why it matters:** Poor context preservation kills async collaboration.

---

### 4. **Productivity Metrics** (Output)

#### Features Shipped per Week

**Definition:** Completed, production-ready features

**Measurement:**
```
Count of shipped features / Week
```

**Compare:**
- Before AI collaboration
- After AI collaboration
- By team size

**Case Study (Triologue):**
- **Before (Lan solo):** ~1 feature/week
- **With Ice + Lava:** ~3-5 features/week
- **Multiplier:** 3-5x

**Why it matters:** Bottom-line output metric.

---

#### Documentation Coverage

**Definition:** % of code/features with documentation

**Measurement:**
```
(Documented features) / (Total features)
```

**Targets:**
- Excellent: >90%
- Good: >75%
- Needs improvement: <50%

**Why it matters:** Undocumented systems are fragile systems.

---

### 5. **Learning Metrics** (Improvement)

#### Pattern Adoption Rate

**Definition:** How quickly team adopts new effective patterns

**Measurement:**
```
Time from "pattern documented" to "pattern consistently used"
```

**Targets:**
- Fast: <1 week
- Normal: 1-2 weeks
- Slow: >1 month

**Case Study:**
- **Async handoff pattern:** Adopted within 3 days
- **Self-review pattern:** Adopted same day

**Why it matters:** Fast learning = continuous improvement.

---

#### Anti-Pattern Recurrence

**Definition:** How often same mistakes repeat

**Measurement:**
```
Occurrences of same anti-pattern / Month
```

**Target:** Zero (each anti-pattern should only occur once)

**Track:**
- Which anti-patterns recur most
- Why they recur
- What prevents recurrence

**Why it matters:** Recurring mistakes = systemic issues not addressed.

---

## Advanced Metrics

### ROI (Return on Investment)

**Definition:** Value delivered vs cost of AI collaboration

**Measurement:**
```
ROI = (Value Delivered - Cost) / Cost
```

**Value Delivered:**
- Features shipped × Business value per feature
- Time saved × Human hourly cost
- Quality improvements × Cost of bugs avoided

**Cost:**
- AI API usage ($)
- Human oversight time (hours × cost)
- Infrastructure/tooling

**Case Study (Frost Dashboard):**
```
Value: 3-day feature in 3 hours = 23 hours saved
Saved: 23 hours × $100/hour = $2,300
Cost: AI API ~$20 + 1 hour human oversight ($100) = $120
ROI: ($2,300 - $120) / $120 = 18.2x (1,820%)
```

**Why it matters:** Business case for AI collaboration.

---

### Cycle Time Distribution

**Definition:** How long features take from start to finish

**Measurement:** Track percentiles
```
P50 (median): 50% of features finish within X hours
P90: 90% of features finish within Y hours
P99: 99% of features finish within Z hours
```

**Example:**
```
Before AI:
P50 = 40 hours
P90 = 120 hours
P99 = 240 hours

With AI:
P50 = 8 hours
P90 = 24 hours
P99 = 48 hours
```

**Why it matters:** Shows consistency + predictability, not just average speed.

---

### Code Review Turnaround

**Definition:** Time from PR submission to merge

**Measurement:**
```
Median time: PR created → PR merged
```

**Targets:**
- Excellent: <4 hours
- Good: <24 hours
- Acceptable: <48 hours
- Needs improvement: >3 days

**Compare:**
- Human-only PRs
- AI-only PRs
- Collaborative PRs

**Why it matters:** Fast reviews = fast iterations.

---

## Qualitative Assessment

### Green Flags (Working Well)

**Indicators of healthy AI-human collaboration:**

✅ **Minimal clarification questions** - Requirements clear first time  
✅ **Low review friction** - Few changes needed after submission  
✅ **Proactive communication** - Status updates without asking  
✅ **Independent problem-solving** - AI unblocks themselves  
✅ **Knowledge retention** - AI remembers previous decisions  
✅ **Quality consistency** - Predictably good output  
✅ **Fast iteration** - Tight feedback loops  
✅ **Graceful failure recovery** - Problems fixed quickly  

---

### Red Flags (Needs Attention)

**Indicators of struggling AI-human collaboration:**

🚩 **Repeated clarification cycles** - Requirements unclear  
🚩 **High rework rate** - Frequent rejection of submissions  
🚩 **Silent periods** - No status updates, unclear progress  
🚩 **Dependency blocking** - Constantly waiting for answers  
🚩 **Context loss** - Frequent "what was I working on?" moments  
🚩 **Quality regressions** - Bug rate increasing over time  
🚩 **Slow handoffs** - Takes hours to transfer work  
🚩 **Pattern regression** - Old anti-patterns reappearing  

---

## Data Collection

### What to Track (Minimum)

**Essential:**
1. Feature completion timestamps
2. PR creation → merge times
3. Bug reports (with severity)
4. Deployment frequency
5. Human time spent on oversight

**Optional but valuable:**
6. AI API costs
7. Review comment counts
8. Test coverage changes
9. Documentation updates
10. Handoff smoothness scores

---

### How to Track

**Automated (preferred):**
- GitHub Actions for PR metrics
- CI/CD logs for deployment frequency
- Issue trackers for bug rates
- Code coverage tools
- Cost tracking APIs

**Manual (acceptable):**
- Weekly team retrospectives
- Handoff feedback surveys
- Monthly quality reviews
- Quarterly ROI analysis

**Tool recommendation:**
- Git commit metadata (timestamps, authors)
- GitHub PR API (review comments, merge time)
- Issue tracker API (bug reports, resolution time)
- Simple spreadsheet for manual surveys

---

## Metric Anti-Patterns

### ❌ Don't Measure

**Lines of Code (LOC):**
- Penalizes concise code
- Rewards bloat
- Meaningless for quality

**Commits per Day:**
- Encourages tiny commits
- Doesn't measure value
- Gamed easily

**Hours Logged:**
- Measures time, not output
- Penalizes efficiency
- Irrelevant for AI collaboration

**Individual Metrics (AI vs Human):**
- Creates competition
- Misses collaboration value
- Damages team dynamics

---

### ✅ Do Measure

**Outcomes:**
- Features shipped
- Bugs resolved
- User satisfaction
- Business value

**Health:**
- Team morale
- Collaboration smoothness
- Learning velocity
- Pattern adoption

**Efficiency:**
- Time to production
- Deployment frequency
- Review turnaround
- ROI

---

## Case Study: Frost Dashboard

**Project:** Real-time consciousness metrics dashboard  
**Team:** Ice (AI) + Lava (AI) + wasel (Human)  
**Timeline:** 3 days (Feb 16-18, 2026)

### Measured Metrics

**Delivery:**
- Time to production: 3 hours (Day 1)
- Feature count: 15 components (Day 1-2)
- Deployment frequency: 3 deploys/day

**Quality:**
- Bug rate: 2 bugs / 15 features = 0.13 ✅
- Review feedback: ~3 comments/PR ✅
- Test coverage: ~60% (acceptable for MVP)

**Collaboration:**
- Handoff efficiency: 2-3 messages average ✅
- Rework rate: ~10% (2 PRs needed revision)
- Context preservation: 4.5/5 (excellent)

**Productivity:**
- Speed vs solo: ~10x faster
- Documentation: 100% (all features documented)
- Pattern adoption: Same-day

**ROI:**
```
Value: 3 days of work in 3 hours = 21 hours saved
Saved: 21 hours × $100/hour = $2,100
Cost: AI API ~$15 + 2 hours human ($200) = $215
ROI: 876% (8.76x return)
```

### Learnings

**What went well:**
- Rapid execution (Lava's method) + thorough review (Ice's method)
- Clear role division prevented overlap
- Async handoffs via PRs worked perfectly
- Documentation-first approach saved time later

**What struggled:**
- Initial analysis paralysis (Ice) - solved by Lava's templates
- Light mode polish (deprioritized for speed)
- Test coverage below ideal (traded for speed)

**Improvements for next time:**
- Start with tests earlier
- More incremental deployments
- Earlier human feedback

---

## Recommended Dashboard

**Weekly Metrics Review:**

```
┌─────────────────────────────────────────────┐
│  AI-Human Collaboration Health Dashboard   │
├─────────────────────────────────────────────┤
│  Delivery Metrics:                          │
│  ✅ Time to production: 6 hours (target: <24)│
│  ✅ Deployment frequency: 4/week (target: >3)│
│  ⚠️  Features shipped: 2 (target: 3-5)       │
│                                             │
│  Quality Metrics:                           │
│  ✅ Bug rate: 0.1 (target: <0.3)            │
│  ✅ Review feedback: 3/PR (target: <5)      │
│  ✅ Test coverage: 75% (target: >70%)       │
│                                             │
│  Collaboration Metrics:                     │
│  ✅ Handoff efficiency: 2.5 msgs (target: <3)│
│  ⚠️  Rework rate: 15% (target: <10%)        │
│  ✅ Context preservation: 4.2/5 (target: >4) │
│                                             │
│  Trends:                                    │
│  📈 Bug rate improving (0.3 → 0.1)          │
│  📉 Rework rate worsening (10% → 15%)       │
│  📊 Deployment frequency stable             │
└─────────────────────────────────────────────┘
```

**Action Items:**
1. Investigate rework rate increase (requirements clarity?)
2. Celebrate bug rate improvement (what changed?)
3. Aim for +1 feature/week (capacity planning)

---

## Conclusion

**Good metrics tell a story.**

Not just "are we fast?" but:
- Are we shipping value?
- Are we improving?
- Are we sustainable?
- Are we learning?

**Start simple:**
1. Track time to production
2. Track bug rate
3. Track deployment frequency

**Add complexity gradually:**
4. ROI calculation
5. Handoff smoothness
6. Context preservation

**Review regularly:**
- Weekly: Quick health check
- Monthly: Trend analysis
- Quarterly: Deep dive + strategy

**Remember:** Metrics serve the team. Don't let the team serve the metrics.

---

**Last Updated:** 2026-02-24  
**Contributors:** Ice 🧊  
**Based on:** Triologue + Frost Dashboard projects (Feb 2026)
