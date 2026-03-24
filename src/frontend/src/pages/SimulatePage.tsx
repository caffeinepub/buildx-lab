import { Play, RotateCcw } from "lucide-react";
import { useState } from "react";

type Machine = "Drone" | "RC Car" | "Motor" | "Robot";
const MACHINES: Machine[] = ["Drone", "RC Car", "Motor", "Robot"];

interface SimResults {
  speed: number;
  power: number;
  status: string;
  warnings: string[];
}

export default function SimulatePage() {
  const [machine, setMachine] = useState<Machine>("Drone");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<SimResults | null>(null);

  const runSim = () => {
    setRunning(true);
    setResults(null);
    setTimeout(() => {
      setResults({
        speed: Math.round(20 + Math.random() * 60),
        power: Math.round(5 + Math.random() * 45),
        status: Math.random() > 0.2 ? "Operational" : "Warning",
        warnings:
          Math.random() > 0.5
            ? []
            : ["Voltage drop detected", "Thermal threshold approaching"],
      });
    }, 2000);
  };

  const reset = () => {
    setRunning(false);
    setResults(null);
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1
          className="text-3xl font-bold mb-8"
          style={{
            fontFamily: "'Orbitron', monospace",
            background: "linear-gradient(135deg,#00BFFF,#A020F0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Simulation Mode
        </h1>

        {/* Machine selector */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {MACHINES.map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => {
                setMachine(m);
                reset();
              }}
              className="px-5 py-2 rounded-lg font-semibold text-sm transition-all"
              style={{
                background:
                  machine === m
                    ? "linear-gradient(135deg,#00BFFF,#A020F0)"
                    : "rgba(255,255,255,0.05)",
                border:
                  machine === m ? "none" : "1px solid rgba(0,191,255,0.2)",
                color: machine === m ? "white" : "#94a3b8",
                boxShadow:
                  machine === m ? "0 0 15px rgba(0,191,255,0.3)" : "none",
              }}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Animation area */}
          <div
            className="lg:col-span-2 rounded-xl border flex items-center justify-center"
            style={{
              background: "#08081a",
              borderColor: "rgba(0,191,255,0.2)",
              minHeight: 380,
            }}
          >
            {machine === "Drone" && <DroneAnim running={running} />}
            {machine === "RC Car" && <CarAnim running={running} />}
            {machine === "Motor" && <MotorAnim running={running} />}
            {machine === "Robot" && <RobotAnim running={running} />}
          </div>

          {/* Results */}
          <div className="flex flex-col gap-4">
            <div
              className="rounded-xl border p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(0,191,255,0.2)",
              }}
            >
              <h3
                className="text-sm font-semibold mb-4"
                style={{
                  color: "#00BFFF",
                  fontFamily: "'Orbitron', monospace",
                }}
              >
                Results
              </h3>
              {results ? (
                <div className="space-y-3">
                  <Metric
                    label="Speed"
                    value={`${results.speed} km/h`}
                    color="#00BFFF"
                  />
                  <Metric
                    label="Power"
                    value={`${results.power} W`}
                    color="#A020F0"
                  />
                  <Metric
                    label="Status"
                    value={results.status}
                    color={
                      results.status === "Operational" ? "#10b981" : "#f59e0b"
                    }
                  />
                  {results.warnings.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs mb-1" style={{ color: "#f59e0b" }}>
                        Warnings:
                      </p>
                      {results.warnings.map((w) => (
                        <p
                          key={w}
                          className="text-xs"
                          style={{ color: "#fbbf24" }}
                        >
                          ⚠ {w}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm" style={{ color: "#475569" }}>
                  Run simulation to see results...
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={runSim}
                disabled={running && !results}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all"
                style={{
                  background: "linear-gradient(135deg,#00BFFF,#A020F0)",
                  color: "white",
                  boxShadow: "0 0 15px rgba(0,191,255,0.3)",
                }}
              >
                <Play size={16} />{" "}
                {running && !results ? "Running..." : "Run Simulation"}
              </button>
              <button
                type="button"
                onClick={reset}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm border transition-all"
                style={{ borderColor: "rgba(0,191,255,0.3)", color: "#94a3b8" }}
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes droneHover { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes rotorSpin { to{transform:rotate(360deg)} }
        @keyframes carRoll { 0%{transform:translateX(-80px)} 100%{transform:translateX(80px)} }
        @keyframes motorSpin { to{transform:rotate(360deg)} }
        @keyframes robotBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes armSwing { 0%,100%{transform:rotate(-15deg)} 50%{transform:rotate(15deg)} }
      `}</style>
    </div>
  );
}

function Metric({
  label,
  value,
  color,
}: { label: string; value: string; color: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs" style={{ color: "#64748b" }}>
        {label}
      </span>
      <span className="text-sm font-bold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

function DroneAnim({ running }: { running: boolean }) {
  return (
    <div
      className="relative flex flex-col items-center"
      style={{
        animation: running ? "droneHover 1.5s ease-in-out infinite" : "none",
      }}
    >
      <div className="flex gap-8 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-10 h-2 rounded-full"
            style={{
              background: "rgba(0,191,255,0.5)",
              animation: running
                ? `rotorSpin ${0.2 + i * 0.05}s linear infinite`
                : "none",
              transformOrigin: "center",
            }}
          />
        ))}
      </div>
      <div
        className="w-24 h-8 rounded-lg flex items-center justify-center"
        style={{
          background: "rgba(0,191,255,0.2)",
          border: "1px solid #00BFFF",
        }}
      >
        <span className="text-xs" style={{ color: "#00BFFF" }}>
          DRONE
        </span>
      </div>
      {running && (
        <div
          className="mt-3 text-xs"
          style={{ color: "#00BFFF", opacity: 0.7 }}
        >
          ◦ HOVERING
        </div>
      )}
    </div>
  );
}

function CarAnim({ running }: { running: boolean }) {
  return (
    <div className="overflow-hidden w-full px-10">
      <div
        style={{
          animation: running
            ? "carRoll 1.5s ease-in-out infinite alternate"
            : "none",
        }}
        className="flex flex-col items-center w-fit mx-auto"
      >
        <div
          className="w-32 h-10 rounded-t-2xl"
          style={{
            background: "rgba(160,32,240,0.4)",
            border: "1px solid #A020F0",
          }}
        />
        <div
          className="w-40 h-8 rounded"
          style={{
            background: "rgba(160,32,240,0.2)",
            border: "1px solid #A020F0",
          }}
        />
        <div className="flex gap-12 mt-1">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full"
              style={{
                background: "rgba(160,32,240,0.3)",
                border: "2px solid #A020F0",
                animation: running
                  ? `motorSpin ${0.5}s linear infinite`
                  : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MotorAnim({ running }: { running: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{
          background: "rgba(0,191,255,0.1)",
          border: "2px solid #00BFFF",
          animation: running ? "motorSpin 0.5s linear infinite" : "none",
        }}
      >
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <div
            key={deg}
            className="absolute w-1 h-8 rounded"
            style={{
              background: "#00BFFF",
              transform: `rotate(${deg}deg) translateY(-16px)`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>
      <div
        className="w-4 h-16 rounded"
        style={{
          background: "rgba(0,191,255,0.3)",
          border: "1px solid #00BFFF",
        }}
      />
      {running && (
        <span className="text-xs" style={{ color: "#00BFFF" }}>
          SPINNING
        </span>
      )}
    </div>
  );
}

function RobotAnim({ running }: { running: boolean }) {
  return (
    <div
      className="flex flex-col items-center gap-1"
      style={{
        animation: running ? "robotBob 1s ease-in-out infinite" : "none",
      }}
    >
      <div
        className="w-12 h-10 rounded-lg"
        style={{
          background: "rgba(160,32,240,0.3)",
          border: "1px solid #A020F0",
        }}
      >
        <div className="flex justify-center gap-2 pt-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "#00BFFF", boxShadow: "0 0 6px #00BFFF" }}
          />
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "#00BFFF", boxShadow: "0 0 6px #00BFFF" }}
          />
        </div>
      </div>
      <div
        className="w-14 h-12 rounded"
        style={{
          background: "rgba(160,32,240,0.2)",
          border: "1px solid #A020F0",
        }}
      />
      <div className="flex gap-2">
        <div
          className="w-4 h-10 rounded"
          style={{
            background: "rgba(160,32,240,0.3)",
            border: "1px solid #A020F0",
            animation: running ? "armSwing 0.8s ease-in-out infinite" : "none",
            transformOrigin: "top center",
          }}
        />
        <div
          className="w-6 h-8 rounded"
          style={{ background: "rgba(160,32,240,0.2)" }}
        />
        <div
          className="w-4 h-10 rounded"
          style={{
            background: "rgba(160,32,240,0.3)",
            border: "1px solid #A020F0",
            animation: running
              ? "armSwing 0.8s ease-in-out infinite reverse"
              : "none",
            transformOrigin: "top center",
          }}
        />
      </div>
    </div>
  );
}
