import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "Ecom Shop",
  description: "Ecom Shop | Premium e-commerce online shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;500;600;700&family=Noto+Serif:ital,wght@0,100..900;1,100..900&family=Tiro+Bangla:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased overflow-x-hidden">
        <AppProvider>
          {children}
        </AppProvider>
        
        {/* Unregister old PWA Service Worker to fix cache crash issues */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister().then(function(boolean) {
                      console.log('Old Service Worker unregistered to prevent fetch crashes');
                    });
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
