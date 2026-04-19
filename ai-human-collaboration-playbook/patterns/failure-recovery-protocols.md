# Pattern: Failure Recovery Protocols

**Category:** Resilience Pattern  
**Complexity:** Advanced  
**Team Size:** 2+ (AI or Human)

## Context

In async AI-human collaboration, failures happen when teams are distributed across time zones or working independently. Traditional synchronous teams can "huddle up" immediately when something breaks. Async teams need structured protocols to recover without losing momentum.

## Problem

**Common failure scenarios:**
- Deployment breaks production
- Requirements were misunderstood
- Technical decisions don't scale
- Integration points fail
- Scope creep derails timeline
- Communication breakdown causes rework

**Why async makes it harder:**
- No immediate "all-hands" to fix issues
- Context loss between discovery and resolution
- Blame culture can emerge ("whose fault was this?")
- Recovery requires coordination across independent workers

## Solution

**Principle:** Treat failures as data, not disasters.

Establish clear protocols for each failure type that enable independent recovery without requiring synchronous coordination.

### Core Framework

```
Failure Detected → Classify → Isolate → Document → Recover → Learn
```

### Classification System

#### **Type 1: Critical (Production Down)**
- **Impact:** Users affected, system unavailable
- **Response Time:** Immediate (< 15 min)
- **Protocol:** Rollback first, debug later
- **Owner:** Deployment owner (whoever pushed to prod)

#### **Type 2: Major (Feature Broken)**
- **Impact:** Feature unusable, no workaround
- **Response Time:** Same-day
- **Protocol:** Triage, assign owner, fix or disable
- **Owner:** Implementation owner

#### **Type 3: Minor (Degraded UX)**
- **Impact:** Works but suboptimal
- **Response Time:** Next sprint/iteration
- **Protocol:** Log as tech debt, prioritize later
- **Owner:** Product/project lead

#### **Type 4: Process (Workflow Issue)**
- **Impact:** Team velocity affected
- **Response Time:** Immediate documentation
- **Protocol:** Update playbook, prevent recurrence
- **Owner:** Whoever discovered it

### Recovery Playbook

#### For Technical Failures

**Step 1: Isolate**
- Roll back to last known-good state
- Document exact error (logs, screenshots, repro steps)
- Notify team via async channel (don't wait for everyone)

**Step 2: Root Cause Analysis (Async)**
- Create issue/ticket with evidence
- One person investigates (no committee needed)
- Document findings in same ticket

**Step 3: Fix**
- Implement fix in branch
- Test thoroughly (don't rush)
- Deploy with monitoring

**Step 4: Post-Mortem (Written)**
- What happened? (timeline)
- Why did it happen? (root cause)
- How do we prevent recurrence? (action items)
- Share async (no meetings unless complex)

#### For Process Failures

**Step 1: Acknowledge**
- "I messed up" or "This process failed"
- Blame-free statement of facts

**Step 2: Document**
- Update relevant playbook/pattern
- Add to anti-patterns section
- Create checklist to prevent recurrence

**Step 3: Share Learning**
- Async update to team
- No finger-pointing, just facts + fix

**Step 4: Move Forward**
- Implement process improvement
- Validate it works next time

### Anti-Patterns

❌ **"Let's have a call to figure this out"**  
✅ **Document the issue first, then decide if sync needed**

❌ **Blame game ("Who broke production?")**  
✅ **Blameless post-mortem ("What broke and why?")**

❌ **Rush the fix without understanding root cause**  
✅ **Roll back first, investigate properly, then fix**

❌ **Hide failures to avoid looking bad**  
✅ **Transparent failure reporting builds trust**

❌ **Same failure happens twice**  
✅ **Update process/checklist after every failure**

## Real-World Examples

### Example 1: Docker Node.js Version Mismatch (Health Dashboard)

**What Failed:**
Vite build failed during Docker deployment with error "Vite requires Node 20+", but Dockerfile used Node 18.

**Classification:** Type 2 (Major - feature broken)

**Recovery Steps:**

1. **Isolate:** Deployment failed before going live (good! caught early)
2. **Document:** Error message logged, exact Dockerfile line identified
3. **Root Cause:** Dockerfile used `FROM node:18-alpine`, but Vite needed Node 20+
4. **Fix:** Changed to `FROM node:20-alpine`, rebuilt image
5. **Time to recover:** 10 minutes
6. **Prevention:** Added Node version check to pre-deployment checklist

**Key Learning:** Pre-deployment validation checklist prevents production failures.

### Example 2: Nginx Config Inline Echo Failure (Health Dashboard)

**What Failed:**
Docker Compose tried to write Nginx config via inline `echo` command, which failed with syntax errors.

**Classification:** Type 2 (Major - container won't start)

**Recovery Steps:**

1. **Isolate:** Container wouldn't start, checked logs immediately
2. **Document:** Nginx error log showed "unknown directive" in config
3. **Root Cause:** Shell escaping broke multiline config string
4. **Fix:** Created dedicated `nginx.conf` file, mounted it as volume
5. **Time to recover:** 5 minutes
6. **Prevention:** Infrastructure-as-Code principle: use config files, not shell tricks

**Key Learning:** Proper file structures beat clever inline commands.

### Example 3: GitHub Authentication Token Switch (Health Dashboard)

**What Failed:**
Push to GitHub failed with "Authentication denied" because wrong account token was used.

**Classification:** Type 3 (Minor - workflow inconvenience)

**Recovery Steps:**

1. **Isolate:** Git push failed, checked credential store
2. **Document:** PAT was for wrong account (lavaclawdbot vs LanNguyenSi)
3. **Root Cause:** Multi-account workflow confusion
4. **Fix:** Switched to SSH keys (more reliable)
5. **Time to recover:** 5 minutes
6. **Prevention:** Use SSH for multi-account setups, document which account owns which repo

**Key Learning:** Authentication complexity is a common async blocker - simplify auth upfront.

## Metrics

**From Health Dashboard case study:**
- **Total failures:** 4 technical issues
- **Total recovery time:** 27 minutes
- **Impact on project timeline:** None (still shipped in 3 hours)
- **Process improvements:** 3 checklists added
- **Repeat failures:** 0

**Industry baseline:**
- Average incident resolution (traditional): 2-4 hours
- Repeat incident rate: 30% (same issue happens again)
- Time spent in "war room" meetings: 1-2 hours per incident

## When to Use

✅ **Use this pattern when:**
- Team works asynchronously across time zones
- Failures could happen outside of synchronous hours
- You want to build resilience into workflow
- Learning from failures is valued

❌ **Don't use this pattern when:**
- Team is always synchronous (can huddle immediately)
- Failures are so rare that protocols add overhead
- Blame culture dominates (fix culture first)

## Variations

### 1. Escalation Protocol
```
Minor Failure → Owner fixes
Major Failure → Owner + Reviewer
Critical Failure → All hands (sync if needed)
```

### 2. Chaos Engineering Approach
```
Intentionally introduce failures → Test recovery → Improve protocols
```

### 3. Continuous Deployment with Automated Rollback
```
Deploy → Monitor metrics → Auto-rollback if degraded → Investigate async
```

## Related Patterns

- [Async Handoff Protocol](./async-handoff-protocol.md)
- [Quality Control Mechanisms](./quality-control.md)
- [Context Preservation Methods](./context-preservation.md)

## References

- Case Study: [Triologue Health Dashboard](../case-studies/health-dashboard.md) - Section on Unexpected Challenges
- Anti-Pattern: [Blame Culture](../anti-patterns/blame-culture.md)

---

**Pattern Status:** ✅ Validated (Health Dashboard case study)  
**Last Updated:** 2026-02-23  
**Contributors:** Ice 🧊, Lava 🌋
