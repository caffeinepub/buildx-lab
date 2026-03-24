import { BookOpen, Heart, Layers, Lock, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Build } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const ACHIEVEMENTS = [
  {
    id: "first_build",
    name: "First Build",
    desc: "Completed your first machine build",
    emoji: "🔧",
    unlocked: true,
    color: "#00d4ff",
  },
  {
    id: "speed_builder",
    name: "Speed Builder",
    desc: "Complete 3 builds in under an hour",
    emoji: "⚡",
    unlocked: true,
    color: "#f59e0b",
  },
  {
    id: "sim_master",
    name: "Simulation Master",
    desc: "Run 10 successful simulations",
    emoji: "🎮",
    unlocked: false,
    color: "#a855f7",
  },
  {
    id: "ai_helper",
    name: "AI Helper",
    desc: "Asked 20+ engineering questions",
    emoji: "🤖",
    unlocked: true,
    color: "#10b981",
  },
  {
    id: "community_star",
    name: "Community Star",
    desc: "Get 50 likes on your shared builds",
    emoji: "⭐",
    unlocked: false,
    color: "#f59e0b",
  },
  {
    id: "learning_champ",
    name: "Learning Champion",
    desc: "Complete all beginner courses",
    emoji: "🎓",
    unlocked: true,
    color: "#00d4ff",
  },
];

export default function DashboardPage() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { actor } = useActor();
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !actor) return;
    setLoading(true);
    actor
      .getUserBuilds()
      .then(setBuilds)
      .catch(console.error)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, actor]);

  const deleteBuild = async (id: string) => {
    if (!actor) return;
    await actor.deleteBuild(id);
    setBuilds((b) => b.filter((x) => x.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: "'Orbitron', monospace", color: "#e2e8f0" }}
          >
            Sign in required
          </h2>
          <p className="text-sm mb-6" style={{ color: "#64748b" }}>
            Please sign in to view your dashboard.
          </p>
          <button
            type="button"
            data-ocid="dashboard.primary_button"
            onClick={() => login()}
            className="px-6 py-3 rounded-lg font-semibold"
            style={{
              background: "linear-gradient(135deg,#00d4ff,#a855f7)",
              color: "white",
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const xp = 150;
  const xpMax = 500;
  const level = 2;

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <h1
            className="text-3xl font-bold"
            style={{
              fontFamily: "'Orbitron', monospace",
              background: "linear-gradient(135deg,#00d4ff,#a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            My Dashboard
          </h1>
          <div
            className="flex items-center gap-3 px-4 py-2 rounded-xl border"
            style={{
              background: "rgba(168,85,247,0.08)",
              borderColor: "rgba(168,85,247,0.3)",
            }}
          >
            <Star size={18} style={{ color: "#f59e0b" }} />
            <div>
              <p className="text-xs" style={{ color: "#64748b" }}>
                Level {level}
              </p>
              <p className="text-sm font-bold" style={{ color: "#e2e8f0" }}>
                Junior Engineer
              </p>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div
          className="rounded-xl border p-5 mb-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(0,212,255,0.2)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-sm font-semibold"
              style={{ color: "#00d4ff" }}
            >
              ⚡ XP Points
            </span>
            <span className="text-sm" style={{ color: "#94a3b8" }}>
              {xp} / {xpMax} XP
            </span>
          </div>
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: 8, background: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(xp / xpMax) * 100}%`,
                background: "linear-gradient(135deg,#00d4ff,#a855f7)",
                boxShadow: "0 0 8px rgba(0,212,255,0.5)",
              }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: "#475569" }}>
            {xpMax - xp} XP to Level {level + 1}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            {
              icon: Layers,
              label: "Total Builds",
              value: builds.length,
              color: "#00d4ff",
            },
            {
              icon: BookOpen,
              label: "Guides Done",
              value: 0,
              color: "#a855f7",
            },
            {
              icon: Heart,
              label: "Community Likes",
              value: 0,
              color: "#ef4444",
            },
          ].map((s) => (
            <div
              key={s.label}
              data-ocid="dashboard.card"
              className="rounded-xl border p-5 flex flex-col gap-2"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: `${s.color}30`,
              }}
            >
              <s.icon size={20} style={{ color: s.color }} />
              <div className="text-2xl font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs" style={{ color: "#64748b" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <h2
          className="text-xl font-semibold mb-4"
          style={{ fontFamily: "'Orbitron', monospace", color: "#e2e8f0" }}
        >
          Achievements
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {ACHIEVEMENTS.map((a) => (
            <div
              key={a.id}
              data-ocid="dashboard.card"
              className="relative rounded-xl border p-4 flex flex-col gap-2 transition-all hover:scale-[1.02]"
              style={{
                background: a.unlocked
                  ? `${a.color}08`
                  : "rgba(255,255,255,0.02)",
                borderColor: a.unlocked
                  ? `${a.color}40`
                  : "rgba(255,255,255,0.06)",
                boxShadow: a.unlocked ? `0 0 15px ${a.color}15` : "none",
                opacity: a.unlocked ? 1 : 0.6,
              }}
            >
              {!a.unlocked && (
                <Lock
                  size={14}
                  className="absolute top-3 right-3"
                  style={{ color: "#475569" }}
                />
              )}
              <span className="text-2xl">{a.emoji}</span>
              <p
                className="text-sm font-bold"
                style={{ color: a.unlocked ? "#e2e8f0" : "#64748b" }}
              >
                {a.name}
              </p>
              <p className="text-xs" style={{ color: "#475569" }}>
                {a.desc}
              </p>
              {a.unlocked && (
                <div
                  className="text-xs px-2 py-0.5 rounded-full w-fit"
                  style={{ background: `${a.color}20`, color: a.color }}
                >
                  Unlocked ✓
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Builds */}
        <h2 className="text-xl font-semibold mb-4" style={{ color: "#e2e8f0" }}>
          My Builds
        </h2>
        {loading ? (
          <p data-ocid="dashboard.loading_state" style={{ color: "#64748b" }}>
            Loading...
          </p>
        ) : builds.length === 0 ? (
          <div
            data-ocid="dashboard.empty_state"
            className="rounded-xl border p-10 text-center"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: "rgba(0,212,255,0.1)",
            }}
          >
            <p style={{ color: "#475569" }}>
              No builds yet. Go to Build Mode to create one!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {builds.map((b, idx) => (
              <div
                key={b.id}
                data-ocid={`dashboard.item.${idx + 1}`}
                className="rounded-xl border p-4 flex items-center justify-between"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(0,212,255,0.15)",
                }}
              >
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "#e2e8f0" }}
                  >
                    {b.name}
                  </p>
                  <p className="text-xs" style={{ color: "#64748b" }}>
                    {b.description}
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid={`dashboard.delete_button.${idx + 1}`}
                  onClick={() => deleteBuild(b.id)}
                  className="transition-colors hover:text-red-400"
                  style={{ color: "#475569" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
