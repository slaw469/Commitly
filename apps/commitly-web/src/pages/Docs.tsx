// File: apps/commitly-web/src/pages/Docs.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Search,
  BookOpen,
  Terminal,
  Settings as SettingsIcon,
  Code,
  Package,
  GitBranch,
  ExternalLink,
  AlertTriangle,
  Lightbulb,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  initialSection?: string;
}

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

const tableOfContents: TableOfContentsItem[] = [
  { id: 'overview', title: 'Overview', level: 1 },
  { id: 'features', title: 'Features', level: 1 },
  { id: 'installation', title: 'Installation', level: 1 },
  { id: 'cli-usage', title: 'CLI Usage', level: 1 },
  { id: 'lint', title: 'Lint Command', level: 2 },
  { id: 'fix', title: 'Fix Command', level: 2 },
  { id: 'check', title: 'Check Command', level: 2 },
  { id: 'init-hooks', title: 'Init Hooks', level: 2 },
  { id: 'commit-rules', title: 'Commit Rules', level: 1 },
  { id: 'types', title: 'Commit Types', level: 2 },
  { id: 'structure', title: 'Message Structure', level: 2 },
  { id: 'configuration', title: 'Configuration', level: 1 },
  { id: 'auto-fix', title: 'Auto-Fix Options', level: 1 },
  { id: 'integrations', title: 'Integrations', level: 1 },
  { id: 'git-hooks', title: 'Git Hooks', level: 2 },
  { id: 'ci-cd', title: 'CI/CD Pipelines', level: 2 },
  { id: 'examples', title: 'Examples', level: 1 },
];

export default function Docs({ initialSection = 'overview' }: Props): JSX.Element {
  const [activeSection, setActiveSection] = useState<string>(initialSection);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map((item) => item.id);
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= 0 && rect.top <= 200;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Copy code to clipboard
  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filter TOC based on search
  const filteredTOC = tableOfContents.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Link
            to="/dashboard"
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
          </Link>

          <Link
            to="/add-project"
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
          </Link>

          <Link
            to="/reports"
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
          </Link>

          <Link
            to="/formatter"
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
          </Link>

          <Link
            to="/playground"
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
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Playground
          </Link>

          <Link
            to="/settings"
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </Link>

          <Link
            to="/docs"
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Docs
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold font-display text-foreground">Documentation</h2>
            <div className="relative max-w-md w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary border border-border rounded-md text-foreground pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                aria-label="Search documentation"
              />
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Table of Contents */}
          <nav
            className="w-64 border-r border-border/50 p-6 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto"
            aria-label="Table of contents"
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Table of Contents
            </h3>
            <ul className="space-y-1" role="list">
              {filteredTOC.map((item) => (
                <li key={item.id} className={cn(item.level === 2 && 'ml-4')}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      'block py-1.5 text-sm transition-colors text-left w-full rounded px-2',
                      activeSection === item.id
                        ? 'text-primary font-medium bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Documentation Content */}
          <main className="flex-1 p-8 max-w-4xl">
            <article className="space-y-12">
              {/* Overview Section */}
              <section id="overview">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-3xl font-bold font-display text-foreground border-b-0">
                    Overview
                  </h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed text-base">
                    <strong className="text-primary">Commitly</strong> is a powerful tool designed
                    to help development teams maintain clean, consistent commit history. By
                    enforcing standardized commit message formats based on the{' '}
                    <a
                      href="https://www.conventionalcommits.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Conventional Commits
                      <ExternalLink className="h-3 w-3" />
                    </a>{' '}
                    specification, Commitly improves readability, simplifies changelog generation,
                    and makes navigating project history effortless.
                  </p>

                  <div className="mt-6 p-4 bg-warning/10 border-l-4 border-warning rounded-r-md">
                    <div className="flex gap-3">
                      <Lightbulb
                        className="h-5 w-5 text-warning flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-foreground text-sm font-medium">Pro Tip</p>
                        <p className="text-muted-foreground text-sm mt-1">
                          A clean commit history isn't just about aesthetics—it's a crucial part of
                          a healthy, maintainable codebase that enables better collaboration and
                          faster debugging.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Features Section */}
              <section id="features">
                <h2 className="text-3xl font-bold font-display text-foreground mb-6 pb-2 border-b border-border">
                  Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      icon: <Code className="h-5 w-5" />,
                      title: 'Parse & Validate',
                      description:
                        'Automatically parse type(scope): subject structure and validate against configurable rules',
                    },
                    {
                      icon: <Package className="h-5 w-5" />,
                      title: 'Auto-Fix',
                      description:
                        'Intelligent auto-fix for common issues like casing, trailing periods, and line wrapping',
                    },
                    {
                      icon: <Terminal className="h-5 w-5" />,
                      title: 'CLI & Web',
                      description:
                        'Fast CLI for git hooks and CI/CD, plus a sleek web playground for interactive editing',
                    },
                    {
                      icon: <SettingsIcon className="h-5 w-5" />,
                      title: 'Configurable',
                      description:
                        'Customize types, scopes, max lengths, blocked words, and more via .commitlyrc',
                    },
                  ].map((feature, index) => (
                    <div key={index} className="glassmorphism rounded-lg p-5 flex gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Installation Section */}
              <section id="installation">
                <h2 className="text-3xl font-bold font-display text-foreground mb-6 pb-2 border-b border-border">
                  Installation
                </h2>
                <p className="text-foreground leading-relaxed mb-4">
                  Install the CLI tool globally or as a dev dependency in your project:
                </p>

                <div className="space-y-4">
                  <CodeBlock
                    id="install-global"
                    title="Global Installation"
                    code={`# Using npm
npm install -g @commitly/cli

# Using pnpm
pnpm add -g @commitly/cli

# Using yarn
yarn global add @commitly/cli`}
                    language="bash"
                    onCopy={copyToClipboard}
                    isCopied={copiedCode === 'install-global'}
                  />

                  <CodeBlock
                    id="install-dev"
                    title="Dev Dependency"
                    code={`# Using npm
npm install -D @commitly/cli

# Using pnpm
pnpm add -D @commitly/cli

# Using yarn
yarn add -D @commitly/cli`}
                    language="bash"
                    onCopy={copyToClipboard}
                    isCopied={copiedCode === 'install-dev'}
                  />
                </div>
              </section>

              {/* CLI Usage Section */}
              <section id="cli-usage">
                <h2 className="text-3xl font-bold font-display text-foreground mb-6 pb-2 border-b border-border">
                  CLI Usage
                </h2>
                <p className="text-foreground leading-relaxed mb-6">
                  The Commitly CLI provides four main commands for linting, fixing, checking, and
                  setting up git hooks.
                </p>

                {/* Lint Command */}
                <div id="lint" className="space-y-4 mb-8">
                  <h3 className="text-xl font-semibold font-display text-foreground flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" aria-hidden="true" />
                    Lint Command
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Validates a commit message and reports any errors or warnings.
                  </p>
                  <CodeBlock
                    id="lint-cmd"
                    code={`# Lint the current commit message (from .git/COMMIT_EDITMSG)
commitly lint

# Lint a specific file
commitly lint -f path/to/message.txt

# Lint a message string directly
commitly lint -m "feat: add new feature"`}
                    language="bash"
                    onCopy={copyToClipboard}
                    isCopied={copiedCode === 'lint-cmd'}
                  />
                </div>

                {/* Fix Command */}
                <div id="fix" className="space-y-4 mb-8">
                  <h3 className="text-xl font-semibold font-display text-foreground flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" aria-hidden="true" />
                    Fix Command
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Auto-fixes a commit message and writes it back to the file (or prints it).
                  </p>
                  <CodeBlock
                    id="fix-cmd"
                    code={`# Fix and write back to COMMIT_EDITMSG
commitly fix

# Fix a specific file
commitly fix -f path/to/message.txt

# Fix and print (doesn't write)
commitly fix -m "Add new feature"`}
                    language="bash"
                    onCopy={copyToClipboard}
                    isCopied={copiedCode === 'fix-cmd'}
                  />
                </div>

                {/* Check Command */}
                <div id="check" className="space-y-4 mb-8">
                  <h3 className="text-xl font-semibold font-display text-foreground flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-primary" aria-hidden="true" />
                    Check Command
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Validates a message string (useful for CI/CD pipelines). Exits with code 0 if
                    valid, 1 if invalid.
                  </p>
                  <CodeBlock
                    id="check-cmd"
                    code={`# Check a commit message in CI
commitly check "feat(api): add user endpoint"

# Use in GitHub Actions
- name: Validate Commit Message
  run: commitly check "\${{ github.event.head_commit.message }}"`}
                    language="bash"
                    onCopy={copyToClipboard}
                    isCopied={copiedCode === 'check-cmd'}
                  />
                </div>

                {/* Init Hooks Command */}
                <div id="init-hooks" className="space-y-4 mb-8">
                  <h3 className="text-xl font-semibold font-display text-foreground flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-primary" aria-hidden="true" />
                    Init Hooks
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Automatically installs a git{' '}
                    <code className="text-foreground bg-secondary px-1.5 py-0.5 rounded text-xs">
                      commit-msg
                    </code>{' '}
                    hook that validates commits before they're created.
                  </p>
                  <CodeBlock
                    id="init-hooks-cmd"
                    code={`# Install git hooks in current repository
commitly init-hooks

# This creates .git/hooks/commit-msg that runs:
# commitly lint -f "$1"`}
                    language="bash"
                    onCopy={copyToClipboard}
                    isCopied={copiedCode === 'init-hooks-cmd'}
                  />
                </div>
              </section>

              {/* Commit Rules Section */}
              <section id="commit-rules">
                <h2 className="text-3xl font-bold font-display text-foreground mb-6 pb-2 border-b border-border">
                  Commit Rules
                </h2>
                <p className="text-foreground leading-relaxed mb-6">
                  Commitly follows the{' '}
                  <a
                    href="https://www.conventionalcommits.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Conventional Commits
                    <ExternalLink className="h-3 w-3" />
                  </a>{' '}
                  specification by default. Here are the key rules:
                </p>

                <div className="glassmorphism rounded-lg p-6 space-y-4 mb-6">
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start gap-3">
                      <CheckCircle2
                        className="h-5 w-5 text-success flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-foreground">
                        Header must not exceed <strong>72 characters</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2
                        className="h-5 w-5 text-success flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-foreground">
                        Subject must be written in <strong>lowercase</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2
                        className="h-5 w-5 text-success flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-foreground">
                        Subject must start with a valid <strong>type</strong> (e.g., feat, fix,
                        docs)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2
                        className="h-5 w-5 text-success flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-foreground">
                        Subject must not end with a <strong>period</strong>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2
                        className="h-5 w-5 text-success flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-foreground">
                        A <strong>blank line</strong> must separate header from body
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2
                        className="h-5 w-5 text-success flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="text-foreground">
                        Body lines should wrap at <strong>100 characters</strong>
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Commit Types */}
                <div id="types" className="mb-8">
                  <h3 className="text-xl font-semibold font-display text-foreground mb-4">
                    Commit Types
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Standard commit types supported by Commitly:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { type: 'feat', desc: 'A new feature for the user' },
                      { type: 'fix', desc: 'A bug fix' },
                      { type: 'docs', desc: 'Documentation changes only' },
                      { type: 'style', desc: 'Code style changes (formatting, semicolons, etc.)' },
                      {
                        type: 'refactor',
                        desc: 'Code change that neither fixes a bug nor adds a feature',
                      },
                      { type: 'perf', desc: 'Performance improvements' },
                      { type: 'test', desc: 'Adding or updating tests' },
                      { type: 'build', desc: 'Build system or external dependency changes' },
                      { type: 'ci', desc: 'CI configuration changes' },
                      { type: 'chore', desc: "Other changes that don't modify src or test files" },
                      { type: 'revert', desc: 'Reverts a previous commit' },
                    ].map((item) => (
                      <div key={item.type} className="flex items-start gap-3 text-sm">
                        <code className="bg-primary/10 text-primary px-2 py-1 rounded font-mono text-xs font-semibold whitespace-nowrap">
                          {item.type}
                        </code>
                        <span className="text-muted-foreground">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Structure */}
                <div id="structure" className="mb-8">
                  <h3 className="text-xl font-semibold font-display text-foreground mb-4">
                    Message Structure
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    A conventional commit message consists of a header, optional body, and optional
                    footer:
                  </p>
                  <CodeBlock
                    id="structure-format"
                    code={`<type>(<scope>): <subject>

<body>

<footer>`}
                    language="text"
                    onCopy={copyToClipboard}
                    isCopied={copiedCode === 'structure-format'}
                  />
                </div>
              </section>

              {/* Configuration Section */}
              <section id="configuration">
                <h2 className="text-3xl font-bold font-display text-foreground mb-6 pb-2 border-b border-border">
                  Configuration
                </h2>
                <p className="text-foreground leading-relaxed mb-4">
                  Commitly can be configured via a{' '}
                  <code className="text-foreground bg-secondary px-1.5 py-0.5 rounded text-sm">
                    .commitlyrc.json
                  </code>{' '}
                  file in your project root, or by adding a{' '}
                  <code className="text-foreground bg-secondary px-1.5 py-0.5 rounded text-sm">
                    commitly
                  </code>{' '}
                  key to your{' '}
                  <code className="text-foreground bg-secondary px-1.5 py-0.5 rounded text-sm">
                    package.json
                  </code>
                  .
                </p>

                <div className="space-y-4">
                  <CodeBlock
                    id="config-file"
                    title=".commitlyrc.json"
                    code={`{
  "types": ["feat", "fix", "docs", "style", "refactor", "test", "chore"],
  "requireScope": false,
  "maxHeaderLength": 72,
  "maxLineLength": 100,
  "subjectCase": "lower",
  "subjectEmptyForbidden": true,
  "subjectFullStopForbidden": true,
  "bodyLeadingBlank": true,
  "footerLeadingBlank": true,
  "blockedWords": ["wip", "todo", "fixme"]
}`}
                    language="json"
                    onCopy={copyToClipboard}
                    isCopied={copiedCode === 'config-file'}
                  />

                  <CodeBlock
                    id="config-package"
                    title="package.json"
                    code={`{
  "name": "my-project",
  "version": "1.0.0",
  "commitly": {
    "types": ["feat", "fix", "docs"],
    "requireScope": true,
    "maxHeaderLength": 50
  }
}`}
                    language="json"
                    onCopy={copyToClipboard}
                    isCopied={copiedCode === 'config-package'}
                  />
                </div>

                <div className="mt-6 glassmorphism rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Configuration Options
                  </h4>
                  <div className="space-y-2 text-sm">
                    {[
                      {
                        key: 'types',
                        desc: 'Array of allowed commit types',
                        default: '["feat", "fix", "docs", ...]',
                      },
                      { key: 'requireScope', desc: 'Whether scope is required', default: 'false' },
                      { key: 'maxHeaderLength', desc: 'Maximum header length', default: '72' },
                      { key: 'maxLineLength', desc: 'Maximum body line length', default: '100' },
                      { key: 'subjectCase', desc: 'Subject case style', default: '"lower"' },
                      {
                        key: 'subjectEmptyForbidden',
                        desc: 'Forbid empty subject',
                        default: 'true',
                      },
                      {
                        key: 'subjectFullStopForbidden',
                        desc: 'Forbid trailing period in subject',
                        default: 'true',
                      },
                      {
                        key: 'bodyLeadingBlank',
                        desc: 'Require blank line before body',
                        default: 'true',
                      },
                      {
                        key: 'footerLeadingBlank',
                        desc: 'Require blank line before footer',
                        default: 'true',
                      },
                      {
                        key: 'blockedWords',
                        desc: 'Array of words not allowed in commits',
                        default: '[]',
                      },
                    ].map((option) => (
                      <div
                        key={option.key}
                        className="flex items-start gap-3 pb-2 border-b border-border/30 last:border-0"
                      >
                        <code className="text-primary font-mono text-xs bg-primary/10 px-2 py-1 rounded whitespace-nowrap">
                          {option.key}
                        </code>
                        <div className="flex-1">
                          <p className="text-muted-foreground">{option.desc}</p>
                          <p className="text-muted-foreground/70 text-xs mt-0.5">
                            Default: {option.default}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Auto-Fix Options Section */}
              <section id="auto-fix">
                <h2 className="text-3xl font-bold font-display text-foreground mb-6 pb-2 border-b border-border">
                  Auto-Fix Options
                </h2>
                <p className="text-foreground leading-relaxed mb-4">
                  Commitly's auto-fix feature can automatically correct common issues in your commit
                  messages:
                </p>

                <div className="glassmorphism rounded-lg p-6 space-y-4 mb-6">
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <strong className="text-foreground">Type Inference:</strong>
                        <span className="text-muted-foreground">
                          {' '}
                          Automatically infers commit type from verbs (add → feat, fix → fix, update
                          → refactor)
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <strong className="text-foreground">Case Correction:</strong>
                        <span className="text-muted-foreground">
                          {' '}
                          Converts subject to lowercase as per convention
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <strong className="text-foreground">Trailing Period:</strong>
                        <span className="text-muted-foreground">
                          {' '}
                          Removes trailing periods from subject lines
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <strong className="text-foreground">Line Wrapping:</strong>
                        <span className="text-muted-foreground">
                          {' '}
                          Wraps body text at configured line length
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-warning/10 border-l-4 border-warning rounded-r-md">
                  <div className="flex gap-3">
                    <AlertTriangle
                      className="h-5 w-5 text-warning flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-foreground text-sm font-medium">Important</p>
                      <p className="text-muted-foreground text-sm mt-1">
                        Always review auto-fixed commits before pushing. While auto-fix is
                        intelligent, it may not always capture your exact intent. Use it as a
                        helpful assistant, not a replacement for careful commit message crafting.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Integrations Section */}
              <section id="integrations">
                <h2 className="text-3xl font-bold font-display text-foreground mb-6 pb-2 border-b border-border">
                  Integrations
                </h2>
                <p className="text-foreground leading-relaxed mb-6">
                  Integrate Commitly into your development workflow using git hooks or CI/CD
                  pipelines.
                </p>

                {/* Git Hooks */}
                <div id="git-hooks" className="mb-8">
                  <h3 className="text-xl font-semibold font-display text-foreground mb-4 flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-primary" aria-hidden="true" />
                    Git Hooks (Husky)
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Use Husky to run Commitly on every commit:
                  </p>
                  <div className="space-y-4">
                    <CodeBlock
                      id="husky-install"
                      title="Install Husky"
                      code={`# Install husky
npm install -D husky

# Initialize husky
npx husky init`}
                      language="bash"
                      onCopy={copyToClipboard}
                      isCopied={copiedCode === 'husky-install'}
                    />
                    <CodeBlock
                      id="husky-hook"
                      title=".husky/commit-msg"
                      code={`#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx commitly lint -f "$1"`}
                      language="bash"
                      onCopy={copyToClipboard}
                      isCopied={copiedCode === 'husky-hook'}
                    />
                  </div>
                </div>

                {/* CI/CD */}
                <div id="ci-cd" className="mb-8">
                  <h3 className="text-xl font-semibold font-display text-foreground mb-4 flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                    CI/CD Pipelines
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Validate commit messages in your CI/CD pipeline:
                  </p>
                  <div className="space-y-4">
                    <CodeBlock
                      id="github-actions"
                      title="GitHub Actions"
                      code={`name: Validate Commits

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Commitly
        run: npm install -g @commitly/cli
      
      - name: Validate Commit Message
        run: commitly check "\${{ github.event.head_commit.message }}"`}
                      language="yaml"
                      onCopy={copyToClipboard}
                      isCopied={copiedCode === 'github-actions'}
                    />

                    <CodeBlock
                      id="gitlab-ci"
                      title="GitLab CI"
                      code={`validate-commits:
  stage: test
  image: node:18
  script:
    - npm install -g @commitly/cli
    - commitly check "$CI_COMMIT_MESSAGE"
  only:
    - merge_requests`}
                      language="yaml"
                      onCopy={copyToClipboard}
                      isCopied={copiedCode === 'gitlab-ci'}
                    />
                  </div>
                </div>
              </section>

              {/* Examples Section */}
              <section id="examples">
                <h2 className="text-3xl font-bold font-display text-foreground mb-6 pb-2 border-b border-border">
                  Examples
                </h2>

                <div className="space-y-6">
                  {/* Valid Example */}
                  <div>
                    <h3 className="text-lg font-semibold text-success mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Valid Commit Message
                    </h3>
                    <div className="glassmorphism rounded-lg overflow-hidden border-l-4 border-success">
                      <div className="bg-success/10 px-4 py-2 border-b border-border/30">
                        <span className="text-xs font-mono text-success font-semibold">✓ PASS</span>
                      </div>
                      <pre className="p-4 font-mono text-sm text-foreground overflow-x-auto">
                        {`feat(api): add endpoint for user profiles

Implement the GET /api/users/:id endpoint.
This endpoint returns the user's public profile information.
It requires authentication.

Closes #123`}
                      </pre>
                    </div>
                  </div>

                  {/* Invalid Example */}
                  <div>
                    <h3 className="text-lg font-semibold text-destructive mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Invalid Commit Message
                    </h3>
                    <div className="glassmorphism rounded-lg overflow-hidden border-l-4 border-destructive">
                      <div className="bg-destructive/10 px-4 py-2 border-b border-border/30">
                        <span className="text-xs font-mono text-destructive font-semibold">
                          ✗ FAIL
                        </span>
                      </div>
                      <pre className="p-4 font-mono text-sm text-foreground overflow-x-auto">
                        {`fixed login button`}
                      </pre>
                      <div className="px-4 py-3 bg-destructive/5 border-t border-border/30">
                        <p className="text-sm text-destructive font-medium mb-1">Errors:</p>
                        <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                          <li>
                            <strong className="text-destructive">type-empty:</strong> Type must not
                            be empty
                          </li>
                          <li>
                            <strong className="text-destructive">subject-case:</strong> Subject must
                            be lowercase
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Auto-Fix Example */}
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Auto-Fix Transformation
                    </h3>
                    <div className="glassmorphism rounded-lg overflow-hidden">
                      <div className="bg-destructive/5 px-4 py-3 border-b border-border/30">
                        <span className="text-xs font-mono text-muted-foreground mr-2">
                          BEFORE:
                        </span>
                        <pre className="font-mono text-sm text-destructive/80 inline">
                          Add OAuth Login.
                        </pre>
                      </div>
                      <div className="bg-success/5 px-4 py-3">
                        <span className="text-xs font-mono text-muted-foreground mr-2">AFTER:</span>
                        <pre className="font-mono text-sm text-success/80 inline">
                          feat(auth): add OAuth login
                        </pre>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Auto-fix inferred type from "Add" → "feat", lowercased subject, removed
                      trailing period, and added scope suggestion.
                    </p>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <footer className="pt-12 border-t border-border/50 text-center">
                <a
                  href="https://github.com/yourusername/commitly"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-secondary text-foreground font-medium py-3 px-6 rounded-md hover:bg-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.745 0 .267.18.577.688.482A10.001 10.001 0 0 0 22 12c0-5.523-4.477-10-10-10Z"
                      fillRule="evenodd"
                    />
                  </svg>
                  View Full Docs on GitHub
                </a>
                <p className="text-sm text-muted-foreground mt-6">
                  Built with ❤️ for better commit messages • Licensed under MIT
                </p>
              </footer>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}

// Code Block Component
interface CodeBlockProps {
  id: string;
  code: string;
  language: string;
  title?: string;
  onCopy: (code: string, id: string) => void;
  isCopied: boolean;
}

function CodeBlock({ id, code, language, title, onCopy, isCopied }: CodeBlockProps): JSX.Element {
  return (
    <div className="glassmorphism rounded-lg overflow-hidden">
      {title && (
        <div className="px-4 py-2 bg-secondary/50 border-b border-border/50 flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
          </span>
          <span className="text-xs text-muted-foreground font-mono">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 font-mono text-sm text-foreground overflow-x-auto">
          <code>{code}</code>
        </pre>
        <button
          onClick={() => onCopy(code, id)}
          className="absolute top-2 right-2 p-2 bg-secondary hover:bg-border rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={isCopied ? 'Copied' : 'Copy code'}
        >
          {isCopied ? (
            <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
