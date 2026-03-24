import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Machine = "Drone" | "RC Car" | "Motor" | "Robot";
const MACHINES: Machine[] = ["Drone", "RC Car", "Motor", "Robot"];

const PARTS_MAP: Record<
  Machine,
  { name: string; desc: string; color: string; angle: number; dist: number }[]
> = {
  Drone: [
    {
      name: "Frame",
      desc: "Central carbon fiber chassis",
      color: "#00BFFF",
      angle: 0,
      dist: 0,
    },
    {
      name: "Motor 1",
      desc: "Brushless 2300KV motor (front-left)",
      color: "#A020F0",
      angle: 45,
      dist: 80,
    },
    {
      name: "Motor 2",
      desc: "Brushless 2300KV motor (front-right)",
      color: "#A020F0",
      angle: 135,
      dist: 80,
    },
    {
      name: "Motor 3",
      desc: "Brushless 2300KV motor (back-left)",
      color: "#A020F0",
      angle: 225,
      dist: 80,
    },
    {
      name: "Motor 4",
      desc: "Brushless 2300KV motor (back-right)",
      color: "#A020F0",
      angle: 315,
      dist: 80,
    },
    {
      name: "Battery",
      desc: "3S 2200mAh LiPo pack",
      color: "#10b981",
      angle: 270,
      dist: 120,
    },
    {
      name: "ESC",
      desc: "30A Electronic Speed Controller",
      color: "#f59e0b",
      angle: 90,
      dist: 120,
    },
    {
      name: "Flight Controller",
      desc: "F4 flight controller with gyroscope",
      color: "#22d3ee",
      angle: 0,
      dist: 130,
    },
  ],
  "RC Car": [
    {
      name: "Chassis",
      desc: "Aluminum alloy main body",
      color: "#00BFFF",
      angle: 0,
      dist: 0,
    },
    {
      name: "Front Axle",
      desc: "Steering axle assembly",
      color: "#A020F0",
      angle: 0,
      dist: 100,
    },
    {
      name: "Rear Axle",
      desc: "Driven rear axle",
      color: "#A020F0",
      angle: 180,
      dist: 100,
    },
    {
      name: "Drive Motor",
      desc: "550 brushed DC motor",
      color: "#10b981",
      angle: 90,
      dist: 100,
    },
    {
      name: "Servo",
      desc: "9g steering servo",
      color: "#f59e0b",
      angle: 270,
      dist: 100,
    },
    {
      name: "Battery Pack",
      desc: "7.4V 2S LiPo",
      color: "#22d3ee",
      angle: 135,
      dist: 120,
    },
    {
      name: "ESC",
      desc: "40A brushed ESC",
      color: "#ef4444",
      angle: 45,
      dist: 120,
    },
  ],
  Motor: [
    {
      name: "Stator",
      desc: "Fixed electromagnetic core",
      color: "#00BFFF",
      angle: 0,
      dist: 0,
    },
    {
      name: "Rotor",
      desc: "Rotating permanent magnet",
      color: "#A020F0",
      angle: 0,
      dist: 80,
    },
    {
      name: "Shaft",
      desc: "Output drive shaft",
      color: "#10b981",
      angle: 90,
      dist: 100,
    },
    {
      name: "Bearings",
      desc: "Sealed ball bearings ×2",
      color: "#f59e0b",
      angle: 270,
      dist: 100,
    },
    {
      name: "End Cap",
      desc: "Front bearing housing",
      color: "#22d3ee",
      angle: 180,
      dist: 90,
    },
    {
      name: "Brushes",
      desc: "Carbon commutator brushes",
      color: "#ef4444",
      angle: 45,
      dist: 90,
    },
  ],
  Robot: [
    {
      name: "Torso",
      desc: "Main body frame",
      color: "#00BFFF",
      angle: 0,
      dist: 0,
    },
    {
      name: "Head",
      desc: "Sensor array housing",
      color: "#A020F0",
      angle: 90,
      dist: 100,
    },
    {
      name: "Left Arm",
      desc: "3-DOF manipulator arm",
      color: "#10b981",
      angle: 135,
      dist: 110,
    },
    {
      name: "Right Arm",
      desc: "3-DOF manipulator arm",
      color: "#10b981",
      angle: 45,
      dist: 110,
    },
    {
      name: "Left Leg",
      desc: "Bipedal drive assembly",
      color: "#f59e0b",
      angle: 225,
      dist: 110,
    },
    {
      name: "Right Leg",
      desc: "Bipedal drive assembly",
      color: "#f59e0b",
      angle: 315,
      dist: 110,
    },
    {
      name: "CPU Board",
      desc: "Raspberry Pi 4 controller",
      color: "#22d3ee",
      angle: 270,
      dist: 120,
    },
    {
      name: "Battery",
      desc: "12V Li-Ion pack",
      color: "#ef4444",
      angle: 180,
      dist: 120,
    },
  ],
};

export default function ExplodedPage() {
  const [machine, setMachine] = useState<Machine>("Drone");
  const [step, setStep] = useState(0);
  const parts = PARTS_MAP[machine];
  const maxStep = parts.length - 1;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const CX = 200;
  const CY = 200;

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1
          className="text-3xl font-bold mb-6"
          style={{
            fontFamily: "'Orbitron', monospace",
            background: "linear-gradient(135deg,#00BFFF,#A020F0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Exploded View
        </h1>

        <div className="flex gap-3 mb-6 flex-wrap">
          {MACHINES.map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => {
                setMachine(m);
                setStep(0);
              }}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background:
                  machine === m
                    ? "linear-gradient(135deg,#00BFFF,#A020F0)"
                    : "rgba(255,255,255,0.05)",
                border:
                  machine === m ? "none" : "1px solid rgba(0,191,255,0.2)",
                color: machine === m ? "white" : "#94a3b8",
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div
          className="h-1 rounded-full mb-6 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((step + 1) / parts.length) * 100}%`,
              background: "linear-gradient(135deg,#00BFFF,#A020F0)",
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SVG Visualization */}
          <div
            className="lg:col-span-2 rounded-xl border flex items-center justify-center"
            style={{
              background: "#08081a",
              borderColor: "rgba(0,191,255,0.2)",
              minHeight: 420,
            }}
          >
            <svg
              width="400"
              height="400"
              viewBox="0 0 400 400"
              aria-label="Exploded view diagram"
            >
              <title>Exploded view diagram</title>
              {parts.map((p, i) => {
                const revealed = i <= step;
                const exploded = revealed && i > 0;
                const isActive = i === step;
                const angle = toRad(p.angle);
                const spread = exploded ? p.dist : 0;
                const x = CX + Math.cos(angle) * spread;
                const y = CY - Math.sin(angle) * spread;
                return (
                  <g
                    key={p.name}
                    style={{
                      opacity: revealed ? 1 : 0.15,
                      transition: "all 0.6s ease",
                    }}
                  >
                    {i > 0 && revealed && (
                      <line
                        x1={CX}
                        y1={CY}
                        x2={x}
                        y2={y}
                        stroke={`${p.color}30`}
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? 22 : 16}
                      fill={`${p.color}20`}
                      stroke={p.color}
                      strokeWidth={isActive ? 2 : 1}
                      style={{
                        filter: isActive
                          ? `drop-shadow(0 0 8px ${p.color})`
                          : "none",
                        transition: "all 0.6s ease",
                      }}
                    />
                    <text
                      x={x}
                      y={y + 35}
                      textAnchor="middle"
                      fill={isActive ? p.color : "#64748b"}
                      fontSize={isActive ? 11 : 9}
                      style={{ transition: "all 0.6s ease" }}
                    >
                      {p.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Parts list + controls */}
          <div className="flex flex-col gap-4">
            <div
              className="rounded-xl border p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(0,191,255,0.2)",
              }}
            >
              <h3
                className="text-sm font-semibold mb-1"
                style={{ color: parts[step].color }}
              >
                Step {step + 1}: {parts[step].name}
              </h3>
              <p className="text-sm" style={{ color: "#94a3b8" }}>
                {parts[step].desc}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="flex-1 flex items-center justify-center gap-1 py-3 rounded-lg text-sm border transition-all disabled:opacity-30"
                style={{ borderColor: "rgba(0,191,255,0.3)", color: "#94a3b8" }}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(maxStep, s + 1))}
                disabled={step === maxStep}
                className="flex-1 flex items-center justify-center gap-1 py-3 rounded-lg text-sm transition-all disabled:opacity-30"
                style={{
                  background: "linear-gradient(135deg,#00BFFF,#A020F0)",
                  color: "white",
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>

            <div
              className="rounded-xl border p-4"
              style={{
                background: "rgba(255,255,255,0.02)",
                borderColor: "rgba(0,191,255,0.1)",
              }}
            >
              <h4
                className="text-xs font-semibold mb-2"
                style={{ color: "#00BFFF" }}
              >
                All Parts
              </h4>
              {parts.map((p, i) => (
                <button
                  type="button"
                  key={p.name}
                  onClick={() => setStep(i)}
                  className="flex items-center gap-2 w-full py-1 text-left transition-all"
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: i <= step ? p.color : "#334155" }}
                  />
                  <span
                    className="text-xs"
                    style={{
                      color:
                        i === step ? p.color : i < step ? "#94a3b8" : "#334155",
                    }}
                  >
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
