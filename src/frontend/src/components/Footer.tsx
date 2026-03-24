import { Github, Twitter, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="mt-20 border-t"
      style={{
        borderColor: "rgba(0,191,255,0.1)",
        background: "rgba(5,5,15,0.95)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={18} style={{ color: "#00BFFF" }} />
            <span
              className="font-bold tracking-wider"
              style={{
                fontFamily: "'Orbitron', monospace",
                background: "linear-gradient(135deg,#00BFFF,#A020F0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              BuildX Lab
            </span>
          </div>
          <p className="text-sm" style={{ color: "#64748b" }}>
            The future of virtual engineering. Design, simulate, and share your
            machines.
          </p>
        </div>
        <div>
          <h4
            className="text-sm font-semibold mb-3"
            style={{ color: "#00BFFF" }}
          >
            About Us
          </h4>
          <ul className="space-y-2 text-sm" style={{ color: "#64748b" }}>
            <li>
              <a href="/" className="hover:text-white transition-colors">
                Our Mission
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-white transition-colors">
                Team
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-white transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4
            className="text-sm font-semibold mb-3"
            style={{ color: "#00BFFF" }}
          >
            Connect
          </h4>
          <div className="flex gap-4">
            <a
              href="/"
              className="transition-colors hover:text-white"
              style={{ color: "#64748b" }}
            >
              <Github size={20} />
            </a>
            <a
              href="/"
              className="transition-colors hover:text-white"
              style={{ color: "#64748b" }}
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
      <div
        className="border-t text-center py-4 text-xs"
        style={{ borderColor: "rgba(0,191,255,0.1)", color: "#475569" }}
      >
        © 2026 BuildX Lab. All rights reserved.
      </div>
    </footer>
  );
}
