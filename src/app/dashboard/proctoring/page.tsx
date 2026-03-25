import { LiveAIProctoring } from "@/components/experiments/LiveAIProctoring";

export default function ProctoringPage() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-serif font-bold text-ink mb-2">Live AI Proctoring</h1>
      <p className="text-ink/60 mb-8">Secure, high-fidelity webcam tracking environment.</p>
      
      <div className="rounded-3xl overflow-hidden shadow-lg border border-ink/10 bg-ink min-h-[500px]">
        <LiveAIProctoring />
      </div>
    </div>
  );
}
