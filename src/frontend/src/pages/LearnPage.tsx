import { CheckCircle, Clock, Play, Trophy } from "lucide-react";
import { useState } from "react";
import AnimatedDemos from "../components/AnimatedDemos";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type Difficulty = "All" | "Beginner" | "Intermediate" | "Advanced";

const GUIDES = [
  {
    id: "g1",
    title: "Intro to DC Motors",
    desc: "Learn how DC motors work and how to wire them safely.",
    difficulty: "Beginner" as const,
    time: "10 min",
    emoji: "⚡",
    topic: "DC Motors",
  },
  {
    id: "g2",
    title: "Your First Circuit",
    desc: "Build a basic LED circuit with a resistor and battery.",
    difficulty: "Beginner" as const,
    time: "15 min",
    emoji: "💡",
    topic: "DC Motors",
  },
  {
    id: "g3",
    title: "Arduino Basics",
    desc: "Setup Arduino IDE and blink your first LED.",
    difficulty: "Beginner" as const,
    time: "20 min",
    emoji: "🔧",
    topic: "RC Cars",
  },
  {
    id: "g4",
    title: "Servo Control",
    desc: "Control servo motor angles with PWM signals.",
    difficulty: "Intermediate" as const,
    time: "25 min",
    emoji: "🎮",
    topic: "RC Cars",
  },
  {
    id: "g5",
    title: "Ultrasonic Sensors",
    desc: "Measure distance using HC-SR04 ultrasonic sensor.",
    difficulty: "Intermediate" as const,
    time: "20 min",
    emoji: "📡",
    topic: "Robot Assembly",
  },
  {
    id: "g6",
    title: "PID Control Theory",
    desc: "Understand proportional-integral-derivative control.",
    difficulty: "Intermediate" as const,
    time: "35 min",
    emoji: "📊",
    topic: "Robot Assembly",
  },
  {
    id: "g7",
    title: "Drone Flight Dynamics",
    desc: "Quadcopter physics, thrust, torque, and stability.",
    difficulty: "Advanced" as const,
    time: "45 min",
    emoji: "🚁",
    topic: "Drone Basics",
  },
  {
    id: "g8",
    title: "Motor Driver ICs",
    desc: "Design H-bridge circuits with L298N and L293D.",
    difficulty: "Advanced" as const,
    time: "40 min",
    emoji: "🔌",
    topic: "Drone Basics",
  },
  {
    id: "g9",
    title: "ROS for Robotics",
    desc: "Introduction to Robot Operating System architecture.",
    difficulty: "Advanced" as const,
    time: "60 min",
    emoji: "🤖",
    topic: "Robot Assembly",
  },
];

const VIDEOS = [
  {
    id: "v1",
    title: "Build a Drone From Scratch",
    thumb: "🚁",
    duration: "32 min",
    difficulty: "Advanced" as const,
  },
  {
    id: "v2",
    title: "Beginner's Guide to Electronics",
    thumb: "⚡",
    duration: "18 min",
    difficulty: "Beginner" as const,
  },
  {
    id: "v3",
    title: "Arduino Robot Car Build",
    thumb: "🚗",
    duration: "24 min",
    difficulty: "Intermediate" as const,
  },
];

const QUIZZES: Record<
  string,
  { q: string; options: string[]; answer: number }[]
> = {
  "Drone Basics": [
    {
      q: "How many motors does a standard quadcopter have?",
      options: ["2", "4", "6", "8"],
      answer: 1,
    },
    {
      q: "What does ESC stand for?",
      options: [
        "Electric Speed Controller",
        "Electronic Speed Controller",
        "Engine Speed Control",
        "External Speed Circuit",
      ],
      answer: 1,
    },
    {
      q: "Which rotation pattern is used in quadcopters for stability?",
      options: [
        "All clockwise",
        "All counter-clockwise",
        "2 CW and 2 CCW",
        "Alternating randomly",
      ],
      answer: 2,
    },
  ],
  "RC Cars": [
    {
      q: "What component controls RC car speed electronically?",
      options: ["Servo", "ESC", "Gyro", "BEC"],
      answer: 1,
    },
    {
      q: "Which battery type is commonly used in RC cars?",
      options: ["NiCd", "Lead-acid", "LiPo", "Alkaline"],
      answer: 2,
    },
    {
      q: "What does PWM stand for in servo control?",
      options: [
        "Pulse Width Modulation",
        "Power Wire Management",
        "Periodic Wave Motion",
        "Positional Wave Mode",
      ],
      answer: 0,
    },
  ],
  "DC Motors": [
    {
      q: "How do you reverse a DC motor's direction?",
      options: [
        "Reduce voltage",
        "Swap polarity",
        "Increase resistance",
        "Change frequency",
      ],
      answer: 1,
    },
    {
      q: "What IC is commonly used as an H-bridge for DC motors?",
      options: ["555 Timer", "LM741", "L298N", "NE555"],
      answer: 2,
    },
    {
      q: "What is the unit of motor speed?",
      options: ["Watts", "Volts", "RPM", "Ohms"],
      answer: 2,
    },
  ],
  "Robot Assembly": [
    {
      q: "What does ROS stand for?",
      options: [
        "Robot Output System",
        "Robot Operating System",
        "Robotic Object Sensor",
        "Remote Operation Software",
      ],
      answer: 1,
    },
    {
      q: "Which sensor is used for obstacle avoidance?",
      options: [
        "Temperature sensor",
        "Pressure sensor",
        "Ultrasonic sensor",
        "Light sensor",
      ],
      answer: 2,
    },
    {
      q: "What does PID stand for in control theory?",
      options: [
        "Proportional Integral Derivative",
        "Precision Input Device",
        "Position Index Data",
        "Power Interface Driver",
      ],
      answer: 0,
    },
  ],
};

const DIFF_COLORS: Record<string, string> = {
  Beginner: "#10b981",
  Intermediate: "#f59e0b",
  Advanced: "#ef4444",
};

interface QuizState {
  topic: string;
  step: number;
  answers: (number | null)[];
  done: boolean;
}

export default function LearnPage() {
  const [filter, setFilter] = useState<Difficulty>("All");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const filtered = GUIDES.filter(
    (g) => filter === "All" || g.difficulty === filter,
  );

  const markComplete = async (id: string) => {
    setCompleted((c) => new Set([...c, id]));
    if (isAuthenticated && actor) {
      try {
        await actor.completeGuide(id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const startQuiz = (topic: string) => {
    setQuiz({ topic, step: 0, answers: [null, null, null], done: false });
  };

  const answerQuiz = (optIdx: number) => {
    if (!quiz || quiz.done) return;
    const answers = [...quiz.answers];
    answers[quiz.step] = optIdx;
    if (quiz.step < 2) {
      setQuiz({ ...quiz, answers, step: quiz.step + 1 });
    } else {
      setQuiz({ ...quiz, answers, done: true });
    }
  };

  const quizScore = () => {
    if (!quiz) return 0;
    const questions = QUIZZES[quiz.topic];
    return quiz.answers.filter((a, i) => a === questions[i].answer).length;
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1
          className="text-3xl font-bold mb-4"
          style={{
            fontFamily: "'Orbitron', monospace",
            background: "linear-gradient(135deg,#00d4ff,#a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Learning Center
        </h1>
        <p className="text-sm mb-8" style={{ color: "#64748b" }}>
          {completed.size} / {GUIDES.length} guides completed
        </p>

        <div className="flex gap-2 mb-8 flex-wrap">
          {(
            ["All", "Beginner", "Intermediate", "Advanced"] as Difficulty[]
          ).map((d) => (
            <button
              type="button"
              key={d}
              onClick={() => setFilter(d)}
              data-ocid="learn.filter.tab"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background:
                  filter === d
                    ? "linear-gradient(135deg,#00d4ff,#a855f7)"
                    : "rgba(255,255,255,0.05)",
                border: filter === d ? "none" : "1px solid rgba(0,212,255,0.2)",
                color: filter === d ? "white" : "#94a3b8",
              }}
            >
              {d}
            </button>
          ))}
        </div>

        <AnimatedDemos />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {filtered.map((g, idx) => (
            <div
              key={g.id}
              data-ocid={`learn.item.${idx + 1}`}
              className="rounded-xl border p-5 flex flex-col gap-3 transition-all hover:scale-[1.02]"
              style={{
                background: completed.has(g.id)
                  ? "rgba(16,185,129,0.05)"
                  : "rgba(255,255,255,0.03)",
                borderColor: completed.has(g.id)
                  ? "rgba(16,185,129,0.3)"
                  : "rgba(0,212,255,0.15)",
              }}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{g.emoji}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: `${DIFF_COLORS[g.difficulty]}20`,
                    color: DIFF_COLORS[g.difficulty],
                  }}
                >
                  {g.difficulty}
                </span>
              </div>
              <div>
                <h3
                  className="font-semibold text-sm mb-1"
                  style={{ color: "#e2e8f0" }}
                >
                  {g.title}
                </h3>
                <p className="text-xs" style={{ color: "#64748b" }}>
                  {g.desc}
                </p>
              </div>
              <div
                className="flex items-center gap-2 text-xs"
                style={{ color: "#475569" }}
              >
                <Clock size={12} /> {g.time}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => markComplete(g.id)}
                  disabled={completed.has(g.id)}
                  data-ocid={`learn.item.${idx + 1}`}
                  className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: completed.has(g.id)
                      ? "rgba(16,185,129,0.2)"
                      : "linear-gradient(135deg,#00d4ff,#a855f7)",
                    color: completed.has(g.id) ? "#10b981" : "white",
                  }}
                >
                  {completed.has(g.id) ? (
                    <>
                      <CheckCircle size={13} /> Completed
                    </>
                  ) : (
                    "Mark Complete"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => startQuiz(g.topic)}
                  data-ocid={`learn.quiz.button.${idx + 1}`}
                  className="px-3 py-2 rounded-lg text-xs font-semibold border transition-all hover:scale-105"
                  style={{
                    borderColor: "rgba(168,85,247,0.4)",
                    color: "#a855f7",
                  }}
                >
                  📝 Quiz
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2
          className="text-xl font-bold mb-5"
          style={{ fontFamily: "'Orbitron', monospace", color: "#e2e8f0" }}
        >
          Video Tutorials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {VIDEOS.filter(
            (v) => filter === "All" || v.difficulty === filter,
          ).map((v) => (
            <div
              key={v.id}
              className="rounded-xl border overflow-hidden transition-all hover:scale-[1.02] cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(0,212,255,0.15)",
              }}
            >
              <div
                className="h-36 flex items-center justify-center relative"
                style={{ background: "rgba(0,212,255,0.05)" }}
              >
                <span className="text-5xl">{v.thumb}</span>
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(0,0,0,0.4)" }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,212,255,0.8)" }}
                  >
                    <Play size={20} fill="white" color="white" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4
                  className="text-sm font-semibold mb-1"
                  style={{ color: "#e2e8f0" }}
                >
                  {v.title}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#64748b" }}>
                    {v.duration}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: `${DIFF_COLORS[v.difficulty]}20`,
                      color: DIFF_COLORS[v.difficulty],
                    }}
                  >
                    {v.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Modal */}
      {quiz && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && setQuiz(null)}
          onKeyDown={(e) => e.key === "Escape" && setQuiz(null)}
        >
          <div
            data-ocid="learn.modal"
            className="w-full max-w-lg rounded-2xl border p-8 flex flex-col gap-5"
            style={{
              background: "#0d0d20",
              borderColor: "rgba(168,85,247,0.3)",
              boxShadow: "0 0 40px rgba(168,85,247,0.2)",
            }}
          >
            {!quiz.done ? (
              <>
                <div className="flex items-center justify-between">
                  <h3
                    className="text-lg font-bold"
                    style={{
                      fontFamily: "'Orbitron', monospace",
                      color: "#a855f7",
                    }}
                  >
                    {quiz.topic} Quiz
                  </h3>
                  <span className="text-xs" style={{ color: "#64748b" }}>
                    Q{quiz.step + 1} / 3
                  </span>
                </div>
                <p className="text-sm" style={{ color: "#e2e8f0" }}>
                  {QUIZZES[quiz.topic][quiz.step].q}
                </p>
                <div className="flex flex-col gap-2">
                  {QUIZZES[quiz.topic][quiz.step].options.map((opt, i) => (
                    <button
                      key={opt}
                      type="button"
                      data-ocid={`learn.quiz.button.${i + 1}`}
                      onClick={() => answerQuiz(i)}
                      className="text-left px-4 py-3 rounded-xl border text-sm transition-all hover:scale-[1.01]"
                      style={{
                        borderColor: "rgba(168,85,247,0.3)",
                        background: "rgba(168,85,247,0.05)",
                        color: "#e2e8f0",
                      }}
                    >
                      {String.fromCharCode(65 + i)}. {opt}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  data-ocid="learn.close_button"
                  onClick={() => setQuiz(null)}
                  className="text-xs self-end"
                  style={{ color: "#475569" }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <div className="text-center flex flex-col items-center gap-4">
                <Trophy
                  size={48}
                  style={{ color: quizScore() >= 2 ? "#f59e0b" : "#64748b" }}
                />
                <h3
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    color: quizScore() >= 2 ? "#f59e0b" : "#e2e8f0",
                  }}
                >
                  {quizScore() >= 2 ? "🎉 Course Passed!" : "Keep Practicing"}
                </h3>
                <p className="text-sm" style={{ color: "#94a3b8" }}>
                  You scored {quizScore()} out of 3
                </p>
                {quizScore() >= 2 && (
                  <div
                    className="px-5 py-2 rounded-full text-sm font-bold"
                    style={{
                      background: "linear-gradient(135deg,#f59e0b,#ef4444)",
                      color: "white",
                    }}
                  >
                    🏅 {quiz.topic} — Course Passed Badge
                  </div>
                )}
                <button
                  type="button"
                  data-ocid="learn.close_button"
                  onClick={() => setQuiz(null)}
                  className="px-6 py-2 rounded-xl text-sm font-semibold"
                  style={{
                    background: "linear-gradient(135deg,#00d4ff,#a855f7)",
                    color: "white",
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
