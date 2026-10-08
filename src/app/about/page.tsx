"use client";

import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { Store, Truck } from 'lucide-react';

export default function AboutPage() {
  const { t } = useApp();

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen flex flex-col antialiased overflow-hidden">
      <Header />
      
      <main className="flex-grow w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24 flex flex-col items-center justify-center">
        
        {/* Beautiful Hero Card with Gradients & Glassmorphism */}
        <div className="relative w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-white border border-outline-variant/30 hover-lift group transition-all duration-500">
          
          {/* Background Decorative Blobs */}
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-gradient-orange rounded-full mix-blend-multiply filter blur-[80px] opacity-[0.15] animate-pulse transition-opacity duration-1000"></div>
          <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-gradient-green rounded-full mix-blend-multiply filter blur-[80px] opacity-[0.15] animate-pulse transition-opacity duration-1000" style={{ animationDelay: "1.5s" }}></div>
          <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-blue-300 rounded-full mix-blend-multiply filter blur-[60px] opacity-[0.15] animate-pulse transition-opacity duration-1000" style={{ animationDelay: "0.5s" }}></div>
          
          <div className="relative z-10 p-10 md:p-20 flex flex-col items-center text-center">
            
            {/* Animated Icon Banner */}
            <div className="flex gap-5 mb-10">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-500 shadow-sm border border-primary/20">
                <Store className="text-primary text-[32px]" />
              </div>
              <div className="w-16 h-16 rounded-full bg-secondary-container/20 flex items-center justify-center group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-500 delay-[50ms] shadow-sm border border-secondary-container/30">
                <Truck className="text-accent text-[32px]" />
              </div>
              <div className="w-16 h-16 rounded-full bg-[#003366]/10 flex items-center justify-center group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-500 delay-[100ms] shadow-sm border border-[#003366]/20">
                <span className="material-symbols-outlined text-[#003366] text-[32px]">verified</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-[36px] md:text-[52px] font-bold text-[#003366] mb-8 tracking-tight font-tiro drop-shadow-sm">
              {t("আমাদের সম্পর্কে", "About Us")}
            </h1>
            
            <div className="w-20 h-1.5 bg-gradient-orange rounded-full mb-10 group-hover:w-32 transition-all duration-700 ease-out"></div>

            {/* Content Text */}
            <p className="font-body-lg text-xl md:text-2xl text-on-surface-variant leading-relaxed max-w-3xl font-medium">
              {t(
                "পুরান ঢাকার ঐতিহ্যবাহী পরিবেশ থেকে আমরা আপনার জন্য নিয়ে আসছি প্রিমিয়াম কসমেটিকস, গহনা, মেকআপ এবং এক্সক্লুসিভ ব্যাগ কালেকশন। খাঁটি মানের পণ্য, সাশ্রয়ী মূল্য এবং আমাদের ঐতিহ্যবাহী আতিথেয়তা ও সেবাই আমাদের প্রধান অঙ্গীকার।",
                "From the traditional vibes of Old Dhaka, we bring you premium cosmetics, jewelry, makeup, and exclusive bag collections. Authentic quality, affordable prices, and our traditional hospitality and service are our primary commitments."
              )}
            </p>
            
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
