"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "@/components/shared/reveal";

export function RoutineBanner() {
  return (
    <section className="container-page py-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-[#EEE7E2] bg-[#DDE8D5] p-7 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_10%,rgba(255,255,255,0.72),transparent_32%),radial-gradient(circle_at_15%_90%,rgba(248,221,226,0.8),transparent_34%)]" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1fr_420px]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#60775C]">Routine finder</p>
              <h2 className="mt-3 font-serif-display text-5xl leading-none md:text-6xl">Build Your Everyday Glow Routine</h2>
              <p className="mt-4 max-w-xl leading-7 text-[#5E665A]">Find complexion, skincare, and lip essentials tailored to your day.</p>
              <Link href="/catalog" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#C95F72] px-5 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#A9445A]">
                Start Your Routine <ArrowRight size={17} />
              </Link>
            </div>
            <motion.div
              className="relative min-h-[250px]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image src="/images/product-cosmetics.svg" alt="Veloura skincare routine" width={260} height={260} className="absolute bottom-0 left-8 w-52 rounded-3xl shadow-xl md:w-64" />
              <Image src="/images/product-cushion.svg" alt="Veloura cushion routine" width={210} height={210} className="absolute right-10 top-0 w-40 rounded-full shadow-xl md:w-52" />
              <Image src="/images/product-lip.svg" alt="Veloura lip routine" width={160} height={160} className="absolute bottom-4 right-0 w-32 rounded-3xl shadow-lg md:w-40" />
            </motion.div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
