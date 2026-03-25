"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Monitor, Eye, Clock } from "lucide-react";

const EVENTS = [
  { time: "10:02 AM", event: "Webcam Started", type: "success", icon: Monitor },
  { time: "10:05 AM", event: "Eye-Tracking Verified", type: "success", icon: Eye },
  { time: "10:12 AM", event: "Tab Switch Detected", type: "warning", icon: ShieldAlert, note: "Duration: 4s" },
  { time: "10:18 AM", event: "Browser Focus Lost", type: "warning", icon: ShieldAlert, note: "Duration: 2s" },
  { time: "10:25 AM", event: "Proctoring Session Ended", type: "info", icon: Clock },
];

export default function IntegrityTimeline() {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-amber-500" />
        Integrity Timeline
      </h3>

      <div className="space-y-6 relative">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-800" />

        {EVENTS.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-4 relative"
          >
            <div className={`mt-1.5 w-6 h-6 rounded-full flex items-center justify-center z-10 border-2 ${
              item.type === 'warning' ? 'bg-amber-950 border-amber-500 text-amber-500' : 
              item.type === 'success' ? 'bg-emerald-950 border-emerald-500 text-emerald-500' :
              'bg-indigo-950 border-indigo-500 text-indigo-500'
            }`}>
              <item.icon className="w-3 h-3" />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold text-slate-200">{item.event}</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">{item.time}</span>
              </div>
              {item.note && (
                <p className="text-xs text-slate-400 mt-1 italic">{item.note}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
