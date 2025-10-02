// File: apps/commitly-web/src/pages/Reports.tsx

import { Check, Download, ArrowLeft, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface CommitReport {
  id: string;
  hash: string;
  message: string;
  author: string;
  date: string;
  status: 'pass' | 'fail' | 'warning';
  structure?: {
    type: string;
    scope: string;
    subject: string;
  };
  errors?: Array<{
    message: string;
    level: 'error' | 'warning';
  }>;
  autoFix?: {
    before: string;
    after: string;
  };
}

interface Repository {
  value: string;
  label: string;
}

interface Props {
  commits?: CommitReport[];
  repositories?: Repository[];
  defaultRepository?: string;
  defaultDateRange?: string;
  defaultStatus?: string;
}

// Demo data - realistic commit reports
const demoCommits: CommitReport[] = [
  {
    id: '1',
    hash: 'a1b2c3d',
    message: 'feat: implement user authentication',
    author: 'Alice',
    date: '2023-10-26',
    status: 'pass',
  },
  {
    id: '2',
    hash: 'f4e5d6c',
    message: 'fix login button',
    author: 'Bob',
    date: '2023-10-25',
    status: 'fail',
    structure: {
      type: 'fix',
      scope: '-',
      subject: 'login button',
    },
    errors: [
      { message: 'Subject must not be capitalized.', level: 'error' },
      { message: 'Scope is missing.', level: 'error' },
    ],
    autoFix: {
      before: 'fix login button',
      after: 'fix(ui): fix login button',
    },
  },
  {
    id: '3',
    hash: '7g8h9i0',
    message: 'docs: update contribution guidelines for new linter',
    author: 'Charlie',
    date: '2023-10-24',
    status: 'warning',
  },
  {
    id: '4',
    hash: 'j1k2l3m',
    message: 'chore(deps): update dependencies',
    author: 'David',
    date: '2023-10-23',
    status: 'pass',
  },
];

const demoRepositories: Repository[] = [
  { value: 'project-phoenix', label: 'project-phoenix' },
  { value: 'frontend-unicorn', label: 'frontend-unicorn' },
  { value: 'backend-goliath', label: 'backend-goliath' },
];

function CommitRow({ commit }: { commit: CommitReport }): JSX.Element {
  const [expanded, setExpanded] = useState(commit.status === 'fail');

  return (
    <>
      <tr
        className={cn(
          'transition-colors',
          commit.status === 'fail' && 'bg-destructive/5 border-l-4 border-l-destructive',
          commit.status === 'warning' && 'bg-warning/5 border-l-4 border-l-warning',
          commit.status === 'pass' && 'hover:bg-secondary/40'
        )}
      >
        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-warning">{commit.hash}</td>
        <td className="px-6 py-4 text-sm text-foreground max-w-md truncate">{commit.message}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{commit.author}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{commit.date}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              commit.status === 'pass' && 'bg-success/10 text-success',
              commit.status === 'fail' && 'bg-destructive/10 text-destructive',
              commit.status === 'warning' && 'bg-warning/10 text-warning'
            )}
          >
            <span
              className={cn(
                'w-2 h-2 mr-1.5 rounded-full',
                commit.status === 'pass' && 'bg-success',
                commit.status === 'fail' && 'bg-destructive',
                commit.status === 'warning' && 'bg-warning'
              )}
            />
            {commit.status === 'pass' && 'Pass'}
            {commit.status === 'fail' && 'Fail'}
            {commit.status === 'warning' && 'Warning'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded p-1"
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
          >
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </td>
      </tr>
      {expanded && (commit.structure || commit.errors || commit.autoFix) && (
        <tr className="bg-background">
          <td colSpan={6}>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Structure Breakdown */}
                {commit.structure && (
                  <section>
                    <h4 className="text-sm font-bold text-foreground mb-2">Structure Breakdown</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>
                        <span className="text-destructive/80 font-mono">type:</span> {commit.structure.type}
                      </li>
                      <li>
                        <span className="text-destructive/80 font-mono">scope:</span> {commit.structure.scope}
                      </li>
                      <li>
                        <span className="text-destructive/80 font-mono">subject:</span> {commit.structure.subject}
                      </li>
                    </ul>
                  </section>
                )}

                {/* Linting Errors */}
                {commit.errors && commit.errors.length > 0 && (
                  <section>
                    <h4 className="text-sm font-bold text-foreground mb-2">
                      Linting Errors ({commit.errors.length})
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {commit.errors.map((error, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle
                            className={cn(
                              'h-4 w-4 mt-0.5 flex-shrink-0',
                              error.level === 'error' && 'text-destructive',
                              error.level === 'warning' && 'text-warning'
                            )}
                          />
                          <span>{error.message}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Auto-Fix Suggestion */}
                {commit.autoFix && (
                  <section>
                    <h4 className="text-sm font-bold text-foreground mb-2">Auto-Fix Suggestion</h4>
                    <div className="bg-secondary p-3 rounded-md space-y-1">
                      <p className="font-mono text-sm text-foreground">{commit.autoFix.before}</p>
                      <p className="font-mono text-sm text-muted-foreground">--&gt;</p>
                      <p className="font-mono text-sm text-primary">{commit.autoFix.after}</p>
                    </div>
                  </section>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function Reports({
  commits = demoCommits,
  repositories = demoRepositories,
  defaultRepository = 'project-phoenix',
  defaultDateRange = '2023-10-01 to 2023-10-31',
  defaultStatus = 'All',
}: Props): JSX.Element {
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Project
          </a>

          <a
            href="/reports"
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
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold font-display text-foreground">Commit Reports</h2>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-secondary text-foreground font-medium py-2 px-4 rounded-md hover:bg-border transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Download className="h-4 w-4" />
                Download Report
              </button>
              <a
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded p-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </a>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            {/* Filter Bar */}
            <section className="bg-card/50 rounded-lg p-4 mb-6 border border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="repo-filter" className="block text-xs font-medium text-muted-foreground mb-1">
                    Repository
                  </label>
                  <select
                    id="repo-filter"
                    name="repo-filter"
                    className="w-full bg-secondary border border-border text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                    defaultValue={defaultRepository}
                    aria-label="Filter by repository"
                  >
                    {repositories.map((repo) => (
                      <option key={repo.value} value={repo.value}>
                        {repo.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="date-range" className="block text-xs font-medium text-muted-foreground mb-1">
                    Date Range
                  </label>
                  <input
                    type="text"
                    id="date-range"
                    name="date-range"
                    className="w-full bg-secondary border border-border text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                    defaultValue={defaultDateRange}
                    aria-label="Filter by date range"
                  />
                </div>
                <div>
                  <label htmlFor="status-filter" className="block text-xs font-medium text-muted-foreground mb-1">
                    Status
                  </label>
                  <select
                    id="status-filter"
                    name="status-filter"
                    className="w-full bg-secondary border border-border text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                    defaultValue={defaultStatus}
                    aria-label="Filter by status"
                  >
                    <option>All</option>
                    <option>Pass</option>
                    <option>Fail</option>
                    <option>Warning</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Commit Reports Table */}
            <div className="overflow-x-auto bg-card/50 rounded-lg border border-border/50">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-secondary/50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Commit Hash
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Commit Message
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Author
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Details</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {commits.map((commit) => (
                    <CommitRow key={commit.id} commit={commit} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

