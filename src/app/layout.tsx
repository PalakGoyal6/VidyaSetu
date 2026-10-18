import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VidyaSetu - विद्यासेतु | AI-Powered Learning to Livelihood Platform",
  description: "An inclusive, AI-powered education and career platform for rural India students. Discover your potential, learn with AI, and connect to opportunities in your own language.",
  keywords: "rural India education, AI career guidance, skill development, vocational training, scholarship finder",
  openGraph: {
    title: "VidyaSetu - Bridge of Knowledge",
    description: "AI-powered learning to livelihood platform for rural India",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
