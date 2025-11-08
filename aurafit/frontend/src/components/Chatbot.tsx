import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import api, { handleApiError } from "@/api/client";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I'm AuraFit AI Coach. How can I help you with your fitness journey today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Local offline response generator when backend is unavailable
  const getLocalResponse = (message: string) => {
    const m = message.toLowerCase();
    if (/(hi|hello|hey)/.test(m)) {
      return "Hey! 👋 I'm here to help with workouts, nutrition, and motivation. Ask me anything!";
    }
    if (/workout|exercise|plan|routine/.test(m)) {
      return "For a balanced routine, try: 3x/week full-body (squats, push-ups, rows, planks). Aim for 3 sets of 8–12 reps. Want a beginner, intermediate, or advanced plan?";
    }
    if (/nutrition|diet|meal|calorie|protein/.test(m)) {
      return "Start with protein at ~1.6–2.2g/kg bodyweight. Fill plates with lean protein, colorful veggies, smart carbs, and healthy fats. Need a sample meal plan?";
    }
    if (/weight|fat|lose|gain|bulk|cut/.test(m)) {
      return "Fat loss: small calorie deficit + daily steps + 3 strength days. Muscle gain: slight surplus + progressive overload. I can outline a 4-week strategy if you like!";
    }
    if (/rest|recovery|sleep|sore/.test(m)) {
      return "Prioritize 7–9h sleep, hydration, light mobility, and deload weeks every 6–8 weeks. Recovery fuels results.";
    }
    return "Got it! While the server is offline, I'm giving smart tips locally. Tell me your goal (fat loss, muscle gain, general fitness) and available equipment.";
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = input.trim();
    if (!message || isTyping) return;

    // Add user message
    const userMessage: Message = {
      sender: "user",
      text: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const { data } = await api.post(
        "/chatbot",
        { message },
        {
          timeout: 4000,
        },
      );

      const text: string = data?.response || getLocalResponse(message);

      const botMessage: Message = {
        sender: "bot",
        text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", handleApiError(error));
      const offlineMessage: Message = {
        sender: "bot",
        text: getLocalResponse(message),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, offlineMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary shadow-neon flex items-center justify-center hover:scale-110 transition-all duration-300 animate-pulse-glow group"
          aria-label="Open chatbot"
        >
          <MessageSquare className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-ping" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 border border-primary/30 shadow-2xl backdrop-blur-xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-4 border-b border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white">AuraFit AI Coach</h3>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Close chatbot"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatBoxRef}
            className="h-[480px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900/50 to-transparent"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "hsl(var(--primary)) transparent",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 animate-fade-in ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-primary to-purple-600 text-white"
                      : "bg-slate-800/80 text-foreground border border-primary/20"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <span className="text-xs opacity-60 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-800/80 rounded-2xl px-4 py-3 border border-primary/20">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={sendMessage} className="p-4 border-t border-primary/20 bg-slate-900/50">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about fitness..."
                className="flex-1 px-4 py-2 rounded-xl bg-slate-800/80 border border-primary/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                disabled={isTyping}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

