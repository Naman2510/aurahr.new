"use client";

import { useState, useEffect } from 'react';
import { 
  GraduationCap, FileText, CheckCircle, Clock, Zap, 
  ArrowRight, ShieldCheck, Trophy, Brain, Loader2,
  ChevronRight, Sparkles, Send, ShieldAlert, Monitor, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import JitsiRoom from '@/components/features/Proctoring/JitsiRoom';
import IntegrityTimeline, { IntegrityEvent } from '@/components/features/CandidateSuite/IntegrityTimeline';

export default function AcademiaPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testView, setTestView] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Proctoring States
  const [proctoringEvents, setProctoringEvents] = useState<IntegrityEvent[]>([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Monitor tab switches
  useEffect(() => {
    if (!testView) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const violation: IntegrityEvent = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event: "Tab Switch Detected",
          type: "warning",
          icon: ShieldAlert,
          note: "Candidate left the assessment tab."
        };
        setProctoringEvents(prev => [...prev, violation]);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Initial success event
    setProctoringEvents([{
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: "Environment Secured",
      type: "success",
      icon: ShieldCheck,
      note: "Proctoring & Eye-tracking active."
    }]);

    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [testView]);

  const fetchCandidates = async () => {
    const res = await fetch('/api/candidates');
    const d = await res.json();
    setCandidates(d.candidates || []);
  };

  const handleGenerate = async (c: any) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/recruitment/academia/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: c.id, role: c.role })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedCandidate({ ...c, academicAssessment: { questions: data.questions } });
        setCurrentQuestions(data.questions);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCandidate) return;
    setIsSubmitting(true);
    try {
      const submissions = Object.entries(answers).map(([id, ans]) => ({ questionId: id, answer: ans }));
      const res = await fetch('/api/recruitment/academia/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          candidateId: selectedCandidate.id, 
          submissions,
          proctoringSignals: proctoringEvents 
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Assessment Completed! Score: ${data.totalScore}`);
        setTestView(false);
        fetchCandidates();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0C0A] text-cream font-sans p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <span className="text-xs font-mono font-bold tracking-[0.2em] text-gold/70 uppercase mb-2 block">CANDIDATE SUITE · ACADEMIA ROUND</span>
          <h1 className="text-4xl font-serif text-white tracking-tight">Academic <span className="text-gold italic">Assessment</span></h1>
        </div>
        <button 
          onClick={() => window.history.back()}
          className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-xl text-xs font-mono font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-white/60 text-[10px]"
        >
          Back to Recruitment
        </button>
      </div>

      {!testView ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif text-2xl text-white mb-6 flex items-center">
              <GraduationCap className="text-gold w-6 h-6 mr-3" />
              Eligible Candidates
            </h3>
            {candidates.filter(c => c.status === 'Applied').map((c) => (
              <div key={c.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between hover:border-gold/30 transition-all group">
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center font-serif font-bold text-gold text-xl">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-white group-hover:text-gold transition-colors">{c.name}</h4>
                    <p className="text-xs text-white/40 font-mono italic">{c.role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-[10px]">
                  {c.academicAssessment ? (
                    <button 
                      onClick={() => { setSelectedCandidate(c); setCurrentQuestions(c.academicAssessment.questions); setTestView(true); }}
                      className="bg-gold text-ink px-5 py-2 rounded-xl font-bold hover:bg-gold/90 transition-all flex items-center uppercase tracking-widest"
                    >
                      <Zap className="w-4 h-4 mr-2" /> Start Test
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleGenerate(c)}
                      disabled={isGenerating}
                      className="bg-white/5 border border-white/20 text-white/60 px-5 py-2 rounded-xl font-bold hover:border-gold/50 hover:text-gold transition-all uppercase tracking-widest"
                    >
                      {isGenerating ? <Loader2 className="animate-spin w-4 h-4" /> : 'Generate Paper'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gold/5 border border-gold/10 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Brain className="w-32 h-32 text-gold" /></div>
              <h4 className="text-xs font-mono font-bold text-gold uppercase tracking-widest mb-6">Proctoring Intelligence</h4>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Academia rounds are live-proctored. Any attempts to switch tabs or lose focus will be flagged in the integrity matrix.
              </p>
              <ul className="space-y-4 text-sm text-white/80">
                <li className="flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-gold" /> Real-time Video Monitoring</li>
                <li className="flex items-center gap-3"><Monitor className="w-4 h-4 text-gold" /> Tab-Activity tracking</li>
                <li className="flex items-center gap-3"><Eye className="w-4 h-4 text-gold" /> Neural Attention Score</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-10 opacity-5"><FileText className="w-48 h-48 text-gold" /></div>
                
                <div className="mb-10 pb-10 border-b border-white/5 flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-serif text-white mb-2">{selectedCandidate?.name}</h2>
                    <p className="text-gold font-mono text-xs tracking-widest uppercase italic">{selectedCandidate?.role} Technical Assessment</p>
                  </div>
                  <div className="flex items-center gap-3 bg-red-950/20 border border-red-500/20 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">Live Proctoring In Effect</span>
                  </div>
                </div>

                <div className="space-y-10">
                  {currentQuestions.map((q, i) => (
                    <div key={q.id} className="space-y-4 bg-white/5 p-8 rounded-2xl border border-white/5">
                      <div className="flex items-start gap-4">
                        <span className="bg-gold text-ink w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">{i+1}</span>
                        <h3 className="text-lg text-white/90 leading-relaxed font-medium">{q.question}</h3>
                      </div>

                      {q.type === 'mcq' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          {q.options?.map((opt: string) => (
                            <button 
                              key={opt}
                              onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                              className={`p-4 rounded-xl border text-sm text-left transition-all ${answers[q.id] === opt ? 'bg-gold/20 border-gold text-gold shadow-[0_0_15px_rgba(200,168,75,0.2)]' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <textarea 
                          onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                          placeholder="Type your technical response here..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-gold/40 h-32 mt-4"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-12 flex justify-end gap-4">
                  <button 
                    onClick={() => setTestView(false)}
                    className="px-8 py-3 rounded-xl border border-white/10 text-white/40 hover:text-white/70 transition-all font-bold text-[10px] uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || Object.keys(answers).length < currentQuestions.length}
                    className="bg-gold text-ink px-10 py-3 rounded-xl text-sm font-bold hover:bg-gold/90 transition-all flex items-center shadow-[0_0_30px_rgba(200,168,75,0.3)] disabled:opacity-40"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <><Send className="w-4 h-4 mr-2" /> Submit Paper</>}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Side Proctoring View */}
          <div className="lg:col-span-1 space-y-6">
            <div className="h-[280px]">
              <JitsiRoom roomName={`ACADEMIA-${selectedCandidate?.id}`} userName={selectedCandidate?.name || 'Applicant'} />
            </div>
            <IntegrityTimeline events={proctoringEvents} />
          </div>
        </div>
      )}
    </div>
  );
}
