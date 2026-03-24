import { Heart, MessageSquare, Upload } from "lucide-react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const MOCK_BUILDS = [
  {
    id: "b1",
    title: "Quad Racer X1",
    author: "xPilot99",
    likes: 142,
    comments: 23,
    gradient: "linear-gradient(135deg,#00BFFF,#A020F0)",
    emoji: "🚁",
  },
  {
    id: "b2",
    title: "Desert Crawler",
    author: "MechBuilder",
    likes: 89,
    comments: 11,
    gradient: "linear-gradient(135deg,#10b981,#22d3ee)",
    emoji: "🚗",
  },
  {
    id: "b3",
    title: "Bipedal Bot v2",
    author: "RoboLab",
    likes: 215,
    comments: 45,
    gradient: "linear-gradient(135deg,#f59e0b,#ef4444)",
    emoji: "🤖",
  },
  {
    id: "b4",
    title: "Micro Spinner",
    author: "TinyTech",
    likes: 67,
    comments: 8,
    gradient: "linear-gradient(135deg,#A020F0,#00BFFF)",
    emoji: "⚙️",
  },
  {
    id: "b5",
    title: "Solar Rover",
    author: "EcoEng",
    likes: 178,
    comments: 32,
    gradient: "linear-gradient(135deg,#10b981,#f59e0b)",
    emoji: "☀️",
  },
  {
    id: "b6",
    title: "Arm Assistant",
    author: "ManipX",
    likes: 123,
    comments: 19,
    gradient: "linear-gradient(135deg,#ef4444,#A020F0)",
    emoji: "🦾",
  },
];

export default function CommunityPage() {
  const [builds, setBuilds] = useState(MOCK_BUILDS);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [commentOpen, setCommentOpen] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const { actor } = useActor();
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const likeBuild = async (id: string) => {
    if (liked.has(id)) return;
    setLiked((l) => new Set([...l, id]));
    setBuilds((bs) =>
      bs.map((b) => (b.id === id ? { ...b, likes: b.likes + 1 } : b)),
    );
    if (isAuthenticated && actor) {
      try {
        await actor.likeBuild(id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const submitComment = async (id: string) => {
    if (!commentText.trim()) return;
    setBuilds((bs) =>
      bs.map((b) => (b.id === id ? { ...b, comments: b.comments + 1 } : b)),
    );
    if (isAuthenticated && actor) {
      try {
        await actor.addComment(id, commentText);
      } catch (e) {
        console.error(e);
      }
    }
    setCommentText("");
    setCommentOpen(null);
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1
            className="text-3xl font-bold"
            style={{
              fontFamily: "'Orbitron', monospace",
              background: "linear-gradient(135deg,#00BFFF,#A020F0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Community Builds
          </h1>
          <button
            type="button"
            onClick={() =>
              isAuthenticated ? alert("Share feature coming soon!") : login()
            }
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: "linear-gradient(135deg,#00BFFF,#A020F0)",
              color: "white",
              boxShadow: "0 0 15px rgba(0,191,255,0.3)",
            }}
          >
            <Upload size={16} /> Share Your Build
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {builds.map((b) => (
            <div
              key={b.id}
              className="rounded-xl border overflow-hidden transition-all hover:scale-[1.02]"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(0,191,255,0.15)",
              }}
            >
              <div
                className="h-44 flex items-center justify-center"
                style={{ background: b.gradient, opacity: 0.8 }}
              >
                <span className="text-6xl">{b.emoji}</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold mb-1" style={{ color: "#e2e8f0" }}>
                  {b.title}
                </h3>
                <p className="text-xs mb-3" style={{ color: "#64748b" }}>
                  by {b.author}
                </p>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => likeBuild(b.id)}
                    className="flex items-center gap-1 text-xs transition-all"
                    style={{ color: liked.has(b.id) ? "#ef4444" : "#64748b" }}
                  >
                    <Heart
                      size={14}
                      fill={liked.has(b.id) ? "#ef4444" : "none"}
                    />{" "}
                    {b.likes}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCommentOpen(commentOpen === b.id ? null : b.id)
                    }
                    className="flex items-center gap-1 text-xs transition-all hover:text-white"
                    style={{ color: "#64748b" }}
                  >
                    <MessageSquare size={14} /> {b.comments}
                  </button>
                </div>
                {commentOpen === b.id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      className="flex-1 bg-white/5 rounded px-2 py-1 text-xs outline-none border"
                      style={{
                        borderColor: "rgba(0,191,255,0.2)",
                        color: "#e2e8f0",
                      }}
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && submitComment(b.id)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => submitComment(b.id)}
                      className="px-2 py-1 rounded text-xs"
                      style={{ background: "#00BFFF", color: "#05050f" }}
                    >
                      Post
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
