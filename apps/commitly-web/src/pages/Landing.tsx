// File: apps/commitly-web/src/pages/Landing.tsx

import { Check, Code, GitBranch, Sparkles, Terminal, Github, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  projectName?: string;
  githubUrl?: string;
}

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Code className="h-6 w-6" />,
    title: 'Smart Parsing',
    description: 'Automatically parse type(scope): subject structure and validate against Conventional Commits standards',
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: 'Auto-Fix Magic',
    description: 'Intelligent suggestions fix casing, trailing periods, line wrapping, and even infer commit types',
  },
  {
    icon: <Terminal className="h-6 w-6" />,
    title: 'CLI & Web Playground',
    description: 'Fast CLI for git hooks and CI/CD, plus a sleek web playground for interactive testing',
  },
  {
    icon: <GitBranch className="h-6 w-6" />,
    title: 'Git Hook Integration',
    description: 'Block bad commits at the source with seamless git hook integration and real-time validation',
  },
];

export default function Landing({ projectName = 'Commitly', githubUrl = 'https://github.com/yourusername/commitly' }: Props): JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold font-display text-foreground">{projectName}</h1>
          </div>
          
          <nav className="flex items-center gap-4" role="navigation" aria-label="Main navigation">
            <a
              href="/playground"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Playground
            </a>
            <a
              href="/docs"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </a>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-24">
        <section className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              <span>Clean commits, every time</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold font-display text-foreground mb-6 text-balance">
              Lint & Auto-Fix Your{' '}
              <span className="text-primary">Commit Messages</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
              Enforce consistent commit message formats with Conventional Commits. 
              Catch mistakes before they reach your repo and generate clean changelogs automatically.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="primary" size="lg" asChild>
                <a href="/playground" className="inline-flex items-center gap-2">
                  Try Playground
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
            </div>

            {/* Demo Example */}
            <div className="mt-16 glassmorphism rounded-lg p-6 max-w-2xl mx-auto">
              <div className="text-left space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Before & After</span>
                </div>
                <div className="bg-destructive/10 rounded-md p-3 font-mono text-sm text-destructive border-l-4 border-destructive">
                  <span className="text-muted-foreground select-none">- </span>
                  Fixed login bug.
                </div>
                <div className="bg-success/10 rounded-md p-3 font-mono text-sm text-success border-l-4 border-success">
                  <span className="text-muted-foreground select-none">+ </span>
                  fix(auth): resolve login redirect issue
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-6 py-20 bg-card/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold font-display text-foreground mb-4">
                Everything You Need for Clean Commits
              </h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Powerful features to help your team maintain a pristine commit history
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} glass>
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CLI Example Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold font-display text-foreground mb-4">
                Install Once, Validate Forever
              </h3>
              <p className="text-muted-foreground text-lg">
                Add git hooks in seconds and never worry about bad commits again
              </p>
            </div>
            
            <div className="glassmorphism rounded-lg overflow-hidden">
              <div className="bg-secondary/50 px-4 py-2 border-b border-border/50 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Terminal</span>
                <span className="text-xs text-muted-foreground font-mono">bash</span>
              </div>
              <div className="p-6 font-mono text-sm">
                <div className="space-y-2">
                  <div>
                    <span className="text-success">$</span>{' '}
                    <span className="text-foreground">pnpm add -D @commitly/cli</span>
                  </div>
                  <div>
                    <span className="text-success">$</span>{' '}
                    <span className="text-foreground">commitly init-hooks</span>
                  </div>
                  <div className="text-muted-foreground">✓ Git hooks installed successfully</div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-warning/10 border-l-4 border-warning rounded-r-md">
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-foreground text-sm font-medium">Pro Tip</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Try the web playground first to see how your commit messages will be validated
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto glassmorphism rounded-lg p-12 text-center">
            <h3 className="text-4xl font-bold font-display text-foreground mb-4">
              Ready to Clean Up Your Commits?
            </h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Start with the interactive playground or jump straight to the CLI
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="primary" size="lg" asChild>
                <a href="/playground" className="inline-flex items-center gap-2">
                  Open Playground
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/docs">Read Documentation</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Built with ❤️ for better commit messages
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </a>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="/playground" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Playground
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

