"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Menu, Search, ShoppingCart, X, Home, Store, Info, MessageCircle, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const { language, setLanguage, t, cartCount } = useApp();
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopExpanded, setIsShopExpanded] = useState(false);
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-2.5 glassmorphism shadow-soft">
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            className="md:hidden p-1 text-primary hover:bg-surface-container rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="align-middle" />
          </button>
          <Link href="/" className="flex items-center gap-2 md:gap-3 shrink-0 select-none">
            <img
              src="/ecom_logo.jpg"
              alt="Ecom Shop Logo"
              className="w-[40px] h-[40px] md:w-[48px] md:h-[48px] object-contain shrink-0"
            />
            <span className="font-headline-sm text-[16px] md:text-[20px] font-bold text-[#003366] tracking-tight whitespace-nowrap font-tiro">
              Ecom Shop
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link
            href="/"
            className={`logo-nav-link ${
              isActive("/")
                ? "logo-nav-link-active font-bold border-b-2 pb-1"
                : "text-on-surface-variant"
            } font-label-md text-label-md`}
          >
            {t("হোম", "Home")}
          </Link>
          <div className="relative group py-4">
            <Link
              href="/shop"
              className={`logo-nav-link ${
                isActive("/shop")
                  ? "logo-nav-link-active font-bold border-b-2 pb-1"
                  : "text-on-surface-variant"
              } font-label-md text-label-md flex items-center gap-1`}
            >
              {t("শপ", "Shop")}
              <ChevronDown className="w-4 h-4 text-muted group-hover:text-primary transition-transform group-hover:rotate-180" />
            </Link>
            
            {/* Desktop Dropdown Menu */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-[-8px] w-48 bg-white border border-gray-100 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col z-[100] overflow-hidden">
               <Link href="/shop" className="px-4 py-3 hover:bg-primary/5 hover:text-primary transition-colors text-sm font-bold border-b border-gray-50">{t("সব পণ্য", "All Products")}</Link>
               <Link href="/shop?cat=makeup" className="px-4 py-3 hover:bg-primary/5 hover:text-primary transition-colors text-sm font-medium border-b border-gray-50">{t("মেকআপ", "Makeup")}</Link>
               <Link href="/shop?cat=juwelary" className="px-4 py-3 hover:bg-primary/5 hover:text-primary transition-colors text-sm font-medium border-b border-gray-50">{t("গহনা", "Juwelary")}</Link>
               <Link href="/shop?cat=cosmetics" className="px-4 py-3 hover:bg-primary/5 hover:text-primary transition-colors text-sm font-medium border-b border-gray-50">{t("কসমেটিকস", "Cosmetics")}</Link>
               <Link href="/shop?cat=bag" className="px-4 py-3 hover:bg-primary/5 hover:text-primary transition-colors text-sm font-medium">{t("ব্যাগ", "Bag")}</Link>
            </div>
          </div>
          <Link
            href="/about"
            className="logo-nav-link text-on-surface-variant font-label-md text-label-md"
          >
            {t("আমাদের সম্পর্কে", "About Us")}
          </Link>
          <Link
            href="/contact"
            className="logo-nav-link text-on-surface-variant font-label-md text-label-md"
          >
            {t("যোগাযোগ", "Contact")}
          </Link>

        </nav>

        <div className="flex items-center gap-4 text-primary">
          {/* Language Selector */}
          <button
            onClick={() => setLanguage(language === "bn" ? "en" : "bn")}
            className="text-xs font-bold border border-primary/30 rounded-lg px-2.5 py-1 text-primary hover:bg-primary/10 transition-colors btn-press cursor-pointer hover-lift"
          >
            {language === "bn" ? "EN" : "বাংলা"}
          </button>

          {/* Search Toggle */}
          <div className="relative flex items-center">
            {showSearch && (
              <input
                type="text"
                placeholder={t("পণ্য খুঁজুন...", "Search products...")}
                className="absolute right-10 bg-surface border border-outline-variant rounded-full px-4 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary w-48 transition-all"
              />
            )}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="scale-95 active:scale-90 transition-transform hover:text-primary-dark transition-colors duration-200 cursor-pointer"
            >
              <Search className="align-middle" />
            </button>
          </div>

          {/* Cart Button */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors text-primary btn-press cursor-pointer shadow-soft hover-lift"
          >
            <ShoppingCart className="align-middle" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] h-[16px] flex items-center justify-center animate-pulse">
                {language === "bn"
                  ? cartCount.toLocaleString("bn-BD")
                  : cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Mobile Hamburger Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-black/50 transition-opacity" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="absolute top-0 left-0 w-64 h-full bg-surface shadow-lg flex flex-col p-5 animate-slide-in-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 border-b border-outline-variant pb-3">
              <span className="font-bold text-primary font-headline-sm text-lg">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-on-surface-variant hover:text-primary">
                <X />
              </button>
            </div>
            <nav className="flex flex-col gap-5">
              <Link href="/" className="text-on-surface font-bold text-[15px] flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                <Home className="text-primary text-[20px]" />
                {t("হোম", "Home")}
              </Link>
              <div className="flex flex-col">
                <div 
                  className="flex items-center justify-between text-on-surface font-bold text-[15px] cursor-pointer" 
                  onClick={() => setIsShopExpanded(!isShopExpanded)}
                >
                  <div className="flex items-center gap-3" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); router.push('/shop'); }}>
                    <Store className="text-primary text-[20px]" />
                    {t("শপ", "Shop")}
                  </div>
                  <ChevronDown className={`transition-transform duration-300 w-5 h-5 ${isShopExpanded ? 'rotate-180 text-primary' : 'text-muted'}`} />
                </div>
                
                {/* Expanded Categories */}
                <div className={`overflow-hidden transition-all duration-300 ${isShopExpanded ? 'max-h-64 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                  <div className="flex flex-col ml-8 gap-4 border-l-2 border-primary/20 pl-4 py-1">
                     <Link href="/shop" className="text-on-surface-variant font-medium text-[14px] hover:text-primary" onClick={() => setIsMenuOpen(false)}>{t("সব পণ্য", "All Products")}</Link>
                     <Link href="/shop?cat=makeup" className="text-on-surface-variant font-medium text-[14px] hover:text-primary" onClick={() => setIsMenuOpen(false)}>{t("মেকআপ", "Makeup")}</Link>
                     <Link href="/shop?cat=juwelary" className="text-on-surface-variant font-medium text-[14px] hover:text-primary" onClick={() => setIsMenuOpen(false)}>{t("গহনা", "Juwelary")}</Link>
                     <Link href="/shop?cat=cosmetics" className="text-on-surface-variant font-medium text-[14px] hover:text-primary" onClick={() => setIsMenuOpen(false)}>{t("কসমেটিকস", "Cosmetics")}</Link>
                     <Link href="/shop?cat=bag" className="text-on-surface-variant font-medium text-[14px] hover:text-primary" onClick={() => setIsMenuOpen(false)}>{t("ব্যাগ", "Bag")}</Link>
                  </div>
                </div>
              </div>
              <Link href="/about" className="text-on-surface font-bold text-[15px] flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                <Info className="text-primary text-[20px]" />
                {t("আমাদের সম্পর্কে", "About Us")}
              </Link>
              <Link href="/contact" className="text-on-surface font-bold text-[15px] flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                <MessageCircle className="text-primary text-[20px]" />
                {t("যোগাযোগ", "Contact")}
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation (Dark background, white text, Home/Shop/Cart/Contact from left) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200/50 flex justify-around items-center pt-2 pb-[calc(env(safe-area-inset-bottom)+8px)] z-[99999] shadow-[0_-4px_25px_rgba(0,0,0,0.08)]" style={{ position: "fixed", bottom: 0, left: 0, right: 0, WebkitTransform: "translateZ(0)", transform: "translateZ(0)" }}>
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] gap-1 text-[10px] font-semibold transition-all duration-150 active:scale-[0.92] select-none ${
            isActive("/") ? "text-[#ff6600]" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Home size={22} className={isActive("/") ? "fill-current" : ""} />
          <span>{t("হোম", "Home")}</span>
        </Link>

        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] gap-1 text-[10px] font-semibold transition-all duration-150 active:scale-[0.92] select-none ${
            isActive("/shop") ? "text-[#ff6600]" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Store size={22} className={isActive("/shop") ? "fill-current" : ""} />
          <span>{t("শপ", "Shop")}</span>
        </Link>

        <Link
          href="/cart"
          className={`relative flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] gap-1 text-[10px] font-semibold transition-all duration-150 active:scale-[0.92] select-none ${
            isActive("/cart") ? "text-[#ff6600]" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <ShoppingCart size={22} className={isActive("/cart") ? "fill-current" : ""} />
          {cartCount > 0 && (
            <span className="absolute top-0 right-[25%] bg-[#ff6600] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {language === "bn" ? cartCount.toLocaleString("bn-BD") : cartCount}
            </span>
          )}
          <span>{t("কার্ট", "Cart")}</span>
        </Link>

        <Link
          href="/contact"
          className={`flex flex-col items-center justify-center flex-1 py-1 min-h-[44px] gap-1 text-[10px] font-semibold transition-all duration-150 active:scale-[0.92] select-none ${
            isActive("/contact") ? "text-[#ff6600]" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <MessageCircle size={22} className={isActive("/contact") ? "fill-current" : ""} />
          <span>{t("যোগাযোগ", "Contact")}</span>
        </Link>
      </nav>
    </>
  );
};
