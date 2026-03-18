import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-2.5 ${isAssistant ? "" : "flex-row-reverse"}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-1 ${
          isAssistant
            ? "gradient-ocean shadow-sm"
            : "bg-accent shadow-sm"
        }`}
      >
        {isAssistant ? (
          <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
        ) : (
          <User className="w-3.5 h-3.5 text-accent-foreground" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[85%] rounded-2xl ${
          isAssistant
            ? "bg-card/90 backdrop-blur-sm border border-border/60 shadow-card px-4 py-3"
            : "gradient-sunset text-primary-foreground px-4 py-2.5"
        }`}
      >
        {isAssistant ? (
          <div className="prose prose-sm max-w-none text-card-foreground
            prose-headings:font-display prose-headings:text-card-foreground prose-headings:mt-3 prose-headings:mb-1.5 prose-headings:text-base
            prose-p:text-card-foreground prose-p:my-1 prose-p:text-[13px] prose-p:leading-relaxed
            prose-strong:text-card-foreground prose-strong:font-semibold
            prose-ul:my-1 prose-li:my-0 prose-li:text-[13px]
            prose-table:text-[12px] prose-th:px-2 prose-th:py-1 prose-td:px-2 prose-td:py-1
            prose-th:bg-secondary/50 prose-th:font-medium prose-th:text-left
            prose-tr:border-border/40
          ">
            {parts.map((part, i) => {
              if (part.type === "image") return <PlaceImage key={i} place={part.value} />;
              if (part.type === "directions") return <DirectionsButton key={i} place={part.value} />;
              return <ReactMarkdown key={i}>{part.value}</ReactMarkdown>;
            })}
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{content}</p>
        )}
      </div>
    </motion.div>
  );
}
