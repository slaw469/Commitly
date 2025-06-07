import React, { useState } from 'react';
import { 
  Brain, 
  Clock, 
  Zap, 
  Target, 
  Chrome, 
  Github, 
  FileText, 
  Calendar,
  ArrowRight,
  CheckCircle,
  Play,
  Star,
  Users,
  TrendingUp,
  Shield,
  Sparkles
} from 'lucide-react';
import { ModeToggle } from './mode-toggle';

interface LandingPageProps {
  onLogin: () => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Session Summaries',
      description: 'Get instant context on what you were working on with intelligent summaries of your previous session.',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: Zap,
      title: 'Zero Context Switching',
      description: 'Resume work instantly with suggested next steps and automatically restored workspace state.',
      color: 'from-accent-500 to-accent-600'
    },
    {
      icon: Target,
      title: 'Smart Focus Tracking',
      description: 'Automatically track your focus sessions and identify patterns in your most productive work.',
      color: 'from-success-500 to-success-600'
    },
    {
      icon: Chrome,
      title: 'Browser Extension',
      description: 'Seamlessly capture your browsing context, tabs, and workflow without any manual input.',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const integrations = [
    { name: 'GitHub', icon: Github, description: 'Track commits and PRs' },
    { name: 'Notion', icon: FileText, description: 'Sync notes and tasks' },
    { name: 'Calendar', icon: Calendar, description: 'Align with meetings' },
    { name: 'Chrome', icon: Chrome, description: 'Browser tracking' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Developer',
      company: 'TechCorp',
      content: 'AI Time Doubler has completely transformed how I work. I save at least 30 minutes every day just from not having to remember where I left off.',
      avatar: 'SC'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Product Manager',
      company: 'StartupXYZ',
      content: 'The AI summaries are incredibly accurate. It feels like having a personal assistant that never forgets what I was working on.',
      avatar: 'MR'
    },
    {
      name: 'Emily Watson',
      role: 'UX Designer',
      company: 'DesignStudio',
      content: 'Finally, a tool that understands my chaotic workflow. The session tracking is seamless and the insights are genuinely helpful.',
      avatar: 'EW'
    }
  ];

  const stats = [
    { value: '2.5x', label: 'Productivity Boost', icon: TrendingUp },
    { value: '47min', label: 'Daily Time Saved', icon: Clock },
    { value: '10k+', label: 'Active Users', icon: Users },
    { value: '98%', label: 'User Satisfaction', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                <Brain size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Time Doubler</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Remember where you left off</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
                Features
              </button>
              <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
                About
              </button>
              <ModeToggle />
              <button 
                onClick={onLogin}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-200 font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>Now with GPT-4 powered summaries</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Double Your
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent"> Focus Time</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Never lose your train of thought again. AI Time Doubler automatically captures your work context and provides intelligent summaries, so you can instantly remember where you left off and dive back in.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 sm:w-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button 
                  onClick={onLogin}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-200 font-medium flex items-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-success-500" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-success-500" />
                <span>No registration required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={16} className="text-success-500" />
                <span>Open source</span>
              </div>
            </div>
          </div>

          {/* Demo Video/Screenshot */}
          <div className="relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r from-primary-500 to-accent-500 p-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
                  <button className="flex items-center space-x-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                    <Play size={20} className="text-primary-500" />
                    <span className="font-medium text-gray-900 dark:text-white">Watch Demo (2 min)</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 animate-pulse-soft">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Session Active</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">47min</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Time Saved Today</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl mb-4">
                    <Icon size={20} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to stay focused
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our AI-powered platform helps you remember where you left off and quickly get back into the zone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} text-white rounded-xl mb-6`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/10 dark:to-accent-900/10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Seamless integrations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Connect with the tools you already use to create a unified productivity experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {integrations.map((integration, index) => {
              const Icon = integration.icon;
              return (
                <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white dark:hover:bg-gray-700 transition-all duration-200">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl mb-4">
                    <Icon size={24} className="text-gray-700 dark:text-gray-300" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{integration.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{integration.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by productivity enthusiasts
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how AI Time Doubler is transforming the way people work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to double your productivity?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Start using AI Time Doubler today and never lose track of where you left off again.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-80 px-4 py-3 rounded-lg focus:ring-2 focus:ring-white focus:outline-none text-gray-900"
            />
            <button 
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-primary-100">
            <div className="flex items-center space-x-2">
              <Shield size={16} />
              <span>Privacy focused</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} />
              <span>Open source</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                  <Brain size={20} />
                </div>
                <span className="text-lg font-bold">AI Time Doubler</span>
              </div>
              <p className="text-gray-400">
                Remember where you left off and get back into the zone faster with AI-powered session management.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Browser Extension</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 dark:border-gray-700 pt-8 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-gray-400">© 2024 AI Time Doubler. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}