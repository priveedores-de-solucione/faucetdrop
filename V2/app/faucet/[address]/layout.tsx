import type React from "react"
import type { Metadata } from "next"

const API_BASE_URL  = "https://faucetdrops-backend.onrender.com"
const SITE_URL      = "https://app.faucetdrops.io"
const DEFAULT_IMAGE = "/og-image.png"

// Accepts a faucet slug or a raw 0x address
async function fetchFaucet(param: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/faucet/slug/${param}`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const row = await res.json()
    return row?.faucet_address ? row : null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
  const p     = await params
  const param = String(p.address ?? Object.values(p)[0])

  const faucet = await fetchFaucet(encodeURIComponent(param))
  if (!faucet) return {} // falls back to the site default preview

  const name        = faucet.faucet_name || "Faucet"
  const title       = `${name} | FaucetDrops Faucet`
  const description = (
    faucet.description ||
    `Claim ${faucet.token_symbol || "tokens"} on ${faucet.network_name || "FaucetDrops"} from the ${name} faucet.`
  ).slice(0, 200)
  const url = `${SITE_URL}/faucet/${faucet.slug || param}`

  // Use the faucet's own image; fall back to the site image
  const img   = faucet.image_url as string | undefined
  const image = img && img.startsWith("http") ? img : DEFAULT_IMAGE

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: "FaucetDrops",
      title,
      description,
      images: [{ url: image, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

export default function FaucetLayout({ children }: { children: React.ReactNode }) {
  return children
}