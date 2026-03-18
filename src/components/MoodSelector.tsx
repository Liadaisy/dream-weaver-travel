import { motion } from "framer-motion";

const moods = [
  { emoji: "😌", label: "Relax", description: "Peaceful getaways", color: "from-emerald-400 to-teal-500" },
  { emoji: "😎", label: "Adventure", description: "Thrilling experiences", color: "from-orange-400 to-red-500" },
  { emoji: "❤️", label: "Romantic", description: "Couple retreats", color: "from-pink-400 to-rose-500" },
  { emoji: "🧘", label: "Stress Relief", description: "Heal & recharge", color: "from-violet-400 to-purple-500" },
];

interface MoodSelectorProps {
  onSelect: (mood: string) => void;
}

export default function MoodSelector({ onSelect }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {moods.map((mood, i) => (
        <motion.button
          key={mood.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(mood.label)}
          className="group relative overflow-hidden rounded-2xl bg-card p-6 shadow-card hover:shadow-elevated transition-shadow duration-300 border border-border text-left"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          <span className="text-4xl block mb-3">{mood.emoji}</span>
          <h3 className="font-display text-lg text-foreground">{mood.label}</h3>
          <p className="text-sm text-muted-foreground mt-1">{mood.description}</p>
        </motion.button>
      ))}
    </div>
  );
}
