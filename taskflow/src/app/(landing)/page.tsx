import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  FolderKanban,
  Zap,
  BarChart3,
  Users,
  ArrowRight,
  Layers3,
  TimerReset,
  ShieldCheck,
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Layers3,
      title: 'Clear workspaces',
      description:
        'Keep tasks, projects, and tags connected without losing the quick overview.',
    },
    {
      icon: TimerReset,
      title: 'Time tracking built in',
      description:
        'Start and stop timers directly on tasks so effort is visible while work happens.',
    },
    {
      icon: BarChart3,
      title: 'Useful signals',
      description:
        'See what is moving, what is blocked, and where your team attention should go next.',
    },
    {
      icon: FolderKanban,
      title: 'Project-aware planning',
      description:
        'Group related work into projects and filter quickly when priorities shift.',
    },
    {
      icon: Zap,
      title: 'Fast by default',
      description:
        'Designed for quick capture, quick edits, and minimal UI friction during focused work.',
    },
    {
      icon: ShieldCheck,
      title: 'Pragmatic stack',
      description:
        'Next.js, Prisma, SQLite, and NextAuth keep local setup simple and dependable.',
    },
  ];

  const highlights = [
    { label: 'Built for', value: 'Solo work and small teams' },
    { label: 'Core flow', value: 'Tasks, projects, tags, timers' },
    { label: 'Setup', value: 'Local-first with Docker support' },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,hsl(var(--secondary)/0.95),transparent_42%),radial-gradient(circle_at_top_right,hsl(var(--accent)/0.75),transparent_34%)]" />
        <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 pb-20 pt-6 sm:px-6 lg:px-8">
          <header className="mb-16 flex items-center justify-between rounded-full border border-border/60 bg-background/70 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
            <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="text-lg">TaskFlow</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/register">
                <Button className="rounded-full px-5">
                  Start free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="rounded-full px-5">
                  Sign in
                </Button>
              </Link>
            </div>
          </header>

          <section className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:gap-16">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4 text-primary" />
                Focused task management without enterprise bloat
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-balance sm:text-6xl lg:text-7xl">
                Keep tasks moving with a calmer, sharper control panel.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                TaskFlow gives you one place for planning, execution, and time
                tracking. The interface stays light, but the structure is solid
                enough for real daily work.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/register">
                  <Button size="lg" className="w-full rounded-full px-7 sm:w-auto">
                    Create your workspace
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-full border-border/70 bg-background/70 px-7 sm:w-auto"
                  >
                    Open existing account
                  </Button>
                </Link>
              </div>
              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-6">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 hidden h-32 w-32 rounded-full bg-secondary/80 blur-3xl lg:block" />
              <div className="absolute -right-4 bottom-6 hidden h-28 w-28 rounded-full bg-accent/70 blur-3xl lg:block" />
              <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/85 p-6 shadow-[0_32px_90px_-45px_hsl(var(--foreground)/0.4)] backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">
                      Today&apos;s focus
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      A dashboard that stays readable.
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl border border-border/60 bg-background/80 p-4">
                    <p className="text-sm text-muted-foreground">Open tasks</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight">
                      18
                    </p>
                    <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                      6 due this week
                    </p>
                  </div>
                  <div className="rounded-3xl border border-border/60 bg-background/80 p-4">
                    <p className="text-sm text-muted-foreground">In progress</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight">
                      5
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Active work, not hidden work
                    </p>
                  </div>
                  <div className="rounded-3xl border border-border/60 bg-background/80 p-4">
                    <p className="text-sm text-muted-foreground">Tracked time</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight">
                      14.5h
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Captured directly on tasks
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.75rem] border border-border/60 bg-linear-to-br from-background to-secondary/45 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">Product launch sprint</p>
                      <p className="text-sm text-muted-foreground">
                        8 tasks, 3 priorities, one clean timeline
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-primary/12 px-3 py-1 text-xs font-medium text-primary">
                      <Users className="h-3.5 w-3.5" />
                      Team ready
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/70 px-4 py-3">
                      <div>
                        <p className="font-medium">Triage customer feedback</p>
                        <p className="text-sm text-muted-foreground">
                          Tags: support, urgent
                        </p>
                      </div>
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                        High
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/70 px-4 py-3">
                      <div>
                        <p className="font-medium">Prepare release checklist</p>
                        <p className="text-sm text-muted-foreground">
                          Due tomorrow
                        </p>
                      </div>
                      <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium">
                        In progress
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
            What stands out
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Design that stays out of the way when work gets busy.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The product stays compact, readable, and operationally useful across
            task lists, dashboards, and quick actions.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-[1.75rem] border border-border/60 bg-card/75 p-6 shadow-sm backdrop-blur transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/15">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-primary/30 via-border to-transparent opacity-70 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border/60 bg-linear-to-r from-card/90 via-secondary/55 to-accent/55 p-8 shadow-sm backdrop-blur lg:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                Ready to use
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Replace scattered notes with a workflow that feels deliberate.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Start locally, keep the stack understandable, and give daily task
                management a UI that feels considered instead of generic.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full border-border/70 bg-background/70 px-7 sm:w-auto"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" className="w-full rounded-full px-7 sm:w-auto">
                  Create free account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:px-8">
          <div className="flex items-center gap-3 font-medium text-foreground">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            TaskFlow
          </div>
          <p>Task, project, and time tracking for focused execution.</p>
          <p>© {new Date().getFullYear()} TaskFlow</p>
        </div>
      </footer>
    </div>
  );
}
