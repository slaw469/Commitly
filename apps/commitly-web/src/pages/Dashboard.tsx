// File: apps/commitly-web/src/pages/Dashboard.tsx

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  name: string;
  lastCommit: string;
  commitMessage: string;
  status: 'pass' | 'fail' | 'warning';
}

interface LintError {
  rule: string;
  message: string;
  level: 'error' | 'warning';
}

interface Props {
  projects?: Project[];
  totalCompliant?: number;
  totalNonCompliant?: number;
  lintErrors?: LintError[];
}

// Demo data - realistic examples
const demoProjects: Project[] = [
  {
    id: '1',
    name: 'project-phoenix',
    lastCommit: '2 hours ago',
    commitMessage: 'feat(auth): implement magic link login',
    status: 'pass',
  },
  {
    id: '2',
    name: 'apollo-gateway',
    lastCommit: '1 day ago',
    commitMessage: 'fix login button',
    status: 'fail',
  },
  {
    id: '3',
    name: 'mobile-app-v2',
    lastCommit: '5 hours ago',
    commitMessage: 'refactor: update dependencies and remove unused packages',
    status: 'warning',
  },
];

const demoLintErrors: LintError[] = [
  {
    rule: 'subject-empty',
    message: 'Subject may not be empty.',
    level: 'error',
  },
  {
    rule: 'type-case',
    message: "Type must be lower-case. (e.g., 'feat')",
    level: 'error',
  },
  {
    rule: 'body-leading-blank',
    message: 'Body must have a leading blank line.',
    level: 'warning',
  },
];

export default function Dashboard({
  projects = demoProjects,
  totalCompliant = 1283,
  totalNonCompliant = 427,
  lintErrors = demoLintErrors,
}: Props): JSX.Element {
  const totalCommits = totalCompliant + totalNonCompliant;
  const compliancePercentage = Math.round((totalCompliant / totalCommits) * 100);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-sidebar border-r border-border/50 p-4">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <Check className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold font-display text-foreground">Commitly</h1>
        </div>

        <nav className="flex flex-col gap-2" role="navigation" aria-label="Main navigation">
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium bg-secondary text-foreground transition-colors"
            aria-current="page"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </a>

          <a
            href="/add-project"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Project
          </a>

          <a
            href="/reports"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Reports
          </a>

          <a
            href="/formatter"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
              />
            </svg>
            Formatter
          </a>

          <a
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </a>

          <a
            href="/docs"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Docs
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-6 py-4">
            <h2 className="text-2xl font-bold font-display text-foreground">Your Projects</h2>
          </div>
        </header>

        {/* Content Grid */}
        <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Projects & Details */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Projects Grid */}
            <div className="grid grid-cols-1 @container md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className={cn(
                    'glassmorphism rounded-lg p-5 flex flex-col gap-4 transition-shadow',
                    project.status === 'fail' && 'border-destructive/50 shadow-lg shadow-destructive/20'
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg font-display text-foreground">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">Last commit: {project.lastCommit}</p>
                    </div>
                    <span
                      className={cn(
                        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                        project.status === 'pass' && 'bg-success/10 text-success',
                        project.status === 'fail' && 'bg-destructive/10 text-destructive',
                        project.status === 'warning' && 'bg-warning/10 text-warning'
                      )}
                    >
                      <span
                        className={cn(
                          'w-2 h-2 mr-2 rounded-full',
                          project.status === 'pass' && 'bg-success',
                          project.status === 'fail' && 'bg-destructive',
                          project.status === 'warning' && 'bg-warning'
                        )}
                      />
                      {project.status === 'pass' && 'Pass'}
                      {project.status === 'fail' && 'Fail'}
                      {project.status === 'warning' && 'Warning'}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{project.commitMessage}</p>
                  <div className="flex items-center justify-end gap-2 mt-auto pt-4">
                    <button className="px-3 py-1.5 text-xs font-semibold text-foreground bg-secondary hover:bg-border rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      View Report
                    </button>
                    <button className="px-3 py-1.5 text-xs font-semibold text-foreground bg-secondary hover:bg-border rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      Auto-Fix
                    </button>
                    <button className="px-3 py-1.5 text-xs font-semibold text-foreground bg-secondary hover:bg-border rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      Disconnect
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Commit Message Structure */}
            <section className="glassmorphism rounded-lg p-5">
              <h3 className="font-bold text-lg font-display text-foreground mb-4">
                Commit Message Structure Breakdown
              </h3>
              <div className="bg-card p-4 rounded-md font-mono text-sm flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-primary">type(scope):</span>
                <span className="text-muted-foreground">subject</span>
                <span className="text-muted-foreground mx-2">→</span>
                <span className="text-muted-foreground">body</span>
                <span className="text-muted-foreground mx-2">→</span>
                <span className="text-muted-foreground">footer</span>
              </div>
              <div className="bg-card p-4 rounded-md font-mono text-sm flex flex-wrap items-center gap-x-2 gap-y-1 mt-4">
                <span className="text-destructive border border-destructive/50 px-1 py-0.5 rounded">fix</span>
                <span className="text-primary">(login):</span>
                <span className="text-foreground">add error message for wrong password</span>
              </div>
            </section>

            {/* Errors and Suggestions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Linting Errors */}
              <section className="glassmorphism rounded-lg p-5">
                <h3 className="font-bold text-lg font-display text-foreground mb-4">Linting Errors</h3>
                <ul className="space-y-3" role="list">
                  {lintErrors.map((error, index) => (
                    <li key={index} className="text-sm">
                      <span
                        className={cn(
                          'font-semibold',
                          error.level === 'error' && 'text-destructive',
                          error.level === 'warning' && 'text-warning'
                        )}
                      >
                        {error.rule}:
                      </span>
                      <span className="text-muted-foreground"> {error.message}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Auto-Fix Suggestion */}
              <section className="glassmorphism rounded-lg p-5">
                <h3 className="font-bold text-lg font-display text-foreground mb-4">Auto-Fix Suggestion</h3>
                <div className="bg-card p-3 rounded-md font-mono text-xs">
                  <div className="text-destructive/80">- fix login button</div>
                  <div className="text-success/80">+ fix(auth): resolve login button redirect issue</div>
                </div>
              </section>
            </div>
          </div>

          {/* Right Column - Stats & Integration */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Commit Quality Donut Chart */}
            <section className="glassmorphism rounded-lg p-5 flex flex-col items-center">
              <h3 className="font-bold text-lg font-display text-foreground mb-4 self-start">
                Commit History Quality
              </h3>
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-destructive"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${compliancePercentage} ${100 - compliancePercentage}`}
                    className="text-success"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold font-display text-foreground">{compliancePercentage}%</span>
                  <span className="text-xs text-muted-foreground">Compliant</span>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-4 w-full">
                <div className="text-center">
                  <p className="text-lg font-bold text-success">{totalCompliant.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Compliant</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-destructive">{totalNonCompliant.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Non-Compliant</p>
                </div>
              </div>
            </section>

            {/* Integration Status */}
            <section className="glassmorphism rounded-lg p-5">
              <h3 className="font-bold text-lg font-display text-foreground mb-4">Integration Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Git Hook Status</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">CI/CD Pipeline</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                    Connected
                  </span>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium text-foreground">Last Run Summary</p>
                  <p className="text-xs text-muted-foreground">
                    Checked 15 commits, found 3 errors. Completed in 2.1s.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

