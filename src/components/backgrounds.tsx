// components/backgrounds.tsx
'use client';

export default function Backgrounds() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#05070b]">
      {/* Background Motion & Dynamic Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] animate-panGrid"></div>
      
      {/* Dynamic Glow Effects (Cyan & Purple Pulses) */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/15 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '4s' }}></div>

      {/* Global CSS Animation Styles */}
      <style jsx global>{`
        @keyframes panGrid {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        .animate-panGrid {
          animation: panGrid 20s linear infinite;
        }
      `}</style>
    </div>
  );
}