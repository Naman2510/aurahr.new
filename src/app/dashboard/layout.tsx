import Link from 'next/link';
import { Home, CreditCard, ShieldCheck, Users, BarChart3, Settings, Search, Bell } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-warm-sand flex">
      {/* Sidebar */}
      <aside className="w-64 bg-cream border-r border-ink/10 hidden md:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-ink/10 shrink-0">
          <Link href="/" className="font-serif text-2xl font-bold text-ink tracking-tight">
            Aura<span className="text-gold">HR</span>
          </Link>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {[
            { name: 'Overview', icon: Home, active: false, href: '/dashboard' },
            { name: 'Recruitment', icon: Users, active: false, href: '/dashboard/recruitment' },
            { name: 'Payroll', icon: CreditCard, active: false, href: '/dashboard/payroll' },
            { name: 'Compliance', icon: ShieldCheck, active: false, href: '/dashboard/compliance' },
            { name: 'Employees', icon: Users, active: false, href: '/dashboard/employees' },
            { name: 'Reports', icon: BarChart3, active: false, href: '/dashboard/reports' },
            { name: 'Settings', icon: Settings, active: false, href: '/dashboard/settings' },
          ].map((item) => (
            <Link key={item.name} href={item.href || '#'} className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors ${item.active ? 'bg-ink text-cream' : 'text-ink/70 hover:bg-ink/5 hover:text-ink'}`}>
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-ink/10">
          <div className="bg-sage/10 text-sage px-4 py-3 rounded-lg flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
            <span className="font-sans text-xs font-semibold">Systems Operational</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-cream/50 backdrop-blur-sm border-b border-ink/10 flex items-center justify-between px-6 shrink-0">
          <h1 className="font-serif text-2xl font-medium text-ink hidden sm:block">Overview</h1>
          
          <div className="flex-1 max-w-md mx-4 sm:mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
              <input 
                type="text" 
                placeholder="Search employees, payroll, docs..." 
                className="w-full bg-warm-sand border border-ink/10 rounded-full pl-10 pr-4 py-2 text-sm font-sans focus:outline-none focus:border-ink/30 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative text-ink/60 hover:text-ink transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-rust rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-ink text-cream flex items-center justify-center font-serif text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
}
