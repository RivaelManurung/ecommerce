import { Star, Users } from "lucide-react";
import { reviews } from "@/lib/data/reviews";
import { RatingStars } from "@/components/product/rating-stars";
import { Reveal } from "@/components/shared/reveal";

export function SocialProof() {
  return (
    <section className="container-page py-10">
      <Reveal>
      <div className="grid items-center gap-5 rounded-3xl border border-[#F3CED5] bg-[#F8DDE2]/55 p-6 shadow-[0_18px_55px_rgba(169,68,90,0.08)] md:grid-cols-[1fr_3fr_1fr]">
        <div className="flex items-center gap-4">
          <Star className="fill-[#C95F72] text-[#C95F72]" size={38} />
          <div><p className="text-3xl font-bold">4.9/5</p><p className="text-sm text-[#737373]">Dari 28.000+ ulasan</p></div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.name} className="rounded-2xl border border-[#EEE7E2] bg-white/88 p-4">
              <RatingStars rating={review.rating} />
              <p className="mt-2 text-sm text-[#737373]">&ldquo;{review.text}&rdquo;</p>
              <p className="mt-3 text-xs font-semibold">— {review.name}</p>
            </article>
          ))}
        </div>
        <div className="flex items-center gap-4 justify-self-start md:justify-self-end">
          <Users className="text-[#C95F72]" size={38} />
          <div><p className="text-2xl font-bold">28.000+</p><p className="text-sm text-[#737373]">Ulasan terverifikasi</p></div>
        </div>
      </div>
      </Reveal>
    </section>
  );
}
