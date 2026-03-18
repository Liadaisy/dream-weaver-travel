import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { MapPin, Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isAssistant ? "" : "flex-row-reverse"}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isAssistant ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
        }`}
      >
        {isAssistant ? <MapPin className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isAssistant
            ? "bg-card shadow-card border border-border"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {isAssistant ? (
          <div className="prose prose-sm max-w-none text-card-foreground prose-headings:font-display prose-headings:text-card-foreground prose-strong:text-card-foreground prose-p:text-card-foreground">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm">{content}</p>
        )}
      </div>
    </motion.div>
  );
}
