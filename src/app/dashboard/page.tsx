import { ArrowRight, Users, Wallet, ShieldCheck, Globe, CheckCircle2, CircleDashed, AlertCircle } from 'lucide-react';
import { getDb, saveDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function verifyAndSeedDb() {
  const db = await getDb();
  if (db.employees.length === 0) {
    db.employees = [
      { id: '1', name: 'Sarah Jenkins', email: 'sarah@aurahr.com', role: 'CTO', location: 'USA', salary: 180000 },
      { id: '2', name: 'Michael Chen', email: 'michael@aurahr.com', role: 'Software Engineer', location: 'UK', salary: 110000 },
      { id: '3', name: 'Elena Rodriguez', email: 'elena@aurahr.com', role: 'VP People', location: 'Spain', salary: 150000 },
      { id: '4', name: 'David Smith', email: 'david@aurahr.com', role: 'Support Specialist', location: 'USA', salary: 65000 }
    ];
    db.activities = [
      { id: 'a1', employeeId: '1', action: 'Signed contractor agreement', status: 'Done', time: '2h ago' },
      { id: 'a2', employeeId: '2', action: 'Expense report #4029', status: 'Pending', time: '4h ago' },
      { id: 'a3', employeeId: '3', action: 'Visa renewal missing', status: 'Alert', time: '1d ago' },
      { id: 'a4', employeeId: '4', action: 'Onboarding complete', status: 'Done', time: '1d ago' }
    ];
    await saveDb(db);
    return db;
  }
  return db;
}

export default async function DashboardPage() {
  const db = await verifyAndSeedDb();
  
  // Fetch AI Summary from our internal route (mocking external API call)
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  let aiSummary = {
    title: "Payroll cycle for March is ready.",
    highlight: "Tax regulations in Germany updated.",
    body: "Your global payroll is expected to run smoothly. We've automatically adjusted German employee contracts to reflect the new local tax deductions.",
    highlightWord: "Germany"
  };
  
  try {
    const res = await fetch(`${baseUrl}/api/ai-summary`, { cache: 'no-store' });
    if (res.ok) {
      aiSummary = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch AI summary, using default mock.");
  }

  // Combine employees with their activities
  const recentActivities = db.activities.map(act => {
    const emp = db.employees.find(e => e.id === act.employeeId);
    return { ...act, employeeName: emp?.name || 'Unknown' };
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(140px,auto)]">
        
        {/* Hero AI Summary Card (col-span-2) */}
        <div className="bento-card p-6 lg:col-span-2 lg:row-span-2 bg-ink text-cream border-none flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="px-2 py-1 bg-gold/20 text-gold text-xs font-mono uppercase tracking-widest rounded-full">
                AI Summary
              </div>
            </div>
            <h2 className="font-serif text-2xl leading-tight mb-4">
              {aiSummary.title} <br/> 
              {aiSummary.highlight.replace(
                aiSummary.highlightWord || 'Germany', 
                `<span class="text-gold italic">${aiSummary.highlightWord || 'Germany'}</span>`
              ) && <span dangerouslySetInnerHTML={{ __html: aiSummary.highlight.replace(aiSummary.highlightWord || 'Germany', `<span class="text-gold italic">${aiSummary.highlightWord || 'Germany'}</span>`) }} />}
            </h2>
            <p className="font-sans text-cream/70 text-sm max-w-md">
              {aiSummary.body}
            </p>
          </div>

          {/* 7-bar Payroll Mini Chart */}
          <div className="mt-8 pt-6 border-t border-cream/10">
            <div className="flex items-end space-x-2 h-16 w-full max-w-xs">
              {[40, 60, 30, 80, 50, 90, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-cream/10 rounded-t-sm relative group hover:bg-gold/80 transition-colors" style={{ height: `${h}%` }}>
                  {i === 6 && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-gold whitespace-nowrap">₹ 1.2M</div>}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 font-mono text-[10px] text-cream/40 uppercase">
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>
          </div>
        </div>

        {/* Small Stat Cards */}
        <div className="bento-card p-6 bg-gold text-ink border-none flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <Users className="w-5 h-5 text-ink/60" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold">Total Emps</span>
          </div>
          <div>
            <div className="font-serif text-4xl mb-1">{db.employees.length === 0 ? "1,402" : `1,40${db.employees.length}`}</div>
            <div className="font-sans text-xs font-medium text-ink/70">+{db.employees.length} this month</div>
          </div>
        </div>

        <div className="bento-card p-6 bg-rust text-cream border-none flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <Wallet className="w-5 h-5 text-cream/60" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold">Processed</span>
          </div>
          <div>
            <div className="font-serif text-3xl mb-1">₹ 4.8M</div>
            <div className="font-sans text-xs font-medium text-cream/70">Q1 2026</div>
          </div>
        </div>

        {/* Compliance Score (calculated roughly from DB or static) */}
        <div className="bento-card p-6 bg-sage text-cream border-none flex flex-col justify-between items-center text-center relative overflow-hidden">
          <span className="absolute top-4 left-4 font-mono text-xs uppercase tracking-wider font-semibold text-cream/80">Compliance</span>
          <div className="relative w-24 h-24 mt-6 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="stroke-cream/20 stroke-[8] fill-none" />
              <circle cx="50" cy="50" r="40" className="stroke-cream stroke-[8] fill-none" strokeDasharray="251.2" strokeDashoffset="25.12" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-serif text-2xl">
              90%
            </div>
          </div>
          <div className="mt-4 font-sans text-xs text-cream/80 block">Global Score</div>
        </div>

        <div className="bento-card p-6 bg-cream border-ink/10 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <Globe className="w-5 h-5 text-ink/40" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-ink/60">Currencies</span>
          </div>
          <div>
            <div className="font-serif text-4xl mb-1 text-ink">154</div>
            <div className="font-sans text-xs font-medium text-ink/50">Active global markets</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activity List (col-span-2) */}
        <div className="bento-card p-6 lg:col-span-2 bg-cream">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl text-ink">Recent Activity</h3>
            <button className="text-sm font-sans text-ink/50 hover:text-ink">View all</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-warm-sand/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-ink/5 text-ink flex items-center justify-center font-serif text-sm">
                    {item.employeeName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-sm font-sans text-ink">{item.employeeName}</div>
                    <div className="text-xs text-ink/50 font-sans">{item.action} • {item.time}</div>
                  </div>
                </div>
                <div>
                  {item.status === 'Done' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold bg-sage/10 text-sage"><CheckCircle2 className="w-3 h-3 mr-1"/> Done</span>}
                  {item.status === 'Pending' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold bg-gold/20 text-[#91762b]"><CircleDashed className="w-3 h-3 mr-1"/> Pending</span>}
                  {item.status === 'Alert' && <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold bg-rust/10 text-rust"><AlertCircle className="w-3 h-3 mr-1"/> Alert</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Features */}
        <div className="flex flex-col gap-6">
          <div className="bento-card p-6 bg-warm-sand/50">
            <h3 className="font-serif text-xl text-ink mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {['Run Payroll', 'Add Employee', 'Generate Contract'].map((action) => (
                <button key={action} className="w-full flex items-center justify-between p-3 bg-cream border border-ink/10 text-ink rounded-xl hover:border-ink/30 transition-all text-sm font-sans font-medium group">
                  {action}
                  <ArrowRight className="w-4 h-4 text-ink/40 group-hover:text-ink" />
                </button>
              ))}
            </div>
          </div>

          <div className="bento-card p-6 bg-cream">
            <h3 className="font-serif text-xl text-ink mb-4">Active Modules</h3>
            <div className="flex flex-wrap gap-2">
              {['Core HR', 'Global Payroll', 'Compliance AI', 'Benefits', 'Insights', 'Time Tracking'].map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-ink/5 border border-ink/5 rounded-full text-xs font-mono text-ink/70">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
