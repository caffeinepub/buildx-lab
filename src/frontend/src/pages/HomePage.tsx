import { useNavigate } from "@tanstack/react-router";
import { BookOpen, Cpu, DollarSign, Play, Shield, Users } from "lucide-react";
import { useEffect, useRef } from "react";

const features = [
  {
    icon: Cpu,
    title: "Smart Build Mode",
    desc: "Drag-and-drop parts onto a canvas with AI auto-suggestions and real-time error detection.",
    path: "/build" as const,
    color: "#00d4ff",
  },
  {
    icon: Play,
    title: "Real-Time Simulation",
    desc: "Physics engine with drone flight, motor rotation, heat simulation, and imbalance warnings.",
    path: "/simulate" as const,
    color: "#a855f7",
  },
  {
    icon: Shield,
    title: "AI Engineer Assistant",
    desc: "Ask engineering questions and get step-by-step repair and build guides instantly.",
    path: "/" as const,
    color: "#00d4ff",
  },
  {
    icon: BookOpen,
    title: "Learning Hub",
    desc: "Beginner to advanced courses, quizzes, certifications, and animated demos.",
    path: "/learn" as const,
    color: "#a855f7",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Share builds, explore creations, like, comment, and download from fellow engineers.",
    path: "/community" as const,
    color: "#00d4ff",
  },
  {
    icon: DollarSign,
    title: "Real Build Mode",
    desc: "Get real-world parts list with \u20b9 prices, buy links, and downloadable PDF guides.",
    path: "/build" as const,
    color: "#a855f7",
  },
];

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }[] = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(0,212,255,0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,212,255,0.7)";
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,212,255,${0.25 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pt-16">
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-6 border"
            style={{
              borderColor: "rgba(168,85,247,0.4)",
              background: "rgba(168,85,247,0.1)",
              color: "#a855f7",
            }}
          >
            🚀 AI-Powered Engineering Platform
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight"
            style={{
              fontFamily: "'Orbitron', monospace",
              background: "linear-gradient(135deg,#00d4ff,#a855f7,#00d4ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200%",
              animation: "gradientShift 4s linear infinite",
            }}
          >
            Design the Future.
          </h1>
          <p
            className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ color: "#e2e8f0" }}
          >
            Build it Virtually.
          </p>
          <p
            className="text-xl sm:text-2xl font-medium mb-8"
            style={{ color: "#a855f7" }}
          >
            Create it in Reality.
          </p>
          <p
            className="text-base max-w-xl mx-auto mb-10"
            style={{ color: "#94a3b8" }}
          >
            The ultimate platform to design, simulate, learn, and build
            real-world machines.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              data-ocid="home.primary_button"
              onClick={() => navigate({ to: "/build" })}
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
              style={{
                fontFamily: "'Orbitron', monospace",
                background: "linear-gradient(135deg,#00d4ff,#a855f7)",
                boxShadow:
                  "0 0 30px rgba(0,212,255,0.5), 0 0 60px rgba(168,85,247,0.3)",
                color: "white",
              }}
            >
              Start Building
            </button>
            <button
              type="button"
              data-ocid="home.secondary_button"
              onClick={() => navigate({ to: "/learn" })}
              className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 border"
              style={{ borderColor: "rgba(0,212,255,0.4)", color: "#00d4ff" }}
            >
              Explore Courses
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-black mb-3"
            style={{ fontFamily: "'Orbitron', monospace", color: "#e2e8f0" }}
          >
            Everything You Need
          </h2>
          <p style={{ color: "#64748b" }}>
            One platform for all your engineering needs.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <button
              type="button"
              key={f.title}
              data-ocid="home.card"
              onClick={() => navigate({ to: f.path })}
              className="text-left p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.03]"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: `${f.color}30`,
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 25px ${f.color}25`;
                e.currentTarget.style.borderColor = `${f.color}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = `${f.color}30`;
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}15` }}
              >
                <f.icon size={24} style={{ color: f.color }} />
              </div>
              <h3
                className="font-bold text-base mb-2"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  color: "#e2e8f0",
                }}
              >
                {f.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#64748b" }}
              >
                {f.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
