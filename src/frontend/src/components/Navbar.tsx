import { Link, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, Moon, Sun, X, Zap } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const links = [
  { to: "/", label: "Home" },
  { to: "/build", label: "Build Lab" },
  { to: "/simulate", label: "Simulate" },
  { to: "/learn", label: "Learn" },
  { to: "/community", label: "Community" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;

export default function Navbar() {
  const { identity, login, clear } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const [open, setOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{
        background: isDark ? "rgba(5,5,15,0.88)" : "rgba(240,244,255,0.88)",
        borderColor: isDark ? "rgba(0,212,255,0.15)" : "rgba(0,102,204,0.15)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" data-ocid="nav.link" className="flex items-center gap-2">
          <Zap size={22} style={{ color: "#00d4ff" }} />
          <span
            className="font-bold text-lg tracking-wider"
            style={{
              fontFamily: "'Orbitron', monospace",
              background: "linear-gradient(135deg,#00d4ff,#a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            BuildX Lab Pro
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-5">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              data-ocid="nav.link"
              className="text-sm font-medium transition-colors duration-200"
              style={{
                color:
                  pathname === l.to
                    ? "#00d4ff"
                    : isDark
                      ? "#94a3b8"
                      : "#475569",
                textShadow:
                  pathname === l.to ? "0 0 10px rgba(0,212,255,0.6)" : "none",
              }}
            >
              {l.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={toggleTheme}
            data-ocid="nav.toggle"
            className="p-2 rounded-lg border transition-all hover:scale-110"
            style={{
              borderColor: isDark
                ? "rgba(0,212,255,0.25)"
                : "rgba(0,102,204,0.25)",
              color: isDark ? "#00d4ff" : "#0066cc",
            }}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                data-ocid="nav.link"
                className="text-sm font-medium"
                style={{ color: "#a855f7" }}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => clear()}
                data-ocid="nav.secondary_button"
                className="flex items-center gap-1 text-sm px-3 py-1.5 rounded border transition-all"
                style={{
                  borderColor: "rgba(168,85,247,0.4)",
                  color: "#a855f7",
                }}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => login()}
              data-ocid="nav.primary_button"
              className="text-sm px-4 py-1.5 rounded font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: "linear-gradient(135deg,#00d4ff,#a855f7)",
                boxShadow: "0 0 15px rgba(0,212,255,0.3)",
                color: "white",
              }}
            >
              Sign In
            </button>
          )}
        </div>

        <button
          type="button"
          className="md:hidden"
          data-ocid="nav.toggle"
          onClick={() => setOpen(!open)}
          style={{ color: "#00d4ff" }}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div
          className="md:hidden px-4 pb-4 flex flex-col gap-3"
          style={{
            borderTop: isDark
              ? "1px solid rgba(0,212,255,0.1)"
              : "1px solid rgba(0,102,204,0.1)",
          }}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              data-ocid="nav.link"
              onClick={() => setOpen(false)}
              className="text-sm py-2"
              style={{
                color:
                  pathname === l.to
                    ? "#00d4ff"
                    : isDark
                      ? "#94a3b8"
                      : "#475569",
              }}
            >
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            data-ocid="nav.toggle"
            className="flex items-center gap-2 text-sm py-2"
            style={{ color: "#00d4ff" }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                data-ocid="nav.link"
                onClick={() => setOpen(false)}
                className="text-sm py-2"
                style={{ color: "#a855f7" }}
              >
                Dashboard
              </Link>
              <button
                type="button"
                data-ocid="nav.secondary_button"
                onClick={() => {
                  clear();
                  setOpen(false);
                }}
                className="text-sm py-2 text-left"
                style={{ color: "#a855f7" }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              data-ocid="nav.primary_button"
              onClick={() => {
                login();
                setOpen(false);
              }}
              className="text-sm px-4 py-2 rounded font-semibold w-fit"
              style={{
                background: "linear-gradient(135deg,#00d4ff,#a855f7)",
                color: "white",
              }}
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
