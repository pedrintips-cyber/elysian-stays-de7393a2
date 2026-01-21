import { Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export type Listing = {
  id: string;
  title: string;
  subtitle: string;
  rating: number;
  price: string;
  imageSrc: string;
  isFavorite?: boolean;
};

export function ListingCardAir({ 
  listing, 
  className,
  onFavoriteToggle
}: { 
  listing: Listing; 
  className?: string;
  onFavoriteToggle?: () => void;
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [localFavorite, setLocalFavorite] = useState(listing.isFavorite || false);
  const [loading, setLoading] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Login necessário",
        description: "Faça login para adicionar favoritos",
      });
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      if (localFavorite) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("property_id", listing.id);
        setLocalFavorite(false);
      } else {
        await supabase
          .from("favorites")
          .insert({
            user_id: user.id,
            property_id: listing.id,
          });
        setLocalFavorite(true);
      }
      onFavoriteToggle?.();
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article
      onClick={() => navigate(`/property/${listing.id}`)}
      className={cn(
        "overflow-hidden rounded-3xl border bg-card shadow-soft",
        "transition-transform duration-300 will-change-transform",
        "hover:-translate-y-0.5 cursor-pointer",
        className,
      )}
    >
      <div className="relative">
        <img
          src={listing.imageSrc}
          alt={`Foto do anúncio: ${listing.title}`}
          loading="lazy"
          className="h-56 w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-transparent" />
        <button
          type="button"
          onClick={handleFavoriteClick}
          disabled={loading}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95 pointer-events-auto"
          aria-label="Adicionar aos favoritos"
        >
          <Heart 
            className={`h-[18px] w-[18px] stroke-[1.8] transition-colors ${
              localFavorite 
                ? "fill-primary text-primary" 
                : "text-foreground"
            }`} 
          />
        </button>
      </div>

      <div className="px-4 pb-4 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-[17px] font-semibold tracking-[-0.01em] text-foreground">
              {listing.title}
            </h2>
            <p className="mt-0.5 truncate text-[13px] text-muted-foreground">{listing.subtitle}</p>
          </div>

          <div className="flex shrink-0 items-center gap-1 rounded-full bg-surface/80 px-2 py-1 shadow-elev">
            <Star className="h-4 w-4 text-primary" strokeWidth={1.8} />
            <span className="text-[13px] font-medium tabular-nums text-foreground">{listing.rating.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-[14px] text-muted-foreground">A partir de</p>
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">{listing.price}</p>
        </div>
      </div>
    </article>
  );
}
