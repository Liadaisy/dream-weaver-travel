import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, MessageCircle, Shuffle, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";
import MoodSelector from "@/components/MoodSelector";
import TravelPulse from "@/components/TravelPulse";

const Index = () => {
  const navigate = useNavigate();

  const handleMoodSelect = (mood: string) => {
    navigate(`/chat?mood=${encodeURIComponent(mood)}`);
  };

  const handleSurpriseMe = () => {
    const moods = ["Relax", "Adventure", "Romantic", "Stress Relief"];
    const random = moods[Math.floor(Math.random() * moods.length)];
    navigate(`/chat?mood=${encodeURIComponent(random)}&surprise=true`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[85vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Beautiful misty mountains in India"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/20 to-background" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-border">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">AI-Powered Travel Planning</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-primary-foreground mb-4 leading-tight">
              Your Dream Trip,<br />
              <span className="text-gradient-sunset">Planned by AI</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8 font-body">
              Tell us how you feel, and we'll craft the perfect Indian getaway — 
              complete with itinerary, budget, and hidden gems.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/chat")}
                className="inline-flex items-center gap-2 gradient-sunset text-primary-foreground font-semibold px-8 py-4 rounded-2xl shadow-glow animate-pulse-glow"
              >
                <MessageCircle className="w-5 h-5" />
                Start Planning
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSurpriseMe}
                className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-md text-foreground font-semibold px-8 py-4 rounded-2xl border border-border hover:bg-card transition-colors"
              >
                <Shuffle className="w-5 h-5" />
                Surprise Me 🎲
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mood Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-3">
              How are you feeling?
            </h2>
            <p className="text-muted-foreground text-lg">
              Pick your mood and let AI find your perfect destination
            </p>
          </motion.div>

          <MoodSelector onSelect={handleMoodSelect} />
        </div>
      </section>

      {/* Travel Pulse */}
      <TravelPulse />

      {/* Features */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🗺️", title: "Dream Trip Generator", desc: "Complete day-by-day itineraries with places, hotels, and activities" },
              { icon: "💸", title: "Budget Optimizer", desc: "AI breaks down your budget smartly across travel, stay, food & activities" },
              { icon: "🎯", title: "Personalized Picks", desc: "Recommendations based on your mood, group size, and preferences" },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card rounded-2xl p-6 shadow-card border border-border"
              >
                <span className="text-3xl block mb-3">{f.icon}</span>
                <h3 className="font-display text-xl text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-muted-foreground text-sm border-t border-border">
        <p>✨ Powered by AI • Built with ❤️ for Indian travelers</p>
      </footer>
    </div>
  );
};

export default Index;
