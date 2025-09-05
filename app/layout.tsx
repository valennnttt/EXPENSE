import "./globals.css";
import type { Metadata } from "next";
import { MotionProvider } from "app/motion-provider";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Simple personal expense tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <MotionProvider>{children}</MotionProvider>
        </div>
      </body>
    </html>
  );
}
