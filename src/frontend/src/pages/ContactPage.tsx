import { Github, MessageCircle, Send, Twitter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent! We'll get back to you within 24 hours.");
    }, 1200);
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-black mb-3"
            style={{
              fontFamily: "'Orbitron', monospace",
              background: "linear-gradient(135deg,#00d4ff,#a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Contact Us
          </h1>
          <p style={{ color: "#94a3b8" }}>
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div
          className="rounded-2xl border p-8 mb-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(0,212,255,0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            data-ocid="contact.modal"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-name"
                  className="text-xs font-semibold"
                  style={{ color: "#00d4ff" }}
                >
                  Name *
                </label>
                <input
                  id="contact-name"
                  data-ocid="contact.input"
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Your full name"
                  className="px-4 py-3 rounded-xl border bg-transparent text-sm outline-none transition-all"
                  style={{
                    borderColor: "rgba(0,212,255,0.25)",
                    color: "#e2e8f0",
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-email"
                  className="text-xs font-semibold"
                  style={{ color: "#00d4ff" }}
                >
                  Email *
                </label>
                <input
                  id="contact-email"
                  data-ocid="contact.input"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                  className="px-4 py-3 rounded-xl border bg-transparent text-sm outline-none transition-all"
                  style={{
                    borderColor: "rgba(0,212,255,0.25)",
                    color: "#e2e8f0",
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-subject"
                className="text-xs font-semibold"
                style={{ color: "#00d4ff" }}
              >
                Subject
              </label>
              <input
                id="contact-subject"
                data-ocid="contact.input"
                type="text"
                value={form.subject}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subject: e.target.value }))
                }
                placeholder="What's this about?"
                className="px-4 py-3 rounded-xl border bg-transparent text-sm outline-none transition-all"
                style={{
                  borderColor: "rgba(0,212,255,0.25)",
                  color: "#e2e8f0",
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-message"
                className="text-xs font-semibold"
                style={{ color: "#00d4ff" }}
              >
                Message *
              </label>
              <textarea
                id="contact-message"
                data-ocid="contact.textarea"
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                placeholder="Tell us how we can help..."
                rows={5}
                className="px-4 py-3 rounded-xl border bg-transparent text-sm outline-none transition-all resize-none"
                style={{
                  borderColor: "rgba(0,212,255,0.25)",
                  color: "#e2e8f0",
                }}
              />
            </div>

            <button
              type="submit"
              data-ocid="contact.submit_button"
              disabled={submitting}
              className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg,#00d4ff,#a855f7)",
                color: "white",
                boxShadow: "0 0 20px rgba(0,212,255,0.3)",
              }}
            >
              <Send size={16} />
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm mb-4" style={{ color: "#64748b" }}>
            Or connect with us on
          </p>
          <div className="flex items-center justify-center gap-6">
            {[
              { icon: Github, label: "GitHub", href: "https://github.com" },
              { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
              {
                icon: MessageCircle,
                label: "Discord",
                href: "https://discord.com",
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                data-ocid="contact.link"
                className="flex items-center gap-2 text-sm transition-all hover:scale-110"
                style={{ color: "#00d4ff" }}
              >
                <s.icon size={20} />
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
