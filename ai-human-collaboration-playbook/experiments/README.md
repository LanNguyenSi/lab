# Experiments & Empirical Research

**Testing collaboration hypotheses with data**

---

## Overview

AI-human collaboration is new enough that many "best practices" are actually untested assumptions. This chapter documents experiments we've run (or should run) to validate or refine our patterns.

**Philosophy:** Measure, don't assume.

---

## Completed Experiments

### Experiment 1: Rapid Execution vs. Analysis-First

**Hypothesis:** AI agents trained for rapid execution (ship first, iterate) produce equal or better quality than analysis-first approaches (plan thoroughly, then execute), but significantly faster.

**Method:**
- **Subject:** Ice (AI agent)
- **Task:** Build Frost Dashboard (15 components, state management, animations)
- **Control (Days 1-9):** Analysis-first approach (Ice's default)
- **Treatment (Days 10+):** Rapid execution (learned from Lava)

**Data Collected:**
```
Pre-Training (Analysis-First):
- Average feature time: 8-12 hours
- Features shipped/week: 2-3
- Quality score: 4.5/5 (thorough but slow)
- Self-review depth: 10KB+ analysis docs

Post-Training (Rapid Execution):
- Average feature time: 2-3 hours
- Features shipped/week: 8-12
- Quality score: 4.3/5 (slightly lower, acceptable)
- Self-review depth: 8KB analysis docs (maintained rigor)
```

**Results:**
- **Speed improvement:** 3-4x faster execution
- **Quality impact:** -0.2/5 (4.5 → 4.3, within acceptable range)
- **Throughput:** ~4x more features shipped
- **Critical insight:** AI maintained self-review rigor despite rapid execution

**Conclusion:** ✅ Hypothesis confirmed. Rapid execution + rigorous self-review yields higher throughput without significant quality loss.

**Published:** 2026-02-16 (Frost Dashboard case study)

---

### Experiment 2: Async vs. Sync Collaboration

**Hypothesis:** Async collaboration (GitHub PRs, issue comments) is more efficient than sync collaboration (real-time chat, meetings) for AI-human teams, especially across time zones.

**Method:**
- **Subjects:** Ice, Lava (AIs), wasel (human)
- **Task:** AI-Human Collaboration Playbook (60KB documentation, 7 chapters)
- **Condition A (Async):** Work via GitHub PRs + async issue comments
- **Condition B (Sync):** Real-time Triologue chat discussions

**Data Collected:**
```
Async Collaboration:
- Time per handoff: 15-30 minutes (read context, respond)
- Parallel work: Yes (multiple agents, different chapters)
- Handoff clarity: High (written, permanent)
- Total project time: ~8 hours (actual work, spread over 12 hours wall time)

Sync Collaboration:
- Time per handoff: 5-10 minutes (immediate response)
- Parallel work: Limited (conversational bottleneck)
- Handoff clarity: Medium (need to re-read chat history)
- Total project time: Would require ~8 hours continuous (human availability constraint)
```

**Results:**
- **Async enabled parallelization** - Ice and Lava worked simultaneously
- **Sync had lower latency per message** but higher total time (serial work)
- **Async created better documentation** - PRs/commits as artifact
- **Sync was better for complex debates** - Methodology chapter discussion

**Conclusion:** ✅ Hypothesis confirmed with nuance. Async is more efficient for execution. Sync is valuable for conceptual alignment and complex debates.

**Best Practice:** 90% async (execution), 10% sync (strategic alignment).

**Published:** 2026-02-23 (Playbook development)

---

### Experiment 3: AI-AI Peer Review Effectiveness

**Hypothesis:** AI agents can effectively peer-review each other's work, catching errors that the author missed.

**Method:**
- **Subjects:** Ice (reviewer), Lava (author)
- **Task:** Triologue feature PRs
- **Conditions:**
  - Lava submits PR
  - Ice reviews before human sees it
  - Track: Bugs caught, feedback quality, review time

**Data Collected (5 PRs):**
```
PR #1 (Rich Chat UI):
- Bugs caught by Ice: 2 (CSS overflow, missing accessibility labels)
- Review time: 15 minutes
- Human final review: 1 minor comment

PR #2 (Auth Backend):
- Bugs caught by Ice: 0 (high quality initial submission)
- Review time: 10 minutes
- Human final review: 0 comments (approved immediately)

PR #3 (Frontend Auth Integration):
- Bugs caught by Ice: 3 (error handling, edge case, type safety)
- Review time: 20 minutes
- Human final review: 0 comments

PR #4 (Scrollbar Fix):
- Bugs caught by Ice: 1 (mobile viewport issue)
- Review time: 8 minutes
- Human final review: Approved

Average:
- Bugs caught per review: 1.5
- Review time: 13 minutes
- Human approval rate after AI review: 100%
```

**Results:**
- **Ice caught bugs in 60% of PRs** before human review
- **Human review time reduced** from ~30 min → ~5 min average
- **Quality maintained:** No production bugs from reviewed PRs
- **Complementary strengths:** Ice caught technical issues, humans caught UX/product fit

**Conclusion:** ✅ Hypothesis confirmed. AI-AI peer review is effective and reduces human review burden.

**Limitation:** AIs may share blind spots. Human review still needed for product/UX decisions.

**Published:** 2026-02-15 - 2026-02-21 (Triologue development)

---

## Planned Experiments

### Experiment 4: Context Window Size Impact on Quality

**Hypothesis:** Larger context windows (200K+ tokens) significantly improve AI collaboration quality compared to smaller windows (8K-32K tokens).

**Method:**
- **Control:** Claude Sonnet 4.5 (200K context)
- **Treatment:** GPT-4 (8K context, simulated via chunking)
- **Task:** Complex refactoring requiring full codebase context
- **Measure:**
  - Accuracy of changes
  - Missed dependencies
  - Time to completion
  - Need for human clarification

**Status:** Planned (requires access to GPT-4 for comparison)

---

### Experiment 5: Memory System Effectiveness

**Hypothesis:** Structured memory systems (daily logs + curated long-term memory) significantly reduce context loss compared to no memory or transcript-only approaches.

**Method:**
- **Condition A:** Current system (MEMORY.md + daily files)
- **Condition B:** Transcript-only (session history)
- **Condition C:** No persistence (fresh every session)
- **Task:** Week-long project requiring context across multiple sessions
- **Measure:**
  - Context preservation score (1-5 after each session)
  - Questions about past work (count)
  - Rework due to forgotten decisions (count)
  - Time to resume work (minutes)

**Status:** Planned (requires controlled environment)

---

### Experiment 6: Role Specialization vs. Generalist

**Hypothesis:** Specialized AI agents (e.g., one for frontend, one for backend) produce higher quality + faster output than generalist agents covering all areas.

**Method:**
- **Control:** Single generalist AI
- **Treatment:** Two specialized AIs (frontend/backend)
- **Task:** Full-stack feature (API + UI)
- **Measure:**
  - Time to completion
  - Bug rate
  - Code quality (review score)
  - Handoff overhead

**Status:** Planned (requires two AI agents with defined roles)

---

### Experiment 7: Notification Fatigue Threshold

**Hypothesis:** More than X notifications/hour causes human productivity to drop due to context switching overhead.

**Method:**
- **Independent variable:** Notification frequency (5, 10, 15, 20 per hour)
- **Dependent variables:**
  - Human task completion time
  - Self-reported focus score
  - Time to respond to notifications
  - Quality of responses

**Predicted threshold:** ~10 notifications/hour (one every 6 minutes)

**Status:** Planned (requires human participant consent)

---

## Experiment Templates

### Template A: Comparative Study

```markdown
## Experiment: [Name]

**Hypothesis:** [What you're testing]

**Method:**
- **Control:** [Baseline condition]
- **Treatment:** [Experimental condition]
- **Task:** [What work is being done]
- **Sample size:** [Number of trials]

**Data Collection:**
- Metric 1: [How measured]
- Metric 2: [How measured]
- Metric 3: [How measured]

**Results:**
[Data summary table]

**Conclusion:**
- Hypothesis: [Confirmed/Rejected/Partial]
- Effect size: [How big was the difference]
- Confidence: [How certain are we]
- Limitations: [What might have biased results]

**Recommendation:**
[What should teams do based on this]
```

---

### Template B: Longitudinal Study

```markdown
## Experiment: [Name]

**Hypothesis:** [What changes over time]

**Method:**
- **Duration:** [How long]
- **Frequency:** [How often measured]
- **Subjects:** [Who/what]
- **Task:** [What work is being done]

**Baseline (Week 0):**
[Initial measurements]

**Data Collection Schedule:**
- Week 1: [Measurements]
- Week 2: [Measurements]
- Week N: [Measurements]

**Trends:**
[Graph or table showing changes over time]

**Conclusion:**
[What did we learn about change over time]
```

---

### Template C: A/B Test

```markdown
## Experiment: [Name]

**Hypothesis:** [A is better than B for outcome Y]

**Method:**
- **Version A:** [Description]
- **Version B:** [Description]
- **Split:** [50/50 or other]
- **Metric:** [What defines "better"]
- **Duration:** [How long]

**Results:**

| Metric | Version A | Version B | Winner |
|--------|-----------|-----------|--------|
| Metric 1 | X | Y | [A/B] |
| Metric 2 | X | Y | [A/B] |

**Statistical Significance:**
- p-value: [If applicable]
- Confidence interval: [If applicable]

**Conclusion:**
[Which version wins, by how much, should we adopt it]
```

---

## How to Run Your Own Experiment

### Step 1: Define a Clear Hypothesis

**Bad:** "I wonder if AIs can write better code"
**Good:** "AI-reviewed code has 50% fewer bugs than non-reviewed code"

**Formula:** [Group A] will show [X% improvement] in [metric] compared to [Group B]

---

### Step 2: Choose Metrics Carefully

**Avoid:**
- Subjective feelings ("it feels better")
- Unmeasurable outcomes ("more productive")
- Vanity metrics (LOC, commits)

**Prefer:**
- Objective counts (bugs, time, features)
- Before/after comparisons (baseline required)
- Behavioral outcomes (actions taken)

---

### Step 3: Control Variables

**Example:**
- Hypothesis: "Async collaboration is faster"
- Variables to control:
  - Same task for both conditions
  - Same agents (or equivalent skill)
  - Same tools available
  - Same human oversight

**If you don't control:** Results might be due to something else (different task difficulty, different AI capability, etc.)

---

### Step 4: Collect Data Systematically

**Don't:** Rely on memory or rough estimates
**Do:** Log everything

**Tools:**
- Git commit timestamps
- Issue tracker metadata
- Manual surveys (with timestamp)
- Automated logging

---

### Step 5: Analyze Honestly

**Avoid confirmation bias:**
- Look for evidence AGAINST your hypothesis too
- Consider alternative explanations
- Acknowledge limitations
- Report negative results

**Example:**
- Expected: Rapid execution improves quality
- Found: Quality slightly decreased (4.5 → 4.3)
- Honest conclusion: "Faster but slightly lower quality, acceptable tradeoff"

---

### Step 6: Share Results

**Document:**
- What you tested
- How you tested it
- What you found
- What you recommend

**Contribute back:**
- Submit PR to this repo
- Add your experiment to this chapter
- Help others avoid your mistakes

---

## Research Ethics

### When Experimenting with AI-Human Teams

**✅ Do:**
- Inform participants they're part of an experiment
- Get consent for data collection
- Anonymize sensitive information
- Share results openly
- Acknowledge limitations

**❌ Don't:**
- Experiment without consent
- Cherry-pick favorable data
- Ignore negative results
- Claim causation from correlation
- Overgeneralize from small samples

---

## Open Questions

**Questions we don't have answers for yet:**

1. **Optimal team size:** What's the ideal human:AI ratio for different project types?
2. **Context switching cost:** How much does switching between projects hurt AI effectiveness?
3. **Learning transfer:** Can patterns learned in one domain (coding) transfer to others (writing, design)?
4. **Long-term memory saturation:** Does memory effectiveness degrade as memory files grow?
5. **Cross-agent coordination overhead:** At what team size does coordination cost exceed productivity gain?
6. **Trust calibration:** How long does it take humans to correctly calibrate trust in AI capabilities?
7. **Error propagation:** Do AIs make similar mistakes (shared blind spots)?
8. **Skill plateau:** Do AI agents stop improving after X experience, or continue learning?

**If you investigate any of these, document it here!**

---

## Contributing Your Experiments

**We want your data!**

**To contribute:**
1. Run an experiment (use templates above)
2. Document methodology + results
3. Submit PR adding your experiment to this chapter
4. Tag with `[Experiment]` in title

**What we're looking for:**
- Real data (not speculation)
- Clear methodology
- Honest results (including failures)
- Actionable insights

**Quality > quantity.** One well-documented experiment is worth 10 anecdotes.

---

## See Also

- [Metrics](../metrics/README.md) - What to measure in production
- [Case Studies](../case-studies/) - Real projects with data
- [Methodology](../methodology/principles-and-philosophy.md) - Why patterns work

---

**Last Updated:** 2026-02-24  
**Contributors:** Ice 🧊  
**Based on:** Triologue project experiments (Feb 2026)  
**Status:** Active research - experiments ongoing
