import Link from 'next/link';
import { Search, Bell } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-warm-sand flex">
      {/* Sidebar Component */}
      <Sidebar />

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
