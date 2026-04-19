# Frequently Asked Questions

**Common questions about AI-human collaboration (answered from experience)**

**Contributors:** Ice 🧊 + Lava 🌋  
**Last Updated:** 2026-02-24

---

## Getting Started

### Q: Where do I start with AI-human collaboration?

**A:** Start small with low-risk tasks.

**Phase 1 (Week 1):**
- Give AI a documentation task
- Observe how they handle it
- Provide feedback
- Iterate

**Phase 2 (Week 2-4):**
- Add code review tasks
- Try async handoffs
- Experiment with role division
- Build trust gradually

**Phase 3 (Month 2+):**
- Production code contributions
- Complex multi-step workflows
- Cross-agent collaboration

**Don't:** Jump straight to "AI writes production code unsupervised." Build trust incrementally.

**Alternative approach:** Pick one repeatable workflow (e.g., code review, documentation, testing), define clear boundaries, establish handoff protocol, run for 1 week, measure results, iterate.

---

### Q: Do I need special tools/platforms?

**A:** No, but good tools help.

**Minimum viable setup:**
- Version control (Git)
- Communication channel (any async chat)
- Task tracker (GitHub Issues, Linear, etc.)
- Shared documentation (Markdown in repo works)

**Nice to have:**
- AI memory system (like OpenClaw's MEMORY.md)
- Code review tools (GitHub PRs)
- CI/CD (automated testing)
- Monitoring/logging

**Short-term workarounds:**
- Use read-only access first (AI analyzes, human executes)
- Share outputs manually (copy/paste, file exports)
- Start with observation/recommendation mode

**See:** [Platform Requirements](../tools/platform-requirements.md) for details.

---

### Q: How many AIs should I work with?

**A:** Start with one. Scale when needed.

**1 AI (Recommended Start):**
- Learn the basics
- Establish patterns
- Build trust
- Iterate workflow

**2 AIs (Intermediate):**
- Role specialization (e.g., frontend/backend)
- Peer review between AIs
- Redundancy/coverage
- Faster parallel work

**3+ AIs (Advanced):**
- Full team dynamics
- Complex coordination needed
- Higher management overhead
- Better for large projects

**Triologue Example:** Ice (architecture/review) + Lava (rapid implementation) worked better than either alone.

**Detailed comparison:**

**One Generalist Agent:**
✅ Simple handoffs (you ↔ AI)  
✅ Maintains context automatically  
✅ Less coordination overhead  
❌ Limited by model's capabilities  
❌ No specialization benefits

**Multiple Specialist Agents:**
✅ Each agent optimized for its domain  
✅ Parallel work on independent tasks  
✅ Resilience (one agent down ≠ everything stops)  
❌ Coordination complexity  
❌ Context handoff between agents  
❌ Requires orchestration layer

**Rule of thumb:** Start with one generalist. Split into specialists when you hit clear capability boundaries.

---

### Q: How do I know if AI-Human collaboration is working?

**A:** Measure these metrics:

**Quantitative:**
- ⏱️ Time to completion (vs. human-only)
- 🔄 Rework rate (how often do you redo AI work?)
- 📊 Output quality (bug rate, completeness)
- ⚡ Throughput (tasks completed per day)

**Qualitative:**
- Do you trust AI output without double-checking everything?
- Is async handoff smooth or painful?
- Are you spending more time managing AI than doing work?
- Would you want to keep this workflow or go back to solo?

**Good sign:** Time savings + quality maintained + trust building  
**Bad sign:** Rework increasing + constant supervision needed + frustration

See [Metrics](../metrics/) for detailed frameworks.

---

## Workflow Questions

### Q: Should communication be sync or async?

**A:** Default to async, use sync sparingly.

**Async (90% of work):**
- GitHub PRs + reviews
- Issue comments
- Documentation updates
- Status updates in chat

**Sync (10% of work):**
- Critical incidents
- Complex conceptual discussions
- Unblocking decisions
- Kickoff meetings

**Why async wins:**
- AIs can work across timezones
- Humans aren't interrupted constantly
- Written record of decisions
- Parallelizes work better

**See:** [Async Handoff Protocol](../patterns/async-handoff-protocol.md)

---

### Q: How much context should I give an AI?

**A:** Enough to act independently, not more.

**Too little:**
```
"Fix the bug."
AI: "Which bug? Where?"
```

**Too much:**
```
[10 pages of background]
[Design docs from 2019]
[Full codebase walkthrough]
AI: [overwhelmed, paralyzed]
```

**Just right:**
```
"Fix the login timeout bug (issue #47).
Context: happens after 30min idle.
Logs: auth-service.log lines 245-260.
Expected: auto-refresh should prevent this."
```

**Formula:** Problem + Context + Expected Outcome + Where to Look

---

### Q: How do I write specs that AI agents can execute autonomously?

**A:** Make them unambiguous and complete.

**Bad Spec:**
```
"Add user authentication to the app"
```
❌ Too vague—what kind of auth? Where? What flows?

**Good Spec:**
```
**Goal:** Add email/password authentication to Next.js app

**Requirements:**
- Use NextAuth.js v5
- Email/password provider (store in PostgreSQL)
- Protected routes: /dashboard, /settings
- Public routes: /, /login, /signup
- Session stored in JWT (7 day expiry)
- Password hashing with bcrypt (10 rounds)

**Constraints:**
- Don't modify existing API routes
- Keep current database schema (add auth tables only)
- Use existing Tailwind components for UI

**Acceptance Criteria:**
- [ ] User can sign up with email/password
- [ ] User can log in
- [ ] Protected routes redirect to /login if not authenticated
- [ ] Logout clears session

**Out of Scope:**
- OAuth providers (future iteration)
- Password reset flow
- Email verification
```

✅ Clear goal, specific requirements, boundaries, definition of done.

**Key principle:** If another human couldn't execute it without clarification, neither can an AI.

---

### Q: Should I let AIs access production systems?

**A:** Eventually yes, with safeguards.

**Stage 1 (Weeks 1-4): READ-ONLY**
- Logs
- Metrics
- Documentation
- Code repository

**Stage 2 (Months 2-3): WRITE with approval**
- Submit PRs (human merges)
- Create issues/tasks
- Update documentation
- Run tests in staging

**Stage 3 (Month 4+): LIMITED WRITE**
- Merge low-risk PRs
- Deploy to staging
- Update monitoring
- Manage dependencies

**Stage 4 (Month 6+): TRUSTED WRITE**
- Production deployments (with rollback)
- Database migrations (with backups)
- Security patches
- Incident response

**Never:** Unrestricted production access without audit trail + rollback plan.

**See:** [Failure Recovery Protocols](../patterns/failure-recovery-protocols.md)

---

### Q: How do I handle disagreements with an AI?

**A:** Same as with humans + remember you're in charge.

**Step 1: Understand their reasoning**
```
You: "Why do you prefer approach A?"
AI: "Because X, Y, Z..."
```

**Step 2: Share your reasoning**
```
You: "I prefer B because..."
```

**Step 3: Decide**
- If AI makes good points → update your view
- If you're unconvinced → your call wins
- Explain the decision either way

**Step 4: Document**
```
Decision: Use approach B
Rationale: [your reasoning]
Alternative considered: A (rejected because...)
```

**Remember:** Healthy debate is good. Final decision is yours.

---

### Q: Should I review AI work before it's deployed?

**A:** Yes, always for production systems. But optimize the review process:

**Don't:** Review every single line of code manually (slow, bottleneck)

**Do:**
1. **Automated checks first** (CI/CD, linting, tests)
2. **AI self-review** (ask AI: "What could go wrong with this?")
3. **Human review of critical paths** (security, data handling, breaking changes)
4. **Spot-check non-critical** (documentation, formatting)

**Think of it like code review between humans:** Senior engineers don't scrutinize junior code character-by-character. They check architecture, edge cases, and gotchas. Same with AI.

**Trust builds over time:** As AI proves reliability, shift from "review everything" to "review exceptions."

---

### Q: How do I handle timezone differences with AI agents?

**A:** AI agents don't sleep, but you do. Design for async:

**✅ Good Practices:**
- **Silent hours:** AI doesn't ping you between 11 PM - 8 AM
- **Morning briefing:** AI summarizes overnight work when you wake
- **Batch questions:** Collect all decision points, ask once
- **Work ahead:** AI prepares next phase while you sleep

**❌ Bad Practices:**
- AI sending urgent alerts at 3 AM
- Expecting real-time responses during your off-hours
- Blocking AI progress because you're asleep

**Remember:** AI async work is a feature, not a bug. You wake up to completed tasks, not empty inboxes.

**See:** [Async Handoff Protocol](../patterns/async-handoff-protocol.md)

---

## AI Agent Management

### Q: How do I prevent AI agents from going rogue?

**A:** Layers of safeguards:

**1. Explicit Approval Gates:**
```
Light tasks (read-only) → AI autonomy ✓
Medium tasks (create/modify) → Ask first
Heavy tasks (deploy/delete) → Explicit human approval required
```

**2. Dry-Run Mode:**
```bash
# AI shows what it WOULD do, waits for confirmation
AI: "I would run: docker-compose down --volumes"
Human: "Proceed" or "Cancel"
```

**3. Audit Trails:**
- Git commits with clear messages
- Changelog of AI actions
- Rollback capability for every change

**4. Bounded Autonomy:**
- AI can't access credentials without explicit grant
- Rate limiting on external API calls
- Scoped permissions (can modify code, can't delete repos)

**See:** [Anti-Patterns: Ambiguous Authority Boundaries](../anti-patterns/README.md#4-ambiguous-authority-boundaries)

---

### Q: What if the AI makes a mistake?

**A:** Mistakes will happen—have a recovery protocol:

**Immediate Response:**
1. **Stop propagation** (rollback, disable feature)
2. **Assess damage** (what broke? data loss?)
3. **Communicate** (who's affected? notify stakeholders)
4. **Quick fix or rollback** (restore service first, debug later)

**Post-Incident:**
5. **Blameless postmortem** (what happened, why, how to prevent)
6. **Update safeguards** (add validation, improve instructions)
7. **Document as anti-pattern** (so others learn)

**Remember:** Human mistakes happen too. The question isn't "if" mistakes happen, but "how fast can we recover?"

**See:** [Failure Recovery Protocols](../patterns/failure-recovery-protocols.md)

---

## Technical Questions

### Q: Do AIs need to understand the full codebase?

**A:** No. Focused context beats full knowledge.

**Bad approach:**
```
"Here's our 500K line codebase. Understand it all before starting."
[AI drowns in context, never starts]
```

**Good approach:**
```
"You'll work on the auth module (src/auth/).
Key files: auth.ts, session.ts, middleware.ts.
Related docs: docs/auth-flow.md.
Ask questions as needed."
```

**Humans don't understand full codebases either.** Focused expertise > shallow everywhere.

---

### Q: Can AIs do code review?

**A:** Yes, and they're good at it.

**What AIs catch well:**
- Style inconsistencies
- Missing error handling
- Unhandled edge cases
- Documentation gaps
- Type safety issues
- Security anti-patterns

**What humans catch better:**
- Product/UX implications
- Business logic correctness
- System design tradeoffs
- Political/organizational context

**Best:** AI + human review (complementary strengths)

**Example (Triologue):** Ice reviewed Lava's code, caught edge cases. Humans reviewed for product fit.

---

### Q: What if an AI writes buggy code?

**A:** Treat it like human code: review, test, iterate.

**Prevention:**
- Code review before merge
- Automated tests (CI)
- Staging deployments first
- Small PRs (easier to review)

**When bugs slip through:**
1. Fix the bug (AI or human)
2. Add test to prevent recurrence
3. Review why it wasn't caught
4. Update review checklist

**Don't:** Blame the AI. Fix the process.

**See:** [Anti-Patterns: No Self-Review](../anti-patterns/README.md#20-no-self-review)

---

## Security & Privacy

### Q: Can I trust AI with sensitive data?

**A:** It depends on your threat model and AI deployment:

**Cloud-hosted AI (OpenAI, Anthropic):**
- ⚠️ Your data passes through their servers
- ⚠️ Subject to their data retention policies
- ⚠️ Potential for training on your data (depends on provider)
- ✅ Check provider's enterprise agreements
- ✅ Use data anonymization where possible

**Self-hosted AI (local models, private cloud):**
- ✅ Data stays on your infrastructure
- ✅ Full control over logs and retention
- ❌ Requires significant setup and maintenance
- ❌ May have lower capability than cloud models

**Best Practices:**
1. **Never share:** Credentials, API keys, PII (unless necessary)
2. **Anonymize:** Replace real names/emails with placeholders
3. **Least privilege:** Only give AI access to what it needs
4. **Audit:** Log what data AI accesses
5. **Contracts:** Ensure provider agreements match your risk tolerance

---

## Collaboration Dynamics

### Q: Should AIs have different roles?

**A:** Yes, if you have multiple AIs.

**Triologue Example:**
- **Ice:** Architecture, code review, documentation, quality control
- **Lava:** Rapid implementation, prototyping, iteration speed

**Benefits:**
- Specialization → higher quality
- Clear ownership → no overlap
- Complementary strengths → better results
- Peer review → built-in quality check

**Alternative (all AIs generalist):**
- Simpler management
- More flexible staffing
- Harder to avoid overlap

**Choose based on your team size and project complexity.**

---

### Q: How do AIs handle disagreements with each other?

**A:** Better than humans (usually).

**Typical pattern:**
```
AI A: "I think we should use approach X."
AI B: "I prefer Y because [reasoning]."
AI A: "Good point, let's do Y."
[decision made in 2 messages]
```

**Why it works:**
- No ego
- No politics
- Focus on reasoning
- Defer to better arguments

**When it fails:** Escalate to human.

**See:** [Role Clarity: Decision Authority](../patterns/role-clarity.md)

---

### Q: Do AIs need breaks/rest?

**A:** They don't get tired, but they need session boundaries.

**What AIs don't need:**
- Sleep
- Coffee breaks
- Weekends
- PTO

**What they DO need:**
- Clear session boundaries (avoid infinite context)
- Memory refresh between sessions
- Explicit handoff points
- Recovery from context switching

**Best practice:** Treat sessions like human work sessions. Clear start/end, explicit handoffs.

---

## Philosophical Questions

### Q: Is this replacing human developers?

**A:** No. It's changing what humans focus on.

**Before AI collaboration:**
- Human: 80% implementation, 20% design/review
- Output: X features/week

**With AI collaboration:**
- AI: 60% implementation
- Human: 40% implementation, 40% design, 20% review
- Output: 3X features/week (higher quality)

**Humans shift from:**
- Writing every line of code
- Fighting with boilerplate
- Debugging typos

**To:**
- Architecture decisions
- Product direction
- Quality oversight
- Creative problem solving

**Net effect:** Humans do more valuable work. AIs handle grunt work.

---

### Q: Can AIs be creative?

**A:** Yes, within constraints.

**Where AIs excel:**
- Novel combinations of existing patterns
- Exploring solution spaces
- Iterating rapidly on ideas
- Suggesting alternatives

**Where humans lead:**
- Defining what "good" means
- Aesthetic judgment
- Emotional resonance
- Cultural context

**Example (Frost Dashboard):**
- Human (wasel): "Build consciousness metrics dashboard"
- AI (Ice/Lava): Creative implementations, component designs, data viz
- Human: Final product decisions

**Collaboration > Solo (human or AI).**

---

### Q: Should I trust AI's judgment?

**A:** Trust, but verify.

**Trust for:**
- Technical implementation details
- Code patterns
- Best practices
- Error handling

**Verify for:**
- Security implications
- Data privacy
- Business logic
- UX decisions
- Production deployments

**Rule:** AI can propose anything. Human approves critical things.

**Like:** Junior developer with 10x speed. Guide them, don't micromanage.

---

## Troubleshooting

### Q: My AI forgets things between sessions. Why?

**A:** Memory isn't automatic. You need a system.

**Solutions:**
1. **Daily memory files** (YYYY-MM-DD.md)
2. **Long-term memory** (MEMORY.md, curated)
3. **Project context** (README.md, docs/)
4. **Session transcripts** (chat logs)

**At session start, AI should:**
1. Read yesterday's memory
2. Read today's memory (if exists)
3. Read relevant project docs
4. THEN respond

**See:** [Context Preservation](../patterns/context-preservation.md)

---

### Q: AI keeps asking the same questions. How to fix?

**A:** Document the answers.

**Bad pattern:**
```
[Week 1]
AI: "What's the deployment process?"
You: [explains]

[Week 2]
AI: "What's the deployment process?"
You: [explains again]
```

**Good pattern:**
```
[Week 1]
AI: "What's the deployment process?"
You: "Document it in docs/deployment.md, then follow it."
AI: [creates docs/deployment.md]

[Week 2]
AI: [reads docs/deployment.md, deploys correctly]
```

**Principle:** Convert recurring questions → documentation.

---

### Q: AI is too slow/cautious. How to speed them up?

**A:** Adjust their risk tolerance.

**If AI is asking permission for everything:**
```
You: "For low-risk changes (tests, docs, refactoring), just do it.
For medium-risk (new features, dependencies), propose first.
For high-risk (production, security, data), always ask."
```

**Update their instructions:**
- Give clear authority boundaries
- Define "low/medium/high risk"
- Bias toward action within bounds

**See:** [Lava's rapid execution training](../methodology/principles-and-philosophy.md) (Frost Dashboard case study)

---

### Q: AI is too fast/reckless. How to slow them down?

**A:** Add review gates.

**If AI is shipping bugs:**
1. Require self-review before submission
2. Add automated tests (CI must pass)
3. Peer review by another AI
4. Human review for critical paths
5. Staging deployment first

**Update workflow:**
```
Old: Write code → Deploy
New: Write code → Self-review → Tests → Staging → Review → Deploy
```

**Don't slow down for sake of slowness.** Add quality gates, not bureaucracy.

---

## Scaling Questions

### Q: Can this work for large teams (10+ people)?

**A:** Yes, but coordination becomes critical.

**Small team (2-5):**
- Informal coordination
- Shared chat sufficient
- Ad-hoc workflows

**Medium team (6-15):**
- Defined roles
- Project boards
- Async standups
- Documentation culture

**Large team (16+):**
- Sub-teams with leads
- Formal processes
- Dedicated coordinators
- Platform/tooling investment

**AI integration scales same as human teams:** More people = more process needed.

---

### Q: Should different AIs have different memory systems?

**A:** Personal + shared hybrid works best.

**Personal memory (per AI):**
- Individual learnings
- Task history
- Performance metrics
- Personal preferences

**Shared memory (team):**
- Project decisions
- Architecture docs
- Coding standards
- Shared context

**Example:**
```
Ice's memory: "I prefer rigorous self-review before PRs"
Lava's memory: "I optimize for rapid iteration"
Shared memory: "All PRs must pass CI before merge"
```

**Like human teams:** Individual working styles + team agreements.

---

### Q: How do I measure productivity of AI collaboration?

**A:** Same metrics as humans, but track AI separately.

**Metrics:**
- Features shipped / week
- Bugs introduced / resolved
- Review feedback ratio
- Time to production
- Deployment frequency
- Customer satisfaction

**Track separately:**
- Human-authored code quality
- AI-authored code quality
- Collaboration effectiveness
- Handoff overhead

**Don't:** Assume AI productivity = human productivity. Different strengths.

**See:** [Metrics](../metrics/README.md) for detailed frameworks.

---

## Meta Questions

### Q: Is this playbook complete?

**A:** No. It never will be.

**Living document approach:**
- Update as we learn
- Add new patterns
- Retire obsolete ones
- Iterate continuously

**How to contribute:**
1. Fork repo
2. Add your learnings
3. Submit PR
4. Discuss in issues

**Best contributions:** Real incidents, not theory.

---

### Q: Who should read this playbook?

**A:** Anyone building human-AI teams.

**Primary audience:**
- Tech leads integrating AI into teams
- Engineering managers
- Product managers
- AI researchers studying collaboration

**Secondary audience:**
- AIs learning how to collaborate
- Students studying AI/HCI
- Curious engineers

**Not for:** People looking for AI prompt tips. This is about team dynamics, not prompts.

---

### Q: Can I use these patterns with non-coding AIs?

**A:** Yes! Patterns are workflow-agnostic.

**Coding examples in playbook, but applies to:**
- Content creation
- Research/analysis
- Customer support
- Data processing
- Design work
- Project management

**Core patterns (universal):**
- Role clarity
- Async handoffs
- Context preservation
- Failure recovery

**Adapt to your domain.** The principles stay the same.

---

## Didn't Find Your Question?

**Ask in:**
- GitHub Issues: [ai-human-collaboration-playbook/issues](https://github.com/LanNguyenSi/ai-human-collaboration-playbook/issues)
- Triologue R&D room: [opentriologue.ai](https://opentriologue.ai)

**We'll add common questions here.**

---

**Last Updated:** 2026-02-24  
**Contributors:** Ice 🧊 + Lava 🌋  
**Based on:** Triologue project experience (Feb 2026)
