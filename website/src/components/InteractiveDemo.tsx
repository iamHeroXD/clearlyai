import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Check, Volume2, Copy, Bookmark, ExternalLink, RefreshCw,
  CornerDownLeft, Zap, ArrowRight, Shield, Lightbulb, FileText, Code2, Briefcase, Flame, Wand2
} from 'lucide-react';
import { sound } from '../utils/sound';

interface DemoSample {
  id: string;
  category: string;
  icon: any;
  title: string;
  context: string;
  highlightText: string;
  defaultMode: 'simple' | 'eli5' | 'grammar' | 'formal' | 'code' | 'sarcastic';
  responses: Record<string, {
    phonetic?: string;
    summary: string;
    rewrittenText?: string;
    bullets?: string[];
    isWriting?: boolean;
  }>;
}

const DEMO_SAMPLES: DemoSample[] = [
  {
    id: 'email',
    category: 'Executive Email & Writing',
    icon: Briefcase,
    title: 'Messy Draft Email',
    context: 'Hey team, just wanted to check if you guys saw the thing I sent yesterday. We really gotta push this live ASAP or the client gonna get mad af and cancel the contract. Lmk when done.',
    highlightText: 'Hey team, just wanted to check if you guys saw the thing I sent yesterday. We really gotta push this live ASAP or the client gonna get mad af and cancel the contract. Lmk when done.',
    defaultMode: 'formal',
    responses: {
      formal: {
        summary: 'Polished for executive leadership with respectful urgency.',
        rewrittenText: 'Hi team, following up on yesterday\'s deliverables. Meeting our upcoming launch timeline is critical to maintaining client confidence. Please let me know your estimated completion time.',
        bullets: ['Removed informal abbreviations (ASAP, Lmk, af)', 'Reframed panic into maintaining confidence', 'Added a clear, polite call-to-action'],
        isWriting: true,
      },
      grammar: {
        summary: 'Grammatically corrected while keeping casual tone.',
        rewrittenText: 'Hey team, I just wanted to check if you saw what I sent yesterday. We really need to push this live as soon as possible, or the client might cancel the contract. Let me know when it\'s done.',
        bullets: ['Fixed "gotta" to "need to"', 'Replaced slang with standard phrasing', 'Fixed punctuation and subject-verb agreement'],
        isWriting: true,
      },
      sarcastic: {
        summary: 'Brutally honest translation of executive panic.',
        rewrittenText: 'Greetings colleagues! I am in a state of sheer panic because I over-promised to the client. Please drop all your personal weekend plans and finish this right now so I don\'t look bad.',
        bullets: ['Subtext: Panic level is 10/10', 'Root cause: Poor planning presented as emergency', 'Action needed: Save the manager'],
        isWriting: true,
      }
    }
  },
  {
    id: 'physics',
    category: 'Quantum Physics & Science',
    icon: Lightbulb,
    title: 'Quantum Teleportation',
    context: 'In quantum entanglement, two or more particles become interconnected such that the quantum state of each particle cannot be described independently of the state of the others, regardless of spatial separation distance.',
    highlightText: 'quantum entanglement',
    defaultMode: 'eli5',
    responses: {
      eli5: {
        phonetic: '/ˈkwɒn.təm ɪnˈtæŋ.ɡəl.mənt/',
        summary: 'Imagine two magic dice. Even if you take one die to Mars and keep one on Earth, whenever you roll a 6 on Earth, the Mars die instantly lands on a 6 at the exact same split second.',
        bullets: [
          'Two particles share a linked destiny',
          'Changing one instantly affects the other across any cosmic distance',
          'Einstein famously nicknamed it "spooky action at a distance"'
        ]
      },
      simple: {
        phonetic: '/ˈkwɒn.təm ɪnˈtæŋ.ɡəl.mənt/',
        summary: 'A physical phenomenon where pairs of particles interact in ways such that the quantum state of each cannot be measured independently.',
        bullets: [
          'Key principle behind quantum computing & quantum encryption',
          'Information link occurs faster than the speed of light'
        ]
      },
      sarcastic: {
        phonetic: '/ˈkwɒn.təm ɪnˈtæŋ.ɡəl.mənt/',
        summary: 'The universe\'s WiFi connection that mysteriously works with 0ms ping across galaxies while your home router struggles to load a PDF in the next room.',
        bullets: ['Distance doesn\'t matter', 'Physics professors use it to sound mysterious', 'Your router could never']
      }
    }
  },
  {
    id: 'code',
    category: 'Software Engineering',
    icon: Code2,
    title: 'Python Async Generator',
    context: 'async def stream_tokens(api_stream):\n    async for chunk in api_stream:\n        if chunk.choices[0].delta.content:\n            yield chunk.choices[0].delta.content',
    highlightText: 'async for chunk in api_stream:\n    yield chunk.choices[0].delta.content',
    defaultMode: 'code',
    responses: {
      code: {
        summary: 'Asynchronously iterates over a streaming LLM response, yielding individual generated text tokens to the UI as they arrive over the network without blocking the thread.',
        bullets: [
          'async for: Non-blocking asynchronous iteration',
          'yield: Returns each token incrementally as a stream',
          'Prevents freezing the application while waiting for full AI responses'
        ]
      },
      simple: {
        summary: 'Streams words one by one as the AI thinks them, instead of waiting 10 seconds for the full paragraph.',
        bullets: ['Non-blocking network pipeline', 'Essential for responsive real-time chat UIs']
      },
      eli5: {
        summary: 'Like getting your popcorn one handful at a time straight from the microwave, instead of waiting for the entire giant bowl to finish popping.',
        bullets: ['Zero waiting for the first word', 'Smooth, continuous delivery']
      }
    }
  },
  {
    id: 'legal',
    category: 'Legal Contract Review',
    icon: Shield,
    title: 'Cryptic Terms of Service',
    context: 'By accessing the service, user grants Licensor an irrevocable, perpetual, worldwide, transferable, royalty-free license to reproduce, distribute, adapt, publicly display, and monetize any user-generated content or derivative works.',
    highlightText: 'irrevocable, perpetual, worldwide, transferable, royalty-free license to reproduce, distribute, adapt, publicly display, and monetize any user-generated content',
    defaultMode: 'simple',
    responses: {
      simple: {
        summary: '⚠️ High Risk Clause: You give them total, permanent ownership rights to use, edit, sell, or advertise with your content forever without paying you a dime.',
        bullets: [
          'Perpetual: Forever, even if you delete your account',
          'Royalty-free: They will never pay you',
          'Transferable: They can sell your content to third-party advertisers'
        ]
      },
      eli5: {
        summary: 'You upload a cool drawing. They can print it on 10,000 t-shirts, sell them in Japan, make \$1,000,000, and give you zero dollars. And you can never ask them to stop.',
        bullets: ['You lose all commercial control', 'Account deletion does not revoke their license']
      },
      sarcastic: {
        summary: 'Congratulations! What\'s yours is now theirs, and what\'s theirs is strictly proprietary. Thanks for doing unpaid product development for our shareholders.',
        bullets: ['Your copyright: Gone', 'Your compensation: \$0.00', 'Their profit: Infinite']
      }
    }
  }
];

const MODES = [
  { id: 'simple', label: 'Simple', icon: '✨' },
  { id: 'eli5', label: 'ELI5', icon: '👶' },
  { id: 'grammar', label: 'Grammar', icon: '✍️' },
  { id: 'formal', label: 'Professional', icon: '👔' },
  { id: 'code', label: 'Code', icon: '💻' },
  { id: 'sarcastic', label: 'Roast', icon: '🔥' },
];

export const InteractiveDemo: React.FC = () => {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const sample = DEMO_SAMPLES[selectedSampleIndex];
  const [activeMode, setActiveMode] = useState<string>(sample.defaultMode);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [replaced, setReplaced] = useState(false);
  const [displayText, setDisplayText] = useState(sample.context);
  const [isTyping, setIsTyping] = useState(false);

  // 3D Tilt Ref & State
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setActiveMode(sample.defaultMode);
    setDisplayText(sample.context);
    setReplaced(false);
  }, [selectedSampleIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const activeResponse = sample.responses[activeMode] || sample.responses[sample.defaultMode] || {
    summary: 'Instantly deconstructs the selected text into crystal clear meaning.',
    bullets: ['Instant latency', 'Clean liquid glass UI']
  };

  const handleModeChange = (modeId: string) => {
    sound.playModeSwitch();
    setActiveMode(modeId);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 200);
  };

  const handleSpeak = () => {
    sound.playClick();
    if ('speechSynthesis' in window) {
      setIsPlayingAudio(true);
      const textToSpeak = activeResponse.rewrittenText || activeResponse.summary;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = () => {
    sound.playSuccess();
    const textToCopy = activeResponse.rewrittenText || activeResponse.summary;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReplace = () => {
    if (activeResponse.rewrittenText) {
      sound.playSuccess();
      setDisplayText(activeResponse.rewrittenText);
      setReplaced(true);
      setTimeout(() => setReplaced(false), 3500);
    }
  };

  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive 3D Extension Sandbox</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
            See the Liquid Glass UI in action.
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-xl leading-relaxed">
            Click any scenario below or switch explanation modes to watch how Clearly clarifies and rewrites text in real-time.
          </p>
        </div>

        {/* Sample Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {DEMO_SAMPLES.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = idx === selectedSampleIndex;
            return (
              <button
                key={s.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedSampleIndex(idx);
                }}
                className={`flex items-center space-x-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 via-cyan-600 to-purple-600 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] scale-105 border border-white/20'
                    : 'bg-[#0a0d18] hover:bg-[#12172a] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <Icon className="w-4 h-4 text-cyan-300" />
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* 3D Browser Mockup Frame */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
          className="relative rounded-3xl bg-[#03050a]/95 border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden backdrop-blur-3xl"
        >
          {/* Top Browser Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#0a0d1a] border-b border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500/90 shadow-[0_0_8px_#f43f5e]" />
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500/90 shadow-[0_0_8px_#f59e0b]" />
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/90 shadow-[0_0_8px_#10b981]" />
            </div>

            {/* URL Search Bar */}
            <div className="flex-1 max-w-lg mx-4 px-4 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-300 flex items-center justify-between font-mono">
              <span className="truncate flex items-center space-x-2">
                <span className="text-cyan-400">🔒</span>
                <span>https://learn.clearly.ai/{sample.id}</span>
              </span>
              <RefreshCw 
                onClick={() => { sound.playClick(); setDisplayText(sample.context); setReplaced(false); }}
                className="w-3.5 h-3.5 text-slate-400 hover:text-cyan-300 cursor-pointer transition-colors" 
              />
            </div>

            <div className="flex items-center space-x-2">
              <div className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Extension Active</span>
              </div>
            </div>
          </div>

          {/* Webpage Content Body */}
          <div className="p-6 sm:p-12 min-h-[500px] relative bg-gradient-to-b from-[#060810] via-[#04050a] to-[#020306] flex flex-col justify-between">
            
            {/* Mock Article Container */}
            <div className="max-w-3xl mx-auto w-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 font-mono">
                  // {sample.category}
                </span>
                {replaced && (
                  <span className="flex items-center space-x-1.5 text-xs text-emerald-300 font-bold bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 animate-bounce shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <Check className="w-3.5 h-3.5" />
                    <span>Replaced in-place!</span>
                  </span>
                )}
              </div>

              {/* Sample Content Box with Highlight */}
              <div className="p-7 rounded-2xl bg-white/[0.02] border border-white/10 relative transition-all shadow-inner">
                <p className="text-base sm:text-xl leading-relaxed text-slate-200 font-sans">
                  {displayText.split(sample.highlightText).map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <mark className="bg-gradient-to-r from-cyan-500/40 to-indigo-500/40 text-white px-2 py-0.5 rounded-md border border-cyan-400/50 font-semibold shadow-[0_0_20px_rgba(6,182,212,0.5)] animate-pulse">
                          {sample.highlightText}
                        </mark>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-2 font-mono">
                <span>💡 Clearly activates automatically upon text selection</span>
                <span>Press Esc to close</span>
              </div>
            </div>

            {/* FLOATING LIQUID GLASS PILL & EXPLANATION CARD (Simulated Extension) */}
            <div className="mt-8 max-w-2xl mx-auto w-full relative z-20">
              <div className="glass-pill rounded-3xl p-6 border border-cyan-500/30 shadow-[0_25px_80px_rgba(0,0,0,0.95)] backdrop-blur-3xl transition-all duration-300">
                
                {/* Mode Selector Tabs inside the pill */}
                <div className="flex items-center justify-between gap-1 pb-4 mb-4 border-b border-white/10 overflow-x-auto">
                  <div className="flex items-center space-x-1.5">
                    {MODES.map((m) => {
                      const isActive = activeMode === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => handleModeChange(m.id)}
                          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                          }`}
                        >
                          <span>{m.icon}</span>
                          <span>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>0ms Nano</span>
                  </div>
                </div>

                {/* Phonetics & Header */}
                {activeResponse.phonetic && (
                  <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300 mb-3">
                    <button
                      onClick={handleSpeak}
                      className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors"
                      title="Pronounce"
                    >
                      <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-cyan-200' : ''}`} />
                    </button>
                    <span>{activeResponse.phonetic}</span>
                  </div>
                )}

                {/* Summary / Rewritten Output */}
                <div className="mb-4">
                  {activeResponse.rewrittenText ? (
                    <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-100 text-sm sm:text-base leading-relaxed font-medium">
                      <div className="text-[10px] uppercase font-mono font-bold text-cyan-400 tracking-wider mb-1.5">
                        // REWRITTEN OUTPUT:
                      </div>
                      "{activeResponse.rewrittenText}"
                    </div>
                  ) : (
                    <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-normal">
                      {activeResponse.summary}
                    </p>
                  )}
                </div>

                {/* Bullets Breakdown */}
                {activeResponse.bullets && activeResponse.bullets.length > 0 && (
                  <div className="space-y-2 mb-5 pl-1">
                    {activeResponse.bullets.map((b, idx) => (
                      <div key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300">
                        <span className="text-cyan-400 font-bold mt-0.5">•</span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom Card Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                  <div className="flex items-center space-x-2.5">
                    {activeResponse.rewrittenText && (
                      <button
                        onClick={handleReplace}
                        className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold transition-all shadow-[0_0_18px_rgba(16,185,129,0.35)] hover:scale-105 active:scale-95"
                      >
                        <CornerDownLeft className="w-4 h-4" />
                        <span>Replace text</span>
                      </button>
                    )}

                    <button
                      onClick={handleCopy}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/5 font-semibold"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-400 text-xs font-mono">
                    <span className="hover:text-cyan-300 cursor-pointer transition-colors">⭐ Star Word</span>
                    <span className="text-slate-700">|</span>
                    <span className="text-slate-500">Clearly v1.0</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
