"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useApp, PackSize } from "@/context/AppContext";
import { insforge } from "@/lib/insforge";
import { ArrowLeft, Minus, Plus, ShoppingCart, ShoppingBasket, X } from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { t, addToCart, language } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<PackSize | undefined>(undefined);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await insforge.database.from("Products").select().eq("is_active", true).eq("id", slug as string).single();
      if (data) {
        const p = {
          id: data.id,
          slug: data.id,
          nameBn: data.name_bn || data.name_en,
          nameEn: data.name_en,
          price: data.price,
          image: data.image_url || "https://placehold.co/400x400?text=No+Image",
          unitBn: data.unit || "১ টি",
          unitEn: data.unit || "1 Pc",
          category: data.category || "grocery",
          descriptionBn: data.description_bn || data.description_en,
          descriptionEn: data.description_en,
          discountPrice: data.discount_price || undefined,
          discountPercent: data.discount_percent || undefined,
          packSizes: []
        };
        setProduct(p);

        // Fetch similar
        const { data: simData } = await insforge.database.from("Products").select().eq("is_active", true).neq("id", data.id).limit(4);
        if (simData) {
          setSimilarProducts(simData.map((sp: any) => ({
            id: sp.id,
            slug: sp.id,
            nameBn: sp.name,
            nameEn: sp.name,
            price: sp.price,
            image: sp.image_url || "https://placehold.co/400x400?text=No+Image",
            unitBn: sp.unit || "১ টি",
            unitEn: sp.unit || "1 Pc",
            category: sp.category || "grocery",
            discountPrice: sp.discount_price || undefined,
            discountPercent: sp.discount_percent || undefined,
          })));
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  // Set default pack size on mount if product has packSizes
  useEffect(() => {
    if (product && product.packSizes && product.packSizes.length > 0) {
      // Default to index 1 (middle size) if available, otherwise index 0
      const defaultIndex = product.packSizes.length >= 2 ? 1 : 0;
      setSelectedSize(product.packSizes[defaultIndex]);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-grow flex justify-center items-center font-bold text-primary py-24">
          Loading product...
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col justify-between">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-8">
          <h1 className="text-2xl font-bold text-red-500">{t("পণ্যটি পাওয়া যায়নি", "Product Not Found")}</h1>
          <Link href="/shop" className="text-primary mt-4 hover:underline">
            {t("শপে ফিরে যান", "Back to Shop")}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Determine current active price and discount based on selected pack size or default product values
  const activePrice = selectedSize ? selectedSize.price : product.price;
  const activeDiscountPrice = selectedSize ? selectedSize.discountPrice : product.discountPrice;
  const hasDiscount = activeDiscountPrice !== undefined;
  const activeDiscountPercent = selectedSize ? selectedSize.discountPercent : product.discountPercent;

  const displayPrice = hasDiscount ? activeDiscountPrice : activePrice;
  const originalPrice = activePrice;

  const formattedPrice = language === "bn" ? displayPrice?.toLocaleString("bn-BD") : displayPrice;
  const formattedOriginalPrice = language === "bn" ? originalPrice?.toLocaleString("bn-BD") : originalPrice;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize);
    router.push("/checkout");
  };

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="bg-background text-on-background min-h-[100dvh] flex flex-col">
      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <div className="fixed inset-0 z-[100000] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
          <button 
            onClick={() => setFullScreenImage(null)}
            className="absolute top-safe-4 left-4 md:top-8 md:left-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10 btn-press"
          >
            <ArrowLeft className="text-2xl" />
          </button>
          <img 
            src={fullScreenImage} 
            alt="Fullscreen" 
            className="w-full max-w-3xl h-auto max-h-[85vh] object-contain transition-transform"
          />
        </div>
      )}

      {/* TopNavBar */}
      <Header />

      {/* Main Content Container */}
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 md:px-margin-desktop py-4 md:py-8">
        <div className="mb-4 md:mb-6">
          <Link href="/shop" className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="text-[16px]" />
            {t("ফিরে যান", "Back to Shop")}
          </Link>
        </div>

        {/* Product Details Section */}
        <div className="bg-surface-container-lowest rounded-2xl md:rounded-3xl p-4 md:p-8 border border-surface-variant/40 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-8">
          
          {/* Image side - Compact on mobile */}
          <div 
            onClick={() => setFullScreenImage(product.image)}
            className="w-[85%] max-w-[320px] md:max-w-none md:w-full mx-auto aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-white border border-outline-variant/30 relative cursor-zoom-in group shadow-sm"
          >
            {hasDiscount && (
              <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-gradient-orange text-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg font-micro text-[11px] md:text-label-sm font-bold z-10 shadow-sm">
                {language === "bn"
                  ? `${activeDiscountPercent?.toLocaleString("bn-BD")}% ছাড়`
                  : `${activeDiscountPercent}% OFF`}
              </div>
            )}
            <img
              className="w-full !h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={product.image}
              alt={t(product.nameBn, product.nameEn)}
            />
            {/* Expand Icon Hint */}
            <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-black/40 backdrop-blur-md text-white p-2 rounded-full opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
            </div>
          </div>

          {/* Details side */}
          <div className="flex flex-col">
            <h1 className="font-tiro text-2xl md:text-4xl font-bold text-on-surface mb-1 md:mb-3 leading-tight">
              {t(product.nameBn, product.nameEn)}
            </h1>

            {/* Default or size unit display */}
            <p className="text-sm md:text-label-lg text-muted font-bold mb-3 md:mb-4">
              {t("ইউনিট: ", "Unit: ")} {selectedSize ? t(selectedSize.nameBn, selectedSize.nameEn) : t(product.unitBn, product.unitEn)}
            </p>

            {/* Price Display */}
            <div className="flex flex-col gap-0 md:gap-1 mb-5 md:mb-8">
              <div className="font-headline-lg text-3xl md:text-4xl font-bold text-primary flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl">৳</span>
                <span>{formattedPrice}</span>
              </div>
              {hasDiscount && (
                <div className="text-base md:text-lg text-muted line-through font-medium">
                  ৳{formattedOriginalPrice}
                </div>
              )}
            </div>

            {/* Pack Size Selector Buttons */}
            {product.packSizes && product.packSizes.length > 0 && (
              <div className="mb-5 md:mb-8">
                <span className="block text-xs md:text-sm font-bold text-on-surface mb-2.5">
                  {t("প্যাকেজ নির্বাচন করুন:", "Select Package:")}
                </span>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {product.packSizes.map((size: any, idx: number) => {
                    const isSelected = selectedSize?.nameEn === size.nameEn;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl text-xs md:text-sm font-bold border transition-all btn-press cursor-pointer ${
                          isSelected
                            ? "bg-primary border-primary text-white shadow-sm"
                            : "bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
                        }`}
                      >
                        {t(size.nameBn, size.nameEn)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Controls - Compact */}
            <div className="flex items-center gap-4 mb-6 md:mb-8 bg-surface-container-lowest md:bg-transparent rounded-2xl md:p-0">
              <span className="text-sm font-bold text-on-surface hidden md:block">{t("পরিমাণ:", "Quantity:")}</span>
              <div className="flex items-center border-2 border-outline-variant/30 rounded-full bg-surface w-[140px] md:w-auto justify-between p-0.5">
                <button
                  onClick={decrementQty}
                  className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center text-on-surface hover:text-primary hover:bg-primary/5 transition-colors btn-press cursor-pointer rounded-full"
                >
                  <Minus className="text-[18px]" />
                </button>
                <span className="w-8 text-center text-base md:text-lg font-bold">
                  {language === "bn" ? quantity.toLocaleString("bn-BD") : quantity}
                </span>
                <button
                  onClick={incrementQty}
                  className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center text-on-surface hover:text-primary hover:bg-primary/5 transition-colors btn-press cursor-pointer rounded-full"
                >
                  <Plus className="text-[18px]" />
                </button>
              </div>
            </div>

            {/* Add & Buy Actions (Moved up for mobile visibility) */}
            <div className="flex flex-row gap-2 md:gap-3 mb-6 md:mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-surface border-2 border-primary text-primary font-bold py-2 md:py-4 px-2 md:px-6 rounded-xl md:rounded-full btn-press transition-colors hover:bg-primary/5 cursor-pointer flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 text-[11px] md:text-base"
              >
                <ShoppingCart className="text-[16px] md:text-[20px]" />
                <span>{t("কার্টে যোগ", "Add to Cart")}</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gradient-green text-white font-bold py-2 md:py-4 px-2 md:px-6 rounded-xl md:rounded-full btn-press shadow-md hover:shadow-lg transition-transform cursor-pointer flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 text-[11px] md:text-base"
              >
                <ShoppingBasket className="text-[16px] md:text-[20px]" />
                <span>{t("এখনই কিনুন", "Buy Now")}</span>
              </button>
            </div>

            {/* Description (Moved below actions) */}
            <div className="border-t border-surface-variant/50 pt-5 mt-auto">
              <h3 className="font-headline-sm text-sm md:text-base font-bold text-on-surface mb-2.5">
                {t("পণ্যের বিবরণ", "Product Details")}
              </h3>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                {t(
                  product.descriptionBn || "সতেজ এবং স্বাস্থ্যকর পণ্য। সরাসরি স্থানীয় খামার থেকে সংগৃহীত।",
                  product.descriptionEn || "Fresh and healthy product. Sourced directly from local farms."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="mt-8 md:mt-16">
            <h2 className="font-headline-sm text-lg md:text-headline-lg font-bold text-on-background mb-4 md:mb-8">
              {t("সম্পর্কিত পণ্যসমূহ", "Related Products")}
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6">
              {similarProducts.map((p) => {
                const pPrice = p.discountPrice !== undefined ? p.discountPrice : p.price;
                const pFormattedPrice = language === "bn" ? pPrice.toLocaleString("bn-BD") : pPrice;
                return (
                  <div
                    key={p.id}
                    className="bg-surface-container-lowest rounded-xl md:rounded-2xl p-2 md:p-4 shadow-sm border border-surface-variant hover-lift flex flex-col h-full relative group"
                  >
                    {p.discountPercent && (
                      <div className="absolute top-1 left-1 md:top-2 md:left-2 bg-gradient-orange text-white px-1.5 py-0.5 md:px-2 md:py-1 rounded-md font-micro text-[9px] md:text-[10px] font-bold z-10">
                        {language === "bn"
                          ? `${p.discountPercent.toLocaleString("bn-BD")}% ছাড়`
                          : `${p.discountPercent}% OFF`}
                      </div>
                    )}
                    <Link
                      href={`/product/${p.slug}`}
                      className="aspect-square w-full rounded-lg md:rounded-xl overflow-hidden bg-white mb-2 md:mb-3 relative block group/img"
                    >
                      <img
                        className="w-full !h-full object-cover card-zoom-image transition-transform duration-700 group-hover/img:scale-110"
                        src={p.image}
                        alt={t(p.nameBn, p.nameEn)}
                      />
                    </Link>
                    <Link href={`/product/${p.slug}`} className="flex-grow">
                      <h3 className="font-bold text-[11px] md:text-base text-on-surface line-clamp-2 mb-1 hover:text-primary transition-colors leading-tight">
                        {t(p.nameBn, p.nameEn)}
                      </h3>
                      <p className="text-[10px] md:text-xs text-muted mb-1 md:mb-2 font-medium">
                        {t(p.unitBn, p.unitEn)}
                      </p>
                    </Link>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="font-bold text-[13px] md:text-lg text-primary leading-none">
                        ৳{pFormattedPrice}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(p, 1);
                        }}
                        className="bg-surface border border-primary text-primary hover:bg-primary hover:text-white transition-colors w-6 h-6 md:w-9 md:h-9 rounded-full flex items-center justify-center btn-press shadow-soft shrink-0"
                      >
                        <Plus className="text-[14px] md:text-[20px]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
