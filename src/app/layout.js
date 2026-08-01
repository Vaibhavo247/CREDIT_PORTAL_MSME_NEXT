import { Krub } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const krub = Krub({
  variable: "--font-krub",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata = {
  title: {
    template: "%s | Suryoday MSME Portal",
    default: "Suryoday MSME Portal",
  },
  description: "Official Suryoday Bank portal for managing and disbursing MSME loans.",
  robots: "noindex, nofollow",
};

export const viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${krub.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
