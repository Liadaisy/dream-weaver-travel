import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Loader2 } from "lucide-react";

const IMAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-place-image`;

interface PlaceImageProps {
  place: string;
}

export default function PlaceImage({ place }: PlaceImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchImage = async () => {
      try {
        const resp = await fetch(IMAGE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ place }),
        });

        if (!resp.ok) throw new Error("Failed");

        const data = await resp.json();
        if (!cancelled && data.imageUrl) {
          setImageUrl(data.imageUrl);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchImage();
    return () => { cancelled = true; };
  }, [place]);

  if (error) return null;

  if (loading) {
    return (
      <div className="w-full h-48 rounded-xl bg-secondary/50 flex items-center justify-center gap-2 my-3">
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        <span className="text-sm text-muted-foreground">Generating image of {place}...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="my-3 overflow-hidden rounded-xl shadow-card"
    >
      <img
        src={imageUrl!}
        alt={`AI-generated view of ${place}`}
        className="w-full h-48 object-cover"
      />
      <div className="bg-secondary/80 px-3 py-1.5 flex items-center gap-1.5">
        <ImageIcon className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">AI-generated image of {place}</span>
      </div>
    </motion.div>
  );
}
