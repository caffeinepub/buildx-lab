import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type DemoId = "drone" | "rccar" | "motor" | "robot";

function useDemoState(): [boolean, () => void] {
  const [playing, setPlaying] = useState(false);
  const toggle = () => setPlaying((p) => !p);
  return [playing, toggle];
}

// ─── Drone Canvas ─────────────────────────────────────────────────────────────
function DroneCanvas({ playing }: { playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2 + Math.sin(t * 0.04) * 6;
      const armLen = 52;
      const arms: [number, number][] = [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ];

      for (const [dx, dy] of arms) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + dx * armLen, cy + dy * armLen);
        ctx.strokeStyle = "#00BFFF";
        ctx.lineWidth = 3;
        ctx.stroke();

        const px = cx + dx * armLen;
        const py = cy + dy * armLen;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#00BFFF";
        ctx.fill();

        const propAngle = t * 0.3 * (dx * dy > 0 ? 1 : -1);
        for (let b = 0; b < 2; b++) {
          const ba = propAngle + b * Math.PI;
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(ba);
          ctx.beginPath();
          ctx.ellipse(0, 0, 22, 4, 0, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0,191,255,0.55)";
          ctx.fill();
          ctx.strokeStyle = "#00BFFF";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }
      }

      ctx.beginPath();
      ctx.roundRect(cx - 14, cy - 14, 28, 28, 5);
      ctx.fillStyle = "rgba(0,191,255,0.15)";
      ctx.fill();
      ctx.strokeStyle = "#00BFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      const pulse = 0.5 + 0.5 * Math.sin(t * 0.15);
      ctx.beginPath();
      ctx.arc(cx, cy, 5 + pulse * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,191,255,${0.3 + pulse * 0.5})`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#00BFFF";
      ctx.fill();

      for (let r = 0; r < 3; r++) {
        const rad = 70 + r * 15;
        const alpha = (0.12 - r * 0.03) * pulse;
        ctx.beginPath();
        ctx.arc(cx, H / 2, rad, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,191,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const tick = () => {
      tRef.current += 1;
      draw(tRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    if (playing) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      draw(tRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={200}
      className="w-full rounded-lg"
      style={{ background: "rgba(0,191,255,0.03)" }}
    />
  );
}

// ─── RC Car Canvas ────────────────────────────────────────────────────────────
function RCCarCanvas({ playing }: { playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const groundY = H - 35;

      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(W, groundY);
      ctx.strokeStyle = "rgba(57,255,20,0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      for (let i = 0; i < 5; i++) {
        const xOffset = ((t * 2 + i * 48) % (W + 48)) - 24;
        ctx.beginPath();
        ctx.moveTo(xOffset, groundY + 8);
        ctx.lineTo(xOffset + 30, groundY + 8);
        ctx.strokeStyle = "rgba(57,255,20,0.15)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      const bounce = Math.sin(t * 0.18) * 2;
      const cx = W / 2;
      const carY = groundY - bounce;
      const wheelR = 18;
      const wheelPositions: number[] = [cx - 50, cx + 50];
      const wheelAngle = t * 0.1;

      for (const wx of wheelPositions) {
        ctx.save();
        ctx.translate(wx, carY);
        ctx.beginPath();
        ctx.arc(0, 0, wheelR, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(57,255,20,0.1)";
        ctx.fill();
        ctx.strokeStyle = "#39ff14";
        ctx.lineWidth = 3;
        ctx.stroke();
        for (let s = 0; s < 4; s++) {
          const sa = wheelAngle + (s * Math.PI) / 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(sa) * (wheelR - 3), Math.sin(sa) * (wheelR - 3));
          ctx.strokeStyle = "#39ff14";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.restore();
      }

      ctx.beginPath();
      ctx.roundRect(cx - 70, carY - 22, 140, 22, [4, 4, 0, 0]);
      ctx.fillStyle = "rgba(57,255,20,0.12)";
      ctx.fill();
      ctx.strokeStyle = "#39ff14";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.roundRect(cx - 78, carY - 5, 156, 12, 3);
      ctx.fillStyle = "rgba(57,255,20,0.08)";
      ctx.fill();
      ctx.strokeStyle = "rgba(57,255,20,0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.roundRect(cx - 36, carY - 40, 72, 22, [6, 6, 0, 0]);
      ctx.fillStyle = "rgba(57,255,20,0.1)";
      ctx.fill();
      ctx.strokeStyle = "rgba(57,255,20,0.7)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const headPulse = 0.6 + 0.4 * Math.abs(Math.sin(t * 0.05));
      ctx.beginPath();
      ctx.arc(cx + 72, carY - 12, 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,255,100,${headPulse})`;
      ctx.fill();
    };

    const tick = () => {
      tRef.current += 1;
      draw(tRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    if (playing) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      draw(tRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={200}
      className="w-full rounded-lg"
      style={{ background: "rgba(57,255,20,0.02)" }}
    />
  );
}

// ─── DC Motor Canvas ──────────────────────────────────────────────────────────
function MotorCanvas({ playing }: { playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;
      const outerR = 70;
      const innerR = 50;

      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,140,0,0.07)";
      ctx.fill();
      ctx.strokeStyle = "#FF8C00";
      ctx.lineWidth = 3;
      ctx.stroke();

      const poles: [number, string, string][] = [
        [Math.PI * 0.5, "N", "#FF4500"],
        [Math.PI * 1.5, "S", "#00BFFF"],
      ];
      for (const [angle, label, color] of poles) {
        const px = cx + Math.cos(angle) * (outerR - 12);
        const py = cy + Math.sin(angle) * (outerR - 12);
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, px, py);
      }

      const armAngle = t * 0.04;
      const numCoils = 6;
      for (let i = 0; i < numCoils; i++) {
        const a = armAngle + (i * Math.PI * 2) / numCoils;
        const x1 = cx + Math.cos(a) * 8;
        const y1 = cy + Math.sin(a) * 8;
        const x2 = cx + Math.cos(a) * innerR;
        const y2 = cy + Math.sin(a) * innerR;
        const heat = (Math.sin(a * 3 + t * 0.1) + 1) / 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(255,${Math.floor(140 + heat * 80)},0,0.9)`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,140,0,0.3)";
      ctx.fill();
      ctx.strokeStyle = "#FF8C00";
      ctx.lineWidth = 2;
      ctx.stroke();

      if (playing && Math.random() > 0.5) {
        const brushPositions: number[] = [cx - outerR + 6, cx + outerR - 6];
        for (const bx of brushPositions) {
          for (let s = 0; s < 3; s++) {
            const sx = bx + (Math.random() - 0.5) * 12;
            const sy = cy + (Math.random() - 0.5) * 12;
            ctx.beginPath();
            ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,${Math.floor(180 + Math.random() * 75)},0,${Math.random()})`;
            ctx.fill();
          }
        }
      }

      const glow = 0.4 + 0.3 * Math.sin(t * 0.07);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR);
      grad.addColorStop(0, `rgba(255,140,0,${glow * 0.15})`);
      grad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    };

    const tick = () => {
      tRef.current += 1;
      draw(tRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    if (playing) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      draw(tRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={200}
      className="w-full rounded-lg"
      style={{ background: "rgba(255,140,0,0.02)" }}
    />
  );
}

// ─── Robot Canvas ─────────────────────────────────────────────────────────────
function RobotCanvas({ playing }: { playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const headBob = Math.sin(t * 0.08) * 3;
      const legSwing = Math.sin(t * 0.1) * 22;
      const armSwing = Math.sin(t * 0.1 + Math.PI) * 20;
      const bodyTop = 60 + headBob;

      const setStroke = (color: string, width: number) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = "round";
      };

      // Head
      ctx.beginPath();
      ctx.roundRect(cx - 16, bodyTop - 28, 32, 28, 5);
      ctx.fillStyle = "rgba(160,32,240,0.15)";
      ctx.fill();
      setStroke("#A020F0", 2.5);
      ctx.stroke();

      // Eye visor
      ctx.beginPath();
      ctx.roundRect(cx - 11, bodyTop - 20, 22, 8, 3);
      const visorPulse = 0.5 + 0.5 * Math.sin(t * 0.12);
      ctx.fillStyle = `rgba(200,100,255,${visorPulse})`;
      ctx.fill();

      // Antenna
      ctx.beginPath();
      ctx.moveTo(cx, bodyTop - 28);
      ctx.lineTo(cx, bodyTop - 40);
      setStroke("rgba(160,32,240,0.6)", 1.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, bodyTop - 42, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,100,255,${visorPulse})`;
      ctx.fill();

      // Torso
      ctx.beginPath();
      ctx.roundRect(cx - 18, bodyTop, 36, 44, 4);
      ctx.fillStyle = "rgba(160,32,240,0.1)";
      ctx.fill();
      setStroke("#A020F0", 2.5);
      ctx.stroke();

      // Chest panel
      ctx.beginPath();
      ctx.roundRect(cx - 10, bodyTop + 8, 20, 12, 2);
      const chestPulse = 0.3 + 0.3 * Math.sin(t * 0.2);
      ctx.fillStyle = `rgba(160,32,240,${chestPulse})`;
      ctx.fill();
      ctx.strokeStyle = "rgba(160,32,240,0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Arms
      const leftArmAngle = armSwing * (Math.PI / 180);
      const rightArmAngle = -armSwing * (Math.PI / 180);
      const armPairs: [number, number][] = [
        [cx - 18, leftArmAngle],
        [cx + 18, rightArmAngle],
      ];
      for (const [sx, angle] of armPairs) {
        ctx.save();
        ctx.translate(sx, bodyTop + 8);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(sx < cx ? -20 : 20, 32);
        setStroke("#A020F0", 3);
        ctx.stroke();
        ctx.restore();
      }

      // Legs
      const leftLegAngle = legSwing * (Math.PI / 180);
      const rightLegAngle = -legSwing * (Math.PI / 180);
      const legBase = bodyTop + 44;
      const legPairs: [number, number][] = [
        [cx - 10, leftLegAngle],
        [cx + 10, rightLegAngle],
      ];
      for (const [sx, angle] of legPairs) {
        ctx.save();
        ctx.translate(sx, legBase);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 28);
        setStroke("#A020F0", 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 28);
        ctx.lineTo(sx < cx ? -4 : 4, 50);
        setStroke("rgba(160,32,240,0.7)", 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.roundRect((sx < cx ? -4 : 4) - 7, 46, 14, 8, 2);
        ctx.fillStyle = "rgba(160,32,240,0.3)";
        ctx.fill();
        setStroke("#A020F0", 1.5);
        ctx.stroke();
        ctx.restore();
      }

      // Shadow
      const shadowY = H - 20;
      const shadowW = 36 + Math.abs(Math.sin(t * 0.08)) * 5;
      ctx.beginPath();
      ctx.ellipse(cx, shadowY, shadowW, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(160,32,240,0.12)";
      ctx.fill();
    };

    const tick = () => {
      tRef.current += 1;
      draw(tRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    if (playing) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      draw(tRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={200}
      className="w-full rounded-lg"
      style={{ background: "rgba(160,32,240,0.02)" }}
    />
  );
}

// ─── Demo Card ────────────────────────────────────────────────────────────────
const DEMOS: {
  id: DemoId;
  title: string;
  desc: string;
  accentColor: string;
  Canvas: React.FC<{ playing: boolean }>;
}[] = [
  {
    id: "drone",
    title: "Quadcopter Drone",
    desc: "Counter-rotating propellers generate lift via differential thrust. Real-time hover simulation.",
    accentColor: "#00BFFF",
    Canvas: DroneCanvas,
  },
  {
    id: "rccar",
    title: "RC Car",
    desc: "Brushed DC motor drives rear axle. Suspension absorbs terrain irregularities at speed.",
    accentColor: "#39ff14",
    Canvas: RCCarCanvas,
  },
  {
    id: "motor",
    title: "DC Motor",
    desc: "Electromagnetic induction rotates the armature. Commutator brushes switch current direction.",
    accentColor: "#FF8C00",
    Canvas: MotorCanvas,
  },
  {
    id: "robot",
    title: "Bipedal Robot",
    desc: "Servo-driven joints achieve balanced walking gait via inverse kinematics and PID control.",
    accentColor: "#A020F0",
    Canvas: RobotCanvas,
  },
];

import type React from "react";

function DemoCard({ demo }: { demo: (typeof DEMOS)[number] }) {
  const [playing, toggle] = useDemoState();
  const { Canvas, title, desc, accentColor, id } = demo;

  return (
    <div
      className="rounded-xl border flex flex-col gap-3 overflow-hidden transition-all hover:scale-[1.02]"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: `${accentColor}30`,
        boxShadow: playing ? `0 0 18px ${accentColor}25` : "none",
      }}
    >
      <div className="relative">
        <Canvas playing={playing} />
        {!playing && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(5,5,15,0.35)" }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
              style={{
                background: `${accentColor}30`,
                border: `2px solid ${accentColor}`,
              }}
            >
              <Play
                size={20}
                style={{ color: accentColor }}
                fill={accentColor}
              />
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-4 flex flex-col gap-3">
        <div>
          <h3
            className="text-sm font-bold mb-1"
            style={{ fontFamily: "'Orbitron', monospace", color: accentColor }}
          >
            {title}
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>
            {desc}
          </p>
        </div>

        <button
          type="button"
          onClick={toggle}
          data-ocid={`demos.${id}.toggle`}
          className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: playing ? `${accentColor}20` : accentColor,
            color: playing ? accentColor : "#05050f",
            border: `1px solid ${accentColor}`,
          }}
        >
          {playing ? (
            <>
              <Pause size={13} /> Pause
            </>
          ) : (
            <>
              <Play size={13} /> Play
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function AnimatedDemos() {
  return (
    <section className="mb-12" data-ocid="demos.section">
      <h2
        className="text-xl font-bold mb-2"
        style={{ fontFamily: "'Orbitron', monospace", color: "#e2e8f0" }}
      >
        Live Machine Demos
      </h2>
      <p className="text-xs mb-6" style={{ color: "#64748b" }}>
        Interactive canvas simulations — press Play to animate each machine.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {DEMOS.map((demo) => (
          <DemoCard key={demo.id} demo={demo} />
        ))}
      </div>
    </section>
  );
}
