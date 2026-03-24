import { Bot, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  text: string;
  from: "user" | "bot";
}

const QA: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["overheat", "overheating", "hot", "motor hot"],
    answer:
      "Motor overheating causes: 1) Check current load — may exceed rated amps. 2) Ensure adequate cooling (heatsink or fan). 3) Reduce supply voltage. 4) Verify motor ratings match your application. 5) Check for friction or mechanical binding in the drivetrain.",
  },
  {
    keywords: ["drone", "fly", "flying", "hover", "lifting", "not lifting"],
    answer:
      "Drone not lifting? Check: 1) Propeller direction (2 CW, 2 CCW on diagonal motors). 2) Battery charge level (>3.7V/cell). 3) Motor balance — all should spin freely. 4) ESC calibration — recalibrate all 4 ESCs. 5) Flight controller orientation and PID tuning.",
  },
  {
    keywords: ["rc car", "steering", "steering issue", "rc steering"],
    answer:
      "RC car steering issue fix: 1) Calibrate the servo — set trim/sub-trim to center. 2) Inspect the steering rod for bends or loose connections. 3) Check ESC settings for steering expo/dual-rate. 4) Verify servo horn is secured to shaft. 5) Test servo separately with a servo tester.",
  },
  {
    keywords: ["battery", "draining", "drain", "power", "voltage", "short"],
    answer:
      "Battery draining fast? 1) Check wiring for short circuits — use a multimeter. 2) Reduce load (remove unnecessary components). 3) Use a higher capacity battery (mAh). 4) Ensure battery rating matches device requirements. 5) Check for parasitic drain from always-on modules.",
  },
  {
    keywords: ["robot", "not responding", "robot stuck", "microcontroller"],
    answer:
      "Robot not responding: 1) Check all power connections and ensure proper voltage. 2) Reset the microcontroller (press reset button or power cycle). 3) Verify code was uploaded successfully — check for upload errors. 4) Test each component individually. 5) Check serial monitor for error messages.",
  },
  {
    keywords: ["dc motor", "wire", "wiring", "motor"],
    answer:
      "To wire a DC motor: Connect positive terminal to power (+), negative to ground (−). For speed control, use a PWM driver like L298N. Red wire = V+, Black = GND. Reverse wires to reverse direction. For Arduino control: use analogWrite() for speed and digitalWrite() for direction.",
  },
  {
    keywords: ["servo", "servo motor", "pwm"],
    answer:
      "Servo motor wiring: Red=5V, Brown=GND, Orange/Yellow=Signal. Uses PWM (50Hz): 1ms pulse = 0°, 1.5ms = 90°, 2ms = 180°. On Arduino: use the Servo library. Call servo.attach(pin) then servo.write(angle). Ensure your power supply can handle servo stall current.",
  },
  {
    keywords: ["sensor", "ultrasonic", "distance", "hc-sr04"],
    answer:
      "HC-SR04 wiring: VCC→5V, GND→GND, Trig→digital pin, Echo→digital pin. Send 10µs pulse on Trig, measure Echo pulse duration. Distance = (duration × 0.034) / 2 cm. Max range ~400cm. For better accuracy use NewPing library. Avoid obstacles closer than 2cm.",
  },
  {
    keywords: ["arduino", "code", "programming", "sketch"],
    answer:
      "Arduino tips: 1) Use setup() for one-time initialization and loop() for repeated logic. 2) Serial.begin(9600) to enable serial monitor. 3) Use pinMode() to set digital pins as INPUT or OUTPUT. 4) analogRead() for sensors (0–1023), analogWrite() for PWM output. 5) Download libraries via Sketch > Include Library > Manage Libraries.",
  },
  {
    keywords: ["build", "start", "begin", "how to build", "where to start"],
    answer:
      "Starting a build? Here's the process: 1) Open Build Lab and choose your machine type (Drone, RC Car, Robot, etc.). 2) Drag parts from the parts library onto the canvas. 3) Use the AI suggestions for recommended combinations. 4) Run Simulation to test physics and power balance. 5) Switch to Real Build Mode for a parts list with ₹ prices and purchase links.",
  },
];

const GREETINGS = [
  "hi",
  "hello",
  "hlo",
  "hey",
  "hii",
  "helo",
  "howdy",
  "sup",
  "yo",
  "namaste",
  "salaam",
];

function getBotResponse(text: string): string {
  const lower = text.trim().toLowerCase();

  // Greeting detection
  if (
    GREETINGS.some(
      (g) =>
        lower === g || lower.startsWith(`${g} `) || lower.startsWith(`${g}!`),
    )
  ) {
    return "Hey there! I'm BuildX AI, your engineering assistant. Ask me about motors, drones, RC cars, robots, wiring, sensors, or anything related to your build!";
  }

  // Thanks / goodbye
  if (
    ["thanks", "thank you", "thx", "ty", "bye", "goodbye", "ok thanks"].some(
      (t) => lower.includes(t),
    )
  ) {
    return "You're welcome! Feel free to ask whenever you need help with your build. Happy building!";
  }

  // What can you do
  if (
    lower.includes("what can you") ||
    lower.includes("help me") ||
    lower.includes("what do you do")
  ) {
    return "I can help with: motor wiring, drone setup, RC car troubleshooting, robot programming, battery selection, sensor integration, Arduino code, and general electronics. Just ask your question!";
  }

  for (const qa of QA) {
    if (qa.keywords.some((kw) => lower.includes(kw))) return qa.answer;
  }

  return "Interesting question! For detailed guides on this topic, check the Learning Hub. In general: verify power supply first, test components individually, and always check your connections with a multimeter. You can also ask something more specific like 'how to wire a DC motor' or 'drone not lifting'.";
}

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hi! I'm BuildX AI. Ask me any engineering question!",
      from: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll trigger
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, typing]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input, from: "user" };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    const reply = getBotResponse(input);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, text: reply, from: "bot" },
      ]);
    }, 1400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          data-ocid="chat.modal"
          className="w-80 rounded-xl border overflow-hidden shadow-2xl flex flex-col"
          style={{
            background: "#0b0b1a",
            borderColor: "rgba(0,212,255,0.25)",
            boxShadow: "0 0 40px rgba(0,212,255,0.15)",
            height: 420,
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{
              borderColor: "rgba(0,212,255,0.15)",
              background:
                "linear-gradient(135deg,rgba(0,212,255,0.1),rgba(168,85,247,0.1))",
            }}
          >
            <div className="flex items-center gap-2">
              <Bot size={18} style={{ color: "#00d4ff" }} />
              <span
                className="text-sm font-semibold"
                style={{
                  color: "#00d4ff",
                  fontFamily: "'Orbitron', monospace",
                }}
              >
                BuildX AI
              </span>
            </div>
            <button
              type="button"
              data-ocid="chat.close_button"
              onClick={() => setOpen(false)}
              style={{ color: "#64748b" }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="text-xs px-3 py-2 rounded-xl max-w-[85%] leading-relaxed"
                  style={{
                    background:
                      m.from === "user"
                        ? "linear-gradient(135deg,#00d4ff,#a855f7)"
                        : "rgba(255,255,255,0.06)",
                    color: "#e2e8f0",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div
                  className="text-xs px-3 py-2 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "#64748b",
                  }}
                >
                  <span className="animate-pulse">typing...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div
            className="p-3 border-t flex gap-2"
            style={{ borderColor: "rgba(0,212,255,0.1)" }}
          >
            <input
              data-ocid="chat.input"
              className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-xs outline-none border"
              style={{ borderColor: "rgba(0,212,255,0.2)", color: "#e2e8f0" }}
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              type="button"
              data-ocid="chat.primary_button"
              onClick={send}
              className="px-3 py-2 rounded-lg transition-all"
              style={{ background: "#00d4ff", color: "#05050f" }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        data-ocid="chat.open_modal_button"
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
        style={{
          background: "linear-gradient(135deg,#00d4ff,#a855f7)",
          boxShadow: "0 0 25px rgba(0,212,255,0.5)",
        }}
      >
        <Bot size={24} color="white" />
      </button>
    </div>
  );
}
