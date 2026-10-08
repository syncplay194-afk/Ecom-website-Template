"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Phone, Mail, MapPin, Facebook, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useApp();

  return (
    <footer className="w-full mt-auto py-12 px-margin-mobile md:px-margin-desktop bg-[#111827] text-gray-400">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center gap-2.5 mb-8">
          <Link href="/" className="flex items-center shrink-0">
            <img
              src="/ecom_logo.jpg"
              alt="Ecom Shop Logo"
              className="w-[50px] h-[50px] object-contain rounded-lg bg-white p-0.5 shrink-0"
            />
          </Link>
          <div>
            <div className="text-white font-bold text-xl">Ecom Shop</div>
            <div className="text-gray-400 text-sm">
              {t("আপনার বিশ্বস্ত শপ | Since 2024", "Your Trusted Shop | Since 2024")}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-white font-semibold text-base mb-4">{t("দ্রুত লিঙ্ক", "Quick Links")}</div>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm hover:text-white transition-colors">
                  {t("আমাদের সম্পর্কে", "About Us")}
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors">
                  {t("ক্যারিয়ার", "Careers")}
                </a>
              </li>
              <li>
                <Link href="/shop" className="text-sm hover:text-white transition-colors">
                  {t("আজকের অফার", "Today's Offer")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition-colors">
                  {t("যোগাযোগ করুন", "Contact Us")}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-sm hover:text-white transition-colors text-primary font-semibold">
                  {t("এডমিন", "Admin")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-white font-semibold text-base mb-4">{t("গ্রাহক সেবা", "Customer Service")}</div>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-sm hover:text-white transition-colors">
                  {t("শর্তাবলী", "Terms & Conditions")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                  {t("গোপনীয়তা নীতি", "Privacy Policy")}
                </Link>
              </li>
              <li>
                <Link href="/return" className="text-sm hover:text-white transition-colors">
                  {t("রিটার্ন পলিসি", "Return Policy")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-2 rounded-2xl p-6 bg-[#1F2937]">
            <div className="text-white text-base font-semibold mb-4">{t("যোগাযোগ করুন", "Contact Us")}</div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Phone className="text-primary text-base w-5 text-center" />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">+1 234 567 890</a>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Mail className="text-primary text-base w-5 text-center" />
                <span>info@ecomshop.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <MapPin className="text-primary text-base w-5 text-center" />
                <span>{t("১২৩ মক স্ট্রিট, ঢাকা, বাংলাদেশ", "123 Mock Street, Dhaka, Bangladesh")}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <span className="text-gray-400 text-sm">{t("ফলো করুন:", "Follow us:")}</span>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center hover:scale-110 transition-transform btn-press cursor-pointer"
              >
                <Facebook className="text-white text-sm" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center hover:scale-110 transition-transform btn-press cursor-pointer"
              >
                <MessageCircle className="text-white text-[18px]" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 border-[#374151]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm">
              © {t("২০২৪ Ecom Shop. সর্বস্বত্ব সংরক্ষিত।", "2024 Ecom Shop. All rights reserved.")}
            </div>
            <div className="text-sm">
              {t("Made with ❤️ for you", "Made with ❤️ for you")}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
