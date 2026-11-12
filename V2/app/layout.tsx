import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProviders } from "@/components/app-providers"

const inter = Inter({ subsets: ["latin"] })

const SITE_URL    = "https://app.faucetdrops.io"
const TITLE       = "FaucetDrops - The all-in-one stack for your Web3 User Growth, Engagement and Token Distribution"
const DESCRIPTION = "The all-in-one stack for your Web3 User Growth, Engagement and Token Distribution 💧. Distribute rewards effortlessly across multiple chains."
const OG_IMAGE    = "/og-image.png" // your designed image in /public (1200×630)

// Default preview for every page. Pages with their own image override this
// through generateMetadata (see app/quest/[slug]/layout.tsx).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "token drops", "crypto faucet", "onchain rewards",
    "web3 engagement", "token distribution", "blockchain rewards",
  ],
  authors: [{ name: "FaucetDrops" }],
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "FaucetDrops",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  other: {
    "talentapp:project_verification":
      "98f7ce94c39130cef543fae892959918754270dff34594b8d7a129a75b6e2b6f052016215082a0071b59805b26c86d58ae8dec2460ee57a9652ab98f089e8461",
  },
}

export const viewport: Viewport = {
  themeColor: "#020817",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}