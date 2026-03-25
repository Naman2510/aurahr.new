"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Database, WifiOff, RefreshCcw } from "lucide-react";
import clsx from "clsx";

import FootprintMiner from "./FootprintMiner";
import SmartScheduler from "./SmartScheduler";
import FutureProofScore from "./FutureProofScore";
import SynergyGraph from "./SynergyGraph";
import ProctorView from "./ProctorView";
import SiteDiagnostics from "./SiteDiagnostics";

export default function FeatureDashboard() {
  const [connectBackend, setConnectBackend] = useState(false);

  return (
    <div className="py-16 px-6 relative w-full bg-slate-950 font-sans text-slate-200 border-t border-slate-800">
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-[20%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white flex items-center gap-3">
              <Sparkles className="text-indigo-400 w-8 h-8" />
              AI Talent Suite
            </h2>
            <p className="mt-4 text-slate-400 max-w-2xl text-lg">
              Unlock our next-generation candidate evaluation workflows. Monitor system health, predict market trajectories, and verify profiles in real-time.
            </p>
          </div>

          {/* Connect Backend Toggle */}
          <div className="flex flex-col items-end">
            <button 
              onClick={() => setConnectBackend(!connectBackend)}
              className={clsx(
                "relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-2 ring-offset-slate-950 ring-transparent",
                connectBackend ? "bg-indigo-500" : "bg-slate-700"
              )}
            >
              <span className={clsx(
                "inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 shadow-sm",
                connectBackend ? "translate-x-9" : "translate-x-1"
              )} />
            </button>
            <div className="mt-3 flex items-center space-x-2 text-xs font-mono tracking-wider uppercase">
              {connectBackend ? (
                <>
                  <RefreshCcw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                  <span className="text-indigo-300">Awaiting API Connection</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-400">Demo Mode: Static Data</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[340px]">
          
          <div className="lg:col-span-2">
            <FootprintMiner />
          </div>
          
          <div>
            <SmartScheduler />
          </div>
          
          <div>
            <SiteDiagnostics />
          </div>
          
          <div className="lg:col-span-2">
            <ProctorView />
          </div>

          <div className="lg:col-span-2">
            <FutureProofScore />
          </div>
          
          <div className="lg:col-span-2">
            <SynergyGraph />
          </div>

        </div>
      </div>
    </div>
  );
}
