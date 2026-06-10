import { Star } from "lucide-react";

export function RatingStars({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1 text-xs text-[#737373]" aria-label={`Rating ${rating} dari 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={14}
          className={index < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-[#D8D0CA]"}
        />
      ))}
      <span className="ml-1">{rating.toFixed(1)}{count ? ` (${count})` : ""}</span>
    </div>
  );
}
