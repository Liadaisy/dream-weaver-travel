import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { MapPin, User } from "lucide-react";
import PlaceImage from "./PlaceImage";
import DirectionsButton from "./DirectionsButton";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

function parseSpecialMarkers(content: string) {
  const parts: { type: "text" | "image" | "directions"; value: string }[] = [];
  const regex = /\[(IMAGE|DIRECTIONS):\s*(.+?)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: content.slice(lastIndex, match.index) });
    }
    parts.push({
      type: match[1] === "IMAGE" ? "image" : "directions",
      value: match[2].trim(),
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "text", value: content.slice(lastIndex) });
  }

  return parts;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isAssistant = role === "assistant";
  const parts = isAssistant ? parseSpecialMarkers(content) : [{ type: "text" as const, value: content }];

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
            {parts.map((part, i) => {
              if (part.type === "image") return <PlaceImage key={i} place={part.value} />;
              if (part.type === "directions") return <DirectionsButton key={i} place={part.value} />;
              return <ReactMarkdown key={i}>{part.value}</ReactMarkdown>;
            })}
          </div>
        ) : (
          <p className="text-sm">{content}</p>
        )}
      </div>
    </motion.div>
  );
}
