// File: apps/commitly-web/src/pages/AddProject.tsx

import { Check, Code, Terminal, Rocket, Plus } from 'lucide-react';

interface GitProvider {
  value: string;
  label: string;
}

interface Props {
  gitProviders?: GitProvider[];
  defaultGitHooksEnabled?: boolean;
  defaultCIEnabled?: boolean;
}

// Demo data - realistic git providers
const demoGitProviders: GitProvider[] = [
  { value: 'github', label: 'GitHub' },
  { value: 'gitlab', label: 'GitLab' },
  { value: 'bitbucket', label: 'Bitbucket' },
  { value: 'local', label: 'Local' },
];

export default function AddProject({
  gitProviders = demoGitProviders,
  defaultGitHooksEnabled = true,
  defaultCIEnabled = true,
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
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium bg-secondary text-foreground transition-colors"
            aria-current="page"
          >
            <Plus className="h-5 w-5" />
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
            <h2 className="text-2xl font-bold font-display text-foreground">Connect a Repository</h2>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Form Section - 2/3 width */}
              <div className="md:col-span-2">
                <div className="glassmorphism rounded-lg p-6">
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    {/* Repository URL Input */}
                    <div>
                      <label htmlFor="repo-url" className="block text-sm font-medium text-foreground mb-2">
                        Repository URL or Local Path
                      </label>
                      <input
                        type="text"
                        id="repo-url"
                        name="repo-url"
                        className="w-full bg-secondary border border-border text-foreground rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                        placeholder="https://github.com/user/repo.git or /path/to/local/repo"
                        aria-label="Repository URL or local path"
                      />
                    </div>

                    {/* Git Provider Select */}
                    <div>
                      <label htmlFor="git-provider" className="block text-sm font-medium text-foreground mb-2">
                        Git Provider
                      </label>
                      <select
                        id="git-provider"
                        name="git-provider"
                        className="w-full bg-secondary border border-border text-foreground rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                        aria-label="Select git provider"
                      >
                        {gitProviders.map((provider) => (
                          <option key={provider.value} value={provider.value}>
                            {provider.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Toggle Options */}
                    <div className="space-y-4 pt-2">
                      {/* Git Hooks Toggle */}
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">Enable Git Hooks</h4>
                          <p className="text-sm text-muted-foreground">
                            Automatically lint commit messages on `git commit`.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={defaultGitHooksEnabled}
                            aria-label="Enable git hooks"
                          />
                          <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      {/* CI/CD Pipeline Toggle */}
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">Enable CI/CD Pipeline Integration</h4>
                          <p className="text-sm text-muted-foreground">
                            Fail builds with non-compliant commit messages.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={defaultCIEnabled}
                            aria-label="Enable CI/CD pipeline integration"
                          />
                          <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-foreground after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Summary Section - 1/3 width */}
              <div className="md:col-span-1">
                <div className="glassmorphism rounded-lg p-6 flex flex-col h-full">
                  <h3 className="font-bold text-lg font-display text-foreground mb-4">Integration Summary</h3>

                  {/* Integration Status Items */}
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-start gap-3">
                      <Code className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">GitHub Repository</p>
                        <p className="text-xs text-muted-foreground">URL will be validated.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Terminal className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Git Hooks</p>
                        <p className="text-xs text-muted-foreground">
                          {defaultGitHooksEnabled ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Rocket className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">CI/CD Pipeline</p>
                        <p className="text-xs text-muted-foreground">{defaultCIEnabled ? 'Enabled' : 'Disabled'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      type="button"
                      className="w-full bg-primary text-primary-foreground font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Connect Project
                    </button>
                    <button
                      type="button"
                      className="w-full bg-secondary text-foreground font-bold py-2 px-4 rounded-md hover:bg-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

