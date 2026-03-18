import { motion } from "framer-motion";
import { Navigation, ExternalLink } from "lucide-react";

interface DirectionsButtonProps {
  place: string;
}

export default function DirectionsButton({ place }: DirectionsButtonProps) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place + ", India")}`;

  return (
    <motion.a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-primary/20 transition-colors my-2"
    >
      <Navigation className="w-4 h-4" />
      Get Directions to {place}
      <ExternalLink className="w-3 h-3 opacity-60" />
    </motion.a>
  );
}
