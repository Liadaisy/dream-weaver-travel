import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Users, MapPin, Flame } from "lucide-react";

const trendingData = [
  { place: "Munnar, Kerala", mood: "☮️ Relax", travelers: "2.4k", trend: "+18%" },
  { place: "Rishikesh, Uttarakhand", mood: "🏔️ Adventure", travelers: "3.1k", trend: "+32%" },
  { place: "Goa", mood: "❤️ Romantic", travelers: "5.7k", trend: "+12%" },
  { place: "Meghalaya", mood: "🌿 Explore", travelers: "1.8k", trend: "+45%" },
  { place: "Jaipur, Rajasthan", mood: "📸 Culture", travelers: "4.2k", trend: "+22%" },
  { place: "Spiti Valley", mood: "🏔️ Adventure", travelers: "890", trend: "+67%" },
  { place: "Andaman Islands", mood: "🏖️ Beach", travelers: "2.1k", trend: "+28%" },
  { place: "Varanasi", mood: "🕉️ Spiritual", travelers: "3.8k", trend: "+15%" },
];

export default function TravelPulse() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % trendingData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const visible = [
    trendingData[activeIdx % trendingData.length],
    trendingData[(activeIdx + 1) % trendingData.length],
    trendingData[(activeIdx + 2) % trendingData.length],
    trendingData[(activeIdx + 3) % trendingData.length],
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive rounded-full px-4 py-1.5 mb-4">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-semibold">Live Travel Pulse</span>
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2">
            Trending Right Now
          </h2>
          <p className="text-muted-foreground">Real-time buzz from Indian travelers this week</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {visible.map((item) => (
              <motion.div
                key={item.place}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-card border border-border rounded-2xl p-5 hover:shadow-card transition-shadow cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{item.mood.split(" ")[0]}</span>
                  <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {item.trend}
                  </span>
                </div>
                <h3 className="font-display text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                  {item.place}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">{item.mood}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{item.travelers} planning trips</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
