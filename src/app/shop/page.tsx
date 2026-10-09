"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { Product } from "@/context/AppContext";
import { insforge } from "@/lib/insforge";
import { SearchX, Plus, ArrowLeft, SlidersHorizontal, X } from 'lucide-react';

function ShopContent() {
  const { t, addToCart, language } = useApp();
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat") || "all";

  // Filter States
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [selectedCategories, setSelectedCategories] = useState({
    all: true,
    makeup: false,
    juwelary: false,
    cosmetics: false,
    bag: false,
  });
  const [sortBy, setSortBy] = useState<string>("popular");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [popupCategoryKey, setPopupCategoryKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await insforge.database.from("Products").select().eq("is_active", true);
      if (data) {
        const mapped = data.map((p: any) => ({
          id: p.id,
          slug: p.id,
          nameBn: p.name_bn || p.name_en,
          nameEn: p.name_en,
          price: p.price,
          image: p.image_url || "https://placehold.co/400x400?text=No+Image",
          unitBn: p.unit || "১ টি",
          unitEn: p.unit || "1 Pc",
          category: p.category || "grocery",
          descriptionBn: p.description_bn || p.description_en,
          descriptionEn: p.description_en,
          discountPrice: p.discount_price || undefined,
          discountPercent: p.discount_percent || undefined,
        }));
        setAllProducts(mapped);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Sync with URL query parameter on mount / change
  useEffect(() => {
    if (catParam && catParam !== "all") {
      setSelectedCategories({
        all: false,
        makeup: catParam === "makeup",
        juwelary: catParam === "juwelary",
        cosmetics: catParam === "cosmetics",
        bag: catParam === "bag",
      });
    } else {
      setSelectedCategories({
        all: true,
        makeup: false,
        juwelary: false,
        cosmetics: false,
        bag: false,
      });
    }
  }, [catParam]);

  const handleCategoryCheckboxChange = (cat: keyof typeof selectedCategories) => {
    setSelectedCategories((prev) => {
      // Calculate how many checkboxes are currently checked
      const checkedCount = Object.values(prev).filter(Boolean).length;

      // If user tries to uncheck the last checked box, do not allow it
      if (prev[cat] && checkedCount === 1) {
        return prev;
      }

      const next = { ...prev };

      if (cat === "all") {
        if (!prev.all) {
          return {
            all: true,
            makeup: false,
            juwelary: false,
            cosmetics: false,
            bag: false,
          };
        } else {
          // Prevent unchecking "all" if it's the only one checked
          return prev;
        }
      } else {
        // Toggling a specific category
        const newValue = !prev[cat];
        next[cat] = newValue;

        if (newValue) {
          // If checking a specific category, de-select "all"
          next.all = false;
        } else {
          // If unchecking a specific category, verify at least one is still checked
          const anyChecked = Object.entries(next)
            .filter(([k, _]) => k !== "all")
            .some(([_, v]) => v);
          if (!anyChecked) {
            // If nothing else is checked, automatically check "all"
            next.all = true;
          }
        }
      }

      return next;
    });
  };

  const handleSeeAll = (groupKey: string) => {
    setPopupCategoryKey(groupKey);
  };

  // Filter & Sort Logic
  const filteredProducts = allProducts.filter((product) => {
    // Price check
    const activePrice = product.discountPrice !== undefined ? product.discountPrice : (product.price || 0);
    if (activePrice > maxPrice) return false;

    // Category check
    if (selectedCategories.all) return true;

    const isCategoryChecked = selectedCategories[product.category as keyof typeof selectedCategories];
    return isCategoryChecked;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aPrice = a.discountPrice !== undefined ? a.discountPrice : a.price;
    const bPrice = b.discountPrice !== undefined ? b.discountPrice : b.price;

    if (sortBy === "price-low") {
      return aPrice - bPrice;
    }
    if (sortBy === "price-high") {
      return bPrice - aPrice;
    }
    if (sortBy === "newest") {
      const aNew = a.isNew ? 1 : 0;
      const bNew = b.isNew ? 1 : 0;
      return bNew - aNew;
    }
    // "popular" / default
    return parseInt(a.id) - parseInt(b.id);
  });

  const groupedProducts: Record<
    string,
    { titleBn: string; titleEn: string; items: Product[]; filterKeys: string[] }
  > = {
    makeup: { titleBn: "মেকআপ", titleEn: "Makeup", items: [], filterKeys: ["makeup"] },
    juwelary: { titleBn: "গহনা", titleEn: "Juwelary", items: [], filterKeys: ["juwelary"] },
    cosmetics: { titleBn: "প্রসাধন", titleEn: "cosmetics", items: [], filterKeys: ["cosmetics"] },
    bag: { titleBn: "ব্যাগ", titleEn: "Bag", items: [], filterKeys: ["bag"] },
  };

  sortedProducts.forEach((product) => {
    if (product.category === "makeup") {
      groupedProducts.makeup.items.push(product);
    } else if (product.category === "juwelary") {
      groupedProducts.juwelary.items.push(product);
    } else if (product.category === "cosmetics") {
      groupedProducts.cosmetics.items.push(product);
    } else if (product.category === "bag") {
      groupedProducts.bag.items.push(product);
    }
  });

  const activeGroups = Object.entries(groupedProducts).filter(
    ([_, group]) => group.items.length > 0
  );

  return (
    <div className="bg-background text-on-background min-h-[100dvh] flex flex-col">
      {/* TopNavBar */}
      <Header />

      {/* Sticky Mobile Category Pills */}
      <div className="md:hidden w-full bg-surface-container-lowest shadow-sm border-b border-surface-variant/40 sticky top-[56px] z-40">
        <div className="w-full overflow-hidden">
          <div className="w-full py-2 px-4 overflow-x-auto overflow-y-hidden whitespace-nowrap hide-scrollbar overscroll-x-contain flex gap-2 snap-x snap-mandatory pb-8 -mb-6">
            <Link href="/shop?cat=all" className={`snap-center inline-flex items-center px-4 py-1.5 rounded-full text-[12px] font-bold border transition-colors ${selectedCategories.all ? 'bg-primary text-white border-primary shadow-sm' : 'bg-surface border-outline-variant text-on-surface-variant'}`}>
              {t("সব", "All")}
            </Link>
            <Link href="/shop?cat=makeup" className={`snap-center inline-flex items-center px-4 py-1.5 rounded-full text-[12px] font-bold border transition-colors ${selectedCategories.makeup ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-transparent shadow-sm' : 'bg-surface border-outline-variant text-on-surface-variant'}`}>
              {t("মেকআপ", "Makeup")}
            </Link>
            <Link href="/shop?cat=juwelary" className={`snap-center inline-flex items-center px-4 py-1.5 rounded-full text-[12px] font-bold border transition-colors ${selectedCategories.juwelary ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-transparent shadow-sm' : 'bg-surface border-outline-variant text-on-surface-variant'}`}>
              {t("গহনা", "Juwelary")}
            </Link>
            <Link href="/shop?cat=cosmetics" className={`snap-center inline-flex items-center px-4 py-1.5 rounded-full text-[12px] font-bold border transition-colors ${selectedCategories.cosmetics ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-transparent shadow-sm' : 'bg-surface border-outline-variant text-on-surface-variant'}`}>
              {t("কসমেটিকস", "Cosmetics")}
            </Link>
            <Link href="/shop?cat=bag" className={`snap-center inline-flex items-center px-4 py-1.5 rounded-full text-[12px] font-bold border transition-colors ${selectedCategories.bag ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-transparent shadow-sm' : 'bg-surface border-outline-variant text-on-surface-variant'}`}>
              {t("ব্যাগ", "Bag")}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Price & Category Filter Modal */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex flex-col justify-end">
          <div className="bg-surface w-full rounded-t-3xl p-5 animate-slide-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg">{t("ফিল্টার", "Filter")}</h2>
              <button onClick={() => setShowMobileFilter(false)} className="p-2 hover:bg-surface-variant rounded-full">
                <X />
              </button>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-sm font-bold mb-3">{t("মূল্য সীমা", "Price Range")}</h3>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-primary h-2 bg-surface-container-high rounded-full appearance-none"
              />
              <div className="flex justify-between text-sm font-bold mt-2">
                <span>৳ ০</span>
                <span className="text-primary">৳ {language === "bn" ? maxPrice.toLocaleString("bn-BD") : maxPrice}</span>
                <span>৳ ৫,০০০</span>
              </div>
            </div>

            <button onClick={() => setShowMobileFilter(false)} className="w-full bg-primary text-white font-bold py-3 rounded-full mt-4">
              {t("প্রয়োগ করুন", "Apply")}
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Popup Modal for "See All" */}
      {popupCategoryKey && (
        <div className="fixed inset-0 z-[110] bg-background overflow-y-auto flex flex-col">
          <div className="sticky top-0 bg-surface shadow-sm p-4 flex items-center gap-3 z-10">
            <button onClick={() => setPopupCategoryKey(null)} className="p-2 -ml-2 rounded-full hover:bg-surface-variant active:scale-95 transition-all">
              <ArrowLeft />
            </button>
            <h1 className="font-headline-sm text-lg font-bold">
              {t(groupedProducts[popupCategoryKey].titleBn, groupedProducts[popupCategoryKey].titleEn)}
            </h1>
          </div>
          <div className="p-2 md:p-4 pb-20">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6">
              {groupedProducts[popupCategoryKey].items.map((product) => {
                const activePrice = product.discountPrice !== undefined ? product.discountPrice : (product.price || 0);
                const hasDiscount = product.discountPrice !== undefined;
                const formattedPrice = language === "bn" ? activePrice.toLocaleString("bn-BD") : activePrice;
                const formattedOriginal = language === "bn" ? (product.price || 0).toLocaleString("bn-BD") : (product.price || 0);

                return (
                  <div key={product.id} className="w-full bg-white/80 backdrop-blur-md rounded-xl p-2 md:p-4 shadow-sm border border-surface-variant flex flex-col h-full relative group">
                    {hasDiscount && (
                      <div className="absolute top-1 left-1 bg-gradient-orange text-white px-1.5 py-0.5 rounded font-micro text-[9px] font-bold z-10">
                        {language === "bn" ? `${product.discountPercent?.toLocaleString("bn-BD")}% ছাড়` : `${product.discountPercent}% OFF`}
                      </div>
                    )}
                    <Link href={`/product/${product.slug}`} className="aspect-square w-full rounded-lg overflow-hidden bg-white mb-2 relative block">
                      <img className="w-full !h-full object-cover" src={product.image} alt={t(product.nameBn, product.nameEn)} />
                    </Link>
                    <h3 className="font-bold text-[11px] md:text-sm text-on-surface line-clamp-2 mb-1 leading-tight">
                      <Link href={`/product/${product.slug}`}>{t(product.nameBn, product.nameEn)}</Link>
                    </h3>
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <div className="flex flex-col">
                        <div className="text-[13px] md:text-base text-primary font-bold leading-none">৳{formattedPrice}</div>
                        {hasDiscount && <span className="text-[9px] text-outline-variant line-through mt-0.5">৳{formattedOriginal}</span>}
                      </div>
                      <button onClick={(e) => { e.preventDefault(); addToCart(product, 1); }} className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center shadow-soft shrink-0">
                        <Plus className="text-[14px]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="flex-grow flex justify-center items-center py-20 font-bold text-primary">Loading...</div>
      ) : (
        <div className="flex-grow w-full max-w-[1280px] mx-auto px-2 sm:px-margin-mobile md:px-margin-desktop py-4 md:py-section-gap flex flex-col md:flex-row gap-6 mb-16 md:mb-0">
          
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0 bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-surface-variant/40 h-fit sticky top-[100px]">
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-label-md text-label-md text-on-surface font-bold mb-3">{t("মূল্য সীমা", "Price Range")}</h3>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-primary h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-on-surface-variant mt-2 font-bold">
                <span>৳ ০</span>
                <span className="text-primary">৳ {language === "bn" ? maxPrice.toLocaleString("bn-BD") : maxPrice}</span>
                <span>৳ ৫,০০০</span>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-label-md text-label-md text-on-surface font-bold mb-3">{t("ক্যাটাগরি", "Category")}</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={selectedCategories.all} onChange={() => handleCategoryCheckboxChange("all")} className="form-checkbox text-primary rounded border-outline-variant focus:ring-primary w-4 h-4 cursor-pointer" />
                  <span className="text-sm font-bold text-on-surface-variant group-hover:text-primary transition-colors">{t("সব পণ্য", "All Products")}</span>
                </label>
                {/* Checkboxes for desktop */}
                {['makeup', 'juwelary', 'cosmetics', 'bag'].map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={selectedCategories[cat as keyof typeof selectedCategories]} onChange={() => handleCategoryCheckboxChange(cat as keyof typeof selectedCategories)} className="form-checkbox text-primary rounded border-outline-variant focus:ring-primary w-4 h-4 cursor-pointer" />
                    <span className="text-sm font-bold text-on-surface-variant group-hover:text-primary transition-colors capitalize">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Column */}
          <div className="flex-grow w-full space-y-6 md:space-y-10">
            {/* Header: Found count, Mobile Filter Button, Sort Dropdown */}
            <div className="flex flex-row justify-between items-center bg-surface-container-lowest p-2 md:p-4 rounded-xl shadow-sm border border-surface-variant/40">
              <p className="text-xs md:text-sm text-on-surface-variant font-bold hidden sm:block">
                {language === "bn" ? `${filteredProducts.length.toLocaleString("bn-BD")}টি পণ্য পাওয়া গেছে` : `${filteredProducts.length} products found`}
              </p>
              
              <button 
                className="md:hidden flex items-center gap-1.5 bg-surface text-primary text-[12px] font-bold border border-primary/50 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                onClick={() => setShowMobileFilter(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {t("ফিল্টার", "Filter")}
              </button>

              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select w-[140px] md:w-auto text-[12px] md:text-sm font-bold text-on-surface bg-surface border border-outline-variant rounded-lg focus:border-primary py-1.5 pl-2 pr-6"
                >
                  <option value="popular">{t("জনপ্রিয়", "Popular")}</option>
                  <option value="newest">{t("নতুন", "Newest")}</option>
                  <option value="price-low">{t("মূল্য: কম থেকে বেশি", "Price: Low-High")}</option>
                  <option value="price-high">{t("মূল্য: বেশি থেকে কম", "Price: High-Low")}</option>
                </select>
              </div>
            </div>

            {/* Grouped Product Grid Sections */}
            <div className="space-y-6 md:space-y-10">
              {activeGroups.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-surface-variant/40 shadow-sm">
                  <SearchX className="text-[48px] text-muted mb-2 mx-auto" />
                  <p className="text-on-surface-variant font-bold">
                    {t("কোনো পণ্য পাওয়া যায়নি।", "No products match.")}
                  </p>
                </div>
              ) : (
                activeGroups.map(([groupKey, group]) => {
                  // Only slice to 6 items if "All" is selected. If they explicitly selected a category, show all items.
                  const isGroupedView = selectedCategories.all;
                  const displayItems = isGroupedView ? group.items.slice(0, 6) : group.items;
                  const hasMore = isGroupedView && group.items.length > 6;

                  return (
                    <section key={groupKey} className="border-b border-surface-variant/30 pb-6 md:pb-8 last:border-0">
                      <div className="flex justify-between items-center mb-4 md:mb-6">
                        <h2 className="text-base md:text-headline-sm text-on-background font-bold border-l-4 border-primary pl-2 md:pl-3 leading-none">
                          {t(group.titleBn, group.titleEn)}
                        </h2>
                        {isGroupedView && (
                          <button
                            onClick={() => handleSeeAll(groupKey)}
                            className="text-primary text-[12px] md:text-sm hover:underline cursor-pointer btn-press font-bold bg-primary/10 px-3 py-1 md:py-1.5 rounded-full"
                          >
                            {t("সব দেখুন", "See All")}
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 md:gap-6">
                        {displayItems.map((product) => {
                          const activePrice = product.discountPrice !== undefined ? product.discountPrice : (product.price || 0);
                          const hasDiscount = product.discountPrice !== undefined;
                          const formattedPrice = language === "bn" ? activePrice.toLocaleString("bn-BD") : activePrice;
                          const formattedOriginal = language === "bn" ? (product.price || 0).toLocaleString("bn-BD") : (product.price || 0);

                          return (
                            <div key={product.id} className="w-full bg-white/80 backdrop-blur-md rounded-xl p-2 md:p-4 shadow-sm border border-surface-variant hover-lift flex flex-col h-full relative group">
                              {hasDiscount && (
                                <div className="absolute top-1 left-1 bg-gradient-orange text-white px-1.5 py-0.5 rounded font-micro text-[9px] font-bold z-10">
                                  {language === "bn" ? `${product.discountPercent?.toLocaleString("bn-BD")}% ছাড়` : `${product.discountPercent}% OFF`}
                                </div>
                              )}
                              <Link href={`/product/${product.slug}`} className="aspect-square w-full rounded-lg overflow-hidden bg-white mb-2 relative block group/img">
                                <img className="w-full !h-full object-cover transition-transform duration-700 group-hover/img:scale-110" src={product.image} alt={t(product.nameBn, product.nameEn)} />
                              </Link>
                              <h3 className="font-bold text-[11px] md:text-sm text-on-surface line-clamp-2 mb-1 group-hover:text-primary transition-colors leading-tight">
                                <Link href={`/product/${product.slug}`}>{t(product.nameBn, product.nameEn)}</Link>
                              </h3>
                              <p className="font-label-sm text-[10px] text-muted mb-1 md:mb-2">{t(product.unitBn, product.unitEn)}</p>
                              <div className="mt-auto flex items-center justify-between pt-1">
                                <div className="flex flex-col">
                                  <div className="text-[13px] md:text-base text-primary font-bold leading-none">৳{formattedPrice}</div>
                                  {hasDiscount && <span className="text-[9px] md:text-xs text-outline-variant line-through mt-0.5">৳{formattedOriginal}</span>}
                                </div>
                                <button onClick={(e) => { e.preventDefault(); addToCart(product, 1); }} className="bg-gradient-to-br from-primary to-[#008C44] text-white w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center btn-press shadow-soft shrink-0">
                                  <Plus className="text-[14px] md:text-[18px]" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}

