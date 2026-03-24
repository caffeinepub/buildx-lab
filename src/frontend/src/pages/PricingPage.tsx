import { useNavigate } from "@tanstack/react-router";
import { Check, Zap } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    tagline: "Perfect for hobbyists",
    color: "#00d4ff",
    features: [
      "3 saved projects",
      "Basic simulations",
      "Community access",
      "Learning guides (beginner)",
      "BuildX AI (10 queries/day)",
    ],
    cta: "Get Started Free",
    recommended: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    tagline: "For serious builders",
    color: "#a855f7",
    features: [
      "Unlimited projects",
      "Advanced physics simulations",
      "Full AI assistant access",
      "Real Build Mode + PDF exports",
      "All learning courses",
      "Priority community support",
      "Achievement & XP system",
    ],
    cta: "Start Pro Trial",
    recommended: true,
  },
  {
    name: "Enterprise",
    price: "₹1,999",
    period: "/month",
    tagline: "Teams & institutions",
    color: "#10b981",
    features: [
      "Everything in Pro",
      "Team collaboration (up to 20)",
      "Priority 24/7 support",
      "Custom integrations",
      "White-label exports",
      "Dedicated account manager",
      "API access",
    ],
    cta: "Contact Sales",
    recommended: false,
  },
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-14">
          <h1
            className="text-4xl md:text-5xl font-black mb-4"
            style={{
              fontFamily: "'Orbitron', monospace",
              background: "linear-gradient(135deg,#00d4ff,#a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Choose Your Plan
          </h1>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "#94a3b8" }}
          >
            Start free and upgrade when you're ready. All plans include core
            BuildX Lab Pro features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              data-ocid="pricing.card"
              className="relative rounded-2xl border p-8 flex flex-col gap-5 transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: plan.recommended
                  ? "linear-gradient(135deg, rgba(168,85,247,0.12), rgba(0,212,255,0.06))"
                  : "rgba(255,255,255,0.03)",
                borderColor: plan.recommended ? plan.color : `${plan.color}40`,
                boxShadow: plan.recommended
                  ? `0 0 40px ${plan.color}30, 0 0 80px ${plan.color}10`
                  : "none",
              }}
            >
              {plan.recommended && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                  style={{
                    background: "linear-gradient(135deg,#a855f7,#00d4ff)",
                    color: "white",
                  }}
                >
                  <Zap size={12} /> RECOMMENDED
                </div>
              )}

              <div>
                <h2
                  className="text-xl font-bold mb-1"
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    color: plan.color,
                  }}
                >
                  {plan.name}
                </h2>
                <p className="text-xs" style={{ color: "#64748b" }}>
                  {plan.tagline}
                </p>
              </div>

              <div className="flex items-end gap-1">
                <span
                  className="text-4xl font-black"
                  style={{ color: "#e2e8f0" }}
                >
                  {plan.price}
                </span>
                <span className="text-sm mb-1" style={{ color: "#64748b" }}>
                  {plan.period}
                </span>
              </div>

              <ul className="flex flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check
                      size={14}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: plan.color }}
                    />
                    <span style={{ color: "#94a3b8" }}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                data-ocid="pricing.primary_button"
                onClick={() =>
                  navigate({ to: plan.name === "Free" ? "/build" : "/contact" })
                }
                className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 mt-auto"
                style={{
                  background: plan.recommended
                    ? "linear-gradient(135deg,#a855f7,#00d4ff)"
                    : `${plan.color}20`,
                  border: plan.recommended
                    ? "none"
                    : `1px solid ${plan.color}60`,
                  color: plan.recommended ? "white" : plan.color,
                  boxShadow: plan.recommended
                    ? `0 0 20px ${plan.color}40`
                    : "none",
                }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-10" style={{ color: "#475569" }}>
          All prices in Indian Rupees (₹). Cancel anytime. No hidden fees.
        </p>
      </div>
    </div>
  );
}
