"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  Home, CreditCard, ShieldCheck, Users, Settings, 
  Eye, Calendar, ChevronDown, LayoutGrid, Building2
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const [isRecruitmentOpen, setIsRecruitmentOpen] = useState(true);

  const isActive = (href: string) => pathname === href;

  const standardClass = "flex items-center space-x-3 px-3 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors ";
  const activeClass = "bg-ink text-cream";
  const inactiveClass = "text-ink/70 hover:bg-ink/5 hover:text-ink";

  return (
    <aside className="w-64 bg-cream border-r border-ink/10 hidden md:flex flex-col">
      <div className="h-20 flex items-center px-6 border-b border-ink/10 shrink-0">
        <Link href="/" className="font-serif text-2xl font-bold text-ink tracking-tight">
          Aura<span className="text-gold">HR</span>
        </Link>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        
        {/* Top-level Overview */}
        <Link href="/dashboard" className={`${standardClass} ${isActive('/dashboard') ? activeClass : inactiveClass}`}>
          <Home className="w-5 h-5" />
          <span>Overview</span>
        </Link>

        {/* Recruitments Dropdown */}
        <div className="pt-2 pb-1">
          <button 
            onClick={() => setIsRecruitmentOpen(!isRecruitmentOpen)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors ${
              (pathname.includes('/dashboard/recruitment') || pathname.includes('/dashboard/proctoring') || pathname.includes('/dashboard/scheduling')) && !isRecruitmentOpen
                ? 'bg-ink/5 text-ink'
                : 'text-ink/70 hover:bg-ink/5 hover:text-ink'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-rust" />
              <span>Recruitments</span>
            </div>
            <motion.div
              animate={{ rotate: isRecruitmentOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 opacity-50" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isRecruitmentOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-1 ml-4 pl-4 border-l-2 border-ink/10 flex flex-col space-y-1">
                  <Link href="/dashboard/recruitment" className={`${standardClass} ${isActive('/dashboard/recruitment') ? activeClass : inactiveClass}`}>
                    <LayoutGrid className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/dashboard/proctoring" className={`${standardClass} ${isActive('/dashboard/proctoring') ? activeClass : inactiveClass}`}>
                    <Eye className="w-4 h-4 text-sage" />
                    <span>Interview Room</span>
                  </Link>
                  <Link href="/dashboard/scheduling" className={`${standardClass} ${isActive('/dashboard/scheduling') ? activeClass : inactiveClass}`}>
                    <Calendar className="w-4 h-4 text-gold" />
                    <span>Smart Scheduler</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Other Top Level Tools */}
        <div className="pt-2 space-y-1">
          <Link href="/dashboard/employees" className={`${standardClass} ${isActive('/dashboard/employees') ? activeClass : inactiveClass}`}>
            <Building2 className="w-5 h-5 text-ink" />
            <span>Employer</span>
          </Link>
          <Link href="/dashboard/payroll" className={`${standardClass} ${isActive('/dashboard/payroll') ? activeClass : inactiveClass}`}>
            <CreditCard className="w-5 h-5" />
            <span>Payroll</span>
          </Link>
          <Link href="/dashboard/compliance" className={`${standardClass} ${isActive('/dashboard/compliance') ? activeClass : inactiveClass}`}>
            <ShieldCheck className="w-5 h-5" />
            <span>Compliance</span>
          </Link>
          <Link href="/dashboard/settings" className={`${standardClass} ${isActive('/dashboard/settings') ? activeClass : inactiveClass}`}>
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </div>

      </nav>
      
      <div className="p-4 border-t border-ink/10 shrink-0">
        <div className="bg-sage/10 text-sage px-4 py-3 rounded-lg flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
          <span className="font-sans text-xs font-semibold">Systems Operational</span>
        </div>
      </div>
    </aside>
  );
}
