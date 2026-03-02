import { Sparkles, MessageSquare, User, Bot } from 'lucide-react';

const SocialKit = () => {
  return (
    <div className="min-h-screen bg-neutral-500 flex items-center justify-center p-8">
      {/* OG Image Container - Exact 1200x630 dimensions */}
      <div 
        className="relative overflow-hidden"
        style={{ width: '1200px', height: '630px' }}
      >
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        
        {/* Grid texture overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />
        
        {/* Gradient orbs for depth */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
        
        {/* Main content */}
        <div className="relative h-full flex items-center justify-between px-16">
          {/* Left side - Logo and tagline */}
          <div className="flex-1 max-w-xl">
            {/* Logo */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-cyan-500 shadow-2xl shadow-primary/30">
                <Sparkles className="h-9 w-9 text-white" />
              </div>
              <span className="text-5xl font-bold text-white tracking-tight">
                Foliogen
              </span>
            </div>
            
            {/* Tagline */}
            <h1 className="text-4xl font-semibold text-white/90 leading-tight mb-6">
              The AI-Powered
              <br />
              <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-transparent">
                Portfolio Builder
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-white/50 max-w-md">
              Transform your resume into an intelligent, 
              recruiter-ready portfolio in minutes.
            </p>
          </div>
          
          {/* Right side - Floating glass card with mock chat */}
          <div className="relative">
            {/* Glow effect behind card */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-cyan-500/30 blur-2xl scale-110" />
            
            {/* Glass card */}
            <div 
              className="relative w-80 rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset'
              }}
            >
              {/* Card header */}
              <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Chat with Resume</p>
                  <p className="text-xs text-white/40">AI-powered Q&A</p>
                </div>
              </div>
              
              {/* Mock chat messages */}
              <div className="p-5 space-y-4">
                {/* User message */}
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <User className="h-3.5 w-3.5 text-white/60" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white/40 mb-1">Recruiter</p>
                    <div className="bg-white/5 rounded-xl rounded-tl-sm px-3 py-2">
                      <p className="text-sm text-white/80">
                        What's their experience with React?
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* AI response */}
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan-500">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-white/40 mb-1">AI Assistant</p>
                    <div className="bg-primary/10 border border-primary/20 rounded-xl rounded-tl-sm px-3 py-2">
                      <p className="text-sm text-white/90">
                        5+ years building production apps with React, Next.js, and TypeScript...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Typing indicator */}
              <div className="px-5 pb-4">
                <div className="flex items-center gap-1.5 text-white/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-sm text-white/30 tracking-wide">
            Built with AI • <span className="text-white/50">foliogen.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialKit;
