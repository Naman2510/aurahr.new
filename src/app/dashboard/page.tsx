import { DigitalFootprintMiner } from "@/components/experiments/DigitalFootprintMiner";
import { LiveAIProctoring } from "@/components/experiments/LiveAIProctoring";
import { AIDateScheduling } from "@/components/experiments/AIDateScheduling";
import { MarketTrendEvolution } from "@/components/experiments/MarketTrendEvolution";
import { TeamCollaborationGraph } from "@/components/experiments/TeamCollaborationGraph";
import { SystemHealth } from "@/components/experiments/SystemHealth";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-serif font-bold text-ink">Recruitment Overview</h1>
        <p className="text-ink/60 mt-2">At-a-glance telemetry of all active Neev Cloud candidate processing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min md:auto-rows-[420px]">
        {/* FootprintMiner */}
        <div className="lg:col-span-1 lg:row-span-1 border border-ink/10 shadow-sm rounded-3xl overflow-hidden bg-cream hover:shadow-md transition-shadow">
          <DigitalFootprintMiner />
        </div>
        
        {/* Live Proctoring */}
        <div className="lg:col-span-2 lg:row-span-1 border border-ink shadow-sm rounded-3xl overflow-hidden bg-ink text-warm-sand hover:shadow-md transition-shadow">
          <LiveAIProctoring />
        </div>

        {/* Scheduling */}
        <div className="lg:col-span-1 lg:row-span-1 border border-ink/10 shadow-sm rounded-3xl overflow-hidden bg-cream hover:shadow-md transition-shadow">
          <AIDateScheduling />
        </div>

        {/* Market Trends */}
        <div className="lg:col-span-1 lg:row-span-1 border border-ink/10 shadow-sm rounded-3xl overflow-hidden bg-warm-sand hover:shadow-md transition-shadow">
          <MarketTrendEvolution />
        </div>

        {/* Collaboration */}
        <div className="lg:col-span-1 lg:row-span-1 border border-ink/10 shadow-sm rounded-3xl overflow-hidden bg-cream hover:shadow-md transition-shadow">
          <TeamCollaborationGraph />
        </div>

        {/* System Health */}
        <div className="lg:col-span-3 lg:row-span-1 border border-ink/10 shadow-sm rounded-3xl overflow-hidden bg-cream hover:shadow-md transition-shadow">
          <SystemHealth />
        </div>
      </div>
    </div>
  );
}
