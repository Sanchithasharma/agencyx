import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link'


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};


export default function RootLayout({

  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-brown-900 p-4">
          <div className="container mx-auto flex justify-between items-center">

            <a href="#" className="text-white text-lg font-semibold">Intellitag</a>


            <div className="space-x-4">
              {/* <a href="/" className="text-white">Search</a>
              <a href="/history" className="text-white">History</a> */}

              <Link href="/" className="text-white">Search</Link>
              <Link href="/history" className="text-white">History</Link>

            </div>
          </div>
        </nav>
      </body>
      <body className={inter.className}>{children}</body>


    </html>
  );
}
