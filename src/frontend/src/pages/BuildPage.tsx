import {
  Battery,
  Circle,
  Cpu,
  Download,
  Radio,
  Save,
  Square,
  Trash2,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const CATEGORIES = [
  "Motors",
  "Batteries",
  "Wheels",
  "Sensors",
  "Frames",
] as const;
type Category = (typeof CATEGORIES)[number];

const PARTS: Record<
  Category,
  { id: string; name: string; icon: React.ReactNode; color: string }[]
> = {
  Motors: [
    {
      id: "motor-dc",
      name: "DC Motor",
      icon: <Cpu size={18} />,
      color: "#00d4ff",
    },
    {
      id: "motor-servo",
      name: "Servo",
      icon: <Cpu size={18} />,
      color: "#00d4ff",
    },
    {
      id: "motor-stepper",
      name: "Stepper",
      icon: <Cpu size={18} />,
      color: "#00d4ff",
    },
  ],
  Batteries: [
    {
      id: "bat-lipo",
      name: "LiPo 3S",
      icon: <Battery size={18} />,
      color: "#a855f7",
    },
    {
      id: "bat-nimh",
      name: "NiMH",
      icon: <Battery size={18} />,
      color: "#a855f7",
    },
    {
      id: "bat-lion",
      name: "Li-Ion",
      icon: <Battery size={18} />,
      color: "#a855f7",
    },
  ],
  Wheels: [
    {
      id: "wheel-rubber",
      name: "Rubber",
      icon: <Circle size={18} />,
      color: "#22d3ee",
    },
    {
      id: "wheel-alloy",
      name: "Alloy",
      icon: <Circle size={18} />,
      color: "#22d3ee",
    },
    {
      id: "wheel-mecanum",
      name: "Mecanum",
      icon: <Circle size={18} />,
      color: "#22d3ee",
    },
  ],
  Sensors: [
    {
      id: "sensor-ultra",
      name: "Ultrasonic",
      icon: <Radio size={18} />,
      color: "#f59e0b",
    },
    {
      id: "sensor-ir",
      name: "IR Sensor",
      icon: <Radio size={18} />,
      color: "#f59e0b",
    },
    {
      id: "sensor-gyro",
      name: "Gyroscope",
      icon: <Radio size={18} />,
      color: "#f59e0b",
    },
  ],
  Frames: [
    {
      id: "frame-alum",
      name: "Aluminum",
      icon: <Square size={18} />,
      color: "#10b981",
    },
    {
      id: "frame-carbon",
      name: "Carbon Fiber",
      icon: <Square size={18} />,
      color: "#10b981",
    },
    {
      id: "frame-pvc",
      name: "PVC",
      icon: <Square size={18} />,
      color: "#10b981",
    },
  ],
};

const REAL_PARTS = [
  {
    id: "rp1",
    name: "DC Motor (775)",
    desc: "High-torque 12V DC motor",
    price: 180,
    category: "Motor",
    amazon: "https://amazon.in",
    flipkart: "https://flipkart.com",
  },
  {
    id: "rp2",
    name: "LiPo Battery 3.7V",
    desc: "1000mAh lithium polymer cell",
    price: 350,
    category: "Battery",
    amazon: "https://amazon.in",
    flipkart: "https://flipkart.com",
  },
  {
    id: "rp3",
    name: "Propeller Set (4pcs)",
    desc: "5045 CW/CCW propellers",
    price: 120,
    category: "Frame",
    amazon: "https://amazon.in",
    flipkart: "https://flipkart.com",
  },
  {
    id: "rp4",
    name: "Arduino Nano",
    desc: "ATmega328P microcontroller",
    price: 220,
    category: "Controller",
    amazon: "https://amazon.in",
    flipkart: "https://flipkart.com",
  },
  {
    id: "rp5",
    name: "Servo Motor SG90",
    desc: "9g micro servo, 180°",
    price: 250,
    category: "Motor",
    amazon: "https://amazon.in",
    flipkart: "https://flipkart.com",
  },
  {
    id: "rp6",
    name: "ESC 30A",
    desc: "Electronic Speed Controller",
    price: 450,
    category: "Controller",
    amazon: "https://amazon.in",
    flipkart: "https://flipkart.com",
  },
  {
    id: "rp7",
    name: "GPS Module NEO-6M",
    desc: "UART GPS receiver",
    price: 680,
    category: "Sensor",
    amazon: "https://amazon.in",
    flipkart: "https://flipkart.com",
  },
  {
    id: "rp8",
    name: "Ultrasonic Sensor HC-SR04",
    desc: "Distance measurement 2–400cm",
    price: 85,
    category: "Sensor",
    amazon: "https://amazon.in",
    flipkart: "https://flipkart.com",
  },
  {
    id: "rp9",
    name: "IR Sensor Module",
    desc: "Infrared obstacle detection",
    price: 45,
    category: "Sensor",
    amazon: "https://amazon.in",
    flipkart: "https://flipkart.com",
  },
  {
    id: "rp10",
    name: "Raspberry Pi 4 (2GB)",
    desc: "Quad-core ARM Cortex-A72",
    price: 4200,
    category: "Controller",
    amazon: "https://amazon.in",
    flipkart: "https://flipkart.com",
  },
  {
    id: "rp11",
    name: "Brushless Motor 2205",
    desc: "2300KV racing drone motor",
    price: 890,
    category: "Motor",
    amazon: "https://amazon.in",
    flipkart: "https://flipkart.com",
  },
  {
    id: "rp12",
    name: "Frame Kit F450",
    desc: "Quadcopter PCB frame 450mm",
    price: 1200,
    category: "Frame",
    amazon: "https://amazon.in",
    flipkart: "https://flipkart.com",
  },
];

const CELL = 60;

interface PlacedPart {
  uid: string;
  partId: string;
  name: string;
  color: string;
  gridX: number;
  gridY: number;
}

type PageTab = "build" | "real";

export default function BuildPage() {
  const [pageTab, setPageTab] = useState<PageTab>("build");
  const [activeTab, setActiveTab] = useState<Category>("Motors");
  const [placed, setPlaced] = useState<PlacedPart[]>([]);
  const [draggingPart, setDraggingPart] = useState<{
    partId: string;
    name: string;
    color: string;
  } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedRealParts, setSelectedRealParts] = useState<Set<string>>(
    new Set(),
  );
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const onCanvasDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!draggingPart) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const gx = Math.floor((e.clientX - rect.left) / CELL);
      const gy = Math.floor((e.clientY - rect.top) / CELL);
      setPlaced((prev) => [
        ...prev,
        {
          uid: crypto.randomUUID(),
          partId: draggingPart.partId,
          name: draggingPart.name,
          color: draggingPart.color,
          gridX: gx,
          gridY: gy,
        },
      ]);
      setDraggingPart(null);
    },
    [draggingPart],
  );

  const removePart = (uid: string) =>
    setPlaced((p) => p.filter((x) => x.uid !== uid));

  const saveBuild = async () => {
    if (!isAuthenticated || !actor) {
      toast.error("Please sign in to save builds.");
      return;
    }
    setSaving(true);
    try {
      await actor.saveBuild({
        id: crypto.randomUUID(),
        name: "My Build",
        description: "Saved from Build Mode",
        partsJson: JSON.stringify(placed),
        timestamp: BigInt(Date.now()),
      });
      toast.success("Build saved!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save build.");
    } finally {
      setSaving(false);
    }
  };

  const toggleRealPart = (id: string) => {
    setSelectedRealParts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalCost = REAL_PARTS.filter((p) =>
    selectedRealParts.has(p.id),
  ).reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="pt-16 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <h1
          className="text-3xl font-bold mb-6"
          style={{
            fontFamily: "'Orbitron', monospace",
            background: "linear-gradient(135deg,#00d4ff,#a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Build Lab
        </h1>

        {/* Mode Tabs */}
        <div className="flex gap-2 mb-6">
          {(["build", "real"] as PageTab[]).map((t) => (
            <button
              key={t}
              type="button"
              data-ocid="build.tab"
              onClick={() => setPageTab(t)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background:
                  pageTab === t
                    ? "linear-gradient(135deg,#00d4ff,#a855f7)"
                    : "rgba(255,255,255,0.05)",
                border:
                  pageTab === t ? "none" : "1px solid rgba(0,212,255,0.2)",
                color: pageTab === t ? "white" : "#94a3b8",
              }}
            >
              {t === "build" ? "🔧 Build Mode" : "🛒 Real Build Mode"}
            </button>
          ))}
        </div>

        {pageTab === "build" && (
          <div className="flex gap-4 flex-col lg:flex-row">
            <div
              className="w-full lg:w-64 rounded-xl border p-4 flex flex-col gap-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(0,212,255,0.2)",
              }}
            >
              <h2
                className="text-sm font-semibold"
                style={{ color: "#00d4ff" }}
              >
                Parts Library
              </h2>
              <div className="flex flex-wrap gap-1">
                {CATEGORIES.map((c) => (
                  <button
                    type="button"
                    key={c}
                    data-ocid="build.tab"
                    onClick={() => setActiveTab(c)}
                    className="px-2 py-1 rounded text-xs font-medium transition-all"
                    style={{
                      background:
                        activeTab === c ? "rgba(0,212,255,0.2)" : "transparent",
                      border:
                        activeTab === c
                          ? "1px solid #00d4ff"
                          : "1px solid rgba(255,255,255,0.1)",
                      color: activeTab === c ? "#00d4ff" : "#94a3b8",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {PARTS[activeTab].map((part) => (
                  <div
                    key={part.id}
                    draggable
                    onDragStart={() =>
                      setDraggingPart({
                        partId: part.id,
                        name: part.name,
                        color: part.color,
                      })
                    }
                    className="flex items-center gap-3 p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-all hover:scale-105"
                    style={{
                      borderColor: `${part.color}40`,
                      background: `${part.color}10`,
                      color: part.color,
                    }}
                  >
                    {part.icon}
                    <span className="text-sm">{part.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  type="button"
                  data-ocid="build.save_button"
                  onClick={saveBuild}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: "linear-gradient(135deg,#00d4ff,#a855f7)",
                    color: "white",
                    boxShadow: "0 0 15px rgba(0,212,255,0.3)",
                  }}
                >
                  <Save size={16} /> {saving ? "Saving..." : "Save Build"}
                </button>
                <button
                  type="button"
                  data-ocid="build.delete_button"
                  onClick={() => setPlaced([])}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all"
                  style={{
                    borderColor: "rgba(255,80,80,0.4)",
                    color: "#f87171",
                  }}
                >
                  <Trash2 size={16} /> Clear
                </button>
              </div>

              <div
                className="relative rounded-xl border overflow-hidden"
                style={{
                  borderColor: "rgba(0,212,255,0.2)",
                  minHeight: 480,
                  background: "#08081a",
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onCanvasDrop}
                data-ocid="build.canvas_target"
              >
                <svg
                  className="absolute inset-0 w-full h-full"
                  style={{ pointerEvents: "none" }}
                  aria-hidden="true"
                >
                  <title>Assembly canvas grid</title>
                  <defs>
                    <pattern
                      id="grid"
                      width={CELL}
                      height={CELL}
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d={`M ${CELL} 0 L 0 0 0 ${CELL}`}
                        fill="none"
                        stroke="rgba(0,212,255,0.07)"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  {placed.map((p, i) =>
                    placed
                      .slice(i + 1, i + 2)
                      .map((q) => (
                        <line
                          key={`conn-${p.uid}-${q.uid}`}
                          x1={p.gridX * CELL + CELL / 2}
                          y1={p.gridY * CELL + CELL / 2}
                          x2={q.gridX * CELL + CELL / 2}
                          y2={q.gridY * CELL + CELL / 2}
                          stroke="rgba(0,212,255,0.3)"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                      )),
                  )}
                </svg>

                {placed.map((p) => (
                  <button
                    type="button"
                    key={p.uid}
                    onClick={() =>
                      setSelected(p.uid === selected ? null : p.uid)
                    }
                    className="absolute flex flex-col items-center justify-center rounded-lg text-xs font-medium cursor-pointer transition-all"
                    style={{
                      left: p.gridX * CELL + 4,
                      top: p.gridY * CELL + 4,
                      width: CELL - 8,
                      height: CELL - 8,
                      background: `${p.color}20`,
                      border: `1px solid ${p.color}${selected === p.uid ? "ff" : "80"}`,
                      boxShadow:
                        selected === p.uid ? `0 0 12px ${p.color}60` : "none",
                      color: p.color,
                      fontSize: 9,
                      textAlign: "center",
                      zIndex: selected === p.uid ? 10 : 1,
                    }}
                  >
                    <span>{p.name}</span>
                    {selected === p.uid && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePart(p.uid);
                        }}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-xs flex items-center justify-center"
                        style={{
                          background: "#f87171",
                          color: "white",
                          fontSize: 10,
                        }}
                      >
                        ×
                      </button>
                    )}
                  </button>
                ))}

                {placed.length === 0 && (
                  <div
                    data-ocid="build.empty_state"
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ color: "rgba(0,212,255,0.3)" }}
                  >
                    <p className="text-sm">Drag parts here to assemble</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {pageTab === "real" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "#e2e8f0" }}>
                  Real Parts List
                </h2>
                <p className="text-sm mt-1" style={{ color: "#64748b" }}>
                  Select parts to calculate total cost.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {selectedRealParts.size > 0 && (
                  <div
                    className="px-4 py-2 rounded-xl border text-sm font-bold"
                    style={{
                      borderColor: "rgba(0,212,255,0.4)",
                      color: "#00d4ff",
                      background: "rgba(0,212,255,0.08)",
                    }}
                  >
                    Total: ₹{totalCost.toLocaleString("en-IN")}
                  </div>
                )}
                <button
                  type="button"
                  data-ocid="build.download_button"
                  onClick={() => toast.success("PDF guide downloading...")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg,#00d4ff,#a855f7)",
                    color: "white",
                    boxShadow: "0 0 15px rgba(0,212,255,0.3)",
                  }}
                >
                  <Download size={16} /> Download PDF Guide
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {REAL_PARTS.map((part, idx) => (
                <div
                  key={part.id}
                  data-ocid={`build.item.${idx + 1}`}
                  className="rounded-xl border p-4 flex flex-col gap-3 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                  onClick={() => toggleRealPart(part.id)}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    toggleRealPart(part.id)
                  }
                  style={{
                    background: selectedRealParts.has(part.id)
                      ? "rgba(0,212,255,0.08)"
                      : "rgba(255,255,255,0.03)",
                    borderColor: selectedRealParts.has(part.id)
                      ? "#00d4ff"
                      : "rgba(0,212,255,0.15)",
                    boxShadow: selectedRealParts.has(part.id)
                      ? "0 0 15px rgba(0,212,255,0.2)"
                      : "none",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p
                        className="font-semibold text-sm"
                        style={{ color: "#e2e8f0" }}
                      >
                        {part.name}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "#64748b" }}
                      >
                        {part.desc}
                      </p>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(168,85,247,0.15)",
                        color: "#a855f7",
                      }}
                    >
                      {part.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-lg font-black"
                      style={{ color: "#00d4ff" }}
                    >
                      ₹{part.price}
                    </span>
                    <div className="flex gap-2">
                      <a
                        href={part.amazon}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs px-2 py-1 rounded border transition-all hover:scale-105"
                        style={{
                          borderColor: "rgba(255,153,0,0.4)",
                          color: "#ff9900",
                        }}
                      >
                        Amazon
                      </a>
                      <a
                        href={part.flipkart}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs px-2 py-1 rounded border transition-all hover:scale-105"
                        style={{
                          borderColor: "rgba(0,112,243,0.4)",
                          color: "#0070f3",
                        }}
                      >
                        Flipkart
                      </a>
                    </div>
                  </div>
                  {selectedRealParts.has(part.id) && (
                    <div
                      className="text-xs text-center py-1 rounded-lg"
                      style={{
                        background: "rgba(0,212,255,0.1)",
                        color: "#00d4ff",
                      }}
                    >
                      ✓ Selected
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
