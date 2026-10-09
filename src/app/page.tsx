"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { insforge } from "@/lib/insforge";
import { ArrowRight, Plus, ShieldCheck, Truck, Lock, RotateCcw, ShoppingCart } from 'lucide-react';

export default function HomePage() {
  const { t, addToCart, language } = useApp();

  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);


  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await insforge.database.from("Settings").select("hero_slides").eq("id", 1).single();
      if (settingsData && settingsData.hero_slides && settingsData.hero_slides.length > 0) {
        setHeroSlides(settingsData.hero_slides.filter((s: any) => s.image_url)); // Only valid slides
      } else {
        // Fallback default slides
        setHeroSlides([
          {
            image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600",
            titleBn: "বাজার এখন ঘরে",
            titleEn: "Grocery now at home",
            subtitleBn: "ফ্রেশ কোয়ালিটির বাজার পৌঁছে যাবে সরাসরি আপনার দরজায়। দ্রুত, নির্ভরযোগ্য এবং সাশ্রয়ী।",
            subtitleEn: "Fresh quality groceries delivered straight to your door. Fast, reliable, and affordable."
          }
        ]);
      }

      const { data } = await insforge.database.from("Products").select().eq("is_active", true).eq("is_popular", true).limit(20);
      if (data) {
        const mapped = data.map((p: any) => ({
          id: p.id,
          slug: p.id, // using id as slug for now
          nameBn: p.name_bn || p.name_en,
          nameEn: p.name_en,
          price: p.price,
          image: p.image_url || "https://placehold.co/400x400?text=No+Image",
          unitBn: p.unit || "১ টি",
          unitEn: p.unit || "1 Pc",
          category: p.category || "grocery",
          discountPrice: p.discount_price || undefined,
          discountPercent: p.discount_percent || undefined,
          descriptionBn: p.description_bn || p.description_en,
          descriptionEn: p.description_en,
        }));
        setFeaturedProducts(mapped);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative z-0 flex-1 flex flex-col">
      {/* Decorative Colorful Background Blobs strictly contained */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-400/20 rounded-full blur-[60px] md:blur-[100px] opacity-40 md:opacity-70 md:animate-blob will-change-transform"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[60px] md:blur-[100px] opacity-40 md:opacity-70 md:animate-blob animation-delay-2000 will-change-transform"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-amber-300/20 rounded-full blur-[60px] md:blur-[100px] opacity-40 md:opacity-70 md:animate-blob animation-delay-4000 will-change-transform"></div>
      </div>
      {/* TopNavBar */}
      <Header />

      {/* Category Pills (Links to /shop with category parameters) */}
      <div className="w-full bg-surface-container-lowest py-3 px-margin-mobile md:px-margin-desktop overflow-x-auto overflow-y-hidden whitespace-nowrap shadow-sm border-b border-surface-variant/40 hide-scrollbar flex gap-3 snap-x snap-mandatory">
        <Link
          href="/shop?cat=makeup"
          className="snap-center inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-label-md text-label-md btn-press shadow-[0_4px_14px_0_rgba(236,72,153,0.39)] hover-lift cursor-pointer border-0"
        >
          {t("মেকআপ", "Makeup")}
        </Link>
        <Link
          href="/shop?cat=juwelary"
          className="snap-center inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-label-md text-label-md btn-press shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover-lift cursor-pointer border-0"
        >
          {t("গহনা", "Juwelary")}
        </Link>
        <Link
          href="/shop?cat=cosmetics"
          className="snap-center inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full font-label-md text-label-md btn-press shadow-[0_4px_14px_0_rgba(168,85,247,0.39)] hover-lift cursor-pointer border-0"
        >
          {t("প্রসাধন", "cosmetics")}
        </Link>
        <Link
          href="/shop?cat=bag"
          className="snap-center inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-label-md text-label-md btn-press shadow-[0_4px_14px_0_rgba(6,182,212,0.39)] hover-lift cursor-pointer border-0"
        >
          {t("ব্যাগ", "Bag")}
        </Link>
      </div>

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-section-gap flex flex-col gap-8 md:gap-12 pb-24 md:pb-12">
        {/* Hero Banner */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-[250px] sm:h-[350px] md:h-[500px] rounded-2xl overflow-hidden shadow-premium flex items-center bg-[#0f172a] group">
          
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentHeroIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
              }`}
            >
              <div 
                className={`w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-[12000ms] ease-out ${index === currentHeroIndex ? 'scale-110' : 'scale-100'}`}
                style={{ backgroundImage: `url('${slide.image_url}')` }}
              ></div>
            </div>
          ))}
          
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-purple-900/40 to-transparent  z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none"></div>
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentHeroIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {heroSlides[currentHeroIndex] && (
            <div className="relative z-20 p-6 md:p-12 max-w-lg">
              <motion.h1 
                key={`title-${currentHeroIndex}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
                className="font-tiro text-3xl sm:text-4xl md:text-5xl text-white font-bold leading-tight mb-3 md:mb-4 drop-shadow-md">
                {t(heroSlides[currentHeroIndex].titleBn || "ফ্যাশন এখন ঘরে", heroSlides[currentHeroIndex].titleEn || "Fashion now at home")}
              </motion.h1>
              <motion.p 
                key={`subtitle-${currentHeroIndex}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.2 }}
                className="font-body-md sm:font-body-lg text-surface-container-low mb-5 md:mb-6">
                {t(
                  heroSlides[currentHeroIndex].subtitleBn || "",
                  heroSlides[currentHeroIndex].subtitleEn || ""
                )}
              </motion.p>
              <motion.div
                key={`btn-${currentHeroIndex}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.3 }}
              >
                <Link
                  href="/shop"
                  className="bg-gradient-green text-white font-headline-sm text-headline-sm px-6 py-3 rounded-full btn-press shadow-[0_4px_20px_rgba(0,166,81,0.4)] hover:shadow-[0_8px_30px_rgba(0,166,81,0.6)] inline-flex items-center gap-2 transition-all duration-300 border border-white/20"
                >
                  {t("অর্ডার করুন", "Order Now")} <ArrowRight className="text-[18px]" />
                </Link>
              </motion.div>
            </div>
          )}
        </motion.section>

        {/* Featured Products Grid */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">
              {t("জনপ্রিয় পণ্য", "Popular Products")}
            </h2>
            <Link href="/shop" className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1">
              {t("সব দেখুন", "See All")} <ArrowRight className="text-[16px]" />
            </Link>
          </div>

          <div className="flex overflow-x-auto overflow-y-hidden gap-4 md:gap-6 pt-2 pb-4 px-1 snap-x snap-mandatory hide-scrollbar">
            {featuredProducts.map((product) => {
              const activePrice = product.discountPrice !== undefined ? product.discountPrice : product.price;
              const hasDiscount = product.discountPrice !== undefined;
              const formattedPrice = language === "bn" ? activePrice.toLocaleString("bn-BD") : activePrice;

              return (
                <div
                  key={product.id}
                  className="w-[160px] md:w-[220px] shrink-0 snap-start bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 hover:border-pink-300/50 hover:shadow-[0_8px_30px_rgba(236,72,153,0.15)] transition-all duration-300 hover-lift flex flex-col h-full relative group"
                >
                  {/* Discount Badge */}
                  {hasDiscount && (
                    <div className="absolute top-3 left-3 bg-gradient-orange text-white px-2 py-1 rounded font-micro text-micro font-bold z-10">
                      {language === "bn"
                        ? `${product.discountPercent?.toLocaleString("bn-BD")}% ছাড়`
                        : `${product.discountPercent}% OFF`}
                    </div>
                  )}
                  {/* New Badge */}
                  {product.isNew && !hasDiscount && (
                    <div className="absolute top-3 left-3 bg-gradient-green text-white px-2 py-1 rounded font-micro text-micro font-bold z-10">
                      {t("নতুন", "New")}
                    </div>
                  )}

                  {/* Image Container */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="aspect-square w-full rounded-xl overflow-hidden bg-white mb-3 relative block group/img"
                  >
                    <img
                      className="w-full !h-full object-cover card-zoom-image transition-transform duration-700 group-hover/img:scale-110"
                      src={product.image}
                      alt={t(product.nameBn, product.nameEn)}
                    />
                    {/* Hover Add to Cart Reveal (Desktop) */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 hidden md:flex flex-col items-center justify-end pb-4 pointer-events-none">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product, 1);
                        }}
                        className="pointer-events-auto bg-white/90 backdrop-blur-md text-primary font-bold px-5 py-2 rounded-full transform translate-y-8 group-hover/img:translate-y-0 transition-all duration-300 shadow-lg flex items-center gap-2 hover:bg-primary hover:text-white"
                      >
                        <ShoppingCart size={16} /> {t("কার্ট-এ যোগ করুন", "Add to Cart")}
                      </button>
                    </div>
                  </Link>

                  {/* Product Title */}
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 line-clamp-2">
                    <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors">
                      {t(product.nameBn, product.nameEn)}
                    </Link>
                  </h3>

                  {/* Product Unit */}
                  <p className="font-label-sm text-label-sm text-muted mb-2">
                    {t(product.unitBn, product.unitEn)}
                  </p>

                  {/* Price & Add to Cart */}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="font-headline-md text-headline-md text-primary font-bold">
                        ৳{formattedPrice}
                      </div>
                      {hasDiscount && (
                        <span className="text-xs text-outline-variant line-through mt-0.5">
                          ৳{language === "bn" ? product.price.toLocaleString("bn-BD") : product.price}
                        </span>
                      )}
                    </div>
                    <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product, 1);
                        }}
                        className="bg-gradient-to-br from-primary to-[#008C44] text-white w-8 h-8 rounded-full flex items-center justify-center btn-press shadow-soft hover-lift"
                        title={t("কার্টে যোগ করুন", "Add to Cart")}
                    >
                      <Plus className="text-[18px]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Shop by Category */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-4"
        >
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-6">
            {t("ক্যাটাগরি সমূহ", "Categories")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/shop?cat=makeup"
              className="relative h-32 md:h-48 rounded-2xl overflow-hidden group hover-lift shadow-sm cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800')",
                }}
              ></div>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-headline-md text-headline-md bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
                  {t("মেকআপ", "Makeup")}
                </span>
              </div>
            </Link>
            <Link
              href="/shop?cat=juwelary"
              className="relative h-32 md:h-48 rounded-2xl overflow-hidden group hover-lift shadow-sm cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800')",
                }}
              ></div>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-headline-md text-headline-md bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
                  {t("গহনা", "Juwelary")}
                </span>
              </div>
            </Link>
            <Link
              href="/shop?cat=cosmetics"
              className="relative h-32 md:h-48 rounded-2xl overflow-hidden group hover-lift shadow-sm cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800')",
                }}
              ></div>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-headline-md text-headline-md bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
                  {t("প্রসাধন", "cosmetics")}
                </span>
              </div>
            </Link>
            <Link
              href="/shop?cat=bag"
              className="relative h-32 md:h-48 rounded-2xl overflow-hidden group hover-lift shadow-sm cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800')",
                }}
              ></div>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-headline-md text-headline-md bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
                  {t("ব্যাগ", "Bag")}
                </span>
              </div>
            </Link>
          </div>
        </motion.section>

        {/* Trust Badges */}
        <section className="mt-8 mb-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { icon: ShieldCheck, titleBn: "জেনুইন প্রোডাক্ট", titleEn: "Genuine Product", color: "text-blue-500", bg: "bg-blue-50" },
              { icon: Truck, titleBn: "ফাস্ট ডেলিভারি", titleEn: "Fast Delivery", color: "text-emerald-500", bg: "bg-emerald-50" },
              { icon: Lock, titleBn: "নিরাপদ পেমেন্ট", titleEn: "Secure Payment", color: "text-purple-500", bg: "bg-purple-50" },
              { icon: RotateCcw, titleBn: "রিটার্ন পলিসি", titleEn: "Return Policy", color: "text-amber-500", bg: "bg-amber-50" }
            ].map((badge, idx) => (
              <motion.div 
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
                }}
                className="bg-white p-4 rounded-2xl border border-outline-variant/30 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow duration-300 group cursor-default"
              >
                <div className={`w-12 h-12 ${badge.bg} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <badge.icon className={`text-[24px] ${badge.color} group-hover:animate-pulse`} />
                </div>
                <h4 className="font-label-md text-label-md text-on-surface font-bold">
                  {t(badge.titleBn, badge.titleEn)}
                </h4>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
